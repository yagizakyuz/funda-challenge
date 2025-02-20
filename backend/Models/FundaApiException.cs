namespace FundaApiBackend.Models;

public class FundaApiException : Exception
{
    public int StatusCode { get; }

    public FundaApiException(int statusCode, string message) 
        : base(message)
    {
        StatusCode = statusCode;
    }
} 