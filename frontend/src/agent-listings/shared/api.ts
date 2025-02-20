import { Agent } from "./types";

const API_BASE_URL = 'http://localhost:5185/api';

// ?type=koop&pagesize=25

export const fetchAgents = async (
  location: string = 'amsterdam',
  propertyType: string = 'koop',
  withGarden: boolean = false
): Promise<Agent[]> => {
  const params = new URLSearchParams({
    location,
    propertyType,
    withGarden: withGarden.toString()
  });

  const response = await fetch(`${API_BASE_URL}/agents/garden?${params}`);
  if (!response.ok) {
    throw new Error('Failed to fetch agents');
  }
  return response.json();
};

export type ProgressCallback = (progress: number) => void;

interface StreamResponse {
  type: 'progress' | 'data';
  payload: number | Agent[];
}

export const streamAgents = (
  onProgress: ProgressCallback,
  location: string = 'amsterdam',
  propertyType: string = 'koop',
  withGarden: boolean = false
): Promise<Agent[]> => {
  return new Promise((resolve, reject) => {
    const params = new URLSearchParams({
      location,
      propertyType,
      withGarden: withGarden.toString()
    });

    const eventSource = new EventSource(
      `${API_BASE_URL}/agents/garden/stream?${params}`
    );

    eventSource.onmessage = (event) => {
      const data = event.data;
      
      try {
        // try to parse all incoming data as json first
        const parsed = JSON.parse(data) as StreamResponse | Agent[];

        // handle progress updates
        if (typeof parsed === 'number') {
          onProgress(parsed);
          return;
        }

        // handle final data
        if (Array.isArray(parsed)) {
          resolve(parsed);
          eventSource.close();
          return;
        }

        throw new Error('Invalid data format received');
      } catch (e) {
        console.error('Failed to parse stream data:', e);
        reject(new Error(`Stream parsing error: ${e instanceof Error ? e.message : String(e)}`));
        eventSource.close();
      }
    };

    eventSource.onerror = (error) => {
      reject(new Error('EventSource connection failed: '+  error));
      eventSource.close();
    };
  });
};
