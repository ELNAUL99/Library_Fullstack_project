using Library.DTOs;
using System.Net;

namespace Library.Middleware;

public class ExceptionMiddleware
{
    private readonly RequestDelegate _next;
    private readonly ILogger<ExceptionMiddleware> _logger;

    public ExceptionMiddleware(RequestDelegate next, ILogger<ExceptionMiddleware> logger)
    {
        _next = next;
        _logger = logger;
    }

    public async Task InvokeAsync(HttpContext context)
    {
        try
        {
            await _next(context);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "An unhandled exception occurred");
            await HandleExceptionAsync(context, ex);
        }
    }

    private static Task HandleExceptionAsync(HttpContext context, Exception exception)
    {
        // If the response has already started (e.g. exception during
        // streaming serialization), headers are read-only — overwriting
        // them would throw a secondary error that masks the real one.
        // Best we can do is abort the connection.
        if (context.Response.HasStarted)
        {
            context.Abort();
            return Task.CompletedTask;
        }

        context.Response.ContentType = "application/json";
        context.Response.StatusCode = (int)HttpStatusCode.InternalServerError;

        var response = new ErrorResponseDTO
        {
            StatusCode = context.Response.StatusCode,
            Message = "An unexpected error occurred",
            Details = exception.Message
        };

        if (exception is ArgumentException argEx)
        {
            context.Response.StatusCode = (int)HttpStatusCode.BadRequest;
            response.StatusCode = (int)HttpStatusCode.BadRequest;
            response.Message = argEx.Message;
        }

        return context.Response.WriteAsJsonAsync(response);
    }
}
