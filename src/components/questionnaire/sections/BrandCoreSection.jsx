import React from 'react';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { Card, CardContent } from '@/components/ui/card';
import QuestionField from '../QuestionField';

export default function BrandCoreSection({ tier, responses, onChange }) {
  return (
    <Card className="border-none shadow-none bg-transparent">
      <CardContent className="p-0">
        <Accordion type="single" collapsible className="space-y-4" defaultValue="golden_circle">

          <AccordionItem value="golden_circle" className="border rounded-lg bg-white px-4">
            <AccordionTrigger className="text-lg font-semibold hover:no-underline py-4">
              The Golden Circle (Why, How, What)
            </AccordionTrigger>
            <AccordionContent className="space-y-6 pt-2 pb-6">
              <QuestionField
                label="Why does your brand exist? (Purpose beyond profit)"
                tier={tier} targetTier="Seed"
                value={responses.golden_circle?.why_response || ''}
                onChange={(val) => onChange('golden_circle', 'why_response', val)}
                rating={responses.golden_circle?.why_rating}
                onRatingChange={(val) => onChange('golden_circle', 'why_rating', val)}
                fieldKey="golden_circle.why_response"
                enableAIFeedback={true}
              />
              <QuestionField
                label="How do you do it? (Your unique approach)"
                tier={tier} targetTier="Seed"
                value={responses.golden_circle?.how_response || ''}
                onChange={(val) => onChange('golden_circle', 'how_response', val)}
                rating={responses.golden_circle?.how_rating}
                onRatingChange={(val) => onChange('golden_circle', 'how_rating', val)}
                fieldKey="golden_circle.how_response"
              />
              <QuestionField
                label="What do you offer? (Products/services)"
                tier={tier} targetTier="Seed"
                value={responses.golden_circle?.what_response || ''}
                onChange={(val) => onChange('golden_circle', 'what_response', val)}
                rating={responses.golden_circle?.what_rating}
                onRatingChange={(val) => onChange('golden_circle', 'what_rating', val)}
              />
            </AccordionContent>
          </AccordionItem>

          <AccordionItem value="values" className="border rounded-lg bg-white px-4">
            <AccordionTrigger className="text-lg font-semibold hover:no-underline py-4">
              Core Values
            </AccordionTrigger>
            <AccordionContent className="space-y-6 pt-2 pb-6">
              <QuestionField
                label="What are your 3-5 core values?"
                tier={tier} targetTier="Seed"
                value={responses.values?.core_values || ''}
                onChange={(val) => onChange('values', 'core_values', val)}
                rating={responses.values?.core_values_rating}
                onRatingChange={(val) => onChange('values', 'core_values_rating', val)}
                fieldKey="values.core_values"
                enableAIFeedback={true}
              />
            </AccordionContent>
          </AccordionItem>

        </Accordion>
      </CardContent>
    </Card>
  );
}