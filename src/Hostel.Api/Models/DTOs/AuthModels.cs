using System.ComponentModel.DataAnnotations;

namespace Hostel.Api.Models.DTOs;

public class LoginRequest
{
    [Required]
    public string Username { get; set; } = string.Empty;

    [Required]
    public string Password { get; set; } = string.Empty;
}

public class RegistrationRequest
{
    [Required]
    public string Username { get; set; } = string.Empty;

    [Required]
    public string Password { get; set; } = string.Empty;

    public string? PasswordConfirm { get; set; }
}

public class AuthResponse
{
    public string Token { get; set; } = string.Empty;
    public string Username { get; set; } = string.Empty;
    public List<string> Roles { get; set; } = new();

    public AuthResponse() { }

    public AuthResponse(string token)
    {
        Token = token;
    }

    public AuthResponse(string token, string username, List<string> roles)
    {
        Token = token;
        Username = username;
        Roles = roles;
    }
}

public class UserDto
{
    public long Id { get; set; }
    public string Username { get; set; } = string.Empty;
    public List<string> Roles { get; set; } = new();
}

public class RoleDto
{
    public long Id { get; set; }
    public string Name { get; set; } = string.Empty;
}

public class AssignRoleRequest
{
    public long UserId { get; set; }
    public long RoleId { get; set; }
    public string? Action { get; set; } // "add" or "delete"
}
