'use client';

import React from 'react';
import PageBuilderHeader from './page-builder-header';
import PageBuilderPreview from './page-builder-preview';

type Props = {}

export default function PageBuilder({ }: Props) {
  return (
    <div className='h-screen w-full flex flex-col overflow-hidden bg-background'>
      <PageBuilderHeader />
      <PageBuilderPreview />
    </div>
  );
}