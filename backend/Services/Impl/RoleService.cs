using Library.DTOs;
using Microsoft.AspNetCore.Identity;

namespace Library.Services;

public class RoleService : IRoleService
{
    private readonly RoleManager<IdentityRole<int>> _roleManager;
    public RoleService(RoleManager<IdentityRole<int>> roleManager) => _roleManager = roleManager;

    public async Task<int> AddRolesAsync(RoleDTO request)
    {
        int addedRoles = 0;
        foreach(string role in request.RoleNames)
        {
            if (!await _roleManager.RoleExistsAsync(role))
            {
                var result = await _roleManager.CreateAsync(new IdentityRole<int>() { Name = role});
                if (result.Succeeded)
                {
                    addedRoles++;
                }
            }
        }
        return addedRoles;
    }
    public async Task<ICollection<IdentityRole<int>>> GetRolesAsync(RoleDTO request)
    {
        ICollection<IdentityRole<int>> roles = new List<IdentityRole<int>>();
        foreach (var role in request.RoleNames)
        {
            var foundRole = await _roleManager.FindByNameAsync(role);
            if (foundRole != null) // Fix: Check for null before adding
            {
                roles.Add(foundRole);
            }
        }
        return roles;
    }
}