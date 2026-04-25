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

    // Books need their navigation properties hydrated so the frontend
    // can render category/author/publisher chips and copy info.
    private IQueryable<Book> BooksWithRelations() =>
        _dbContext.Books
            .Include(b => b.Authors)
            .Include(b => b.Categories)
            .Include(b => b.Copies)
                .ThenInclude(c => c.Publisher);

    // Copy has a back-reference to Book (Copy.Book), which forms a cycle
    // when included from Book. Plain AsNoTracking() can't handle that —
    // AsNoTrackingWithIdentityResolution keeps a single instance per key.
    public override async Task<ICollection<Book>> GetAllAsync(int page = 1, int pageSize = 30)
    {
        return await BooksWithRelations()
            .OrderBy(b => b.Id)
            .Skip((page - 1) * pageSize)
            .Take(pageSize)
            .AsNoTrackingWithIdentityResolution()
            .ToListAsync();
    }

    public override async Task<Book?> GetAsync(int id)
    {
        return await BooksWithRelations()
            .AsNoTrackingWithIdentityResolution()
            .SingleOrDefaultAsync(b => b.Id == id);
    }

    public async Task<ICollection<Book>> GetByAuthorAsync(int authorId)
    {
        return await BooksWithRelations()
            .Where(b => b.Authors.Any(a => a.Id == authorId))
            .AsNoTrackingWithIdentityResolution()
            .ToListAsync();
    }

    public async Task<ICollection<Book>> GetByCategoryAsync(int categoryId)
    {
        return await BooksWithRelations()
            .Where(b => b.Categories.Any(c => c.Id == categoryId))
            .AsNoTrackingWithIdentityResolution()
            .ToListAsync();
    }

    public async Task<ICollection<Book>> GetByPublisherAsync(int publisherId)
    {
        // A book is "from" a publisher if any of its copies were issued by them.
        return await BooksWithRelations()
            .Where(b => b.Copies.Any(c => c.PublisherId == publisherId))
            .AsNoTrackingWithIdentityResolution()
            .ToListAsync();
    }

    public async Task<ICollection<Book>> SearchAsync(string query)
    {
        if (string.IsNullOrWhiteSpace(query))
            return await GetAllAsync();

        var q = query.Trim().ToLower();
        return await BooksWithRelations()
            .Where(b => b.Title.ToLower().Contains(q) || b.ISBN.ToLower().Contains(q))
            .AsNoTrackingWithIdentityResolution()
            .ToListAsync();
    }

    public async Task<bool> AddAuthorToBook(int id, AddDTO request)
    {
        var book = await _dbContext.Books
            .Include(b => b.Authors)
            .SingleOrDefaultAsync(book => book.Id == id);
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
        var book = await _dbContext.Books
            .Include(b => b.Categories)
            .SingleOrDefaultAsync(book => book.Id == id);
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
