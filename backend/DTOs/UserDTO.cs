using System.ComponentModel.DataAnnotations;
using Library.Models;

namespace Library.DTOs;

public class UserBaseDTO
{
    [Required(ErrorMessage = "First name is required.")]
    [StringLength(50, MinimumLength = 2, ErrorMessage = "First name must be between 2 and 50 characters.")]
    public string FirstName { get; set; } = null!;

    [Required(ErrorMessage = "Last name is required.")]
    [StringLength(50, MinimumLength = 2, ErrorMessage = "Last name must be between 2 and 50 characters.")]
    public string LastName { get; set; } = null!;

    [Required(ErrorMessage = "Username is required.")]
    [StringLength(50, MinimumLength = 3, ErrorMessage = "Username must be between 3 and 50 characters.")]
    public string UserName { get; set; } = null!;

    [Required(ErrorMessage = "Email is required.")]
    [EmailAddress(ErrorMessage = "Invalid email address.")]
    public string Email { get; set; } = null!;
}

public class UserUpdateDTO : UserBaseDTO
{
    [Required(ErrorMessage = "Password is required.")]
    [StringLength(100, MinimumLength = 6, ErrorMessage = "Password must be at least 6 characters long.")]
    public string Password { get; set; } = null!;

    [StringLength(100, MinimumLength = 6, ErrorMessage = "New password must be at least 6 characters long.")]
    public string? NewPassword { get; set; }

    public void UpdateUser(Models.User user)
    {
        user.UserName = UserName;
        user.FirstName = FirstName;
        user.LastName = LastName;
        user.Email = Email;
    }
}

public class UserRegisterResponseDTO : UserBaseDTO
{
    public static UserRegisterResponseDTO FromUser(User user)
    {
        return new UserRegisterResponseDTO
        {
            FirstName = user.FirstName ?? string.Empty,
            LastName = user.LastName ?? string.Empty,
            UserName = user.UserName ?? string.Empty,
            Email = user.Email ?? string.Empty,
        };
    }
}

public class UserRegisterDTO : UserBaseDTO
{
    [Required(ErrorMessage = "Password is required.")]
    [StringLength(100, MinimumLength = 6, ErrorMessage = "Password must be at least 6 characters long.")]
    public string Password { get; set; } = null!;
}

public class UserLoginDTO
{
    [Required(ErrorMessage = "Username is required.")]
    public string UserName { get; set; } = null!;

    [Required(ErrorMessage = "Password is required.")]
    public string Password { get; set; } = null!;
}

public class UserLoginResponseDTO
{
    public string Token { get; set; } = null!;
    public DateTime Expiration { get; set; }
}

public class UserProfileDTO
{
    public int Id { get; set; }
    public string Username { get; set; } = null!;
    public string Email { get; set; } = null!;
    public string FirstName { get; set; } = null!;
    public string LastName { get; set; } = null!;
    public IList<string> Roles { get; set; } = new List<string>();
}