namespace PacificLuxe.Api.Features.Documents;

/// <summary>
/// Options for local file storage (dev/MVP). Swap <see cref="IDocumentStorage"/> for S3/Blob later.
/// </summary>
public class DocumentStorageOptions
{
    public const string SectionName = "DocumentStorage";

    /// <summary>Path relative to content root unless <see cref="UseAbsolutePath"/> is true.</summary>
    public string RootPath { get; set; } = "uploads/documents";

    public bool UseAbsolutePath { get; set; }

    public long MaxFileBytes { get; set; } = 10 * 1024 * 1024;

    public string[] AllowedContentTypes { get; set; } =
    [
        "image/jpeg",
        "image/png",
        "image/webp",
        "application/pdf",
    ];
}
