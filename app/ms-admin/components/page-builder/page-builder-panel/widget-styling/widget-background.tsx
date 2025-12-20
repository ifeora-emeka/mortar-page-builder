'use client';

import React from 'react';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Input } from '@/components/ui/input';

type Props = {
  widgetId: string;
}

export default function WidgetBackground({ widgetId }: Props) {
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

      <div className="space-y-2">
        <Label>Background Image URL</Label>
        <Input type="url" placeholder="https://example.com/image.jpg" />
      </div>

      <div className="space-y-2">
        <Label>Gradient Start Color</Label>
        <div className="flex gap-2">
          <Input type="color" className="w-16 h-9" defaultValue="#3b82f6" />
          <Input type="text" placeholder="#3b82f6" defaultValue="#3b82f6" />
        </div>
      </div>

      <div className="space-y-2">
        <Label>Gradient End Color</Label>
        <div className="flex gap-2">
          <Input type="color" className="w-16 h-9" defaultValue="#8b5cf6" />
          <Input type="text" placeholder="#8b5cf6" defaultValue="#8b5cf6" />
        </div>
      </div>

      <div className="space-y-2">
        <Label>Gradient Direction</Label>
        <Select defaultValue="to-right">
          <SelectTrigger>
            <SelectValue placeholder="Select gradient direction" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="to-right">To Right</SelectItem>
            <SelectItem value="to-left">To Left</SelectItem>
            <SelectItem value="to-bottom">To Bottom</SelectItem>
            <SelectItem value="to-top">To Top</SelectItem>
            <SelectItem value="to-bottom-right">To Bottom Right</SelectItem>
            <SelectItem value="to-bottom-left">To Bottom Left</SelectItem>
            <SelectItem value="to-top-right">To Top Right</SelectItem>
            <SelectItem value="to-top-left">To Top Left</SelectItem>
          </SelectContent>
        </Select>
      </div>
    </div>
  );
}

