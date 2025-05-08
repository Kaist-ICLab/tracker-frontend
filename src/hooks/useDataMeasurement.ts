import { useState, useCallback } from 'react';
import { DATA_TYPES } from '../constants/data';

export const useDataMeasurement = () => {
  const [isMeasuring, setIsMeasuring] = useState(false);
  const [currentValue, setCurrentValue] = useState<number | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isDeviceConnected, setIsDeviceConnected] = useState(false);

  const startMeasurement = useCallback((dataType: string) => {
    const dataTypeInfo = DATA_TYPES.find(type => type.key === dataType);
    if (!dataTypeInfo) {
      setError('Invalid data type');
      return;
    }

    setIsMeasuring(true);
    setError(null);

    // Simulate measurement process
    let progress = 0;
    const interval = setInterval(() => {
      progress += 1;
      if (progress >= 100) {
        clearInterval(interval);
        setIsMeasuring(false);
        // Generate a random value within a reasonable range
        const value = Math.floor(Math.random() * 100);
        setCurrentValue(value);
      }
    }, 50);
  }, []);

  const stopMeasurement = useCallback(() => {
    setIsMeasuring(false);
    setCurrentValue(null);
    setError(null);
  }, []);

  const saveMeasurement = useCallback((value: number) => {
    // Simulate saving to storage
    return new Promise<void>((resolve) => {
      setTimeout(() => {
        setCurrentValue(null);
        resolve();
      }, 500);
    });
  }, []);

  const checkDeviceConnection = useCallback(() => {
    // Simulate device connection check
    return new Promise<boolean>((resolve) => {
      setTimeout(() => {
        const isConnected = Math.random() > 0.5;
        setIsDeviceConnected(isConnected);
        resolve(isConnected);
      }, 1000);
    });
  }, []);

  return {
    isMeasuring,
    currentValue,
    error,
    isDeviceConnected,
    startMeasurement,
    stopMeasurement,
    saveMeasurement,
    checkDeviceConnection,
  };
}; 