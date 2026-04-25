using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;
using Library.DTOs;
using Library.Models;
using Microsoft.AspNetCore.Identity;
using Microsoft.IdentityModel.Tokens;

namespace Library.Services;

public class JwtTokenService : ITokenService
{
    private readonly IConfiguration _config;
    private readonly UserManager<User> _userManager;

    public JwtTokenService(IConfiguration config, UserManager<User> userManager)
    {
        _config = config;
        _userManager = userManager;
    }

    public async Task<UserLoginResponseDTO> GenerateTokenAsync(User user)
    {
        var claims = new List<Claim>
        {
            new Claim(JwtRegisteredClaimNames.Sub, user.Id.ToString()),
            new Claim(JwtRegisteredClaimNames.Iat, DateTime.Now.ToString()),
            new Claim(JwtRegisteredClaimNames.Email, user.Email ?? string.Empty), // Fix: Handle null
            new Claim(JwtRegisteredClaimNames.Name, user.UserName ?? string.Empty), // Fix: Handle null
        };

        var roles = await _userManager.GetRolesAsync(user);
        foreach (var role in roles)
        {
            claims.Add(new Claim(ClaimTypes.Role, role));
        }

        string? secret = _config["Jwt:Secret"];
        if (string.IsNullOrEmpty(secret))
        {
            throw new InvalidOperationException("JWT secret is not configured.");
        }

        var loginKey = new SigningCredentials(
            new SymmetricSecurityKey(Encoding.UTF8.GetBytes(secret)),
            SecurityAlgorithms.HmacSha256
        );

        var expiration = DateTime.Now.AddHours(1);

        var token = new JwtSecurityToken(
            _config["Jwt:Issuer"],
            _config["Jwt:Audience"],
            claims,
            expires: expiration,
            signingCredentials: loginKey
        );

        var tokenWriter = new JwtSecurityTokenHandler();

        return new UserLoginResponseDTO
        {
            Token = tokenWriter.WriteToken(token),
            Expiration = expiration,
        };
    }

    public JwtSecurityToken ReadToken(string token)
    {
        var writer = new JwtSecurityTokenHandler();
        return writer.ReadJwtToken(token);
    }
}