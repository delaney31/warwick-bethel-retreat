using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace PacificLuxe.Api.Features.Documents;

/// <summary>
/// Admin: list documents for a reservation.
/// </summary>
[ApiController]
[Route("api/admin/reservations/{reservationId:guid}/documents")]
[Authorize(Roles = "Admin")]
public class AdminReservationDocumentsController : ControllerBase
{
    private readonly IDocumentService _documents;

    public AdminReservationDocumentsController(IDocumentService documents)
    {
        _documents = documents;
    }

    [HttpGet]
    [ProducesResponseType(typeof(IEnumerable<DriverDocumentDto>), StatusCodes.Status200OK)]
    [ProducesResponseType(typeof(ProblemDetails), StatusCodes.Status404NotFound)]
    public async Task<IActionResult> List(Guid reservationId, CancellationToken ct = default)
    {
        var (list, error) = await _documents.ListForReservationAsync(reservationId, ct);
        if (error != null)
            return Problem(title: error.Title, detail: error.Detail, statusCode: error.StatusCode);

        return Ok(list);
    }
}
