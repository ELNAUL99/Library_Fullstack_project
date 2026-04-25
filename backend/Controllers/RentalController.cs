using System.Security.Claims;
using Library.DTOs;
using Library.Models;
using Library.Services;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace Library.Controllers;

[Authorize]
public class RentalController : ApiControllerBase
{
    private readonly IRentalService _rentalService;
    private readonly ITokenService _tokenService;
    public RentalController (IRentalService rentalService, ITokenService tokenService)
    {
        _rentalService = rentalService;
        _tokenService = tokenService;
    }

    [HttpGet]
    [Authorize(Roles ="Admin")]
    public async Task<ActionResult<IEnumerable<RentalDTO>>> GetAllRentals()
    {
        var rentals = await _rentalService.GetAllAsync();

            if (!rentals.Any())
            {
                return NotFound();
            }

            return Ok(rentals);

    }

    [HttpGet("{id}")]
    public async Task<ActionResult<RentalDTO>> GetRentalById(int id)
    {
        var rental = await _rentalService.GetAsync(id);

        if (rental == null)
        {
            return NotFound();
        }

        return Ok(rental);
    }

    [HttpPost]
    public async Task<ActionResult<RentalDTO>> CreateRental(RentalDTO rentalDto)
    {
        var userId = Convert.ToInt32(User.FindFirstValue("sub"));
        var rental = await _rentalService.CreateAsync(rentalDto);
        if(rental is null)
        {
            return NotFound();
        }
        return CreatedAtAction(nameof(GetRentalById), new { id = rental.Id }, rental);
    }

    [HttpPut("{id:int}")]
    [Authorize]
    public async Task<Rental?> UpdateLoan([FromRoute] int id, [FromBody] RentalDTO request)
    {
        return await _rentalService.UpdateAsync(id, request);
    }

    [HttpDelete("{id:int}")]
    [Authorize("Admin")]
    public async Task<bool> DeleteLoan([FromRoute] int id)
    {
        return await _rentalService.DeleteAsync(id);
    }

    [HttpGet("user/all")]
    public async Task<ActionResult<IEnumerable<RentalDTO>>> GetAllRentalsByUserIdAsync()
    {
        var userId = Convert.ToInt32(User.FindFirstValue("sub"));
        var rentals = await _rentalService.GetAllRentalsByUserIdAsync(userId);

        if (!rentals.Any())
        {
            return NotFound();
        }

        return Ok(rentals);
    }

    [HttpGet("user/{userId}/all")]
    [Authorize(Roles = "Admin")]
    public async Task<ActionResult<IEnumerable<RentalDTO>>> GetAllRentalsByUserIdAsync(int userId)
    {
        var rentals = await _rentalService.GetAllRentalsByUserIdAsync(userId);

        if (!rentals.Any())
        {
            return NotFound();
        }

        return Ok(rentals);
    }

    [HttpGet("expired")]
    [Authorize(Roles = "Admin")]
    public async Task<ActionResult<IEnumerable<RentalDTO>>> GetExpiredRentalsAsync([FromQuery] int page = 1, [FromQuery] int pageSize = 50)
    {
        var rentals = await _rentalService.GetExpiredRentalsAsync(null, page, pageSize);

        if (!rentals.Any())
        {
            return NotFound();
        }

        return Ok(rentals);
    }

    [HttpGet("notexpired")]
    [Authorize(Roles = "Admin")]
    public async Task<ActionResult<IEnumerable<RentalDTO>>> GetNotExpiredRentalsAsync([FromQuery] int page = 1, [FromQuery] int pageSize = 50)
    {
        var rentals = await _rentalService.GetNotExpiredRentalsAsync(null, page, pageSize);

        if (!rentals.Any())
        {
            return NotFound();
        }

        return Ok(rentals);
    }
}