using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace Hostel.Api.Controllers;

[ApiController]
[Authorize(Roles = "ROLE_USER")]
public class NewsController : ControllerBase
{
    [HttpGet("news")]
    [HttpGet("api/news")]
    public IActionResult GetNews()
    {
        var newsItems = new[]
        {
            new
            {
                Id = 1,
                Title = "Добро пожаловать в систему Hostel!",
                Date = DateTime.UtcNow.ToString("dd.MM.yyyy"),
                Content = "Наша система бронирования комнат успешно обновлена на платформу .NET 10 + ReactJS. Доступен полный функционал управления комнатами, бронированием и расчетом загрузки."
            },
            new
            {
                Id = 2,
                Title = "Новые возможности бронирования",
                Date = DateTime.UtcNow.AddDays(-2).ToString("dd.MM.yyyy"),
                Content = "Теперь доступен быстрый просмотр свободных мест на 7 дней вперед с помощью таблицы загрузки."
            }
        };

        return Ok(newsItems);
    }
}
