namespace Library.Controllers;

using Library.Models;
using Library.DTOs;
using Library.Services;
using Microsoft.AspNetCore.Mvc;

[Route("Categories")]
public class CategoryController : CrudController<Category, CategoryDTO>
{
    public CategoryController(ICrudService<Category, CategoryDTO> service) : base(service)
    {
    }
}