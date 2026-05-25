using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace PacificLuxe.Api.Migrations
{
    /// <inheritdoc />
    public partial class AddSignedAgreements : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.CreateTable(
                name: "signed_agreements",
                columns: table => new
                {
                    id = table.Column<Guid>(type: "uuid", nullable: false),
                    reservation_id = table.Column<Guid>(type: "uuid", nullable: false),
                    status = table.Column<string>(type: "TEXT", maxLength: 30, nullable: false),
                    sent_at_utc = table.Column<DateTime>(nullable: true),
                    signed_at_utc = table.Column<DateTime>(nullable: true),
                    template_key = table.Column<string>(type: "TEXT", maxLength: 200, nullable: true),
                    external_provider_id = table.Column<string>(type: "TEXT", maxLength: 500, nullable: true),
                    created_at_utc = table.Column<DateTime>(nullable: false),
                    updated_at_utc = table.Column<DateTime>(nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_signed_agreements", x => x.id);
                    table.ForeignKey(
                        name: "FK_signed_agreements_reservations_reservation_id",
                        column: x => x.reservation_id,
                        principalTable: "reservations",
                        principalColumn: "id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateIndex(
                name: "IX_signed_agreements_reservation_id",
                table: "signed_agreements",
                column: "reservation_id",
                unique: true);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "signed_agreements");
        }
    }
}
