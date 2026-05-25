using Microsoft.Extensions.Options;
using PacificLuxe.Api.Enums;

namespace PacificLuxe.Api.Features.Documents;

/// <summary>
/// Stores files on local disk under <see cref="DocumentStorageOptions.RootPath"/>.
/// </summary>
public sealed class LocalDocumentStorage : IDocumentStorage
{
    private readonly IWebHostEnvironment _env;
    private readonly DocumentStorageOptions _options;
    private readonly ILogger<LocalDocumentStorage> _logger;

    public LocalDocumentStorage(
        IWebHostEnvironment env,
        IOptions<DocumentStorageOptions> options,
        ILogger<LocalDocumentStorage> logger)
    {
        _env = env;
        _options = options.Value;
        _logger = logger;
    }

    private string RootDirectory
    {
        get
        {
            if (_options.UseAbsolutePath)
                return _options.RootPath;
            return Path.Combine(_env.ContentRootPath, _options.RootPath);
        }
    }

    public async Task<string> SaveAsync(
        Guid reservationId,
        DocumentType documentType,
        Stream content,
        string originalFileName,
        CancellationToken ct = default)
    {
        var ext = Path.GetExtension(originalFileName);
        if (string.IsNullOrEmpty(ext))
            ext = ".bin";

        var safeExt = SanitizeExtension(ext);
        var unique = Guid.NewGuid().ToString("N")[..12];
        var relativeKey = Path.Combine(
            reservationId.ToString("N"),
            documentType.ToString(),
            $"{unique}{safeExt}");

        var fullPath = Path.Combine(RootDirectory, relativeKey);
        Directory.CreateDirectory(Path.GetDirectoryName(fullPath)!);

        await using (var fs = new FileStream(fullPath, FileMode.Create, FileAccess.Write, FileShare.None, 65536, useAsync: true))
        {
            await content.CopyToAsync(fs, ct);
        }

        // Normalize to forward slashes for consistency across platforms / future blob keys
        return relativeKey.Replace(Path.DirectorySeparatorChar, '/');
    }

    public Task DeleteAsync(string storageKey, CancellationToken ct = default)
    {
        if (string.IsNullOrWhiteSpace(storageKey))
            return Task.CompletedTask;

        var normalized = storageKey.Replace('/', Path.DirectorySeparatorChar);
        var fullPath = Path.Combine(RootDirectory, normalized);

        try
        {
            if (File.Exists(fullPath))
                File.Delete(fullPath);
        }
        catch (Exception ex)
        {
            _logger.LogWarning(ex, "Failed to delete local document at {Path}", fullPath);
        }

        return Task.CompletedTask;
    }

    private static string SanitizeExtension(string ext)
    {
        ext = ext.Trim().ToLowerInvariant();
        if (ext.Length > 10 || ext.Any(c => !char.IsLetterOrDigit(c) && c != '.'))
            return ".bin";
        return ext;
    }
}
