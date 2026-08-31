namespace Hostel.Api.Models.Entities;

public class User
{
    public long Id { get; set; }
    public string Username { get; set; } = string.Empty;
    public string Password { get; set; } = string.Empty;
    public ICollection<Role> Roles { get; set; } = new List<Role>();
}
