namespace Library.Controllers;

using Library.Models;
using Library.DTOs;
using Library.Services;
using Microsoft.AspNetCore.Mvc;

[Route("Publishers")]
public class PublisherController : CrudController<Publisher, PublisherDTO>
{
    public PublisherController(ICrudService<Publisher, PublisherDTO> service) : base(service)
    {
    }
}