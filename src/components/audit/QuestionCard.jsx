import React, { useEffect, useRef, useState } from 'react';
import * as RadioGroupPrimitive from "@radix-ui/react-radio-group";
import { Image as ImageIcon, Loader2, Sparkles } from "lucide-react";
import { Textarea } from '@/components/ui/textarea';
import { Input } from '@/components/ui/input';
import { cn, getQuestionAccess } from '@/lib/utils';
import { setAnswer, setRating, updateStore, useStore } from '@/lib/store';
import { getTieredMentorship } from '@/lib/gemini';
import { mockWorkbookSubmit } from '@/lib/mockWorkbook';

const RadioGroup = React.forwardRef(({ className, ...props }, ref) => (
  <RadioGroupPrimitive.Root className={cn("flex gap-4", className)} {...props} ref={ref} />
));
RadioGroup.displayName = RadioGroupPrimitive.Root.displayName;
const RadioGroupItem = React.forwardRef(({ className, ...props }, ref) => (
  <RadioGroupPrimitive.Item ref={ref} className={cn("aspect-square h-5 w-5 rounded-full border border-slate-300 text-indigo-600 ring-offset-white focus:outline-none focus-visible:ring-2 focus-visible:ring-indigo-600 disabled:cursor-not-allowed disabled:opacity-50 data-[state=checked]:border-indigo-600 data-[state=checked]:text-indigo-600", className)} {...props}>
    <RadioGroupPrimitive.Indicator className="flex items-center justify-center">
      <span className="h-3 w-3 rounded-full bg-indigo-600" />
    </RadioGroupPrimitive.Indicator>
  </RadioGroupPrimitive.Item>
));
RadioGroupItem.displayName = RadioGroupPrimitive.Item.displayName;

