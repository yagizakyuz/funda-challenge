import React from 'react';
import styled, { keyframes } from 'styled-components';

type SpinnerType = 'circle' | 'dots' | 'bars';
type SpinnerSize = 'small' | 'medium' | 'large';

interface StylizedSpinnerProps {
  type?: SpinnerType;
  size?: SpinnerSize;
  color?: string;
  className?: string;
}

// Keyframes for different animations
const rotate = keyframes`
  from { transform: rotate(0deg); }
  to { transform: rotate(360deg); }
`;

const bounce = keyframes`
  0%, 80%, 100% { transform: scale(0); }
  40% { transform: scale(1); }
`;

const grow = keyframes`
  0%, 100% { transform: scaleY(0.4); }
  20% { transform: scaleY(1); }
`;

// Size mappings
const sizeMap = {
  small: {
    container: '24px',
    thickness: '2px',
    dot: '6px',
    bar: '3px'
  },
  medium: {
    container: '40px',
    thickness: '3px',
    dot: '8px',
    bar: '4px'
  },
  large: {
    container: '60px',
    thickness: '4px',
    dot: '12px',
    bar: '6px'
  }
};

interface ContainerProps {
  size: SpinnerSize;
}

// Base container for all spinner types
const Container = styled.div<ContainerProps>`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: ${props => sizeMap[props.size].container};
  height: ${props => sizeMap[props.size].container};
`;

interface CircleSpinnerProps {
  size: SpinnerSize;
  color: string;
}

// Circle spinner
const CircleSpinner = styled.div<CircleSpinnerProps>`
  width: 100%;
  height: 100%;
  border: ${props => sizeMap[props.size].thickness} solid rgba(0, 0, 0, 0.1);
  border-top-color: ${props => props.color};
  border-radius: 50%;
  animation: ${rotate} 0.8s linear infinite;
`;

// Dots container
const DotsContainer = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 4px;
`;

interface DotProps {
  size: SpinnerSize;
  color: string;
  delayTime: number;
}

// Individual dot
const Dot = styled.div<DotProps>`
  width: ${props => sizeMap[props.size].dot};
  height: ${props => sizeMap[props.size].dot};
  background-color: ${props => props.color};
  border-radius: 50%;
  animation: ${bounce} 1.4s infinite ease-in-out both;
  animation-delay: ${props => props.delayTime}s;
`;

// Bars container
const BarsContainer = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 2px;
  height: 100%;
`;

interface BarProps {
  size: SpinnerSize;
  color: string;
  delayTime: number;
}

// Individual bar
const Bar = styled.div<BarProps>`
  width: ${props => sizeMap[props.size].bar};
  height: 100%;
  background-color: ${props => props.color};
  animation: ${grow} 1s infinite ease-in-out;
  animation-delay: ${props => props.delayTime}s;
`;

export const StylizedSpinner: React.FC<StylizedSpinnerProps> = ({
  type = 'circle',
  size = 'medium',
  color = '#3182ce',
  className
}) => {
  const renderSpinner = () => {
    switch (type) {
      case 'circle':
        return <CircleSpinner size={size} color={color} />;
      
      case 'dots':
        return (
          <DotsContainer>
            {[0, 0.2, 0.4].map((delay, index) => (
              <Dot key={index} size={size} color={color} delayTime={delay} />
            ))}
          </DotsContainer>
        );
      
      case 'bars':
        return (
          <BarsContainer>
            {[0, 0.1, 0.2, 0.3, 0.4].map((delay, index) => (
              <Bar key={index} size={size} color={color} delayTime={delay} />
            ))}
          </BarsContainer>
        );
      
      default:
        return <CircleSpinner size={size} color={color} />;
    }
  };

  return (
    <Container size={size} className={className}>
      {renderSpinner()}
    </Container>
  );
}; 