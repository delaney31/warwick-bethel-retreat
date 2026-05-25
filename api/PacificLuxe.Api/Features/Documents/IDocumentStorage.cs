using PacificLuxe.Api.Enums;

namespace PacificLuxe.Api.Features.Documents;

/// <summary>
/// Abstraction for binary document storage. Implement with local disk (MVP) or S3/Azure Blob in production.
/// </summary>
public interface IDocumentStorage
{
    /// <summary>
    /// Persists the stream and returns an opaque storage key (path, blob id, etc.).
    /// </summary>
    Task<string> SaveAsync(
        Guid reservationId,
        DocumentType documentType,
        Stream content,
        string originalFileName,
        CancellationToken ct = default);

    /// <summary>
    /// Deletes the blob if it exists. Ignores missing keys.
    /// </summary>
    Task DeleteAsync(string storageKey, CancellationToken ct = default);
}
