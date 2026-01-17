import React from 'react';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { Card, CardContent } from '@/components/ui/card';
import QuestionField from '../QuestionField';

export default function TechnologySection({ tier, responses, onChange }) {
  return (
    <Card className="border-none shadow-none bg-transparent">
      <CardContent className="p-0">
        <Accordion type="single" collapsible className="space-y-4" defaultValue="digital_presence">

          <AccordionItem value="digital_presence" className="border rounded-lg bg-white px-4">
            <AccordionTrigger className="text-lg font-semibold hover:no-underline py-4">Digital Presence</AccordionTrigger>
            <AccordionContent className="space-y-6 pt-2 pb-6">
              <QuestionField
                label="Do you have a website? Describe functionality."
                tier={tier} targetTier="Seed"
                value={responses.digital_presence?.website || ''}
                onChange={(val) => onChange('digital_presence', 'website', val)}
                rating={responses.digital_presence?.website_rating}
                onRatingChange={(val) => onChange('digital_presence', 'website_rating', val)}
                fieldKey="digital_presence.website"
                enableAIFeedback={true}
              />
            </AccordionContent>
          </AccordionItem>

          <AccordionItem value="tech_stack" className="border rounded-lg bg-white px-4">
            <AccordionTrigger className="text-lg font-semibold hover:no-underline py-4">Tech Stack</AccordionTrigger>
            <AccordionContent className="space-y-6 pt-2 pb-6">
              <QuestionField
                label="What key tools do you use?"
                tier={tier} targetTier="Sprout"
                value={responses.tech_stack?.tools || ''}
                onChange={(val) => onChange('tech_stack', 'tools', val)}
                rating={responses.tech_stack?.tools_rating}
                onRatingChange={(val) => onChange('tech_stack', 'tools_rating', val)}
              />
            </AccordionContent>
          </AccordionItem>

        </Accordion>
      </CardContent>
    </Card>
  );
}