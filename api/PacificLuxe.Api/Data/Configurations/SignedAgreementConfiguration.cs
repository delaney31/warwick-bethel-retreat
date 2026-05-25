using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using PacificLuxe.Api.Entities;

namespace PacificLuxe.Api.Data.Configurations;

public class SignedAgreementConfiguration : IEntityTypeConfiguration<SignedAgreement>
{
    public void Configure(EntityTypeBuilder<SignedAgreement> builder)
    {
        builder.ToTable("signed_agreements");

        builder.HasKey(e => e.Id);

        builder.Property(e => e.Id).HasColumnName("id");
        builder.Property(e => e.ReservationId).HasColumnName("reservation_id");
        builder.Property(e => e.Status).HasColumnName("status").HasConversion<string>().HasMaxLength(30);
        builder.Property(e => e.SentAtUtc).HasColumnName("sent_at_utc");
        builder.Property(e => e.SignedAtUtc).HasColumnName("signed_at_utc");
        builder.Property(e => e.TemplateKey).HasColumnName("template_key").HasMaxLength(200);
        builder.Property(e => e.ExternalProviderId).HasColumnName("external_provider_id").HasMaxLength(500);
        builder.Property(e => e.CreatedAtUtc).HasColumnName("created_at_utc");
        builder.Property(e => e.UpdatedAtUtc).HasColumnName("updated_at_utc");

        builder.HasIndex(e => e.ReservationId).IsUnique();

        builder.HasOne(e => e.Reservation)
            .WithOne(r => r.Agreement)
            .HasForeignKey<SignedAgreement>(e => e.ReservationId)
            .OnDelete(DeleteBehavior.Cascade);
    }
}
