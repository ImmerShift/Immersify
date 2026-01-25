import React, { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Save, RefreshCcw, ChevronLeft, ChevronRight } from 'lucide-react';
import { api } from '@/api/client';
import { toast } from 'sonner';
import { useNavigate } from 'react-router-dom';
import { createPageUrl } from '@/utils/navigation';
import { cn } from '@/lib/utils';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";

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

const sections = [
  { id: 'brand_core', label: 'Brand Core' },
  { id: 'visual', label: 'Visual Identity' },
  { id: 'product', label: 'Product Experience' },
  { id: 'verbal', label: 'Verbal Identity' },
  { id: 'market', label: 'Market Plan' },
  { id: 'tech', label: 'Technology' },
];

export default function MainQuestionnaire({ questionnaire }) {
  const [activeTab, setActiveTab] = useState('brand_core');
  const [responses, setResponses] = useState(questionnaire?.responses || {});
  const [isSaving, setIsSaving] = useState(false);
  const navigate = useNavigate();
  const tier = questionnaire?.maturity_tier || 'Seed';
  const tierData = tierInfo[tier];

  const currentIndex = sections.findIndex(s => s.id === activeTab);

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

  const handleRetake = () => {
    navigate('/');
  };

  const handleNext = () => {
    if (currentIndex < sections.length - 1) {
      setActiveTab(sections[currentIndex + 1].id);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } else {
      handleSave(true);
    }
  };

  const handlePrevious = () => {
    if (currentIndex > 0) {
      setActiveTab(sections[currentIndex - 1].id);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  return (
    <div className="space-y-6 pb-20">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold text-slate-900">Brand Audit Questionnaire</h1>
          <div className="flex items-center gap-2 mt-2">
            <Badge className={cn("rounded px-2 py-0.5 border-none", tierData.color)}>
              {tierData.emoji} {tier} Tier
            </Badge>
            
            <AlertDialog>
              <AlertDialogTrigger asChild>
                <Button variant="outline" size="xs" className="h-7 text-[10px] font-semibold border-slate-200 px-3">
                  <RefreshCcw className="w-3 h-3 mr-1.5" /> Retake Assessment
                </Button>
              </AlertDialogTrigger>
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                  <AlertDialogDescription>
                    This will reset your current progress. You will need to redo the initial brand maturity assessment to get back here.
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel>Cancel</AlertDialogCancel>
                  <AlertDialogAction onClick={handleRetake} className="bg-orange-500 hover:bg-orange-600">
                    Yes, Retake Assessment
                  </AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
          </div>
          <p className="text-xs text-slate-500 mt-3 font-medium">Focus on foundational questions to build your brand core</p>
        </div>
        <div className="flex gap-2">
          <Button className="bg-slate-900 hover:bg-slate-800 text-white rounded-md px-6" onClick={() => handleSave(false)} disabled={isSaving}>
            <Save className="w-4 h-4 mr-2" /> Save Progress
          </Button>
        </div>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="w-full justify-start overflow-x-auto h-auto p-1 bg-white border">
          {sections.map(section => (
            <TabsTrigger key={section.id} value={section.id} className="whitespace-nowrap px-4">
              {section.label}
            </TabsTrigger>
          ))}
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

      {/* Navigation Buttons */}
      <div className="flex justify-between items-center mt-12 pt-6 border-t border-slate-100">
        <Button
          variant="ghost"
          onClick={handlePrevious}
          disabled={currentIndex === 0}
          className={cn("text-slate-600 font-medium", currentIndex === 0 && "opacity-0")}
        >
          <ChevronLeft className="w-4 h-4 mr-2" /> Previous: {currentIndex > 0 ? sections[currentIndex - 1].label : ''}
        </Button>
        <Button
          onClick={handleNext}
          className="bg-slate-900 hover:bg-slate-800 text-white rounded-md px-8 h-12"
        >
          {currentIndex === sections.length - 1 ? 'Complete Analysis' : `Next: ${sections[currentIndex + 1].label}`}
          <ChevronRight className="w-4 h-4 ml-2" />
        </Button>
      </div>
    </div>
  );
}
