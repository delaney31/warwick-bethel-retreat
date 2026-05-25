using PacificLuxe.Api.Enums;

namespace PacificLuxe.Api.Features.Reservations;

public interface IReservationService
{
    Task<(ReservationCreatedDto? Dto, string? Error)> CreateReservationAsync(CreateReservationRequest request, CancellationToken ct = default);
    Task<IReadOnlyList<ReservationSummaryDto>> GetReservationsAsync(ReservationStatus? statusFilter, CancellationToken ct = default);
    Task<ReservationDetailDto?> GetReservationByIdAsync(Guid id, CancellationToken ct = default);
    Task<(bool Success, string? Error)> UpdateReservationStatusAsync(Guid id, UpdateReservationStatusRequest request, CancellationToken ct = default);
}
