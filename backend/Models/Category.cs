namespace Library.Models;

public class Category : BaseModel
{
    public string Name { get; set; } = null!;
    public ICollection<Book> Books { get; set; } = null!;
}