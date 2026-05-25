namespace PacificLuxe.Api.Entities;

public class AvailabilityBlock : BaseEntity
{
    public Guid VehicleId { get; set; }
    public DateOnly StartDateUtc { get; set; }
    public DateOnly EndDateUtc { get; set; }
    public string Reason { get; set; } = string.Empty;
    public string? Notes { get; set; }

    public Vehicle Vehicle { get; set; } = null!;
}
