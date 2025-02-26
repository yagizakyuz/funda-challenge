namespace FundaApiBackend.Services;

using FundaApiBackend.Models;
using FundaApiBackend.Configuration;
using System;
using System.Collections.Generic;
using System.Text.Json;
using System.Threading;
using System.Threading.Tasks;
using System.Linq;
using System.Collections.Concurrent;
using Microsoft.Extensions.Options;

public interface IFundaDataFetcher
{
    Task<Dictionary<int, Agent>> GetAgentListingCountsAsync(
        FundaSearchParameters searchParams,
        IProgress<int>? progress = null);
}

public class FundaDataFetcher : IFundaDataFetcher
{
    private readonly HttpClient _client;
    private readonly IFundaUrlBuilder _urlBuilder;
    private readonly SemaphoreSlim _throttler;
    private readonly TimeSpan _apiDelay;
    private readonly int _maxRetries;
    private readonly TimeSpan _retryDelay;

    public FundaDataFetcher(
        HttpClient client,
        IFundaUrlBuilder urlBuilder,
        IOptions<FundaApiOptions> options)
    {
        _client = client;
        _urlBuilder = urlBuilder;
        _throttler = new SemaphoreSlim(options.Value.MaxConcurrentRequests);
        _apiDelay = TimeSpan.FromSeconds(options.Value.RequestDelaySeconds);
        _maxRetries = options.Value.MaxRetries;
        _retryDelay = TimeSpan.FromSeconds(options.Value.RetryDelaySeconds);
    }

    private void UpdateAgents(ConcurrentDictionary<int, Agent> agentCounts, Property property)
    {
        agentCounts.AddOrUpdate(
            property.AgentId,
            new Agent
            {
                ID = property.AgentId,
                Name = property.AgentName,
                ListingCount = 1,
                AveragePrice = property.Price
            },
            (_, agent) => new Agent
            {
                ID = property.AgentId,
                Name = property.AgentName,
                ListingCount = agent.ListingCount + 1,
                AveragePrice = agent.AveragePrice + ((property.Price - agent.AveragePrice) / (agent.ListingCount + 1))
            }
        );
    }

    public async Task<Dictionary<int, Agent>> GetAgentListingCountsAsync(
        FundaSearchParameters searchParams,
        IProgress<int>? progress = null)
    {
        var agentCounts = new ConcurrentDictionary<int, Agent>();

        // get first page
        var firstPageUrl = _urlBuilder.BuildSearchUrl(searchParams);
        var initialResponse = await FetchPageAsync(firstPageUrl);
        if (initialResponse?.Properties == null || initialResponse.Properties.Count == 0) return new Dictionary<int, Agent>();


        // process first page
        foreach (var property in initialResponse.Properties)
        {
            UpdateAgents(agentCounts, property);
        }

        progress?.Report(1);

        var totalPages = initialResponse.Paging.TotalPages;
        var processedPages = 1;

        // fetch remaining pages in parallel
        var tasks = Enumerable.Range(2, totalPages - 1)
            .Select(async page =>
            {
                await _throttler.WaitAsync();
                try
                {
                    var url = _urlBuilder.BuildSearchUrl(searchParams, page);
                    var result = await FetchPageAsync(url);
                    if (result?.Properties?.Count > 0)
                    {
                        foreach (var property in result.Properties)
                        {
                            UpdateAgents(agentCounts, property);
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
        progress?.Report(100);

        return new Dictionary<int, Agent>(agentCounts);
    }

    private async Task<FundaResponse?> FetchPageAsync(string url)
    {
        var retryDelay = _retryDelay;

        for (int attempt = 0; attempt <= _maxRetries; attempt++)
        {
            try
            {
                var response = await _client.GetAsync(url);
                response.EnsureSuccessStatusCode();
                var content = await response.Content.ReadAsStringAsync();
                return JsonSerializer.Deserialize<FundaResponse>(content);
            }
            catch (Exception) when (attempt < _maxRetries)
            {
                await Task.Delay(retryDelay);
                retryDelay *= 2; // exponential backoff
            }
        }

        throw new HttpRequestException($"Failed to fetch data from Funda API after {_maxRetries} attempts");
    }
}