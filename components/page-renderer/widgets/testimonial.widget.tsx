'use client';

import React from 'react';
import { WidgetProps } from './widget.types';

export default function TestimonialWidget({ widget, editMode = false }: WidgetProps) {
  return (
    <div className="p-6 border rounded-lg bg-muted/50">
      <p className="text-base italic mb-4">
        {widget.textContent || 'Testimonial content'}
      </p>
      <div className="text-sm text-muted-foreground">
        — Testimonial Author
      </div>
    </div>
  );
}

