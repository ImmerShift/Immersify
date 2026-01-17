import React from 'react';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';
import AIFeedback from './AIFeedback';

const tierOrder = ['Seed', 'Sprout', 'Star', 'Superbrand'];

const ratingLabels = {
  0: 'N/A',
  1: 'Poor',
  2: 'Good',
  3: 'Great',
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
  enableAIFeedback = false 
}) {
  const isRelevant = tierOrder.indexOf(tier) >= tierOrder.indexOf(targetTier);
  const isHighlighted = tier === targetTier;

  return (
    <div className={cn(
      "p-4 rounded-lg border transition-all",
      isHighlighted ? "border-primary/40 bg-orange-50/30" : "border-border bg-card",
      !isRelevant && "opacity-60 grayscale"
    )}>
      <div className="flex items-start justify-between mb-3">
        <Label className="text-base font-medium flex-1">{label}</Label>
        {isHighlighted && (
          <Badge variant="secondary" className="ml-2 bg-orange-100 text-orange-700 hover:bg-orange-200">
            Recommended
          </Badge>
        )}
      </div>

      <Textarea
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder || "Enter your response..."}
        className="min-h-[100px] bg-white"
      />

      {enableAIFeedback && fieldKey && (
        <AIFeedback 
          fieldKey={fieldKey} 
          value={value} 
          onChange={onChange}
        />
      )}

      <div className="mt-4 flex items-center justify-between border-t pt-3">
        <Label className="text-xs text-muted-foreground">Self Rating:</Label>
        <RadioGroup
          value={rating?.toString()}
          onValueChange={(val) => onRatingChange(parseInt(val))}
          className="flex gap-4"
        >
          {Object.entries(ratingLabels).map(([val, label]) => (
            <div key={val} className="flex items-center space-x-1.5">
              <RadioGroupItem value={val} id={`${fieldKey}-${val}`} />
              <Label 
                htmlFor={`${fieldKey}-${val}`} 
                className="text-xs cursor-pointer font-normal"
              >
                {label}
              </Label>
            </div>
          ))}
        </RadioGroup>
      </div>
    </div>
  );
}