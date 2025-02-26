namespace FundaApiBackend.Services;

using FundaApiBackend.Models;
using Microsoft.Extensions.Caching.Memory;
using System.Threading;

public interface IAgentService
{
    Task<IEnumerable<Agent>> GetTopAgentsAsync(
        FundaSearchParameters searchParams,
        IProgress<int>? progress = null,
        CancellationToken cancellationToken = default);
}

public class AgentService : IAgentService
{
    private readonly IFundaDataFetcher _dataFetcher;
    private readonly IMemoryCache _cache;
    private readonly ILogger<AgentService> _logger;

    public AgentService(
        IFundaDataFetcher dataFetcher,
        IMemoryCache cache,
        ILogger<AgentService> logger)
    {
        _dataFetcher = dataFetcher;
        _cache = cache;
        _logger = logger;
    }

    public async Task<IEnumerable<Agent>> GetTopAgentsAsync(
        FundaSearchParameters searchParams,
        IProgress<int>? progress = null,
        CancellationToken cancellationToken = default)
    {
        string cacheKey = GenerateCacheKey(searchParams);
        
        if (_cache.TryGetValue(cacheKey, out IEnumerable<Agent>? cachedAgents))
        {
            _logger.LogInformation("Returning cached agents for {location}", searchParams.Location);
            return cachedAgents!;
        }

        var agentCounts = await _dataFetcher.GetAgentListingCountsAsync(searchParams, progress);

        var topAgents = agentCounts
            .OrderByDescending(x => x.Value.ListingCount)
            .Take(30)
            .Select(x => x.Value);

        _cache.Set(cacheKey, topAgents, TimeSpan.FromMinutes(15));
        
        return topAgents;
    }

    private string GenerateCacheKey(FundaSearchParameters parameters)
    {
        return $"agents_{parameters.Location}_{parameters.PropertyType}_{parameters.Balcony}_{parameters.Garden}_{parameters.Terrace}";
    }
} 