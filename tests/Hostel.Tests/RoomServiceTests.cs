using Hostel.Api.Data;
using Hostel.Api.Models.DTOs;
using Hostel.Api.Models.Entities;
using Hostel.Api.Services;
using Microsoft.EntityFrameworkCore;
using Xunit;

namespace Hostel.Tests;

public class RoomServiceTests
{
    private AppDbContext CreateContext()
    {
        var options = new DbContextOptionsBuilder<AppDbContext>()
            .UseInMemoryDatabase(databaseName: Guid.NewGuid().ToString())
            .Options;
        return new AppDbContext(options);
    }

    [Fact]
    public async Task SaveRoom_UniqueName_ShouldSucceed()
    {
        using var context = CreateContext();
        var roomService = new RoomService(context);

        var roomDto = new RoomDto
        {
            Name = "Room 101",
            Number = 101,
            Capacity = 2
        };

        var (success, error, savedRoom) = await roomService.SaveRoomAsync(roomDto);

        Assert.True(success);
        Assert.Null(error);
        Assert.NotNull(savedRoom);
        Assert.True(savedRoom.Id > 0);
    }

    [Fact]
    public async Task SaveRoom_DuplicateName_ShouldReturnError()
    {
        using var context = CreateContext();
        var roomService = new RoomService(context);

        await roomService.SaveRoomAsync(new RoomDto
        {
            Name = "Room 101",
            Number = 101,
            Capacity = 2
        });

        var (success, error, _) = await roomService.SaveRoomAsync(new RoomDto
        {
            Name = "Room 101",
            Number = 102,
            Capacity = 3
        });

        Assert.False(success);
        Assert.Equal("Комната с таким номером уже существует", error);
    }

    [Fact]
    public async Task DeleteRoom_ExistingRoom_ShouldReturnTrue()
    {
        using var context = CreateContext();
        var room = new Room { Name = "Room To Delete", Capacity = 1 };
        context.Rooms.Add(room);
        await context.SaveChangesAsync();

        var roomService = new RoomService(context);
        var deleted = await roomService.DeleteRoomAsync(room.Id);

        Assert.True(deleted);
        Assert.Null(await roomService.GetRoomByIdAsync(room.Id));
    }
}
