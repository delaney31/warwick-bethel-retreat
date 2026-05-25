namespace PacificLuxe.Api.Enums;

/// <summary>
/// Admin review state for an uploaded driver document.
/// </summary>
public enum DocumentStatus
{
    Pending = 0,
    Approved = 1,
    Rejected = 2,
    NeedsReplacement = 3,
}
