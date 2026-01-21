import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
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
  Seed: {
    emoji: '🌱',
    title: 'Seed Stage Brand',
    description: "You're at the beginning of your brand journey. This is an exciting time to build strong foundations!",
    color: 'from-green-400 to-emerald-500',
    tips: ['Focus on defining your core purpose', 'Start documenting your brand basics', 'Build authentic connections']
  },
  Sprout: {
    emoji: '🌿',
    title: 'Sprouting Brand',
    description: "Your brand is growing! Now it's time to refine your identity and expand your presence.",
    color: 'from-blue-400 to-cyan-500',
    tips: ['Develop consistent visual identity', 'Create brand guidelines', 'Expand marketing channels']
  },
  Star: {
    emoji: '⭐',
    title: 'Rising Star Brand',
    description: "You've built something remarkable! Time to scale with consistency and strategic depth.",
    color: 'from-purple-400 to-violet-500',
    tips: ['Ensure brand consistency everywhere', 'Invest in brand storytelling', 'Build customer advocacy']
  },
  Superbrand: {
    emoji: '🏆',
    title: 'Superbrand Status',
    description: "You're among the elite! Focus on legacy, innovation, and maintaining excellence.",
    color: 'from-orange-400 to-amber-500',
    tips: ['Innovate while staying true to core', 'Lead industry conversations', 'Build lasting brand legacy']
  },
};

