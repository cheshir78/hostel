namespace Hostel.Api.Models.DTOs;

public class ReportRestLineDto
{
    public RoomDto Room { get; set; } = new();
    public List<int> Line { get; set; } = new();
}

public class ReportResponseDto
{
    public List<string> ReportHeader { get; set; } = new();
    public List<ReportRestLineDto> AllOrders { get; set; } = new();
    public string OrderDateStr { get; set; } = string.Empty;
}

public class ErrorModel
{
    public string Message { get; set; } = string.Empty;
    public string? Details { get; set; }
}
