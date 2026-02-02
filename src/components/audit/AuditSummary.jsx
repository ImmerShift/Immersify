import React, { useMemo } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useStore } from '@/lib/store';
import { generateAuditSummary } from '@/lib/utils';
import ReportGenerator from '@/components/reports/ReportGenerator';

const PillarRadar = ({ scores }) => {
  const labels = [
    'Brand Core',
    'Visual Identity',
    'Product Experience',
    'Market Plan',
    'Technology',
    'Brand Activation',
    'Team Branding',
    'Security & Trust'
  ];
  const values = [
    scores.brand_core,
    scores.visual_identity,
    scores.product_experience,
    scores.market_plan,
    scores.technology,
    scores.brand_activation,
    scores.team_branding,
    scores.security_trust
  ];
  const size = 280;
  const center = size / 2;
  const radius = 100;
  const angleStep = (Math.PI * 2) / values.length;
  const toPoint = (value, index, scale = 1) => {
    const angle = angleStep * index - Math.PI / 2;
    const r = (value / 100) * radius * scale;
    const x = center + Math.cos(angle) * r;
    const y = center + Math.sin(angle) * r;
    return `${x},${y}`;
  };
  const polygonPoints = values.map((v, i) => toPoint(v, i)).join(' ');
  const ringScales = [0.25, 0.5, 0.75, 1];

  return (
    <div className="flex flex-col items-center gap-3">
      <svg width={size} height={size} className="text-slate-200">
        {ringScales.map((scale) => (
          <polygon
            key={scale}
            points={values.map((_, i) => toPoint(100, i, scale)).join(' ')}
            fill="none"
            stroke="currentColor"
            strokeWidth="1"
          />
        ))}
        {values.map((_, i) => (
          <line
            key={`axis-${i}`}
            x1={center}
            y1={center}
            x2={toPoint(100, i).split(',')[0]}
            y2={toPoint(100, i).split(',')[1]}
            stroke="currentColor"
            strokeWidth="1"
          />
        ))}
        <polygon points={polygonPoints} fill="rgba(79, 70, 229, 0.25)" stroke="rgba(79, 70, 229, 0.8)" strokeWidth="2" />
      </svg>
      <div className="grid grid-cols-2 gap-x-6 gap-y-1 text-xs text-slate-500">
        {labels.map((label) => (
          <span key={label}>{label}</span>
        ))}
      </div>
    </div>
  );
};

const AuditSummary = () => {
  const answers = useStore((state) => state.answers);
  const ratings = useStore((state) => state.ratings);
  const brandLevel = useStore((state) => state.brandLevel);
  const summary = useMemo(() => generateAuditSummary(answers, ratings, brandLevel), [answers, ratings, brandLevel]);

  return (
    <div className="max-w-6xl mx-auto py-10 px-4 space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-slate-900">Executive Audit Summary</h1>
        <ReportGenerator />
      </div>

      <div className="grid md:grid-cols-3 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Current Tier</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-black text-indigo-900">{summary.currentTier}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Overall Brand Health</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-black text-slate-900">{summary.overallScore}%</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Next Milestone</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-semibold text-slate-800">{summary.nextMilestone}</div>
          </CardContent>
        </Card>
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Immersive Synergy</CardTitle>
          </CardHeader>
          <CardContent>
            <PillarRadar scores={summary.pillarScores} />
          </CardContent>
        </Card>
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>{summary.bottleneck.severity}</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-sm font-semibold text-red-600">{summary.bottleneck.label}</div>
              <div className="text-sm text-slate-600">Score: {summary.bottleneck.score}%</div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle>Advisor’s Truth</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="rounded-lg bg-slate-900 text-slate-50 p-4 text-sm leading-relaxed">
                {summary.advisorMirror}
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle>ImmerShift Recommendation</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-sm text-slate-700">{summary.recommendation}</div>
              <div className="mt-3 text-xs text-slate-500">{summary.synergy.verdict}</div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default AuditSummary;
