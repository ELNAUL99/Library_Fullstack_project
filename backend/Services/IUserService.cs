using Library.DTOs;
using Library.Models;

namespace Library.Services;

public interface IUserService
{
    Task<User?> RegisterAsync(UserRegisterDTO request);
    Task<UserLoginResponseDTO?> LoginAsync(UserLoginDTO request);
    Task<User?> GetUserById (int id);
    Task<UserProfileDTO?> GetUserProfileAsync(int id);
    Task<User?> UpdateUserAsync (UserUpdateDTO request);
    Task<bool> AssignRolesToUserAsync(string[] roles, User user);
}