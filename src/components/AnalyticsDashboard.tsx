import { useState } from 'react';
import { format, subDays } from 'date-fns';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import styled from 'styled-components';
import axios from 'axios';

interface EventData {
  date: string;
  visitors: number;
  pageviews: number;
  bounce_rate: number;
}

interface AnalyticsDashboardProps {
  siteId: string;
  apiKey: string;
}

const DashboardContainer = styled.div`
  padding: 2rem;
  background: ${({ theme }) => theme.colors.background.primary};
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
`;

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

const ErrorMessage = styled.div`
  color: ${({ theme }) => theme.colors.error};
  margin: 1rem 0;
  padding: 1rem;
  background: rgba(255, 59, 48, 0.1);
  border-radius: 4px;
`;

export const AnalyticsDashboard: React.FC<AnalyticsDashboardProps> = ({ siteId, apiKey }) => {
  const [startDate, setStartDate] = useState(format(subDays(new Date(), 30), 'yyyy-MM-dd'));
  const [endDate, setEndDate] = useState(format(new Date(), 'yyyy-MM-dd'));
  const [eventName, setEventName] = useState('');
  const [eventData, setEventData] = useState<EventData[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchAnalytics = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await axios.get('https://plausible.io/api/stats/aggregate', {
        params: {
          site_id: siteId,
          period: 'custom',
          date: `${startDate},${endDate}`,
          metrics: 'visitors,pageviews,bounce_rate',
          filters: eventName ? `event:name==${eventName}` : undefined,
        },
        headers: {
          Authorization: `Bearer ${apiKey}`,
        },
      });
      
      if (response.data.results) {
        setEventData(response.data.results);
      } else {
        setError('No data available for the selected period');
      }
    } catch (error) {
      if (axios.isAxiosError(error)) {
        setError(error.response?.data?.error || 'Failed to fetch analytics data');
      } else {
        setError('An unexpected error occurred');
      }
      console.error('Error fetching analytics:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <DashboardContainer>
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
          value={eventName}
          onChange={(e) => setEventName(e.target.value)}
        >
          <option value="">All Events</option>
          {/* Add your custom events here */}
        </Select>
        <button type="button" onClick={fetchAnalytics} disabled={loading}>
          {loading ? 'Loading...' : 'Fetch Data'}
        </button>
      </FilterContainer>

      {error && <ErrorMessage>{error}</ErrorMessage>}

      {eventData.length > 0 && (
        <ResponsiveContainer width="100%" height={400}>
          <LineChart data={eventData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="date" />
            <YAxis />
            <Tooltip />
            <Legend />
            <Line type="monotone" dataKey="visitors" stroke="#8884d8" name="Visitors" />
            <Line type="monotone" dataKey="pageviews" stroke="#82ca9d" name="Pageviews" />
            <Line type="monotone" dataKey="bounce_rate" stroke="#ffc658" name="Bounce Rate" />
          </LineChart>
        </ResponsiveContainer>
      )}
    </DashboardContainer>
  );
}; 