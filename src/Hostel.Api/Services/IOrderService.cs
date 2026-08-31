using Hostel.Api.Models.DTOs;
using Hostel.Api.Models.Entities;

namespace Hostel.Api.Services;

public interface IOrderService
{
    Task<List<OrderDto>> GetAllOrdersAsync();
    Task<List<OrderDto>> GetOrdersByDateAsync(DateTime date);
    Task<OrderDto?> GetOrderByIdAsync(int id);
    Task<Order?> GetOrderEntityByIdAsync(int id);
    Task<OrderDto> CreateOrderAsync(CreateOrderRequest request);
    Task<OrderDto> UpdateOrderAsync(int id, CreateOrderRequest request);
    Task<OrderDto> CreateOrUpdateFromEntityAsync(Order order);
    Task<bool> DeleteOrderAsync(int id);
    Task<ReportResponseDto> GetOccupancyReportAsync(DateTime startDate);
    Task<int> GetCountOrderByRoomAndDateAsync(int roomId, DateTime date);
}
