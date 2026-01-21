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
            <AccordionTrigger className="text-lg font-semibold hover:no-underline py-4">Core Product/Service Offering</AccordionTrigger>
            <AccordionContent className="space-y-6 pt-2 pb-6">
              <QuestionField
                label="Describe your core product or service"
                tier={tier} targetTier="Seed"
                value={responses.core_offering?.description || ''}
                onChange={(val) => onChange('core_offering', 'description', val)}
                rating={responses.core_offering?.description_rating}
                onRatingChange={(val) => onChange('core_offering', 'description_rating', val)}
                fieldKey="core_offering.description"
              />
              <QuestionField
                label="How does your product/service align with your brand promise?"
                tier={tier} targetTier="Seed"
                value={responses.core_offering?.alignment || ''}
                onChange={(val) => onChange('core_offering', 'alignment', val)}
                rating={responses.core_offering?.alignment_rating}
                onRatingChange={(val) => onChange('core_offering', 'alignment_rating', val)}
                fieldKey="core_offering.alignment"
              />
            </AccordionContent>
          </AccordionItem>

          <AccordionItem value="customer_journey" className="border rounded-lg bg-white px-4">
            <AccordionTrigger className="text-lg font-semibold hover:no-underline py-4">Customer Journey & Touchpoints</AccordionTrigger>
            <AccordionContent className="space-y-6 pt-2 pb-6">
              <QuestionField
                label="Map out your typical customer journey (awareness to post-purchase)"
                tier={tier} targetTier="Seed"
                value={responses.customer_journey?.journey_map || ''}
                onChange={(val) => onChange('customer_journey', 'journey_map', val)}
                rating={responses.customer_journey?.journey_map_rating}
                onRatingChange={(val) => onChange('customer_journey', 'journey_map_rating', val)}
                fieldKey="customer_journey.journey_map"
              />
              <QuestionField
                label="What are your main customer touchpoints?"
                tier={tier} targetTier="Seed"
                value={responses.customer_journey?.touchpoints || ''}
                onChange={(val) => onChange('customer_journey', 'touchpoints', val)}
                rating={responses.customer_journey?.touchpoints_rating}
                onRatingChange={(val) => onChange('customer_journey', 'touchpoints_rating', val)}
                fieldKey="customer_journey.touchpoints"
                placeholder="E.g., Website, Social Media, Store, Email, Packaging, Customer Service"
              />
              <QuestionField
                label="Is brand consistency maintained across all touchpoints?"
                tier={tier} targetTier="Seed"
                value={responses.customer_journey?.consistency || ''}
                onChange={(val) => onChange('customer_journey', 'consistency', val)}
                rating={responses.customer_journey?.consistency_rating}
                onRatingChange={(val) => onChange('customer_journey', 'consistency_rating', val)}
                fieldKey="customer_journey.consistency"
              />
            </AccordionContent>
          </AccordionItem>

          <AccordionItem value="quality" className="border rounded-lg bg-white px-4">
            <AccordionTrigger className="text-lg font-semibold hover:no-underline py-4">Product/Service Quality</AccordionTrigger>
            <AccordionContent className="space-y-6 pt-2 pb-6">
              <QuestionField
                label="How do you measure and maintain quality standards?"
                tier={tier} targetTier="Seed"
                value={responses.quality?.standards || ''}
                onChange={(val) => onChange('quality', 'standards', val)}
                rating={responses.quality?.standards_rating}
                onRatingChange={(val) => onChange('quality', 'standards_rating', val)}
                fieldKey="quality.standards"
              />
              <QuestionField
                label="How do you gather and act on customer feedback?"
                tier={tier} targetTier="Seed"
                value={responses.quality?.feedback || ''}
                onChange={(val) => onChange('quality', 'feedback', val)}
                rating={responses.quality?.feedback_rating}
                onRatingChange={(val) => onChange('quality', 'feedback_rating', val)}
                fieldKey="quality.feedback"
              />
            </AccordionContent>
          </AccordionItem>

        </Accordion>
      </CardContent>
    </Card>
  );
}
