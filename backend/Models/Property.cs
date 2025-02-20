namespace FundaApiBackend.Models;
using System.Text.Json.Serialization;

public class Property
{
    [JsonPropertyName("Id")]
    public required string ID { get; set; }

    [JsonPropertyName("MakelaarId")]
    public int AgentId { get; set; }

    [JsonPropertyName("MakelaarNaam")]
    public string AgentName { get; set; } = string.Empty;

    [JsonPropertyName("Adres")]
    public string Address { get; set; } = string.Empty;

    [JsonPropertyName("Woonplaats")]
    public string City { get; set; } = string.Empty;

    [JsonPropertyName("Koopprijs")]
    public decimal? Price { get; set; }

    [JsonPropertyName("URL")]
    public string Url { get; set; } = string.Empty;
}