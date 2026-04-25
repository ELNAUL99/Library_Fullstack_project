using System.Security.Claims;
using Library.DTOs;
using Library.Models;
using Library.Services;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace Library.Controllers;

public class UserController : ApiControllerBase
{
    private readonly IUserService _service;
    private readonly IRoleService _roleService;
    private readonly ITokenService _tokenService;
    private readonly ILogger<UserController> _logger;

    public UserController(IUserService service, IRoleService roleService, ITokenService tokenService, ILogger<UserController> logger)
    {
        _service = service;
        _roleService = roleService;
        _tokenService = tokenService;
        _logger = logger;
    }

    // POST api/v1/register
    [HttpPost("register")]
    [AllowAnonymous]
    public async Task<IActionResult> Register([FromBody] UserRegisterDTO userDto)
    {
        try
        {
            if (!ModelState.IsValid)
                return BadRequest(ModelState);

            var result = await _service.RegisterAsync(userDto);
            if (result == null)
                return BadRequest(new { message = "Username or email already exists" });
            
            return Ok(result);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "An error occurred during registration");
            return StatusCode(500, new { message = "An unexpected error occurred", details = ex.Message });
        }
    }

    // POST api/v1/login
    [HttpPost("login")]
    [AllowAnonymous]
    public async Task<IActionResult> Login([FromBody] UserLoginDTO loginDto)
    {
        try
        {
            var result = await _service.LoginAsync(loginDto);
            if (result == null)
            {
                return BadRequest("Invalid username or password");
            }
            return Ok(result);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "An error occurred while logging in");
            return StatusCode(StatusCodes.Status500InternalServerError, new {message = "An unexpected error occurred while logging in"});
        }
    }

    [HttpPut("{id:int}")]
    [Authorize]
    public async Task<ActionResult<User>> UserEditProfile(int id,[FromBody] UserUpdateDTO userUpdate)
    {
        try
        {
            if (!ModelState.IsValid)
                return BadRequest(ModelState);

            if (User.Identity?.Name != id.ToString())
                return Forbid();

            var user = await _service.UpdateUserAsync(userUpdate);
            if(user is null)
                return NotFound(new { message = "User not found or invalid credentials" });

            return Ok(user);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "An error occurred while updating user");
            return StatusCode(500, new { message = "An unexpected error occurred", details = ex.Message });
        }
    }

    [HttpPost("roles"), Authorize(Roles = "ADMIN")]
    public async Task<IActionResult> AddRole(RoleDTO request)
    {
        var amountAdded = await _roleService.AddRolesAsync(request);
        return Ok(new { Added = amountAdded });
    }

    [HttpPost("{id:int}/roles"), Authorize(Roles = "ADMIN")]
    public async Task<bool> AddRoleToUser([FromBody] RoleDTO request, [FromRoute] int id)
    {
        var roles = await _roleService.GetRolesAsync(request);
        var user = await _service.GetUserById(id);
        if (user is null)
        {
            return false;
        }
        return await _service.AssignRolesToUserAsync(
            roles.Select(role => role.Name).OfType<string>().ToArray(), 
            user
        );
    }

    [HttpGet("profile")]
    [Authorize]
    public async Task<IActionResult> GetUserProfile()
    {
        try
        {
            var userIdClaim = User.FindFirst(ClaimTypes.NameIdentifier);
            if (userIdClaim == null)
            {
                return BadRequest("User ID claim not found.");
            }
            
            var userIdString = userIdClaim.Value;
            if (string.IsNullOrEmpty(userIdString))
            {
                return BadRequest("User ID claim value is null or empty.");
            }
            
            if (!int.TryParse(userIdString, out int userId))
            {
                return BadRequest("User ID claim value is not a valid integer.");
            }
            
            var profile = await _service.GetUserProfileAsync(userId);
            if (profile == null)
            {
                return NotFound();
            }

            return Ok(profile);
        }
        catch (Exception)
        {
            return StatusCode(500, "Internal server error");
        }
    }
}