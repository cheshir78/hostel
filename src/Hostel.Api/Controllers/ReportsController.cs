using System.Globalization;
using Hostel.Api.Models.DTOs;
using Hostel.Api.Services;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace Hostel.Api.Controllers;

[ApiController]
[Authorize(Roles = "ROLE_USER,ROLE_ADMIN")]
public class ReportsController : ControllerBase
{
    private readonly IOrderService _orderService;
    private readonly IRoomService _roomService;

    public ReportsController(IOrderService orderService, IRoomService roomService)
    {
        _orderService = orderService;
        _roomService = roomService;
    }

    [HttpGet("api/reports/occupancy")]
    public async Task<ActionResult<ReportResponseDto>> GetReport([FromQuery] string? orderDateStr, [FromBody] string? bodyDate)
    {
        var inputDateStr = !string.IsNullOrWhiteSpace(orderDateStr) ? orderDateStr : bodyDate;
        DateTime startDate = DateTime.Today;

        if (!string.IsNullOrWhiteSpace(inputDateStr))
        {
            string[] formats = { "dd.MM.yyyy", "yyyy-MM-dd" };
            if (DateTime.TryParseExact(inputDateStr, formats, CultureInfo.InvariantCulture, DateTimeStyles.None, out var parsed))
            {
                startDate = parsed;
            }
            else if (DateTime.TryParse(inputDateStr, out var fallback))
            {
                startDate = fallback;
            }
        }

        var report = await _orderService.GetOccupancyReportAsync(startDate);
        return Ok(report);
    }

    [HttpGet("api/reports/checkout")]
    public async Task<ActionResult<ReportRoomResponseDto>> GetReportCheckout([FromQuery] string? orderDateStr, [FromBody] string? bodyDate)
    {
        var inputDateStr = !string.IsNullOrWhiteSpace(orderDateStr) ? orderDateStr : bodyDate;
        DateTime startDate = DateTime.Today;

        if (!string.IsNullOrWhiteSpace(inputDateStr))
        {
            string[] formats = { "dd.MM.yyyy", "yyyy-MM-dd" };
            if (DateTime.TryParseExact(inputDateStr, formats, CultureInfo.InvariantCulture, DateTimeStyles.None, out var parsed))
            {
                startDate = parsed;
            }
            else if (DateTime.TryParse(inputDateStr, out var fallback))
            {
                startDate = fallback;
            }
        }

        var report = await _roomService.GetCheckoutReportAsync(startDate);
        return Ok(report);
    }
}
