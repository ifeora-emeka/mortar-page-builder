'use client';

import React from 'react';
import { WidgetProps } from './widget.types';

export default function VideoWidget({ widget, editMode = false }: WidgetProps) {
  if (!widget.src) {
    return (
      <div className="p-4 border border-dashed rounded-lg text-center text-muted-foreground">
        <p className="text-sm">No video source provided</p>
      </div>
    );
  }

  return (
    <div className="relative w-full">
      <video
        src={widget.src}
        poster={widget.thumbnailUrl || undefined}
        controls
        className="w-full h-auto rounded-lg"
        preload="metadata"
      >
        Your browser does not support the video tag.
      </video>
    </div>
  );
}

