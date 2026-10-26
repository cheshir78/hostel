namespace Hostel.Api.Helpers
{
    public class DateHelper
    {
        public static string FormatDate(DateTime date)
        {
            return date.ToString("dd.MM.yyyy");
        }
    }
}