const QuestionCard = ({ question, userTier }) => {
  const answers = useStore((state) => state.answers || {});
  const ratings = useStore((state) => state.ratings || {});
  const mentorFeedback = useStore((state) => state.mentorFeedback || {});
  const gamification = useStore((state) => state.gamification || {});
  const apiKey = useStore((state) => state.apiKey || '');
  const currentTier = useStore((state) => state.brandLevel?.level || state.userTier || userTier || 'Seed');
  const access = getQuestionAccess(question.tier, currentTier);
  const locked = access.isLocked;
  const disabledClass = locked ? "opacity-60 cursor-not-allowed" : "";
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const debounceRef = useRef(null);
  const savedFeedback = mentorFeedback[question.id];
  const isAdvanced = currentTier === 'Star' || currentTier === 'Superbrand';

  const handleTextChange = (value) => {
    setAnswer(question.id, value);
  };

  const handleRatingChange = (value) => {
    setRating(question.id, value);
  };

  const handleColorChange = (value) => {
    setAnswer(question.id, value);
  };

  const handleFileUpload = (event) => {
    const file = event.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (e) => {
      setAnswer(question.id, e.target?.result);
    };
    reader.readAsDataURL(file);
  };

  const renderInput = () => {
    switch (question.type) {
      case 'textarea':
        return (
          <Textarea
            value={answers[question.id] || ''}
            onChange={(e) => handleTextChange(e.target.value)}
            placeholder={question.placeholder}
            readOnly={locked}
            disabled={locked}
            className={cn("min-h-[120px] bg-white border-slate-300 focus:border-indigo-500", disabledClass)}
          />
        );
      case 'text':
        return (
          <Input
            value={answers[question.id] || ''}
            onChange={(e) => handleTextChange(e.target.value)}
            placeholder={question.placeholder}
            readOnly={locked}
            disabled={locked}
            className={cn("bg-white border-slate-300 focus:border-indigo-500", disabledClass)}
          />
        );
      case 'color':
        return (
          <div className="flex gap-3 items-center">
            <div className={cn("relative w-16 h-16 rounded-md border-2 border-slate-200 overflow-hidden shadow-sm", disabledClass)}>
              <input
                type="color"
                value={answers[question.id] || '#ffffff'}
                onChange={(e) => handleColorChange(e.target.value)}
                disabled={locked}
                className={cn("absolute inset-0 w-[150%] h-[150%] -top-[25%] -left-[25%] p-0 border-0", locked ? "cursor-not-allowed" : "cursor-pointer")}
              />
            </div>
            <span className="text-sm font-mono bg-slate-100 px-2 py-1 rounded text-slate-600 border border-slate-200">
              {answers[question.id] || '#ffffff'}
            </span>
          </div>
        );
      case 'upload':
        return (
          <label
            htmlFor={`upload-${question.id}`}
            className={cn("border-2 border-dashed border-slate-300 rounded-lg p-6 flex flex-col items-center justify-center text-center transition-colors bg-white group relative overflow-hidden", locked ? "cursor-not-allowed opacity-60" : "cursor-pointer hover:bg-slate-100")}
          >
            <input
              id={`upload-${question.id}`}
              type="file"
              className="hidden"
              accept="image/*"
              disabled={locked}
              onChange={handleFileUpload}
            />
            {answers[question.id] ? (
              <div className="absolute inset-0 flex items-center justify-center bg-white">
                <img src={answers[question.id]} alt="Uploaded" className="max-h-full max-w-full object-contain p-2" />
              </div>
            ) : (
              <>
                <div className="bg-slate-100 p-3 rounded-full mb-3 transition-colors group-hover:bg-indigo-50">
                  <ImageIcon className="w-6 h-6 text-slate-400 group-hover:text-indigo-500" />
                </div>
                <span className="text-sm font-medium text-slate-700">Click to upload</span>
                <span className="text-xs text-slate-400 mt-1">PNG, JPG, SVG</span>
              </>
            )}
          </label>
        );
      case 'rating':
        return null;
      default:
        return null;
    }
  };

  useEffect(() => {
    if (locked) return;
    if (question.type !== 'text' && question.type !== 'textarea') return;
    const value = answers[question.id];
    if (typeof value !== 'string') return;
    const trimmed = value.trim();
    if (trimmed.length <= 40) return;
    if (savedFeedback?.sourceText === trimmed) return;

    if (debounceRef.current) clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(async () => {
      setIsAnalyzing(true);
      try {
        const mockResult = mockWorkbookSubmit({ question, answerText: trimmed, tierContext: currentTier });
        const result = apiKey ? await getTieredMentorship(question, trimmed, currentTier) : mockResult.ai_feedback;
        const nextFeedback = {
          ...result,
          sourceText: trimmed
        };
        updateStore({
          mentorFeedback: {
            ...mentorFeedback,
            [question.id]: nextFeedback
          },
          ...(apiKey
            ? {}
            : {
                gamification: {
                  ...gamification,
                  current_xp: (gamification.current_xp || 0) + (mockResult.gamification?.xp_awarded || 0)
                }
              })
        });
      } finally {
        setIsAnalyzing(false);
      }
    }, 2500);

    return () => {
      if (debounceRef.current) clearTimeout(debounceRef.current);
    };
  }, [answers[question.id], apiKey, locked, savedFeedback, question, currentTier, mentorFeedback]);

  const strengthScore = typeof savedFeedback?.strengthScore === 'number' ? savedFeedback.strengthScore : null;
  const strengthColor =
    strengthScore === null ? 'border-l-slate-200' :
      strengthScore <= 4 ? 'border-l-amber-400' :
        strengthScore <= 7 ? 'border-l-blue-400' : 'border-l-emerald-400';
  const strengthText =
    strengthScore === null ? 'text-slate-400' :
      strengthScore <= 4 ? 'text-amber-600' :
        strengthScore <= 7 ? 'text-blue-600' : 'text-emerald-600';

  return (
    <div className={cn("mb-8 p-4 border", isAdvanced ? "rounded-md bg-white border-slate-200" : "rounded-xl bg-slate-50 border-slate-100")}>
      <div className="flex justify-between items-start mb-2">
        <div>
          <label className="text-base font-semibold text-slate-900 block mb-1">{question.label}</label>
          {question.subLabel ? <div className="text-sm text-slate-500">{question.subLabel}</div> : null}
        </div>
        {locked ? (
          <span className="inline-flex items-center rounded-sm bg-slate-200 px-2 py-1 text-xs font-bold text-slate-700 uppercase tracking-wide">Locked</span>
        ) : null}
      </div>

      {question.type !== 'rating' && (
        <div className={access.blurAmount}>
          {renderInput()}
        </div>
      )}

      {(question.type === 'text' || question.type === 'textarea') && (
        <div className={cn("mt-4 border-l-4 p-4", access.blurAmount, strengthColor, isAdvanced ? "rounded-md bg-slate-50" : "rounded-xl bg-gradient-to-r from-slate-50 to-white")}>
          {isAnalyzing ? (
            <div className="flex items-center gap-2 text-sm text-indigo-600">
              <Loader2 className="w-4 h-4 animate-spin" />
              <span>
                {currentTier === 'Superbrand' ? 'Board of Directors is reviewing...' :
                  currentTier === 'Star' ? 'Growth architects are reviewing...' :
                  currentTier === 'Sprout' ? 'Alignment team is reviewing...' :
                  'Foundations coach is reviewing...'}
              </span>
            </div>
          ) : savedFeedback ? (
            <div className="space-y-3">
              <div className="flex items-center gap-2 text-indigo-700 font-semibold">
                <Sparkles className="w-4 h-4" />
                <span>AI Mentor Insight</span>
              </div>
              <div className="text-sm text-slate-700">
                <span className="font-semibold">Concept:</span> {savedFeedback.concept}
              </div>
              <div className="text-sm text-slate-700">
                <span className="font-semibold">Critique:</span> {savedFeedback.critique}
              </div>
              <div className="text-sm text-slate-700">
                <span className="font-semibold">Pro-Tip:</span> {savedFeedback.proTip}
              </div>
              <div className={cn("text-sm font-semibold", strengthText)}>
                Strength Score: {savedFeedback.strengthScore}/10
              </div>
            </div>
          ) : (
            <div className="text-sm text-slate-400">AI Mentor Insight will appear after a longer response.</div>
          )}
        </div>
      )}

      <div className={cn("mt-4 pt-4 border-t border-slate-200", locked ? "opacity-60 pointer-events-none" : "", access.blurAmount)}>
        <label className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2 block">Self Assessment</label>
        <RadioGroup
          onValueChange={handleRatingChange}
          value={ratings[question.id]}
          className="flex flex-wrap gap-4"
          disabled={locked}
        >
          {['N/A', 'Poor', 'Good', 'Excellent'].map((opt) => (
            <div key={opt} className="flex items-center space-x-2">
              <RadioGroupItem value={opt} id={`${question.id}-${opt}`} />
              <label htmlFor={`${question.id}-${opt}`} className="text-sm text-slate-600 cursor-pointer">{opt}</label>
            </div>
          ))}
        </RadioGroup>
      </div>
    </div>
  );
};

export default QuestionCard;
