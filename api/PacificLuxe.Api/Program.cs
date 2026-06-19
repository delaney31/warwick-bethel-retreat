using System.Text;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;
using Microsoft.IdentityModel.Tokens;
using Microsoft.OpenApi.Models;
using PacificLuxe.Api.Data;
using PacificLuxe.Api.Entities;
using PacificLuxe.Api.Features.Agreements;
using PacificLuxe.Api.Features.Auth;
using PacificLuxe.Api.Features.Payments;
using PacificLuxe.Api.Features.Availability;
using PacificLuxe.Api.Features.Documents;
using PacificLuxe.Api.Features.Operations;
using PacificLuxe.Api.Features.Email;
using PacificLuxe.Api.Features.Reservations;
using PacificLuxe.Api.Features.Vehicles;
using PacificLuxe.Api.Configuration;
using PacificLuxe.Api.Middleware;
using Microsoft.Extensions.Diagnostics.HealthChecks;
using Npgsql;

var builder = WebApplication.CreateBuilder(args);

// Heroku/Render/Neon: prefer raw DATABASE_URL (avoids .NET env config splitting on '=' in ?sslmode=require).
static string ResolveDefaultConnection(IConfiguration config)
{
    var raw = Environment.GetEnvironmentVariable("DATABASE_URL");
    if (string.IsNullOrWhiteSpace(raw))
        raw = config.GetConnectionString("DefaultConnection");

    if (string.IsNullOrWhiteSpace(raw))
        throw new InvalidOperationException(
            "Database connection not configured. Set DATABASE_URL or ConnectionStrings__DefaultConnection.");

    raw = raw.Replace("&channel_binding=require", "", StringComparison.OrdinalIgnoreCase);
    return ToNpgsqlConnectionString(raw);
}

static string ToNpgsqlConnectionString(string connection)
{
    if (!connection.StartsWith("postgres://", StringComparison.OrdinalIgnoreCase) &&
        !connection.StartsWith("postgresql://", StringComparison.OrdinalIgnoreCase))
        return connection;

    var uri = new Uri(connection);
    var userInfo = uri.UserInfo.Split(':', 2);
    var username = Uri.UnescapeDataString(userInfo[0]);
    var password = userInfo.Length > 1 ? Uri.UnescapeDataString(userInfo[1]) : "";
    var database = uri.AbsolutePath.TrimStart('/');
    var port = uri.Port > 0 ? uri.Port : 5432;
    var ssl = uri.Query.Contains("sslmode=require", StringComparison.OrdinalIgnoreCase) ? "Require" : "Prefer";

    return $"Host={uri.Host};Port={port};Database={database};Username={username};Password={password};Ssl Mode={ssl}";
}

// Render, Fly.io, etc. set PORT — listen on all interfaces (required in containers).
var port = Environment.GetEnvironmentVariable("PORT");
if (!string.IsNullOrEmpty(port))
    builder.WebHost.UseUrls($"http://0.0.0.0:{port}");

var jwtSection = builder.Configuration.GetSection(JwtOptions.SectionName);
var jwtOptions = jwtSection.Get<JwtOptions>() ?? new JwtOptions();
var signingKey = jwtOptions.SigningKey ?? "";
if (signingKey.Length < 32)
{
    throw new InvalidOperationException(
        "Jwt:SigningKey must be configured with at least 32 characters. " +
        "For local dev, set it in appsettings.Development.json or user secrets. " +
        "For production, set the Jwt__SigningKey environment variable.");
}

// ─── Database ──────────────────────────────────────────────
var connectionString = ResolveDefaultConnection(builder.Configuration);
var useSqlite = connectionString.StartsWith("Data Source=", StringComparison.OrdinalIgnoreCase);

builder.Services.AddDbContext<AppDbContext>(opts =>
{
    if (useSqlite)
        opts.UseSqlite(connectionString);
    else
        opts.UseNpgsql(connectionString);
});

builder.Services.Configure<ProductLineOptions>(
    builder.Configuration.GetSection(ProductLineOptions.SectionName));

builder.Services.AddScoped<IVehicleService, VehicleService>();
builder.Services.AddScoped<IAvailabilityService, AvailabilityService>();
builder.Services.AddScoped<IReservationService, ReservationService>();

builder.Services.Configure<EmailOptions>(builder.Configuration.GetSection(EmailOptions.SectionName));
builder.Services.AddHttpClient<IEmailSender, ResendEmailSender>();
builder.Services.AddScoped<IReservationStatusEmailNotifier, ReservationStatusEmailNotifier>();

builder.Services.Configure<DocumentStorageOptions>(
    builder.Configuration.GetSection(DocumentStorageOptions.SectionName));
builder.Services.AddSingleton<IDocumentStorage, LocalDocumentStorage>();
builder.Services.AddScoped<IDocumentService, DocumentService>();
builder.Services.AddScoped<IAgreementService, AgreementService>();
builder.Services.AddScoped<IPaymentService, PaymentService>();
builder.Services.AddScoped<IOperationsService, OperationsService>();

