namespace FundaApiBackend;

using FundaApiBackend.Models;
using System;
using System.Collections.Generic;
using System.Text.Json;
using System.Threading;
using System.Threading.Tasks;
using System.Linq;
using System.Collections.Concurrent;
using Microsoft.Extensions.Configuration;

public class FundaDataFetcher
{
    private readonly HttpClient _client;
    private readonly FundaUrlBuilder _urlBuilder;
    private readonly SemaphoreSlim _throttler = new(1);
    private readonly TimeSpan _apiDelay = TimeSpan.FromSeconds(1);

    public FundaDataFetcher(HttpClient client, IConfiguration configuration)
    {
        _client = client;
        var apiKey = configuration["Funda:ApiKey"] ?? throw new ArgumentException("Funda API key not found in configuration");
        _urlBuilder = new FundaUrlBuilder(apiKey);
    }

    private void UpdateAgentCounts(ConcurrentDictionary<int, Agent> agentCounts, Property property)
    {
        agentCounts.AddOrUpdate(
            property.AgentId,
            new Agent { 
                ID = property.AgentId, 
                Name = property.AgentName, 
                ListingCount = 1,
                AveragePrice = property.Price ?? 0m
            },
            (_, agent) => new Agent { 
                ID = property.AgentId, 
                Name = property.AgentName, 
                ListingCount = agent.ListingCount + 1,
                AveragePrice = agent.AveragePrice + ((property.Price ?? 0m) - agent.AveragePrice) / (agent.ListingCount + 1)
            }
        );
    }

    public async Task<Dictionary<int, Agent>> GetAgentListingCountsAsync(
        string location = "amsterdam", 
        string propertyType = "koop", 
        bool withGarden = false,
        IProgress<int>? progress = null)
    {
        var agentCounts = new ConcurrentDictionary<int, Agent>();
        
        // get first page
        var firstPageUrl = _urlBuilder.BuildSearchUrl(location, propertyType, withGarden);
        var initialResponse = await FetchPageAsync(firstPageUrl);
        if (initialResponse?.Properties == null) return new Dictionary<int, Agent>();

        // process first page
        foreach (var property in initialResponse.Properties)
        {
            UpdateAgentCounts(agentCounts, property);
        }

        progress?.Report(1); // first page done

        var totalPages = initialResponse.Paging.TotalPages;
        var processedPages = 1;

        // fetch remaining pages in parallel
        var tasks = Enumerable.Range(2, totalPages - 1)
            .Select(async page =>
            {
                await _throttler.WaitAsync();
                try
                {
                    var url = _urlBuilder.BuildSearchUrl(location, propertyType, withGarden, page);
                    var result = await FetchPageAsync(url);
                    if (result?.Properties?.Any() == true)
                    {
                        foreach (var property in result.Properties)
                        {
                            UpdateAgentCounts(agentCounts, property);
                        }
                    }
                    var completed = Interlocked.Increment(ref processedPages);
                    progress?.Report(completed * 100 / totalPages);
                }
                finally
                {
                    await Task.Delay(_apiDelay);
                    _throttler.Release();
                }
            });

        await Task.WhenAll(tasks);
        progress?.Report(100); // ensure we hit 100%

        return new Dictionary<int, Agent>(agentCounts);
    }

    private async Task<FundaResponse?> FetchPageAsync(string url)
    {
        var response = await _client.GetAsync(url);
        if (!response.IsSuccessStatusCode)
        {
            response.EnsureSuccessStatusCode();
        }
        
        var content = await response.Content.ReadAsStringAsync();
        return JsonSerializer.Deserialize<FundaResponse>(content);
    }
}