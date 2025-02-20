using System.Net;
using FundaApiBackend;
using Polly;


var builder = WebApplication.CreateBuilder(args);

builder.Logging.ClearProviders();
builder.Logging.AddConsole();

// Register HttpClient with Polly policies
builder.Services.AddHttpClient<FundaDataFetcher>()
    .AddPolicyHandler((services, _) =>
    {
        var logger = services.GetRequiredService<ILogger<Program>>();
        return Policy
            .HandleResult<HttpResponseMessage>(r => r.StatusCode == HttpStatusCode.TooManyRequests || 
                         r.StatusCode == HttpStatusCode.Unauthorized)
            .Or<TimeoutException>()
            .WaitAndRetryAsync(
                10,
                retryAttempt => TimeSpan.FromSeconds(Math.Min(10, 2 * retryAttempt))
            );
    });

// Configure CORS
var MyAllowSpecificOrigins = "_myAllowSpecificOrigins";
builder.Services.AddCors(options =>
{
    options.AddPolicy(name: MyAllowSpecificOrigins,
        policy =>
        {
            policy.WithOrigins("http://localhost:5173")  // TODO change this
                  .AllowAnyHeader()
                  .AllowAnyMethod();
        });
});

builder.Services.AddScoped<FundaDataFetcher>();


var app = builder.Build();
app.UseCors(MyAllowSpecificOrigins);

app.MapGet("/api/agents/garden", async (
    FundaDataFetcher fetcher,
    string location = "amsterdam",
    string propertyType = "koop",
    bool withGarden = false) =>
{
    var agentCounts = await fetcher.GetAgentListingCountsAsync(location, propertyType, withGarden);
    return agentCounts
        .OrderByDescending(x => x.Value.ListingCount)
        .Take(30)
        .Select(x => x.Value);
});

// new streaming endpoint
app.MapGet("/api/agents/garden/stream", async (
    HttpContext context,
    FundaDataFetcher fetcher,
    string location = "amsterdam",
    string propertyType = "koop",
    bool withGarden = false) =>
{
    try 
    {
        context.Response.ContentType = "text/event-stream";
        context.Response.Headers.Append("Cache-Control", "no-cache");
        context.Response.Headers.Append("Connection", "keep-alive");
        
        var progress = new Progress<int>(percentage =>
        {
            if (!context.RequestAborted.IsCancellationRequested)
            {
                context.Response.WriteAsync($"data: {percentage}\n\n").Wait();
                context.Response.Body.FlushAsync().Wait();
            }
        });

        var agentCounts = await fetcher.GetAgentListingCountsAsync(location, propertyType, withGarden, progress);
        
        if (!context.RequestAborted.IsCancellationRequested)
        {
            var result = agentCounts
                .OrderByDescending(x => x.Value.ListingCount)
                .Take(30)
                .Select(x => x.Value);
            
            await context.Response.WriteAsync($"data: {System.Text.Json.JsonSerializer.Serialize(result)}\n\n");
        }
    }
    catch (Exception ex) when (!context.Response.HasStarted)
    {
        context.Response.StatusCode = 500;
        await context.Response.WriteAsJsonAsync(new { error = ex.Message });
    }
});

app.Run();
