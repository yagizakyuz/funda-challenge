import React from 'react';
import styled, { keyframes } from 'styled-components';
import { Check } from 'lucide-react';

interface LoadingIndicatorProps {
  progress: number;
  title?: string;
}

const Container = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 1.5rem;
  padding: 2rem;
  max-width: 800px;
  margin: 0 auto;
`;

const Title = styled.h2`
  font-size: 2rem;
  font-weight: 600;
  color: #374151;
  margin: 0;
  text-align: center;
`;

const ProgressBarContainer = styled.div`
  width: 100%;
  height: 16px;
  background-color: #EEF2FF;
  border-radius: 9999px;
  overflow: hidden;
  position: relative;
  margin-top: 2rem;
`;

const ProgressBar = styled.div<{ width: number }>`
  height: 100%;
  width: ${props => props.width}%;
  background-color: #4F46E5;
  border-radius: 9999px;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: width 0.3s ease;
`;

const CompleteText = styled.div`
  font-size: 1rem;
  color: #4B5563;
  margin-top: 1rem;
`;

const CheckmarkContainer = styled.div`
  display: flex;
  justify-content: center;
  margin-top: 1.5rem;
`;

const CheckIcon = styled(Check)`
  color: #10B981;
  width: 2.5rem;
  height: 2.5rem;
`;

// Animation for the loading dots
const bounce = keyframes`
  0%, 80%, 100% { 
    transform: translateY(0);
  }
  40% { 
    transform: translateY(-10px);
  }
`;

const LoadingDotsContainer = styled.div`
  display: flex;
  justify-content: center;
  gap: 0.5rem;
  margin-top: 1rem;
`;

const LoadingDot = styled.div<{ delay: string }>`
  width: 12px;
  height: 12px;
  background-color: #4F46E5;
  border-radius: 50%;
  animation: ${bounce} 1.4s infinite ease-in-out;
  animation-delay: ${props => props.delay};
`;

export const LoadingIndicator: React.FC<LoadingIndicatorProps> = ({ 
  progress, 
  title = "Data Loading"
}) => {
  const isComplete = progress >= 100;
  
  return (
    <Container>
      <Title>{title}</Title>

      
      <ProgressBarContainer>
        <ProgressBar width={progress} />
      </ProgressBarContainer>
      
      <CompleteText>{progress}% Complete</CompleteText>
      
      {isComplete && (
        <CheckmarkContainer>
          <CheckIcon />
        </CheckmarkContainer>
      )}

{!isComplete && (
        <LoadingDotsContainer>
          <LoadingDot delay="0s" />
          <LoadingDot delay="0.2s" />
          <LoadingDot delay="0.4s" />
        </LoadingDotsContainer>
      )}

    </Container>
  );
}; 