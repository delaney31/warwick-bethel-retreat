using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace PacificLuxe.Api.Migrations
{
    /// <inheritdoc />
    public partial class AddDriverDocuments : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.CreateTable(
                name: "driver_documents",
                columns: table => new
                {
                    id = table.Column<Guid>(type: "uuid", nullable: false),
                    reservation_id = table.Column<Guid>(type: "uuid", nullable: false),
                    document_type = table.Column<string>(type: "TEXT", maxLength: 30, nullable: false),
                    status = table.Column<string>(type: "TEXT", maxLength: 30, nullable: false),
                    original_file_name = table.Column<string>(type: "TEXT", maxLength: 500, nullable: false),
                    content_type = table.Column<string>(type: "TEXT", maxLength: 200, nullable: false),
                    size_bytes = table.Column<long>(type: "INTEGER", nullable: false),
                    storage_key = table.Column<string>(type: "TEXT", maxLength: 1000, nullable: false),
                    review_note = table.Column<string>(type: "TEXT", maxLength: 2000, nullable: true),
                    reviewed_at_utc = table.Column<DateTime>(nullable: true),
                    created_at_utc = table.Column<DateTime>(nullable: false),
                    updated_at_utc = table.Column<DateTime>(nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_driver_documents", x => x.id);
                    table.ForeignKey(
                        name: "FK_driver_documents_reservations_reservation_id",
                        column: x => x.reservation_id,
                        principalTable: "reservations",
                        principalColumn: "id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateIndex(
                name: "IX_driver_documents_reservation_id",
                table: "driver_documents",
                column: "reservation_id");

            migrationBuilder.CreateIndex(
                name: "IX_driver_documents_reservation_id_document_type",
                table: "driver_documents",
                columns: new[] { "reservation_id", "document_type" },
                unique: true);

            migrationBuilder.CreateIndex(
                name: "IX_driver_documents_status",
                table: "driver_documents",
                column: "status");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "driver_documents");
        }
    }
}
