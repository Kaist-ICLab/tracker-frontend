
import { registerWebModule, NativeModule } from 'expo';

import { ChangeEventPayload } from './AndroidTrackerLib.types';

type AndroidTrackerLibModuleEvents = {
  onChange: (params: ChangeEventPayload) => void;
}

// Those functions are not implemented for web, so they will return undefined.
// See AndroidTrackerLibModule.ts file for implementation on native platforms.
// Most of the functions will not be implemented for the web version
class AndroidTrackerLibModule extends NativeModule<AndroidTrackerLibModuleEvents> {
  getUserPermissions() {
    return;
  }
  requestPermission() {
    return;
  }
};

export default registerWebModule(AndroidTrackerLibModule, 'AndroidTrackerLibModule');
