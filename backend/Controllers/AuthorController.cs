namespace Library.Controllers;

using Library.Models;
using Library.DTOs;
using Library.Services;

public class AuthorController : CrudController<Author, AuthorDTO>
{
    public AuthorController(ICrudService<Author, AuthorDTO> service) : base(service)
    {
    }
}