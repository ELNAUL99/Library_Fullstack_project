namespace Library.Services;

using Library.DTOs;
using Library.Models;

public interface ICrudService<TModel, TDto>
{
    Task<TModel?> CreateAsync(TDto request);
    Task<TModel?> GetAsync(int id);
    Task<TModel?> UpdateAsync(int id, TDto request);
    Task<bool> DeleteAsync(int id);
    Task<PaginatedResponseDTO<TModel>> GetAllAsync(int page = 1, int pageSize = 30);
}
