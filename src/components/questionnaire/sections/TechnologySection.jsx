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
            <AccordionTrigger className="text-lg font-semibold hover:no-underline py-4">Digital Presence & Website</AccordionTrigger>
            <AccordionContent className="space-y-6 pt-2 pb-6">
              <QuestionField
                label="Do you have a website? Describe its current state and functionality."
                tier={tier} targetTier="Seed"
                value={responses.digital_presence?.website || ''}
                onChange={(val) => onChange('digital_presence', 'website', val)}
                rating={responses.digital_presence?.website_rating}
                onRatingChange={(val) => onChange('digital_presence', 'website_rating', val)}
                fieldKey="digital_presence.website"
                enableAIFeedback={true}
              />
              <QuestionField
                label="Is your website optimized for mobile devices?"
                tier={tier} targetTier="Sprout"
                value={responses.digital_presence?.mobile || ''}
                onChange={(val) => onChange('digital_presence', 'mobile', val)}
                rating={responses.digital_presence?.mobile_rating}
                onRatingChange={(val) => onChange('digital_presence', 'mobile_rating', val)}
                fieldKey="digital_presence.mobile"
              />
              <QuestionField
                label="How does your website reflect your brand identity and values?"
                tier={tier} targetTier="Star"
                value={responses.digital_presence?.reflection || ''}
                onChange={(val) => onChange('digital_presence', 'reflection', val)}
                rating={responses.digital_presence?.reflection_rating}
                onRatingChange={(val) => onChange('digital_presence', 'reflection_rating', val)}
                fieldKey="digital_presence.reflection"
              />
            </AccordionContent>
          </AccordionItem>

          <AccordionItem value="social_media" className="border rounded-lg bg-white px-4">
            <AccordionTrigger className="text-lg font-semibold hover:no-underline py-4">Social Media & Online Communities</AccordionTrigger>
            <AccordionContent className="space-y-6 pt-2 pb-6">
              <QuestionField
                label="Which social media platforms are you active on?"
                tier={tier} targetTier="Seed"
                value={responses.social_media?.platforms || ''}
                onChange={(val) => onChange('social_media', 'platforms', val)}
                rating={responses.social_media?.platforms_rating}
                onRatingChange={(val) => onChange('social_media', 'platforms_rating', val)}
                fieldKey="social_media.platforms"
              />
              <QuestionField
                label="Do you have a social media strategy and content calendar?"
                tier={tier} targetTier="Sprout"
                value={responses.social_media?.strategy || ''}
                onChange={(val) => onChange('social_media', 'strategy', val)}
                rating={responses.social_media?.strategy_rating}
                onRatingChange={(val) => onChange('social_media', 'strategy_rating', val)}
                fieldKey="social_media.strategy"
              />
              <QuestionField
                label="How do you engage with your community and manage your online reputation?"
                tier={tier} targetTier="Star"
                value={responses.social_media?.engagement || ''}
                onChange={(val) => onChange('social_media', 'engagement', val)}
                rating={responses.social_media?.engagement_rating}
                onRatingChange={(val) => onChange('social_media', 'engagement_rating', val)}
                fieldKey="social_media.engagement"
              />
            </AccordionContent>
          </AccordionItem>

          <AccordionItem value="stack" className="border rounded-lg bg-white px-4">
            <AccordionTrigger className="text-lg font-semibold hover:no-underline py-4">Technology Stack & Tools</AccordionTrigger>
            <AccordionContent className="space-y-6 pt-2 pb-6">
              <QuestionField
                label="What key tools and platforms do you use for operations?"
                tier={tier} targetTier="Sprout"
                value={responses.stack?.tools || ''}
                onChange={(val) => onChange('stack', 'tools', val)}
                rating={responses.stack?.tools_rating}
                onRatingChange={(val) => onChange('stack', 'tools_rating', val)}
                fieldKey="stack.tools"
                placeholder="E.g., CRM, Email marketing, Project management, Analytics, E-commerce"
              />
              <QuestionField
                label="Do your systems integrate well and support your brand experience?"
                tier={tier} targetTier="Star"
                value={responses.stack?.integration || ''}
                onChange={(val) => onChange('stack', 'integration', val)}
                rating={responses.stack?.integration_rating}
                onRatingChange={(val) => onChange('stack', 'integration_rating', val)}
                fieldKey="stack.integration"
              />
              <QuestionField
                label="How do you leverage technology for personalization and customer insights?"
                tier={tier} targetTier="Superbrand"
                value={responses.stack?.personalization || ''}
                onChange={(val) => onChange('stack', 'personalization', val)}
                rating={responses.stack?.personalization_rating}
                onRatingChange={(val) => onChange('stack', 'personalization_rating', val)}
                fieldKey="stack.personalization"
              />
            </AccordionContent>
          </AccordionItem>

          <AccordionItem value="analytics" className="border rounded-lg bg-white px-4">
            <AccordionTrigger className="text-lg font-semibold hover:no-underline py-4">Data & Analytics</AccordionTrigger>
            <AccordionContent className="space-y-6 pt-2 pb-6">
              <QuestionField
                label="What key metrics do you track?"
                tier={tier} targetTier="Sprout"
                value={responses.analytics?.metrics || ''}
                onChange={(val) => onChange('analytics', 'metrics', val)}
                rating={responses.analytics?.metrics_rating}
                onRatingChange={(val) => onChange('analytics', 'metrics_rating', val)}
                fieldKey="analytics.metrics"
              />
              <QuestionField
                label="How do you use data to inform brand and business decisions?"
                tier={tier} targetTier="Star"
                value={responses.analytics?.usage || ''}
                onChange={(val) => onChange('analytics', 'usage', val)}
                rating={responses.analytics?.usage_rating}
                onRatingChange={(val) => onChange('analytics', 'usage_rating', val)}
                fieldKey="analytics.usage"
              />
              <QuestionField
                label="Do you have predictive analytics or AI-driven insights?"
                tier={tier} targetTier="Superbrand"
                value={responses.analytics?.ai || ''}
                onChange={(val) => onChange('analytics', 'ai', val)}
                rating={responses.analytics?.ai_rating}
                onRatingChange={(val) => onChange('analytics', 'ai_rating', val)}
                fieldKey="analytics.ai"
              />
            </AccordionContent>
          </AccordionItem>

        </Accordion>
      </CardContent>
    </Card>
  );
}
