using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using PacificLuxe.Api.Entities;

namespace PacificLuxe.Api.Data.Configurations;

public class PickupChecklistConfiguration : IEntityTypeConfiguration<PickupChecklist>
{
    public void Configure(EntityTypeBuilder<PickupChecklist> builder)
    {
        builder.ToTable("pickup_checklists");

        builder.HasKey(e => e.Id);

        builder.Property(e => e.Id).HasColumnName("id");
        builder.Property(e => e.ReservationId).HasColumnName("reservation_id");
        builder.Property(e => e.OdometerOut).HasColumnName("odometer_out");
        builder.Property(e => e.FuelOrChargeOutPercent).HasColumnName("fuel_or_charge_out_percent");
        builder.Property(e => e.ConditionNotes).HasColumnName("condition_notes").HasMaxLength(4000);
        builder.Property(e => e.CompletedAtUtc).HasColumnName("completed_at_utc");
        builder.Property(e => e.CompletedBy).HasColumnName("completed_by").HasMaxLength(200).IsRequired();
        builder.Property(e => e.CreatedAtUtc).HasColumnName("created_at_utc");
        builder.Property(e => e.UpdatedAtUtc).HasColumnName("updated_at_utc");

        builder.HasOne(e => e.Reservation)
            .WithOne(r => r.PickupChecklist)
            .HasForeignKey<PickupChecklist>(e => e.ReservationId)
            .OnDelete(DeleteBehavior.Cascade);

        builder.HasIndex(e => e.ReservationId).IsUnique();
    }
}
