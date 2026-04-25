namespace Library.Db;

using Library.Models;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Identity.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore;

public class AppDbContext : IdentityDbContext<User, IdentityRole<int>, int>
{
    static AppDbContext()
    {
        AppContext.SetSwitch("Npgsql.EnableLegacyTimestampBehavior", true);
    }

    private readonly IConfiguration _config;

    public AppDbContext(DbContextOptions<AppDbContext> options, IConfiguration config) : base(options)
    {
        _config = config;
        Books = Set<Book>();
        Authors = Set<Author>();
        Categories = Set<Category>();
        Copies = Set<Copy>();
        Rentals = Set<Rental>();
        Publishers = Set<Publisher>();
    }

    protected override void OnConfiguring(DbContextOptionsBuilder optionsBuilder)
    {
        base.OnConfiguring(optionsBuilder);

        var connString = _config.GetConnectionString("DefaultConnection");
        optionsBuilder
            .UseNpgsql(connString)
            .AddInterceptors(new AppDbContextSaveChangesInterceptor())
            .UseSnakeCaseNamingConvention();
    }

    protected override void OnModelCreating(ModelBuilder builder)
    {
        base.OnModelCreating(builder);

        builder.AddUserConfig();
        builder.AddAuthorConfig();
        builder.AddBookConfig();
        builder.AddCategoryConfig();
        builder.AddCopyConfig();
        builder.AddRentalConfig();
        builder.AddTimeStampConfig();
    }

    public DbSet<Book> Books {get; set;}
    public DbSet<Author> Authors {get; set;}
    public DbSet<Category> Categories {get; set;}
    public DbSet<Copy> Copies {get; set;}
    public DbSet<Rental> Rentals {get; set;}
    public DbSet<Publisher> Publishers {get; set;}
}