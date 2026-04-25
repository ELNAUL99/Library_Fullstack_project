namespace Library.DTOs;

using Library.Models;

public class CopyDTO : BaseDTO<Copy>
{
    public int BookId {get; set;}
    public int PublisherId {get; set;}

    public override void UpdateModel(Copy model)
    {
        model.BookId = BookId;
        model.PublisherId = PublisherId;
    }
}