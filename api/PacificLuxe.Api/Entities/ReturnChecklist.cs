namespace PacificLuxe.Api.Entities;

/// <summary>Vehicle condition at rental return.</summary>
public class ReturnChecklist : BaseEntity
{
    public Guid ReservationId { get; set; }

    public int OdometerIn { get; set; }

    /// <summary>Fuel level or EV charge level as percent 0–100.</summary>
    public int FuelOrChargeInPercent { get; set; }

    public string? ConditionNotes { get; set; }

    public DateTime CompletedAtUtc { get; set; }

    public string CompletedBy { get; set; } = string.Empty;

    public Reservation Reservation { get; set; } = null!;
}
