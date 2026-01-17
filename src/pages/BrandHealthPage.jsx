import React, { useState, useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import { api } from '@/api/client';
import Layout from '@/components/Layout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Loader2, RefreshCw, Target, Eye, Package, MessageSquare, BarChart3, Cpu, CheckCircle, AlertCircle, Lightbulb } from 'lucide-react';

const pillarConfig = {
  brand_core_identity: { name: 'Brand Core', icon: Target, color: 'text-orange-500' },
  visual_identity: { name: 'Visual', icon: Eye, color: 'text-purple-500' },
  product_experience: { name: 'Product', icon: Package, color: 'text-blue-500' },
  verbal_identity: { name: 'Verbal', icon: MessageSquare, color: 'text-green-500' },
  market_plan: { name: 'Market', icon: BarChart3, color: 'text-pink-500' },
  technology: { name: 'Tech', icon: Cpu, color: 'text-cyan-500' }
};

export default function BrandHealthPage() {
  const [analysis, setAnalysis] = useState(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);

  const { data: questionnaires } = useQuery({
    queryKey: ['questionnaires'],
    queryFn: api.questionnaire.get
  });

  const questionnaire = questionnaires?.[0];

  const runAnalysis = async () => {
    if (!questionnaire) return;
    setIsAnalyzing(true);
    try {
      // Send the WHOLE questionnaire to the AI
      const result = await api.ai.invoke({
        prompt: `Brand Maturity Tier Analysis. Context: ${JSON.stringify(questionnaire)}`
      });
      setAnalysis(result);
    } catch (e) {
      console.error(e);
    } finally {
      setIsAnalyzing(false);
    }
  };

  // Auto-run if no analysis yet
  useEffect(() => {
    if (questionnaire && !analysis && !isAnalyzing) {
      runAnalysis();
    }
  }, [questionnaire]);

  if (!questionnaire) return <Layout><div>Please complete the audit first.</div></Layout>;

  return (
    <Layout>
      <div className="space-y-8">
        <div className="flex justify-between items-center">
          <h1 className="text-3xl font-bold">Brand Health Report</h1>
          <Button onClick={runAnalysis} disabled={isAnalyzing}>
            <RefreshCw className={`w-4 h-4 mr-2 ${isAnalyzing ? 'animate-spin' : ''}`} />
            {isAnalyzing ? 'Analyzing...' : 'Re-analyze'}
          </Button>
        </div>

        {analysis ? (
          <>
            {/* Score Card */}
            <Card className="bg-gradient-to-br from-orange-50 to-white border-primary/20">
              <CardContent className="p-8 flex flex-col md:flex-row gap-8 items-center">
                <div className="text-center relative">
                  <div className="text-5xl font-bold text-slate-900">{analysis.overall_score}</div>
                  <div className="text-sm text-slate-500 uppercase tracking-wider font-semibold">Health Score</div>
                </div>
                <div className="flex-1 border-l pl-8">
                  <h3 className="text-xl font-semibold mb-2">Executive Summary</h3>
                  <p className="text-slate-600 leading-relaxed">{analysis.overall_summary}</p>
                </div>
              </CardContent>
            </Card>

            {/* Pillars */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {Object.entries(pillarConfig).map(([key, config]) => {
                const pData = analysis.pillar_scores?.[key] || { score: 0, status: 'N/A' };
                const Icon = config.icon;
                return (
                  <Card key={key} className="hover:shadow-md transition-shadow">
                    <CardHeader className="flex flex-row items-center justify-between pb-2">
                      <CardTitle className="text-sm font-medium text-slate-500">{config.name}</CardTitle>
                      <Icon className={`w-4 h-4 ${config.color}`} />
                    </CardHeader>
                    <CardContent>
                      <div className="text-2xl font-bold">{pData.score}%</div>
                      <Progress value={pData.score} className="mt-2 h-2" />
                      <p className="text-xs text-slate-500 mt-2">{pData.key_insight}</p>
                    </CardContent>
                  </Card>
                );
              })}
            </div>

            {/* Insights */}
            <Tabs defaultValue="strengths">
              <TabsList className="w-full">
                <TabsTrigger value="strengths" className="flex-1">Strengths</TabsTrigger>
                <TabsTrigger value="weaknesses" className="flex-1">Weaknesses</TabsTrigger>
                <TabsTrigger value="wins" className="flex-1">Quick Wins</TabsTrigger>
              </TabsList>
              <div className="mt-4">
                <TabsContent value="strengths">
                  <Card><CardContent className="pt-6 space-y-2">
                    {analysis.strengths?.map((s, i) => (
                      <div key={i} className="flex gap-2"><CheckCircle className="w-5 h-5 text-green-500 shrink-0"/>{s}</div>
                    ))}
                  </CardContent></Card>
                </TabsContent>
                <TabsContent value="weaknesses">
                  <Card><CardContent className="pt-6 space-y-2">
                    {analysis.weaknesses?.map((s, i) => (
                      <div key={i} className="flex gap-2"><AlertCircle className="w-5 h-5 text-red-500 shrink-0"/>{s}</div>
                    ))}
                  </CardContent></Card>
                </TabsContent>
                <TabsContent value="wins">
                  <Card><CardContent className="pt-6 space-y-2">
                    {analysis.quick_wins?.map((s, i) => (
                      <div key={i} className="flex gap-2"><Lightbulb className="w-5 h-5 text-yellow-500 shrink-0"/>{s}</div>
                    ))}
                  </CardContent></Card>
                </TabsContent>
              </div>
            </Tabs>
          </>
        ) : (
          <div className="text-center py-12 text-slate-500">
            {isAnalyzing ? "AI Strategist is reviewing your audit..." : "Click Analyze to get your report."}
          </div>
        )}
      </div>
    </Layout>
  );
}