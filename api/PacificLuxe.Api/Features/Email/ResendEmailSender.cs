using System.Net.Http.Headers;
using System.Text;
using System.Text.Json;
using Microsoft.Extensions.Options;

namespace PacificLuxe.Api.Features.Email;

/// <summary>
/// Sends mail via Resend REST API (<see href="https://resend.com/docs/api-reference/emails/send-email"/>).
/// </summary>
public sealed class ResendEmailSender : IEmailSender
{
    private const string ResendEmailsUrl = "https://api.resend.com/emails";

    private readonly IOptions<EmailOptions> _options;
    private readonly HttpClient _http;
    private readonly ILogger<ResendEmailSender> _logger;

    public ResendEmailSender(IOptions<EmailOptions> options, HttpClient http, ILogger<ResendEmailSender> logger)
    {
        _options = options;
        _http = http;
        _logger = logger;
    }

    public async Task SendAsync(string to, string subject, string htmlBody, string? textBody = null, CancellationToken ct = default)
    {
        var opt = _options.Value;
        if (string.IsNullOrWhiteSpace(opt.ResendApiKey))
        {
            _logger.LogInformation(
                "Transactional email skipped (Email:ResendApiKey not set). To={To} Subject={Subject}",
                to, subject);
            return;
        }

        if (string.IsNullOrWhiteSpace(opt.From))
        {
            _logger.LogWarning("Transactional email skipped: Email:From is not configured.");
            return;
        }

        // Resend expects JSON keys: from, to, subject, html, text (optional).
        var payload = new Dictionary<string, object?>
        {
            ["from"] = opt.From,
            ["to"] = new[] { to },
            ["subject"] = subject,
            ["html"] = htmlBody,
        };
        if (!string.IsNullOrEmpty(textBody))
            payload["text"] = textBody;

        var json = JsonSerializer.Serialize(payload);

        using var req = new HttpRequestMessage(HttpMethod.Post, ResendEmailsUrl);
        req.Headers.Authorization = new AuthenticationHeaderValue("Bearer", opt.ResendApiKey.Trim());
        req.Content = new StringContent(json, Encoding.UTF8, "application/json");

        try
        {
            var response = await _http.SendAsync(req, ct).ConfigureAwait(false);
            var responseBody = await response.Content.ReadAsStringAsync(ct).ConfigureAwait(false);
            if (!response.IsSuccessStatusCode)
            {
                _logger.LogWarning(
                    "Resend API error {StatusCode}: {Body}. To={To} Subject={Subject}",
                    (int)response.StatusCode, responseBody, to, subject);
                return;
            }

            _logger.LogInformation("Transactional email sent via Resend to {To} Subject={Subject}", to, subject);
        }
        catch (OperationCanceledException) when (ct.IsCancellationRequested)
        {
            throw;
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Failed to send transactional email to {To} Subject={Subject}", to, subject);
        }
    }
}
