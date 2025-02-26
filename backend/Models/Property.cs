using System.Text.Json;
using System.Text.Json.Serialization;

namespace FundaApiBackend.Models;
public class NullableDecimalConverter : JsonConverter<decimal>
{
    public override decimal Read(ref Utf8JsonReader reader, Type typeToConvert, JsonSerializerOptions options)
    {
        return reader.TokenType == JsonTokenType.Null ? 0m : reader.GetDecimal();
    }

    public override void Write(Utf8JsonWriter writer, decimal value, JsonSerializerOptions options)
    {
        writer.WriteNumberValue(value);
    }
}

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
    [JsonConverter(typeof(NullableDecimalConverter))]
    public decimal Price { get; set; }

    [JsonPropertyName("URL")]
    public string Url { get; set; } = string.Empty;
}