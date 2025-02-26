import React, { useState, useRef, useEffect } from 'react';
import styled from 'styled-components';
import { Search } from 'lucide-react';

const ComboboxContainer = styled.div`
  position: relative;
  width: 100%;
`;

const InputWrapper = styled.div`
  position: relative;
  display: flex;
  align-items: center;
`;

const StyledInput = styled.input`
  width: 100%;
  padding: 8px 32px 8px 12px;
  border: 1px solid #e2e8f0;
  border-radius: 6px;
  font-size: 14px;
  outline: none;
  
  &:focus {
    border-color: #3182ce;
    box-shadow: 0 0 0 1px #3182ce;
  }
`;

const SearchIcon = styled(Search)`
  position: absolute;
  right: 8px;
  color: #718096;
  width: 18px;
  height: 18px;
`;

const OptionsList = styled.ul<{ isOpen: boolean }>`
  position: absolute;
  top: 100%;
  left: 0;
  right: 0;
  margin-top: 4px;
  padding: 0;
  list-style: none;
  background: white;
  border: 1px solid #e2e8f0;
  border-radius: 6px;
  box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
  max-height: 200px;
  overflow-y: auto;
  display: ${props => props.isOpen ? 'block' : 'none'};
  z-index: 10;
`;

const Option = styled.li<{ isHighlighted: boolean }>`
  padding: 8px 12px;
  cursor: pointer;
  background: ${props => props.isHighlighted ? '#f7fafc' : 'transparent'};
  
  &:hover {
    background: #f7fafc;
  }
`;

interface ComboboxProps {
  options: string[];
  value: string | null | undefined;
  onChange: (value: string | null) => void;
  placeholder?: string;
}

export const Combobox: React.FC<ComboboxProps> = ({
  options,
  value,
  onChange,
  placeholder = 'Select a city...'
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [search, setSearch] = useState('');
  const [highlightedIndex, setHighlightedIndex] = useState(-1);
  const containerRef = useRef<HTMLDivElement>(null);

  const filteredOptions = options.filter(option =>
    option.toLowerCase().includes(search.toLowerCase())
  );

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setIsOpen(false);
        
        // Validate input when clicking outside
        if (search) {
          const matchingOption = options.find(
            option => option.toLowerCase() === search.toLowerCase()
          );
          
          if (matchingOption) {
            // If exact match found, set it
            onChange(matchingOption);
          } else {
            // If no match found, clear the input and value
            setSearch('');
            onChange(null);
          }
        }
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [options, onChange, search]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const inputValue = e.target.value;
    setSearch(inputValue);
    setIsOpen(true);
    
    // Clear the value if input is empty
    if (inputValue === '') {
      onChange(null);
    } else {
      // Check if the input matches any option
      const matchingOptions = options.filter(option => 
        option.toLowerCase().includes(inputValue.toLowerCase())
      );
      
      // If no matches found, clear the selected value
      if (matchingOptions.length === 0) {
        onChange(null);
      }
    }
  };

  const handleOptionClick = (option: string) => {
    onChange(option);
    setSearch('');
    setIsOpen(false);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'ArrowDown') {
      e.preventDefault();
      setHighlightedIndex(prev => 
        prev < filteredOptions.length - 1 ? prev + 1 : prev
      );
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setHighlightedIndex(prev => prev > 0 ? prev - 1 : prev);
    } else if (e.key === 'Enter' && highlightedIndex >= 0) {
      handleOptionClick(filteredOptions[highlightedIndex]);
    } else if (e.key === 'Escape') {
      setIsOpen(false);
    }
  };

  return (
    <ComboboxContainer ref={containerRef}>
      <InputWrapper>
        <StyledInput
          type="text"
          value={search || value || ''}
          onChange={handleInputChange}
          onFocus={() => setIsOpen(true)}
          onKeyDown={handleKeyDown}
          placeholder={placeholder}
        />
        <SearchIcon />
      </InputWrapper>
      <OptionsList isOpen={isOpen}>
        {filteredOptions.map((option, index) => (
          <Option
            key={option}
            onClick={() => handleOptionClick(option)}
            isHighlighted={index === highlightedIndex}
          >
            {option}
          </Option>
        ))}
      </OptionsList>
    </ComboboxContainer>
  );
};
