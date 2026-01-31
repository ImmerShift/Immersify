import { GoogleGenerativeAI } from "@google/generative-ai";
import { SYSTEM_PROMPT, VISUAL_ANALYSIS_PROMPT, SINGLE_INPUT_PROMPT } from './prompts';

export const generateStrategy = async (apiKey, clientName, answers, pillars = ['brand_core']) => {
  if (!apiKey) throw new Error("Please enter your Gemini API Key in Settings.");

  const genAI = new GoogleGenerativeAI(apiKey);
  const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });

  const userPrompt = `
  Client Name: ${clientName}
  Client Answers: ${JSON.stringify(answers)}
  
  Please generate a strategy for the following pillars: ${pillars.join(', ')}.
  Focus on actionable, creative, and specific advice suitable for a ${answers.brand_maturity || 'Seed'} stage brand.
  
  REMEMBER:
  - Use the "Upscalix" method for any naming suggestions.
  - No corporate jargon.
  - Focus on the "Soul" and "Feeling" of the brand.
  `;

  try {
    const result = await model.generateContent(SYSTEM_PROMPT + "\n" + userPrompt);
    
    const text = result.response.text();
    // Clean markdown if present
    const cleaned = text.replace(/```json/g, '').replace(/```/g, '').trim();
    return JSON.parse(cleaned);
  } catch (error) {
    console.error("AI Generation Error:", error);
    throw error;
  }
};

export const analyzeVisualConsistency = async (apiKey, logoBase64, colors) => {
  if (!apiKey) throw new Error("Please enter your Gemini API Key in Settings.");
  
  const genAI = new GoogleGenerativeAI(apiKey);
  const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });

  const prompt = `${VISUAL_ANALYSIS_PROMPT}

  Context:
  Color Palette: ${JSON.stringify(colors)}
  `;

  try {
    // Extract base64 data and mime type
    // Format is usually: data:image/png;base64,iVBOR...
    const matches = logoBase64.match(/^data:(.+);base64,(.+)$/);
    if (!matches) throw new Error("Invalid image data");
    
    const mimeType = matches[1];
    const data = matches[2];

    const imagePart = {
      inlineData: {
        data: data,
        mimeType: mimeType
      }
    };

    const result = await model.generateContent([prompt, imagePart]);
    const text = result.response.text();
    const cleaned = text.replace(/```json/g, '').replace(/```/g, '').trim();
    return JSON.parse(cleaned);
  } catch (error) {
    console.error("Visual Analysis Error:", error);
    throw error;
  }
};

export const analyzeSingleInput = async (apiKey, question, answer) => {
  if (!apiKey) throw new Error("API Key missing");
  
  const genAI = new GoogleGenerativeAI(apiKey);
  const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });

  const prompt = `${SINGLE_INPUT_PROMPT}

  Question: "${question}"
  User Answer: "${answer}"
  `;

  try {
    const result = await model.generateContent(prompt);
    return result.response.text().trim();
  } catch (error) {
    console.error("Single Input Analysis Error:", error);
    // Return the actual error message for debugging
    return `Analysis failed: ${error.message || "Unknown error"}`;
  }
};
