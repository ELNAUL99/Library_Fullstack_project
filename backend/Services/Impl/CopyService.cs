namespace Library.Services;

using Library.Models;
using Library.DTOs;
using Library.Db;

public class CopyService : DbCrudService<Copy, CopyDTO>
{
    public CopyService (AppDbContext dbContext) : base(dbContext)
    {
    }
}