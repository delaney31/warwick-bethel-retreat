import "server-only";

export function isDatabaseConfigured(): boolean {
  return Boolean(process.env.DATABASE_URL?.trim());
}

export function isProductionRuntime(): boolean {
  return process.env.NODE_ENV === "production" || process.env.VERCEL === "1";
}

/** Throws when PostgreSQL is required but DATABASE_URL is missing. */
export function requireDatabase(): void {
  if (!isDatabaseConfigured()) {
    throw new Error(
      "DATABASE_URL is required. Set your PostgreSQL connection string (e.g. Neon) in the environment.",
    );
  }
}
