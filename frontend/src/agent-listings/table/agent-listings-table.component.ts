import styled from 'styled-components';
import { ArrowUpDown } from 'lucide-react';

export const TableContainer = styled.div`
  width: 100%;
  display: flex;
  justify-content: center;
  margin: 2rem;

`;

export const Table = styled.table`
  width: 60%;
  border-collapse: collapse;
  background-color: white;
  font-size: 0.9rem;
  box-shadow: 0 0 20px rgba(0, 0, 0, 0.1);
  border-radius: 8px;
`;

export const Th = styled.th`
  background-color: #f8f9fa;
  padding: 1rem;
  text-align: left;
  font-weight: 600;
  color: #495057;
  border-bottom: 2px solid #dee2e6;
  cursor: pointer;

  &:hover {
    background-color: #f1f3f5;
  }
`;

export const Td = styled.td`
  padding: 1rem;
  border-bottom: 1px solid #dee2e6;
  color: #212529;
  text-align: left;
`;

export const Tr = styled.tr`
  transition: all 0.2s;
  cursor: pointer;

  &:hover {
    background-color: rgba(59, 130, 246, 0.05);
  }

  &:last-child ${Td} {
    border-bottom: none;
  }
`;

export const HeaderCell = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 0.5rem;
`;

export const MonoText = styled.span`
  font-family: monospace;
  font-size: 0.875rem;
  color: #6b7280;
  transition: color 0.2s;

  ${Tr}:hover & {
    color: #3b82f6;
  }
`;

export const ListingCount = styled.span`
  font-size: 0.875rem;
  font-weight: 700;
  color: #374151;
  transition: color 0.2s;

  ${Tr}:hover & {
    color: #3b82f6;
  }
`;

export const SortIcon = styled(ArrowUpDown)<{ $active: boolean; $direction: 'asc' | 'desc' }>`
  height: 12px;
  width: 12px;
  vertical-align: middle;

  color: ${props => props.$active ? '#3b82f6' : '#9ca3af'};
  transform: ${props => props.$direction === 'desc' ? 'rotate(180deg)' : 'rotate(0deg)'};
  transition: all 0.2s;
`;

export const NumberCell = styled(Td)`
  width: 50px;
  text-align: center;
  color: #6b7280;
  font-size: 0.875rem;
  font-family: monospace;
`; 