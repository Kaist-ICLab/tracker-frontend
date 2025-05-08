import { useState, useCallback } from 'react';
import { DataSample, DataSampleResponse } from '../types/dataSample';

// Generate realistic sample data
const generateSampleData = (metricId: string, page: number): DataSample[] => {
  return Array.from({ length: 50 }, (_, i) => {
    const baseTime = Date.now() - (i + page * 50) * 60000; // Each entry 1 minute apart
    const sample: DataSample = {
      id: `${metricId}-${page}-${i}`,
      timestamp: new Date(baseTime),
    };

    // Generate different types of data based on metricId
    switch (metricId) {
      case '1': // Heart Rate
        sample.heartRate = Math.round(60 + Math.random() * 40); // 60-100 bpm
        break;
      case '2': // Steps
        sample.steps = Math.round(100 + Math.random() * 400); // 100-500 steps
        sample.distance = (sample.steps! * 0.762) / 1000; // Average stride length 0.762m
        sample.calories = Math.round(sample.steps! * 0.04); // Rough estimate
        sample.activeMinutes = Math.round(sample.steps! / 100); // Rough estimate
        break;
      case '3': // Blood Pressure & Vitals
        sample.bloodPressureSystolic = Math.round(110 + Math.random() * 30); // 110-140 mmHg
        sample.bloodPressureDiastolic = Math.round(70 + Math.random() * 20); // 70-90 mmHg
        sample.bodyTemperature = 36.5 + Math.random() * 1.5; // 36.5-38.0 °C
        sample.oxygenSaturation = Math.round(95 + Math.random() * 5); // 95-100%
        sample.respiratoryRate = Math.round(12 + Math.random() * 8); // 12-20 breaths/min
        break;
      case '4': // Sleep
        sample.sleepDuration = Math.round(360 + Math.random() * 180); // 6-9 hours in minutes
        sample.deepSleepDuration = Math.round(sample.sleepDuration! * 0.2); // ~20% deep sleep
        sample.remSleepDuration = Math.round(sample.sleepDuration! * 0.25); // ~25% REM sleep
        sample.lightSleepDuration = sample.sleepDuration! - sample.deepSleepDuration - sample.remSleepDuration;
        break;
      default:
        // Generate all metrics for testing
        // Vital Signs
        sample.heartRate = Math.round(60 + Math.random() * 40);
        sample.bloodPressureSystolic = Math.round(110 + Math.random() * 30);
        sample.bloodPressureDiastolic = Math.round(70 + Math.random() * 20);
        sample.bodyTemperature = 36.5 + Math.random() * 1.5;
        sample.oxygenSaturation = Math.round(95 + Math.random() * 5);
        sample.respiratoryRate = Math.round(12 + Math.random() * 8);
        
        // Physical Activity
        sample.steps = Math.round(100 + Math.random() * 400);
        sample.distance = (sample.steps * 0.762) / 1000;
        sample.calories = Math.round(sample.steps * 0.04);
        sample.activeMinutes = Math.round(sample.steps / 100);
        
        // Sleep (if time is between 22:00 and 08:00)
        const hour = new Date(baseTime).getHours();
        if (hour >= 22 || hour <= 8) {
          sample.sleepDuration = Math.round(360 + Math.random() * 180);
          sample.deepSleepDuration = Math.round(sample.sleepDuration * 0.2);
          sample.remSleepDuration = Math.round(sample.sleepDuration * 0.25);
          sample.lightSleepDuration = sample.sleepDuration - sample.deepSleepDuration - sample.remSleepDuration;
        }
        
        // Body Composition (once per day)
        if (hour === 8) {
          sample.weight = 70 + Math.random() * 10; // 70-80 kg
          sample.bodyFatPercentage = 15 + Math.random() * 10; // 15-25%
          sample.muscleMass = sample.weight * (0.7 + Math.random() * 0.1); // 70-80% of weight
          sample.bmi = sample.weight / Math.pow(1.75, 2); // Assuming height of 1.75m
        }
        
        // Blood Sugar (random intervals)
        if (Math.random() > 0.7) {
          sample.bloodGlucose = Math.round(80 + Math.random() * 40); // 80-120 mg/dL
        }
        
        // Stress & Recovery
        sample.stressLevel = Math.round(20 + Math.random() * 60); // 20-80
        sample.hrvScore = Math.round(40 + Math.random() * 40); // 40-80ms
        sample.recoveryScore = Math.round(100 - sample.stressLevel!); // Inverse of stress
        
        // Environmental
        sample.ambientTemperature = 20 + Math.random() * 10; // 20-30°C
        sample.humidity = Math.round(40 + Math.random() * 40); // 40-80%
        sample.airQualityIndex = Math.round(20 + Math.random() * 80); // 20-100 AQI
    }

    // Add random notes
    if (Math.random() > 0.7) {
      const notes = [
        'Regular measurement',
        'Post-exercise reading',
        'Pre-meal measurement',
        'Feeling well',
        'After meditation',
        'During work',
        'After sleep',
      ];
      sample.notes = notes[Math.floor(Math.random() * notes.length)];
    }

    return sample;
  });
};

export const useDataSamples = (metricId: string) => {
  const [data, setData] = useState<DataSampleResponse>({
    samples: [],
    hasNextPage: true,
    isLoading: false,
  });
  const [currentPage, setCurrentPage] = useState(0);

  const fetchNextPage = useCallback(async () => {
    if (!data.hasNextPage || data.isLoading) return;

    setData(prev => ({ ...prev, isLoading: true }));

    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      const newSamples = generateSampleData(metricId, currentPage);
      
      setData(prev => ({
        samples: [...prev.samples, ...newSamples],
        hasNextPage: currentPage < 4, // Limit to 5 pages for demo
        isLoading: false,
      }));
      
      setCurrentPage(prev => prev + 1);
    } catch (error) {
      setData(prev => ({
        ...prev,
        error: 'Failed to load more samples',
        isLoading: false,
      }));
    }
  }, [currentPage, data.hasNextPage, data.isLoading, metricId]);

  const refresh = useCallback(async () => {
    setData({
      samples: [],
      hasNextPage: true,
      isLoading: true,
    });
    setCurrentPage(0);

    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      const newSamples = generateSampleData(metricId, 0);
      
      setData({
        samples: newSamples,
        hasNextPage: true,
        isLoading: false,
      });
      
      setCurrentPage(1);
    } catch (error) {
      setData({
        samples: [],
        hasNextPage: true,
        isLoading: false,
        error: 'Failed to refresh samples',
      });
    }
  }, [metricId]);

  return {
    ...data,
    fetchNextPage,
    refresh,
  };
}; 