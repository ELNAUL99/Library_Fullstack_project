using Microsoft.AspNetCore.Builder;
using Microsoft.AspNetCore.Cors.Infrastructure;

namespace Library.Db;

public static class CorsExtension
{
    public static IApplicationBuilder UseCorsWithAllowedOrigins(this IApplicationBuilder app)
    {
        var allowedOrigins = new[] 
        { 
            "http://localhost:3000",
            "http://localhost:5000",
            "https://localhost:7000"
        };

        app.UseCors(builder =>
        {
            builder
                .WithOrigins(allowedOrigins)
                .AllowAnyHeader()
                .AllowAnyMethod()
                .AllowCredentials();
        });

        return app;
    }
}
