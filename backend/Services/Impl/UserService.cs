using Library.DTOs;
using Library.Models;
using Microsoft.AspNetCore.Identity;

namespace Library.Services;

public class UserService : IUserService
{
    private readonly UserManager<User> _userManager;
    private readonly ITokenService _tokenService;

    public UserService(UserManager<User> userManager, ITokenService tokenService)
    {
        _userManager = userManager;
        _tokenService = tokenService;
    }

    public async Task<User?> RegisterAsync(UserRegisterDTO request)
    {
        var user = new User
        {
            FirstName = request.FirstName,
            LastName = request.LastName,
            UserName = request.UserName,
            Email = request.Email,
        };

        var result = await _userManager.CreateAsync(user, request.Password);
        if(!result.Succeeded)
        {
            var errors = result.Errors.Select(e => e.Description);
            throw new ApplicationException($"Unable to create user: {string.Join(", ", errors)}");
        }

        if (request.Email == "admin@mail.com")
        {
            await _userManager.AddToRoleAsync(user, "ADMIN");
        }
        else
        {
            await _userManager.AddToRoleAsync(user, "CUSTOMER");
        }
        return user;
    }

    public async Task<bool> AssignRolesToUserAsync(string[] roles, User user)
    {
        var result = await _userManager.AddToRolesAsync(user, roles);
        return result.Succeeded;
    }

    public async Task<UserLoginResponseDTO?> LoginAsync(UserLoginDTO request)
    {
         var user = await _userManager.FindByNameAsync(request.UserName);
        if (user is null)
        {
            return null;
        }
        if (!await _userManager.CheckPasswordAsync(user, request.Password))
        {
            return null;
        }
        return await _tokenService.GenerateTokenAsync(user);
    }

    public async Task<User?> GetUserById (int id)
    {
        return await _userManager.FindByIdAsync(id.ToString());
    }

    public async Task<UserProfileDTO?> GetUserProfileAsync(int id)
    {
        var user = await _userManager.FindByIdAsync(id.ToString());
        if (user is null)
        {
            return null;
        }
        var roles = await _userManager.GetRolesAsync(user);
        return new UserProfileDTO
        {
            Id = user.Id,
            Username = user.UserName ?? string.Empty,
            Email = user.Email ?? string.Empty,
            FirstName = user.FirstName,
            LastName = user.LastName,
            Roles = roles
        };
    }

    public async Task<User?> UpdateUserAsync(UserUpdateDTO request)
    {
        var user = await _userManager.FindByEmailAsync(request.Email);
        if (user is null || !await _userManager.CheckPasswordAsync(user, request.Password))
        {
            return null;
        }
        if (request.NewPassword != null)
        {
            await _userManager.ChangePasswordAsync(user, request.Password, request.NewPassword);
        }
        request.UpdateUser(user);

        await _userManager.UpdateAsync(user);
        return user;
    }
}