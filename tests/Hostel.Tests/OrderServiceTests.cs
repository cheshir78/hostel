using Hostel.Api.Data;
using Hostel.Api.Exceptions;
using Hostel.Api.Models.DTOs;
using Hostel.Api.Models.Entities;
using Hostel.Api.Services;
using Microsoft.EntityFrameworkCore;
using Xunit;

namespace Hostel.Tests;

public class OrderServiceTests
{
    private AppDbContext CreateContext()
    {
        var options = new DbContextOptionsBuilder<AppDbContext>()
            .UseInMemoryDatabase(databaseName: Guid.NewGuid().ToString())
            .Options;
        return new AppDbContext(options);
    }

    [Fact]
    public async Task CreateOrder_WithinCapacity_ShouldSucceed()
    {
        using var context = CreateContext();
        var room = new Room { Name = "Room 1", Capacity = 2 };
        context.Rooms.Add(room);
        await context.SaveChangesAsync();

        var orderService = new OrderService(context);
        var order = await orderService.CreateOrderAsync(new CreateOrderRequest
        {
            Name = "Guest 1",
            DateFromStr = "01.09.2026",
            Night = 3,
            RoomId = room.Id
        });

        Assert.NotNull(order);
        Assert.Equal("Guest 1", order.Name);
        Assert.Equal(3, order.Night);
    }

    [Fact]
    public async Task CreateOrder_ExceedingCapacity_ShouldThrowOrderServiceException()
    {
        using var context = CreateContext();
        var room = new Room { Name = "Single Room", Capacity = 1 };
        context.Rooms.Add(room);
        await context.SaveChangesAsync();

        var orderService = new OrderService(context);

        // First guest books for 3 nights
        await orderService.CreateOrderAsync(new CreateOrderRequest
        {
            Name = "Guest 1",
            DateFromStr = "01.09.2026",
            Night = 3,
            RoomId = room.Id
        });

        // Second guest tries booking overlapping night
        await Assert.ThrowsAsync<OrderServiceException>(async () =>
        {
            await orderService.CreateOrderAsync(new CreateOrderRequest
            {
                Name = "Guest 2",
                DateFromStr = "02.09.2026",
                Night = 2,
                RoomId = room.Id
            });
        });
    }

    [Fact]
    public async Task GetOccupancyReport_ShouldCalculateCorrectly()
    {
        using var context = CreateContext();
        var room1 = new Room { Id = 1, Name = "Room A", Capacity = 2 };
        var room2 = new Room { Id = 2, Name = "Room B", Capacity = 1 };
        context.Rooms.AddRange(room1, room2);
        await context.SaveChangesAsync();

        var orderService = new OrderService(context);

        // Book 1 bed in room A on 01.09.2026 for 2 nights
        await orderService.CreateOrderAsync(new CreateOrderRequest
        {
            Name = "Guest A",
            DateFromStr = "01.09.2026",
            Night = 2,
            RoomId = room1.Id
        });

        var report = await orderService.GetOccupancyReportAsync(new DateTime(2026, 9, 1));

        Assert.Equal(7, report.ReportHeader.Count);
        Assert.Equal(2, report.AllOrders.Count);

        var roomALine = report.AllOrders.First(o => o.Room.Id == room1.Id);
        // Night 0 (01.09): 1 occupied
        Assert.Equal(1, roomALine.Line[0]);
        // Night 1 (02.09): 1 occupied
        Assert.Equal(1, roomALine.Line[1]);
        // Night 2 (03.09): 0 occupied
        Assert.Equal(0, roomALine.Line[2]);
    }
}
