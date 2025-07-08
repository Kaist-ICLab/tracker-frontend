import { requireNativeView } from 'expo';
import * as React from 'react';

import { AndroidTrackerLibViewProps } from './AndroidTrackerLib.types';

const NativeView: React.ComponentType<AndroidTrackerLibViewProps> =
  requireNativeView('AndroidTrackerLib');

export default function AndroidTrackerLibView(props: AndroidTrackerLibViewProps) {
  return <NativeView {...props} />;
}
