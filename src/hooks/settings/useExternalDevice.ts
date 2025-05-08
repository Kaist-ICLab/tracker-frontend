import { BLEDevice } from '@/types/settings';
import { useState } from 'react';


const MOCK_DEVICES: BLEDevice[] = [
  { id: 'dev1', name: '웨어러블 밴드 A', status: 'DISCONNECTED' },
  { id: 'dev2', name: '스마트워치 B', status: 'CONNECTED' },
  { id: 'dev3', name: '혈압계 C', status: 'DISCONNECTED' },
];

export const useExternalDevice = () => {
  const [devices, setDevices] = useState(MOCK_DEVICES);
  const [isScanning, setIsScanning] = useState(false);

  const startScan = () => {
    setIsScanning(true);
    setTimeout(() => {
      setIsScanning(false);
    }, 3000);
  }

  const stopScan = () => {
    setIsScanning(false);
  }

  const connectDevice = (deviceId: string) => {
    setDevices(prevDevices => prevDevices.map(device => 
      device.id === deviceId ? { ...device, status: 'CONNECTING' } : device
    ));
    
    // Simulate connection process
    setTimeout(() => {
      setDevices(prevDevices => prevDevices.map(device => 
        device.id === deviceId ? { ...device, status: 'CONNECTED' } : device
      ));
    }, 1000);
  }

  const disconnectDevice = (deviceId: string) => {
    setDevices(prevDevices => prevDevices.map(device => device.id === deviceId ? { ...device, status: 'DISCONNECTED' } : device));
  }
  
  return {
    devices,
    isScanning,
    startScan,
    stopScan,
    connectDevice,
    disconnectDevice,
  };
}; 