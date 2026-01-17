import React from 'react';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { Card, CardContent } from '@/components/ui/card';
import QuestionField from '../QuestionField';

export default function MarketPlanSection({ tier, responses, onChange }) {
  return (
    <Card className="border-none shadow-none bg-transparent">
      <CardContent className="p-0">
        <Accordion type="single" collapsible className="space-y-4" defaultValue="market_research">

          <AccordionItem value="market_research" className="border rounded-lg bg-white px-4">
            <AccordionTrigger className="text-lg font-semibold hover:no-underline py-4">Market Research</AccordionTrigger>
            <AccordionContent className="space-y-6 pt-2 pb-6">
              <QuestionField
                label="Who are your main competitors?"
                tier={tier} targetTier="Seed"
                value={responses.market_research?.competitors || ''}
                onChange={(val) => onChange('market_research', 'competitors', val)}
                rating={responses.market_research?.competitors_rating}
                onRatingChange={(val) => onChange('market_research', 'competitors_rating', val)}
                fieldKey="market_research.competitors"
                enableAIFeedback={true}
              />
            </AccordionContent>
          </AccordionItem>

          <AccordionItem value="marketing_channels" className="border rounded-lg bg-white px-4">
            <AccordionTrigger className="text-lg font-semibold hover:no-underline py-4">Channels</AccordionTrigger>
            <AccordionContent className="space-y-6 pt-2 pb-6">
              <QuestionField
                label="What marketing channels do you use?"
                tier={tier} targetTier="Seed"
                value={responses.marketing_channels?.current_channels || ''}
                onChange={(val) => onChange('marketing_channels', 'current_channels', val)}
                rating={responses.marketing_channels?.current_channels_rating}
                onRatingChange={(val) => onChange('marketing_channels', 'current_channels_rating', val)}
              />
            </AccordionContent>
          </AccordionItem>

        </Accordion>
      </CardContent>
    </Card>
  );
}