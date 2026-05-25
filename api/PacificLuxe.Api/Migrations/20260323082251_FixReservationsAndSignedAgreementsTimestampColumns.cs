using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace PacificLuxe.Api.Migrations
{
    /// <summary>
    /// PostgreSQL on some hosts store UTC timestamps as <c>text</c> (schema drift / manual DDL).
    /// Npgsql then throws when EF reads DateTime fields.
    /// Aligns with <see cref="FixAdminUsersTimestampColumns"/>.
    /// </summary>
    public partial class FixReservationsAndSignedAgreementsTimestampColumns : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            if (migrationBuilder.ActiveProvider?.Contains("Npgsql", StringComparison.Ordinal) != true)
                return;

            // One DO block: alter each column only if it is still text (idempotent on re-run).
            migrationBuilder.Sql(
                """
                DO $migration$
                BEGIN
                  -- reservations
                  IF EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'reservations' AND column_name = 'created_at_utc' AND udt_name = 'text') THEN
                    ALTER TABLE reservations ALTER COLUMN created_at_utc TYPE timestamptz USING created_at_utc::timestamptz;
                  END IF;
                  IF EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'reservations' AND column_name = 'updated_at_utc' AND udt_name = 'text') THEN
                    ALTER TABLE reservations ALTER COLUMN updated_at_utc TYPE timestamptz USING updated_at_utc::timestamptz;
                  END IF;

                  -- signed_agreements (GET /agreement loads this join)
                  IF EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'signed_agreements' AND column_name = 'created_at_utc' AND udt_name = 'text') THEN
                    ALTER TABLE signed_agreements ALTER COLUMN created_at_utc TYPE timestamptz USING created_at_utc::timestamptz;
                  END IF;
                  IF EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'signed_agreements' AND column_name = 'updated_at_utc' AND udt_name = 'text') THEN
                    ALTER TABLE signed_agreements ALTER COLUMN updated_at_utc TYPE timestamptz USING updated_at_utc::timestamptz;
                  END IF;
                  IF EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'signed_agreements' AND column_name = 'sent_at_utc' AND udt_name = 'text') THEN
                    ALTER TABLE signed_agreements ALTER COLUMN sent_at_utc TYPE timestamptz USING (NULLIF(trim(sent_at_utc::text), '')::timestamptz);
                  END IF;
                  IF EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'signed_agreements' AND column_name = 'signed_at_utc' AND udt_name = 'text') THEN
                    ALTER TABLE signed_agreements ALTER COLUMN signed_at_utc TYPE timestamptz USING (NULLIF(trim(signed_at_utc::text), '')::timestamptz);
                  END IF;

                  -- vehicles (often joined with reservations)
                  IF EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'vehicles' AND column_name = 'created_at_utc' AND udt_name = 'text') THEN
                    ALTER TABLE vehicles ALTER COLUMN created_at_utc TYPE timestamptz USING created_at_utc::timestamptz;
                  END IF;
                  IF EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'vehicles' AND column_name = 'updated_at_utc' AND udt_name = 'text') THEN
                    ALTER TABLE vehicles ALTER COLUMN updated_at_utc TYPE timestamptz USING updated_at_utc::timestamptz;
                  END IF;

                  -- availability_blocks
                  IF EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'availability_blocks' AND column_name = 'created_at_utc' AND udt_name = 'text') THEN
                    ALTER TABLE availability_blocks ALTER COLUMN created_at_utc TYPE timestamptz USING created_at_utc::timestamptz;
                  END IF;
                  IF EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'availability_blocks' AND column_name = 'updated_at_utc' AND udt_name = 'text') THEN
                    ALTER TABLE availability_blocks ALTER COLUMN updated_at_utc TYPE timestamptz USING updated_at_utc::timestamptz;
                  END IF;

                  -- driver_documents
                  IF EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'driver_documents' AND column_name = 'created_at_utc' AND udt_name = 'text') THEN
                    ALTER TABLE driver_documents ALTER COLUMN created_at_utc TYPE timestamptz USING created_at_utc::timestamptz;
                  END IF;
                  IF EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'driver_documents' AND column_name = 'updated_at_utc' AND udt_name = 'text') THEN
                    ALTER TABLE driver_documents ALTER COLUMN updated_at_utc TYPE timestamptz USING updated_at_utc::timestamptz;
                  END IF;
                  IF EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'driver_documents' AND column_name = 'reviewed_at_utc' AND udt_name = 'text') THEN
                    ALTER TABLE driver_documents ALTER COLUMN reviewed_at_utc TYPE timestamptz USING (NULLIF(trim(reviewed_at_utc::text), '')::timestamptz);
                  END IF;

                  -- payments
                  IF EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'payments' AND column_name = 'created_at_utc' AND udt_name = 'text') THEN
                    ALTER TABLE payments ALTER COLUMN created_at_utc TYPE timestamptz USING created_at_utc::timestamptz;
                  END IF;
                  IF EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'payments' AND column_name = 'updated_at_utc' AND udt_name = 'text') THEN
                    ALTER TABLE payments ALTER COLUMN updated_at_utc TYPE timestamptz USING updated_at_utc::timestamptz;
                  END IF;
                  IF EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'payments' AND column_name = 'failed_at_utc' AND udt_name = 'text') THEN
                    ALTER TABLE payments ALTER COLUMN failed_at_utc TYPE timestamptz USING (NULLIF(trim(failed_at_utc::text), '')::timestamptz);
                  END IF;
                  IF EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'payments' AND column_name = 'paid_at_utc' AND udt_name = 'text') THEN
                    ALTER TABLE payments ALTER COLUMN paid_at_utc TYPE timestamptz USING (NULLIF(trim(paid_at_utc::text), '')::timestamptz);
                  END IF;
                  IF EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'payments' AND column_name = 'refunded_at_utc' AND udt_name = 'text') THEN
                    ALTER TABLE payments ALTER COLUMN refunded_at_utc TYPE timestamptz USING (NULLIF(trim(refunded_at_utc::text), '')::timestamptz);
                  END IF;

                  -- pickup_checklists
                  IF EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'pickup_checklists' AND column_name = 'completed_at_utc' AND udt_name = 'text') THEN
                    ALTER TABLE pickup_checklists ALTER COLUMN completed_at_utc TYPE timestamptz USING completed_at_utc::timestamptz;
                  END IF;
                  IF EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'pickup_checklists' AND column_name = 'created_at_utc' AND udt_name = 'text') THEN
                    ALTER TABLE pickup_checklists ALTER COLUMN created_at_utc TYPE timestamptz USING created_at_utc::timestamptz;
                  END IF;
                  IF EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'pickup_checklists' AND column_name = 'updated_at_utc' AND udt_name = 'text') THEN
                    ALTER TABLE pickup_checklists ALTER COLUMN updated_at_utc TYPE timestamptz USING updated_at_utc::timestamptz;
                  END IF;

                  -- return_checklists
                  IF EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'return_checklists' AND column_name = 'completed_at_utc' AND udt_name = 'text') THEN
                    ALTER TABLE return_checklists ALTER COLUMN completed_at_utc TYPE timestamptz USING completed_at_utc::timestamptz;
                  END IF;
                  IF EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'return_checklists' AND column_name = 'created_at_utc' AND udt_name = 'text') THEN
                    ALTER TABLE return_checklists ALTER COLUMN created_at_utc TYPE timestamptz USING created_at_utc::timestamptz;
                  END IF;
                  IF EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'return_checklists' AND column_name = 'updated_at_utc' AND udt_name = 'text') THEN
                    ALTER TABLE return_checklists ALTER COLUMN updated_at_utc TYPE timestamptz USING updated_at_utc::timestamptz;
                  END IF;

                  -- additional_charges
                  IF EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'additional_charges' AND column_name = 'created_at_utc' AND udt_name = 'text') THEN
                    ALTER TABLE additional_charges ALTER COLUMN created_at_utc TYPE timestamptz USING created_at_utc::timestamptz;
                  END IF;
                  IF EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'additional_charges' AND column_name = 'updated_at_utc' AND udt_name = 'text') THEN
                    ALTER TABLE additional_charges ALTER COLUMN updated_at_utc TYPE timestamptz USING updated_at_utc::timestamptz;
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
