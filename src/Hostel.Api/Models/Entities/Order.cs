namespace Hostel.Api.Models.Entities;

public class Order
{
    public int Id { get; set; }
    public string Name { get; set; } = string.Empty;
    public int? Age { get; set; }
    public string? DocumentId { get; set; }
    public DateTime DateFrom { get; set; }
    public int Night { get; set; }
    public DateTime DateTo { get; set; }
    public int? RoomId { get; set; }
    public Room? Room { get; set; }
}
