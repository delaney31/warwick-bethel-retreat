using PacificLuxe.Api.Enums;

namespace PacificLuxe.Api.Features.Documents;

public interface IDocumentService
{
    Task<(DriverDocumentDto? Dto, DocumentServiceError? Error)> UploadAsync(
        Guid reservationId,
        DocumentType documentType,
        Stream fileStream,
        string originalFileName,
        string contentType,
        long sizeBytes,
        CancellationToken ct = default);

    Task<(IReadOnlyList<DriverDocumentDto>? List, DocumentServiceError? Error)> ListForReservationAsync(
        Guid reservationId,
        CancellationToken ct = default);

    Task<(DriverDocumentDto? Dto, DocumentServiceError? Error)> UpdateStatusAsync(
        Guid documentId,
        UpdateDocumentStatusRequest request,
        CancellationToken ct = default);
}
