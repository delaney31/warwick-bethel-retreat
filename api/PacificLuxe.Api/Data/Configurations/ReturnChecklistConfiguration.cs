using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using PacificLuxe.Api.Entities;

namespace PacificLuxe.Api.Data.Configurations;

public class ReturnChecklistConfiguration : IEntityTypeConfiguration<ReturnChecklist>
{
    public void Configure(EntityTypeBuilder<ReturnChecklist> builder)
    {
        builder.ToTable("return_checklists");

        builder.HasKey(e => e.Id);

        builder.Property(e => e.Id).HasColumnName("id");
        builder.Property(e => e.ReservationId).HasColumnName("reservation_id");
        builder.Property(e => e.OdometerIn).HasColumnName("odometer_in");
        builder.Property(e => e.FuelOrChargeInPercent).HasColumnName("fuel_or_charge_in_percent");
        builder.Property(e => e.ConditionNotes).HasColumnName("condition_notes").HasMaxLength(4000);
        builder.Property(e => e.CompletedAtUtc).HasColumnName("completed_at_utc");
        builder.Property(e => e.CompletedBy).HasColumnName("completed_by").HasMaxLength(200).IsRequired();
        builder.Property(e => e.CreatedAtUtc).HasColumnName("created_at_utc");
        builder.Property(e => e.UpdatedAtUtc).HasColumnName("updated_at_utc");

        builder.HasOne(e => e.Reservation)
            .WithOne(r => r.ReturnChecklist)
            .HasForeignKey<ReturnChecklist>(e => e.ReservationId)
            .OnDelete(DeleteBehavior.Cascade);

        builder.HasIndex(e => e.ReservationId).IsUnique();
    }
}
