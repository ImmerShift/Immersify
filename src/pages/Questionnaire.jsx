import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { getStore, updateStore } from '@/lib/store';
import { toast } from 'sonner';

const Questionnaire = () => {
  const navigate = useNavigate();
  const [answers, setAnswers] = useState({
    company_name: '',
    industry: '',
    mission: '',
    target_audience: '',
    brand_maturity: 'Seed'
  });

  useEffect(() => {
    const store = getStore();
    if (store.answers) {
      setAnswers(prev => ({ ...prev, ...store.answers }));
    }
  }, []);

  const handleChange = (field, value) => {
    const newAnswers = { ...answers, [field]: value };
    setAnswers(newAnswers);
    updateStore({ answers: newAnswers });
  };

  const handleSubmit = () => {
    if (!answers.company_name) {
      toast.error("Please enter a company name.");
      return;
    }
    toast.success("Audit saved! Generating strategy...");
    navigate('/strategy');
  };

  return (
    <div className="max-w-2xl mx-auto py-8">
      <h1 className="text-3xl font-bold mb-6">Brand Core Audit</h1>
      <Card>
        <CardHeader>
          <CardTitle>Tell us about your brand</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          
          <div className="space-y-2">
            <Label>Company Name</Label>
            <Input 
              value={answers.company_name} 
              onChange={(e) => handleChange('company_name', e.target.value)}
              placeholder="e.g. Acme Corp"
            />
          </div>

          <div className="space-y-2">
            <Label>Industry / Category</Label>
            <Input 
              value={answers.industry} 
              onChange={(e) => handleChange('industry', e.target.value)}
              placeholder="e.g. Sustainable Fashion, SaaS, Coffee Shop"
            />
          </div>

          <div className="space-y-2">
            <Label>Mission / Vision (What do you do & Why?)</Label>
            <Textarea 
              value={answers.mission} 
              onChange={(e) => handleChange('mission', e.target.value)}
              placeholder="We help people..."
              className="h-24"
            />
          </div>

          <div className="space-y-2">
            <Label>Target Audience</Label>
            <Input 
              value={answers.target_audience} 
              onChange={(e) => handleChange('target_audience', e.target.value)}
              placeholder="e.g. Young professionals aged 25-35"
            />
          </div>

          <div className="pt-4">
            <Button onClick={handleSubmit} className="w-full text-lg h-12">
              Generate IBE Strategy &rarr;
            </Button>
          </div>

        </CardContent>
      </Card>
    </div>
  );
};

export default Questionnaire;
