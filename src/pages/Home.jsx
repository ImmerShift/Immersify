import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

const Home = () => {
  return (
    <div className="flex flex-col items-center justify-center py-12 space-y-8 text-center">
      <h1 className="text-4xl font-extrabold tracking-tight lg:text-5xl text-indigo-900">
        Build Your Immersive Brand Experience
      </h1>
      <p className="text-xl text-slate-600 max-w-2xl">
        Immersify uses AI to transform your business vision into a complete, 9-pillar brand strategy. 
        From visual identity to community engagement, we've got you covered.
      </p>

      <div className="flex gap-4 mt-8">
        <Link to="/questionnaire">
          <Button size="lg" className="h-12 px-8 text-lg">Start Brand Audit</Button>
        </Link>
        <Link to="/settings">
          <Button variant="outline" size="lg" className="h-12 px-8 text-lg bg-white text-indigo-600 border-indigo-200 hover:bg-indigo-50">
            Configure AI
          </Button>
        </Link>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-16 w-full max-w-5xl">
        <Card>
          <CardHeader>
            <CardTitle>1. Audit</CardTitle>
          </CardHeader>
          <CardContent>
            Answer a few questions about your business goals and vision.
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>2. Generate</CardTitle>
          </CardHeader>
          <CardContent>
            Our AI engine analyzes your inputs against the 9 Pillars of IBE.
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>3. Strategize</CardTitle>
          </CardHeader>
          <CardContent>
            Get a comprehensive, actionable brand strategy report instantly.
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Home;
