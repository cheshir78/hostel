namespace Hostel.Api.Exceptions;

public class OrderServiceException : Exception
{
    public OrderServiceException(string message) : base(message)
    {
    }

    public OrderServiceException(string message, Exception innerException) : base(message, innerException)
    {
    }
}
