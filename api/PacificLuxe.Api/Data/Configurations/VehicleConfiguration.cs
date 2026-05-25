using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using PacificLuxe.Api.Entities;

namespace PacificLuxe.Api.Data.Configurations;

public class VehicleConfiguration : IEntityTypeConfiguration<Vehicle>
{
    public void Configure(EntityTypeBuilder<Vehicle> builder)
    {
        builder.ToTable("vehicles");

        builder.HasKey(e => e.Id);

        builder.Property(e => e.Id).HasColumnName("id");
        builder.Property(e => e.Slug).HasColumnName("slug").HasMaxLength(200).IsRequired();
        builder.Property(e => e.DisplayName).HasColumnName("display_name").HasMaxLength(200).IsRequired();
        builder.Property(e => e.Year).HasColumnName("year");
        builder.Property(e => e.Make).HasColumnName("make").HasMaxLength(100).IsRequired();
        builder.Property(e => e.Model).HasColumnName("model").HasMaxLength(100).IsRequired();
        builder.Property(e => e.Trim).HasColumnName("trim").HasMaxLength(100);
        builder.Property(e => e.DailyRate).HasColumnName("daily_rate").HasPrecision(10, 2);
        builder.Property(e => e.IncludedMilesPerDay).HasColumnName("included_miles_per_day");
        builder.Property(e => e.LocationCity).HasColumnName("location_city").HasMaxLength(100).IsRequired();
        builder.Property(e => e.Status).HasColumnName("status").HasConversion<string>().HasMaxLength(20);
        builder.Property(e => e.Description).HasColumnName("description");
        builder.Property(e => e.HeroImage).HasColumnName("hero_image").HasMaxLength(500);
        builder.Property(e => e.CreatedAtUtc).HasColumnName("created_at_utc");
        builder.Property(e => e.UpdatedAtUtc).HasColumnName("updated_at_utc");

        builder.HasIndex(e => e.Slug).IsUnique();
        builder.HasIndex(e => e.Status);
    }
}
