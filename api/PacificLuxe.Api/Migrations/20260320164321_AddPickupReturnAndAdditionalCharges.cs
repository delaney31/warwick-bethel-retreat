using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace PacificLuxe.Api.Migrations
{
    /// <inheritdoc />
    public partial class AddPickupReturnAndAdditionalCharges : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.CreateTable(
                name: "additional_charges",
                columns: table => new
                {
                    id = table.Column<Guid>(type: "uuid", nullable: false),
                    reservation_id = table.Column<Guid>(type: "uuid", nullable: false),
                    charge_type = table.Column<string>(type: "TEXT", maxLength: 30, nullable: false),
                    amount = table.Column<decimal>(precision: 18, scale: 2, nullable: false),
                    currency = table.Column<string>(type: "TEXT", maxLength: 10, nullable: false),
                    notes = table.Column<string>(type: "TEXT", maxLength: 2000, nullable: true),
                    created_at_utc = table.Column<DateTime>(nullable: false),
                    updated_at_utc = table.Column<DateTime>(nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_additional_charges", x => x.id);
                    table.ForeignKey(
                        name: "FK_additional_charges_reservations_reservation_id",
                        column: x => x.reservation_id,
                        principalTable: "reservations",
                        principalColumn: "id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "pickup_checklists",
                columns: table => new
                {
                    id = table.Column<Guid>(type: "uuid", nullable: false),
                    reservation_id = table.Column<Guid>(type: "uuid", nullable: false),
                    odometer_out = table.Column<int>(type: "INTEGER", nullable: false),
                    fuel_or_charge_out_percent = table.Column<int>(type: "INTEGER", nullable: false),
                    condition_notes = table.Column<string>(type: "TEXT", maxLength: 4000, nullable: true),
                    completed_at_utc = table.Column<DateTime>(nullable: false),
                    completed_by = table.Column<string>(type: "TEXT", maxLength: 200, nullable: false),
                    created_at_utc = table.Column<DateTime>(nullable: false),
                    updated_at_utc = table.Column<DateTime>(nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_pickup_checklists", x => x.id);
                    table.ForeignKey(
                        name: "FK_pickup_checklists_reservations_reservation_id",
                        column: x => x.reservation_id,
                        principalTable: "reservations",
                        principalColumn: "id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "return_checklists",
                columns: table => new
                {
                    id = table.Column<Guid>(type: "uuid", nullable: false),
                    reservation_id = table.Column<Guid>(type: "uuid", nullable: false),
                    odometer_in = table.Column<int>(type: "INTEGER", nullable: false),
                    fuel_or_charge_in_percent = table.Column<int>(type: "INTEGER", nullable: false),
                    condition_notes = table.Column<string>(type: "TEXT", maxLength: 4000, nullable: true),
                    completed_at_utc = table.Column<DateTime>(nullable: false),
                    completed_by = table.Column<string>(type: "TEXT", maxLength: 200, nullable: false),
                    created_at_utc = table.Column<DateTime>(nullable: false),
                    updated_at_utc = table.Column<DateTime>(nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_return_checklists", x => x.id);
                    table.ForeignKey(
                        name: "FK_return_checklists_reservations_reservation_id",
                        column: x => x.reservation_id,
                        principalTable: "reservations",
                        principalColumn: "id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateIndex(
                name: "IX_additional_charges_reservation_id",
                table: "additional_charges",
                column: "reservation_id");

            migrationBuilder.CreateIndex(
                name: "IX_pickup_checklists_reservation_id",
                table: "pickup_checklists",
                column: "reservation_id",
                unique: true);

            migrationBuilder.CreateIndex(
                name: "IX_return_checklists_reservation_id",
                table: "return_checklists",
                column: "reservation_id",
                unique: true);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "additional_charges");

            migrationBuilder.DropTable(
                name: "pickup_checklists");

            migrationBuilder.DropTable(
                name: "return_checklists");
        }
    }
}
