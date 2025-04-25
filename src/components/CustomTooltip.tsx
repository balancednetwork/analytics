import type { TooltipProps } from 'recharts';
import styled from 'styled-components';

const TooltipContainer = styled.div`
  background-color: rgba(12, 42, 77, 0.9);
  border: 1px solid #40E0D0;
  border-radius: 8px;
  padding: 8px 12px;
  color: #fff;
`;

const TooltipDate = styled.div`
  font-size: 0.85rem;
  color: rgba(255, 255, 255, 0.7);
`;

const TooltipValue = styled.div`
  font-size: 1rem;
  color: rgba(255, 255, 255, 1);
`;

export const CustomTooltip: React.FC<TooltipProps<number, string>> = ({ active, payload }) => {
  if (!active || !payload || !payload.length) {
    return null;
  }

  return (
    <TooltipContainer>
      <TooltipDate>
        {payload[0].payload.date}
      </TooltipDate>
      <TooltipValue>
        Transactions: <strong>{payload[0].value}</strong>
      </TooltipValue>
    </TooltipContainer>
  );
}; 