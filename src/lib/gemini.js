import { GoogleGenerativeAI } from "@google/generative-ai";

export const generateStrategy = async (apiKey, clientName, answers, pillars = ['brand_core']) => {
  if (!apiKey) throw new Error("Please enter your Gemini API Key in Settings.");

  const genAI = new GoogleGenerativeAI(apiKey);
  const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

  const systemPrompt = `You are Immersify AI, an expert brand strategist. 
  Your goal is to generate a comprehensive "Immersive Brand Experience" (IBE) strategy.
  
  The 9 Pillars of IBE are:
  1. Brand Core (Mission, Vision, Values)
  2. Visual Identity (Logo, Colors, Typography)
  3. Verbal Identity (Tone, Taglines)
  4. Product Experience (Packaging, Unboxing)
  5. Service Design (Customer Support, Rituals)
  6. Spatial Design (Retail, Office, Events)
  7. Digital Presence (Website, Social)
  8. Content Strategy (Themes, Formats)
  9. Community (Events, Membership)
  
  Return the result as a CLEAN JSON object (no markdown formatting) with keys matching the requested pillars.`;

  const userPrompt = `
  Client Name: ${clientName}
  Client Answers: ${JSON.stringify(answers)}
  
  Please generate a strategy for the following pillars: ${pillars.join(', ')}.
  Focus on actionable, creative, and specific advice suitable for a ${answers.brand_maturity || 'Seed'} stage brand.
  `;

  try {
    const result = await model.generateContent([
      { role: "user", parts: [{ text: systemPrompt + "\n" + userPrompt }] }
    ]);
    
    const text = result.response.text();
    // Clean markdown if present
    const cleaned = text.replace(/```json/g, '').replace(/```/g, '').trim();
    return JSON.parse(cleaned);
  } catch (error) {
    console.error("AI Generation Error:", error);
    throw error;
  }
};
