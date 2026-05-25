using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace PacificLuxe.Api.Features.Documents;

/// <summary>
/// Admin: update review status on a document.
/// </summary>
[ApiController]
[Route("api/admin/documents")]
[Authorize(Roles = "Admin")]
public class AdminDocumentsController : ControllerBase
{
    private readonly IDocumentService _documents;

    public AdminDocumentsController(IDocumentService documents)
    {
        _documents = documents;
    }

    [HttpPatch("{documentId:guid}/status")]
    [ProducesResponseType(typeof(DriverDocumentDto), StatusCodes.Status200OK)]
    [ProducesResponseType(typeof(ProblemDetails), StatusCodes.Status404NotFound)]
    public async Task<IActionResult> UpdateStatus(
        Guid documentId,
        [FromBody] UpdateDocumentStatusRequest request,
        CancellationToken ct = default)
    {
        var (dto, error) = await _documents.UpdateStatusAsync(documentId, request, ct);
        if (error != null)
            return Problem(title: error.Title, detail: error.Detail, statusCode: error.StatusCode);

        return Ok(dto);
    }
}
