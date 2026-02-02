import React, { useMemo } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useStore } from '@/lib/store';
import { generateStrategicRoadmap } from '@/lib/utils';

const badgeStyles = {
  Critical: 'bg-red-100 text-red-700',
  Strategic: 'bg-amber-100 text-amber-700',
  Growth: 'bg-emerald-100 text-emerald-700'
};

const StrategyRoadmap = () => {
  const answers = useStore((state) => state.answers || {});
  const ratings = useStore((state) => state.ratings || {});
  const brandLevel = useStore((state) => state.brandLevel || null);
  const roadmap = useMemo(() => generateStrategicRoadmap(answers, ratings, brandLevel), [answers, ratings, brandLevel]);

  return (
    <div className="space-y-6">
      <Card className="border-slate-200 bg-slate-900 text-slate-50">
        <CardHeader>
          <CardTitle className="text-lg">Word from the Board</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-slate-200">{roadmap.boardNote}</p>
        </CardContent>
      </Card>

      <div className="grid md:grid-cols-3 gap-6">
        {roadmap.phases.map((phase) => (
          <Card key={phase.title} className="border-slate-200">
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="text-base text-slate-900">{phase.title}</CardTitle>
                <span className={`text-xs font-bold px-2 py-1 rounded ${badgeStyles[phase.badge] || 'bg-slate-100 text-slate-700'}`}>
                  {phase.badge}
                </span>
              </div>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="text-sm font-semibold text-indigo-900">{phase.pillar}</div>
              <div className="text-sm text-slate-600">{phase.action}</div>
              <div className="text-xs text-slate-500">{phase.realityCheck}</div>
            </CardContent>
          </Card>
        ))}
      </div>

      <Card className="border-slate-200">
        <CardHeader>
          <CardTitle className="text-lg text-slate-900">Day 90 Success Metric</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-slate-700">{roadmap.successMetric}</p>
        </CardContent>
      </Card>
    </div>
  );
};

export default StrategyRoadmap;
