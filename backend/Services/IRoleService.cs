using Library.DTOs;
using Microsoft.AspNetCore.Identity;

namespace Library.Services;

public interface IRoleService
{
    Task<int> AddRolesAsync(RoleDTO request);
    Task<ICollection<IdentityRole<int>>> GetRolesAsync(RoleDTO request);
}