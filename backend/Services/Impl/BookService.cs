namespace Library.Services;

using Library.Models;
using Library.DTOs;
using Library.Db;
using Microsoft.EntityFrameworkCore;

public class BookService : DbCrudService<Book, BookDTO>, IBookService
{
    public BookService(AppDbContext dbContext) : base(dbContext)
    {
    }

    public async Task<bool> AddAuthorToBook(int id, AddDTO request)
    {
        var book = await _dbContext.Books.SingleOrDefaultAsync(book => book.Id == id);
        var author = await _dbContext.Authors.SingleOrDefaultAsync(author => author.Id == request.AddId);

        if (book is null || author is null)
        {
            return false;
        }

        book.Authors.Add(author);
        await _dbContext.SaveChangesAsync();
        return true;
    }

    public async Task<bool> AddCategoryToBook(int id, AddDTO request)
    {
        var book = await _dbContext.Books.SingleOrDefaultAsync(book => book.Id == id);
        var category = await _dbContext.Categories.SingleOrDefaultAsync(category => category.Id == request.AddId);

        if (book is null || category is null)
        {
            return false;
        }

        book.Categories.Add(category);
        await _dbContext.SaveChangesAsync();
        return true;
    }
}