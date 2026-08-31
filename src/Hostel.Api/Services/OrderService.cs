using System.Globalization;
using Hostel.Api.Data;
using Hostel.Api.Exceptions;
using Hostel.Api.Models.DTOs;
using Hostel.Api.Models.Entities;
using Microsoft.EntityFrameworkCore;

namespace Hostel.Api.Services;

public class OrderService : IOrderService
{
    private readonly AppDbContext _context;

    public OrderService(AppDbContext context)
    {
        _context = context;
    }

    private static DateTime ParseDate(string dateStr)
    {
        string[] formats = { "dd.MM.yyyy", "yyyy-MM-dd", "yyyy-MM-ddTHH:mm:ss", "yyyy-MM-ddTHH:mm:ssZ", "yyyy-MM-ddTHH:mm:ss.fffZ" };
        if (DateTime.TryParseExact(dateStr, formats, CultureInfo.InvariantCulture, DateTimeStyles.None, out var date))
        {
            return date.Date;
        }

        if (DateTime.TryParse(dateStr, CultureInfo.InvariantCulture, DateTimeStyles.None, out var fallbackDate))
        {
            return fallbackDate.Date;
        }

        return DateTime.UtcNow.Date;
    }

    private static string FormatDate(DateTime date)
    {
        return date.ToString("dd.MM.yyyy");
    }

    private static OrderDto MapToDto(Order order)
    {
        return new OrderDto
        {
            Id = order.Id,
            Name = order.Name,
            Age = order.Age,
            DocumentId = order.DocumentId,
            DateFrom = order.DateFrom,
            DateFromStr = FormatDate(order.DateFrom),
            Night = order.Night,
            DateTo = order.DateTo,
            RoomId = order.RoomId,
            RoomName = order.Room?.Name,
            Room = order.Room == null ? null : new RoomDto
            {
                Id = order.Room.Id,
                Name = order.Room.Name,
                Number = order.Room.Number,
                Capacity = order.Room.Capacity
            }
        };
    }

    public async Task<List<OrderDto>> GetAllOrdersAsync()
    {
        var orders = await _context.Orders
            .Include(o => o.Room)
            .OrderBy(o => o.DateFrom)
            .ToListAsync();

        return orders.Select(MapToDto).ToList();
    }

    public async Task<List<OrderDto>> GetOrdersByDateAsync(DateTime date)
    {
        var targetDate = date.Date;
        var orders = await _context.Orders
            .Include(o => o.Room)
            .Where(o => o.DateFrom.Date <= targetDate && o.DateTo.Date > targetDate)
            .OrderBy(o => o.DateFrom)
            .ToListAsync();

        return orders.Select(MapToDto).ToList();
    }

    public async Task<OrderDto?> GetOrderByIdAsync(int id)
    {
        var order = await _context.Orders
            .Include(o => o.Room)
            .FirstOrDefaultAsync(o => o.Id == id);

        return order == null ? null : MapToDto(order);
    }

    public async Task<Order?> GetOrderEntityByIdAsync(int id)
    {
        return await _context.Orders
            .Include(o => o.Room)
            .FirstOrDefaultAsync(o => o.Id == id);
    }

    public async Task<OrderDto> CreateOrderAsync(CreateOrderRequest request)
    {
        var room = await _context.Rooms.FirstOrDefaultAsync(r => r.Id == request.RoomId);
        if (room == null)
        {
            throw new OrderServiceException($"roomId {request.RoomId} not found");
        }

        var dateFrom = ParseDate(request.DateFromStr);
        var dateTo = dateFrom.AddDays(request.Night);

        var order = new Order
        {
            Name = request.Name,
            Age = request.Age,
            DocumentId = request.DocumentId,
            DateFrom = dateFrom,
            Night = request.Night,
            DateTo = dateTo,
            RoomId = room.Id,
            Room = room
        };

        await ValidateRoomCapacityAsync(order, isNew: true);

        _context.Orders.Add(order);
        await _context.SaveChangesAsync();

        return MapToDto(order);
    }

    public async Task<OrderDto> UpdateOrderAsync(int id, CreateOrderRequest request)
    {
        var order = await _context.Orders
            .Include(o => o.Room)
            .FirstOrDefaultAsync(o => o.Id == id);

        if (order == null)
        {
            throw new OrderServiceException("Order not found");
        }

        var room = await _context.Rooms.FirstOrDefaultAsync(r => r.Id == request.RoomId);
        if (room == null)
        {
            throw new OrderServiceException($"roomId {request.RoomId} not found");
        }

        var dateFrom = ParseDate(request.DateFromStr);
        var dateTo = dateFrom.AddDays(request.Night);

        order.Name = request.Name;
        order.Age = request.Age;
        order.DocumentId = request.DocumentId;
        order.DateFrom = dateFrom;
        order.Night = request.Night;
        order.DateTo = dateTo;
        order.RoomId = room.Id;
        order.Room = room;

        await ValidateRoomCapacityAsync(order, isNew: false);

        await _context.SaveChangesAsync();

        return MapToDto(order);
    }

