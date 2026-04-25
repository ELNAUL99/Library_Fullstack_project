using System.ComponentModel.DataAnnotations;

namespace Library.DTOs;

public class AddDTO
{
    [Required]
    public int AddId { get; set; }
}
