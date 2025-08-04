import { NativeModule, requireNativeModule } from 'expo';
import { AndroidTrackerLibModuleEvents } from './AndroidTrackerLib.types';

declare class AndroidTrackerLibModule extends NativeModule<AndroidTrackerLibModuleEvents> {
  getUserPermissions(): any;
  requestPermission(permissionKey: string): any;
}

// This call loads the native module object from the JSI.
export default requireNativeModule<AndroidTrackerLibModule>('AndroidTrackerLib');
