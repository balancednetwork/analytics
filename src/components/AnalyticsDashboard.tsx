import { useState, useMemo } from 'react';
import { format, subDays } from 'date-fns';
import styled from 'styled-components';
import { Panel } from './StyledComponents/Panel';
import { usePlausibleStats } from '../hooks/usePlausibleStats';
import { usePlausibleTimeSeries } from '../hooks/usePlausibleTimeSeries';
import { useCumulativeData } from '../hooks/useCumulativeData';
import type { UsePlausibleStatsOptions } from '../hooks/usePlausibleStats';
import { TimeSeriesChart } from './TimeSeriesChart';

const DashboardContainer = styled(Panel)``;

const FilterContainer = styled.div`
  display: flex;
  gap: 1rem;
  margin-bottom: 2rem;
  flex-wrap: wrap;
`;

const Select = styled.select`
  padding: 0.5rem;
  border-radius: 8px;
  border: 1px solid #40E0D0;
  background-color: rgb(12, 42, 77);
  color: white;
  outline: none;

  &:focus {
    border-color: #40E0D0;
    box-shadow: 0 0 0 1px #40E0D0;
  }

  option {
    background-color: rgb(12, 42, 77);
    color: white;
  }
`;

const DateInput = styled.input`
  padding: 0.5rem;
  border-radius: 8px;
  border: 1px solid #40E0D0;
  background-color: rgb(12, 42, 77);
  color: white;
  outline: none;

  &:focus {
    border-color: #40E0D0;
    box-shadow: 0 0 0 1px #40E0D0;
  }

  &::-webkit-calendar-picker-indicator {
    filter: invert(1);
  }
`;

const ErrorMessage = styled.div`
  color: ${({ theme }) => theme.colors.error};
  padding: 1rem;
  text-align: center;
  background: ${({ theme }) => theme.colors.background.secondary};
  border-radius: 8px;
`;

const ChartsContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 2rem;

  @media (min-width: 1200px) {
    flex-direction: row;
    
    > * {
      flex: 1;
      min-width: 0; // Prevents flex items from overflowing
    }
  }
`;

const AVAILABLE_NETWORKS = ['Arbitrum', 'Archway', 'Avalanche', 'Base', 'BNB Chain', 'Havah', 'ICON', 'Injective', 'Optimism', 'Polygon', 'Solana', 'Stellar', 'Sui'];

const EVENT_TYPES = [
  'liquidity_withdrawal',
  'liquidity_deposit',
  'savings_withdrawal',
  'savings_deposit',
  'collateral_withdrawal',
  'collateral_deposit',
  'repay',
  'borrow',
  'bridge',
  'swap_intent',
  'swap_standard'
] as const;

type EventType = typeof EVENT_TYPES[number];
type FilterType = 'from' | 'to' | 'either';

const FILTER_LABELS: Record<FilterType, string> = {
  from: 'as origin',
  to: 'as destination',
  either: 'as origin or destination'
};

export const AnalyticsDashboard: React.FC = () => {
  const [startDate, setStartDate] = useState(format(subDays(new Date(), 7), 'yyyy-MM-dd'));
  const [endDate, setEndDate] = useState(format(new Date(), 'yyyy-MM-dd'));
  const [selectedNetwork, setSelectedNetwork] = useState('Stellar');
  const [filterType, setFilterType] = useState<FilterType>('either');
  const [selectedEvent, setSelectedEvent] = useState<EventType>('swap_standard');

  const statsOptions: UsePlausibleStatsOptions = useMemo(() => ({
    date_range: [startDate, endDate],
    filters: {
      eventName: selectedEvent,
      network: selectedNetwork,
      filterType
    }
  }), [selectedNetwork, filterType, startDate, endDate, selectedEvent]);

  const { error: statsError, isError: isStatsError } = usePlausibleStats(statsOptions);
  const { data: timeSeriesData, isLoading: isTimeSeriesLoading, error: timeSeriesError, isError: isTimeSeriesError } = usePlausibleTimeSeries(statsOptions);
  const cumulativeData = useCumulativeData(timeSeriesData || []);

  if (isStatsError && statsError instanceof Error) {
    return <ErrorMessage>Error loading stats: {statsError.message}</ErrorMessage>;
  }

  const chartTitle = `${selectedEvent.replace(/_/g, ' ')} ${FILTER_LABELS[filterType]} on ${selectedNetwork}`;

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
          value={selectedEvent}
          onChange={(e) => setSelectedEvent(e.target.value as EventType)}
        >
          {EVENT_TYPES.map(event => (
            <option key={event} value={event}>
              {event.replace(/_/g, ' ')}
            </option>
          ))}
        </Select>
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
          onChange={(e) => setFilterType(e.target.value as FilterType)}
        >
          {(Object.entries(FILTER_LABELS) as [FilterType, string][]).map(([value, label]) => (
            <option key={value} value={value}>{label}</option>
          ))}
        </Select>
      </FilterContainer>

      <ChartsContainer>
        <TimeSeriesChart
          data={timeSeriesData}
          isLoading={isTimeSeriesLoading}
          isError={isTimeSeriesError}
          error={timeSeriesError}
          title={`Daily ${chartTitle}`}
          type="bar"
        />

        <TimeSeriesChart
          data={cumulativeData}
          isLoading={isTimeSeriesLoading}
          isError={isTimeSeriesError}
          error={timeSeriesError}
          title={`Cumulative ${chartTitle}`}
          type="line"
        />
      </ChartsContainer>
    </DashboardContainer>
  );
}; 