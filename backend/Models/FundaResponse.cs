using System.Text.Json.Serialization;

namespace FundaApiBackend.Models;

public class FundaResponse
{
    [JsonPropertyName("Objects")]
    public List<Property>? Properties { get; set; } = null;
    
    [JsonPropertyName("Paging")]
    public Paging Paging { get; set; } = new();
    
    [JsonPropertyName("TotaalAantalObjecten")]
    public int TotalObjects { get; set; }
}

public class Paging
{
    [JsonPropertyName("AantalPaginas")]
    public int TotalPages { get; set; }
    
    [JsonPropertyName("HuidigePagina")]
    public int CurrentPage { get; set; }
    
    [JsonPropertyName("VolgendeUrl")]
    public string? NextUrl { get; set; }
    
    [JsonPropertyName("VorigeUrl")]
    public string? PreviousUrl { get; set; }
} 