import { useMemo } from 'react';
import type { TimeSeriesDataPoint } from './usePlausibleTimeSeries';

export const useCumulativeData = (timeSeriesData: TimeSeriesDataPoint[]) => {
  const cumulativeData = useMemo(() => {
    let sum = 0;
    return timeSeriesData.map(point => {
      sum += point.value;
      return {
        date: point.date,
        value: sum
      };
    });
  }, [timeSeriesData]);

  return cumulativeData;
}; 