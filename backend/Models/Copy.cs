namespace Library.Models;

public class Copy : BaseModel
{
    public int BookId { get; set; }
    public Book Book { get; set; } = null!;
    public int PublisherId {get; set;}
    public Publisher Publisher {get; set;} = null!;
    public string? Title 
    { 
        get => Book?.Title; 
    }
    public bool IsAvailable { get; set; } = true;
    public ICollection<Rental> Rentals { get; set; } = null!;
}