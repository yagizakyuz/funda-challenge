using System.Net;
using Polly;
using FundaApiBackend.Configuration;
using FundaApiBackend.Services;

var builder = WebApplication.CreateBuilder(args);

builder.Logging.ClearProviders();
builder.Logging.AddConsole();

builder.Services.AddMemoryCache();

builder.Services.Configure<FundaApiOptions>(
    builder.Configuration.GetSection(FundaApiOptions.ConfigurationSection));

builder.Services.AddScoped<IFundaUrlBuilder, FundaUrlBuilder>();
builder.Services.AddScoped<IFundaDataFetcher, FundaDataFetcher>();
builder.Services.AddScoped<IAgentService, AgentService>();

builder.Services.AddHttpClient<FundaDataFetcher>();

// Configure CORS
var AllowSpecificOrigins = "_AllowSpecificOrigins";
builder.Services.AddCors(options =>
{
    options.AddPolicy(name: AllowSpecificOrigins,
        policy =>
        {
            policy.WithOrigins("http://localhost:5173")
                  .AllowAnyHeader()
                  .AllowAnyMethod();
        });
});


builder.Services.AddControllers();

var app = builder.Build();
app.UseCors(AllowSpecificOrigins);
app.MapControllers();

app.Run();