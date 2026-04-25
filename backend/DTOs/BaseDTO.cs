namespace Library.DTOs;

public abstract class BaseDTO<TModel>
{
    public abstract void UpdateModel(TModel model);
}