import React, { useMemo } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Activity, TrendingUp } from 'lucide-react';
import { calculateBrandHealth } from '@/utils/scoring';
import { useStore as useQuestionnaireStore } from '@/lib/store';

const tierStyles = {
  seed: {
    label: 'Seed',
    text: 'text-green-600',
    track: 'bg-green-100',
    bar: 'bg-green-500'
  },
  sprout: {
    label: 'Sprout',
    text: 'text-teal-600',
    track: 'bg-teal-100',
    bar: 'bg-teal-500'
  },
  star: {
    label: 'Star',
    text: 'text-purple-600',
    track: 'bg-purple-100',
    bar: 'bg-purple-500'
  },
  superbrand: {
    label: 'Superbrand',
    text: 'text-slate-900',
    track: 'bg-slate-900',
    bar: 'bg-amber-400'
  }
};

const BrandHealth = () => {
  const answersRaw = useQuestionnaireStore((state: any) => state.answers) as Record<string, any> | null;
  const answers = answersRaw || {};
  const { globalScore, breakdown } = useMemo(() => calculateBrandHealth(answers), [answers]);

  return (
    <div className="max-w-5xl mx-auto py-8 px-4 animate-in fade-in duration-500 space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-slate-900 flex items-center gap-3">
            <Activity className="h-8 w-8 text-indigo-600" />
            Brand Health Dashboard
          </h1>
          <p className="text-slate-500 mt-1">Completion-based scoring across all tiers</p>
        </div>
      </div>

      <Card className="border-indigo-100 bg-indigo-50/30">
        <CardHeader>
          <CardTitle>Global Brand Health</CardTitle>
        </CardHeader>
        <CardContent className="flex items-center justify-between">
          <div className="space-y-2">
            <span className="text-5xl font-black text-indigo-700">
              {globalScore}%
            </span>
            <p className="text-sm text-slate-500">Cumulative score across unlocked tiers</p>
          </div>
          <div className="h-28 w-28 rounded-full border-8 border-slate-200 flex items-center justify-center relative">
            <div className="absolute inset-0 rounded-full border-8 border-indigo-600" style={{ clipPath: `inset(${100 - globalScore}% 0 0 0)` }}></div>
            <TrendingUp className="h-8 w-8 text-indigo-600" />
          </div>
        </CardContent>
      </Card>

      <div className="grid md:grid-cols-2 gap-6">
        {(Object.keys(tierStyles) as Array<keyof typeof tierStyles>).map((tierKey) => {
          const score = breakdown[tierKey];
          const style = tierStyles[tierKey];
          return (
            <Card key={tierKey} className="border-slate-200">
              <CardHeader className="pb-2">
                <div className="flex items-center justify-between">
                  <CardTitle className={`text-base font-semibold ${style.text}`}>{style.label}</CardTitle>
                  <span className="text-sm font-bold text-slate-700">{score}%</span>
                </div>
              </CardHeader>
              <CardContent>
                <div className={`h-2 w-full rounded-full ${style.track}`}>
                  <div className={`h-2 rounded-full ${style.bar}`} style={{ width: `${score}%` }} />
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>
    </div>
  );
};

export default BrandHealth;
