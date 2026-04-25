namespace Library.Services;

using Library.Models;
using Library.DTOs;

public interface IBookService : ICrudService<Book, BookDTO>
{
    public Task<bool> AddCategoryToBook(int id, AddDTO request);
    public Task<bool> AddAuthorToBook(int id, AddDTO authorId);
    public Task<ICollection<Book>> GetByAuthorAsync(int authorId);
    public Task<ICollection<Book>> GetByCategoryAsync(int categoryId);
    public Task<ICollection<Book>> GetByPublisherAsync(int publisherId);
    public Task<ICollection<Book>> SearchAsync(string query);
}
