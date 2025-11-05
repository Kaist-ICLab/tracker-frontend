import * as React from 'react';

import { TrackerSystemViewProps } from './TrackerSystem.types';

export default function TrackerSystemView(props: TrackerSystemViewProps) {
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
