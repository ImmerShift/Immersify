import React from 'react';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { Card, CardContent } from '@/components/ui/card';
import QuestionField from '../QuestionField';

export default function VerbalIdentitySection({ tier, responses, onChange }) {
  return (
    <Card className="border-none shadow-none bg-transparent">
      <CardContent className="p-0">
        <Accordion type="single" collapsible className="space-y-4" defaultValue="voice_tone">

          <AccordionItem value="voice_tone" className="border rounded-lg bg-white px-4">
            <AccordionTrigger className="text-lg font-semibold hover:no-underline py-4">Brand Voice & Tone</AccordionTrigger>
            <AccordionContent className="space-y-6 pt-2 pb-6">
              <QuestionField
                label="How would you describe your brand's voice? (e.g., friendly, professional, playful, authoritative)"
                tier={tier} targetTier="Seed"
                value={responses.voice_tone?.description || ''}
                onChange={(val) => onChange('voice_tone', 'description', val)}
                rating={responses.voice_tone?.description_rating}
                onRatingChange={(val) => onChange('voice_tone', 'description_rating', val)}
                fieldKey="voice_tone.description"
              />
              <QuestionField
                label="Do you have documented voice and tone guidelines?"
                tier={tier} targetTier="Star"
                value={responses.voice_tone?.guidelines || ''}
                onChange={(val) => onChange('voice_tone', 'guidelines', val)}
                rating={responses.voice_tone?.guidelines_rating}
                onRatingChange={(val) => onChange('voice_tone', 'guidelines_rating', val)}
                fieldKey="voice_tone.guidelines"
              />
              <QuestionField
                label="How does your tone adapt across different channels and situations?"
                tier={tier} targetTier="Star"
                value={responses.voice_tone?.adaptation || ''}
                onChange={(val) => onChange('voice_tone', 'adaptation', val)}
                rating={responses.voice_tone?.adaptation_rating}
                onRatingChange={(val) => onChange('voice_tone', 'adaptation_rating', val)}
                fieldKey="voice_tone.adaptation"
              />
            </AccordionContent>
          </AccordionItem>

          <AccordionItem value="messaging" className="border rounded-lg bg-white px-4">
            <AccordionTrigger className="text-lg font-semibold hover:no-underline py-4">Key Messaging & Taglines</AccordionTrigger>
            <AccordionContent className="space-y-6 pt-2 pb-6">
              <QuestionField
                label="What is your brand tagline or slogan?"
                tier={tier} targetTier="Seed"
                value={responses.messaging?.tagline || ''}
                onChange={(val) => onChange('messaging', 'tagline', val)}
                rating={responses.messaging?.tagline_rating}
                onRatingChange={(val) => onChange('messaging', 'tagline_rating', val)}
                fieldKey="messaging.tagline"
              />
              <QuestionField
                label="What are your 3-5 key brand messages?"
                tier={tier} targetTier="Sprout"
                value={responses.messaging?.messages || ''}
                onChange={(val) => onChange('messaging', 'messages', val)}
                rating={responses.messaging?.messages_rating}
                onRatingChange={(val) => onChange('messaging', 'messages_rating', val)}
                fieldKey="messaging.messages"
              />
              <QuestionField
                label="Do you have messaging frameworks for different audiences or use cases?"
                tier={tier} targetTier="Star"
                value={responses.messaging?.frameworks || ''}
                onChange={(val) => onChange('messaging', 'frameworks', val)}
                rating={responses.messaging?.frameworks_rating}
                onRatingChange={(val) => onChange('messaging', 'frameworks_rating', val)}
                fieldKey="messaging.frameworks"
              />
            </AccordionContent>
          </AccordionItem>

          <AccordionItem value="storytelling" className="border rounded-lg bg-white px-4">
            <AccordionTrigger className="text-lg font-semibold hover:no-underline py-4">Brand Storytelling</AccordionTrigger>
            <AccordionContent className="space-y-6 pt-2 pb-6">
              <QuestionField
                label="What is your brand's origin story?"
                tier={tier} targetTier="Seed"
                value={responses.storytelling?.origin || ''}
                onChange={(val) => onChange('storytelling', 'origin', val)}
                rating={responses.storytelling?.origin_rating}
                onRatingChange={(val) => onChange('storytelling', 'origin_rating', val)}
                fieldKey="storytelling.origin"
              />
              <QuestionField
                label="How do you weave storytelling into your marketing and communications?"
                tier={tier} targetTier="Sprout"
                value={responses.storytelling?.application || ''}
                onChange={(val) => onChange('storytelling', 'application', val)}
                rating={responses.storytelling?.application_rating}
                onRatingChange={(val) => onChange('storytelling', 'application_rating', val)}
                fieldKey="storytelling.application"
              />
              <QuestionField
                label="Do you have a content narrative framework or editorial calendar?"
                tier={tier} targetTier="Star"
                value={responses.storytelling?.framework || ''}
                onChange={(val) => onChange('storytelling', 'framework', val)}
                rating={responses.storytelling?.framework_rating}
                onRatingChange={(val) => onChange('storytelling', 'framework_rating', val)}
                fieldKey="storytelling.framework"
              />
            </AccordionContent>
          </AccordionItem>

          <AccordionItem value="naming" className="border rounded-lg bg-white px-4">
            <AccordionTrigger className="text-lg font-semibold hover:no-underline py-4">Naming Conventions</AccordionTrigger>
            <AccordionContent className="space-y-6 pt-2 pb-6">
              <QuestionField
                label="How do you name products, services, or initiatives?"
                tier={tier} targetTier="Sprout"
                value={responses.naming?.process || ''}
                onChange={(val) => onChange('naming', 'process', val)}
                rating={responses.naming?.process_rating}
                onRatingChange={(val) => onChange('naming', 'process_rating', val)}
                fieldKey="naming.process"
              />
              <QuestionField
                label="Are naming standards documented and consistently applied?"
                tier={tier} targetTier="Star"
                value={responses.naming?.standards || ''}
                onChange={(val) => onChange('naming', 'standards', val)}
                rating={responses.naming?.standards_rating}
                onRatingChange={(val) => onChange('naming', 'standards_rating', val)}
                fieldKey="naming.standards"
              />
            </AccordionContent>
          </AccordionItem>

        </Accordion>
      </CardContent>
    </Card>
  );
}
