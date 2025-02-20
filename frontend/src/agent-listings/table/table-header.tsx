import { Agent } from "../shared/types";
import { Th, HeaderCell, SortIcon } from "./agent-listings-table.component";

interface TableHeaderProps {
  sortConfig: {
    key: keyof Agent;
    direction: 'asc' | 'desc';
  };
  onSort: (key: keyof Agent) => void;
}

export const TableHeader = ({ sortConfig, onSort }: TableHeaderProps) => (
  <thead>
    <tr>
      <Th style={{ width: '50px', textAlign: 'center' }}>#</Th>
      <Th onClick={() => onSort('ID')}>
        <HeaderCell>
          <span>ID</span>
          <SortIcon 
            $active={sortConfig.key === 'ID'}
            $direction={sortConfig.direction}
          />
        </HeaderCell>
      </Th>
      <Th onClick={() => onSort('Name')}>
        <HeaderCell>
          <span>Agent Name</span>
          <SortIcon 
            $active={sortConfig.key === 'Name'}
            $direction={sortConfig.direction}
          />
        </HeaderCell>
      </Th>
      <Th onClick={() => onSort('ListingCount')}>
        <HeaderCell>
          <span>Listings</span>
          <SortIcon 
            $active={sortConfig.key === 'ListingCount'}
            $direction={sortConfig.direction}
          />
        </HeaderCell>
      </Th>
      <Th onClick={() => onSort('AveragePrice')}>
        <HeaderCell>
          <span>Average Listing Price</span>
          <SortIcon 
            $active={sortConfig.key === 'AveragePrice'}
            $direction={sortConfig.direction}
          />
        </HeaderCell>
      </Th>
    </tr>
  </thead>
); 


