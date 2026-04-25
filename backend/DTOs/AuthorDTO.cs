namespace Library.DTOs;

using System.ComponentModel.DataAnnotations;
using Library.Models;

public class AuthorDTO : BaseDTO<Author>
{
    public string Name {get; set;} = null!;
    [DataType(DataType.DateTime)]
    public DateTime BirthDate {get; set;}
    public string Nationality {get; set;} = null!;
    public override void UpdateModel(Author model)
    {
        model.Name = Name;
        model.BirthDate = BirthDate;
        model.Nationality = Nationality;
    }
}