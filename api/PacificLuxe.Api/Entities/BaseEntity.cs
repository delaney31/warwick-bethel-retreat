namespace PacificLuxe.Api.Entities;

/// <summary>
/// Base entity with UUID primary key and UTC timestamps.
/// </summary>
public abstract class BaseEntity
{
    public Guid Id { get; set; }
    public DateTime CreatedAtUtc { get; set; }
    public DateTime UpdatedAtUtc { get; set; }
}
