'use client';

import React from 'react';
import { Flow } from '@prisma/client';
import { WidgetProps } from './widget.types';
import WidgetRenderer from './widget-renderer';

export default function StackWidget({ widget, allWidgets, editMode = false, isActive = false, onWidgetClick, activeWidgetId }: WidgetProps & { onWidgetClick?: (widgetId: string) => void; activeWidgetId?: string | null }) {
  const isHorizontal = widget.flow === Flow.HORIZONTAL;
  const children = widget.children || [];

  return (
    <div
      className={`flex ${isHorizontal ? 'flex-row gap-4' : 'flex-col gap-4'} min-h-[40px]`}
    >
      {children.length > 0 ? (
        children.map(child => (
          <WidgetRenderer
            key={child.id}
            widget={child}
            allWidgets={allWidgets}
            editMode={editMode}
            isActive={activeWidgetId === child.id}
            onWidgetClick={onWidgetClick}
          />
        ))
      ) : (
        <div className="text-muted-foreground text-sm p-2 border border-dashed rounded">
          Empty stack
        </div>
      )}
    </div>
  );
}

