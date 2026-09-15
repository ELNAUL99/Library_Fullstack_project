using Microsoft.OpenApi.Models;
using Library.Models;
using Library.Db;
using Library.DTOs;
using Library.Services;
using Library.Middleware;
using System.Text.Json.Serialization;
using Microsoft.AspNetCore.Identity;
using Microsoft.IdentityModel.Tokens;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using System.Text;
using Microsoft.EntityFrameworkCore;

var builder = WebApplication.CreateBuilder(args);

static async Task SeedRolesAsync(IServiceProvider services)
{
    var roleManager = services.GetRequiredService<RoleManager<IdentityRole<int>>>();

    if (!await roleManager.RoleExistsAsync("CUSTOMER"))
    {
        await roleManager.CreateAsync(new IdentityRole<int>("CUSTOMER"));
    }

    if (!await roleManager.RoleExistsAsync("ADMIN"))
    {
        await roleManager.CreateAsync(new IdentityRole<int>("ADMIN"));
    }
}

// Promote known admin users on startup. Idempotent — safe to run on every boot.
static async Task SeedAdminUsersAsync(IServiceProvider services)
{
    var userManager = services.GetRequiredService<UserManager<User>>();
    var logger = services.GetRequiredService<ILogger<Program>>();

    // Match by (FirstName, LastName) and by email — covers both
    // "Luan Le" registered with any email and "admin@mail.com" itself.
    var admins = userManager.Users
        .Where(u =>
            (u.FirstName == "Luan" && u.LastName == "Le") ||
            u.Email == "admin@mail.com")
        .ToList();

    foreach (var user in admins)
    {
        if (!await userManager.IsInRoleAsync(user, "ADMIN"))
        {
            var result = await userManager.AddToRoleAsync(user, "ADMIN");
            if (result.Succeeded)
            {
                logger.LogInformation("Granted ADMIN role to {User} ({Email})",
                    user.UserName, user.Email);
            }
            else
            {
                logger.LogWarning("Failed to grant ADMIN to {User}: {Errors}",
                    user.UserName,
                    string.Join("; ", result.Errors.Select(e => e.Description)));
            }
        }
    }
}

// Add services to the container.
builder.Services
    .AddIdentity<User, IdentityRole<int>>(options =>
    {
        options.Password.RequiredLength = 6;
        // DON'T do this in production
        options.Password.RequireDigit = false;
        options.Password.RequireLowercase = false;
        options.Password.RequireUppercase = false;
        options.Password.RequireNonAlphanumeric = false;
    })
    .AddEntityFrameworkStores<AppDbContext>();

builder.Services
    .AddAuthentication(options =>
    {
        options.DefaultAuthenticateScheme = JwtBearerDefaults.AuthenticationScheme;
        options.DefaultChallengeScheme = JwtBearerDefaults.AuthenticationScheme;
        options.DefaultScheme = JwtBearerDefaults.AuthenticationScheme;
    })
    .AddJwtBearer(options =>
    {
        var secret = builder.Configuration["Jwt:Secret"];
        if (string.IsNullOrEmpty(secret))
        {
            throw new InvalidOperationException("JWT secret is not configured.");
        }

        options.TokenValidationParameters = new TokenValidationParameters()
        {
            ValidateIssuer = true,
            ValidateAudience = true,
            ValidateLifetime = true,
            ValidIssuer = builder.Configuration["Jwt:Issuer"],
            ValidAudience = builder.Configuration["Jwt:Audience"],
            IssuerSigningKey = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(secret))
        };
    });

builder.Services.AddDbContext<AppDbContext>(options =>
{
    var connectionString = builder.Configuration.GetConnectionString("DefaultConnection");
    options.UseNpgsql(connectionString);
});

builder.Services.AddScoped<IUserService, UserService>();
builder.Services.AddScoped<ITokenService, JwtTokenService>();
builder.Services.AddScoped<IBookService, BookService>();
builder.Services.AddScoped<IRentalService, RentalService>();
builder.Services.AddScoped<IRoleService, RoleService>();
builder.Services.AddScoped<ICrudService<Book, BookDTO>, BookService>();
builder.Services.AddScoped<ICrudService<Author, AuthorDTO>, AuthorService>();
builder.Services.AddScoped<ICrudService<Category, CategoryDTO>, CategoryService>();
builder.Services.AddScoped<ICrudService<Publisher, PublisherDTO>, PublisherService>();
builder.Services.AddScoped<ICrudService<Copy, CopyDTO>, CopyService>();
builder.Services.AddScoped<ICrudService<Rental, RentalDTO>, RentalService>();


//Handle enum type
builder.Services
    .AddControllers()
    .AddJsonOptions(options =>
    {
        options.JsonSerializerOptions.Converters.Add(new JsonStringEnumConverter());
        options.JsonSerializerOptions.ReferenceHandler = ReferenceHandler.IgnoreCycles;
        options.JsonSerializerOptions.DefaultIgnoreCondition = JsonIgnoreCondition.WhenWritingNull;
    });

// Learn more about configuring Swagger/OpenAPI at https://aka.ms/aspnetcore/swashbuckle
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();
builder.Services.AddCors(options =>
{
    // Allowed origins come from Cors:AllowedOrigins (comma-separated) so
    // production/staging can add their frontend URLs without a code change.
    // Falls back to localhost:3000 for local dev.
    var allowedOrigins = builder.Configuration
        .GetValue<string>("Cors:AllowedOrigins")
        ?.Split(',', StringSplitOptions.RemoveEmptyEntries | StringSplitOptions.TrimEntries)
        ?? new[] { "http://localhost:3000" };

    options.AddDefaultPolicy(policy =>
        policy
            .WithOrigins(allowedOrigins)
            .AllowAnyHeader()
            .AllowAnyMethod());
});

var app = builder.Build();

using (var scope = app.Services.CreateScope())
{
    // Apply any pending EF migrations on startup so a freshly-provisioned
    // database (e.g. a new Azure Postgres) gets the schema without a manual
    // `dotnet ef database update`.
    var dbContext = scope.ServiceProvider.GetRequiredService<AppDbContext>();
    await dbContext.Database.MigrateAsync();

    await SeedRolesAsync(scope.ServiceProvider);
    await SeedAdminUsersAsync(scope.ServiceProvider);
}


// Add exception middleware
app.UseMiddleware<ExceptionMiddleware>();

// Configure the HTTP request pipeline.
if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}

app.UseSwagger();
app.UseSwaggerUI(options =>
        {
            options.SwaggerEndpoint("/swagger/v1/swagger.json", "Demo");
            options.RoutePrefix = string.Empty;
        });

app.UseHttpsRedirection();

app.UseAuthentication();
app.UseAuthorization();

app.UseCors();

app.MapControllers();

app.Run();