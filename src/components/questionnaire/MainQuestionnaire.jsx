import React, { useState, useEffect } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Loader2, Save, TrendingUp } from 'lucide-react';
import { api } from '@/api/client';
import { toast } from 'sonner';
import { useNavigate } from 'react-router-dom';
import { createPageUrl } from '@/utils/navigation';

// Import Sections
import BrandCoreSection from './sections/BrandCoreSection';
import VisualIdentitySection from './sections/VisualIdentitySection';
import ProductExperienceSection from './sections/ProductExperienceSection';
import VerbalIdentitySection from './sections/VerbalIdentitySection';
import MarketPlanSection from './sections/MarketPlanSection';
import TechnologySection from './sections/TechnologySection';

const tierInfo = {
  Seed: { emoji: '🌱', color: 'bg-green-100 text-green-800' },
  Sprout: { emoji: '🌿', color: 'bg-blue-100 text-blue-800' },
  Star: { emoji: '⭐', color: 'bg-purple-100 text-purple-800' },
  Superbrand: { emoji: '🏆', color: 'bg-orange-100 text-orange-800' },
};

export default function MainQuestionnaire({ questionnaire }) {
  const [responses, setResponses] = useState(questionnaire?.responses || {});
  const [isSaving, setIsSaving] = useState(false);
  const navigate = useNavigate();
  const tier = questionnaire?.maturity_tier || 'Seed';
  const tierData = tierInfo[tier];

  // Auto-save logic could go here, for now we use manual save
  const handleResponseChange = (section, subsection, field, value) => {
    setResponses(prev => ({
      ...prev,
      [section]: {
        ...prev[section],
        [subsection]: {
          ...prev[section]?.[subsection],
          [field]: value
        }
      }
    }));
  };

  const handleSave = async (analyze = false) => {
    setIsSaving(true);
    try {
      await api.questionnaire.save({ 
        maturity_tier: tier,
        assessment_data: questionnaire.assessment_data,
        responses 
      });
      toast.success("Progress Saved!");

      if (analyze) {
        navigate(createPageUrl('BrandHealth'));
      }
    } catch (e) {
      toast.error("Save failed");
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold text-slate-900">Brand Audit Questionnaire</h1>
          <div className="flex items-center gap-2 mt-2">
            <Badge className={cn("rounded px-2 py-0.5 border-none", tierData.color)}>
              {tierData.emoji} {tier} Tier
            </Badge>
            <Button variant="outline" size="xs" className="h-7 text-[10px] font-semibold border-slate-200" onClick={() => navigate('/')}>
              <TrendingUp className="w-3 h-3 mr-1" /> Retake Assessment
            </Button>
          </div>
          <p className="text-xs text-slate-500 mt-3 font-medium">Focus on foundational questions to build your brand core</p>
        </div>
        <div className="flex gap-2">
          <Button className="bg-slate-900 hover:bg-slate-800 text-white rounded-md px-6" onClick={() => handleSave(false)} disabled={isSaving}>
            <Save className="w-4 h-4 mr-2" /> Save Progress
          </Button>
        </div>
      </div>

      <Tabs defaultValue="brand_core" className="w-full">
        <TabsList className="w-full justify-start overflow-x-auto h-auto p-1 bg-white border">
          <TabsTrigger value="brand_core">Brand Core</TabsTrigger>
          <TabsTrigger value="visual">Visual</TabsTrigger>
          <TabsTrigger value="product">Product</TabsTrigger>
          <TabsTrigger value="verbal">Verbal</TabsTrigger>
          <TabsTrigger value="market">Market</TabsTrigger>
          <TabsTrigger value="tech">Tech</TabsTrigger>
        </TabsList>

        <div className="mt-6">
          <TabsContent value="brand_core">
            <BrandCoreSection tier={tier} responses={responses.brand_core_identity || {}} onChange={(ss, f, v) => handleResponseChange('brand_core_identity', ss, f, v)} />
          </TabsContent>
          <TabsContent value="visual">
            <VisualIdentitySection tier={tier} responses={responses.visual_identity || {}} onChange={(ss, f, v) => handleResponseChange('visual_identity', ss, f, v)} />
          </TabsContent>
          <TabsContent value="product">
            <ProductExperienceSection tier={tier} responses={responses.product_experience || {}} onChange={(ss, f, v) => handleResponseChange('product_experience', ss, f, v)} />
          </TabsContent>
          <TabsContent value="verbal">
            <VerbalIdentitySection tier={tier} responses={responses.verbal_identity || {}} onChange={(ss, f, v) => handleResponseChange('verbal_identity', ss, f, v)} />
          </TabsContent>
          <TabsContent value="market">
            <MarketPlanSection tier={tier} responses={responses.market_plan || {}} onChange={(ss, f, v) => handleResponseChange('market_plan', ss, f, v)} />
          </TabsContent>
          <TabsContent value="tech">
            <TechnologySection tier={tier} responses={responses.technology || {}} onChange={(ss, f, v) => handleResponseChange('technology', ss, f, v)} />
          </TabsContent>
        </div>
      </Tabs>
    </div>
  );
}