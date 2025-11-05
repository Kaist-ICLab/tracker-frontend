import { registerWebModule, NativeModule } from 'expo';

import { ChangeEventPayload } from './TrackerSystem.types';

type TrackerSystemModuleEvents = {
  onChange: (params: ChangeEventPayload) => void;
}

class TrackerSystemModule extends NativeModule<TrackerSystemModuleEvents> {
  PI = Math.PI;
  async setValueAsync(value: string): Promise<void> {
    this.emit('onChange', { value });
  }
  hello() {
    return 'Hello world! 👋';
  }
};

export default registerWebModule(TrackerSystemModule, 'TrackerSystemModule');
