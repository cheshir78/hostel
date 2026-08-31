using Hostel.Api.Models.Entities;
using Microsoft.EntityFrameworkCore;

namespace Hostel.Api.Data;

public static class DbInitializer
{
    public static async Task InitializeAsync(AppDbContext context)
    {
        await context.Database.EnsureCreatedAsync();

        if (!await context.Roles.AnyAsync())
        {
            var roleUser = new Role { Id = 1, Name = "ROLE_USER" };
            var roleAdmin = new Role { Id = 2, Name = "ROLE_ADMIN" };

            context.Roles.AddRange(roleUser, roleAdmin);
            await context.SaveChangesAsync();
        }

        if (!await context.Users.AnyAsync())
        {
            var roleUser = await context.Roles.FirstAsync(r => r.Id == 1);
            var roleAdmin = await context.Roles.FirstAsync(r => r.Id == 2);

            var user = new User
            {
                Id = 1,
                Username = "user",
                // BCrypt hash for "user"
                Password = "$2a$10$ByeoNjGj317rlBv7R2CTm.Zo4206QpU2xsHhRECWJh7e1ft.s0hB2",
                Roles = new List<Role> { roleUser }
            };

            var admin = new User
            {
                Id = 2,
                Username = "admin",
                // BCrypt hash for "admin"
                Password = "$2a$10$kZxAuLeMbd/eEnZW24yNPOujFFSf0J2ceXhBsZzuJtgSHKUPRfphq",
                Roles = new List<Role> { roleUser, roleAdmin }
            };

            context.Users.AddRange(user, admin);
            await context.SaveChangesAsync();
        }

        if (!await context.Rooms.AnyAsync())
        {
            var rooms = new List<Room>
            {
                new Room { Name = "Deluxe Room", Number = 101, Capacity = 2 },
                new Room { Name = "Family Suite", Number = 102, Capacity = 4 },
                new Room { Name = "Dormitory 6-Bed", Number = 201, Capacity = 6 }
            };

            context.Rooms.AddRange(rooms);
            await context.SaveChangesAsync();
        }
    }
}
