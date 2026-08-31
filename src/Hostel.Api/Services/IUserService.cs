using Hostel.Api.Models.DTOs;
using Hostel.Api.Models.Entities;

namespace Hostel.Api.Services;

public interface IUserService
{
    Task<List<UserDto>> GetAllUsersAsync();
    Task<UserDto?> GetUserByIdAsync(long id);
    Task<User?> FindByUsernameAsync(string username);
    Task<User?> ValidateUserCredentialsAsync(string username, string password);
    Task<bool> RegisterUserAsync(RegistrationRequest request);
    Task<bool> DeleteUserAsync(long id);
    Task<List<UserDto>> GetUsersGreaterThanIdAsync(long minId);
    Task<List<RoleDto>> GetUserRolesAsync(long userId);
    Task<List<RoleDto>> GetAllRolesAsync();
    Task<bool> AddRoleToUserAsync(long userId, long roleId);
    Task<bool> RemoveRoleFromUserAsync(long userId, long roleId);
}
