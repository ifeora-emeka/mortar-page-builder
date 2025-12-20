'use client';

import React, { createContext, useContext, useState, ReactNode } from 'react';
import { Website, ColorVariable } from '@prisma/client';

type PageBuilderContextType = {
  website: Website | null;
  setWebsite: (website: Website | null) => void;
  colorVariables: ColorVariable[];
  setColorVariables: (colorVariables: ColorVariable[]) => void;
};

const PageBuilderContext = createContext<PageBuilderContextType | undefined>(undefined);

export function PageBuilderProvider({ 
  children, 
  initialWebsite,
  initialColorVariables = []
}: { 
  children: ReactNode; 
  initialWebsite: Website | null;
  initialColorVariables?: ColorVariable[];
}) {
  const [website, setWebsite] = useState<Website | null>(initialWebsite);
  const [colorVariables, setColorVariables] = useState<ColorVariable[]>(initialColorVariables);

  return (
    <PageBuilderContext.Provider value={{ website, setWebsite, colorVariables, setColorVariables }}>
      {children}
    </PageBuilderContext.Provider>
  );
}

export function usePageBuilderContext() {
  const context = useContext(PageBuilderContext);
  if (context === undefined) {
    throw new Error('usePageBuilderContext must be used within a PageBuilderProvider');
  }
  return context;
}

