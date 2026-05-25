using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using PacificLuxe.Api.Entities;

namespace PacificLuxe.Api.Data.Configurations;

public class DriverDocumentConfiguration : IEntityTypeConfiguration<DriverDocument>
{
    public void Configure(EntityTypeBuilder<DriverDocument> builder)
    {
        builder.ToTable("driver_documents");

        builder.HasKey(e => e.Id);

        builder.Property(e => e.Id).HasColumnName("id");
        builder.Property(e => e.ReservationId).HasColumnName("reservation_id");
        builder.Property(e => e.DocumentType).HasColumnName("document_type").HasConversion<string>().HasMaxLength(30);
        builder.Property(e => e.Status).HasColumnName("status").HasConversion<string>().HasMaxLength(30);
        builder.Property(e => e.OriginalFileName).HasColumnName("original_file_name").HasMaxLength(500).IsRequired();
        builder.Property(e => e.ContentType).HasColumnName("content_type").HasMaxLength(200).IsRequired();
        builder.Property(e => e.SizeBytes).HasColumnName("size_bytes");
        builder.Property(e => e.StorageKey).HasColumnName("storage_key").HasMaxLength(1000).IsRequired();
        builder.Property(e => e.ReviewNote).HasColumnName("review_note").HasMaxLength(2000);
        builder.Property(e => e.ReviewedAtUtc).HasColumnName("reviewed_at_utc");
        builder.Property(e => e.CreatedAtUtc).HasColumnName("created_at_utc");
        builder.Property(e => e.UpdatedAtUtc).HasColumnName("updated_at_utc");

        builder.HasIndex(e => e.ReservationId);
        builder.HasIndex(e => e.Status);
        builder.HasIndex(e => new { e.ReservationId, e.DocumentType }).IsUnique();

        builder.HasOne(e => e.Reservation)
            .WithMany(r => r.DriverDocuments)
            .HasForeignKey(e => e.ReservationId)
            .OnDelete(DeleteBehavior.Cascade);
    }
}
