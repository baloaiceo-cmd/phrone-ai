# Vercel Build Output API Notes

- Output directory must be `.vercel/output/` (not `.vercel-output/`)
- Deploy with `vercel deploy --prebuilt` to skip build step and use pre-built output
- Serverless functions go in `.vercel/output/functions/`
- Each function needs `.vc-config.json` and optionally `package.json`
- Static files go in `.vercel/output/static/`
- Config goes in `.vercel/output/config.json`
- When using `--prebuilt`, Vercel will install dependencies from package.json in function dirs
- For native deps like mysql2, need to build on Linux x64 (which we are)

## Strategy
1. Build locally with `build-vercel.mjs` outputting to `.vercel/output/`
2. Deploy with `vercel deploy --prebuilt --token TOKEN`
3. This skips Vercel's build step entirely - we control the full build
