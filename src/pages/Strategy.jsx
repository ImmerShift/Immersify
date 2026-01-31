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
        ['brand_core', 'visual_identity', 'verbal_identity', 'digital_presence'] // Generating top 4 for demo
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
        {/* Brand Core */}
        {strategy.brand_core && (
          <section className="space-y-4">
            <h2 className="text-2xl font-semibold text-indigo-700 border-b pb-2">1. Brand Core</h2>
            <div className="grid md:grid-cols-2 gap-4">
              <Card>
                <CardHeader><CardTitle className="text-lg">Mission</CardTitle></CardHeader>
                <CardContent>{strategy.brand_core.mission || "N/A"}</CardContent>
              </Card>
              <Card>
                <CardHeader><CardTitle className="text-lg">Vision</CardTitle></CardHeader>
                <CardContent>{strategy.brand_core.vision || "N/A"}</CardContent>
              </Card>
              <Card className="md:col-span-2">
                <CardHeader><CardTitle className="text-lg">Core Values</CardTitle></CardHeader>
                <CardContent>
                  <ul className="list-disc pl-5 space-y-1">
                    {Array.isArray(strategy.brand_core.values) 
                      ? strategy.brand_core.values.map((v, i) => <li key={i}>{v}</li>)
                      : <li>{strategy.brand_core.values}</li>
                    }
                  </ul>
                </CardContent>
              </Card>
            </div>
          </section>
        )}

        {/* Visual Identity */}
        {strategy.visual_identity && (
          <section className="space-y-4">
            <h2 className="text-2xl font-semibold text-indigo-700 border-b pb-2">2. Visual Identity</h2>
            <Card>
              <CardContent className="pt-6 space-y-4">
                <div>
                  <h4 className="font-semibold">Logo Concept</h4>
                  <p className="text-slate-600">{strategy.visual_identity.logo_concept || strategy.visual_identity.logo_suggestion}</p>
                </div>
                <div>
                  <h4 className="font-semibold">Color Palette</h4>
                  <p className="text-slate-600">{strategy.visual_identity.color_palette || "N/A"}</p>
                </div>
                <div>
                  <h4 className="font-semibold">Typography</h4>
                  <p className="text-slate-600">{strategy.visual_identity.typography || "N/A"}</p>
                </div>
              </CardContent>
            </Card>
          </section>
        )}

        {/* Verbal Identity */}
        {strategy.verbal_identity && (
          <section className="space-y-4">
            <h2 className="text-2xl font-semibold text-indigo-700 border-b pb-2">3. Verbal Identity</h2>
            <Card>
              <CardContent className="pt-6 space-y-4">
                <div>
                  <h4 className="font-semibold">Tone of Voice</h4>
                  <p className="text-slate-600">{strategy.verbal_identity.tone_of_voice}</p>
                </div>
                <div>
                  <h4 className="font-semibold">Taglines</h4>
                  <ul className="list-disc pl-5 text-slate-600">
                    {Array.isArray(strategy.verbal_identity.taglines) 
                      ? strategy.verbal_identity.taglines.map((t, i) => <li key={i}>{t}</li>)
                      : <li>{strategy.verbal_identity.taglines}</li>
                    }
                  </ul>
                </div>
              </CardContent>
            </Card>
          </section>
        )}

         {/* Digital Presence */}
         {strategy.digital_presence && (
          <section className="space-y-4">
            <h2 className="text-2xl font-semibold text-indigo-700 border-b pb-2">4. Digital Presence</h2>
            <Card>
              <CardContent className="pt-6">
                <p className="text-slate-600 whitespace-pre-wrap">{JSON.stringify(strategy.digital_presence, null, 2).replace(/"|{|}/g, '')}</p>
              </CardContent>
            </Card>
          </section>
        )}
      </div>
    </div>
  );
};

export default Strategy;
