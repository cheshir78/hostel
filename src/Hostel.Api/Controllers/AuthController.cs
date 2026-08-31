using System.Security.Claims;
using Hostel.Api.Models.DTOs;
using Hostel.Api.Services;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace Hostel.Api.Controllers;

[ApiController]
public class AuthController : ControllerBase
{
    private readonly IUserService _userService;
    private readonly IJwtService _jwtService;

    public AuthController(IUserService userService, IJwtService jwtService)
    {
        _userService = userService;
        _jwtService = jwtService;
    }

    [HttpPost("register")]
    [HttpPost("api/auth/register")]
    public async Task<IActionResult> Register([FromBody] RegistrationRequest request)
    {
        if (!ModelState.IsValid)
        {
            return BadRequest(new ErrorModel { Message = "Invalid registration data" });
        }

        if (!string.IsNullOrEmpty(request.PasswordConfirm) && request.Password != request.PasswordConfirm)
        {
            return BadRequest(new ErrorModel { Message = "Пароли не совпадают" });
        }

        var success = await _userService.RegisterUserAsync(request);
        if (!success)
        {
            return BadRequest(new ErrorModel { Message = "Пользователь с таким именем уже существует" });
        }

        return Ok("OK");
    }

    [HttpPost("auth")]
    [HttpPost("api/auth/login")]
    public async Task<IActionResult> Auth([FromBody] LoginRequest request)
    {
        if (!ModelState.IsValid)
        {
            return BadRequest(new ErrorModel { Message = "Username and password are required" });
        }

        var user = await _userService.ValidateUserCredentialsAsync(request.Username, request.Password);
        if (user == null)
        {
            return Unauthorized(new ErrorModel { Message = "Invalid username or password" });
        }

        var token = _jwtService.GenerateToken(user);
        var roles = user.Roles.Select(r => r.Name).ToList();

        return Ok(new AuthResponse(token, user.Username, roles));
    }

    [Authorize]
    [HttpGet("api/auth/me")]
    public async Task<IActionResult> GetCurrentUser()
    {
        var username = User.Identity?.Name;
        if (string.IsNullOrEmpty(username))
        {
            return Unauthorized();
        }

        var user = await _userService.FindByUsernameAsync(username);
        if (user == null)
        {
            return NotFound();
        }

        return Ok(new UserDto
        {
            Id = user.Id,
            Username = user.Username,
            Roles = user.Roles.Select(r => r.Name).ToList()
        });
    }
}
