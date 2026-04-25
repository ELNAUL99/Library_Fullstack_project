using System.ComponentModel.DataAnnotations;
using Library.DTOs;

namespace Library.Models;

public class Rental : BaseModel
{
    public int UserId { get; set; }
    public User User { get; set; } = null!;
    public UserRegisterResponseDTO? UserInfo => User != null ? UserRegisterResponseDTO.FromUser(User) : null;
    public int CopyId { get; set; }
    public Copy Copy { get; set; } = null!;
    [Required]
    public DateTime DateRented { get; set; }
    public bool Returned { get; set; } = false;
    [Required]
    public DateTime DueDate {get; set;}
}