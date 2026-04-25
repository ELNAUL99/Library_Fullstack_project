namespace Library.DTOs;

using System.ComponentModel.DataAnnotations;
using Library.Models;

public class BookDTO : BaseDTO<Book>
{
    [Required]
    public string Title {get; set;} = string.Empty;

    [Required]
    [MinLength(9, ErrorMessage = "ISBN should be at least 9 digits")]
    public string ISBN {get; set;} = string.Empty;

    public override void UpdateModel(Book model)
    {
        model.Title = Title;
        model.ISBN = ISBN;
    }
}