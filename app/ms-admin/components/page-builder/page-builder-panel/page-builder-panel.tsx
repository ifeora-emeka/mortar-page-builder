'use client';

import React from 'react';
import { usePageBuilderPreviewContext } from '../../../context/page-builder-preview.context';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import SectionBackground from './section-styling/section-background';
import SectionContainerSettings from './section-styling/section-container-settings';
import WidgetBackground from './widget-styling/widget-background';
import WidgetBorder from './widget-styling/widget-border';
import WidgetFontSize from './widget-styling/widget-font-size';
import { Separator } from '@/components/ui/separator';

type Props = {}

export default function PageBuilderPanel({}: Props) {
  const {
    activeSectionId,
    activeWidgetId,
    selectedWidget,
    allSections,
  } = usePageBuilderPreviewContext();

  const activeSection = activeSectionId 
    ? allSections.find(s => s.id === activeSectionId) 
    : null;

  const isTextWidget = selectedWidget?.type === 'TEXT' || selectedWidget?.type === 'RICH_TEXT';

  return (
    <div className="bg-sidebar w-80 border-l h-full overflow-y-auto">
      <div className="p-4 space-y-4">
        <div>
          <h2 className="text-lg font-semibold">Style & Configure</h2>
          <p className="text-sm text-muted-foreground">Customize your sections and widgets</p>
        </div>

        <Separator />

        <Accordion type="multiple" defaultValue={activeSectionId ? ['section'] : []} className="w-full">
          {activeSection && (
            <AccordionItem value="section" className="border-b">
              <AccordionTrigger className="text-sm font-medium">
                Section: {activeSection.name}
              </AccordionTrigger>
              <AccordionContent className="space-y-4 pt-2">
                <div className="space-y-4">
                  <div>
                    <h3 className="text-sm font-medium mb-2">Background</h3>
                    <SectionBackground sectionId={activeSection.id} />
                  </div>
                  <Separator />
                  <div>
                    <h3 className="text-sm font-medium mb-2">Layout</h3>
                    <SectionContainerSettings sectionId={activeSection.id} />
                  </div>
                </div>
              </AccordionContent>
            </AccordionItem>
          )}

          {selectedWidget && (
            <AccordionItem value="widget" className="border-b">
              <AccordionTrigger className="text-sm font-medium">
                Widget: {selectedWidget.type}
              </AccordionTrigger>
              <AccordionContent className="space-y-4 pt-2">
                <div className="space-y-4">
                  <div>
                    <h3 className="text-sm font-medium mb-2">Background</h3>
                    <WidgetBackground widgetId={selectedWidget.id} />
                  </div>
                  <Separator />
                  <div>
                    <h3 className="text-sm font-medium mb-2">Border</h3>
                    <WidgetBorder widgetId={selectedWidget.id} />
                  </div>
                  {isTextWidget && (
                    <>
                      <Separator />
                      <div>
                        <h3 className="text-sm font-medium mb-2">Typography</h3>
                        <WidgetFontSize widgetId={selectedWidget.id} />
                      </div>
                    </>
                  )}
                </div>
              </AccordionContent>
            </AccordionItem>
          )}
        </Accordion>

        {!activeSection && !selectedWidget && (
          <div className="text-center py-8 text-muted-foreground">
            <p className="text-sm">Select a section or widget to start styling</p>
          </div>
        )}
      </div>
    </div>
  );
}
