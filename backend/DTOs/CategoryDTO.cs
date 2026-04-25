namespace Library.DTOs;

using System.ComponentModel.DataAnnotations;
using Library.Models;

public class CategoryDTO : BaseDTO<Category>
{
    [MinLength(5, ErrorMessage = "Too short, at least 5 characters")]
    public string Name {get; set;} = string.Empty;

    public override void UpdateModel(Category model)
    {
        model.Name = Name;
    }
}