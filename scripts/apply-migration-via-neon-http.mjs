/**
 * Apply Prisma migration over Neon HTTP (works when port 5432 is blocked).
 * Usage: DATABASE_URL="postgresql://..." node scripts/apply-migration-via-neon-http.mjs
 */
import { readFileSync } from "fs";
import { join, dirname } from "path";
import { fileURLToPath } from "url";
import { createHash, randomUUID } from "crypto";
import { neon } from "@neondatabase/serverless";

const __dirname = dirname(fileURLToPath(import.meta.url));
const MIGRATION_NAME = "20260524120000_init_reservations";
const migrationDir = join(__dirname, "../prisma/migrations", MIGRATION_NAME);
const migrationSql = readFileSync(join(migrationDir, "migration.sql"), "utf8");
const checksum = createHash("sha256").update(migrationSql).digest("hex");

const url = process.env.DATABASE_URL?.trim();
if (!url) {
  console.error("DATABASE_URL is required.");
  process.exit(1);
}

const sql = neon(url);

const statements = migrationSql
  .split(";")
  .map((s) => s.trim())
  .filter(Boolean);

async function exec(statement) {
  await sql.query(statement);
}

async function run() {
  console.log("Applying migration via Neon HTTP:", MIGRATION_NAME);

  await exec(`
    CREATE TABLE IF NOT EXISTS "_prisma_migrations" (
      "id" VARCHAR(36) PRIMARY KEY NOT NULL,
      "checksum" VARCHAR(64) NOT NULL,
      "finished_at" TIMESTAMPTZ,
      "migration_name" VARCHAR(255) NOT NULL,
      "logs" TEXT,
      "rolled_back_at" TIMESTAMPTZ,
      "started_at" TIMESTAMPTZ NOT NULL DEFAULT now(),
      "applied_steps_count" INTEGER NOT NULL DEFAULT 0
    )
  `);

  const existing = await sql`
    SELECT migration_name FROM "_prisma_migrations"
    WHERE migration_name = ${MIGRATION_NAME}
    LIMIT 1
  `;

  if (existing.length > 0) {
    console.log("Migration already recorded — done.");
    return;
  }

  for (const statement of statements) {
    const preview = statement.slice(0, 70).replace(/\s+/g, " ");
    console.log("Running:", preview + "...");
    try {
      await exec(statement);
    } catch (err) {
      const msg = String(err?.message ?? err);
      if (msg.includes("already exists")) {
        console.log("  (already exists — ok)");
        continue;
      }
      throw err;
    }
  }

  await sql`
    INSERT INTO "_prisma_migrations" (
      "id", "checksum", "finished_at", "migration_name", "started_at", "applied_steps_count"
    ) VALUES (
      ${randomUUID()},
      ${checksum},
      now(),
      ${MIGRATION_NAME},
      now(),
      1
    )
  `;

  console.log("Migration applied successfully.");
}

run().catch((err) => {
  console.error("Migration failed:", err);
  process.exit(1);
});
