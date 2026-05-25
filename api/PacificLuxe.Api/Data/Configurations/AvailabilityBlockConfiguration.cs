using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using PacificLuxe.Api.Entities;

namespace PacificLuxe.Api.Data.Configurations;

public class AvailabilityBlockConfiguration : IEntityTypeConfiguration<AvailabilityBlock>
{
    public void Configure(EntityTypeBuilder<AvailabilityBlock> builder)
    {
        builder.ToTable("availability_blocks");

        builder.HasKey(e => e.Id);

        builder.Property(e => e.Id).HasColumnName("id");
        builder.Property(e => e.VehicleId).HasColumnName("vehicle_id");
        builder.Property(e => e.StartDateUtc).HasColumnName("start_date_utc");
        builder.Property(e => e.EndDateUtc).HasColumnName("end_date_utc");
        builder.Property(e => e.Reason).HasColumnName("reason").HasMaxLength(200).IsRequired();
        builder.Property(e => e.Notes).HasColumnName("notes");
        builder.Property(e => e.CreatedAtUtc).HasColumnName("created_at_utc");
        builder.Property(e => e.UpdatedAtUtc).HasColumnName("updated_at_utc");

        builder.HasOne(e => e.Vehicle)
            .WithMany(v => v.AvailabilityBlocks)
            .HasForeignKey(e => e.VehicleId)
            .OnDelete(DeleteBehavior.Cascade);

        builder.HasIndex(e => e.VehicleId);
        builder.HasIndex(e => e.StartDateUtc);
        builder.HasIndex(e => e.EndDateUtc);
    }
}
