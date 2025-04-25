interface PlausibleResult {
  metrics: number[];
}

interface PlausibleResponse {
  results: PlausibleResult[];
}

export const extractMetricValue = (data: PlausibleResponse | undefined): number | undefined => {
  if (!data?.results?.[0]?.metrics?.[0]) {
    return undefined;
  }
  return data.results[0].metrics[0];
}; 