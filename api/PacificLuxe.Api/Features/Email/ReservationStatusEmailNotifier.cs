using System.Net;
using Microsoft.Extensions.Options;
using PacificLuxe.Api.Entities;
using PacificLuxe.Api.Enums;

namespace PacificLuxe.Api.Features.Email;

/// <summary>
/// Renter-facing emails for key lifecycle transitions (see RESERVATION_LIFECYCLE.md).
/// </summary>
public sealed class ReservationStatusEmailNotifier : IReservationStatusEmailNotifier
{
    private readonly IEmailSender _email;
    private readonly IConfiguration _configuration;
    private readonly IOptions<EmailOptions> _emailOptions;
    private readonly ILogger<ReservationStatusEmailNotifier> _logger;

    public ReservationStatusEmailNotifier(
        IEmailSender email,
        IConfiguration configuration,
        IOptions<EmailOptions> emailOptions,
        ILogger<ReservationStatusEmailNotifier> logger)
    {
        _email = email;
        _configuration = configuration;
        _emailOptions = emailOptions;
        _logger = logger;
    }

    public async Task NotifyStatusChangedAsync(
        Reservation reservation,
        ReservationStatus previousStatus,
        ReservationStatus newStatus,
        string? adminMessage,
        CancellationToken ct = default)
    {
        if (previousStatus == newStatus)
            return;

        var to = reservation.RenterEmail?.Trim();
        if (string.IsNullOrWhiteSpace(to))
        {
            _logger.LogWarning("Skipping reservation status email: no RenterEmail for reservation {Id}", reservation.Id);
            return;
        }

        try
        {
            var (subject, html, text) = BuildContent(reservation, newStatus, adminMessage);
            if (subject == null || html == null)
                return;

            await _email.SendAsync(to, subject, html, text, ct).ConfigureAwait(false);
        }
        catch (OperationCanceledException) when (ct.IsCancellationRequested)
        {
            throw;
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Reservation status email failed for {ReservationId} → {Status}", reservation.Id, newStatus);
        }
    }

