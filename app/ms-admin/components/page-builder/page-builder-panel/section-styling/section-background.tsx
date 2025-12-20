'use client';

import React from 'react';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Input } from '@/components/ui/input';

type Props = {
  sectionId: string;
}

export default function SectionBackground({ sectionId }: Props) {
  return (
    <div className="space-y-4">
      <div className="space-y-2">
        <Label>Background Type</Label>
        <Select defaultValue="color">
          <SelectTrigger>
            <SelectValue placeholder="Select background type" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="color">Color</SelectItem>
            <SelectItem value="image">Image</SelectItem>
            <SelectItem value="gradient">Gradient</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="space-y-2">
        <Label>Background Color</Label>
        <div className="flex gap-2">
          <Input type="color" className="w-16 h-9" defaultValue="#ffffff" />
          <Input type="text" placeholder="#ffffff" defaultValue="#ffffff" />
        </div>
      </div>
    </div>
  );
}

