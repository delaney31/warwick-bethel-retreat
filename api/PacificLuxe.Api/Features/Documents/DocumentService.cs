using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Options;
using PacificLuxe.Api.Data;
using PacificLuxe.Api.Entities;
using PacificLuxe.Api.Enums;

namespace PacificLuxe.Api.Features.Documents;

public sealed class DocumentService : IDocumentService
{
    private readonly AppDbContext _db;
    private readonly IDocumentStorage _storage;
    private readonly DocumentStorageOptions _options;

    public DocumentService(
        AppDbContext db,
        IDocumentStorage storage,
        IOptions<DocumentStorageOptions> options)
    {
        _db = db;
        _storage = storage;
        _options = options.Value;
    }

    public async Task<(DriverDocumentDto? Dto, DocumentServiceError? Error)> UploadAsync(
        Guid reservationId,
        DocumentType documentType,
        Stream fileStream,
        string originalFileName,
        string contentType,
        long sizeBytes,
        CancellationToken ct = default)
    {
        var reservation = await _db.Reservations.AsNoTracking().FirstOrDefaultAsync(r => r.Id == reservationId, ct);
        if (reservation == null)
            return (null, new DocumentServiceError(StatusCodes.Status404NotFound, "Not Found", "Reservation not found."));

        if (!AllowsDocumentUpload(reservation.Status))
            return (null, new DocumentServiceError(
                StatusCodes.Status409Conflict,
                "Conflict",
                "Documents cannot be uploaded for this reservation in its current status."));

        if (sizeBytes <= 0)
            return (null, new DocumentServiceError(StatusCodes.Status400BadRequest, "Bad Request", "File is empty."));

        if (sizeBytes > _options.MaxFileBytes)
            return (null, new DocumentServiceError(
                StatusCodes.Status400BadRequest,
                "Bad Request",
                $"File exceeds maximum size of {_options.MaxFileBytes} bytes."));

        var normalizedType = contentType.Split(';', 2)[0].Trim().ToLowerInvariant();
        if (string.IsNullOrEmpty(normalizedType))
            return (null, new DocumentServiceError(StatusCodes.Status400BadRequest, "Bad Request", "Content type is required."));

        if (!_options.AllowedContentTypes.Contains(normalizedType))
            return (null, new DocumentServiceError(
                StatusCodes.Status400BadRequest,
                "Bad Request",
                "Content type is not allowed for uploads."));

        var existing = await _db.DriverDocuments.FirstOrDefaultAsync(
            d => d.ReservationId == reservationId && d.DocumentType == documentType,
            ct);

        string storageKey;
        if (existing != null)
        {
            await _storage.DeleteAsync(existing.StorageKey, ct);
            storageKey = await _storage.SaveAsync(reservationId, documentType, fileStream, originalFileName, ct);

            existing.OriginalFileName = originalFileName.Trim();
            existing.ContentType = contentType.Trim();
            existing.SizeBytes = sizeBytes;
            existing.StorageKey = storageKey;
            existing.Status = DocumentStatus.Pending;
            existing.ReviewNote = null;
            existing.ReviewedAtUtc = null;

            await _db.SaveChangesAsync(ct);

            return (Map(existing), null);
        }

        storageKey = await _storage.SaveAsync(reservationId, documentType, fileStream, originalFileName, ct);

        var entity = new DriverDocument
        {
            ReservationId = reservationId,
            DocumentType = documentType,
            Status = DocumentStatus.Pending,
            OriginalFileName = originalFileName.Trim(),
            ContentType = contentType.Trim(),
            SizeBytes = sizeBytes,
            StorageKey = storageKey,
        };

        _db.DriverDocuments.Add(entity);
        await _db.SaveChangesAsync(ct);

        return (Map(entity), null);
    }

    public async Task<(IReadOnlyList<DriverDocumentDto>? List, DocumentServiceError? Error)> ListForReservationAsync(
        Guid reservationId,
        CancellationToken ct = default)
    {
        var exists = await _db.Reservations.AsNoTracking().AnyAsync(r => r.Id == reservationId, ct);
        if (!exists)
            return (null, new DocumentServiceError(StatusCodes.Status404NotFound, "Not Found", "Reservation not found."));

        var list = await _db.DriverDocuments.AsNoTracking()
            .Where(d => d.ReservationId == reservationId)
            .OrderBy(d => d.DocumentType)
            .ToListAsync(ct);

        return (list.Select(Map).ToList(), null);
    }

    public async Task<(DriverDocumentDto? Dto, DocumentServiceError? Error)> UpdateStatusAsync(
        Guid documentId,
        UpdateDocumentStatusRequest request,
        CancellationToken ct = default)
    {
        var doc = await _db.DriverDocuments.FirstOrDefaultAsync(d => d.Id == documentId, ct);
        if (doc == null)
            return (null, new DocumentServiceError(StatusCodes.Status404NotFound, "Not Found", "Document not found."));

        doc.Status = request.Status;
        doc.ReviewNote = string.IsNullOrWhiteSpace(request.ReviewNote) ? null : request.ReviewNote.Trim();
        doc.ReviewedAtUtc = DateTime.UtcNow;

        await _db.SaveChangesAsync(ct);

        return (Map(doc), null);
    }

    private static bool AllowsDocumentUpload(ReservationStatus s) =>
        s is ReservationStatus.Approved
            or ReservationStatus.DocumentsSubmitted
            or ReservationStatus.DocumentsApproved
            or ReservationStatus.AgreementSent
            or ReservationStatus.AgreementSigned
            or ReservationStatus.AwaitingPayment
            or ReservationStatus.Confirmed
            or ReservationStatus.Active;

    private static DriverDocumentDto Map(DriverDocument d) =>
        new(
            d.Id,
            d.ReservationId,
            d.DocumentType.ToString(),
            d.Status.ToString(),
            d.OriginalFileName,
            d.ContentType,
            d.SizeBytes,
            d.ReviewNote,
            d.ReviewedAtUtc,
            d.CreatedAtUtc,
            d.UpdatedAtUtc);
}
