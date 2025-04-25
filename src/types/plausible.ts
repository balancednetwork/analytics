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

export type PlausibleFilter = [string, string, string[]];

export interface PlausibleQueryParams {
  site_id: string;
  date_range: string;
  filters?: PlausibleFilter[];
  metrics: PlausibleMetric[];
  compare?: boolean;
  dimensions?: string[];
}

export interface PlausibleResult {
  name: string;
  value: number;
}

export interface PlausibleStatsResponse {
  results: PlausibleResult[];
}

export interface PlausibleCustomProps {
  [key: string]: string | number | boolean;
} 