    public async Task<OrderDto> CreateOrUpdateFromEntityAsync(Order order)
    {
        if (order.RoomId == null && order.Room != null)
        {
            order.RoomId = order.Room.Id;
        }

        if (order.RoomId == null)
        {
            throw new OrderServiceException("Room ID is required");
        }

        var room = await _context.Rooms.FirstOrDefaultAsync(r => r.Id == order.RoomId);
        if (room == null)
        {
            throw new OrderServiceException($"roomId {order.RoomId} not found");
        }

        order.Room = room;
        order.DateTo = order.DateFrom.AddDays(order.Night);

        bool isNew = order.Id <= 0;
        await ValidateRoomCapacityAsync(order, isNew);

        if (isNew)
        {
            _context.Orders.Add(order);
        }
        else
        {
            var existing = await _context.Orders.FirstOrDefaultAsync(o => o.Id == order.Id);
            if (existing == null)
            {
                throw new OrderServiceException("Order not found");
            }

            existing.Name = order.Name;
            existing.Age = order.Age;
            existing.DocumentId = order.DocumentId;
            existing.DateFrom = order.DateFrom;
            existing.Night = order.Night;
            existing.DateTo = order.DateTo;
            existing.RoomId = order.RoomId;
        }

        await _context.SaveChangesAsync();
        return MapToDto(order);
    }

    private async Task ValidateRoomCapacityAsync(Order order, bool isNew)
    {
        var room = order.Room ?? await _context.Rooms.FindAsync(order.RoomId);
        if (room == null)
        {
            throw new OrderServiceException("Room not found");
        }

        for (int i = 0; i < order.Night; i++)
        {
            var checkDate = order.DateFrom.AddDays(i).Date;
            
            // Count overlapping orders on that night
            var countQuery = _context.Orders.Where(o =>
                o.RoomId == room.Id &&
                o.DateFrom.Date <= checkDate &&
                o.DateTo.Date > checkDate);

            if (!isNew && order.Id > 0)
            {
                countQuery = countQuery.Where(o => o.Id != order.Id);
            }

            var count = await countQuery.CountAsync();
            
            // Adding this new/updated booking occupies 1 slot
            count += 1;

            if (count > room.Capacity)
            {
                throw new OrderServiceException($"Room is full on {FormatDate(checkDate)} (capacity {room.Capacity})");
            }
        }
    }

    public async Task<bool> DeleteOrderAsync(int id)
    {
        var order = await _context.Orders.FirstOrDefaultAsync(o => o.Id == id);
        if (order == null) return false;

        _context.Orders.Remove(order);
        await _context.SaveChangesAsync();
        return true;
    }

    public async Task<int> GetCountOrderByRoomAndDateAsync(int roomId, DateTime date)
    {
        var targetDate = date.Date;
        return await _context.Orders.CountAsync(o =>
            o.RoomId == roomId &&
            o.DateFrom.Date <= targetDate &&
            o.DateTo.Date > targetDate);
    }

    public async Task<ReportResponseDto> GetOccupancyReportAsync(DateTime startDate)
    {
        var baseDate = startDate.Date;
        var header = new List<string>();
        for (int i = 0; i < 7; i++)
        {
            header.Add(FormatDate(baseDate.AddDays(i)));
        }

        var rooms = await _context.Rooms.OrderBy(r => r.Id).ToListAsync();
        var allOrdersLines = new List<ReportRestLineDto>();

        foreach (var room in rooms)
        {
            var lineDto = new ReportRestLineDto
            {
                Room = new RoomDto
                {
                    Id = room.Id,
                    Name = room.Name,
                    Number = room.Number,
                    Capacity = room.Capacity
                },
                Line = new List<int>()
            };

            for (int i = 0; i < 7; i++)
            {
                var dayDate = baseDate.AddDays(i);
                var count = await GetCountOrderByRoomAndDateAsync(room.Id, dayDate);
                lineDto.Line.Add(count);
            }

            allOrdersLines.Add(lineDto);
        }

        return new ReportResponseDto
        {
            ReportHeader = header,
            AllOrders = allOrdersLines,
            OrderDateStr = FormatDate(baseDate)
        };
    }
}
