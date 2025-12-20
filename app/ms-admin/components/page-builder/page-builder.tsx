'use client';

import React from 'react';
import PageBuilderHeader from './page-builder-header';
import PageBuilderPreview from './page-builder-preview';
import PageBuilderPanel from './page-builder-panel/page-builder-panel';

type Props = {}

export default function PageBuilder({ }: Props) {
  return (
    <div className='h-screen w-full flex flex-col overflow-hidden bg-background'>
      <PageBuilderHeader />
      <div className="h-full w-full flex-1 flex bg-background overflow-auto">
        <PageBuilderPreview />
        <PageBuilderPanel />
      </div>
    </div>
  );
}