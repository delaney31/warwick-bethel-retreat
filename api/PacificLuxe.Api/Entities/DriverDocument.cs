using PacificLuxe.Api.Enums;

namespace PacificLuxe.Api.Entities;

/// <summary>
/// A file uploaded for a reservation (driver license, selfie, insurance, etc.).
/// </summary>
public class DriverDocument : BaseEntity
{
    public Guid ReservationId { get; set; }
    public DocumentType DocumentType { get; set; }
    public DocumentStatus Status { get; set; } = DocumentStatus.Pending;

    /// <summary>Original filename from the client.</summary>
    public string OriginalFileName { get; set; } = string.Empty;

    public string ContentType { get; set; } = string.Empty;
    public long SizeBytes { get; set; }

    /// <summary>Opaque key returned by document storage (e.g. path or blob name).</summary>
    public string StorageKey { get; set; } = string.Empty;

    public string? ReviewNote { get; set; }
    public DateTime? ReviewedAtUtc { get; set; }

    public Reservation Reservation { get; set; } = null!;
}
