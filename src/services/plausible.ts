import axios from 'axios';
import type {  PlausibleFilter } from '../types/plausible';

const PLAUSIBLE_API_BASE = 'https://plausible.io/api/v2/query';

const plausibleApi = axios.create({
  baseURL: PLAUSIBLE_API_BASE,
  headers: {
    Authorization: `Bearer ${import.meta.env.VITE_PLAUSIBLE_API_KEY}`,
    'Content-Type': 'application/json'
  }
});

interface EventFilterOptions {
  eventName: string;
  from?: string;
  to?: string;
}

export const fetchPlausibleStats = async (
  options: {
    period?: string;
    filters?: EventFilterOptions;
  } = {}
) => {
  const { period = '30d', filters } = options;

  try {
    const queryParams = {
      site_id: import.meta.env.VITE_PLAUSIBLE_SITE_ID,
      metrics: ['events'],
      date_range: period,
      filters: [] as PlausibleFilter[]
    };

    // Build filters array if filter options are provided
    if (filters) {
      // Add event name filter
      queryParams.filters.push(['is', 'event:name', [filters.eventName]]);

      // Add 'from' network filter if provided
      if (filters.from) {
        queryParams.filters.push(['is', 'event:props:from', [filters.from]]);
      }

      // Add 'to' network filter if provided
      if (filters.to) {
        queryParams.filters.push(['is', 'event:props:to', [filters.to]]);
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