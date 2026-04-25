namespace Library.Services;

using Library.Models;
using Library.DTOs;

public interface IBookService : ICrudService<Book, BookDTO>
{
    public Task<bool> AddCategoryToBook(int id, AddDTO request);
    public Task<bool> AddAuthorToBook(int id, AddDTO authorId);
}