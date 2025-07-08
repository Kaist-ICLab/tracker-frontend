import * as React from 'react';

import { AndroidTrackerLibViewProps } from './AndroidTrackerLib.types';

export default function AndroidTrackerLibView(props: AndroidTrackerLibViewProps) {
  return (
    <div>
      <iframe
        style={{ flex: 1 }}
        src={props.url}
        onLoad={() => props.onLoad({ nativeEvent: { url: props.url } })}
      />
    </div>
  );
}
