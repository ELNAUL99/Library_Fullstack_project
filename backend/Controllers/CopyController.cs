namespace Library.Controllers;

using Library.Models;
using Library.DTOs;
using Library.Services;
using Microsoft.AspNetCore.Mvc;

[Route("Copies")]
public class CopyController : CrudController<Copy, CopyDTO>
{
    public CopyController(ICrudService<Copy, CopyDTO> service) : base(service)
    {
    }
}