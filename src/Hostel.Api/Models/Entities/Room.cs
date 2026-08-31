namespace Hostel.Api.Models.Entities;

public class Room
{
    public int Id { get; set; }
    public string Name { get; set; } = string.Empty;
    public int? Number { get; set; }
    public int Capacity { get; set; }
    public ICollection<Order> Orders { get; set; } = new List<Order>();
}
