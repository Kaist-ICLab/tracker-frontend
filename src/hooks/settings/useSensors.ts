import { useState, useEffect } from 'react';
import { Sensor } from '@/types/settings';
import AndroidTrackerLib from '../../../modules/android-tracker-lib';
import AsyncStorage from '@react-native-async-storage/async-storage';

export const CORE_SENSORS: Sensor[] = [
  { key: 'accel', icon: 'speedometer', name: '가속도계', desc: '기본 움직임 감지' },
  { key: 'gyro', icon: 'git-compare', name: '자이로스코프', desc: '회전 감지' },
  { key: 'gps', icon: 'location', name: 'GPS', desc: '위치 추적' },
  { key: 'heart', icon: 'heart', name: '심박수', desc: '심박수 모니터링' },
  { key: 'temp', icon: 'thermometer', name: '온도계', desc: '체온 측정' }
];

export const useSensors = () => {
  const [coreSensors, setCoreSensors] = useState<(Sensor & { isActive: boolean; available: boolean; loading: boolean; status?: string })[]>([]);
  const [loading, setLoading] = useState(true);
  const SENSOR_STATES_KEY = 'sensor_states';

  const saveSensorStates = async (sensors: (Sensor & { isActive: boolean; available: boolean; loading: boolean })[]) => {
    try {
      const states = sensors.reduce((acc, sensor) => {
        acc[sensor.key] = sensor.isActive;
        return acc;
      }, {} as Record<string, boolean>);
      await AsyncStorage.setItem(SENSOR_STATES_KEY, JSON.stringify(states));
    } catch (error) {
      console.error('Failed to save sensor states:', error);
    }
  };

  const loadSensorStates = async (): Promise<Record<string, boolean>> => {
    try {
      const states = await AsyncStorage.getItem(SENSOR_STATES_KEY);
      return states ? JSON.parse(states) : {};
    } catch (error) {
      console.error('Failed to load sensor states:', error);
      return {};
    }
  };

  const loadSensors = async () => {
    try {
      setLoading(true);
      const availableSensors = AndroidTrackerLib.getAvailableSensors?.() ?? [];
      const savedStates = await loadSensorStates();
      const sensorStatuses = AndroidTrackerLib.getAllSensorStatus?.() ?? [];

      const sensorsWithState = CORE_SENSORS.map(sensor => {
        const availableSensor = availableSensors.find(s => s.key === sensor.key);
        const statusInfo = sensorStatuses.find(s => s.key === sensor.key);
        return {
          ...sensor,
          isActive: savedStates[sensor.key] ?? false, // Use saved state or default to inactive
          available: availableSensor?.available ?? false,
          loading: false,
          status: statusInfo?.status ?? 'STOPPED'
        };
      });

      setCoreSensors(sensorsWithState);
    } catch (error) {
      console.error('Failed to load sensors:', error);
    } finally {
      setLoading(false);
    }
  };

  const activateCoreSensor = async (sensor: Sensor) => {
    try {
      // Check permissions first
      const permissionCheck = AndroidTrackerLib.checkSensorPermission?.(sensor.key);

      if (!permissionCheck?.granted) {
        // Request permissions if needed
        if (sensor.key === 'gps') {
          AndroidTrackerLib.requestPermissionGroup?.('Access Location');
        } else if (sensor.key === 'heart') {
          AndroidTrackerLib.requestPermissionGroup?.('Body Sensors');
        }
        // Wait a bit for permission dialog
        setTimeout(() => loadSensors(), 1000);
        return;
      }

      // Update loading state
      setCoreSensors(prev =>
        prev.map(s => s.key === sensor.key ? { ...s, loading: true } : s)
      );

      // Start the sensor
      const result = AndroidTrackerLib.startSensor?.(sensor.key);

      if (result?.success) {
        console.log(`✅ Sensor ${sensor.key} started successfully:`, result.message, result.data);
        const updatedSensors = coreSensors.map(s => s.key === sensor.key ? {
          ...s,
          isActive: true,
          loading: false,
          status: 'RUNNING'
        } : s);
        setCoreSensors(updatedSensors);
        await saveSensorStates(updatedSensors);
      } else {
        console.error(`❌ Failed to start sensor ${sensor.key}:`, result?.message);
        setCoreSensors(prev =>
          prev.map(s => s.key === sensor.key ? { ...s, loading: false } : s)
        );
      }
    } catch (error) {
      console.error('Error activating sensor:', error);
      setCoreSensors(prev =>
        prev.map(s => s.key === sensor.key ? { ...s, loading: false } : s)
      );
    }
  };

  const deactivateCoreSensor = async (sensor: Sensor) => {
    try {
      // Update loading state
      setCoreSensors(prev =>
        prev.map(s => s.key === sensor.key ? { ...s, loading: true } : s)
      );

      // Stop the sensor
      const result = AndroidTrackerLib.stopSensor?.(sensor.key);

      if (result?.success) {
        console.log(`✅ Sensor ${sensor.key} stopped successfully:`, result.message, result.data);
        const updatedSensors = coreSensors.map(s => s.key === sensor.key ? {
          ...s,
          isActive: false,
          loading: false,
          status: 'STOPPED'
        } : s);
        setCoreSensors(updatedSensors);
        await saveSensorStates(updatedSensors);
      } else {
        console.error(`❌ Failed to stop sensor ${sensor.key}:`, result?.message);
        setCoreSensors(prev =>
          prev.map(s => s.key === sensor.key ? { ...s, loading: false } : s)
        );
      }
    } catch (error) {
      console.error('Error deactivating sensor:', error);
      setCoreSensors(prev =>
        prev.map(s => s.key === sensor.key ? { ...s, loading: false } : s)
      );
    }
  };

  const verifySensorStatus = async (sensorKey: string) => {
    try {
      const status = AndroidTrackerLib.getSensorStatus?.(sensorKey);
      console.log(`🔍 Sensor ${sensorKey} verification:`, status);
      return status;
    } catch (error) {
      console.error(`❌ Error verifying sensor ${sensorKey}:`, error);
      return null;
    }
  };

  const verifyAllSensors = async () => {
    try {
      const allStatus = AndroidTrackerLib.getAllSensorStatus?.();
      console.log('🔍 All sensors status:', allStatus);
      return allStatus;
    } catch (error) {
      console.error('❌ Error verifying all sensors:', error);
      return null;
    }
  };

  useEffect(() => {
    loadSensors();
  }, []);

  // Auto-start sensors that were previously active
  useEffect(() => {
    const autoStartSensors = async () => {
      if (coreSensors.length > 0 && !loading) {
        const sensorsToStart = coreSensors.filter(sensor => sensor.isActive && sensor.available);
        for (const sensor of sensorsToStart) {
          try {
            // Check permissions first
            const permissionCheck = AndroidTrackerLib.checkSensorPermission?.(sensor.key);
            if (permissionCheck?.granted) {
              // Start the sensor in the background
              AndroidTrackerLib.startSensor?.(sensor.key);
            }
          } catch (error) {
            console.error(`Failed to auto-start sensor ${sensor.key}:`, error);
          }
        }
      }
    };

    autoStartSensors();
  }, [coreSensors, loading]);

  return {
    coreSensors,
    loading,
    activateCoreSensor,
    deactivateCoreSensor,
    refresh: loadSensors,
    verifySensorStatus,
    verifyAllSensors,
  };
};
