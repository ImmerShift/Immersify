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
                tips={[
                  "What inspired you to start this?",
                  "What change do you want to see in the world?",
                  "Why should anyone care?"
                ]}
              />
              <QuestionField
                label="How do you do it? (Your unique approach/process)"
                tier={tier} targetTier="Seed"
                value={responses.golden_circle?.how_response || ''}
                onChange={(val) => onChange('golden_circle', 'how_response', val)}
                rating={responses.golden_circle?.how_rating}
                onRatingChange={(val) => onChange('golden_circle', 'how_rating', val)}
                fieldKey="golden_circle.how_response"
                enableAIFeedback={true}
                tips={[
                  "What makes your process different?",
                  "What's your secret sauce?"
                ]}
              />
              <QuestionField
                label="What do you offer? (Products/services)"
                tier={tier} targetTier="Seed"
                value={responses.golden_circle?.what_response || ''}
                onChange={(val) => onChange('golden_circle', 'what_response', val)}
                rating={responses.golden_circle?.what_rating}
                onRatingChange={(val) => onChange('golden_circle', 'what_rating', val)}
                fieldKey="golden_circle.what_response"
                enableAIFeedback={true}
                tips={[
                  "List your main offerings",
                  "What problems do they solve?"
                ]}
              />
            </AccordionContent>
          </AccordionItem>

          <AccordionItem value="purpose" className="border rounded-lg bg-white px-4">
            <AccordionTrigger className="text-lg font-semibold hover:no-underline py-4">
              Brand Purpose & Promise
            </AccordionTrigger>
            <AccordionContent className="space-y-6 pt-2 pb-6">
              <QuestionField
                label="What is your Mission Statement?"
                tier={tier} targetTier="Seed"
                value={responses.purpose?.mission || ''}
                onChange={(val) => onChange('purpose', 'mission', val)}
                rating={responses.purpose?.mission_rating}
                onRatingChange={(val) => onChange('purpose', 'mission_rating', val)}
                fieldKey="purpose.mission"
                enableAIFeedback={true}
                tips={[
                  "What do you do daily to fulfill your purpose?",
                  "Who do you serve?"
                ]}
              />
              <QuestionField
                label="What is your Vision Statement?"
                tier={tier} targetTier="Seed"
                value={responses.purpose?.vision || ''}
                onChange={(val) => onChange('purpose', 'vision', val)}
                rating={responses.purpose?.vision_rating}
                onRatingChange={(val) => onChange('purpose', 'vision_rating', val)}
                fieldKey="purpose.vision"
                enableAIFeedback={true}
                tips={[
                  "Where do you see your brand in 10 years?",
                  "What's the ultimate goal?"
                ]}
              />
              <QuestionField
                label="What is your Brand Promise to customers?"
                tier={tier} targetTier="Seed"
                value={responses.purpose?.promise || ''}
                onChange={(val) => onChange('purpose', 'promise', val)}
                rating={responses.purpose?.promise_rating}
                onRatingChange={(val) => onChange('purpose', 'promise_rating', val)}
                fieldKey="purpose.promise"
                enableAIFeedback={true}
                tips={[
                  "What can customers always expect from you?",
                  "What commitment do you make?"
                ]}
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
                placeholder="E.g., Innovation, Sustainability, Customer-First, Transparency, Excellence"
                enableAIFeedback={true}
                tips={[
                  "What principles guide decisions?",
                  "What won't you compromise on?"
                ]}
              />
              <QuestionField
                label="How are these values demonstrated in daily operations?"
                tier={tier} targetTier="Seed"
                value={responses.values?.demonstration || ''}
                onChange={(val) => onChange('values', 'demonstration', val)}
                rating={responses.values?.demonstration_rating}
                onRatingChange={(val) => onChange('values', 'demonstration_rating', val)}
                fieldKey="values.demonstration"
              />
            </AccordionContent>
          </AccordionItem>

          <AccordionItem value="positioning" className="border rounded-lg bg-white px-4">
            <AccordionTrigger className="text-lg font-semibold hover:no-underline py-4">
              Brand Positioning
            </AccordionTrigger>
            <AccordionContent className="space-y-6 pt-2 pb-6">
              <QuestionField
                label="Who is your target audience?"
                tier={tier} targetTier="Seed"
                value={responses.positioning?.target_audience || ''}
                onChange={(val) => onChange('positioning', 'target_audience', val)}
                rating={responses.positioning?.target_audience_rating}
                onRatingChange={(val) => onChange('positioning', 'target_audience_rating', val)}
                fieldKey="positioning.target_audience"
                enableAIFeedback={true}
                tips={[
                  "Describe demographics, psychographics",
                  "What are their pain points?",
                  "Where do they hang out?"
                ]}
              />
              <QuestionField
                label="What makes you different from competitors?"
                tier={tier} targetTier="Seed"
                value={responses.positioning?.differentiation || ''}
                onChange={(val) => onChange('positioning', 'differentiation', val)}
                rating={responses.positioning?.differentiation_rating}
                onRatingChange={(val) => onChange('positioning', 'differentiation_rating', val)}
                fieldKey="positioning.differentiation"
                enableAIFeedback={true}
                tips={[
                  "What do competitors lack?",
                  "Why choose you over alternatives?"
                ]}
              />
              <QuestionField
                label="What is your unique value proposition?"
                tier={tier} targetTier="Seed"
                value={responses.positioning?.uvp || ''}
                onChange={(val) => onChange('positioning', 'uvp', val)}
                rating={responses.positioning?.uvp_rating}
                onRatingChange={(val) => onChange('positioning', 'uvp_rating', val)}
                fieldKey="positioning.uvp"
                enableAIFeedback={true}
                tips={[
                  "In one sentence, why should customers buy from you?"
                ]}
              />
            </AccordionContent>
          </AccordionItem>

        </Accordion>
      </CardContent>
    </Card>
  );
}