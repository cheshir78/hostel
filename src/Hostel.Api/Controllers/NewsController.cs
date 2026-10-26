using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace Hostel.Api.Controllers;

[ApiController]
[Authorize(Roles = "ROLE_USER")]
public class NewsController : ControllerBase
{
    [HttpGet("api/news")]
    public IActionResult GetNews()
    {
        var newsItems = new[]
        {
            new
            {
                Id = 1,
                Title = "Добро пожаловать в систему Hostel!",
                Date = DateTime.Parse("2026-09-02").ToString("yyyy-MM-dd"),
                Content = "Наша система бронирования комнат успешно обновлена на платформу .NET 10 + ReactJS. Доступен полный функционал управления комнатами, бронированием и расчетом загрузки."
            },
            new
            {
                Id = 2,
                Title = "Новые возможности бронирования",
                Date = DateTime.Parse("2026-10-02").ToString("yyyy-MM-dd"),
                Content = "Теперь доступен быстрый просмотр свободных мест на 7 дней вперед с помощью таблицы загрузки."
            },
            new
            {
                Id = 3,
                Title = "Add new report for checkout",
                Date = DateTime.Parse("2026-10-26").ToString("yyyy-MM-dd"),
                Content = "Added a new report for the list of checking-out rooms."
            }
        };

        return Ok(newsItems);
    }
}
