export interface PlausibleEvent {
  name: string;
  props: Record<string, string | number | boolean>;
  timestamp: string;
  visitors: number;
  pageviews: number;
}

export interface PlausibleEventResponse {
  results: Array<{
    name: string;
    props: Record<string, string | number | boolean>;
    timestamp: string;
    visitors: number;
    pageviews: number;
  }>;
}

export type PlausibleMetric = 'visitors' | 'visits' | 'pageviews' | 'bounce_rate' | 'visit_duration' | 'events';

interface PlausibleResult {
  metrics: number[];
}

interface PlausibleResponse {
  results: PlausibleResult[];
}

type SimpleFilter = [string, string, string[]];
type LogicalFilter = ['or' | 'and' | 'not', SimpleFilter[]];
export type PlausibleFilter = SimpleFilter | LogicalFilter;

export const extractMetricValue = (data: PlausibleResponse | undefined): number | undefined => {
  if (!data?.results?.[0]?.metrics?.[0]) {
    return undefined;
  }
  return data.results[0].metrics[0];
};

export interface PlausibleQueryParams {
  site_id: string;
  date_range: string;
  filters?: PlausibleFilter[];
  metrics: PlausibleMetric[];
  compare?: boolean;
  dimensions?: string[];
}

export interface PlausibleStatsResponse {
  results: PlausibleResult[];
}

export interface PlausibleCustomProps {
  [key: string]: string | number | boolean;
} 