using Hostel.Api.Models.DTOs;
using Hostel.Api.Models.Entities;

namespace Hostel.Api.Services;

public interface IRoomService
{
    Task<List<RoomDto>> GetAllRoomsAsync();
    Task<RoomDto?> GetRoomByIdAsync(int id);
    Task<Room?> GetRoomEntityByIdAsync(int id);
    Task<(bool Success, string? ErrorMessage, RoomDto? Room)> SaveRoomAsync(RoomDto roomDto);
    Task<bool> DeleteRoomAsync(int id);
}
