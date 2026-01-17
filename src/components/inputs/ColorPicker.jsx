import React, { useState } from 'react';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Plus, X } from 'lucide-react';

const presetColors = [
  '#FF6B6B', '#4ECDC4', '#45B7D1', '#96CEB4', '#FFEAA7', '#DDA0DD',
  '#F39C12', '#E74C3C', '#9B59B6', '#3498DB', '#1ABC9C', '#2ECC71',
  '#34495E', '#95A5A6', '#E91E63', '#673AB7', '#FF5722', '#607D8B'
];

export default function ColorPicker({ label, colors = [], onChange, maxColors = 4 }) {
  const [showInput, setShowInput] = useState(false);
  const [customColor, setCustomColor] = useState('#000000');

  const addColor = (color) => {
    if (colors.length < maxColors && !colors.includes(color)) {
      onChange([...colors, color]);
    }
    setShowInput(false);
  };

  const removeColor = (colorToRemove) => {
    onChange(colors.filter(c => c !== colorToRemove));
  };

  return (
    <div className="space-y-3">
      <Label className="text-base font-medium">{label}</Label>

      <div className="flex flex-wrap gap-2">
        {colors.map((color, idx) => (
          <div key={idx} className="relative group">
            <div 
              className="w-12 h-12 rounded-lg border-2 border-white shadow-md ring-1 ring-slate-200"
              style={{ backgroundColor: color }}
            />
            <button
              onClick={() => removeColor(color)}
              className="absolute -top-1 -right-1 bg-red-500 text-white rounded-full p-0.5 opacity-0 group-hover:opacity-100 transition-opacity shadow-sm"
            >
              <X className="w-3 h-3" />
            </button>
            <span className="block text-[10px] text-center text-slate-500 mt-1 font-mono">{color}</span>
          </div>
        ))}

        {colors.length < maxColors && (
          <button
            onClick={() => setShowInput(true)}
            className="w-12 h-12 rounded-lg border-2 border-dashed border-slate-300 flex items-center justify-center hover:border-primary hover:bg-orange-50 transition-colors bg-white"
          >
            <Plus className="w-5 h-5 text-slate-400" />
          </button>
        )}
      </div>

      {showInput && (
        <div className="p-4 bg-slate-50 rounded-lg border space-y-3 animate-in fade-in zoom-in-95">
          <div className="flex items-center gap-3">
            <input
              type="color"
              value={customColor}
              onChange={(e) => setCustomColor(e.target.value)}
              className="w-10 h-10 cursor-pointer rounded border-0 p-0"
            />
            <Input
              value={customColor}
              onChange={(e) => setCustomColor(e.target.value)}
              placeholder="#000000"
              className="w-28 font-mono uppercase"
            />
            <Button size="sm" onClick={() => addColor(customColor)}>
              Add
            </Button>
            <Button size="sm" variant="outline" onClick={() => setShowInput(false)}>
              Cancel
            </Button>
          </div>

          <div>
            <p className="text-xs text-slate-500 mb-2">Presets:</p>
            <div className="flex flex-wrap gap-1">
              {presetColors.map((color) => (
                <button
                  key={color}
                  onClick={() => addColor(color)}
                  className="w-6 h-6 rounded-md border hover:scale-110 transition-transform ring-offset-1 focus:ring-2"
                  style={{ backgroundColor: color }}
                  disabled={colors.includes(color)}
                />
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}