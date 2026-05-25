using PacificLuxe.Api.Enums;

namespace PacificLuxe.Api.Entities;

public class Vehicle : BaseEntity
{
    public string Slug { get; set; } = string.Empty;
    public string DisplayName { get; set; } = string.Empty;
    public int Year { get; set; }
    public string Make { get; set; } = string.Empty;
    public string Model { get; set; } = string.Empty;
    public string? Trim { get; set; }
    public decimal DailyRate { get; set; }
    public int IncludedMilesPerDay { get; set; }
    public string LocationCity { get; set; } = string.Empty;
    public VehicleStatus Status { get; set; } = VehicleStatus.Available;
    public string Description { get; set; } = string.Empty;
    public string? HeroImage { get; set; }

    public ICollection<AvailabilityBlock> AvailabilityBlocks { get; set; } = [];
    public ICollection<Reservation> Reservations { get; set; } = [];
}
