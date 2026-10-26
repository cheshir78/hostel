using Hostel.Api.Data;
using Hostel.Api.Helpers;
using Hostel.Api.Models.DTOs;
using Hostel.Api.Models.Entities;
using Microsoft.EntityFrameworkCore;

namespace Hostel.Api.Services;

public class RoomService : IRoomService
{
    private readonly AppDbContext _context;

    public RoomService(AppDbContext context)
    {
        _context = context;
    }

    public async Task<List<RoomDto>> GetAllRoomsAsync()
    {
        return await _context.Rooms
            .Select(r => new RoomDto
            {
                Id = r.Id,
                Name = r.Name,
                Number = r.Number,
                Capacity = r.Capacity
            })
            .ToListAsync();
    }

    public async Task<RoomDto?> GetRoomByIdAsync(int id)
    {
        var room = await _context.Rooms.FirstOrDefaultAsync(r => r.Id == id);
        if (room == null) return null;

        return new RoomDto
        {
            Id = room.Id,
            Name = room.Name,
            Number = room.Number,
            Capacity = room.Capacity
        };
    }

    public async Task<Room?> GetRoomEntityByIdAsync(int id)
    {
        return await _context.Rooms.FirstOrDefaultAsync(r => r.Id == id);
    }

    public async Task<(bool Success, string? ErrorMessage, RoomDto? Room)> SaveRoomAsync(RoomDto roomDto)
    {
        var roomFromDb = await _context.Rooms.FirstOrDefaultAsync(r => r.Name == roomDto.Name);

        if (roomFromDb != null && roomFromDb.Id != roomDto.Id)
        {
            return (false, "Комната с таким номером уже существует", null);
        }

        if (roomDto.Id > 0)
        {
            var existing = await _context.Rooms.FirstOrDefaultAsync(r => r.Id == roomDto.Id);
            if (existing == null)
            {
                return (false, "Room not found", null);
            }

            existing.Name = roomDto.Name;
            existing.Number = roomDto.Number;
            existing.Capacity = roomDto.Capacity;

            await _context.SaveChangesAsync();
            return (true, null, new RoomDto
            {
                Id = existing.Id,
                Name = existing.Name,
                Number = existing.Number,
                Capacity = existing.Capacity
            });
        }
        else
        {
            var newRoom = new Room
            {
                Name = roomDto.Name,
                Number = roomDto.Number,
                Capacity = roomDto.Capacity
            };

            _context.Rooms.Add(newRoom);
            await _context.SaveChangesAsync();

            roomDto.Id = newRoom.Id;
            return (true, null, roomDto);
        }
    }

    public async Task<bool> DeleteRoomAsync(int id)
    {
        var room = await _context.Rooms.FirstOrDefaultAsync(r => r.Id == id);
        if (room == null) return false;

        _context.Rooms.Remove(room);
        await _context.SaveChangesAsync();
        return true;
    }

    public async Task<ReportRoomResponseDto> GetCheckoutReportAsync(DateTime toDate)
    {
        var baseDate = toDate.Date;
        var header = new List<string>();
        for (int i = 0; i < 7; i++)
        {
            header.Add(DateHelper.FormatDate(baseDate.AddDays(i)));
        }

        var orders = await _context.Orders
            .Where(o => o.DateTo == baseDate)
            .Join(_context.Rooms, o => o.RoomId, r => r.Id, (o, r) => new { Order = o, Room = r })
            .Select(x => new RoomDto
            {
                Id = x.Room.Id,
                Name = x.Room.Name,
                Number = x.Room.Number,
                Capacity = x.Room.Capacity
            })
            .ToListAsync();

        //var rooms = await _context.Rooms.OrderBy(r => r.Id).ToListAsync();
        var allRoomsLines = orders;
        
        return new ReportRoomResponseDto
        {
            ReportHeader = header,
            AllRooms = orders,
            ReportDateStr = DateHelper.FormatDate(baseDate)
        };
    }
}
