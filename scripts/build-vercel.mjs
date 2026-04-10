/**
 * Build script for Vercel deployment.
 * Produces the Vercel Build Output API v3 format:
 * .vercel/output/
 *   config.json        — routing rules
 *   static/            — frontend assets (from vite build)
 *   functions/
 *     api/index.func/  — serverless function (bundled Express app)
 */

import { execSync } from "child_process";
import { mkdirSync, cpSync, writeFileSync, readFileSync, rmSync } from "fs";
import { join, resolve } from "path";

const ROOT = resolve(import.meta.dirname, "..");
const OUTPUT = join(ROOT, ".vercel", "output");

function run(cmd, opts = {}) {
  console.log(`> ${cmd}`);
  execSync(cmd, { cwd: opts.cwd || ROOT, stdio: "inherit" });
}

// Clean previous output
rmSync(OUTPUT, { recursive: true, force: true });

// Step 1: Build frontend with Vite
console.log("\n=== Building frontend ===");
run("npx vite build");

// Step 2: Bundle the API serverless function
console.log("\n=== Building API serverless function ===");
const funcDir = join(OUTPUT, "functions", "api", "index.func");
mkdirSync(funcDir, { recursive: true });

// Bundle api/index.ts with ALL dependencies included except mysql2 and dotenv
// mysql2 has native CJS requires that esbuild can't fully resolve
// Use banner to add createRequire shim so CJS modules can use require() for Node builtins
const banner = `import { createRequire } from 'module'; const require = createRequire(import.meta.url);`;
run(
  `npx esbuild api/index.ts --platform=node --bundle --format=esm --outfile=${join(funcDir, "index.mjs")} --alias:@shared=./shared --external:mysql2 --external:dotenv --banner:js="${banner}"`
);

// Step 2b: Install external dependencies in the function directory
console.log("\n=== Installing external dependencies ===");
const funcPkg = {
  name: "api-function",
  version: "1.0.0",
  type: "module",
  dependencies: {
    "mysql2": "^3.15.0",
    "dotenv": "^17.2.2",
  },
};
writeFileSync(join(funcDir, "package.json"), JSON.stringify(funcPkg, null, 2));

// Use npm install (not pnpm) to get a flat node_modules in the function dir
run("npm install --production --no-package-lock", { cwd: funcDir });

// Write the .vc-config.json for the serverless function
writeFileSync(
  join(funcDir, ".vc-config.json"),
  JSON.stringify(
    {
      runtime: "nodejs20.x",
      handler: "index.mjs",
      launcherType: "Nodejs",
      maxDuration: 30,
      supportsResponseStreaming: true,
    },
    null,
    2
  )
);

// Step 3: Copy static assets from dist/public to .vercel/output/static
console.log("\n=== Copying static assets ===");
const staticDir = join(OUTPUT, "static");
mkdirSync(staticDir, { recursive: true });
cpSync(join(ROOT, "dist", "public"), staticDir, { recursive: true });

// Step 4: Write the config.json with routing rules
console.log("\n=== Writing config.json ===");
writeFileSync(
  join(OUTPUT, "config.json"),
  JSON.stringify(
    {
      version: 3,
      routes: [
        // API routes → serverless function
        { src: "/api/(.*)", dest: "/api/index" },
        // Sitemap → serverless function
        { src: "/sitemap.xml", dest: "/api/index" },
        // Static assets (hashed filenames from Vite)
        {
          src: "/assets/(.*)",
          headers: { "Cache-Control": "public, max-age=31536000, immutable" },
          continue: true,
        },
        // SPA fallback: all non-file requests → index.html
        { handle: "filesystem" },
        { src: "/(.*)", dest: "/index.html" },
      ],
    },
    null,
    2
  )
);

console.log("\n=== Vercel Build Output ready ===");
