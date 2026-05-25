using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace PacificLuxe.Api.Features.Availability;

[ApiController]
[Route("api/admin/availability-blocks")]
[Authorize(Roles = "Admin")]
public class AdminAvailabilityBlocksController : ControllerBase
{
    private readonly IAvailabilityService _availabilityService;

    public AdminAvailabilityBlocksController(IAvailabilityService availabilityService)
    {
        _availabilityService = availabilityService;
    }

    /// <summary>
    /// Create an availability block (vehicle unavailable for date range).
    /// Validates date range and rejects overlapping blocks.
    /// </summary>
    [HttpPost]
    [ProducesResponseType(typeof(AvailabilityBlockDto), StatusCodes.Status201Created)]
    [ProducesResponseType(StatusCodes.Status400BadRequest)]
    [ProducesResponseType(StatusCodes.Status404NotFound)]
    public async Task<ActionResult<AvailabilityBlockDto>> Create(
        [FromBody] CreateAvailabilityBlockRequest request,
        CancellationToken ct = default)
    {
        var (dto, error) = await _availabilityService.CreateBlockAsync(request, ct);

        if (error == "Vehicle not found.")
            return NotFound(new { error });

        if (error != null)
            return BadRequest(new { error });

        return Created($"/api/admin/availability-blocks/{dto!.Id}", dto);
    }

    /// <summary>
    /// Delete an availability block.
    /// </summary>
    [HttpDelete("{id:guid}")]
    [ProducesResponseType(StatusCodes.Status204NoContent)]
    [ProducesResponseType(StatusCodes.Status404NotFound)]
    public async Task<IActionResult> Delete(Guid id, CancellationToken ct = default)
    {
        var (success, error) = await _availabilityService.DeleteBlockAsync(id, ct);

        if (error == "Availability block not found.")
            return NotFound();

        return NoContent();
    }
}
