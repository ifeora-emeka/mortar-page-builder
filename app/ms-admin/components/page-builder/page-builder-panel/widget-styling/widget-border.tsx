'use client';

import React from 'react';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import { Slider } from '@/components/ui/slider';

type Props = {
  widgetId: string;
}

export default function WidgetBorder({ widgetId }: Props) {
  return (
    <div className="space-y-4">
      <div className="space-y-2">
        <Label>Border Width</Label>
        <Slider defaultValue={[0]} max={10} step={1} />
        <div className="text-xs text-muted-foreground">0px</div>
      </div>

      <div className="space-y-2">
        <Label>Border Type</Label>
        <Select defaultValue="solid">
          <SelectTrigger>
            <SelectValue placeholder="Select border type" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="solid">Solid</SelectItem>
            <SelectItem value="dashed">Dashed</SelectItem>
            <SelectItem value="dotted">Dotted</SelectItem>
            <SelectItem value="double">Double</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="space-y-2">
        <Label>Border Color</Label>
        <div className="flex gap-2">
          <Input type="color" className="w-16 h-9" defaultValue="#000000" />
          <Input type="text" placeholder="#000000" defaultValue="#000000" />
        </div>
      </div>

      <div className="space-y-2">
        <Label>Border Radius</Label>
        <Slider defaultValue={[0]} max={50} step={1} />
        <div className="text-xs text-muted-foreground">0px</div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label>Top Left</Label>
          <Input type="number" placeholder="0" min="0" />
        </div>
        <div className="space-y-2">
          <Label>Top Right</Label>
          <Input type="number" placeholder="0" min="0" />
        </div>
        <div className="space-y-2">
          <Label>Bottom Left</Label>
          <Input type="number" placeholder="0" min="0" />
        </div>
        <div className="space-y-2">
          <Label>Bottom Right</Label>
          <Input type="number" placeholder="0" min="0" />
        </div>
      </div>
    </div>
  );
}

