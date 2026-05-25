namespace PacificLuxe.Api.Features.Availability;

public interface IAvailabilityService
{
    Task<VehicleAvailabilityDto?> GetVehicleAvailabilityAsync(Guid vehicleId, DateOnly? from, DateOnly? to, CancellationToken ct = default);
    Task<bool> IsVehicleAvailableForDatesAsync(Guid vehicleId, DateOnly startDate, DateOnly endDate, Guid? excludeReservationId = null, CancellationToken ct = default);
    Task<(AvailabilityBlockDto? Dto, string? Error)> CreateBlockAsync(CreateAvailabilityBlockRequest request, CancellationToken ct = default);
    Task<(bool Success, string? Error)> DeleteBlockAsync(Guid id, CancellationToken ct = default);
}