    private (string? Subject, string? Html, string? Text) BuildContent(
        Reservation reservation,
        ReservationStatus newStatus,
        string? adminMessage)
    {
        var baseUrl = ResolvePublicBaseUrl().TrimEnd('/');
        var id = reservation.Id;
        var vehicle = WebUtility.HtmlEncode(reservation.Vehicle?.DisplayName ?? "your vehicle");
        var renter = WebUtility.HtmlEncode(reservation.RenterName);
        var docsUrl = $"{baseUrl}/reservations/{id}/documents";
        var agreementUrl = $"{baseUrl}/reservations/{id}/agreement";
        var paymentUrl = $"{baseUrl}/reservations/{id}/payment";

        return newStatus switch
        {
            ReservationStatus.Approved => (
                "Your Pacific Luxe rental request was approved",
                WrapBody(
                    $"<p>Hi {renter},</p>" +
                    $"<p>Great news — your request for the <strong>{vehicle}</strong> has been <strong>approved</strong>.</p>" +
                    $"<p><strong>Next step:</strong> upload your driver license, insurance, and any required IDs so we can verify everyone on the reservation.</p>" +
                    "<p style=\"margin:20px 0 8px 0;font-size:14px;font-weight:600;color:#1a1a1a;\">Upload your documents</p>" +
                    $"<p style=\"margin:0 0 16px 0;\"><a href=\"{WebUtility.HtmlEncode(docsUrl)}\" style=\"display:inline-block;background:#d9982d;color:#0f172a;padding:14px 28px;font-weight:700;text-decoration:none;border-radius:10px;font-size:15px;\">Go to document upload</a></p>" +
                    $"<p style=\"margin:0;font-size:12px;color:#64748b;word-break:break-all;\">If the button doesn’t work, copy and paste this link into your browser:<br/><a href=\"{WebUtility.HtmlEncode(docsUrl)}\" style=\"color:#b45309;\">{WebUtility.HtmlEncode(docsUrl)}</a></p>" +
                    "<p style=\"margin-top:20px;\">Thank you,<br/>Pacific Luxe Direct</p>"),
                $"Hi {reservation.RenterName},\n\nYour request for {reservation.Vehicle?.DisplayName ?? "the vehicle"} was approved.\n\nUpload your documents here:\n{docsUrl}\n\nPacific Luxe Direct"),

            ReservationStatus.Rejected => (
                "Update on your Pacific Luxe rental request",
                WrapBody(
                    $"<p>Hi {renter},</p>" +
                    $"<p>Thank you for your interest in the <strong>{vehicle}</strong>. We’re unable to move forward with this request at this time.</p>" +
                    (string.IsNullOrWhiteSpace(adminMessage)
                        ? ""
                        : $"<p><strong>Message from our team:</strong><br/>{WebUtility.HtmlEncode(adminMessage)}</p>") +
                    "<p>If you have questions, reply to this email.</p>" +
                    "<p>Pacific Luxe Direct</p>"),
                $"Hi {reservation.RenterName},\n\nWe can't move forward with this request.{(string.IsNullOrWhiteSpace(adminMessage) ? "" : $"\n\nMessage: {adminMessage}")}\n\nPacific Luxe Direct"),

            ReservationStatus.DocumentsApproved => (
                "Documents approved — sign your rental agreement",
                WrapBody(
                    $"<p>Hi {renter},</p>" +
                    $"<p>All required documents for your <strong>{vehicle}</strong> reservation are <strong>approved</strong>.</p>" +
                    $"<p>Please review and sign your rental agreement to continue.</p>" +
                    $"<p><a href=\"{agreementUrl}\">Open agreement</a></p>" +
                    "<p>Thank you,<br/>Pacific Luxe Direct</p>"),
                $"Hi {reservation.RenterName},\n\nYour documents are approved. Sign your agreement: {agreementUrl}\n\nPacific Luxe Direct"),

            ReservationStatus.Confirmed => (
                "Your reservation is confirmed",
                WrapBody(
                    $"<p>Hi {renter},</p>" +
                    $"<p>Your reservation for the <strong>{vehicle}</strong> is <strong>confirmed</strong>.</p>" +
                    $"<p>We’ll follow up with pickup details as your rental date approaches.</p>" +
                    $"<p>You can also open your reservation hub anytime:</p>" +
                    $"<p><a href=\"{paymentUrl}\">View reservation</a></p>" +
                    "<p>Drive safe,<br/>Pacific Luxe Direct</p>"),
                $"Hi {reservation.RenterName},\n\nYour reservation for {reservation.Vehicle?.DisplayName ?? "the vehicle"} is confirmed. {paymentUrl}\n\nPacific Luxe Direct"),

            ReservationStatus.Cancelled => (
                "Your Pacific Luxe reservation was cancelled",
                WrapBody(
                    $"<p>Hi {renter},</p>" +
                    $"<p>Your reservation for the <strong>{vehicle}</strong> has been <strong>cancelled</strong>.</p>" +
                    (string.IsNullOrWhiteSpace(adminMessage)
                        ? ""
                        : $"<p><strong>Note:</strong><br/>{WebUtility.HtmlEncode(adminMessage)}</p>") +
                    "<p>If this wasn’t expected, contact us.</p>" +
                    "<p>Pacific Luxe Direct</p>"),
                $"Hi {reservation.RenterName},\n\nYour reservation was cancelled.{(string.IsNullOrWhiteSpace(adminMessage) ? "" : $"\n\nNote: {adminMessage}")}\n\nPacific Luxe Direct"),

            _ => (null, null, null),
        };
    }

    private string ResolvePublicBaseUrl()
    {
        var configured = _emailOptions.Value.PublicSiteBaseUrl;
        if (!string.IsNullOrWhiteSpace(configured))
            return configured!;

        var frontend = _configuration["FrontendUrl"];
        if (!string.IsNullOrWhiteSpace(frontend))
            return frontend!;

        var env = Environment.GetEnvironmentVariable("FRONTEND_URL");
        if (!string.IsNullOrWhiteSpace(env))
            return env!;

        return "http://localhost:3000";
    }

    private static string WrapBody(string innerHtml) =>
        "<!DOCTYPE html><html><body style=\"font-family:system-ui,-apple-system,sans-serif;line-height:1.5;color:#111;\">" +
        innerHtml +
        "</body></html>";
}
