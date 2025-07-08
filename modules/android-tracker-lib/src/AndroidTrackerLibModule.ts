import { NativeModule, requireNativeModule } from 'expo';

import { AndroidTrackerLibModuleEvents } from './AndroidTrackerLib.types';

declare class AndroidTrackerLibModule extends NativeModule<AndroidTrackerLibModuleEvents> {
  PI: number;
  hello(): string;
  setValueAsync(value: string): Promise<void>;
}

// This call loads the native module object from the JSI.
export default requireNativeModule<AndroidTrackerLibModule>('AndroidTrackerLib');
