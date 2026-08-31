namespace Hostel.Api.Exceptions;

public class MyResourceNotFoundException : Exception
{
    public MyResourceNotFoundException(string message) : base(message)
    {
    }

    public MyResourceNotFoundException(string message, Exception innerException) : base(message, innerException)
    {
    }
}
