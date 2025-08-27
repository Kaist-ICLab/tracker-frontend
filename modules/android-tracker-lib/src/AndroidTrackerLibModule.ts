import { NativeModule, requireNativeModule } from 'expo';
import { AndroidTrackerLibModuleEvents } from './AndroidTrackerLib.types';

declare class AndroidTrackerLibModule extends NativeModule<AndroidTrackerLibModuleEvents> {
  // Permission Management
  getSupportedPermissions(): Array<{
    groupKey: string;
    name: string;
    description: string;
    ids: string[];
    state: 'NOT_REQUESTED' | 'RATIONALE_REQUIRED' | 'GRANTED' | 'PERMANENTLY_DENIED';
  }>;
  requestPermission(permissionKey: string): any;
  requestPermissionGroup(groupKey: string): any;
  
  // Sensor Management
  getAvailableSensors(): Array<{
    key: string;
    available: boolean;
    state: string;
  }>;
  startSensor(sensorKey: string): { success: boolean; message: string; data?: string };
  stopSensor(sensorKey: string): { success: boolean; message: string; data?: string };
  getSensorStatus(sensorKey: string): {
    active: boolean;
    name: string;
    lastUpdate: string;
  };
  getAllSensorStatus(): Array<{
    key: string;
    active: boolean;
    status: string;
  }>;
  checkSensorPermission(sensorKey: string): {
    granted: boolean;
    permissions: string[];
    grantedPermissions: string[];
  };
}

// This call loads the native module object from the JSI.
export default requireNativeModule<AndroidTrackerLibModule>('AndroidTrackerLib');
