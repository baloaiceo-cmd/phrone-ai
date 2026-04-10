export const ENV = {
  appId: process.env.VITE_APP_ID ?? "",
  cookieSecret: process.env.JWT_SECRET ?? "",
  databaseUrl: process.env.DATABASE_URL ?? "",
  oAuthServerUrl: process.env.OAUTH_SERVER_URL ?? "",
  ownerOpenId: process.env.OWNER_OPEN_ID ?? "",
  isProduction: process.env.NODE_ENV === "production",
  forgeApiUrl: process.env.BUILT_IN_FORGE_API_URL ?? "",
  forgeApiKey: process.env.BUILT_IN_FORGE_API_KEY ?? "",
};

/**
 * Validate critical environment variables at startup.
 * Logs warnings for missing vars so problems are caught early
 * instead of silently failing at runtime.
 */
export function validateEnv() {
  const warnings: string[] = [];

  if (!ENV.cookieSecret) {
    warnings.push("JWT_SECRET is not set — session tokens will be insecure");
  } else if (ENV.cookieSecret.length < 32) {
    warnings.push("JWT_SECRET is too short (< 32 chars) — consider using a stronger secret");
  }

  if (!ENV.databaseUrl) {
    warnings.push("DATABASE_URL is not set — database features will be unavailable");
  }

  if (!ENV.oAuthServerUrl) {
    warnings.push("OAUTH_SERVER_URL is not set — authentication will not work");
  }

  if (!ENV.appId) {
    warnings.push("VITE_APP_ID is not set — OAuth flow will not work");
  }

  for (const w of warnings) {
    console.warn(`[ENV] WARNING: ${w}`);
  }

  return warnings.length === 0;
}
