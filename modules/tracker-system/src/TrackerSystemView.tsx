import { requireNativeView } from 'expo';
import * as React from 'react';

import { TrackerSystemViewProps } from './TrackerSystem.types';

const NativeView: React.ComponentType<TrackerSystemViewProps> =
  requireNativeView('TrackerSystem');

export default function TrackerSystemView(props: TrackerSystemViewProps) {
  return <NativeView {...props} />;
}