export default function InitialAssessment({ onComplete }) {
  const [step, setStep] = useState('welcome');
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState({});
  const [calculatedTier, setCalculatedTier] = useState(null);

  const handleStart = () => setStep('questions');

  const handleAnswer = (questionId, value) => {
    setAnswers({ ...answers, [questionId]: value });
  };

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
      const tier = Object.keys(tierScores).find(k => tierScores[k] === max);
      setCalculatedTier(tier);
      setStep('result');
    }
  };

  const currentQ = questions[currentQuestion];
  const currentAnswer = answers[currentQ?.id];
  const tierData = calculatedTier ? tierInfo[calculatedTier] : null;

  // 1. WELCOME SCREEN
  if (step === 'welcome') {
    return (
      <div className="max-w-2xl mx-auto text-center py-12 px-4">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
          <div className="mb-8">
            <div className="inline-flex items-center justify-center w-24 h-24 mb-6 rounded-full bg-gradient-to-br from-orange-500 to-pink-500 shadow-lg">
              <Sparkles className="w-12 h-12 text-white" />
            </div>
            <h1 className="text-4xl font-bold text-slate-900 mb-4">Welcome to Immersify!</h1>
            <p className="text-xl text-slate-600 mb-2">Brand Maturity Assessment</p>
            <p className="text-slate-500">Answer 5 quick questions to determine your brand's current tier</p>
          </div>

          <Card className="shadow-xl p-8 mb-8 border-none">
            <Button 
              onClick={handleStart}
              size="lg"
              className="w-full bg-gradient-to-r from-orange-500 to-pink-500 hover:from-orange-600 hover:to-pink-600 text-lg h-14 rounded-xl shadow-md transition-all hover:scale-[1.02]"
            >
              Start Assessment <ArrowRight className="ml-2 w-5 h-5" />
            </Button>
          </Card>
        </motion.div>
      </div>
    );
  }

  // 2. RESULT SCREEN
  if (step === 'result' && tierData) {
    return (
      <div className="max-w-2xl mx-auto text-center py-12 px-4">
        <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 0.5 }}>
          <div className="mb-8">
            <motion.div 
              initial={{ scale: 0 }} animate={{ scale: 1 }} 
              transition={{ delay: 0.2, type: 'spring', stiffness: 200 }}
              className={`inline-flex items-center justify-center w-32 h-32 mb-6 rounded-full bg-gradient-to-br ${tierData.color} shadow-2xl`}
            >
              <span className="text-6xl">{tierData.emoji}</span>
            </motion.div>
            <h1 className="text-4xl font-bold text-slate-900 mb-4">You're a {tierData.title}!</h1>
            <p className="text-xl text-slate-600 mb-6">{tierData.description}</p>
          </div>

          <Card className="shadow-xl p-8 mb-8 border-none bg-white">
            <h3 className="font-semibold text-slate-800 mb-4 text-left">Recommended Focus Areas:</h3>
            <ul className="space-y-3 text-left mb-8">
              {tierData.tips.map((tip, idx) => (
                <li key={idx} className="flex items-center gap-3">
                  <span className="w-6 h-6 bg-orange-100 text-orange-600 rounded-full flex items-center justify-center text-sm font-medium">{idx + 1}</span>
                  <span className="text-slate-700">{tip}</span>
                </li>
              ))}
            </ul>
            <Button 
              onClick={() => onComplete(answers, calculatedTier)}
              size="lg"
              className="w-full bg-gradient-to-r from-orange-500 to-pink-500 hover:from-orange-600 hover:to-pink-600 text-lg h-14 rounded-xl shadow-md transition-all hover:scale-[1.02]"
            >
              Start My Brand Audit <ArrowRight className="ml-2 w-5 h-5" />
            </Button>
          </Card>
        </motion.div>
      </div>
    );
  }

  // 3. QUESTIONS SCREEN (Matching your Screenshots)
  return (
    <div className="max-w-3xl mx-auto px-4 py-8">
      {/* Header Icon */}
      <div className="text-center mb-8">
        <div className="inline-flex items-center justify-center w-16 h-16 mb-4 rounded-full bg-gradient-to-br from-orange-500 to-pink-500 shadow-md">
          <Sparkles className="w-8 h-8 text-white" />
        </div>
        <h1 className="text-3xl font-bold text-slate-900">Brand Maturity Assessment</h1>
        <p className="text-slate-600 mt-2">Answer 5 quick questions to determine your brand's current tier</p>
      </div>

      {/* Progress Bar */}
      <div className="mb-8">
        <div className="flex justify-between text-sm text-slate-500 mb-2">
          <span>Progress</span>
          <span>{currentQuestion + 1} / 5</span>
        </div>
        <div className="h-2 bg-slate-100 rounded-full overflow-hidden">
          <motion.div 
            className="h-full bg-gradient-to-r from-orange-500 to-pink-500"
            initial={{ width: 0 }}
            animate={{ width: `${((currentQuestion + 1) / 5) * 100}%` }}
            transition={{ duration: 0.3 }}
          />
        </div>
      </div>

      {/* Question Card */}
      <Card className="shadow-xl border-none">
        <CardHeader className="pb-2">
          <CardTitle className="text-2xl font-bold">Question {currentQuestion + 1} of 5</CardTitle>
          <CardDescription className="text-lg text-slate-600 mt-1">{currentQ.question}</CardDescription>
        </CardHeader>
        <CardContent className="pt-6">
          <AnimatePresence mode="wait">
            <motion.div
              key={currentQuestion}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.2 }}
              className="space-y-3"
            >
              {currentQ.options.map((option) => {
                const isSelected = currentAnswer === option.value;
                return (
                  <button
                    key={option.value}
                    onClick={() => handleAnswer(currentQ.id, option.value)}
                    className={`w-full flex items-center p-4 border-2 rounded-xl transition-all text-left group ${
                      isSelected 
                        ? 'border-orange-500 bg-orange-50 shadow-sm' 
                        : 'border-slate-200 hover:border-orange-300 hover:bg-slate-50'
                    }`}
                  >
                    <div className={`w-5 h-5 rounded-full border-2 mr-4 flex items-center justify-center transition-colors ${
                      isSelected ? 'border-orange-500' : 'border-slate-300 group-hover:border-orange-300'
                    }`}>
                      {isSelected && <div className="w-2.5 h-2.5 rounded-full bg-orange-500" />}
                    </div>
                    <span className={`text-base font-medium ${isSelected ? 'text-slate-900' : 'text-slate-600'}`}>
                      {option.label}
                    </span>
                  </button>
                );
              })}
            </motion.div>
          </AnimatePresence>

          {/* Bottom Action (Only on last step for "See Results" or Auto-advance) */}
          <div className="mt-8 pt-4 flex justify-end">
            {currentQuestion === questions.length - 1 && (
              <Button
                onClick={handleNext}
                disabled={!currentAnswer}
                size="lg"
                className="bg-gradient-to-r from-orange-500 to-pink-500 hover:from-orange-600 hover:to-pink-600 text-white rounded-xl px-8"
              >
                See My Brand Tier <ChevronRight className="ml-2 w-5 h-5" />
              </Button>
            )}
            {/* Auto-advance logic handles intermediate steps, but we can add a manual Next button if preferred */}
            {currentQuestion < questions.length - 1 && (
               <Button
                onClick={handleNext}
                disabled={!currentAnswer}
                className="bg-slate-900 text-white hover:bg-slate-800"
              >
                Next <ChevronRight className="ml-2 w-4 h-4" />
              </Button>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}