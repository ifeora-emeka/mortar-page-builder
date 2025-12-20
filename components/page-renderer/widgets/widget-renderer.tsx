'use client';

import React from 'react';
import { WidgetType, Flow } from '@prisma/client';
import { WidgetProps } from './widget.types';
import ButtonWidget from './button.widget';
import TextWidget from './text.widget';
import StackWidget from './stack.widget';
import RichTextWidget from './rich-text.widget';
import ServiceWidget from './service.widget';
import TestimonialWidget from './testimonial.widget';

export default function WidgetRenderer({ widget, allWidgets, editMode = false }: WidgetProps) {
  const children = widget.children || allWidgets.filter(w => w.parentId === widget.id).sort((a, b) => a.order - b.order);

  const baseClasses = editMode 
    ? 'relative group outline-none transition-all hover:outline-2 hover:outline-blue-500 hover:outline-dashed'
    : '';

  const widgetProps: WidgetProps = {
    widget: { ...widget, children } as WidgetProps['widget'],
    allWidgets,
    editMode
  };

  switch (widget.type) {
    case WidgetType.BUTTON:
      return (
        <div className={baseClasses} data-widget-id={widget.id}>
          <ButtonWidget {...widgetProps} />
        </div>
      );
    
    case WidgetType.TEXT:
      return (
        <div className={baseClasses} data-widget-id={widget.id}>
          <TextWidget {...widgetProps} />
        </div>
      );
    
    case WidgetType.STACK:
      return (
        <div className={baseClasses} data-widget-id={widget.id}>
          <StackWidget {...widgetProps} />
        </div>
      );
    
    case WidgetType.RICH_TEXT:
      return (
        <div className={baseClasses} data-widget-id={widget.id}>
          <RichTextWidget {...widgetProps} />
        </div>
      );
    
    case WidgetType.SERVICE:
      return (
        <div className={baseClasses} data-widget-id={widget.id}>
          <ServiceWidget {...widgetProps} />
        </div>
      );
    
    case WidgetType.TESTIMONIAL:
      return (
        <div className={baseClasses} data-widget-id={widget.id}>
          <TestimonialWidget {...widgetProps} />
        </div>
      );
    
    default:
      return (
        <div className={`p-4 border rounded-lg ${baseClasses}`} data-widget-id={widget.id}>
          <p className="text-sm text-muted-foreground">
            Widget Type: {widget.type} (Not implemented)
          </p>
          {widget.textContent && (
            <p className="text-base mt-2">{widget.textContent}</p>
          )}
        </div>
      );
  }
}

