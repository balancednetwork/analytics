import { useState, useMemo } from 'react';
import { format, subDays } from 'date-fns';
// import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import styled from 'styled-components';
import { Panel } from './StyledComponents/Panel';
import { usePlausibleStats } from '../hooks/usePlausibleStats';

const DashboardContainer = styled(Panel)``;

const FilterContainer = styled.div`
  display: flex;
  gap: 1rem;
  margin-bottom: 2rem;
`;

const Select = styled.select`
  padding: 0.5rem;
  border-radius: 4px;
  border: 1px solid ${({ theme }) => theme.colors.background.secondary};
`;

const DateInput = styled.input`
  padding: 0.5rem;
  border-radius: 4px;
  border: 1px solid ${({ theme }) => theme.colors.background.secondary};
`;

const StatsContainer = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 1rem;
  margin-top: 2rem;
`;

const StatCard = styled.div`
  background: ${({ theme }) => theme.colors.background.secondary};
  padding: 1rem;
  border-radius: 8px;
  text-align: center;

  h3 {
    margin: 0 0 0.5rem 0;
    font-size: 1rem;
    color: ${({ theme }) => theme.colors.text.secondary};
  }

  p {
    margin: 0;
    font-size: 1.5rem;
    font-weight: bold;
    color: ${({ theme }) => theme.colors.text.primary};
  }
`;

const ErrorMessage = styled.div`
  color: ${({ theme }) => theme.colors.error};
  padding: 1rem;
  text-align: center;
  background: ${({ theme }) => theme.colors.background.secondary};
  border-radius: 8px;
`;

const LoadingOverlay = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 200px;
  background: ${({ theme }) => theme.colors.background.secondary};
  border-radius: 8px;
  color: ${({ theme }) => theme.colors.text.secondary};
`;

const AVAILABLE_NETWORKS = ['Stellar', 'Sui', 'Arbitrum', 'Polygon'];

export const AnalyticsDashboard: React.FC = () => {
  const [startDate, setStartDate] = useState(format(subDays(new Date(), 30), 'yyyy-MM-dd'));
  const [endDate, setEndDate] = useState(format(new Date(), 'yyyy-MM-dd'));
  const [selectedNetwork, setSelectedNetwork] = useState('Stellar');
  const [filterType, setFilterType] = useState<'from' | 'to'>('to');

  const statsOptions = useMemo(() => ({
    period: '30d',
    filters: {
      eventName: 'swap_standard',
      [filterType]: selectedNetwork
    }
  }), [selectedNetwork, filterType]);

  const { data: stats, isLoading, error, isError } = usePlausibleStats(statsOptions);

  if (isError && error instanceof Error) {
    return <ErrorMessage>Error loading stats: {error.message}</ErrorMessage>;
  }

  return (
    <DashboardContainer padding="large">
      <FilterContainer>
        <DateInput
          type="date"
          value={startDate}
          onChange={(e) => setStartDate(e.target.value)}
        />
        <DateInput
          type="date"
          value={endDate}
          onChange={(e) => setEndDate(e.target.value)}
        />
        <Select
          value={selectedNetwork}
          onChange={(e) => setSelectedNetwork(e.target.value)}
        >
          {AVAILABLE_NETWORKS.map(network => (
            <option key={network} value={network}>{network}</option>
          ))}
        </Select>
        <Select
          value={filterType}
          onChange={(e) => setFilterType(e.target.value as 'from' | 'to')}
        >
          <option value="to">To Network</option>
          <option value="from">From Network</option>
        </Select>
      </FilterContainer>

      {isLoading ? (
        <LoadingOverlay>Loading stats...</LoadingOverlay>
      ) : (
        <StatsContainer>
          <StatCard>
            <h3>Swaps {filterType === 'to' ? 'to' : 'from'} {selectedNetwork}</h3>
            <p>{stats?.results[0]?.value || 0}</p>
          </StatCard>
        </StatsContainer>
      )}

      {/* Chart component commented out for now */}
    </DashboardContainer>
  );
}; 