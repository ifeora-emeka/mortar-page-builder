'use client';

import React from 'react';
import { PageSection, PageSectionWidget } from '@prisma/client';
import WidgetRenderer from '../widgets/widget-renderer';

type WidgetWithChildren = PageSectionWidget & {
  children?: WidgetWithChildren[];
};

type Props = {
  section: PageSection & {
    widgets?: WidgetWithChildren[];
  };
  widgets: WidgetWithChildren[];
  editMode?: boolean;
  isActive?: boolean;
  onSectionClick?: (sectionId: string) => void;
  activeWidgetId?: string | null;
  onWidgetClick?: (widgetId: string) => void;
}

export default function SectionRenderer({ 
  section, 
  widgets, 
  editMode = false,
  isActive = false,
  onSectionClick,
  activeWidgetId = null,
  onWidgetClick
}: Props) {
  const sectionWidgets = widgets
    .filter(w => w.sectionId === section.id && !w.parentId)
    .sort((a, b) => a.order - b.order);

  const containerWidthClass = section.containerWidth === 'NONE' 
    ? 'w-full' 
    : section.containerWidth === 'SMALL' 
    ? 'container mx-auto max-w-2xl' 
    : section.containerWidth === 'LARGE' 
    ? 'container mx-auto max-w-7xl' 
    : 'container mx-auto max-w-5xl';

  const baseClasses = editMode
    ? `relative group outline-none transition-all min-h-[60px] rounded-lg p-4 ${containerWidthClass} ${
        isActive 
          ? 'outline-2 outline-blue-500 outline-dashed bg-blue-50/50 dark:bg-blue-950/20' 
          : 'hover:outline-2 hover:outline-blue-500 hover:outline-dashed hover:bg-blue-50/30 dark:hover:bg-blue-950/10'
      }`
    : `mb-12 ${containerWidthClass}`;

  const handleClick = () => {
    if (editMode && onSectionClick) {
      onSectionClick(section.id);
    }
  };

  return (
    <section
      className={baseClasses}
      data-section-id={section.id}
      onClick={handleClick}
      style={{ cursor: editMode ? 'pointer' : 'default' }}
    >
      {editMode && (
        <div className={`absolute top-0 left-0 bg-blue-500 text-white text-xs px-2 py-1 rounded-br transition-opacity z-10 ${
          isActive ? 'opacity-100' : 'opacity-0 group-hover:opacity-100'
        }`}>
          {section.name}
        </div>
      )}
      <div className="space-y-4">
        {sectionWidgets.map((widget) => (
          <WidgetRenderer
            key={widget.id}
            widget={widget}
            allWidgets={widgets}
            editMode={editMode}
            isActive={activeWidgetId === widget.id}
            onWidgetClick={onWidgetClick}
            activeWidgetId={activeWidgetId}
          />
        ))}
      </div>
    </section>
  );
}
