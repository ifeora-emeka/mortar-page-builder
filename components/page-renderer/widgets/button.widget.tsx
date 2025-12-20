'use client';

import React from 'react';
import { WidgetProps } from './widget.types';

export default function ButtonWidget({ widget, editMode = false }: WidgetProps) {
  return (
    <button>
      {widget.textContent || 'Button'}
    </button>
  );
}