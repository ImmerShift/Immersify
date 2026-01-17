import React from "react";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Card, CardContent } from "@/components/ui/card";
import QuestionField from "../QuestionField";

export default function VerbalIdentitySection({ tier, responses, onChange }) {
  return (
    <Card>
      <CardContent className="pt-6">
        <Accordion type="single" collapsible className="w-full">
          <AccordionItem value="tone-of-voice">
            <AccordionTrigger>Tone of Voice</AccordionTrigger>
            <AccordionContent>
              <QuestionField
                label="What is your brand's primary tone of voice?"
                value={responses?.tone_of_voice || ""}
                onChange={(v) => onChange("tone_of_voice", "primary", v)}
              />
            </AccordionContent>
          </AccordionItem>
        </Accordion>
      </CardContent>
    </Card>
  );
}
