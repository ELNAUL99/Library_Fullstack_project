namespace Library.Services;

using Library.Models;
using Library.DTOs;

public interface IRentalService : ICrudService<Rental, RentalDTO>
{
    Task<ICollection<Rental>> GetAllRentalsByUserIdAsync(int userId);
    Task<ICollection<Rental>> GetExpiredRentalsAsync(int? userId, int page = 1, int pageSize = 30);
    Task<ICollection<Rental>> GetNotExpiredRentalsAsync(int? userId, int page = 1, int pageSize = 30);
}