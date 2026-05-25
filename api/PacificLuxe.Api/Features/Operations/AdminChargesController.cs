using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace PacificLuxe.Api.Features.Operations;

[ApiController]
[Route("api/admin/charges")]
[Authorize(Roles = "Admin")]
public class AdminChargesController : ControllerBase
{
    private readonly IOperationsService _operations;

    public AdminChargesController(IOperationsService operations)
    {
        _operations = operations;
    }

    /// <summary>Update an additional charge (Active or Returned reservation only).</summary>
    [HttpPut("{chargeId:guid}")]
    [ProducesResponseType(typeof(AdditionalChargeDto), StatusCodes.Status200OK)]
    [ProducesResponseType(typeof(ProblemDetails), StatusCodes.Status400BadRequest)]
    [ProducesResponseType(typeof(ProblemDetails), StatusCodes.Status404NotFound)]
    [ProducesResponseType(typeof(ProblemDetails), StatusCodes.Status409Conflict)]
    public async Task<IActionResult> UpdateCharge(
        Guid chargeId,
        [FromBody] UpdateAdditionalChargeRequest request,
        CancellationToken ct = default)
    {
        var (dto, error) = await _operations.UpdateChargeAsync(chargeId, request, ct);
        if (error != null)
            return Problem(title: error.Title, detail: error.Detail, statusCode: error.StatusCode);
        return Ok(dto);
    }

    /// <summary>Delete an additional charge (Active or Returned reservation only).</summary>
    [HttpDelete("{chargeId:guid}")]
    [ProducesResponseType(StatusCodes.Status204NoContent)]
    [ProducesResponseType(typeof(ProblemDetails), StatusCodes.Status404NotFound)]
    [ProducesResponseType(typeof(ProblemDetails), StatusCodes.Status409Conflict)]
    public async Task<IActionResult> DeleteCharge(Guid chargeId, CancellationToken ct = default)
    {
        var (success, error) = await _operations.DeleteChargeAsync(chargeId, ct);
        if (error != null)
            return Problem(title: error.Title, detail: error.Detail, statusCode: error.StatusCode);
        return NoContent();
    }
}
