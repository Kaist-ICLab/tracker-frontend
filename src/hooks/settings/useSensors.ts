import { useState } from 'react';
import { Sensor } from '@/types/settings';

export const CORE_SENSORS: (Sensor & { isActive: boolean })[] = [
  { key: 'accel', icon: 'speedometer', name: '가속도계', desc: '기본 움직임 감지', isActive: true },
  { key: 'gyro', icon: 'git-compare', name: '자이로스코프', desc: '회전 감지', isActive: true },
  { key: 'gps', icon: 'location', name: 'GPS', desc: '위치 추적', isActive: true },
  { key: 'heart', icon: 'heart', name: '심박수', desc: '심박수 모니터링', isActive: true },
  { key: 'temp', icon: 'thermometer', name: '온도계', desc: '체온 측정', isActive: true }
];

export const COMMUNITY_SENSORS: Sensor[] = [
  { key: 'exercise', icon: 'barbell', name: '운동 강도 분석', desc: '운동 강도 측정' },
  { key: 'water', icon: 'water', name: '수분 섭취 추적', desc: '수분 섭취량 모니터링' },
  { key: 'mood', icon: 'happy', name: '기분 일기', desc: '감정 상태 기록' },
  { key: 'allergy', icon: 'medical', name: '알레르기 모니터링', desc: '알레르기 반응 추적' },
  { key: 'skin', icon: 'body', name: '피부 상태 체크', desc: '피부 건강 모니터링' },
  { key: 'sleep', icon: 'moon', name: '수면 분석', desc: '수면 패턴 분석' },
  { key: 'stress', icon: 'pulse', name: '스트레스 측정', desc: '스트레스 레벨 모니터링' },
  { key: 'meal', icon: 'restaurant', name: '식사 기록', desc: '식사 패턴 추적' }
];

export const INSTALLED_COMMUNITY_SENSORS = [
  {key:'sleep', isActive: true},
  {key:'stress', isActive: false},
  {key:'meal', isActive: true},
];

export const CORE_SENSORS_STATUS = [
  {key:'accel', isActive: true},
  {key:'gyro', isActive: true},
  {key:'gps', isActive: true},
  {key:'heart', isActive: true},
  {key:'temp', isActive: true},
];

export const useSensors = () => {  
  const [coreSensors, setCoreSensors] = useState(CORE_SENSORS);
  const [communitySensors, setCommunitySensors] = useState(COMMUNITY_SENSORS);
  const [installedCommunitySensors, setInstalledCommunitySensors] = useState(INSTALLED_COMMUNITY_SENSORS);

  const loadCommunitySensors = async () => {
    setCommunitySensors(COMMUNITY_SENSORS);
  }

  const installCommunitySensor = async (sensor: Sensor) => {
    setInstalledCommunitySensors(prev => {
      if (prev.some(s => s.key === sensor.key)) return prev;
      return [...prev, { key: sensor.key, isActive: true }];
    });
  }

  const uninstallCommunitySensor = async (sensor: Sensor) => {
    setInstalledCommunitySensors(prev => 
      prev.filter(s => s.key !== sensor.key)
    );
  }

  const activateCommunitySensor = async (sensor: Sensor) => {
    setInstalledCommunitySensors(prev => 
      prev.map(s => s.key === sensor.key ? { ...s, isActive: true } : s)
    );
  }

  const deactivateCommunitySensor = async (sensor: Sensor) => {
    setInstalledCommunitySensors(prev => 
      prev.map(s => s.key === sensor.key ? { ...s, isActive: false } : s)
    );
  }

  const activateCoreSensor = async (sensor: Sensor) => {
    setCoreSensors(prev => 
      prev.map(s => s.key === sensor.key ? { ...s, isActive: true } : s)
    );
  }

  const deactivateCoreSensor = async (sensor: Sensor) => {
    setCoreSensors(prev => 
      prev.map(s => s.key === sensor.key ? { ...s, isActive: false } : s)
    );
  }

  return {
    coreSensors,
    communitySensors,
    installedCommunitySensors,
    loadCommunitySensors,
    installCommunitySensor,
    uninstallCommunitySensor,
    activateCommunitySensor,
    deactivateCommunitySensor,
    activateCoreSensor,
    deactivateCoreSensor,
  };
}; 