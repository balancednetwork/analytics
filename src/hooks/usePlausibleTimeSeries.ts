import { useQueries } from '@tanstack/react-query';
import { eachDayOfInterval, format, endOfDay, startOfDay } from 'date-fns';
import { useMemo } from 'react';
import { fetchPlausibleStats } from '../services/plausible';
import { extractMetricValue } from '../utils/plausible';
import type { UsePlausibleStatsOptions } from './usePlausibleStats';

export interface TimeSeriesDataPoint {
  date: string;
  value: number;
}

export const usePlausibleTimeSeries = (options: UsePlausibleStatsOptions) => {
  const { date_range, filters } = options;
  const [startDate, endDate] = Array.isArray(date_range) ? date_range : [date_range, date_range];

  const days = useMemo(() => 
    eachDayOfInterval({
      start: new Date(startDate),
      end: new Date(endDate)
    }),
    [startDate, endDate]
  );

  const queryOptions = useMemo(() => ({
    queries: days.map(day => {
      // Format the start and end of the day in ISO format
      const dayStart = format(startOfDay(day), "yyyy-MM-dd'T'HH:mm:ss'Z'");
      const dayEnd = format(endOfDay(day), "yyyy-MM-dd'T'HH:mm:ss'Z'");
      
      return {
        queryKey: ['plausible-stats', { date_range: [dayStart, dayEnd], filters }],
        queryFn: () => fetchPlausibleStats({ 
          date_range: [dayStart, dayEnd],
          filters 
        }),
        staleTime: 5 * 60 * 1000,
        refetchOnWindowFocus: false
      };
    })
  }), [days, filters]);

  const queries = useQueries(queryOptions);

  const isLoading = queries.some(query => query.isLoading);
  const isError = queries.some(query => query.isError);
  const error = queries.find(query => query.isError)?.error;

  const data: TimeSeriesDataPoint[] = useMemo(() => 
    queries.map((query, index) => ({
      date: format(days[index], 'MMM dd'),
      value: extractMetricValue(query.data) ?? 0
    })),
    [queries, days]
  );

  return {
    data,
    isLoading,
    isError,
    error
  };
}; 