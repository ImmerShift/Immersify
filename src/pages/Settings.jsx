import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { getStore, updateStore } from '@/lib/store';
import { toast } from 'sonner';

const Settings = () => {
  const [apiKey, setApiKey] = useState('');

  useEffect(() => {
    const store = getStore();
    if (store.apiKey) setApiKey(store.apiKey);
  }, []);

  const handleSave = () => {
    updateStore({ apiKey });
    toast.success("API Key saved successfully!");
  };

  return (
    <div className="max-w-md mx-auto py-12">
      <Card>
        <CardHeader>
          <CardTitle>AI Configuration</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="apiKey">Gemini API Key</Label>
            <Input 
              id="apiKey" 
              type="password" 
              placeholder="Enter your Google Gemini API Key" 
              value={apiKey}
              onChange={(e) => setApiKey(e.target.value)}
            />
            <p className="text-xs text-slate-500">
              Your key is stored locally in your browser and never sent to our servers.
              <br />
              <a href="https://aistudio.google.com/app/apikey" target="_blank" rel="noreferrer" className="text-indigo-600 underline">
                Get a free API key here
              </a>
            </p>
          </div>
          <Button onClick={handleSave} className="w-full">Save Configuration</Button>
        </CardContent>
      </Card>
    </div>
  );
};

export default Settings;
