using System.Globalization;
using Hostel.Api.Exceptions;
using Hostel.Api.Models.DTOs;
using Hostel.Api.Services;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace Hostel.Api.Controllers;

[ApiController]
[Authorize(Roles = "ROLE_USER,ROLE_ADMIN")]
public class OrdersController : ControllerBase
{
    private readonly IOrderService _orderService;

    public OrdersController(IOrderService orderService)
    {
        _orderService = orderService;
    }

    [HttpGet("api/orders")]
    [HttpGet("hostel/orders")]
    public async Task<ActionResult<List<OrderDto>>> GetAllOrders()
    {
        var orders = await _orderService.GetAllOrdersAsync();
        return Ok(orders);
    }

    [HttpGet("api/orders/date")]
    [HttpGet("hostel/orderdate")]
    public async Task<ActionResult<List<OrderDto>>> GetOrdersByDate([FromQuery] string? date)
    {
        DateTime targetDate = DateTime.Today;
        if (!string.IsNullOrWhiteSpace(date))
        {
            string[] formats = { "dd.MM.yyyy", "yyyy-MM-dd" };
            if (DateTime.TryParseExact(date, formats, CultureInfo.InvariantCulture, DateTimeStyles.None, out var parsed))
            {
                targetDate = parsed;
            }
            else if (DateTime.TryParse(date, out var fallback))
            {
                targetDate = fallback;
            }
        }

        var orders = await _orderService.GetOrdersByDateAsync(targetDate);
        return Ok(new
        {
            allOrders = orders,
            orderDateStr = targetDate.ToString("dd.MM.yyyy")
        });
    }

    [HttpGet("api/orders/{id}")]
    [HttpGet("hostel/order/{id}")]
    public async Task<ActionResult<OrderDto>> GetOrderById(int id)
    {
        var order = await _orderService.GetOrderByIdAsync(id);
        if (order == null)
        {
            return NotFound(new ErrorModel { Message = "Order not found" });
        }
        return Ok(order);
    }

    [HttpPost("api/orders")]
    [HttpPost("hostel/order")]
    public async Task<IActionResult> CreateOrder([FromBody] CreateOrderRequest request)
    {
        if (!ModelState.IsValid)
        {
            return BadRequest(ModelState);
        }

        try
        {
            var created = await _orderService.CreateOrderAsync(request);
            return Ok(created);
        }
        catch (OrderServiceException ex)
        {
            return BadRequest(new ErrorModel { Message = ex.Message });
        }
    }

    [HttpPut("api/orders/{id}")]
    public async Task<IActionResult> UpdateOrder(int id, [FromBody] CreateOrderRequest request)
    {
        if (!ModelState.IsValid)
        {
            return BadRequest(ModelState);
        }

        try
        {
            var updated = await _orderService.UpdateOrderAsync(id, request);
            return Ok(updated);
        }
        catch (OrderServiceException ex)
        {
            return BadRequest(new ErrorModel { Message = ex.Message });
        }
    }

    [HttpDelete("api/orders/{id}")]
    [HttpPost("hostel/orders/delete")]
    public async Task<IActionResult> DeleteOrder([FromRoute] int? id, [FromQuery] int? orderId, [FromQuery] string? action)
    {
        int targetId = id ?? orderId ?? 0;
        if (targetId <= 0)
        {
            return BadRequest(new ErrorModel { Message = "Order ID is required" });
        }

        var success = await _orderService.DeleteOrderAsync(targetId);
        if (!success)
        {
            return NotFound(new ErrorModel { Message = "Order not found" });
        }

        return Ok(new { success = true });
    }
}
