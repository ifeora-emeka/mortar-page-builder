'use client';

import React from 'react';
import { WidgetProps } from './widget.types';

export default function ImageWidget({ widget, editMode = false }: WidgetProps) {
  if (!widget.src) {
    return (
      <div className="p-4 border border-dashed rounded-lg text-center text-muted-foreground">
        <p className="text-sm">No image source provided</p>
      </div>
    );
  }

  return (
    <div className="relative w-full">
      <img
        src={widget.src}
        alt={widget.textContent || 'Image'}
        className="w-full h-auto rounded-lg object-cover"
      />
    </div>
  );
}

