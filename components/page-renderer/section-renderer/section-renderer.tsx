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
}

export default function SectionRenderer({ section, widgets, editMode = false }: Props) {
  const sectionWidgets = widgets
    .filter(w => w.sectionId === section.id && !w.parentId)
    .sort((a, b) => a.order - b.order);

  const baseClasses = editMode
    ? 'relative group outline-none transition-all hover:outline-2 hover:outline-blue-500 hover:outline-dashed min-h-[60px]'
    : '';

  return (
    <section
      className={`mb-12 ${baseClasses}`}
      data-section-id={section.id}
    >
      {editMode && (
        <div className="absolute top-0 left-0 bg-blue-500 text-white text-xs px-2 py-1 rounded-br opacity-0 group-hover:opacity-100 transition-opacity z-10">
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
          />
        ))}
      </div>
    </section>
  );
}
