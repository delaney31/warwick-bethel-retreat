using PacificLuxe.Api.Enums;

namespace PacificLuxe.Api.Entities;

/// <summary>
/// Post-rental charge line (distinct from <see cref="Payment"/> rental balance).
/// </summary>
public class AdditionalCharge : BaseEntity
{
    public Guid ReservationId { get; set; }

    public AdditionalChargeType ChargeType { get; set; } = AdditionalChargeType.Other;

    public decimal Amount { get; set; }

    public string Currency { get; set; } = "USD";

    public string? Notes { get; set; }

    public Reservation Reservation { get; set; } = null!;
}
