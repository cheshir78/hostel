using System.ComponentModel.DataAnnotations;

namespace Hostel.Api.Models.DTOs;

public class RoomDto
{
    public int Id { get; set; }

    [Required]
    public string Name { get; set; } = string.Empty;

    public int? Number { get; set; }

    [Range(1, 1000)]
    public int Capacity { get; set; }
}

public class CreateRoomRequest
{
    [Required]
    public string Name { get; set; } = string.Empty;

    public int? Number { get; set; }

    [Range(1, 1000)]
    public int Capacity { get; set; }
}
