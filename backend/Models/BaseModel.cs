using System.ComponentModel.DataAnnotations;

namespace Library.Models;

public abstract class BaseModel
{
    [Key]
    public int Id {get; set;}
    public DateTime CreatedAt {get; set;} = DateTime.Now;
    public DateTime UpdatedAt {get; set;} = DateTime.Now;
}