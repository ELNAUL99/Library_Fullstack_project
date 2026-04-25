namespace Library.Models;

using System.Text.Json.Serialization;

public class Publisher : BaseModel
{
    public string Name { get; set; } = null!;
    public string Phone { get; set; } = null!;
    public ICollection<Book> Books { get; set; } = null!;
}