using Hostel.Api.Exceptions;
using Hostel.Api.Models.Entities;
using Hostel.Api.Services;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace Hostel.Api.Controllers;

/// <summary>
/// REST API corresponding to original Spring Boot /rest/order endpoints
/// </summary>
[ApiController]
[Route("rest/order")]
[Authorize(Roles = "ROLE_USER,ROLE_ADMIN")]
public class RestOrderController : ControllerBase
{
    private readonly IOrderService _orderService;

    public RestOrderController(IOrderService orderService)
    {
        _orderService = orderService;
    }

    [HttpGet]
    public async Task<ActionResult<List<Order>>> FindAll()
    {
        var orders = await _orderService.GetAllOrdersAsync();
        return Ok(orders);
    }

    [HttpGet("{id}")]
    public async Task<ActionResult<Order>> FindById(int id)
    {
        var order = await _orderService.GetOrderEntityByIdAsync(id);
        if (order == null)
        {
            throw new MyResourceNotFoundException($"Order with id {id} not found");
        }
        return Ok(order);
    }

    [HttpPost]
    [ProducesResponseType(StatusCodes.Status201Created)]
    public async Task<ActionResult<Order>> Create([FromBody] Order resource)
    {
        if (resource == null)
        {
            throw new OrderServiceException("Order is null");
        }

        if (resource.Room == null && resource.RoomId == null)
        {
            throw new OrderServiceException("Room is not specified");
        }

        var created = await _orderService.CreateOrUpdateFromEntityAsync(resource);
        return StatusCode(StatusCodes.Status201Created, created);
    }

    [HttpPut]
    [ProducesResponseType(StatusCodes.Status201Created)]
    public async Task<ActionResult<Order>> Update([FromBody] Order resource)
    {
        if (resource == null)
        {
            throw new OrderServiceException("order is null");
        }
        if (resource.Id <= 0)
        {
            throw new OrderServiceException("order Id is not defined");
        }
        if (resource.Room == null && resource.RoomId == null)
        {
            throw new OrderServiceException("room is null");
        }

        var updated = await _orderService.CreateOrUpdateFromEntityAsync(resource);
        return StatusCode(StatusCodes.Status201Created, updated);
    }

    [HttpDelete("{id}")]
    public async Task<IActionResult> Delete(int id)
    {
        var success = await _orderService.DeleteOrderAsync(id);
        if (!success)
        {
            throw new OrderServiceException("Error on delete order");
        }
        return Ok();
    }
}
