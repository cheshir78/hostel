using Hostel.Api.Data;
using Hostel.Api.Models.DTOs;
using Hostel.Api.Models.Entities;
using Hostel.Api.Services;
using Microsoft.EntityFrameworkCore;
using Xunit;

namespace Hostel.Tests;

public class UserServiceTests
{
    private AppDbContext CreateContext()
    {
        var options = new DbContextOptionsBuilder<AppDbContext>()
            .UseInMemoryDatabase(databaseName: Guid.NewGuid().ToString())
            .Options;
        return new AppDbContext(options);
    }

    [Fact]
    public async Task RegisterUser_ShouldCreateUserWithRoleUser()
    {
        using var context = CreateContext();
        var userService = new UserService(context);

        var request = new RegistrationRequest
        {
            Username = "newuser",
            Password = "password123",
            PasswordConfirm = "password123"
        };

        var result = await userService.RegisterUserAsync(request);
        Assert.True(result);

        var user = await userService.FindByUsernameAsync("newuser");
        Assert.NotNull(user);
        Assert.Equal("newuser", user.Username);
        Assert.Contains(user.Roles, r => r.Name == "ROLE_USER");
    }

    [Fact]
    public async Task RegisterUser_DuplicateUsername_ShouldReturnFalse()
    {
        using var context = CreateContext();
        var userService = new UserService(context);

        var request = new RegistrationRequest
        {
            Username = "user1",
            Password = "password123"
        };

        await userService.RegisterUserAsync(request);
        var secondAttempt = await userService.RegisterUserAsync(request);

        Assert.False(secondAttempt);
    }

    [Fact]
    public async Task ValidateUserCredentials_ValidPassword_ShouldReturnUser()
    {
        using var context = CreateContext();
        var userService = new UserService(context);

        var request = new RegistrationRequest
        {
            Username = "authuser",
            Password = "secretpassword"
        };

        await userService.RegisterUserAsync(request);

        var validUser = await userService.ValidateUserCredentialsAsync("authuser", "secretpassword");
        Assert.NotNull(validUser);

        var invalidUser = await userService.ValidateUserCredentialsAsync("authuser", "wrongpassword");
        Assert.Null(invalidUser);
    }

    [Fact]
    public async Task AddAndRemoveRole_ShouldWorkCorrectly()
    {
        using var context = CreateContext();
        var roleAdmin = new Role { Id = 2, Name = "ROLE_ADMIN" };
        context.Roles.Add(roleAdmin);
        await context.SaveChangesAsync();

        var userService = new UserService(context);
        await userService.RegisterUserAsync(new RegistrationRequest
        {
            Username = "roletestuser",
            Password = "password"
        });

        var user = await userService.FindByUsernameAsync("roletestuser");
        Assert.NotNull(user);

        var added = await userService.AddRoleToUserAsync(user.Id, 2);
        Assert.True(added);

        var roles = await userService.GetUserRolesAsync(user.Id);
        Assert.Contains(roles, r => r.Name == "ROLE_ADMIN");

        var removed = await userService.RemoveRoleFromUserAsync(user.Id, 2);
        Assert.True(removed);

        var updatedRoles = await userService.GetUserRolesAsync(user.Id);
        Assert.DoesNotContain(updatedRoles, r => r.Name == "ROLE_ADMIN");
    }
}
