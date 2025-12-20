'use client';

import React, { createContext, useContext, useState, useMemo, ReactNode } from 'react';
import { Page, PageSection, PageSectionWidget, PageSectionInstance } from '@prisma/client';

type WidgetWithChildren = PageSectionWidget & {
  children?: WidgetWithChildren[];
};

type SectionWithWidgets = PageSection & {
  widgets: WidgetWithChildren[];
};

type PageSectionInstanceWithSection = PageSectionInstance & {
  section: SectionWithWidgets;
};

type PageWithInstances = Page & {
  sectionInstances: PageSectionInstanceWithSection[];
};

type PageBuilderPreviewContextType = {
  pages: PageWithInstances[];
  allSections: SectionWithWidgets[];
  allWidgets: WidgetWithChildren[];
  route: string;
  setRoute: (route: string) => void;
  activeSectionId: string | null;
  setActiveSectionId: (id: string | null) => void;
  activeWidgetId: string | null;
  setActiveWidgetId: (id: string | null) => void;
  selectedWidget: WidgetWithChildren | null;
  setSelectedWidget: (widget: WidgetWithChildren | null) => void;
  currentPage: Page | null;
  currentSectionInstances: PageSectionInstanceWithSection[];
  currentWidgets: WidgetWithChildren[];
};

const PageBuilderPreviewContext = createContext<PageBuilderPreviewContextType | undefined>(undefined);

type PageBuilderPreviewProviderProps = {
  children: ReactNode;
  initialPages: PageWithInstances[];
  initialSections: SectionWithWidgets[];
  initialWidgets: WidgetWithChildren[];
};

export function PageBuilderPreviewProvider({
  children,
  initialPages,
  initialSections,
  initialWidgets,
}: PageBuilderPreviewProviderProps) {
  const [pages] = useState<PageWithInstances[]>(initialPages);
  const [allSections] = useState<SectionWithWidgets[]>(initialSections);
  const [allWidgets] = useState<WidgetWithChildren[]>(initialWidgets);
  const [route, setRoute] = useState<string>('/');
  const [activeSectionId, setActiveSectionId] = useState<string | null>(null);
  const [activeWidgetId, setActiveWidgetId] = useState<string | null>(null);
  const [selectedWidget, setSelectedWidget] = useState<WidgetWithChildren | null>(null);

  const currentPage = useMemo(() => {
    const pageSlug = route === '/' || route === '' ? 'home' : route.replace(/^\//, '');
    return pages.find(p => p.slug === pageSlug) || null;
  }, [pages, route]);

  const currentSectionInstances = useMemo(() => {
    if (!currentPage) return [];
    return currentPage.sectionInstances.sort((a, b) => a.order - b.order);
  }, [currentPage]);

  const currentWidgets = useMemo(() => {
    return allWidgets;
  }, [allWidgets]);

  return (
    <PageBuilderPreviewContext.Provider
      value={{
        pages,
        allSections,
        allWidgets,
        route,
        setRoute,
        activeSectionId,
        setActiveSectionId,
        activeWidgetId,
        setActiveWidgetId,
        selectedWidget,
        setSelectedWidget,
        currentPage,
        currentSectionInstances,
        currentWidgets,
      }}
    >
      {children}
    </PageBuilderPreviewContext.Provider>
  );
}

export function usePageBuilderPreviewContext() {
  const context = useContext(PageBuilderPreviewContext);
  if (context === undefined) {
    throw new Error('usePageBuilderPreviewContext must be used within a PageBuilderPreviewProvider');
  }
  return context;
}

