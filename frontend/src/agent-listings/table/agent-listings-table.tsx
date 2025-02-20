import { useState } from 'react';
import { Agent } from '../shared/types';
import { TableHeader } from './table-header';
import { TableBody } from './table-body';
import { TableContainer, Table } from './agent-listings-table.component';

export const AgentListingsTable = ({ agents }: { agents: Agent[] }) => {
  const [sortConfig, setSortConfig] = useState<{key: keyof Agent, direction: 'asc' | 'desc'}>({
    key: 'ListingCount',
    direction: 'desc'
  });

  const sortedData = [...agents].sort((a, b) => {
    const aVal = a[sortConfig.key];
    const bVal = b[sortConfig.key];
    return sortConfig.direction === 'asc' 
      ? (aVal > bVal ? 1 : -1)
      : (aVal < bVal ? 1 : -1);
  });

  const handleSort = (key: keyof Agent) => {
    setSortConfig({
      key,
      direction: sortConfig.key === key && sortConfig.direction === 'desc' ? 'asc' : 'desc'
    });
  };
  
  return (
    <TableContainer>
      <Table>
        <TableHeader sortConfig={sortConfig} onSort={handleSort} />
        <TableBody agents={sortedData} />
      </Table>
    </TableContainer>
  );
}; 