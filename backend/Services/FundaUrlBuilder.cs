using FundaApiBackend.Configuration;
using Microsoft.Extensions.Options;
using FundaApiBackend.Models;
namespace FundaApiBackend.Services
{
    public interface IFundaUrlBuilder
    {
        string BuildSearchUrl(FundaSearchParameters searchParams, int page = 1);
    }

    public class FundaUrlBuilder : IFundaUrlBuilder
    {
        private readonly string _apiKey;
        private const string BaseUrl = "https://partnerapi.funda.nl/feeds/Aanbod.svc/json";

        public FundaUrlBuilder(IOptions<FundaApiOptions> options)
        {
            _apiKey = options.Value.ApiKey ?? throw new ArgumentNullException(nameof(options.Value.ApiKey));
        }

        public string BuildSearchUrl(FundaSearchParameters searchParams, int page = 1)
        {
            var builder = new UriBuilder($"{BaseUrl}/{_apiKey}/");
            
            var zoParam = searchParams.Location;
            
            if (searchParams.Garden) zoParam += "/tuin";
            if (searchParams.Balcony) zoParam += "/balkon";
            if (searchParams.Terrace) zoParam += "/dakterras";
            
            var query = new List<string>
            {
                $"type={Uri.EscapeDataString(searchParams.PropertyType)}",
                $"zo=/{Uri.EscapeDataString(zoParam)}"
            };

            query.Add($"page={page}");
            query.Add($"pagesize={searchParams.PageSize}");

            builder.Query = string.Join("&", query);

            return builder.ToString();
        }
    }
} 