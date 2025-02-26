import styled from 'styled-components';

export const FilterContainer = styled.div`
  margin-bottom: 24px;
  max-width: 800px;
  margin-left: auto;
  margin-right: auto;
  display: flex;
  align-items: center;
  gap: 24px;
  flex-wrap: wrap;
`;

export const CityFilter = styled.div`
  width: 300px;
`;

export const AmenitiesFilter = styled.div`
  display: flex;
  align-items: center;
  flex-wrap: wrap;
  gap: 8px;
`;

export const SearchButton = styled.button`
  display: flex;
  align-items: center;
  gap: 8px;
  background: #3182ce;
  color: white;
  padding: 8px 16px;
  border-radius: 6px;
  border: none;
  cursor: pointer;
  font-size: 14px;
  transition: background 150ms;

  &:hover {
    background: #2c5282;
  }

  &:disabled {
    background: #cbd5e0;
    cursor: not-allowed;
  }
`; 