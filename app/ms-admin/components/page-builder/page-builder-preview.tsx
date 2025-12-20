'use client';

import React from 'react';
import { usePageBuilderPreviewContext } from '../../context/page-builder-preview.context';
import PageRenderer from '@/components/page-renderer/page-renderer';

type Props = {}

export default function PageBuilderPreview({ }: Props) {
    const {
        currentPage,
        currentSectionInstances,
        currentWidgets,
        activeSectionId,
        activeWidgetId,
        selectedWidget,
        setActiveSectionId,
        setActiveWidgetId,
        setSelectedWidget,
    } = usePageBuilderPreviewContext();

    const handleSectionClick = (sectionId: string) => {
        setActiveSectionId(activeSectionId === sectionId ? null : sectionId);
        setActiveWidgetId(null);
        setSelectedWidget(null);
    };

    const handleWidgetClick = (widgetId: string) => {
        const clickedWidget = currentWidgets.find(w => w.id === widgetId);
        if (clickedWidget) {
            if (selectedWidget?.id === widgetId) {
                setSelectedWidget(null);
                setActiveWidgetId(null);
            } else {
                setSelectedWidget(clickedWidget);
                setActiveWidgetId(widgetId);
            }
        } else {
            setSelectedWidget(null);
            setActiveWidgetId(null);
        }
    };

    return (
        <div className="h-full w-full flex-1 bg-background overflow-auto">
            <div className="min-h-full bg-gradient-to-br from-background to-muted/20">
                <PageRenderer
                    page={currentPage}
                    sections={[]}
                    sectionInstances={currentSectionInstances}
                    widgets={currentWidgets}
                    editMode={true}
                    activeSectionId={activeSectionId}
                    activeWidgetId={activeWidgetId}
                    onSectionClick={handleSectionClick}
                    onWidgetClick={handleWidgetClick}
                />
            </div>
        </div>
    );
}