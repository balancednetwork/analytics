import axios from 'axios';
import type { PlausibleFilter } from '../types/plausible';

const PLAUSIBLE_API_BASE = '/api/plausible';

const plausibleApi = axios.create({
  baseURL: PLAUSIBLE_API_BASE,
  headers: {
    Authorization: `Bearer ${import.meta.env.VITE_PLAUSIBLE_API_KEY}`,
    'Content-Type': 'application/json'
  }
});

type NetworkFilterType = 'from' | 'to' | 'either';

interface EventFilterOptions {
  eventName: string;
  network?: string;
  filterType?: NetworkFilterType;
}

export const fetchPlausibleStats = async (
  options: {
    date_range: string | [string, string];
    filters?: EventFilterOptions;
  }
) => {
  const { date_range, filters } = options;

  try {
    const queryParams = {
      site_id: import.meta.env.VITE_PLAUSIBLE_SITE_ID,
      metrics: ['events'],
      date_range: Array.isArray(date_range) ? date_range : date_range,
      filters: [] as PlausibleFilter[]
    };

    // Build filters array if filter options are provided
    if (filters) {
      // Add event name filter
      queryParams.filters.push(['is', 'event:name', [filters.eventName]]);

      // Add network filters based on filterType
      if (filters.network) {
        if (filters.filterType === 'from') {
          queryParams.filters.push(['is', 'event:props:from', [filters.network]]);
        } else if (filters.filterType === 'to') {
          queryParams.filters.push(['is', 'event:props:to', [filters.network]]);
        } else if (filters.filterType === 'either') {
          queryParams.filters.push(['or', [
            ['is', 'event:props:from', [filters.network]],
            ['is', 'event:props:to', [filters.network]]
          ]]);
        }
      }
    }

    const { data } = await plausibleApi.post('', queryParams);
    return data;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      throw new Error(`Failed to fetch Plausible stats: ${error.message}`);
    }
    throw new Error('Failed to fetch Plausible stats');
  }
};