'use client';

import React from 'react';
import { WidgetProps } from './widget.types';

export default function TextWidget({ widget, editMode = false }: WidgetProps) {
  const displayConfig = widget.displayConfig as { element?: string } | null;
  const element = displayConfig?.element || 'p';
  const validElements = ['h1', 'h2', 'h3', 'h4', 'h5', 'h6', 'p', 'small', 'span', 'div'];
  const Tag = (validElements.includes(element) ? element : 'p') as keyof JSX.IntrinsicElements;

  if (!widget.textContent) {
    return null;
  }

  return (
    <Tag className="text-base">
      {widget.textContent}
    </Tag>
  );
}