builder.Services.Configure<JwtOptions>(jwtSection);
builder.Services.AddSingleton<IJwtTokenService, JwtTokenService>();
builder.Services.AddSingleton<PasswordHasher<AdminUser>>();
builder.Services.AddScoped<IAdminAuthService, AdminAuthService>();

builder.Services.AddAuthentication(JwtBearerDefaults.AuthenticationScheme)
    .AddJwtBearer(options =>
    {
        options.TokenValidationParameters = new TokenValidationParameters
        {
            ValidateIssuerSigningKey = true,
            IssuerSigningKey = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(signingKey)),
            ValidIssuer = jwtOptions.Issuer,
            ValidAudience = jwtOptions.Audience,
            ValidateIssuer = true,
            ValidateAudience = true,
            ValidateLifetime = true,
            ClockSkew = TimeSpan.FromMinutes(2),
        };
    });

builder.Services.AddAuthorization();

// Render probes /health — keep it liveness-only so Neon cold starts do not fail the instance.
builder.Services.AddHealthChecks()
    .AddCheck("live", () => HealthCheckResult.Healthy(), tags: ["live"])
    .AddDbContextCheck<AppDbContext>("db", tags: ["ready"]);

builder.Services.AddControllers()
    .AddJsonOptions(opts =>
    {
        opts.JsonSerializerOptions.PropertyNamingPolicy = System.Text.Json.JsonNamingPolicy.CamelCase;
        opts.JsonSerializerOptions.Converters.Add(new System.Text.Json.Serialization.JsonStringEnumConverter());
    });

builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen(opts =>
{
    opts.SwaggerDoc("v1", new OpenApiInfo
    {
        Title = "Pacific Luxe Direct API",
        Version = "v1",
        Description = "Rental reservation API — manual approval, single-owner MVP. Admin routes require Bearer JWT from POST /api/admin/auth/login.",
    });
    opts.AddSecurityDefinition("Bearer", new OpenApiSecurityScheme
    {
        Name = "Authorization",
        Type = SecuritySchemeType.Http,
        Scheme = "bearer",
        BearerFormat = "JWT",
        In = ParameterLocation.Header,
        Description = "JWT from POST /api/admin/auth/login.",
    });
    opts.OperationFilter<AdminAuthSwaggerOperationFilter>();
});

// Browser admin login (POST /api/admin/auth/login) is cross-origin if NEXT_PUBLIC_API_BASE_URL points at Render.
// Set FRONTEND_URL (or Cors:Origins / Cors__Origins__0) on the API host to your Vercel origin, e.g. https://your-app.vercel.app
var corsFromConfig = builder.Configuration.GetSection("Cors:Origins").Get<string[]>();
var corsList = new List<string>();
if (corsFromConfig is { Length: > 0 })
    corsList.AddRange(corsFromConfig);
else
    corsList.Add("http://localhost:3000");

void AppendCorsOrigin(string? raw)
{
    if (string.IsNullOrWhiteSpace(raw)) return;
    var trimmed = raw.Trim();
    if (!Uri.TryCreate(trimmed, UriKind.Absolute, out var uri)) return;
    var origin = uri.GetLeftPart(UriPartial.Authority);
    if (!corsList.Contains(origin, StringComparer.OrdinalIgnoreCase))
        corsList.Add(origin);
}

AppendCorsOrigin(builder.Configuration["FrontendUrl"]);
AppendCorsOrigin(Environment.GetEnvironmentVariable("FRONTEND_URL"));

var corsOrigins = corsList.ToArray();

builder.Services.AddCors(opts =>
    opts.AddDefaultPolicy(policy =>
        policy.WithOrigins(corsOrigins)
              .AllowAnyHeader()
              .AllowAnyMethod()));

var app = builder.Build();

if (app.Environment.IsProduction())
{
    var cs = ResolveDefaultConnection(app.Configuration);
    if (string.IsNullOrWhiteSpace(cs))
    {
        throw new InvalidOperationException(
            "Database not configured for production. Set DATABASE_URL or ConnectionStrings__DefaultConnection " +
            "to your Neon/PostgreSQL connection string (Render: paste the pooled Neon URL).");
    }

    if (cs.Contains("localhost", StringComparison.OrdinalIgnoreCase) ||
        cs.Contains("127.0.0.1", StringComparison.OrdinalIgnoreCase))
    {
        throw new InvalidOperationException(
            "Production cannot use localhost for the database. Set ConnectionStrings__DefaultConnection " +
            "to your Render PostgreSQL Internal Database URL (not Host=localhost).");
    }
}

if (app.Environment.IsDevelopment())
{
    using var scope = app.Services.CreateScope();
    var db = scope.ServiceProvider.GetRequiredService<AppDbContext>();
    var loggerFactory = scope.ServiceProvider.GetRequiredService<ILoggerFactory>();
    var conn = ResolveDefaultConnection(app.Configuration);
    var isSqlite = conn.StartsWith("Data Source=", StringComparison.OrdinalIgnoreCase);
    // Local SQLite: schema without migrations (do not mix EnsureCreated with Migrate on the same DB).
    if (isSqlite)
    {
        db.Database.EnsureCreated();
        var seedLogger = loggerFactory.CreateLogger("CatalogSeed");
        await RunProductSeedAsync(db, app.Environment, app.Configuration, seedLogger);
        await MigratePickupPreferenceAsync(db);
        var passwordHasher = scope.ServiceProvider.GetRequiredService<PasswordHasher<AdminUser>>();
        var adminLogger = loggerFactory.CreateLogger("AdminSeed");
        await AdminSeed.SeedAsync(db, app.Configuration, passwordHasher, adminLogger);
    }
}

