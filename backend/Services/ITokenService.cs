namespace Library.Services;

using Library.Models;
using Library.DTOs;
using System.IdentityModel.Tokens.Jwt;

public interface ITokenService
{
    Task<UserLoginResponseDTO> GenerateTokenAsync(User user);
    JwtSecurityToken ReadToken(string token);
}