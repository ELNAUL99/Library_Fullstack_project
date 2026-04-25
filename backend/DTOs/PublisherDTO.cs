namespace Library.DTOs;

using System.ComponentModel.DataAnnotations;
using Library.Models;

public class PublisherDTO : BaseDTO<Publisher>
{
    [Required]
    public string Name {get; set;} = string.Empty;
    public string Phone {get; set;} = string.Empty;

    public override void UpdateModel(Publisher model)
    {
        model.Name = Name;
        model.Phone = Phone;
    }
}