using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace PacificLuxe.Api.Migrations
{
    /// <inheritdoc />
    public partial class AddPayments : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.CreateTable(
                name: "payments",
                columns: table => new
                {
                    id = table.Column<Guid>(type: "uuid", nullable: false),
                    reservation_id = table.Column<Guid>(type: "uuid", nullable: false),
                    amount = table.Column<decimal>(precision: 18, scale: 2, nullable: false),
                    currency = table.Column<string>(type: "TEXT", maxLength: 10, nullable: false),
                    status = table.Column<string>(type: "TEXT", maxLength: 30, nullable: false),
                    label = table.Column<string>(type: "TEXT", maxLength: 200, nullable: true),
                    internal_notes = table.Column<string>(type: "TEXT", maxLength: 2000, nullable: true),
                    paid_at_utc = table.Column<DateTime>(nullable: true),
                    failed_at_utc = table.Column<DateTime>(nullable: true),
                    refunded_at_utc = table.Column<DateTime>(nullable: true),
                    external_payment_id = table.Column<string>(type: "TEXT", maxLength: 200, nullable: true),
                    external_checkout_session_id = table.Column<string>(type: "TEXT", maxLength: 200, nullable: true),
                    provider = table.Column<string>(type: "TEXT", maxLength: 50, nullable: true),
                    created_at_utc = table.Column<DateTime>(nullable: false),
                    updated_at_utc = table.Column<DateTime>(nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_payments", x => x.id);
                    table.ForeignKey(
                        name: "FK_payments_reservations_reservation_id",
                        column: x => x.reservation_id,
                        principalTable: "reservations",
                        principalColumn: "id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateIndex(
                name: "IX_payments_reservation_id",
                table: "payments",
                column: "reservation_id");

            migrationBuilder.CreateIndex(
                name: "IX_payments_status",
                table: "payments",
                column: "status");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "payments");
        }
    }
}
