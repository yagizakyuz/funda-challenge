using FundaApiBackend.Models;
using FundaApiBackend.Services;
using Microsoft.AspNetCore.Mvc;

namespace FundaApiBackend.Controllers;

[ApiController]
[Route("api/[controller]")]
    public class AgentController : ControllerBase
    {
        private readonly IAgentService _agentService;
        private readonly ILogger<AgentController> _logger;

        public AgentController(IAgentService agentService, ILogger<AgentController> logger)
        {
            _agentService = agentService;
            _logger = logger;
        }

        [HttpGet("stream")]
        public async Task GetAgentStream(
            string location = "amsterdam",
            string propertyType = "koop",
            bool tuin = false,
            bool balkon = false,
            bool dakterras = false,
            CancellationToken cancellationToken = default)
        {
            _logger.LogInformation(
                "Received request - Location: {Location}, PropertyType: {PropertyType}, Features: Tuin={Tuin}, Balkon={Balkon}, Dakterras={Dakterras}",
                location, propertyType, tuin, balkon, dakterras);

            Response.ContentType = "text/event-stream";
            Response.Headers.Append("Cache-Control", "no-cache");
            Response.Headers.Append("Connection", "keep-alive");

            try 
            {
                var features = new List<string>();
                if (tuin) features.Add("tuin");
                if (balkon) features.Add("balkon");
                if (dakterras) features.Add("dakterras");

                var progress = new Progress<int>(async percentage =>
                {
                    if (!cancellationToken.IsCancellationRequested)
                    {
                        await SendStreamResponse(StreamResponseType.Progress, percentage);
                    }
                });

                var agents = await _agentService.GetTopAgentsAsync(
                    new FundaSearchParameters
                    {
                        Location = location,
                        PropertyType = propertyType,
                        Garden = tuin,
                        Balcony = balkon,
                        Terrace = dakterras
                    }, 
                    progress,
                    cancellationToken);

                if (!cancellationToken.IsCancellationRequested)
                {
                    await SendStreamResponse(StreamResponseType.Data, agents);
                }
            }
            catch (OperationCanceledException)
            {
                if (!Response.HasStarted)
                {
                    await SendStreamResponse(StreamResponseType.Error, "Client closed request");
                }
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error fetching agent data");
                if (!Response.HasStarted)
                {
                    await SendStreamResponse(StreamResponseType.Error, ex.Message);
                }
            }
        }

        private async Task SendStreamResponse<T>(StreamResponseType type, T payload)
        {
            var response = new StreamResponse<T>
            {
                Type = type,
                Payload = payload
            };
        await Response.WriteAsync(response.ToServerSentEvent());
    }
} 