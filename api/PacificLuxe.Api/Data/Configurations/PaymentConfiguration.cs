using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using PacificLuxe.Api.Entities;

namespace PacificLuxe.Api.Data.Configurations;

public class PaymentConfiguration : IEntityTypeConfiguration<Payment>
{
    public void Configure(EntityTypeBuilder<Payment> builder)
    {
        builder.ToTable("payments");

        builder.HasKey(e => e.Id);

        builder.Property(e => e.Id).HasColumnName("id");
        builder.Property(e => e.ReservationId).HasColumnName("reservation_id");
        builder.Property(e => e.Amount).HasColumnName("amount").HasPrecision(18, 2);
        builder.Property(e => e.Currency).HasColumnName("currency").HasMaxLength(10).IsRequired();
        builder.Property(e => e.Status).HasColumnName("status").HasConversion<string>().HasMaxLength(30);
        builder.Property(e => e.Label).HasColumnName("label").HasMaxLength(200);
        builder.Property(e => e.InternalNotes).HasColumnName("internal_notes").HasMaxLength(2000);
        builder.Property(e => e.PaidAtUtc).HasColumnName("paid_at_utc");
        builder.Property(e => e.FailedAtUtc).HasColumnName("failed_at_utc");
        builder.Property(e => e.RefundedAtUtc).HasColumnName("refunded_at_utc");
        builder.Property(e => e.ExternalPaymentId).HasColumnName("external_payment_id").HasMaxLength(200);
        builder.Property(e => e.ExternalCheckoutSessionId).HasColumnName("external_checkout_session_id").HasMaxLength(200);
        builder.Property(e => e.Provider).HasColumnName("provider").HasMaxLength(50);
        builder.Property(e => e.CreatedAtUtc).HasColumnName("created_at_utc");
        builder.Property(e => e.UpdatedAtUtc).HasColumnName("updated_at_utc");

        builder.HasIndex(e => e.ReservationId);
        builder.HasIndex(e => e.Status);

        builder.HasOne(e => e.Reservation)
            .WithMany(r => r.Payments)
            .HasForeignKey(e => e.ReservationId)
            .OnDelete(DeleteBehavior.Cascade);
    }
}
