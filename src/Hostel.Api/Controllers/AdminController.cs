using Hostel.Api.Models.DTOs;
using Hostel.Api.Services;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace Hostel.Api.Controllers;

[ApiController]
[Authorize(Roles = "ROLE_ADMIN")]
public class AdminController : ControllerBase
{
    private readonly IUserService _userService;

    public AdminController(IUserService userService)
    {
        _userService = userService;
    }

    [HttpGet("admin")]
    [HttpGet("api/admin/users")]
    public async Task<ActionResult<List<UserDto>>> GetUsers()
    {
        var users = await _userService.GetAllUsersAsync();
        return Ok(users);
    }

    [HttpGet("admin/gt/{userId}")]
    [HttpGet("api/admin/users/gt/{userId}")]
    public async Task<ActionResult<List<UserDto>>> GetUsersGreaterThan(long userId)
    {
        var users = await _userService.GetUsersGreaterThanIdAsync(userId);
        return Ok(users);
    }

    [HttpDelete("api/admin/users/{userId}")]
    [HttpPost("admin")]
    public async Task<IActionResult> DeleteUser([FromRoute] long? userId, [FromQuery] long? id, [FromQuery] string? action)
    {
        long targetId = userId ?? id ?? 0;
        if (targetId <= 0)
        {
            return BadRequest(new ErrorModel { Message = "User ID is required" });
        }

        var success = await _userService.DeleteUserAsync(targetId);
        if (!success)
        {
            return NotFound(new ErrorModel { Message = "User not found" });
        }

        return Ok(new { success = true });
    }

    [HttpGet("admin/userrole/{userId}")]
    [HttpGet("api/admin/users/{userId}/roles")]
    public async Task<ActionResult<List<RoleDto>>> GetUserRoles(long userId)
    {
        var user = await _userService.GetUserByIdAsync(userId);
        if (user == null)
        {
            return NotFound(new ErrorModel { Message = "User not found" });
        }

        var roles = await _userService.GetUserRolesAsync(userId);
        return Ok(roles);
    }

    [HttpGet("admin/userroleadd/{userId}")]
    [HttpGet("api/admin/roles")]
    public async Task<ActionResult<List<RoleDto>>> GetAllRoles()
    {
        var roles = await _userService.GetAllRolesAsync();
        return Ok(roles);
    }

    [HttpPost("admin/userroleadd")]
    [HttpPost("api/admin/users/{userId}/roles/{roleId}")]
    public async Task<IActionResult> AddRoleToUser(long userId, long roleId)
    {
        var success = await _userService.AddRoleToUserAsync(userId, roleId);
        if (!success)
        {
            return BadRequest(new ErrorModel { Message = "Failed to add role to user or role already assigned" });
        }

        return Ok(new { success = true });
    }

    [HttpPost("admin/userrole")]
    [HttpDelete("api/admin/users/{userId}/roles/{roleId}")]
    public async Task<IActionResult> RemoveRoleFromUser(long userId, long roleId)
    {
        var success = await _userService.RemoveRoleFromUserAsync(userId, roleId);
        if (!success)
        {
            return BadRequest(new ErrorModel { Message = "Failed to remove role from user" });
        }

        return Ok(new { success = true });
    }
}
