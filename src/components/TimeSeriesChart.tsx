import { LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import styled from 'styled-components';
import { Panel } from './StyledComponents/Panel';
import type { TimeSeriesDataPoint } from '../hooks/usePlausibleTimeSeries';

const ChartContainer = styled(Panel)`
  height: 400px;
  margin-top: 2rem;
`;

const LoadingOverlay = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100%;
  color: ${({ theme }) => theme.colors.text.secondary};
`;

const ErrorMessage = styled.div`
  color: ${({ theme }) => theme.colors.error};
  padding: 1rem;
  text-align: center;
`;

type ChartType = 'line' | 'bar';

interface TimeSeriesChartProps {
  data: TimeSeriesDataPoint[];
  isLoading: boolean;
  isError: boolean;
  error?: Error;
  title: string;
  type?: ChartType;
}

const commonChartProps = {
  margin: { top: 20, right: 30, left: 20, bottom: 20 }
};

const commonAxisProps = {
  stroke: 'rgba(255, 255, 255, 0.5)',
  tick: { fill: 'rgba(255, 255, 255, 0.5)' }
};

const tooltipStyle = {
  contentStyle: { 
    backgroundColor: 'rgba(12, 42, 77, 0.9)',
    border: 'none',
    borderRadius: '4px',
    color: '#fff'
  }
};

export const TimeSeriesChart: React.FC<TimeSeriesChartProps> = ({
  data,
  isLoading,
  isError,
  error,
  title,
  type = 'line'
}) => {
  if (isError && error instanceof Error) {
    return <ErrorMessage>Error loading chart data: {error.message}</ErrorMessage>;
  }

  if (isLoading) {
    return (
      <ChartContainer>
        <LoadingOverlay>Loading chart data...</LoadingOverlay>
      </ChartContainer>
    );
  }

  const ChartComponent = type === 'line' ? LineChart : BarChart;
  const DataComponent = type === 'line' ? Line : Bar;

  return (
    <ChartContainer>
      <h3>{title}</h3>
      <ResponsiveContainer width="100%" height="100%">
        <ChartComponent data={data} {...commonChartProps}>
          <CartesianGrid strokeDasharray="3 3" stroke="rgba(255, 255, 255, 0.1)" />
          <XAxis dataKey="date" {...commonAxisProps} />
          <YAxis {...commonAxisProps} />
          <Tooltip {...tooltipStyle} />
          <DataComponent
            type={type === 'line' ? 'monotone' : undefined}
            dataKey="value"
            fill={type === 'bar' ? '#40E0D0' : undefined}
            stroke="#40E0D0"
            strokeWidth={2}
            dot={type === 'line' ? { fill: '#40E0D0', strokeWidth: 2 } : undefined}
            activeDot={type === 'line' ? { r: 6, fill: '#40E0D0' } : undefined}
          />
        </ChartComponent>
      </ResponsiveContainer>
    </ChartContainer>
  );
}; 