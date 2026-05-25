using Microsoft.OpenApi.Models;
using Swashbuckle.AspNetCore.SwaggerGen;

namespace PacificLuxe.Api.Features.Auth;

/// <summary>
/// Marks admin API operations (except login) as requiring Bearer JWT in Swagger.
/// </summary>
public sealed class AdminAuthSwaggerOperationFilter : IOperationFilter
{
    public void Apply(OpenApiOperation operation, OperationFilterContext context)
    {
        var path = context.ApiDescription.RelativePath ?? "";
        if (!path.Contains("admin/", StringComparison.OrdinalIgnoreCase))
            return;
        if (path.Contains("admin/auth/login", StringComparison.OrdinalIgnoreCase))
            return;

        operation.Security ??= new List<OpenApiSecurityRequirement>();
        operation.Security.Add(new OpenApiSecurityRequirement
        {
            {
                new OpenApiSecurityScheme
                {
                    Reference = new OpenApiReference { Type = ReferenceType.SecurityScheme, Id = "Bearer" },
                },
                Array.Empty<string>()
            },
        });
    }
}
