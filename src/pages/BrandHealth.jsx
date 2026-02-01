import React, { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Progress } from "@/components/ui/progress";
import { getStore } from '@/lib/store';
import { SECTIONS } from '@/lib/constants';
import { Activity, TrendingUp, AlertCircle, CheckCircle2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';

const BrandHealth = () => {
  const navigate = useNavigate();
  const [healthData, setHealthData] = useState({
    overallScore: 0,
    sections: {}
  });
  const [brandLevel, setBrandLevel] = useState(null);

  useEffect(() => {
    const store = getStore();
    setBrandLevel(store.brandLevel || null);
    const answers = store.answers || {};
    
    let totalQuestions = 0;
    let answeredQuestions = 0;
    const sectionScores = {};

    Object.keys(SECTIONS).forEach(sectionKey => {
      let sectionTotal = 0;
      let sectionAnswered = 0;
      
      SECTIONS[sectionKey].forEach(q => {
        sectionTotal++;
        const value = answers[q.id];
        if (typeof value === 'string' && value.trim() !== '') {
          sectionAnswered++;
        } else if (value && typeof value !== 'string') {
          sectionAnswered++;
        }
      });

      sectionScores[sectionKey] = Math.round((sectionAnswered / sectionTotal) * 100) || 0;
      totalQuestions += sectionTotal;
      answeredQuestions += sectionAnswered;
    });

    const overallScore = Math.round((answeredQuestions / totalQuestions) * 100) || 0;

    setHealthData({
      overallScore,
      sections: sectionScores
    });
  }, []);

  const getHealthStatus = (score) => {
    if (score >= 80) return { label: 'Excellent', color: 'text-green-600', bg: 'bg-green-100' };
    if (score >= 50) return { label: 'Good', color: 'text-blue-600', bg: 'bg-blue-100' };
    if (score >= 20) return { label: 'Fair', color: 'text-orange-600', bg: 'bg-orange-100' };
    return { label: 'Needs Attention', color: 'text-red-600', bg: 'bg-red-100' };
  };

  const status = getHealthStatus(healthData.overallScore);

  return (
    <div className="max-w-5xl mx-auto py-8 px-4 animate-in fade-in duration-500">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold text-slate-900 flex items-center gap-3">
            <Activity className="h-8 w-8 text-indigo-600" />
            Brand Health Dashboard
          </h1>
          <p className="text-slate-500 mt-1">Real-time analysis of your brand's completeness and strength</p>
          {brandLevel && (
            <div className="mt-2 inline-flex items-center rounded-full bg-indigo-100 px-3 py-1 text-xs font-bold uppercase tracking-wide text-indigo-700">
              Maturity: {brandLevel.level}
            </div>
          )}
        </div>
        <Button onClick={() => navigate('/questionnaire')}>
          Update Audit
        </Button>
      </div>

      <div className="grid md:grid-cols-3 gap-6 mb-8">
        {/* Overall Score Card */}
        <Card className="md:col-span-2 border-indigo-100 bg-indigo-50/30">
          <CardHeader>
            <CardTitle>Overall Brand Health Score</CardTitle>
            <CardDescription>Based on audit completeness and AI analysis</CardDescription>
          </CardHeader>
          <CardContent className="flex items-center justify-between">
            <div className="space-y-2">
              <span className={`text-5xl font-black ${status.color}`}>
                {healthData.overallScore}%
              </span>
              <div className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-bold ${status.bg} ${status.color}`}>
                {status.label}
              </div>
            </div>
            <div className="h-24 w-24 rounded-full border-8 border-slate-200 flex items-center justify-center relative">
               <div className="absolute inset-0 rounded-full border-8 border-indigo-600" style={{ clipPath: `inset(${100 - healthData.overallScore}% 0 0 0)` }}></div>
               <TrendingUp className="h-8 w-8 text-indigo-600" />
            </div>
          </CardContent>
        </Card>

        {/* Action Item Card */}
        <Card>
          <CardHeader>
            <CardTitle className="text-sm uppercase tracking-wide text-slate-500">Next Action</CardTitle>
          </CardHeader>
          <CardContent>
            {healthData.overallScore < 100 ? (
              <div className="text-center py-4">
                <AlertCircle className="h-8 w-8 text-orange-500 mx-auto mb-2" />
                <p className="font-medium text-slate-900">Complete your Audit</p>
                <p className="text-sm text-slate-500 mt-1">Fill out more sections to improve your score.</p>
              </div>
            ) : (
              <div className="text-center py-4">
                <CheckCircle2 className="h-8 w-8 text-green-500 mx-auto mb-2" />
                <p className="font-medium text-slate-900">Ready for Strategy</p>
                <p className="text-sm text-slate-500 mt-1">Your brand data is complete.</p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        {Object.entries(healthData.sections).map(([key, score]) => (
          <Card key={key}>
            <CardHeader className="pb-2">
              <div className="flex justify-between items-center">
                <CardTitle className="capitalize">{key.replace('_', ' ')}</CardTitle>
                <span className="font-bold text-slate-700">{score}%</span>
              </div>
            </CardHeader>
            <CardContent>
              <Progress value={score} className="h-2" />
              <p className="text-xs text-slate-400 mt-2 text-right">
                {score === 100 ? 'Complete' : 'In Progress'}
              </p>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default BrandHealth;
