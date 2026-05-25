namespace PacificLuxe.Api.Enums;

public enum VehicleStatus
{
    Available = 0,
    Maintenance = 1,
    Retired = 2,
    /// <summary>Not bookable but still shown on the public fleet (e.g. registration pending).</summary>
    Offline = 3,
}
