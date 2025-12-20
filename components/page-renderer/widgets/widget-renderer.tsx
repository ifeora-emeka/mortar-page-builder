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
import ImageWidget from './image.widget';
import VideoWidget from './video.widget';

export default function WidgetRenderer({ widget, allWidgets, editMode = false, isActive = false, onWidgetClick, activeWidgetId }: WidgetProps & { isActive?: boolean; onWidgetClick?: (widgetId: string) => void; activeWidgetId?: string | null }) {
  const children = widget.children || allWidgets.filter(w => w.parentId === widget.id).sort((a, b) => a.order - b.order);

  const baseClasses = editMode 
    ? `relative group outline-none transition-all rounded ${
        isActive 
          ? 'outline-2 outline-green-500 outline-dashed bg-green-50/50 dark:bg-green-950/20' 
          : 'hover:outline-2 hover:outline-green-500 hover:outline-dashed hover:bg-green-50/30 dark:hover:bg-green-950/10'
      }`
    : '';

  const handleClick = (e: React.MouseEvent) => {
    if (editMode && onWidgetClick) {
      e.stopPropagation();
      onWidgetClick(widget.id);
    }
  };

  const widgetProps: WidgetProps = {
    widget: { ...widget, children } as WidgetProps['widget'],
    allWidgets,
    editMode
  };

  const widgetPropsWithActive = { ...widgetProps, isActive };

  const widgetContent = (() => {
    switch (widget.type) {
      case WidgetType.BUTTON:
        return <ButtonWidget {...widgetPropsWithActive} />;
      
      case WidgetType.TEXT:
        return <TextWidget {...widgetPropsWithActive} />;
      
      case WidgetType.STACK:
        return <StackWidget {...widgetPropsWithActive} onWidgetClick={onWidgetClick} activeWidgetId={activeWidgetId} />;
      
      case WidgetType.RICH_TEXT:
        return <RichTextWidget {...widgetPropsWithActive} />;
      
      case WidgetType.SERVICE:
        return <ServiceWidget {...widgetPropsWithActive} />;
      
      case WidgetType.TESTIMONIAL:
        return <TestimonialWidget {...widgetPropsWithActive} />;
      
      case WidgetType.IMAGE:
        return <ImageWidget {...widgetPropsWithActive} />;
      
      case WidgetType.VIDEO:
        return <VideoWidget {...widgetPropsWithActive} />;
      
      default:
        return (
          <div className="p-4 border rounded-lg">
            <p className="text-sm text-muted-foreground">
              Widget Type: {widget.type} (Not implemented)
            </p>
            {widget.textContent && (
              <p className="text-base mt-2">{widget.textContent}</p>
            )}
          </div>
        );
    }
  })();

  return (
    <div 
      className={baseClasses} 
      data-widget-id={widget.id}
      onClick={handleClick}
      style={{ cursor: editMode ? 'pointer' : 'default' }}
    >
      {editMode && isActive && (
        <div className="absolute -top-3 left-1/2 -translate-x-1/2 z-20 pointer-events-none">
          <div className="bg-green-500 text-white text-xs font-medium px-3 py-1 rounded-full shadow-lg whitespace-nowrap">
            {widget.type}
          </div>
        </div>
      )}
      {widgetContent}
    </div>
  );
}

