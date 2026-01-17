import React from 'react';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { Card, CardContent } from '@/components/ui/card';
import QuestionField from '../QuestionField';

export default function ProductExperienceSection({ tier, responses, onChange }) {
  return (
    <Card className="border-none shadow-none bg-transparent">
      <CardContent className="p-0">
        <Accordion type="single" collapsible className="space-y-4" defaultValue="core_offering">

          <AccordionItem value="core_offering" className="border rounded-lg bg-white px-4">
            <AccordionTrigger className="text-lg font-semibold hover:no-underline py-4">Core Offering</AccordionTrigger>
            <AccordionContent className="space-y-6 pt-2 pb-6">
              <QuestionField
                label="Describe your core product or service in detail"
                tier={tier} targetTier="Seed"
                value={responses.core_offering?.description || ''}
                onChange={(val) => onChange('core_offering', 'description', val)}
                rating={responses.core_offering?.description_rating}
                onRatingChange={(val) => onChange('core_offering', 'description_rating', val)}
                fieldKey="core_offering.description"
                enableAIFeedback={true}
              />
              <QuestionField
                label="What is your pricing model?"
                tier={tier} targetTier="Seed"
                value={responses.core_offering?.pricing || ''}
                onChange={(val) => onChange('core_offering', 'pricing', val)}
                rating={responses.core_offering?.pricing_rating}
                onRatingChange={(val) => onChange('core_offering', 'pricing_rating', val)}
              />
            </AccordionContent>
          </AccordionItem>

          <AccordionItem value="customer_journey" className="border rounded-lg bg-white px-4">
            <AccordionTrigger className="text-lg font-semibold hover:no-underline py-4">Customer Journey</AccordionTrigger>
            <AccordionContent className="space-y-6 pt-2 pb-6">
              <QuestionField
                label="Map out your typical customer journey (awareness to post-purchase)"
                tier={tier} targetTier="Sprout"
                value={responses.customer_journey?.journey_map || ''}
                onChange={(val) => onChange('customer_journey', 'journey_map', val)}
                rating={responses.customer_journey?.journey_map_rating}
                onRatingChange={(val) => onChange('customer_journey', 'journey_map_rating', val)}
                fieldKey="customer_journey.journey_map"
                enableAIFeedback={true}
              />
            </AccordionContent>
          </AccordionItem>

        </Accordion>
      </CardContent>
    </Card>
  );
}