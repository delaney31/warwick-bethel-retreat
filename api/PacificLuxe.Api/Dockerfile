# Pacific Luxe Direct — ASP.NET Core 8 Web API (production)
#
# Render: Root Directory = api/PacificLuxe.Api  |  Dockerfile Path = Dockerfile
# Build context is this folder (same directory as PacificLuxe.Api.csproj).
#
# PORT: Render sets PORT; Program.cs binds http://0.0.0.0:$PORT

FROM mcr.microsoft.com/dotnet/sdk:8.0 AS build
WORKDIR /src

# Cache NuGet layer when only source changes
COPY PacificLuxe.Api.csproj .
RUN dotnet restore PacificLuxe.Api.csproj

COPY . .
RUN dotnet publish PacificLuxe.Api.csproj \
    -c Release \
    -o /app/publish \
    --no-restore

FROM mcr.microsoft.com/dotnet/aspnet:8.0 AS final
WORKDIR /app

ENV ASPNETCORE_ENVIRONMENT=Production

COPY --from=build /app/publish .

EXPOSE 8080

ENTRYPOINT ["dotnet", "PacificLuxe.Api.dll"]
