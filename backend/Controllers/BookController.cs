namespace Library.Controllers;

using Library.Models;
using Library.DTOs;
using Library.Services;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Authorization;

public class BookController : CrudController<Book, BookDTO>
{
    private readonly IBookService _bookService;
    public BookController(IBookService bookService) : base(bookService)
    {
        _bookService = bookService;
    }

    [HttpPost("{id:int}/categories"), Authorize(Roles = "ADMIN")]
    public async Task<IActionResult> AddCategoryToBook([FromRoute] int id, [FromBody] AddDTO request)
    {
        try
        {
            var result = await _bookService.AddCategoryToBook(id, request);
            if (!result)
                return BadRequest(new { message = "Failed to add category to book" });
            return Ok(new { message = "Category added successfully" });
        }
        catch (Exception ex)
        {
            return StatusCode(500, new { message = "An error occurred", details = ex.Message });
        }
    }
    
    [HttpPost("{id:int}/authors"), Authorize(Roles = "Admin")]
    public async Task<IActionResult> AddAuthorToBook([FromRoute] int id, [FromBody] AddDTO request)
    {
        try
        {
            var result = await _bookService.AddAuthorToBook(id, request);
            if (!result)
                return BadRequest(new { message = "Failed to add author to book" });
            return Ok(new { message = "Author added successfully" });
        }
        catch (Exception ex)
        {
            return StatusCode(500, new { message = "An error occurred", details = ex.Message });
        }
    }

}