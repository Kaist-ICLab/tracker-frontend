import { NativeModule, requireNativeModule } from 'expo';

import { TrackerSystemModuleEvents } from './TrackerSystem.types';

declare class TrackerSystemModule extends NativeModule<TrackerSystemModuleEvents> {
  PI: number;
  hello(): string;
  setValueAsync(value: string): Promise<void>;
}

// This call loads the native module object from the JSI.
export default requireNativeModule<TrackerSystemModule>('TrackerSystem');
