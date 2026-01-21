import React from 'react';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { Card, CardContent } from '@/components/ui/card';
import QuestionField from '../QuestionField';

export default function MarketPlanSection({ tier, responses, onChange }) {
  return (
    <Card className="border-none shadow-none bg-transparent">
      <CardContent className="p-0">
        <Accordion type="single" collapsible className="space-y-4" defaultValue="research">

          <AccordionItem value="research" className="border rounded-lg bg-white px-4">
            <AccordionTrigger className="text-lg font-semibold hover:no-underline py-4">Market Research & Analysis</AccordionTrigger>
            <AccordionContent className="space-y-6 pt-2 pb-6">
              <QuestionField
                label="Who are your main competitors?"
                tier={tier} targetTier="Seed"
                value={responses.research?.competitors || ''}
                onChange={(val) => onChange('research', 'competitors', val)}
                rating={responses.research?.competitors_rating}
                onRatingChange={(val) => onChange('research', 'competitors_rating', val)}
                fieldKey="research.competitors"
              />
              <QuestionField
                label="What market trends are impacting your industry?"
                tier={tier} targetTier="Sprout"
                value={responses.research?.trends || ''}
                onChange={(val) => onChange('research', 'trends', val)}
                rating={responses.research?.trends_rating}
                onRatingChange={(val) => onChange('research', 'trends_rating', val)}
                fieldKey="research.trends"
              />
              <QuestionField
                label="Do you conduct regular competitive analysis and market research?"
                tier={tier} targetTier="Star"
                value={responses.research?.frequency || ''}
                onChange={(val) => onChange('research', 'frequency', val)}
                rating={responses.research?.frequency_rating}
                onRatingChange={(val) => onChange('research', 'frequency_rating', val)}
                fieldKey="research.frequency"
              />
            </AccordionContent>
          </AccordionItem>

          <AccordionItem value="channels" className="border rounded-lg bg-white px-4">
            <AccordionTrigger className="text-lg font-semibold hover:no-underline py-4">Marketing Channels & Strategy</AccordionTrigger>
            <AccordionContent className="space-y-6 pt-2 pb-6">
              <QuestionField
                label="What marketing channels do you currently use?"
                tier={tier} targetTier="Seed"
                value={responses.channels?.list || ''}
                onChange={(val) => onChange('channels', 'list', val)}
                rating={responses.channels?.list_rating}
                onRatingChange={(val) => onChange('channels', 'list_rating', val)}
                fieldKey="channels.list"
                placeholder="E.g., Social media, Email, SEO, Paid ads, Content marketing, Events"
              />
              <QuestionField
                label="What is your content marketing strategy?"
                tier={tier} targetTier="Sprout"
                value={responses.channels?.content_strategy || ''}
                onChange={(val) => onChange('channels', 'content_strategy', val)}
                rating={responses.channels?.content_strategy_rating}
                onRatingChange={(val) => onChange('channels', 'content_strategy_rating', val)}
                fieldKey="channels.content_strategy"
              />
              <QuestionField
                label="How do you measure marketing ROI and optimize campaigns?"
                tier={tier} targetTier="Star"
                value={responses.channels?.roi || ''}
                onChange={(val) => onChange('channels', 'roi', val)}
                rating={responses.channels?.roi_rating}
                onRatingChange={(val) => onChange('channels', 'roi_rating', val)}
                fieldKey="channels.roi"
              />
            </AccordionContent>
          </AccordionItem>

          <AccordionItem value="acquisition" className="border rounded-lg bg-white px-4">
            <AccordionTrigger className="text-lg font-semibold hover:no-underline py-4">Customer Acquisition & Retention</AccordionTrigger>
            <AccordionContent className="space-y-6 pt-2 pb-6">
              <QuestionField
                label="What is your customer acquisition strategy?"
                tier={tier} targetTier="Sprout"
                value={responses.acquisition?.strategy || ''}
                onChange={(val) => onChange('acquisition', 'strategy', val)}
                rating={responses.acquisition?.strategy_rating}
                onRatingChange={(val) => onChange('acquisition', 'strategy_rating', val)}
                fieldKey="acquisition.strategy"
              />
              <QuestionField
                label="What is your customer retention rate and how do you improve it?"
                tier={tier} targetTier="Star"
                value={responses.acquisition?.retention || ''}
                onChange={(val) => onChange('acquisition', 'retention', val)}
                rating={responses.acquisition?.retention_rating}
                onRatingChange={(val) => onChange('acquisition', 'retention_rating', val)}
                fieldKey="acquisition.retention"
              />
              <QuestionField
                label="Do you have a customer loyalty or advocacy program?"
                tier={tier} targetTier="Superbrand"
                value={responses.acquisition?.loyalty || ''}
                onChange={(val) => onChange('acquisition', 'loyalty', val)}
                rating={responses.acquisition?.loyalty_rating}
                onRatingChange={(val) => onChange('acquisition', 'loyalty_rating', val)}
                fieldKey="acquisition.loyalty"
              />
            </AccordionContent>
          </AccordionItem>

          <AccordionItem value="partnerships" className="border rounded-lg bg-white px-4">
            <AccordionTrigger className="text-lg font-semibold hover:no-underline py-4">Partnerships & Collaborations</AccordionTrigger>
            <AccordionContent className="space-y-6 pt-2 pb-6">
              <QuestionField
                label="Do you have strategic partnerships or collaborations?"
                tier={tier} targetTier="Star"
                value={responses.partnerships?.list || ''}
                onChange={(val) => onChange('partnerships', 'list', val)}
                rating={responses.partnerships?.list_rating}
                onRatingChange={(val) => onChange('partnerships', 'list_rating', val)}
                fieldKey="partnerships.list"
              />
              <QuestionField
                label="How do partnerships align with and strengthen your brand?"
                tier={tier} targetTier="Superbrand"
                value={responses.partnerships?.alignment || ''}
                onChange={(val) => onChange('partnerships', 'alignment', val)}
                rating={responses.partnerships?.alignment_rating}
                onRatingChange={(val) => onChange('partnerships', 'alignment_rating', val)}
                fieldKey="partnerships.alignment"
              />
            </AccordionContent>
          </AccordionItem>

        </Accordion>
      </CardContent>
    </Card>
  );
}
