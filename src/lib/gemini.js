import { GoogleGenerativeAI } from "@google/generative-ai";
import { VISUAL_ANALYSIS_PROMPT, SINGLE_INPUT_PROMPT } from './prompts';
import { SECTIONS } from '@/lib/constants';
import { getStore } from '@/lib/store';

const resolveApiKey = (apiKey) => apiKey || getStore().apiKey || '';

export const MENTOR_PERSONAS = {
  Seed: "You are the Foundations Coach. Focus on the brand's why, emotional clarity, and early identity. Use simple, high-energy language. Use the terms: Purpose, Promise, Vibe, Heartbeat.",
  Sprout: "You are the ImmerShift Sprout Alignment Manager. Your mission is to stop brand leakage when growth outpaces identity. At the Sprout stage, Consistency is the only currency; if you are inconsistent, you are invisible. Tone: practical, observant, slightly tough-love. You are a project manager, not a cheerleader. Banned words: Vibe, Dream, Spirit, Soulful unless backed by data. Preferred words: Touchpoints, Alignment, Friction, Standardization, Visual Messaging, Cohesion, Customer Journey. Style: list-based thinking, highlight contradictions with 'You said X, but your action suggests Y.' Analytical focus: check Alignment between Visual Identity and Brand Core; look for DIY thinking that breaks at scale; challenge repeatability with 'If you hired a stranger tomorrow, could they replicate this based on your description?' Structured output rules: Concept must explain Brand Cohesion using a machinery metaphor (a brand is an engine; misaligned gears reduce power). Critique must identify inconsistencies and where their description misses professional market standards for their industry. Pro-Tip must be a systemic action like create a 1-page Style Guide, map top 3 touchpoints, standardize font usage. Emphasize the intersection of Pillar 2 Visual Identity and Pillar 3 Product Experience; a beautiful logo cannot save a broken customer journey. Prioritize Alignment Education above all.",
  Star: "You are the ImmerShift Growth Architect. Your mission is to identify friction. You see a brand as an Engine of Scale. If a brand process cannot be automated or delegated, it is a liability. You value Efficiency and Market Reach above all else. Tone: direct, ambitious, and data-oriented. You are the consultant preparing the company for a massive Series A round or global expansion. Banned words: Vibe, Feeling, Pretty, Nice. Preferred words: Conversion Rate, Acquisition Cost, Scalability, Omnichannel, Tech-Stack Integration, Market Penetration, Brand Authority. Style: use analytical frameworks; state 'Your current approach has a ceiling because...' Use percentages and growth-oriented metaphors. Core focus: check for Scalability. If the user describes a manual process, critique it as a bottleneck. Gap detection: look for lack of Market Strategy, CAC vs LTV awareness; if missing, call brand activation blind. Leverage rule: every brand action must have a multiplier effect; challenge them to use Technology (Pillar 5) to amplify Brand Activation (Pillar 6). Structured output rules: Concept must explain Brand Equity and Market Leverage using a construction/architecture metaphor (build the skyscraper; foundation is set, now the steel skeleton reaches the clouds). Critique must identify bottlenecks and lack of data-driven decision-making. Pro-Tip must be performance-driven, e.g., A/B test landing page messaging, integrate CRM with email automation, calculate brand sentiment score. Emphasize synergy between Pillar 4 Market Plan, Pillar 5 Technology, and Pillar 6 Brand Activation. At this level, branding is a math problem as much as a creative one. Prioritize Scalability Education above all.",
  Superbrand: "You are the ImmerShift Strategic Board. Your mission is Total Market Dominance. You view the brand as a complex, living ecosystem where every part must achieve Systemic Synergy. A Superbrand is not bought; it is inherited by the culture. You value Defensibility and Psychological Moats above all else. Tone: sophisticated, analytical, authoritative, and visionary. Speak as a peer to a CEO or Board Chairman. Banned words: Vibe, Cool, Growth, Sales, Consistent. Preferred words: Cognitive Fluency, Sentiment Attribution, Market Penetration Index, Brand Equity Defensibility, Psychological Priming, Legacy Asset, Systemic Synergy. Style: use high-level strategic frameworks; say 'Your current positioning lacks defensive depth because...' or 'This creates a friction point in your brand equity attribution.' Core focus: check for Defensibility. If a competitor with more money can steal this brand's soul, it is not a Superbrand. Gap detection: look for internal rot—analyze Team Branding; if internal culture doesn't match external promise, the brand is a hollow icon at risk of collapse. Psychology rule: every brand asset must trigger a specific subconscious response; challenge Security & Trust—performative or systemic asset? Structured output rules: Concept must explain Brand Equity and Institutional Legacy using a biological or architectural ecosystem metaphor (managing the climate of the entire forest, not just planting trees). Critique must identify strategic vulnerabilities where dominance relies on luck or temporary market conditions rather than a built-in psychological moat. Pro-Tip must be visionary/systemic, e.g., audit internal culture-to-market alignment, develop a brand sentiment attribution model, formalize Brand Governance framework. Emphasize holistic integration across all 8 pillars, especially the advanced interplay between Pillar 7 Team Branding and Pillar 8 Security & Trust to ensure the brand is built to last for decades, not just quarters. Prioritize Strategic Dominance Education above all."
};

const formatSectionTitle = (key) =>
  key.replace(/_/g, ' ').replace(/\b\w/g, (c) => c.toUpperCase());

