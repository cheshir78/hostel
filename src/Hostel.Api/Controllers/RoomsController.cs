using Hostel.Api.Models.DTOs;
using Hostel.Api.Services;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace Hostel.Api.Controllers;

[ApiController]
[Authorize(Roles = "ROLE_USER,ROLE_ADMIN")]
public class RoomsController : ControllerBase
{
    private readonly IRoomService _roomService;

    public RoomsController(IRoomService roomService)
    {
        _roomService = roomService;
    }

    [HttpGet("api/rooms")]
    [HttpGet("hostel/rooms")]
    public async Task<ActionResult<List<RoomDto>>> GetAllRooms()
    {
        var rooms = await _roomService.GetAllRoomsAsync();
        return Ok(rooms);
    }

    [HttpGet("api/rooms/{id}")]
    [HttpGet("hostel/room/{id}")]
    public async Task<ActionResult<RoomDto>> GetRoomById(int id)
    {
        var room = await _roomService.GetRoomByIdAsync(id);
        if (room == null)
        {
            return NotFound(new ErrorModel { Message = "Room not found" });
        }
        return Ok(room);
    }

    [HttpPost("api/rooms")]
    [HttpPost("hostel/room")]
    public async Task<IActionResult> SaveRoom([FromBody] RoomDto roomDto)
    {
        if (!ModelState.IsValid)
        {
            return BadRequest(ModelState);
        }

        var (success, errorMessage, savedRoom) = await _roomService.SaveRoomAsync(roomDto);
        if (!success)
        {
            return BadRequest(new ErrorModel { Message = errorMessage ?? "Error saving room" });
        }

        return Ok(savedRoom);
    }

    [HttpDelete("api/rooms/{id}")]
    [HttpPost("hostel/rooms/delete")]
    public async Task<IActionResult> DeleteRoom([FromRoute] int? id, [FromQuery] int? roomId, [FromQuery] string? action)
    {
        int targetId = id ?? roomId ?? 0;
        if (targetId <= 0)
        {
            return BadRequest(new ErrorModel { Message = "Room ID is required" });
        }

        var success = await _roomService.DeleteRoomAsync(targetId);
        if (!success)
        {
            return NotFound(new ErrorModel { Message = "Room not found" });
        }

        return Ok(new { success = true });
    }
}
