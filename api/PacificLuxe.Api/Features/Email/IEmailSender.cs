namespace PacificLuxe.Api.Features.Email;

public interface IEmailSender
{
    /// <summary>Sends an HTML email. Implementations should not throw for delivery failures if the API call should not block callers.</summary>
    Task SendAsync(string to, string subject, string htmlBody, string? textBody = null, CancellationToken ct = default);
}
