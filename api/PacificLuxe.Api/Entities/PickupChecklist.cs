namespace PacificLuxe.Api.Entities;

/// <summary>Vehicle condition at rental pickup (odometer, fuel/charge level, notes).</summary>
public class PickupChecklist : BaseEntity
{
    public Guid ReservationId { get; set; }

    public int OdometerOut { get; set; }

    /// <summary>Fuel level or EV charge level as percent 0–100.</summary>
    public int FuelOrChargeOutPercent { get; set; }

    public string? ConditionNotes { get; set; }

    public DateTime CompletedAtUtc { get; set; }

    /// <summary>Staff name or identifier who recorded pickup.</summary>
    public string CompletedBy { get; set; } = string.Empty;

    public Reservation Reservation { get; set; } = null!;
}
