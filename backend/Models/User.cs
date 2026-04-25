namespace Library.Models;

using Microsoft.AspNetCore.Identity;
using System.Text.Json.Serialization;

public class User : IdentityUser<int>
{
    public string FirstName { get; set; } = null!;
    public string LastName {get; set;} = null!;
    public string FullName 
    {
        get => $"{FirstName} {LastName}";
    }
    public ICollection<Rental> Rentals { get; set; } = null!;
}