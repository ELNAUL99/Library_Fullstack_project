namespace Library.Db;

using Library.Models;
using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata;

public static class ConfigExtension
{
    public static void AddUserConfig(this ModelBuilder builder)
    {
        builder.Entity<User>().ToTable("users");
        builder.Entity<IdentityRole<int>>().ToTable("roles");
        builder.Entity<IdentityRoleClaim<int>>().ToTable("role_claims");
        builder.Entity<IdentityUserClaim<int>>().ToTable("user_claims");
        builder.Entity<IdentityUserLogin<int>>().ToTable("user_logins");
        builder.Entity<IdentityUserToken<int>>().ToTable("user_tokens");
        builder.Entity<IdentityUserRole<int>>().ToTable("user_roles");

        builder.Entity<User>()
            .HasIndex(u => u.UserName)
            .IsUnique();
        
        builder.Entity<User>()
            .HasIndex(u => u.Email)
            .IsUnique();
    }

    public static void AddBookConfig(this ModelBuilder builder)
    {
        builder.Entity<Book>()
            .HasIndex(b => b.Title)
            .IsUnique();
        
        builder.Entity<Book>()
            .HasIndex(b => b.ISBN)
            .IsUnique();

        builder.Entity<Book>()
            .Navigation(b => b.Copies)
            .AutoInclude();
        
        builder.Entity<Book>()
            .Navigation(b => b.Authors)
            .AutoInclude();

        builder.Entity<Book>()
            .Navigation(b => b.Categories)
            .AutoInclude();
    }

    public static void AddCategoryConfig(this ModelBuilder builder)
    {
        builder.Entity<Category>()
            .HasIndex(category => category.Name)
            .IsUnique();
    }

    public static void AddAuthorConfig(this ModelBuilder builder)
    {
        builder.Entity<Author>()
            .HasIndex(author => author.Name)
            .IsUnique();        
    }

    public static void AddCopyConfig(this ModelBuilder builder)
    {
        builder.Entity<Copy>()
            .Navigation(copy => copy.Publisher)
            .AutoInclude();

        builder.Entity<Copy>()
            .Navigation(copy => copy.Book)
            .AutoInclude();
    }

    public static void AddRentalConfig(this ModelBuilder builder)
    {
        builder.Entity<Rental>()
            .HasOne(rental => rental.User)
            .WithMany(user => user.Rentals)
            .HasForeignKey(rental => rental.UserId)
            .OnDelete(DeleteBehavior.Cascade);

        builder.Entity<Rental>()
            .HasOne(rental => rental.Copy)
            .WithMany(copy => copy.Rentals)
            .HasForeignKey(rental => rental.CopyId)
            .OnDelete(DeleteBehavior.Cascade);
    }

    public static void AddTimeStampConfig(this ModelBuilder builder)
    {
        foreach (var entityType in builder.Model.GetEntityTypes())
        {
            var createdAtProperty = entityType.FindProperty("CreatedAt");
            if (createdAtProperty != null)
            {
                createdAtProperty.ValueGenerated = ValueGenerated.OnAdd;
                createdAtProperty.SetDefaultValueSql("CURRENT_TIMESTAMP");
            }

            var updatedAtProperty = entityType.FindProperty("UpdatedAt");
            if (updatedAtProperty != null)
            {
                updatedAtProperty.ValueGenerated = ValueGenerated.OnAddOrUpdate;
                updatedAtProperty.SetDefaultValueSql("CURRENT_TIMESTAMP");
            }
        }
    }
}