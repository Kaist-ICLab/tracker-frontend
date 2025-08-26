import { NativeModule, requireNativeModule } from 'expo';
import { AndroidTrackerLibModuleEvents } from './AndroidTrackerLib.types';

declare class AndroidTrackerLibModule extends NativeModule<AndroidTrackerLibModuleEvents> {
  getSupportedPermissions(): Array<{
    groupKey: string;
    name: string;
    description: string;
    ids: string[];
    state: 'NOT_REQUESTED' | 'RATIONALE_REQUIRED' | 'GRANTED' | 'PERMANENTLY_DENIED';
  }>;
  requestPermission(permissionKey: string): any;
  requestPermissionGroup(groupKey: string): any;
}

// This call loads the native module object from the JSI.
export default requireNativeModule<AndroidTrackerLibModule>('AndroidTrackerLib');
