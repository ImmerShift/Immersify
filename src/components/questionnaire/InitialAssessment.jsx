import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Sparkles, ChevronRight, ArrowRight } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const questions = [
  {
    id: 'operational_length',
    question: 'How long has your business been operational?',
    options: [
      { value: 'A', label: 'Just an idea / Less than 6 months', tier: 'Seed' },
      { value: 'B', label: '6 months - 2 years', tier: 'Sprout' },
      { value: 'C', label: '2-5 years', tier: 'Star' },
      { value: 'D', label: '5+ years', tier: 'Superbrand' },
    ],
  },
  {
    id: 'market_presence',
    question: 'What best describes your current market presence?',
    options: [
      { value: 'A', label: 'Local / Single location', tier: 'Seed' },
      { value: 'B', label: 'Regional / Multiple locations', tier: 'Sprout' },
      { value: 'C', label: 'National', tier: 'Star' },
      { value: 'D', label: 'International / Global', tier: 'Superbrand' },
    ],
  },
  {
    id: 'team_size',
    question: 'How large is your team?',
    options: [
      { value: 'A', label: 'Solo founder / 1-5 people', tier: 'Seed' },
      { value: 'B', label: '6-20 people', tier: 'Sprout' },
      { value: 'C', label: '21-100 people', tier: 'Star' },
      { value: 'D', label: '100+ people', tier: 'Superbrand' },
    ],
  },
  {
    id: 'brand_documentation',
    question: 'How would you describe your brand documentation?',
    options: [
      { value: 'A', label: 'No formal documentation', tier: 'Seed' },
      { value: 'B', label: 'Basic guidelines exist', tier: 'Sprout' },
      { value: 'C', label: 'Comprehensive brand book', tier: 'Star' },
      { value: 'D', label: 'Full brand system with enforcement', tier: 'Superbrand' },
    ],
  },
  {
    id: 'customer_base',
    question: 'What is your customer base size?',
    options: [
      { value: 'A', label: 'Under 100 customers', tier: 'Seed' },
      { value: 'B', label: '100-1,000 customers', tier: 'Sprout' },
      { value: 'C', label: '1,000-10,000 customers', tier: 'Star' },
      { value: 'D', label: '10,000+ customers', tier: 'Superbrand' },
    ],
  },
];

const tierInfo = {
  Seed: { emoji: '🌱', title: 'Seed Stage', description: "You're at the beginning. Focus on core purpose.", color: 'bg-green-500' },
  Sprout: { emoji: '🌿', title: 'Sprout Stage', description: "Growing! Time to refine visual identity.", color: 'bg-blue-500' },
  Star: { emoji: '⭐', title: 'Star Brand', description: "Scaling up. Focus on consistency.", color: 'bg-purple-500' },
  Superbrand: { emoji: '🏆', title: 'Superbrand', description: "Elite status. Focus on legacy.", color: 'bg-orange-500' },
};

export default function InitialAssessment({ onComplete }) {
  const [step, setStep] = useState('welcome');
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState({});
  const [calculatedTier, setCalculatedTier] = useState(null);

  const handleNext = () => {
    if (currentQuestion < questions.length - 1) {
      setCurrentQuestion(currentQuestion + 1);
    } else {
      const tierScores = { Seed: 0, Sprout: 0, Star: 0, Superbrand: 0 };
      Object.entries(answers).forEach(([qId, ans]) => {
        const q = questions.find(q => q.id === qId);
        const opt = q.options.find(o => o.value === ans);
        if (opt) tierScores[opt.tier]++;
      });
      const max = Math.max(...Object.values(tierScores));
      setCalculatedTier(Object.keys(tierScores).find(k => tierScores[k] === max));
      setStep('result');
    }
  };

  const currentQ = questions[currentQuestion];
  const tierData = calculatedTier ? tierInfo[calculatedTier] : null;

  if (step === 'welcome') {
    return (
      <div className="max-w-2xl mx-auto text-center py-12">
        <div className="bg-white rounded-xl shadow-lg p-8">
          <div className="w-20 h-20 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-6">
            <Sparkles className="w-10 h-10 text-primary" />
          </div>
          <h1 className="text-3xl font-bold mb-4">Welcome to Immersify! 👋</h1>
          <p className="text-muted-foreground mb-8">Let's discover your brand's current stage with 5 quick questions.</p>
          <Button onClick={() => setStep('questions')} size="lg" className="w-full">
            Start Assessment <ArrowRight className="ml-2 w-4 h-4" />
          </Button>
        </div>
      </div>
    );
  }

  if (step === 'result' && tierData) {
    return (
      <div className="max-w-2xl mx-auto text-center py-12">
        <div className="bg-white rounded-xl shadow-lg p-8">
          <div className="text-6xl mb-4">{tierData.emoji}</div>
          <h1 className="text-3xl font-bold mb-2">You are a {tierData.title}!</h1>
          <p className="text-lg text-muted-foreground mb-8">{tierData.description}</p>
          <Button onClick={() => onComplete(answers, calculatedTier)} size="lg" className="w-full">
            Start Brand Audit <ArrowRight className="ml-2 w-4 h-4" />
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto py-8">
      <Card>
        <CardHeader>
          <div className="text-sm text-muted-foreground mb-2">Question {currentQuestion + 1} of {questions.length}</div>
          <CardTitle>{currentQ.question}</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          {currentQ.options.map((opt) => (
            <button
              key={opt.value}
              onClick={() => setAnswers({...answers, [currentQ.id]: opt.value})}
              className={`w-full p-4 text-left border rounded-lg transition-all ${
                answers[currentQ.id] === opt.value 
                  ? 'border-primary bg-primary/5 ring-1 ring-primary' 
                  : 'hover:bg-slate-50'
              }`}
            >
              {opt.label}
            </button>
          ))}
          <div className="pt-6 flex justify-end">
            <Button onClick={handleNext} disabled={!answers[currentQ.id]}>
              Next <ChevronRight className="ml-2 w-4 h-4" />
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}