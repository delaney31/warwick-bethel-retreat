using Microsoft.AspNetCore.Mvc;
using PacificLuxe.Api.Enums;

namespace PacificLuxe.Api.Features.Documents;

/// <summary>
/// Public upload endpoint for reservation documents (renter flow).
/// </summary>
[ApiController]
[Route("api/reservations/{reservationId:guid}/documents")]
public class ReservationDocumentsController : ControllerBase
{
    private readonly IDocumentService _documents;

    public ReservationDocumentsController(IDocumentService documents)
    {
        _documents = documents;
    }

    /// <summary>
    /// Upload or replace a document for a reservation (multipart: file + documentType).
    /// </summary>
    [HttpPost]
    [Consumes("multipart/form-data")]
    [RequestFormLimits(MultipartBodyLengthLimit = 11_000_000)]
    [ProducesResponseType(typeof(DriverDocumentDto), StatusCodes.Status201Created)]
    [ProducesResponseType(typeof(ProblemDetails), StatusCodes.Status400BadRequest)]
    [ProducesResponseType(typeof(ProblemDetails), StatusCodes.Status404NotFound)]
    [ProducesResponseType(typeof(ProblemDetails), StatusCodes.Status409Conflict)]
    public async Task<IActionResult> Upload(
        Guid reservationId,
        [FromForm] DocumentType documentType,
        [FromForm] IFormFile? file,
        CancellationToken ct = default)
    {
        if (file == null || file.Length == 0)
            return Problem(
                title: "Bad Request",
                detail: "A non-empty file is required.",
                statusCode: StatusCodes.Status400BadRequest);

        if (string.IsNullOrWhiteSpace(file.ContentType))
            return Problem(
                title: "Bad Request",
                detail: "Content type is required.",
                statusCode: StatusCodes.Status400BadRequest);

        await using var stream = file.OpenReadStream();
        var (dto, error) = await _documents.UploadAsync(
            reservationId,
            documentType,
            stream,
            file.FileName,
            file.ContentType,
            file.Length,
            ct);

        if (error != null)
            return Problem(title: error.Title, detail: error.Detail, statusCode: error.StatusCode);

        return CreatedAtAction(
            nameof(AdminDocumentsController.UpdateStatus),
            "AdminDocuments",
            new { documentId = dto!.Id },
            dto);
    }
}
