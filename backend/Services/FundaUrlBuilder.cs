public class FundaUrlBuilder
{
    private readonly string _apiKey;
    private const string BaseUrl = "https://partnerapi.funda.nl/feeds/Aanbod.svc/json";

    public FundaUrlBuilder(string apiKey)
    {
        _apiKey = apiKey;
    }

    public string BuildSearchUrl(string location, string propertyType, bool withGarden, int page = 1, int pageSize = 25)
    {
        var builder = new UriBuilder($"{BaseUrl}/{_apiKey}/");
        
        var query = new List<string>
        {
            $"type={Uri.EscapeDataString(propertyType)}",
            $"zo=/{Uri.EscapeDataString(location)}/{(withGarden ? "tuin/" : "")}",
            $"page={page}",
            $"pagesize={pageSize}"
        };

        builder.Query = string.Join("&", query);
        return builder.Uri.ToString();
    }
} 