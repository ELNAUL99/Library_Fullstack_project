namespace Library.Models;

using System.Text.Json.Serialization;

public class Copy : BaseModel
{
    public int BookId { get; set; }

    // Back-reference; not serialized — when a Copy is returned as part of
    // a Book payload, the parent Book is already on the wire above it.
    [JsonIgnore]
    public Book Book { get; set; } = null!;

    public int PublisherId { get; set; }
    public Publisher Publisher { get; set; } = null!;
    public string? Title
    {
        get => Book?.Title;
    }
    public bool IsAvailable { get; set; } = true;

    [JsonIgnore]
    public ICollection<Rental> Rentals { get; set; } = null!;
}