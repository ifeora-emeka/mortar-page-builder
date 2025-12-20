'use client';

import React from 'react';
import { usePageBuilderContext } from '../../context/page-builder.context';
import { usePageBuilderPreviewContext } from '../../context/page-builder-preview.context';

type Props = {}

export default function PageBuilderHeader({ }: Props) {
    const { website } = usePageBuilderContext();
    const { route, setRoute, currentPage } = usePageBuilderPreviewContext();

    return (
        <div className='h-14 w-full bg-card border-b flex items-center justify-between px-6 shadow-sm'>
            <div className="flex items-center gap-4">
                <h1 className="text-lg font-semibold">
                    {website?.title || 'Page Builder'}
                </h1>
                <div className="h-6 w-px bg-border" />
                <div className="flex items-center gap-2">
                    <span className="text-sm text-muted-foreground">Page:</span>
                    <span className="text-sm font-medium">{currentPage?.name || 'None'}</span>
                </div>
            </div>
            <div className="flex items-center gap-2">
                <input
                    type="text"
                    value={route}
                    onChange={(e) => setRoute(e.target.value)}
                    placeholder="/"
                    className="px-3 py-1.5 text-sm border rounded-md bg-background focus:outline-none focus:ring-2 focus:ring-blue-500 w-48"
                />
            </div>
        </div>
    );
}