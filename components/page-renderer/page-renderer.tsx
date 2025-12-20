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
}

export default function PageRenderer({ page, sections, sectionInstances, widgets, editMode = false }: Props) {
  if (!page) {
    return <div>Page not found</div>;
  }

  return (
    <div className="min-h-screen">
      {!editMode && (
        <h1 className="text-4xl font-bold mb-8">{page.name}</h1>
      )}
      <div className="space-y-8">
        {sectionInstances
          ? sectionInstances
              .sort((a, b) => a.order - b.order)
              .map((instance) => (
                <SectionRenderer
                  key={instance.id}
                  section={instance.section}
                  widgets={widgets}
                  editMode={editMode}
                />
              ))
          : sections.map((section) => (
              <SectionRenderer
                key={section.id}
                section={section}
                widgets={widgets}
                editMode={editMode}
              />
            ))}
      </div>
    </div>
  );
}
