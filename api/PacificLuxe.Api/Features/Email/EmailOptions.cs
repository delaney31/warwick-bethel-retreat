namespace PacificLuxe.Api.Features.Email;

/// <summary>
/// Transactional email (Resend). Set <see cref="ResendApiKey"/> in production.
/// </summary>
public class EmailOptions
{
    public const string SectionName = "Email";

    /// <summary>Resend API key (Bearer). If empty, emails are skipped and logged.</summary>
    public string ResendApiKey { get; set; } = "";

    /// <summary>Sender address, e.g. "Pacific Luxe &lt;noreply@yourdomain.com&gt;" or Resend test: "onboarding@resend.dev".</summary>
    public string From { get; set; } = "";

    /// <summary>Public site base URL for links (no trailing slash). Falls back to <c>FrontendUrl</c> config when unset.</summary>
    public string? PublicSiteBaseUrl { get; set; }
}
