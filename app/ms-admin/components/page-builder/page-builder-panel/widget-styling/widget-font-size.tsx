'use client';

import React from 'react';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Slider } from '@/components/ui/slider';
import { Input } from '@/components/ui/input';

type Props = {
  widgetId: string;
}

export default function WidgetFontSize({ widgetId }: Props) {
  return (
    <div className="space-y-4">
      <div className="space-y-2">
        <Label>Font Size</Label>
        <Select defaultValue="base">
          <SelectTrigger>
            <SelectValue placeholder="Select font size" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="xs">Extra Small (0.75rem)</SelectItem>
            <SelectItem value="sm">Small (0.875rem)</SelectItem>
            <SelectItem value="base">Base (1rem)</SelectItem>
            <SelectItem value="lg">Large (1.125rem)</SelectItem>
            <SelectItem value="xl">Extra Large (1.25rem)</SelectItem>
            <SelectItem value="2xl">2XL (1.5rem)</SelectItem>
            <SelectItem value="3xl">3XL (1.875rem)</SelectItem>
            <SelectItem value="4xl">4XL (2.25rem)</SelectItem>
            <SelectItem value="5xl">5XL (3rem)</SelectItem>
            <SelectItem value="6xl">6XL (3.75rem)</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="space-y-2">
        <Label>Font Weight</Label>
        <Select defaultValue="normal">
          <SelectTrigger>
            <SelectValue placeholder="Select font weight" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="thin">Thin (100)</SelectItem>
            <SelectItem value="extralight">Extra Light (200)</SelectItem>
            <SelectItem value="light">Light (300)</SelectItem>
            <SelectItem value="normal">Normal (400)</SelectItem>
            <SelectItem value="medium">Medium (500)</SelectItem>
            <SelectItem value="semibold">Semibold (600)</SelectItem>
            <SelectItem value="bold">Bold (700)</SelectItem>
            <SelectItem value="extrabold">Extra Bold (800)</SelectItem>
            <SelectItem value="black">Black (900)</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="space-y-2">
        <Label>Line Height</Label>
        <Slider defaultValue={[1.5]} max={3} min={1} step={0.1} />
        <div className="text-xs text-muted-foreground">1.5</div>
      </div>

      <div className="space-y-2">
        <Label>Letter Spacing</Label>
        <Select defaultValue="normal">
          <SelectTrigger>
            <SelectValue placeholder="Select letter spacing" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="tighter">Tighter</SelectItem>
            <SelectItem value="tight">Tight</SelectItem>
            <SelectItem value="normal">Normal</SelectItem>
            <SelectItem value="wide">Wide</SelectItem>
            <SelectItem value="wider">Wider</SelectItem>
            <SelectItem value="widest">Widest</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="space-y-2">
        <Label>Text Color</Label>
        <div className="flex gap-2">
          <Input type="color" className="w-16 h-9" defaultValue="#000000" />
          <Input type="text" placeholder="#000000" defaultValue="#000000" />
        </div>
      </div>
    </div>
  );
}

