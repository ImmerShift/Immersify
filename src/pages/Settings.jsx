import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { getStore, clearStore, rollbackLastLevelChange } from '@/lib/store';
import { GoogleGenerativeAI } from "@google/generative-ai";
import { Loader2, CheckCircle2, XCircle, Trash2 } from 'lucide-react';
import { toast } from 'sonner';

const Settings = () => {
  const [status, setStatus] = useState('idle'); // idle, testing, success, error
  const [message, setMessage] = useState('');

  const handleReset = () => {
    if (confirm("Are you sure? This will delete all saved project data and reset the app.")) {
      clearStore();
      toast.success("App data has been reset.");
      window.location.reload();
    }
  };

  const handleRollbackLevel = () => {
    const result = rollbackLastLevelChange();
    if (result.success) {
      const label = result.brandLevel?.level ? ` to ${result.brandLevel.level}` : '';
      toast.success(`Brand level rolled back${label}.`);
      window.location.reload();
      return;
    }
    toast.error(result.message);
  };

  const testConnection = async () => {
    setStatus('testing');
    setMessage('Testing connection to Gemini AI...');
    
    try {
      const store = getStore();
      const apiKey = store.apiKey;
      
      if (!apiKey) {
        throw new Error("API Key not found in environment variables.");
      }

      const genAI = new GoogleGenerativeAI(apiKey);
      const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" }); // Updated to 2.5
      
      const result = await model.generateContent("Test connection. Reply with 'OK'.");
      const response = result.response.text();
      
      if (response) {
        setStatus('success');
        setMessage('Connection Successful! AI is ready.');
        toast.success("AI Connection Verified");
      }
    } catch (error) {
      console.error(error);
      setStatus('error');
      setMessage(`Connection Failed: ${error.message}`);
      toast.error("AI Connection Failed");
    }
  };

  return (
    <div className="max-w-2xl mx-auto py-12 px-4">
      <h1 className="text-2xl font-bold text-slate-900 mb-6">System Settings</h1>
      
      <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
        <h2 className="text-lg font-semibold text-slate-800 mb-4">AI Connectivity Diagnostics</h2>
        <p className="text-slate-500 mb-6">
          Use this tool to verify that the application can securely connect to the Google Gemini API.
        </p>

        <div className="flex items-center gap-4 mb-6">
          <Button 
            onClick={testConnection} 
            disabled={status === 'testing'}
            className={status === 'error' ? 'bg-red-600 hover:bg-red-700' : 'bg-indigo-600 hover:bg-indigo-700'}
          >
            {status === 'testing' ? (
              <>
                <Loader2 className="w-4 h-4 mr-2 animate-spin" /> Testing...
              </>
            ) : (
              'Run Connection Test'
            )}
          </Button>

          {status === 'success' && (
            <div className="flex items-center text-green-600 font-medium animate-in fade-in">
              <CheckCircle2 className="w-5 h-5 mr-2" /> Connected
            </div>
          )}
          
          {status === 'error' && (
            <div className="flex items-center text-red-600 font-medium animate-in fade-in">
              <XCircle className="w-5 h-5 mr-2" /> Error
            </div>
          )}
        </div>

        {message && (
          <div className={`p-4 rounded-lg text-sm font-mono whitespace-pre-wrap ${
            status === 'error' ? 'bg-red-50 text-red-700 border border-red-100' : 
            status === 'success' ? 'bg-green-50 text-green-700 border border-green-100' : 
            'bg-slate-50 text-slate-600'
          }`}>
            {message}
          </div>
        )}
      </div>
      <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm mt-6">
        <h2 className="text-lg font-semibold text-slate-800 mb-4">Brand Level Controls</h2>
        <p className="text-slate-500 mb-6">
          Roll back the latest brand level adjustment if an assessment was incorrect.
        </p>
        <Button variant="outline" onClick={handleRollbackLevel}>
          Rollback Last Level Change
        </Button>
      </div>
      <div className="bg-white p-6 rounded-xl border border-red-100 shadow-sm mt-6">
        <h2 className="text-lg font-semibold text-red-700 mb-4">Danger Zone</h2>
        <p className="text-slate-500 mb-6">
          If you are seeing incorrect project data (e.g., "Kopi Mellow") or want to start fresh, use this button to clear all local data.
        </p>
        <Button 
          variant="destructive" 
          onClick={handleReset}
          className="flex items-center gap-2"
        >
          <Trash2 className="w-4 h-4" /> Reset App Data
        </Button>
      </div>
    </div>
  );
};

export default Settings;