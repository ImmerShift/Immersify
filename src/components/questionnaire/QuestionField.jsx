import React from 'react';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';
import AIFeedback from './AIFeedback';
import { Lightbulb } from 'lucide-react';

const tierOrder = ['Seed', 'Sprout', 'Star', 'Superbrand'];

const ratingLabels = {
  0: 'Not Applicable',
  1: 'Needs Major Improvement',
  2: 'Good',
  3: 'Excellent',
};

export default function QuestionField({ 
  label, 
  tier, 
  targetTier, 
  value, 
  onChange, 
  rating, 
  onRatingChange, 
  placeholder, 
  fieldKey, 
  tips = [],
  enableAIFeedback = false 
}) {
  const isRelevant = tierOrder.indexOf(tier) >= tierOrder.indexOf(targetTier);
  const isHighlighted = tier === targetTier;

  return (
    <div className={cn(
      "p-0 rounded-lg border transition-all overflow-hidden",
      isHighlighted ? "border-orange-200" : "border-border",
      !isRelevant && "opacity-60 grayscale"
    )}>
      <div className={cn(
        "p-4 flex items-start justify-between bg-white",
        isHighlighted && "bg-orange-50/10"
      )}>
        <Label className="text-base font-semibold text-slate-900 flex-1">{label}</Label>
        {isHighlighted && (
          <Badge variant="secondary" className="ml-2 bg-orange-500 text-white hover:bg-orange-600 border-none rounded px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider">
            Recommended for {targetTier}
          </Badge>
        )}
      </div>

      <div className="px-4 pb-4 bg-white">
        <Textarea
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder || "Enter your response..."}
          className="min-h-[120px] bg-orange-50/30 border-orange-100 focus-visible:ring-orange-200 resize-none"
        />

        {tips.length > 0 && (
          <div className="mt-4 p-4 bg-blue-50/30 rounded-md border border-blue-50">
            <div className="flex items-center gap-2 mb-2 text-slate-600">
              <Lightbulb className="w-4 h-4" />
              <span className="text-xs font-semibold">Tips to get started:</span>
            </div>
            <ul className="space-y-1">
              {tips.map((tip, i) => (
                <li key={i} className="text-xs text-slate-500 flex items-start gap-2">
                  <span className="mt-1.5 w-1 h-1 rounded-full bg-slate-300 shrink-0" />
                  {tip}
                </li>
              ))}
            </ul>
          </div>
        )}

        {enableAIFeedback && fieldKey && (
          <AIFeedback 
            fieldKey={fieldKey} 
            value={value} 
            onChange={onChange}
          />
        )}

        <div className="mt-6 flex flex-col gap-3">
          <Label className="text-xs font-medium text-slate-500 uppercase tracking-tight">Rate your current state:</Label>
          <RadioGroup
            value={rating?.toString()}
            onValueChange={(val) => onRatingChange(parseInt(val))}
            className="flex flex-wrap gap-x-6 gap-y-2"
          >
            {Object.entries(ratingLabels).map(([val, label]) => (
              <div key={val} className="flex items-center space-x-2">
                <RadioGroupItem value={val} id={`${fieldKey}-${val}`} className="border-slate-300 text-orange-500 focus:ring-orange-500" />
                <Label 
                  htmlFor={`${fieldKey}-${val}`} 
                  className="text-xs cursor-pointer font-medium text-slate-700"
                >
                  {label}
                </Label>
              </div>
            ))}
          </RadioGroup>
        </div>
      </div>
    </div>
  );
}
