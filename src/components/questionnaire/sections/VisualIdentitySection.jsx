import React from 'react';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { Card, CardContent } from '@/components/ui/card';
import QuestionField from '../QuestionField';
import LogoUploader from '../../inputs/LogoUploader';
import ColorPicker from '../../inputs/ColorPicker';
import FontSelector from '../../inputs/FontSelector';

export default function VisualIdentitySection({ tier, responses, onChange }) {
  return (
    <Card className="border-none shadow-none bg-transparent">
      <CardContent className="p-0">
        <Accordion type="single" collapsible className="space-y-4" defaultValue="logo">

          <AccordionItem value="logo" className="border rounded-lg bg-white px-4">
            <AccordionTrigger className="text-lg font-semibold hover:no-underline py-4">Logo & Assets</AccordionTrigger>
            <AccordionContent className="space-y-6 pt-2 pb-6">
              <div className="grid md:grid-cols-2 gap-6">
                <LogoUploader
                  label="Primary Logo"
                  value={responses.logo?.primary_url || ''}
                  onChange={(val) => onChange('logo', 'primary_url', val)}
                />
              </div>
              <QuestionField
                label="Describe your logo and what it represents"
                tier={tier} targetTier="Seed"
                value={responses.logo?.description || ''}
                onChange={(val) => onChange('logo', 'description', val)}
                rating={responses.logo?.description_rating}
                onRatingChange={(val) => onChange('logo', 'description_rating', val)}
              />
            </AccordionContent>
          </AccordionItem>

          <AccordionItem value="colors" className="border rounded-lg bg-white px-4">
            <AccordionTrigger className="text-lg font-semibold hover:no-underline py-4">Colors</AccordionTrigger>
            <AccordionContent className="space-y-6 pt-2 pb-6">
              <ColorPicker
                label="Primary Colors"
                colors={responses.colors?.primary_colors || []}
                onChange={(val) => onChange('colors', 'primary_colors', val)}
              />
            </AccordionContent>
          </AccordionItem>

          <AccordionItem value="typography" className="border rounded-lg bg-white px-4">
            <AccordionTrigger className="text-lg font-semibold hover:no-underline py-4">Typography</AccordionTrigger>
            <AccordionContent className="space-y-6 pt-2 pb-6">
              <FontSelector
                label="Brand Fonts"
                fonts={responses.typography?.selected_fonts || []}
                onChange={(val) => onChange('typography', 'selected_fonts', val)}
              />
            </AccordionContent>
          </AccordionItem>

        </Accordion>
      </CardContent>
    </Card>
  );
}