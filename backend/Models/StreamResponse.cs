using System.Text.Json.Serialization;
using System.Text.Json;

namespace FundaApiBackend.Models;

public enum StreamResponseType
{
    Progress,
    Data,
    Error
}

public class StreamResponse<T>
{
    [JsonConverter(typeof(JsonStringEnumConverter))]
    public StreamResponseType Type { get; set; } = StreamResponseType.Progress;
    public T? Payload { get; set; }

    public string ToServerSentEvent()
    {
        return $"data: {JsonSerializer.Serialize(this)}\n\n";
    }
} 