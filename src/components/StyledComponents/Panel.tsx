import styled from 'styled-components';
import type { ReactNode } from 'react';

interface PanelProps {
  children: ReactNode;
  className?: string;
  padding?: 'small' | 'medium' | 'large';
  elevation?: 'none' | 'card' | 'elevated';
}

const StyledPanel = styled.div<{ $padding: string; $elevation: string }>`
  background-color: ${({ theme }) => theme.colors.background.secondary};
  border-radius: ${({ theme }) => theme.borderRadius.md};
  padding: ${({ $padding, theme }) => {
    switch ($padding) {
      case 'small':
        return theme.spacing.sm;
      case 'large':
        return theme.spacing.lg;
      default:
        return theme.spacing.md;
    }
  }};
  box-shadow: ${({ $elevation, theme }) => {
    switch ($elevation) {
      case 'card':
        return theme.shadows.card;
      case 'elevated':
        return theme.shadows.elevated;
      default:
        return 'none';
    }
  }};

  @media (max-width: ${({ theme }) => theme.breakpoints.tablet}) {
    padding: ${({ $padding, theme }) => {
      switch ($padding) {
        case 'small':
          return theme.spacing.xs;
        case 'large':
          return theme.spacing.md;
        default:
          return theme.spacing.sm;
      }
    }};
  }
`;

export const Panel = ({ 
  children, 
  className, 
  padding = 'medium', 
  elevation = 'card' 
}: PanelProps) => {
  return (
    <StyledPanel 
      className={className} 
      $padding={padding} 
      $elevation={elevation}
    >
      {children}
    </StyledPanel>
  );
};
