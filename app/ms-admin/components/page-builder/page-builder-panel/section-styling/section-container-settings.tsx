'use client';

import React from 'react';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

type Props = {
  sectionId: string;
}

export default function SectionContainerSettings({ sectionId }: Props) {
  return (
    <div className="space-y-4">
      <div className="space-y-2">
        <Label>Container Width</Label>
        <Select defaultValue="default">
          <SelectTrigger>
            <SelectValue placeholder="Select container width" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="small">Small</SelectItem>
            <SelectItem value="default">Default</SelectItem>
            <SelectItem value="large">Large</SelectItem>
            <SelectItem value="none">None (Full Width)</SelectItem>
          </SelectContent>
        </Select>
      </div>
    </div>
  );
}

