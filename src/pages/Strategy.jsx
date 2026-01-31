import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { getStore, updateStore } from '@/lib/store';
import { generateStrategy } from '@/lib/gemini';
import { toast } from 'sonner';

const Strategy = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [strategy, setStrategy] = useState(null);
  const [store, setStore] = useState({});

  useEffect(() => {
    const currentStore = getStore();
    setStore(currentStore);

    if (currentStore.strategy) {
      setStrategy(currentStore.strategy);
    } else if (currentStore.answers && currentStore.apiKey) {
      // Auto-generate if not present but we have data
      handleGenerate(currentStore);
    } else {
      if (!currentStore.apiKey) {
        setError("Missing API Key. Please configure it in Settings.");
      } else if (!currentStore.answers || !currentStore.answers.company_name) {
        setError("No audit data found. Please complete the Questionnaire.");
      }
    }
  }, []);

  const handleGenerate = async (currentStore) => {
    setLoading(true);
    setError(null);
    try {
      const result = await generateStrategy(
        currentStore.apiKey,
        currentStore.answers.company_name,
        currentStore.answers,
        ['brand_core', 'visual', 'product', 'market', 'tech', 'brand_activation', 'team_branding', 'security_trust']
      );
      setStrategy(result);
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

  if (error) {
    return (
      <div className="max-w-md mx-auto py-12 text-center">
        <Card className="border-red-200 bg-red-50">
          <CardContent className="pt-6">
            <h3 className="text-lg font-semibold text-red-800 mb-2">Action Required</h3>
            <p className="text-red-600 mb-4">{error}</p>
            {error.includes("API Key") ? (
              <Link to="/settings"><Button variant="outline">Go to Settings</Button></Link>
            ) : (
              <Link to="/questionnaire"><Button>Go to Questionnaire</Button></Link>
            )}
          </CardContent>
        </Card>
      </div>
    );
  }

  if (!strategy) return null;

  return (
    <div className="max-w-4xl mx-auto py-8">
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-3xl font-bold">IBE Strategy Report</h1>
        <Button onClick={() => handleGenerate(store)} variant="outline">
          Regenerate
        </Button>
      </div>

      <div className="grid gap-8">
        {Object.entries(strategy).map(([key, section]) => {
           // Map keys to readable titles
           const titles = {
             brand_core: "Brand Core Story & Ideation",
             visual: "Visual Identity",
             product: "Product Experience",
             market: "Market Plan",
             tech: "Technology & Accessibility",
             brand_activation: "Brand Activation",
             team_branding: "Team Branding",
             security_trust: "Security & Trust"
           };
           
           return (
            <section key={key} className="space-y-4 animate-in fade-in slide-in-from-bottom-4 duration-500">
              <h2 className="text-2xl font-semibold text-indigo-700 border-b pb-2 flex items-center gap-2">
                {titles[key] || key}
              </h2>
              
              {/* Analysis */}
              <Card className="bg-slate-50 border-none">
                <CardContent className="pt-6">
                  <p className="text-slate-700 italic">"{section.analysis}"</p>
                </CardContent>
              </Card>

              <div className="grid md:grid-cols-2 gap-4">
                {/* Recommendations */}
                <Card>
                  <CardHeader><CardTitle className="text-lg text-indigo-900">Strategic Actions</CardTitle></CardHeader>
                  <CardContent>
                    <ul className="list-disc pl-5 space-y-2 text-slate-600">
                      {section.recommendations?.map((rec, i) => (
                        <li key={i}>{rec}</li>
                      ))}
                    </ul>
                  </CardContent>
                </Card>

                {/* Creative Idea */}
                <Card className="bg-gradient-to-br from-indigo-50 to-white border-indigo-100">
                  <CardHeader><CardTitle className="text-lg text-indigo-600">Creative Spark ✨</CardTitle></CardHeader>
                  <CardContent>
                    <p className="text-lg font-medium text-slate-800">{section.creative_idea}</p>
                  </CardContent>
                </Card>
              </div>
            </section>
           );
        })}
      </div>
    </div>
  );
};

export default Strategy;
