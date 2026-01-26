import React from 'react';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { Card, CardContent } from '@/components/ui/card';
import QuestionField from '../QuestionField';
import { ImagePlus, Plus } from 'lucide-react';

export default function VisualIdentitySection({ tier, responses, onChange }) {
  const UploadBox = ({ label, sublabel }) => (
    <div className="flex flex-col gap-2 flex-1">
      <Label className="text-sm font-semibold text-slate-700">{label}</Label>
      <div className="border-2 border-dashed border-slate-200 rounded-lg p-8 flex flex-col items-center justify-center gap-2 bg-slate-50/50 hover:bg-slate-50 transition-colors cursor-pointer">
        <ImagePlus className="w-8 h-8 text-slate-400" />
        <div className="text-center">
          <p className="text-xs font-medium text-slate-600">Click to upload logo</p>
          <p className="text-[10px] text-slate-400 uppercase">{sublabel}</p>
        </div>
      </div>
    </div>
  );

  const ColorSlot = () => (
    <div className="w-12 h-12 rounded-lg border-2 border-dashed border-slate-200 bg-slate-50 flex items-center justify-center cursor-pointer hover:bg-slate-100 transition-colors">
      <Plus className="w-4 h-4 text-slate-400" />
    </div>
  );

  return (
    <Card className="border-none shadow-none bg-transparent">
      <CardContent className="p-0">
        <Accordion type="single" collapsible className="space-y-4" defaultValue="logo">

          <AccordionItem value="logo" className="border rounded-lg bg-white px-4">
            <AccordionTrigger className="text-lg font-semibold hover:no-underline py-4">Logo & Brand Mark</AccordionTrigger>
            <AccordionContent className="space-y-6 pt-2 pb-6">
              <div className="flex flex-col md:flex-row gap-6 mb-6">
                <UploadBox label="Upload your primary logo" sublabel="PNG, JPG, SVG (max 5MB)" />
                <UploadBox label="Upload logo variation (optional)" sublabel="PNG, JPG, SVG (max 5MB)" />
              </div>
              <QuestionField
                label="Describe your logo and what it represents"
                tier={tier} targetTier="Seed"
                value={responses.logo?.description || ''}
                onChange={(val) => onChange('logo', 'description', val)}
                rating={responses.logo?.description_rating}
                onRatingChange={(val) => onChange('logo', 'description_rating', val)}
                fieldKey="logo.description"
                placeholder="What symbols, shapes, or imagery does your logo use? What meaning does it convey?"
                enableAIFeedback={true}
              />
              <QuestionField
                label="Do you have logo variations for different contexts? (dark/light backgrounds, minimum sizes, etc.)"
                tier={tier} targetTier="Sprout"
                value={responses.logo?.variations || ''}
                onChange={(val) => onChange('logo', 'variations', val)}
                rating={responses.logo?.variations_rating}
                onRatingChange={(val) => onChange('logo', 'variations_rating', val)}
                fieldKey="logo.variations"
              />
            </AccordionContent>
          </AccordionItem>

          <AccordionItem value="colors" className="border rounded-lg bg-white px-4">
            <AccordionTrigger className="text-lg font-semibold hover:no-underline py-4">Color Palette</AccordionTrigger>
            <AccordionContent className="space-y-6 pt-2 pb-6">
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label className="text-sm font-semibold text-slate-700">Primary Brand Colors (pick up to 2)</Label>
                  <div className="flex gap-2">
                    <ColorSlot />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label className="text-sm font-semibold text-slate-700">Secondary/Accent Colors (pick up to 4)</Label>
                  <div className="flex gap-2">
                    <ColorSlot />
                  </div>
                </div>
              </div>
              <QuestionField
                label="What emotions or associations should your colors evoke?"
                tier={tier} targetTier="Seed"
                value={responses.colors?.emotions || ''}
                onChange={(val) => onChange('colors', 'emotions', val)}
                rating={responses.colors?.emotions_rating}
                onRatingChange={(val) => onChange('colors', 'emotions_rating', val)}
                fieldKey="colors.emotions"
                placeholder="E.g., Trust and professionalism (blue). Energy and excitement (orange). Nature and growth (green)."
                enableAIFeedback={true}
              />
              <QuestionField
                label="Are color usage guidelines documented and consistently applied?"
                tier={tier} targetTier="Star"
                value={responses.colors?.guidelines || ''}
                onChange={(val) => onChange('colors', 'guidelines', val)}
                rating={responses.colors?.guidelines_rating}
                onRatingChange={(val) => onChange('colors', 'guidelines_rating', val)}
                fieldKey="colors.guidelines"
              />
            </AccordionContent>
          </AccordionItem>

          <AccordionItem value="typography" className="border rounded-lg bg-white px-4">
            <AccordionTrigger className="text-lg font-semibold hover:no-underline py-4">Typography</AccordionTrigger>
            <AccordionContent className="space-y-6 pt-2 pb-6">
              <div className="space-y-2">
                <Label className="text-sm font-semibold text-slate-700">Select your brand fonts (pick 1-2 from Google Fonts)</Label>
                <div className="flex gap-2">
                  <div className="px-4 py-2 rounded-lg border-2 border-dashed border-slate-200 bg-slate-50 flex items-center justify-center cursor-pointer hover:bg-slate-100 transition-colors text-xs font-medium text-slate-500 gap-2">
                    <Plus className="w-3 h-3" /> Add Font
                  </div>
                </div>
              </div>
              <QuestionField
                label="Why did you choose these fonts? What do they communicate?"
                tier={tier} targetTier="Seed"
                value={responses.typography?.communication || ''}
                onChange={(val) => onChange('typography', 'communication', val)}
                rating={responses.typography?.communication_rating}
                onRatingChange={(val) => onChange('typography', 'communication_rating', val)}
                fieldKey="typography.communication"
                placeholder="E.g., We chose Montserrat for its modern, geometric feel that reflects our innovative approach"
                enableAIFeedback={true}
              />
              <QuestionField
                label="Are font hierarchy and usage rules documented?"
                tier={tier} targetTier="Star"
                value={responses.typography?.hierarchy || ''}
                onChange={(val) => onChange('typography', 'hierarchy', val)}
                rating={responses.typography?.hierarchy_rating}
                onRatingChange={(val) => onChange('typography', 'hierarchy_rating', val)}
                fieldKey="typography.hierarchy"
              />
            </AccordionContent>
          </AccordionItem>

          <AccordionItem value="imagery" className="border rounded-lg bg-white px-4">
            <AccordionTrigger className="text-lg font-semibold hover:no-underline py-4">Imagery & Design Samples</AccordionTrigger>
            <AccordionContent className="space-y-6 pt-2 pb-6">
              <div className="space-y-4">
                <Label className="text-sm font-semibold text-slate-700">Upload examples of your current brand imagery, marketing materials, or design samples</Label>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 p-4 border-2 border-dashed border-slate-100 rounded-xl bg-slate-50/30">
                  <UploadBox label="" sublabel="PNG, JPG, SVG (max 5MB)" />
                  <UploadBox label="" sublabel="PNG, JPG, SVG (max 5MB)" />
                  <UploadBox label="" sublabel="PNG, JPG, SVG (max 5MB)" />
                  <UploadBox label="" sublabel="PNG, JPG, SVG (max 5MB)" />
                </div>
              </div>
              <QuestionField
                label="What is your brand's visual style? (photography, illustrations, graphics)"
                tier={tier} targetTier="Sprout"
                value={responses.imagery?.style || ''}
                onChange={(val) => onChange('imagery', 'style', val)}
                rating={responses.imagery?.style_rating}
                onRatingChange={(val) => onChange('imagery', 'style_rating', val)}
                fieldKey="imagery.style"
                placeholder="E.g., Bright lifestyle photography with real people, minimalist product shots, hand-drawn illustrations."
                enableAIFeedback={true}
              />
              <QuestionField
                label="Do you have a consistent approach to imagery across all touchpoints?"
                tier={tier} targetTier="Star"
                value={responses.imagery?.consistency || ''}
                onChange={(val) => onChange('imagery', 'consistency', val)}
                rating={responses.imagery?.consistency_rating}
                onRatingChange={(val) => onChange('imagery', 'consistency_rating', val)}
                fieldKey="imagery.consistency"
              />
            </AccordionContent>
          </AccordionItem>

        </Accordion>
      </CardContent>
    </Card>
  );
}
import { Label } from '@/components/ui/label';
