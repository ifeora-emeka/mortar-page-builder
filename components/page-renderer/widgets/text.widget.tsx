'use client';

import React from 'react';
import { WidgetProps } from './widget.types';

const elementSizeMap: Record<string, string> = {
  h1: 'text-4xl',
  h2: 'text-3xl',
  h3: 'text-2xl',
  h4: 'text-xl',
  h5: 'text-lg',
  h6: 'text-base',
  p: 'text-base',
  small: 'text-sm',
  span: 'text-base',
  div: 'text-base',
};

export default function TextWidget({ widget, editMode = false }: WidgetProps) {
  const displayConfig = widget.displayConfig as { element?: string } | null;
  const element = displayConfig?.element || 'p';
  const validElements = ['h1', 'h2', 'h3', 'h4', 'h5', 'h6', 'p', 'small', 'span', 'div'];
  const tagName = validElements.includes(element) ? element : 'p';
  const sizeClasses = elementSizeMap[tagName] || elementSizeMap.p;

  if (!widget.textContent) {
    return null;
  }

  const Tag = tagName as keyof React.JSX.IntrinsicElements;

  return React.createElement(Tag, { className: sizeClasses }, widget.textContent);
}