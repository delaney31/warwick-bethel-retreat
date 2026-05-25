namespace PacificLuxe.Api.Features.Operations;

public interface IOperationsService
{
    Task<(PickupChecklistDto? Dto, OperationsServiceError? Error)> RecordPickupAsync(
        Guid reservationId,
        RecordPickupRequest request,
        CancellationToken ct = default);

    Task<(ReturnChecklistDto? Dto, OperationsServiceError? Error)> RecordReturnAsync(
        Guid reservationId,
        RecordReturnRequest request,
        CancellationToken ct = default);

    Task<(AdditionalChargeDto? Dto, OperationsServiceError? Error)> CreateChargeAsync(
        Guid reservationId,
        CreateAdditionalChargeRequest request,
        CancellationToken ct = default);

    Task<(AdditionalChargeDto? Dto, OperationsServiceError? Error)> UpdateChargeAsync(
        Guid chargeId,
        UpdateAdditionalChargeRequest request,
        CancellationToken ct = default);

    Task<(bool Success, OperationsServiceError? Error)> DeleteChargeAsync(
        Guid chargeId,
        CancellationToken ct = default);

    Task<(ReservationOperationsDto? Dto, OperationsServiceError? Error)> GetOperationsAsync(
        Guid reservationId,
        CancellationToken ct = default);

    /// <summary>Transitions Returned → Completed (closes the rental after return).</summary>
    Task<(bool Success, OperationsServiceError? Error)> CompleteReservationAsync(
        Guid reservationId,
        CancellationToken ct = default);
}
