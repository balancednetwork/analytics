import { LineChart, Line, BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Rectangle } from 'recharts';
import styled, { keyframes } from 'styled-components';
import { Panel } from './StyledComponents/Panel';
import type { TimeSeriesDataPoint } from '../hooks/usePlausibleTimeSeries';

const spin = keyframes`
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
`;

const Spinner = styled.div`
  width: 40px;
  height: 40px;
  border: 3px solid ${({ theme }) => theme.colors.text.primary}20;
  border-top: 3px solid ${({ theme }) => theme.colors.chart};
  border-radius: 50%;
  animation: ${spin} 1s linear infinite;
`;

const ChartContainer = styled(Panel)`
  height: 400px;
  margin-top: 2rem;
`;

const LoadingOverlay = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100%;
  color: ${({ theme }) => theme.colors.text.primary};
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
    border: '1px solid #40E0D0',
    borderRadius: '8px',
    color: '#fff !important'
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
        <LoadingOverlay>
          <Spinner />
        </LoadingOverlay>
      </ChartContainer>
    );
  }

  const ChartComponent = type === 'line' ? LineChart : BarChart;
  const DataComponent = type === 'line' ? Line : Bar;

  return (
    <ChartContainer>
      <h3>{title}</h3>
      <ResponsiveContainer width="100%" height="100%">
        <ChartComponent data={data}  {...commonChartProps}>
        <defs>
            <linearGradient id="gradient" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor={'#40E0D0'} stopOpacity={0.5} />
              <stop offset="100%" stopColor={'#40E0D0'} stopOpacity={0} />
            </linearGradient>
          </defs>
          <XAxis dataKey="date" 
                axisLine={false}
                tickLine={false} {...commonAxisProps} />
          <YAxis 
                axisLine={false}
                tickLine={false} {...commonAxisProps} />
          <Tooltip {...tooltipStyle} 
                cursor={false} />
          <DataComponent
            type={type === 'line' ? 'monotone' : undefined}
            dataKey="value"
            fill={type === 'bar' ? '#40E0D0' : 'url(#gradient)'}
            stroke={type === 'line' ? '#40E0D0' : undefined}
            strokeWidth={type === 'line' ? 2 : 0}
            dot={false}
            activeDot={type === 'line' ? { r: 3, fill: '#40E0D0', stroke: '#40E0D0' } : undefined}
            // eslint-disable-next-line @typescript-eslint/ban-ts-comment
            //@ts-expect-error
            shape={type === 'bar' ? props => <Rectangle {...props} radius={props.payload.isLast ? [0, 0, 0, 0] : [10, 10, 0, 0]} /> : undefined }
            activeBar={false}
          />
        </ChartComponent>
      </ResponsiveContainer>
    </ChartContainer>
  );
}; 