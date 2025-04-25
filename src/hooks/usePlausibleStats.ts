import { useQuery } from '@tanstack/react-query';
import { fetchPlausibleStats } from '../services/plausible';

interface EventFilterOptions {
  eventName: string;
  from?: string;
  to?: string;
}

interface UsePlausibleStatsOptions {
  period?: string;
  filters?: EventFilterOptions;
}

export const usePlausibleStats = (options: UsePlausibleStatsOptions = {}) => {
  return useQuery({
    queryKey: ['plausible-stats', options],
    queryFn: () => fetchPlausibleStats(options),
    staleTime: 5 * 60 * 1000, // Consider data stale after 5 minutes
    refetchOnWindowFocus: false // Disable automatic refetch on window focus
  });
}; 