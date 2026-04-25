namespace Library.Services;

using Library.Models;
using Library.DTOs;
using Library.Db;

public class PublisherService : DbCrudService<Publisher, PublisherDTO>
{
    public PublisherService(AppDbContext dbContext) : base(dbContext)
    {
    }
}