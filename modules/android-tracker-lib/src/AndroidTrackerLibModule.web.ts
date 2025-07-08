import { registerWebModule, NativeModule } from 'expo';

import { ChangeEventPayload } from './AndroidTrackerLib.types';

type AndroidTrackerLibModuleEvents = {
  onChange: (params: ChangeEventPayload) => void;
}

class AndroidTrackerLibModule extends NativeModule<AndroidTrackerLibModuleEvents> {
  PI = Math.PI;
  async setValueAsync(value: string): Promise<void> {
    this.emit('onChange', { value });
  }
  hello() {
    return 'Hello world! 👋';
  }
};

export default registerWebModule(AndroidTrackerLibModule, 'AndroidTrackerLibModule');
