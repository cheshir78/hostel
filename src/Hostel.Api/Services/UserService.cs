using Hostel.Api.Data;
using Hostel.Api.Models.DTOs;
using Hostel.Api.Models.Entities;
using Microsoft.EntityFrameworkCore;

namespace Hostel.Api.Services;

public class UserService : IUserService
{
    private readonly AppDbContext _context;

    public UserService(AppDbContext context)
    {
        _context = context;
    }

    public async Task<List<UserDto>> GetAllUsersAsync()
    {
        return await _context.Users
            .Include(u => u.Roles)
            .Select(u => new UserDto
            {
                Id = u.Id,
                Username = u.Username,
                Roles = u.Roles.Select(r => r.Name).ToList()
            })
            .ToListAsync();
    }

    public async Task<UserDto?> GetUserByIdAsync(long id)
    {
        var user = await _context.Users
            .Include(u => u.Roles)
            .FirstOrDefaultAsync(u => u.Id == id);

        if (user == null) return null;

        return new UserDto
        {
            Id = user.Id,
            Username = user.Username,
            Roles = user.Roles.Select(r => r.Name).ToList()
        };
    }

    public async Task<User?> FindByUsernameAsync(string username)
    {
        return await _context.Users
            .Include(u => u.Roles)
            .FirstOrDefaultAsync(u => u.Username == username);
    }

    public async Task<User?> ValidateUserCredentialsAsync(string username, string password)
    {
        var user = await FindByUsernameAsync(username);
        if (user == null) return null;

        bool isValid = false;
        try
        {
            isValid = BCrypt.Net.BCrypt.Verify(password, user.Password);
        }
        catch
        {
            isValid = false;
        }

        return isValid ? user : null;
    }

    public async Task<bool> RegisterUserAsync(RegistrationRequest request)
    {
        var exists = await _context.Users.AnyAsync(u => u.Username == request.Username);
        if (exists) return false;

        var roleUser = await _context.Roles.FirstOrDefaultAsync(r => r.Name == "ROLE_USER");
        if (roleUser == null)
        {
            roleUser = new Role { Id = 1, Name = "ROLE_USER" };
            _context.Roles.Add(roleUser);
        }

        var hashedPassword = BCrypt.Net.BCrypt.HashPassword(request.Password);

        var newUser = new User
        {
            Username = request.Username,
            Password = hashedPassword,
            Roles = new List<Role> { roleUser }
        };

        _context.Users.Add(newUser);
        await _context.SaveChangesAsync();
        return true;
    }

    public async Task<bool> DeleteUserAsync(long id)
    {
        var user = await _context.Users.Include(u => u.Roles).FirstOrDefaultAsync(u => u.Id == id);
        if (user == null) return false;

        _context.Users.Remove(user);
        await _context.SaveChangesAsync();
        return true;
    }

    public async Task<List<UserDto>> GetUsersGreaterThanIdAsync(long minId)
    {
        return await _context.Users
            .Include(u => u.Roles)
            .Where(u => u.Id > minId)
            .Select(u => new UserDto
            {
                Id = u.Id,
                Username = u.Username,
                Roles = u.Roles.Select(r => r.Name).ToList()
            })
            .ToListAsync();
    }

    public async Task<List<RoleDto>> GetUserRolesAsync(long userId)
    {
        var user = await _context.Users
            .Include(u => u.Roles)
            .FirstOrDefaultAsync(u => u.Id == userId);

        if (user == null) return new List<RoleDto>();

        return user.Roles.Select(r => new RoleDto { Id = r.Id, Name = r.Name }).ToList();
    }

    public async Task<List<RoleDto>> GetAllRolesAsync()
    {
        return await _context.Roles
            .Select(r => new RoleDto { Id = r.Id, Name = r.Name })
            .ToListAsync();
    }

    public async Task<bool> AddRoleToUserAsync(long userId, long roleId)
    {
        var user = await _context.Users.Include(u => u.Roles).FirstOrDefaultAsync(u => u.Id == userId);
        var role = await _context.Roles.FirstOrDefaultAsync(r => r.Id == roleId);

        if (user == null || role == null) return false;

        if (!user.Roles.Any(r => r.Id == roleId))
        {
            user.Roles.Add(role);
            await _context.SaveChangesAsync();
            return true;
        }

        return false;
    }

    public async Task<bool> RemoveRoleFromUserAsync(long userId, long roleId)
    {
        var user = await _context.Users.Include(u => u.Roles).FirstOrDefaultAsync(u => u.Id == userId);
        var role = await _context.Roles.FirstOrDefaultAsync(r => r.Id == roleId);

        if (user == null || role == null) return false;

        var existing = user.Roles.FirstOrDefault(r => r.Id == roleId);
        if (existing != null)
        {
            user.Roles.Remove(existing);
            await _context.SaveChangesAsync();
            return true;
        }

        return false;
    }
}
