namespace Library.Services;

using Library.Models;
using Library.DTOs;
using Library.Db;
using Microsoft.EntityFrameworkCore;

public class AuthorService : DbCrudService<Author, AuthorDTO>
{
    public AuthorService(AppDbContext dbContext) : base(dbContext)
    {
    }

    public override async Task<Author?> GetAsync (int id)
    {
        return await _dbContext.Authors
            .Include(author => author.Books)
            .FirstAsync(author => author.Id == id );
    }
}