const formatAnswerValue = (value) => {
  if (typeof value !== 'string') return value;
  if (value.startsWith('data:image')) return 'Uploaded image';
  return value.trim();
};

export const buildContextString = (answers) => {
  const entries = [];
  Object.entries(SECTIONS).forEach(([sectionKey, questions]) => {
    const sectionLines = [];
    questions.forEach((question) => {
      const value = answers?.[question.id];
      if (value === undefined || value === null || value === '') return;
      const formatted = formatAnswerValue(value);
      const tag = question.aiTag || question.label;
      sectionLines.push(`[${tag}]: "${formatted}"`);
    });
    if (sectionLines.length) {
      entries.push(`--- ${formatSectionTitle(sectionKey)} ---`);
      entries.push(...sectionLines);
    }
  });
  return entries.join('\n');
};

const buildFallback = () => {
  const pillars = Object.keys(SECTIONS).reduce((acc, key) => {
    acc[key] = { score: 50, advice: "Provide more detail to refine guidance." };
    return acc;
  }, {});
  return {
    analysis: "Fallback/Demo response. Provide more data for deeper analysis.",
    pillars,
    creative_idea: "Create a signature moment that reinforces the brand promise."
  };
};

export const generateStrategy = async (apiKey, brandName, answers) => {
  const resolvedKey = resolveApiKey(apiKey);
  if (!resolvedKey) throw new Error("Please enter your Gemini API Key in Settings.");
  if (/demo|test|dummy/i.test(resolvedKey)) return buildFallback();

  const genAI = new GoogleGenerativeAI(resolvedKey);
  const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });

  const systemInstruction = "You are an expert Brand Strategist. Analyze the following brand audit data.";
  const brandContext = `Brand Name: ${brandName || 'Unknown'}`;
  const dataContext = buildContextString(answers || {});
  const outputRequirement = "Return a JSON object strictly following this structure: { analysis: string, pillars: { [key]: { score: number, advice: string } }, creative_idea: string }. Do not use Markdown formatting.";
  const prompt = `${systemInstruction}\n${brandContext}\n${dataContext}\n${outputRequirement}`;

  try {
    const result = await model.generateContent(prompt);
    const text = result.response.text();
    const cleaned = text.replace(/```json/g, '').replace(/```/g, '').trim();
    return JSON.parse(cleaned);
  } catch (error) {
    console.error("AI Generation Error:", error);
    return buildFallback();
  }
};

export const getTieredMentorship = async (questionData, userText, currentTier) => {
  const resolvedKey = resolveApiKey();
  if (!resolvedKey) throw new Error("Please enter your Gemini API Key in Settings.");

  const genAI = new GoogleGenerativeAI(resolvedKey);
  const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });
  const tier = MENTOR_PERSONAS[currentTier] ? currentTier : 'Seed';

  const prompt = [
    MENTOR_PERSONAS[tier],
    "You are analyzing a response within the Immersive Brand Experience framework.",
    `Question Context: ${questionData?.label || ''}`,
    questionData?.aiTag ? `AI Tag: ${questionData.aiTag}` : '',
    `User Answer: ${userText}`,
    `Instruction: Explain the branding concept of this question for a ${tier} brand, critique their specific answer for blind spots, and provide one Pro-Tip to help them evolve to the next tier.`,
    "Return only JSON in this exact shape: { concept: string, critique: string, proTip: string, strengthScore: number }."
  ].filter(Boolean).join('\n');

  try {
    const result = await model.generateContent(prompt);
    const text = result.response.text();
    const cleaned = text.replace(/```json/g, '').replace(/```/g, '').trim();
    const parsed = JSON.parse(cleaned);
    return {
      concept: parsed.concept || '',
      critique: parsed.critique || '',
      proTip: parsed.proTip || '',
      strengthScore: Math.max(1, Math.min(10, Number(parsed.strengthScore) || 1))
    };
  } catch (error) {
    console.error("Tiered Mentorship Error:", error);
    return {
      concept: "We can refine the core idea here to align with your current maturity.",
      critique: "The answer is a strong start, but it needs more specific proof and positioning to be strategic.",
      proTip: "Add one concrete example that proves your promise in real-world behavior.",
      strengthScore: 4
    };
  }
};

export const analyzeVisualConsistency = async (apiKey, logoBase64, colors) => {
  let resolvedKey = apiKey;
  let logo = logoBase64;
  let palette = colors;
  if (typeof apiKey === 'string' && apiKey.startsWith('data:image')) {
    logo = apiKey;
    palette = logoBase64;
    resolvedKey = '';
  }
  const finalKey = resolveApiKey(resolvedKey);
  if (!finalKey) throw new Error("Please enter your Gemini API Key in Settings.");

  const genAI = new GoogleGenerativeAI(finalKey);
  const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });

  const prompt = `${VISUAL_ANALYSIS_PROMPT}

Context:
Color Palette: ${JSON.stringify(palette)}
`;

  try {
    const matches = logo.match(/^data:(.+);base64,(.+)$/);
    if (!matches) throw new Error("Invalid image data");
    const mimeType = matches[1];
    const data = matches[2];

    const imagePart = {
      inlineData: {
        data,
        mimeType
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
  const resolvedKey = resolveApiKey(apiKey);
  if (!resolvedKey) throw new Error("API Key missing");

  const genAI = new GoogleGenerativeAI(resolvedKey);
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
    return `Analysis failed: ${error.message || "Unknown error"}`;
  }
};
