import { Agent } from "./types";

const API_BASE_URL = 'http://localhost:5185/api';

export type ProgressCallback = (progress: number) => void;

interface StreamResponse<T> {
  Type: 'Progress' | 'Data' | 'Error';
  Payload: T;
}

type StreamPayload = number | Agent[] | string;

interface AmenityFilters {
  balkon: boolean;
  dakterras: boolean;
  tuin: boolean;
}

export const streamAgents = (
  onProgress: ProgressCallback,
  location: string = 'utrecht',
  propertyType: string = 'koop',
  amenities: AmenityFilters
): Promise<Agent[]> => {
  return new Promise((resolve, reject) => {

    const params = new URLSearchParams({
      location,
      propertyType,
      balkon: amenities.balkon.toString(),
      dakterras: amenities.dakterras.toString(),
      tuin: amenities.tuin.toString()
    });

    const eventSource = new EventSource(
      `${API_BASE_URL}/agent/stream/?${params}`
    );

    eventSource.onmessage = (event) => {
      // Split by newlines and process each line
      const lines = event.data.split('\n');
      
      for (const line of lines) {
        const trimmedLine = line.trim();
        
        try {
          const response = JSON.parse(trimmedLine) as StreamResponse<StreamPayload>;

          switch (response.Type) {
            case 'Progress':
              onProgress(response.Payload as number);
              break;
            case 'Data':
              resolve(response.Payload as Agent[]);
              eventSource.close();
              break;
            case 'Error':
              throw new Error(response.Payload as string);
            default:
              console.warn('Unexpected response type:', response.Type);
          }
        } catch (e) {
          console.debug('Failed to parse line:', trimmedLine, e);
          // Don't reject on individual line parse errors
          continue;
        }
      }
    };

    eventSource.onerror = (error) => {
      reject(new Error('EventSource connection failed: ' + error));
      eventSource.close();
    };
  });
};
