namespace Library.Models;

public class Author : BaseModel
{
    public string Name { get; set; } = null!;
    public DateTime BirthDate { get; set; }
    public string Nationality { get; set; } = null!;
    public ICollection<Book> Books { get; set; } = null!;
}
