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
  cursor: pointer;

  &:focus {
    border-color: #40E0D0;
    box-shadow: 0 0 0 1px #40E0D0;
  }

  /* Style the dropdown arrow */
  appearance: none;
  background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='24' height='24' viewBox='0 0 24 24' fill='%2340E0D0' opacity='0.8'%3E%3Cpath d='M7 10l5 5 5-5z'/%3E%3C/svg%3E");
  background-repeat: no-repeat;
  background-position: right 0.6rem center;
  padding-right: 2rem;

  option {
    background-color: rgb(12, 42, 77);
    color: white;
  }
`;

const DateInput = styled.input`
  padding: 0.5rem;
  padding-right: 2rem;
  border-radius: 8px;
  border: 1px solid #40E0D0;
  background-color: rgb(12, 42, 77);
  color: white;
  outline: none;
  cursor: pointer;
  position: relative;

  &:focus {
    border-color: #40E0D0;
    box-shadow: 0 0 0 1px #40E0D0;
  }

  &::-webkit-calendar-picker-indicator {
    filter: invert(1);
    cursor: pointer;
    position: absolute;
    right: 0;
    top: 0;
    width: 100%;
    height: 100%;
    opacity: 0;
    z-index: 1;
  }

  &::after {
    content: '';
    position: absolute;
    right: 0.6rem;
    top: 50%;
    transform: translateY(-50%);
    width: 16px;
    height: 16px;
    background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='%2340E0D0'%3E%3Cpath d='M20 3h-1V1h-2v2H7V1H5v2H4c-1.1 0-2 .9-2 2v16c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm0 18H4V8h16v13z'/%3E%3C/svg%3E");
    background-size: contain;
    background-repeat: no-repeat;
    pointer-events: none;
    opacity: 0.8;
  }

  &::-webkit-inner-spin-button,
  &::-webkit-clear-button {
    display: none;
  }

  /* Calendar Picker Styles */
  &::-webkit-datetime-edit-fields-wrapper {
    color: white;
  }

  &::-webkit-datetime-edit {
    color: white;
  }

  &::-webkit-datetime-edit-text {
    color: white;
  }

  &::-webkit-datetime-edit-month-field {
    color: white;
  }

  &::-webkit-datetime-edit-day-field {
    color: white;
  }

  &::-webkit-datetime-edit-year-field {
    color: white;
  }

  &::-webkit-calendar-picker {
    background-color: rgb(12, 42, 77);
  }

  &::-webkit-calendar-picker-controls {
    filter: invert(1) hue-rotate(180deg);
  }

  /* Calendar popup styles */
  &::-webkit-calendar-popup {
    background-color: rgb(12, 42, 77);
    color: white;
    border: 1px solid #40E0D0;
    border-radius: 8px;
  }

  &::-webkit-calendar-popup button {
    color: white;
    background-color: rgb(12, 42, 77);
    border: 1px solid #40E0D0;
  }

  &::-webkit-calendar-popup button:hover {
    background-color: #40E0D0;
    color: rgb(12, 42, 77);
  }

  &::-webkit-calendar-popup td.selected {
    background-color: #40E0D0;
    color: rgb(12, 42, 77);
  }

  &::-webkit-calendar-popup td:hover {
    background-color: rgba(64, 224, 208, 0.2);
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