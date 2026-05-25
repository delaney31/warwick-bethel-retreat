namespace PacificLuxe.Api.Features.Payments;

public interface IPaymentService
{
    Task<(PaymentDto? Dto, PaymentServiceError? Error)> CreateAsync(
        Guid reservationId,
        CreatePaymentRequest request,
        CancellationToken ct = default);

    Task<(PaymentDto? Dto, PaymentServiceError? Error)> UpdateStatusAsync(
        Guid paymentId,
        UpdatePaymentStatusRequest request,
        CancellationToken ct = default);

    Task<(IReadOnlyList<PaymentDto>? List, PaymentServiceError? Error)> ListForReservationAsync(
        Guid reservationId,
        CancellationToken ct = default);

    Task<(PaymentPublicDto? Dto, PaymentServiceError? Error)> GetPublicAsync(
        Guid reservationId,
        CancellationToken ct = default);
}
