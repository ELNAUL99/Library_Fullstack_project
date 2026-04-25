using System.ComponentModel.DataAnnotations;

namespace Library.Models;
public class Book : BaseModel
{
    [MinLength(2)]
    [MaxLength(50)]
    public string Title { get; set; } = null!;
    public string ISBN { get; set; } = null!;
    [MaxLength(500)]
    public string? Description { get; set; } 
    public int TotalCopies { get => Copies == null ? 0 : Copies.Count(); }
    public int TotalCopiesAvailable { get => Copies == null ? 0 : Copies.Where(copy => copy.IsAvailable).Count();}
    public ICollection<Publisher>? Publishers { get => Copies?.Select(copy => copy.Publisher).Distinct().ToList();}
    public ICollection<Author> Authors {get; set;} = null!;
    public ICollection<Copy> Copies { get; set; } = null!;
    public ICollection<Category> Categories {get; set;} = null!;
}