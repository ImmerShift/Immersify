import React, { useState, useEffect } from 'react';
import { api } from '@/api/client'; // Using your local API
import { Sparkles, AlertCircle, CheckCircle, Lightbulb, Loader2 } from 'lucide-react';
import { cn } from '@/lib/utils';

// Prompt Database
const feedbackPrompts = {
  // Brand Core
  'golden_circle.why_response': {
    context: "brand's WHY/purpose beyond profit",
    prompts: ["What inspired you to start this?", "What change do you want to see?"]
  },
  'golden_circle.how_response': {
    context: "brand's unique approach (HOW)",
    prompts: ["What makes your process different?", "What is your secret sauce?"]
  },
  'golden_circle.what_response': {
    context: "products/services offered (WHAT)",
    prompts: ["List your main offerings", "What problems do they solve?"]
  },
  'purpose_promise.mission': {
    context: "mission statement",
    prompts: ["Who do you serve?", "What do you do daily?"]
  },
  'purpose_promise.vision': {
    context: "vision statement",
    prompts: ["Where will you be in 10 years?"]
  },
  'values.core_values': {
    context: "core values",
    prompts: ["What principles guide your decisions?"]
  },
  'positioning.target_audience': {
    context: "target audience",
    prompts: ["Describe their demographics & psychographics."]
  },
  'positioning.uvp': {
    context: "unique value proposition",
    prompts: ["Why should they buy from you instead of competitors?"]
  },
  // Verbal
  'messaging.tagline': {
    context: "tagline",
    prompts: ["Make it memorable.", "Keep it short."]
  }
};

export default function AIFeedback({ fieldKey, value, onChange }) {
  const [feedback, setFeedback] = useState(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [lastAnalyzedValue, setLastAnalyzedValue] = useState('');

  const config = feedbackPrompts[fieldKey] || { context: "this field", prompts: [] };

  useEffect(() => {
    const timer = setTimeout(() => {
      // Debounce: Analyze only after user stops typing for 1.5s
      if (value && value.length > 15 && value !== lastAnalyzedValue) {
        analyzeInput();
      } else if (!value || value.length < 15) {
        setFeedback(null);
      }
    }, 1500);

    return () => clearTimeout(timer);
  }, [value]);

  const analyzeInput = async () => {
    setIsAnalyzing(true);
    try {
      // Calls your new Replit Backend
      // The backend parses this string to extract context and value
      const result = await api.ai.invoke({
        prompt: `Analyze this user input for their ${config.context}. User's response: "${value}"`
      });

      setFeedback(result);
      setLastAnalyzedValue(value);
    } catch (error) {
      console.error('AI feedback error:', error);
    } finally {
      setIsAnalyzing(false);
    }
  };

  if (!value || value.length < 15) {
    return (
      <div className="mt-2 p-3 bg-slate-50 rounded-lg border border-slate-200">
        <div className="flex items-start gap-2 text-slate-500 text-xs">
          <Lightbulb className="w-4 h-4 mt-0.5 flex-shrink-0" />
          <div>
            <p className="font-medium">Tips:</p>
            <ul className="mt-1 space-y-1 list-disc list-inside">
              {config.prompts.map((prompt, idx) => (
                <li key={idx}>{prompt}</li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    );
  }

  if (isAnalyzing) {
    return (
      <div className="mt-2 p-3 bg-orange-50 rounded-lg border border-orange-200">
        <div className="flex items-center gap-2 text-primary text-xs font-medium">
          <Loader2 className="w-3 h-3 animate-spin" />
          <span>Immersify AI is analyzing...</span>
        </div>
      </div>
    );
  }

  if (!feedback) return null;

  const qualityConfig = {
    poor: { color: 'bg-red-50 border-red-200', icon: AlertCircle, iconColor: 'text-red-500' },
    fair: { color: 'bg-yellow-50 border-yellow-200', icon: AlertCircle, iconColor: 'text-yellow-600' },
    good: { color: 'bg-blue-50 border-blue-200', icon: CheckCircle, iconColor: 'text-blue-500' },
    excellent: { color: 'bg-green-50 border-green-200', icon: CheckCircle, iconColor: 'text-green-500' },
  };

  const qc = qualityConfig[feedback.quality] || qualityConfig.fair;
  const Icon = qc.icon;

  return (
    <div className={cn("mt-2 p-3 rounded-lg border animate-in slide-in-from-top-2", qc.color)}>
      <div className="flex items-start gap-2">
        <Sparkles className="w-4 h-4 mt-0.5 text-primary flex-shrink-0" />
        <div className="flex-1 text-sm">
          <div className="flex items-center gap-2 mb-1">
            <Icon className={cn("w-3 h-3", qc.iconColor)} />
            <span className="font-semibold capitalize text-slate-900">{feedback.quality} Response</span>
          </div>

          {feedback.praise && (
            <p className="text-green-700 mb-2 text-xs italic">"{feedback.praise}"</p>
          )}

          {feedback.issues?.length > 0 && (
            <div className="mb-2">
              {feedback.issues.map((issue, idx) => (
                <p key={idx} className="text-slate-700 text-xs">⚠️ {issue}</p>
              ))}
            </div>
          )}

          {feedback.suggestions?.length > 0 && (
            <div className="mt-2 pt-2 border-t border-slate-200/50">
              <p className="font-medium text-slate-700 mb-1 text-xs">Try considering:</p>
              {feedback.suggestions.map((suggestion, idx) => (
                <p key={idx} className="text-slate-600 text-xs pl-2 border-l-2 border-primary/20 mb-1">{suggestion}</p>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}