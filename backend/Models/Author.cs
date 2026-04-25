namespace Library.Models;

using System.Text.Json.Serialization;

public class Author : BaseModel
{
    public string Name { get; set; } = null!;
    public DateTime BirthDate { get; set; }
    public string Nationality { get; set; } = null!;

    // Back-reference; do not serialize, otherwise the response cycles
    // back through the book graph.
    [JsonIgnore]
    public ICollection<Book> Books { get; set; } = null!;
}
