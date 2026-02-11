import React, { useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { updateStore, useStore } from '@/lib/store';
import { generateStrategy } from '@/lib/gemini';
import StrategyRoadmap from '@/components/strategy/StrategyRoadmap';
import { toast } from 'sonner';

const Strategy = () => {
  const strategy = useStore((state) => state.strategy || null);
  const answers = useStore((state) => state.answers || {});
  const apiKey = useStore((state) => state.apiKey || '');
  const currentTier = useStore((state) => state.brandLevel?.level || state.userTier || 'Seed');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const tierKey = typeof currentTier === 'string' ? currentTier.toLowerCase() : null;
  const activeAnswers = tierKey && answers?.[tierKey] ? answers[tierKey] : answers;
  const brandName = activeAnswers.company_name || answers.company_name || 'your brand';
  const insightCount = useMemo(() => {
    return Object.values(activeAnswers || {}).filter((value) => {
      if (typeof value === 'string') return value.trim().length > 0;
      return value !== null && value !== undefined;
    }).length;
  }, [activeAnswers]);

  const handleGenerate = async () => {
    setLoading(true);
    setError('');
    try {
      const result = await generateStrategy(apiKey, brandName, answers, currentTier);
      updateStore({ strategy: result });
      toast.success("Strategy Generated Successfully!");
    } catch (err) {
      console.error(err);
      setError(err.message || "Failed to generate strategy.");
      toast.error("Generation Failed");
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[50vh] space-y-4">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
        <p className="text-lg text-slate-600">Immersify AI is crafting your strategy...</p>
      </div>
    );
  }

  if (!strategy) {
    return (
      <div className="max-w-3xl mx-auto py-12 px-4">
        <Card className="border-slate-200">
          <CardHeader>
            <CardTitle className="text-2xl text-indigo-900">Ready to Generate</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-slate-600">
              We have collected {insightCount} insights about {brandName}.
            </p>
            {error ? <div className="text-sm text-red-600">{error}</div> : null}
            <div className="flex flex-wrap gap-3">
              <Button onClick={handleGenerate} disabled={!apiKey || insightCount === 0}>
                Generate Strategy
              </Button>
              {!apiKey && (
                <Link to="/settings" className="text-sm text-indigo-600 hover:underline">
                  Add API key in Settings
                </Link>
              )}
              {insightCount === 0 && (
                <Link to="/questionnaire" className="text-sm text-indigo-600 hover:underline">
                  Complete the Questionnaire
                </Link>
              )}
            </div>
          </CardContent>
        </Card>
        <div className="mt-10">
          <StrategyRoadmap />
        </div>
      </div>
    );
  }

  const pillars = Object.entries(strategy.pillars || {});

  return (
    <div className="max-w-5xl mx-auto py-8 px-4 space-y-8">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold text-slate-900">Strategy</h1>
        <div className="flex gap-3">
          <Button variant="outline" onClick={() => window.print()}>Print to PDF</Button>
          <Button onClick={handleGenerate}>Regenerate</Button>
        </div>
      </div>

      <Card className="bg-gradient-to-br from-indigo-600 to-purple-600 text-white border-none">
        <CardHeader>
          <CardTitle className="text-xl">Creative Idea</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-lg font-medium">{strategy.creative_idea || 'No creative idea returned.'}</p>
        </CardContent>
      </Card>

      <Card className="bg-white border-slate-200">
        <CardHeader>
          <CardTitle className="text-lg text-slate-900">Executive Summary</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-slate-600 leading-relaxed">{strategy.analysis || 'No analysis returned.'}</p>
        </CardContent>
      </Card>

      <div className="grid md:grid-cols-2 gap-6">
        {pillars.map(([pillarKey, pillar]) => {
          const score = Math.max(0, Math.min(100, Number(pillar.score) || 0));
          const label = pillarKey.replace(/_/g, ' ').replace(/\b\w/g, (c) => c.toUpperCase());
          return (
            <Card key={pillarKey} className="border-slate-200">
              <CardHeader>
                <CardTitle className="text-lg text-indigo-900">{label}</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="h-2 w-full rounded-full bg-slate-100 overflow-hidden">
                  <div className="h-full bg-indigo-600" style={{ width: `${score}%` }} />
                </div>
                <div className="text-sm text-slate-500">{score}%</div>
                <p className="text-slate-600">{pillar.advice || 'No advice returned.'}</p>
              </CardContent>
            </Card>
          );
        })}
      </div>
      <StrategyRoadmap />
    </div>
  );
};

export default Strategy;
