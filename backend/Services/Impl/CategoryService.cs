namespace Library.Services;

using Library.Models;
using Library.Db;
using Library.DTOs;
using Microsoft.EntityFrameworkCore;

public class CategoryService : DbCrudService<Category, CategoryDTO>
{
    public CategoryService(AppDbContext dbContext) : base(dbContext)
    {
    }

    public override async Task<Category?> GetAsync(int id)
    {
        return await _dbContext.Categories
            .Include(category => category.Books)
            .FirstAsync(category => category.Id == id);
    }
}
