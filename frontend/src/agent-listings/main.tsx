import { useEffect, useState } from 'react';
import { AgentListingsTable } from './table/agent-listings-table'
import { streamAgents } from './shared/api'
import { Agent } from './shared/types'

export const AgentListings = () => {
  const [agents, setAgents] = useState<Agent[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const loadAgents = async () => {
      try {
        setIsLoading(true);
        const data = await streamAgents(
          (progress) => setProgress(progress)
        );
        setAgents(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to load agents');
      } finally {
        setIsLoading(false);
      }
    };

    loadAgents();
  }, []);

  if (isLoading) {
    return (
      <div className="p-6 max-w-7xl mx-auto">
        <div className="flex flex-col items-center gap-4">
          <div className="w-full max-w-md bg-gray-200 rounded-full h-2.5">
            <div 
              className="bg-blue-600 h-2.5 rounded-full transition-all duration-300" 
              style={{ width: `${progress}%` }}
            />
          </div>
          <div className="text-sm text-gray-600">Loading... {progress}%</div>
        </div>
      </div>
    );
  }

  if (error) {
    return <div>Error: {error}</div>;
  }

  return (
    <div className="p-6 max-w-7xl mx-auto">
      <h1 className="text-2xl font-semibold text-gray-900 mb-6" style={{textAlign: 'center'}}>Real Estate Agents</h1>
      <AgentListingsTable 
        agents={agents} 
      />
    </div>
  );
} 