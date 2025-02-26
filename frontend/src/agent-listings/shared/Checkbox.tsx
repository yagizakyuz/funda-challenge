import React from 'react';
import styled from 'styled-components';
import { Check } from 'lucide-react';

const CheckboxContainer = styled.label`
  display: inline-flex;
  align-items: center;
  cursor: pointer;
  margin-right: 16px;
`;

const HiddenCheckbox = styled.input.attrs({ type: 'checkbox' })`
  position: absolute;
  opacity: 0;
  cursor: pointer;
  height: 0;
  width: 0;
`;

const StyledCheckbox = styled.div<{ checked: boolean }>`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 20px;
  height: 20px;
  background: ${props => props.checked ? '#3182ce' : 'white'};
  border: 1px solid ${props => props.checked ? '#3182ce' : '#e2e8f0'};
  border-radius: 4px;
  transition: all 150ms;
  margin-right: 8px;

  svg {
    visibility: ${props => props.checked ? 'visible' : 'hidden'};
    color: white;
    width: 14px;
    height: 14px;
  }
`;

const Label = styled.span`
  font-size: 14px;
  color: #4a5568;
`;

interface CheckboxProps {
  label: string;
  checked: boolean;
  onChange: (checked: boolean) => void;
}

export const Checkbox: React.FC<CheckboxProps> = ({ label, checked, onChange }) => (
  <CheckboxContainer>
    <HiddenCheckbox
      checked={checked}
      onChange={e => onChange(e.target.checked)}
    />
    <StyledCheckbox checked={checked}>
      <Check />
    </StyledCheckbox>
    <Label>{label}</Label>
  </CheckboxContainer>
); 