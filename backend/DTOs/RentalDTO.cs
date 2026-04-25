namespace Library.DTOs;

using Library.Models;

public class RentalDTO : BaseDTO<Rental>
{
    public int Id { get; set; }
    public int UserId { get; set; }
    public int CopyId { get; set; }
    public bool Returned { get; set; }
    public DateTime DueDate { get; set; }

    public RentalDTO(Rental rental)
    {
        Id = rental.Id;
        UserId = rental.UserId;
        CopyId = rental.CopyId;
        DueDate = rental.DueDate;
        Returned = rental.Returned;
    }

    public override void UpdateModel(Rental rental)
    {
        rental.UserId = UserId;
        rental.CopyId = CopyId;
        rental.DueDate = DueDate;
        rental.Returned = Returned;
    }
}

