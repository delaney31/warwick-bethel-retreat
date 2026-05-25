using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using PacificLuxe.Api.Entities;

namespace PacificLuxe.Api.Data.Configurations;

public class ReservationConfiguration : IEntityTypeConfiguration<Reservation>
{
    public void Configure(EntityTypeBuilder<Reservation> builder)
    {
        builder.ToTable("reservations");

        builder.HasKey(e => e.Id);

        builder.Property(e => e.Id).HasColumnName("id");
        builder.Property(e => e.VehicleId).HasColumnName("vehicle_id");
        builder.Property(e => e.RenterName).HasColumnName("renter_name").HasMaxLength(200).IsRequired();
        builder.Property(e => e.RenterEmail).HasColumnName("renter_email").HasMaxLength(320).IsRequired();
        builder.Property(e => e.RenterPhone).HasColumnName("renter_phone").HasMaxLength(30);
        builder.Property(e => e.StartDateUtc).HasColumnName("start_date_utc");
        builder.Property(e => e.EndDateUtc).HasColumnName("end_date_utc");
        builder.Property(e => e.PickupPreference).HasColumnName("pickup_preference").HasConversion<string>().HasMaxLength(30);
        builder.Property(e => e.DriverAge).HasColumnName("driver_age");
        builder.Property(e => e.Notes).HasColumnName("notes");
        builder.Property(e => e.Status).HasColumnName("status").HasConversion<string>().HasMaxLength(30);
        builder.Property(e => e.CreatedAtUtc).HasColumnName("created_at_utc");
        builder.Property(e => e.UpdatedAtUtc).HasColumnName("updated_at_utc");

        builder.HasOne(e => e.Vehicle)
            .WithMany(v => v.Reservations)
            .HasForeignKey(e => e.VehicleId)
            .OnDelete(DeleteBehavior.Restrict);

        builder.HasIndex(e => e.VehicleId);
        builder.HasIndex(e => e.StartDateUtc);
        builder.HasIndex(e => e.EndDateUtc);
        builder.HasIndex(e => e.Status);
    }
}
