import { useState, useEffect } from 'react';
import { Sensor } from '@/types/settings';
import AndroidTrackerLib from '../../../modules/android-tracker-lib';
import AsyncStorage from '@react-native-async-storage/async-storage';

export const SENSOR_MAPPING: Sensor[] = [
  { key: 'ambient_light', icon: 'sunny', name: '주변 조도', desc: '주변 조도 센서' },
  { key: 'app_usage_log', icon: 'apps', name: '앱 사용 로그', desc: '앱 사용 통계' },
  { key: 'battery', icon: 'battery-charging', name: '배터리', desc: '배터리 상태 모니터링' },
  { key: 'bluetooth_scan', icon: 'bluetooth', name: '블루투스 스캔', desc: '블루투스 장치 스캔' },
  { key: 'call_log', icon: 'call', name: '통화 로그', desc: '통화 기록' },
  { key: 'data_traffic_stat', icon: 'cellular', name: '데이터 트래픽', desc: '네트워크 데이터 사용량' },
  { key: 'location', icon: 'location', name: '위치', desc: 'GPS 위치 추적' },
  { key: 'message_log', icon: 'chatbubble', name: '메시지 로그', desc: 'SMS/메시지 기록' },
  { key: 'notification', icon: 'notifications', name: '알림', desc: '알림 모니터링' },
  { key: 'screen', icon: 'phone-portrait', name: '화면', desc: '화면 상태 모니터링' },
  { key: 'user_interaction', icon: 'hand-left', name: '사용자 상호작용', desc: '사용자 터치/제스처' },
  { key: 'wifi_scan', icon: 'wifi', name: 'WiFi 스캔', desc: 'WiFi 네트워크 스캔' }
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
      const sensorStatuses = AndroidTrackerLib.getAllSensorStatus?.() ?? [];
      const savedStates = await loadSensorStates();

      const sensorsWithState = SENSOR_MAPPING.map(sensor => {
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
        // Request permissions if needed based on sensor type
        if (sensor.key === 'location' || sensor.key === 'wifi_scan' || sensor.key === 'bluetooth_scan') {
          AndroidTrackerLib.requestPermissionGroup?.('Access Location');
        } else if (sensor.key === 'call_log' || sensor.key === 'message_log') {
          AndroidTrackerLib.requestPermissionGroup?.('Phone');
        } else if (sensor.key === 'app_usage_log') {
          AndroidTrackerLib.requestPermissionGroup?.('Usage Access');
        } else if (sensor.key === 'notification') {
          AndroidTrackerLib.requestPermissionGroup?.('Notification Access');
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
      setCoreSensors(prev =>
        prev.map(s => s.key === sensor.key ? { ...s, loading: true } : s)
      );
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
  };
};
