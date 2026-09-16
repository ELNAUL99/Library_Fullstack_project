# Multi-stage build so the final image is aspnet runtime only, not the SDK.

FROM mcr.microsoft.com/dotnet/sdk:7.0 AS build
WORKDIR /src

# Restore first, in its own layer, so unchanged deps don't bust the cache.
COPY backend.csproj ./
RUN dotnet restore backend.csproj

# Then the rest of the source.
COPY . ./
RUN dotnet publish backend.csproj -c Release -o /app/publish /p:UseAppHost=false


FROM mcr.microsoft.com/dotnet/aspnet:7.0 AS runtime
WORKDIR /app
COPY --from=build /app/publish ./

# App Runner routes traffic to whatever port the container listens on
# (default 8080). Bind Kestrel to 0.0.0.0:8080 explicitly.
ENV ASPNETCORE_URLS=http://0.0.0.0:8080
ENV ASPNETCORE_ENVIRONMENT=Production
EXPOSE 8080

ENTRYPOINT ["dotnet", "backend.dll"]
