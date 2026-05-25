using System;
using Microsoft.EntityFrameworkCore.Infrastructure;
using Microsoft.EntityFrameworkCore.Migrations;
using PacificLuxe.Api.Data;

#nullable disable

namespace PacificLuxe.Api.Migrations
{
    /// <inheritdoc />
    /// <remarks>
    /// [Migration] is required so EF Core discovers this migration and orders it before 202603* migrations.
    /// Without it, <see cref="AddDriverDocuments"/> could run first and fail (FK to reservations).
    /// </remarks>
    [DbContext(typeof(AppDbContext))]
    [Migration("20250320010000_InitialCreate")]
    public class InitialCreate : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.CreateTable(
                name: "vehicles",
                columns: table => new
                {
                    id = table.Column<Guid>(type: "uuid", nullable: false),
                    slug = table.Column<string>(maxLength: 200, nullable: false),
                    display_name = table.Column<string>(maxLength: 200, nullable: false),
                    year = table.Column<int>(nullable: false),
                    make = table.Column<string>(maxLength: 100, nullable: false),
                    model = table.Column<string>(maxLength: 100, nullable: false),
                    trim = table.Column<string>(maxLength: 100, nullable: true),
                    daily_rate = table.Column<decimal>(nullable: false),
                    included_miles_per_day = table.Column<int>(nullable: false),
                    location_city = table.Column<string>(maxLength: 100, nullable: false),
                    status = table.Column<string>(maxLength: 20, nullable: false),
                    description = table.Column<string>(nullable: false),
                    hero_image = table.Column<string>(maxLength: 500, nullable: true),
                    created_at_utc = table.Column<DateTime>(nullable: false),
                    updated_at_utc = table.Column<DateTime>(nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_vehicles", x => x.id);
                });

            migrationBuilder.CreateIndex(
                name: "IX_vehicles_slug",
                table: "vehicles",
                column: "slug",
                unique: true);

            migrationBuilder.CreateIndex(
                name: "IX_vehicles_status",
                table: "vehicles",
                column: "status");

            migrationBuilder.CreateTable(
                name: "availability_blocks",
                columns: table => new
                {
                    id = table.Column<Guid>(type: "uuid", nullable: false),
                    vehicle_id = table.Column<Guid>(type: "uuid", nullable: false),
                    start_date_utc = table.Column<DateOnly>(nullable: false),
                    end_date_utc = table.Column<DateOnly>(nullable: false),
                    reason = table.Column<string>(maxLength: 200, nullable: false),
                    notes = table.Column<string>(nullable: true),
                    created_at_utc = table.Column<DateTime>(nullable: false),
                    updated_at_utc = table.Column<DateTime>(nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_availability_blocks", x => x.id);
                    table.ForeignKey(
                        name: "FK_availability_blocks_vehicles_vehicle_id",
                        column: x => x.vehicle_id,
                        principalTable: "vehicles",
                        principalColumn: "id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateIndex(
                name: "IX_availability_blocks_vehicle_id",
                table: "availability_blocks",
                column: "vehicle_id");

            migrationBuilder.CreateIndex(
                name: "IX_availability_blocks_start_date_utc",
                table: "availability_blocks",
                column: "start_date_utc");

            migrationBuilder.CreateIndex(
                name: "IX_availability_blocks_end_date_utc",
                table: "availability_blocks",
                column: "end_date_utc");

            migrationBuilder.CreateTable(
                name: "reservations",
                columns: table => new
                {
                    id = table.Column<Guid>(type: "uuid", nullable: false),
                    vehicle_id = table.Column<Guid>(type: "uuid", nullable: false),
                    renter_name = table.Column<string>(maxLength: 200, nullable: false),
                    renter_email = table.Column<string>(maxLength: 320, nullable: false),
                    renter_phone = table.Column<string>(maxLength: 30, nullable: false),
                    start_date_utc = table.Column<DateOnly>(nullable: false),
                    end_date_utc = table.Column<DateOnly>(nullable: false),
                    pickup_preference = table.Column<string>(maxLength: 30, nullable: false),
                    driver_age = table.Column<int>(nullable: false),
                    notes = table.Column<string>(nullable: false),
                    status = table.Column<string>(maxLength: 30, nullable: false),
                    created_at_utc = table.Column<DateTime>(nullable: false),
                    updated_at_utc = table.Column<DateTime>(nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_reservations", x => x.id);
                    table.ForeignKey(
                        name: "FK_reservations_vehicles_vehicle_id",
                        column: x => x.vehicle_id,
                        principalTable: "vehicles",
                        principalColumn: "id",
                        onDelete: ReferentialAction.Restrict);
                });

            migrationBuilder.CreateIndex(
                name: "IX_reservations_vehicle_id",
                table: "reservations",
                column: "vehicle_id");

            migrationBuilder.CreateIndex(
                name: "IX_reservations_start_date_utc",
                table: "reservations",
                column: "start_date_utc");

            migrationBuilder.CreateIndex(
                name: "IX_reservations_end_date_utc",
                table: "reservations",
                column: "end_date_utc");

            migrationBuilder.CreateIndex(
                name: "IX_reservations_status",
                table: "reservations",
                column: "status");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(name: "availability_blocks");
            migrationBuilder.DropTable(name: "reservations");
            migrationBuilder.DropTable(name: "vehicles");
        }
    }
}
