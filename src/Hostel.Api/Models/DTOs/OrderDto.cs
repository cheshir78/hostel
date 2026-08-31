using System.ComponentModel.DataAnnotations;

namespace Hostel.Api.Models.DTOs;

public class OrderDto
{
    public int Id { get; set; }

    [Required]
    public string Name { get; set; } = string.Empty;

    public int? Age { get; set; }
    public string? DocumentId { get; set; }

    public DateTime DateFrom { get; set; }
    public string? DateFromStr { get; set; }

    [Range(1, 365)]
    public int Night { get; set; } = 1;

    public DateTime DateTo { get; set; }

    public int? RoomId { get; set; }
    public string? RoomName { get; set; }
    public RoomDto? Room { get; set; }
}

public class CreateOrderRequest
{
    public int? Id { get; set; }

    [Required]
    public string Name { get; set; } = string.Empty;

    public int? Age { get; set; }
    public string? DocumentId { get; set; }

    [Required]
    public string DateFromStr { get; set; } = string.Empty;

    [Range(1, 365)]
    public int Night { get; set; } = 1;

    [Required]
    public int RoomId { get; set; }
}
