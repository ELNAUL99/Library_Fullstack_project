namespace Library.Models;

using System.Text.Json.Serialization;

public class Category : BaseModel
{
    public string Name { get; set; } = null!;

    // Back-reference; not serialized to avoid cycling through the book graph.
    [JsonIgnore]
    public ICollection<Book> Books { get; set; } = null!;
}