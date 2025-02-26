namespace FundaApiBackend.Models;

public class FundaSearchParameters
{
    public required string Location { get; set; }
    public required string PropertyType { get; set; }
    public bool Balcony { get; set; } = false;
    public bool Garden { get; set; } = false;
    public bool Terrace { get; set; } = false;
    public int Page { get; set; } = 1;
    public int PageSize { get; set; } = 25;
} 