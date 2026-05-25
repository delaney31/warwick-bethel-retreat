using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using PacificLuxe.Api.Entities;

namespace PacificLuxe.Api.Data.Configurations;

public class AdditionalChargeConfiguration : IEntityTypeConfiguration<AdditionalCharge>
{
    public void Configure(EntityTypeBuilder<AdditionalCharge> builder)
    {
        builder.ToTable("additional_charges");

        builder.HasKey(e => e.Id);

        builder.Property(e => e.Id).HasColumnName("id");
        builder.Property(e => e.ReservationId).HasColumnName("reservation_id");
        builder.Property(e => e.ChargeType).HasColumnName("charge_type").HasConversion<string>().HasMaxLength(30);
        builder.Property(e => e.Amount).HasColumnName("amount").HasPrecision(18, 2);
        builder.Property(e => e.Currency).HasColumnName("currency").HasMaxLength(10).IsRequired();
        builder.Property(e => e.Notes).HasColumnName("notes").HasMaxLength(2000);
        builder.Property(e => e.CreatedAtUtc).HasColumnName("created_at_utc");
        builder.Property(e => e.UpdatedAtUtc).HasColumnName("updated_at_utc");

        builder.HasOne(e => e.Reservation)
            .WithMany(r => r.AdditionalCharges)
            .HasForeignKey(e => e.ReservationId)
            .OnDelete(DeleteBehavior.Cascade);

        builder.HasIndex(e => e.ReservationId);
    }
}
