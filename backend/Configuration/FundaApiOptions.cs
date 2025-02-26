namespace FundaApiBackend.Configuration;

public class FundaApiOptions
{
    public const string ConfigurationSection = "Funda";
    public string? ApiKey { get; set; }
    public int MaxConcurrentRequests { get; set; } = 5;
    public double RequestDelaySeconds { get; set; } = 0.5;
    public int MaxRetries { get; set; } = 10;
    public int RetryDelaySeconds { get; set; } = 2;
} 