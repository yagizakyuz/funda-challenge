import { useState } from 'react';
import { AgentListingsTable } from './table/agent-listings-table'
import { streamAgents } from './shared/api'
import { Agent } from './shared/types'
import { Combobox } from './shared/Combobox';
import { Checkbox } from './shared/Checkbox';
import { Search } from 'lucide-react';
import { FilterContainer, CityFilter, AmenitiesFilter, SearchButton } from './main.component';
import { LoadingIndicator } from './shared/LoadingIndicator';
import { StylizedSpinner } from './shared/StylizedSpinner';

const CITIES = [
  'Alkmaar',
  'Almere',
  'Amersfoort',
  'Amsterdam',
  'Apeldoorn',
  'Arnhem',
  'Breda',
  'Delft',
  'Den Haag',
  'Dordrecht',
  'Ede',
  'Eindhoven',
  'Enschede',
  'Groningen',
  'Haarlem',
  'Haarlemmermeer',
  'Hilversum',
  'Leeuwarden',
  'Leiden',
  'Middelburg',
  'Nijmegen',
  'Roermond',
  'Rotterdam',
  'Sittard',
  'Tiel',
  'Tilburg',
  'Uden',
  'Utrecht',
  'Veldhoven',
  'Wageningen',
  'Wierden',
  'Wijchen',
  'Woerden',
  'Zaanstad',
  'Zaltbommel',
  'Zoetermeer',
  'Zwijndrecht',
  'Zwolle'
];

export const AgentListings = () => {
  const [agents, setAgents] = useState<Agent[]>([]);
  const [isLoading, setIsLoading] = useState(false); 
  const [progress, setProgress] = useState(0);
  const [selectedCity, setSelectedCity] = useState<string | null>('Alkmaar');
  const [hasSearched, setHasSearched] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [filters, setFilters] = useState({
    balkon: false,
    dakterras: false,
    tuin: false,
  });

  const handleSearch = async () => {
    try {
      if (!selectedCity) {
        return;
      }
      
      setIsLoading(true);
      setHasSearched(true);
      setError(null);
      setProgress(0);
      
      const data = await streamAgents(
        (progress) => setProgress(progress),
        selectedCity.toLowerCase(),
        'koop',
        filters
      );
      setAgents(data);
    } catch (err) {
      console.error(err);
      setError(err instanceof Error ? err.message : 'An unexpected error occurred');
      setAgents([]);
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading) {
    return (
      <div className="p-6 max-w-7xl mx-auto">
        <LoadingIndicator 
          progress={progress} 
          title={`Searching for top agents in ${selectedCity}`}
        />
      </div>
    );
  }

  return (
    <div className="p-6 max-w-7xl mx-auto">
      
      <h1 className="text-2xl font-semibold text-gray-900 mb-6" style={{textAlign: 'center'}}>Real Estate Agents</h1>
      <FilterContainer>
        <CityFilter>
          <Combobox
            options={CITIES}
            value={selectedCity}
            onChange={setSelectedCity}
            placeholder="Select a city..."
          />
        </CityFilter>
        <AmenitiesFilter>
          <Checkbox
            label="Balkon"
            checked={filters.balkon}
            onChange={(checked) => setFilters(prev => ({ ...prev, balkon: checked }))}
          />
          <Checkbox
            label="Dakterras"
            checked={filters.dakterras}
            onChange={(checked) => setFilters(prev => ({ ...prev, dakterras: checked }))}
          />
          <Checkbox
            label="Tuin"
            checked={filters.tuin}
            onChange={(checked) => setFilters(prev => ({ ...prev, tuin: checked }))}
          />
        </AmenitiesFilter>
        <SearchButton 
          onClick={handleSearch}
          disabled={isLoading}
        >
          {isLoading ? (
            <StylizedSpinner type="dots" size="small" color="white" />
          ) : (
            <>
              <Search size={16} />
              Search Agents
            </>
          )}
        </SearchButton>
      </FilterContainer>
      
      {hasSearched && agents.length === 0 && !isLoading && !error && (
        <div className="mt-8 text-center">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-gray-100 mb-4">
            <Search size={24} className="text-gray-400" />
          </div>
          <h3 className="text-lg font-medium text-gray-800 mb-2">No agents found</h3>
          <p className="text-sm text-gray-500 max-w-md mx-auto">
            We couldn't find any agents matching your criteria. Try adjusting your filters or selecting a different city.
          </p>
        </div>
      )}
      
      {error && (
        <div className="mt-8 text-center">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-red-100 mb-4">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-red-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
            </svg>
          </div>
          <h3 className="text-lg font-medium text-gray-800 mb-2">Error loading data</h3>
          <p className="text-sm text-red-500 max-w-md mx-auto mb-4">
            {error}
          </p>
          <button 
            onClick={handleSearch}
            className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
          >
            Try Again
          </button>
        </div>
      )}
      
      {agents.length > 0 && (

          <AgentListingsTable 
            agents={agents} 
          />
      )}
    </div>
  );
} 