namespace Library.Models;

using System.Text.Json.Serialization;

public class Publisher : BaseModel
{
    public string Name { get; set; } = null!;
    public string Phone { get; set; } = null!;

    // Back-reference; not serialized to avoid cycling through the book graph.
    [JsonIgnore]
    public ICollection<Book> Books { get; set; } = null!;
}