import React from 'react';
import { Page, PageSection, PageSectionWidget, PageSectionInstance } from '@prisma/client';
import SectionRenderer from './section-renderer/section-renderer';

type WidgetWithChildren = PageSectionWidget & {
  children?: WidgetWithChildren[];
};

type SectionWithWidgets = PageSection & {
  widgets: WidgetWithChildren[];
};

type Props = {
  page: Page | null;
  sections: SectionWithWidgets[];
  sectionInstances?: (PageSectionInstance & {
    section: SectionWithWidgets;
  })[];
  widgets: WidgetWithChildren[];
  editMode?: boolean;
  activeSectionId?: string | null;
  activeWidgetId?: string | null;
  onSectionClick?: (sectionId: string) => void;
  onWidgetClick?: (widgetId: string) => void;
}

export default function PageRenderer({ 
  page, 
  sections, 
  sectionInstances, 
  widgets, 
  editMode = false,
  activeSectionId = null,
  activeWidgetId = null,
  onSectionClick,
  onWidgetClick
}: Props) {
  if (!page) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <h2 className="text-2xl font-semibold mb-2">Page not found</h2>
          <p className="text-muted-foreground">The requested page could not be loaded</p>
        </div>
      </div>
    );
  }

  return (
    <div className={`min-h-screen`}>
      {!editMode && (
        <div className="container mx-auto px-4 py-8">
          <h1 className="text-4xl font-bold mb-8">{page.name}</h1>
        </div>
      )}
      <div className={editMode ? 'space-y-6' : 'container mx-auto px-4 space-y-8'}>
        {sectionInstances
          ? sectionInstances
              .sort((a, b) => a.order - b.order)
              .map((instance) => (
                <SectionRenderer
                  key={instance.id}
                  section={instance.section}
                  widgets={widgets}
                  editMode={editMode}
                  isActive={activeSectionId === instance.section.id}
                  onSectionClick={onSectionClick}
                  activeWidgetId={activeWidgetId}
                  onWidgetClick={onWidgetClick}
                />
              ))
          : sections.map((section) => (
              <SectionRenderer
                key={section.id}
                section={section}
                widgets={widgets}
                editMode={editMode}
                isActive={activeSectionId === section.id}
                onSectionClick={onSectionClick}
                activeWidgetId={activeWidgetId}
                onWidgetClick={onWidgetClick}
              />
            ))}
      </div>
    </div>
  );
}
