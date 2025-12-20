'use client';

import React from 'react';
import { WidgetProps } from './widget.types';

export default function ServiceWidget({ widget, editMode = false }: WidgetProps) {
  return (
    <div className="p-4 border rounded-lg">
      <h3 className="text-lg font-semibold mb-2">
        {widget.textContent || 'Service'}
      </h3>
    </div>
  );
}

