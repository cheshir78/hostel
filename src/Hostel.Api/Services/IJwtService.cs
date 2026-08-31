using Hostel.Api.Models.Entities;

namespace Hostel.Api.Services;

public interface IJwtService
{
    string GenerateToken(User user);
}
