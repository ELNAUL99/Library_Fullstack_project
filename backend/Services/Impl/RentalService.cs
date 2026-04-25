namespace Library.Services;

using Library.Models;
using Library.DTOs;
using Library.Db;
using Microsoft.EntityFrameworkCore;

public class RentalService : IRentalService
{
    private readonly AppDbContext _dbContext;
    public RentalService(AppDbContext dbContext) => _dbContext = dbContext;

    public async Task<Rental?> CreateAsync(RentalDTO request)
    {
        var user = await _dbContext.Users.SingleOrDefaultAsync(user => user.Id == request.UserId);

        if (user is null)
        {
            return null;
        }

        var copy = await _dbContext.Copies.SingleOrDefaultAsync(copy => copy.Id == request.CopyId);
        
        if (copy is null)
        {
            return null;
        }
        copy.IsAvailable = false;

        var rental = new Rental()
            {
                CopyId = copy.Id,
                UserId = user.Id,
                DateRented = DateTime.Now,
                DueDate = DateTime.Now.AddMonths(1)
            };

        _dbContext.Rentals.Add(rental);

        await _dbContext.SaveChangesAsync();

        return rental;
    }

    public async Task<bool> DeleteAsync(int id)
    {
        var rental = await _dbContext.Rentals.SingleOrDefaultAsync(rental => rental.Id == id);
        if (rental is null)
        {
            return false;
        }
        return true;
    }

    public async Task<ICollection<Rental>> GetAllRentalsByUserIdAsync(int userId)
    {
        return await _dbContext.Rentals
            .AsNoTracking()
            .Where(rental => rental.UserId == userId)
            .ToListAsync();
    }

    public async Task<ICollection<Rental>> GetAllAsync(int page = 1, int pageSize = 30)
    {
        return await _dbContext.Rentals
            .AsNoTracking()
            .Skip((page - 1) * pageSize)
            .Take(pageSize)
            .ToListAsync();
    }

    public async Task<Rental?> GetAsync(int id)
    {
        return await _dbContext.FindAsync<Rental>(id);
    }

    public async Task<Rental?> UpdateAsync(int id, RentalDTO request)
    {
        var rental = await _dbContext.Rentals.SingleOrDefaultAsync(rental => rental.Id == id);
        
        if (rental == null)
        {
            return null;
        }
        if (rental.UserId != request.UserId)
        {
            return null;
        }
        if (request.Returned)
        {
            var copy = await _dbContext.Copies.SingleOrDefaultAsync(copy => copy.Id == rental.CopyId);
            if (copy is not  null)
            {
                copy.IsAvailable = true;
            }
        }

        request.UpdateModel(rental);
        await _dbContext.SaveChangesAsync();
        return rental;
    }

    public async Task<ICollection<Rental>> GetExpiredRentalsAsync(int? userId, int page = 1, int pageSize = 30)
    {
        return await _dbContext.Rentals
            .Where(rental => rental.DueDate < DateTime.Now)
            .Where(rental => userId == null ? true : rental.UserId == userId )
            .Skip((page - 1) * pageSize)
            .Take(pageSize)
            .AsNoTracking()
            .ToListAsync();
    }

    public async Task<ICollection<Rental>> GetNotExpiredRentalsAsync(int? userId, int page = 1, int pageSize = 30)
    {
        return await _dbContext.Rentals
            .Where(rental => rental.DueDate > DateTime.Now)
            .Where(rental => userId == null ? true : rental.UserId == userId )
            .Skip((page - 1) * pageSize)
            .Take(pageSize)
            .AsNoTracking()
            .ToListAsync();
    }
}