namespace Library.Services;

using Library.Models;
using Library.DTOs;
using System.Threading.Tasks;
using Library.Db;
using Microsoft.EntityFrameworkCore;

public class DbCrudService<TModel, TDto> : ICrudService<TModel, TDto>
    where TModel : BaseModel, new()
    where TDto : BaseDTO<TModel>
{
    protected readonly AppDbContext _dbContext;

    public DbCrudService(AppDbContext dbContext)
    {
        _dbContext = dbContext;
    }

    public async Task<TModel?> CreateAsync(TDto request)
    {
        TModel item = new();
        request.UpdateModel(item);
        _dbContext.Add(item);
        await _dbContext.SaveChangesAsync();
        return item;
    }

    public async Task<bool> DeleteAsync(int id)
    {
        var item = await _dbContext.FindAsync<TModel>(id);
        if(item is null)
        {
            return false;
        }
        _dbContext.Remove(item);
        await _dbContext.SaveChangesAsync();
        return true;
    }

    public virtual async Task<PaginatedResponseDTO<TModel>> GetAllAsync(int page = 1, int pageSize = 30)
    {
        if (page < 1) page = 1;
        if (pageSize < 1) pageSize = 30;

        var query = _dbContext.Set<TModel>();
        var total = await query.CountAsync();
        var items = await query
            .OrderBy(e => e.Id)
            .Skip((page - 1) * pageSize)
            .Take(pageSize)
            .AsNoTracking()
            .ToListAsync();

        return new PaginatedResponseDTO<TModel>
        {
            Items = items,
            CurrentPage = page,
            PageSize = pageSize,
            TotalItems = total,
        };
    }

    public virtual async Task<TModel?> GetAsync(int id)
    {
        return await _dbContext.Set<TModel>().FindAsync(id);
    }

    public async Task<TModel?> UpdateAsync(int id, TDto request)
    {
        var item = await GetAsync(id);
        if (item is null)
        {
            return null;
        }
        request.UpdateModel(item);
        await _dbContext.SaveChangesAsync();
        return item;
    }
}