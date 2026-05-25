using PacificLuxe.Api.Enums;

namespace PacificLuxe.Api.Features.Documents;

public record DriverDocumentDto(
    Guid Id,
    Guid ReservationId,
    string DocumentType,
    string Status,
    string OriginalFileName,
    string ContentType,
    long SizeBytes,
    string? ReviewNote,
    DateTime? ReviewedAtUtc,
    DateTime CreatedAtUtc,
    DateTime UpdatedAtUtc);

public record UpdateDocumentStatusRequest(
    DocumentStatus Status,
    string? ReviewNote);
