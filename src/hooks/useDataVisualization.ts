import { useState, useCallback } from 'react';
import { METRIC_INFO } from '../constants/data';

export const useDataVisualization = () => {
  const [selectedMetric, setSelectedMetric] = useState<string | null>(null);
  const [timeRange, setTimeRange] = useState<'day' | 'week' | 'month'>('day');
  const [isLoading, setIsLoading] = useState(false);

  const generateMockData = useCallback((metricKey: string, range: 'day' | 'week' | 'month') => {
    const metric = METRIC_INFO.find(m => m.key === metricKey);
    if (!metric) return [];

    const { normalRange } = metric;
    const dataPoints = range === 'day' ? 24 : range === 'week' ? 7 : 30;
    const data = [];

    for (let i = 0; i < dataPoints; i++) {
      const value = Math.random() * (normalRange.max - normalRange.min) + normalRange.min;
      data.push({
        timestamp: new Date(Date.now() - (dataPoints - i) * (range === 'day' ? 3600000 : range === 'week' ? 86400000 : 259200000)),
        value: Number(value.toFixed(1)),
      });
    }

    return data;
  }, []);

  const getMetricInfo = useCallback((metricKey: string) => {
    return METRIC_INFO.find(metric => metric.key === metricKey);
  }, []);

  const getMetricStats = useCallback((metricKey: string, data: Array<{ value: number }>) => {
    if (!data.length) return null;

    const values = data.map(d => d.value);
    const sum = values.reduce((a, b) => a + b, 0);
    const avg = sum / values.length;
    const min = Math.min(...values);
    const max = Math.max(...values);

    return {
      average: Number(avg.toFixed(1)),
      minimum: Number(min.toFixed(1)),
      maximum: Number(max.toFixed(1)),
    };
  }, []);

  const loadData = useCallback(async (metricKey: string, range: 'day' | 'week' | 'month') => {
    setIsLoading(true);
    setSelectedMetric(metricKey);
    setTimeRange(range);

    // Simulate API call
    return new Promise<Array<{ timestamp: Date; value: number }>>((resolve) => {
      setTimeout(() => {
        const data = generateMockData(metricKey, range);
        setIsLoading(false);
        resolve(data);
      }, 1000);
    });
  }, [generateMockData]);

  return {
    selectedMetric,
    timeRange,
    isLoading,
    loadData,
    getMetricInfo,
    getMetricStats,
  };
}; 