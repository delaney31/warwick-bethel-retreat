using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace PacificLuxe.Api.Migrations
{
    /// <summary>
    /// PostgreSQL on some hosts had admin_users.created_at_utc / updated_at_utc as <c>text</c>
    /// (e.g. schema drift), which causes Npgsql to throw when EF reads <see cref="DateTime"/>.
    /// </summary>
    public partial class FixAdminUsersTimestampColumns : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            // SQLite local dev: columns are already compatible with EF; skip.
            if (migrationBuilder.ActiveProvider?.Contains("Npgsql", StringComparison.Ordinal) != true)
                return;

            migrationBuilder.Sql(
                """
                DO $migration$
                BEGIN
                  IF EXISTS (
                    SELECT 1 FROM information_schema.columns
                    WHERE table_schema = 'public' AND table_name = 'admin_users'
                      AND column_name = 'created_at_utc' AND udt_name = 'text'
                  ) THEN
                    ALTER TABLE admin_users
                      ALTER COLUMN created_at_utc TYPE timestamptz USING created_at_utc::timestamptz;
                  END IF;
                  IF EXISTS (
                    SELECT 1 FROM information_schema.columns
                    WHERE table_schema = 'public' AND table_name = 'admin_users'
                      AND column_name = 'updated_at_utc' AND udt_name = 'text'
                  ) THEN
                    ALTER TABLE admin_users
                      ALTER COLUMN updated_at_utc TYPE timestamptz USING updated_at_utc::timestamptz;
                  END IF;
                END $migration$;
                """);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            // Non-reversible; reverting to text would break Npgsql DateTime mapping again.
        }
    }
}