// PostgreSQL / Neon / Render: apply EF migrations before any code touches tables.
// Fleet seed runs here for non-SQLite so schema exists first (staging/production/Postgres dev).
{
    await using var scope = app.Services.CreateAsyncScope();
    var db = scope.ServiceProvider.GetRequiredService<AppDbContext>();
    var loggerFactory = scope.ServiceProvider.GetRequiredService<ILoggerFactory>();
    var conn = ResolveDefaultConnection(app.Configuration);
    var isSqlite = conn.StartsWith("Data Source=", StringComparison.OrdinalIgnoreCase);

    if (!isSqlite)
    {
        var migrationLogger = loggerFactory.CreateLogger("Startup");
        await MigrateDatabaseWithRetryAsync(db, migrationLogger);

        var seedLogger = loggerFactory.CreateLogger("CatalogSeed");
        await RunProductSeedAsync(db, app.Environment, app.Configuration, seedLogger);

        // Production/staging: create first admin when AdminSeed:Email/Password are set (e.g. Render env vars).
        // Development SQLite still uses the AdminSeed call in the Development block above.
        var passwordHasher = scope.ServiceProvider.GetRequiredService<PasswordHasher<AdminUser>>();
        var adminLogger = loggerFactory.CreateLogger("AdminSeed");
        await AdminSeed.SeedAsync(db, app.Configuration, passwordHasher, adminLogger);
    }

    var backfillLogger = loggerFactory.CreateLogger("SignedAgreementBackfill");
    await SignedAgreementBackfill.TryRunAsync(db, backfillLogger);
}

static async Task RunProductSeedAsync(
    AppDbContext db,
    IHostEnvironment env,
    IConfiguration config,
    ILogger logger)
{
    var productLine = config.GetSection(ProductLineOptions.SectionName).Get<ProductLineOptions>();
    if (productLine?.IsRetreat == true)
        await RetreatDataSeeder.SeedIfEmptyAsync(db, env, config, logger);
    else
        await DataSeeder.SeedIfEmptyAsync(db, env, config, logger);
}

static async Task MigratePickupPreferenceAsync(AppDbContext db)
{
    var updated = await db.Database.ExecuteSqlRawAsync(
        "UPDATE reservations SET pickup_preference = 'SantaMonica' WHERE pickup_preference = 'BeverlyHills'");
    if (updated > 0)
        Console.WriteLine($"Migrated {updated} reservation(s) from BeverlyHills to SantaMonica pickup.");
}

static async Task MigrateDatabaseWithRetryAsync(
    AppDbContext db,
    ILogger logger,
    CancellationToken cancellationToken = default)
{
    const int maxAttempts = 6;

    for (var attempt = 1; attempt <= maxAttempts; attempt++)
    {
        try
        {
            await db.Database.MigrateAsync(cancellationToken);
            logger.LogInformation("Database schema is up to date (EF Core migrations applied).");
            return;
        }
        catch (Exception ex) when (attempt < maxAttempts && IsTransientDatabaseException(ex))
        {
            var delaySeconds = Math.Min(30, (int)Math.Pow(2, attempt));
            logger.LogWarning(
                ex,
                "Database migration attempt {Attempt}/{MaxAttempts} failed; retrying in {DelaySeconds}s",
                attempt,
                maxAttempts,
                delaySeconds);
            await Task.Delay(TimeSpan.FromSeconds(delaySeconds), cancellationToken);
        }
    }
}

static bool IsTransientDatabaseException(Exception ex)
{
    for (var current = ex; current != null; current = current.InnerException)
    {
        if (current is NpgsqlException or System.Net.Sockets.SocketException or TimeoutException)
            return true;

        var message = current.Message;
        if (message.Contains("timeout", StringComparison.OrdinalIgnoreCase) ||
            message.Contains("connection", StringComparison.OrdinalIgnoreCase) ||
            message.Contains("no route to host", StringComparison.OrdinalIgnoreCase) ||
            message.Contains("transient", StringComparison.OrdinalIgnoreCase))
            return true;
    }

    return false;
}

app.UseMiddleware<ExceptionMiddleware>();

if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}

app.UseCors();
app.UseAuthentication();
app.UseAuthorization();
app.MapControllers();
app.MapHealthChecks("/health", new Microsoft.AspNetCore.Diagnostics.HealthChecks.HealthCheckOptions
{
    Predicate = registration => registration.Tags.Contains("live"),
});
app.MapHealthChecks("/health/ready", new Microsoft.AspNetCore.Diagnostics.HealthChecks.HealthCheckOptions
{
    Predicate = registration => registration.Tags.Contains("ready"),
});

app.Run();
