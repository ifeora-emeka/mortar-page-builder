import React from 'react';
import { Page, PageSection, PageSectionWidget, PageSectionInstance, Flow, WidgetType } from '@prisma/client';

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
}

function renderWidget(widget: WidgetWithChildren, allWidgets: WidgetWithChildren[]): React.ReactNode {
  const children = widget.children || allWidgets.filter(w => w.parentId === widget.id).sort((a, b) => a.order - b.order);

  if (widget.type === WidgetType.STACK) {
    const isHorizontal = widget.flow === Flow.HORIZONTAL;
    return (
      <div
        key={widget.id}
        className={`flex ${isHorizontal ? 'flex-row gap-4' : 'flex-col gap-4'} p-4 border rounded-lg`}
      >
        {children.length > 0 ? (
          children.map(child => renderWidget(child, allWidgets))
        ) : (
          <div className="text-muted-foreground">Empty stack</div>
        )}
      </div>
    );
  }

  const widgetContent = (
    <div key={widget.id} className="p-4 border rounded-lg">
      <p className="text-sm text-muted-foreground mb-2">
        Widget Type: {widget.type}
      </p>
      {widget.textContent && (
        <p className="text-base mb-2">{widget.textContent}</p>
      )}
      {children.length > 0 && (
        <div className="mt-4 space-y-2 pl-4 border-l-2">
          {children.map(child => renderWidget(child, allWidgets))}
        </div>
      )}
    </div>
  );

  return widgetContent;
}

export default function PageRenderer({ page, sections, sectionInstances, widgets }: Props) {
  if (!page) {
    return <div>Page not found</div>;
  }

  const sectionsToRender = sectionInstances 
    ? sectionInstances.map(instance => instance.section)
    : sections;

  return (
    <div className="min-h-screen">
      <h1 className="text-4xl font-bold mb-8">{page.name}</h1>
      <div className="space-y-8">
        {sectionInstances
          ? sectionInstances
              .sort((a, b) => a.order - b.order)
              .map((instance) => {
                const section = instance.section;
                const sectionWidgets = widgets.filter(w => w.sectionId === section.id && !w.parentId);
                return (
                  <div key={instance.id} className="mb-12">
                    <h2 className="text-2xl font-semibold mb-4">{section.name}</h2>
                    {section.description && (
                      <p className="text-muted-foreground mb-4">{section.description}</p>
                    )}
                    <div className="space-y-4">
                      {sectionWidgets
                        .sort((a, b) => a.order - b.order)
                        .map((widget) => renderWidget(widget, widgets))}
                    </div>
                  </div>
                );
              })
          : sectionsToRender
              .map((section) => {
                const sectionWidgets = widgets.filter(w => w.sectionId === section.id && !w.parentId);
                return (
                  <div key={section.id} className="mb-12">
                    <h2 className="text-2xl font-semibold mb-4">{section.name}</h2>
                    {section.description && (
                      <p className="text-muted-foreground mb-4">{section.description}</p>
                    )}
                    <div className="space-y-4">
                      {sectionWidgets
                        .sort((a, b) => a.order - b.order)
                        .map((widget) => renderWidget(widget, widgets))}
                    </div>
                  </div>
                );
              })}
      </div>
    </div>
  );
}
