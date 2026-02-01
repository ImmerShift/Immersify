import { SECTIONS } from '@/lib/constants';

const clamp = (value, min, max) => Math.min(Math.max(value, min), max);

const hexToRgb = (hex) => {
  const normalized = hex.replace('#', '');
  const bigint = parseInt(normalized, 16);
  return {
    r: (bigint >> 16) & 255,
    g: (bigint >> 8) & 255,
    b: bigint & 255
  };
};

const rgbToHex = ({ r, g, b }) =>
  `#${[r, g, b].map((v) => v.toString(16).padStart(2, '0')).join('')}`;

const lerpColor = (fromHex, toHex, t) => {
  const from = hexToRgb(fromHex);
  const to = hexToRgb(toHex);
  const mix = {
    r: Math.round(from.r + (to.r - from.r) * t),
    g: Math.round(from.g + (to.g - from.g) * t),
    b: Math.round(from.b + (to.b - from.b) * t)
  };
  return rgbToHex(mix);
};

const getStageFromCompletion = (completion) => {
  if (completion >= 0.85) return 'Superbrand';
  if (completion >= 0.6) return 'Star';
  if (completion >= 0.35) return 'Sprout';
  return 'Seed';
};

const getRatingScore = (rating) => {
  if (rating === 'Excellent') return 100;
  if (rating === 'Good') return 75;
  if (rating === 'Poor' || rating === 'Needs Major Improvement') return 25;
  return null;
};

const isAnswerFilled = (question, answers, ratings) => {
  if (question.type === 'rating') {
    const rating = ratings[question.id];
    return rating && rating !== 'N/A' && rating !== 'Not Applicable';
  }
  const value = answers[question.id];
  if (typeof value === 'string') return value.trim() !== '';
  return !!value;
};

const getTextLengthScore = (question, answers) => {
  if (!['text', 'textarea'].includes(question.type)) return 0;
  const value = answers[question.id];
  if (!value || typeof value !== 'string') return 0;
  const words = value.trim().split(/\s+/).filter(Boolean);
  return words.length;
};

export const calculateTreeState = (storeState) => {
  const answers = storeState?.answers || {};
  const ratings = storeState?.ratings || {};
  const brandLevel = storeState?.brandLevel?.level;

  const questionsByPillar = Object.values(SECTIONS);
  const allQuestions = questionsByPillar.flat();
  const totalQuestions = allQuestions.length || 1;

  const answeredCount = allQuestions.filter((q) => isAnswerFilled(q, answers, ratings)).length;
  const completion = clamp(answeredCount / totalQuestions, 0, 1);
  const treeScale = clamp(0.5 + completion * 2, 0.5, 2.5);

  const ratingScores = Object.values(ratings)
    .map(getRatingScore)
    .filter((score) => typeof score === 'number');
  const averageRating = ratingScores.length ? ratingScores.reduce((a, b) => a + b, 0) / ratingScores.length : 0;
  const healthColor = lerpColor('#8B4513', '#4ADE80', clamp(averageRating / 100, 0, 1));

  const textScores = allQuestions.map((q) => getTextLengthScore(q, answers));
  const avgTextScore = textScores.length ? textScores.reduce((a, b) => a + b, 0) / textScores.length : 0;
  const leafDensity = clamp(Math.round((avgTextScore / 40) * 100), 0, 100);

  const fruitCount = questionsByPillar.reduce((count, questions) => {
    const pillarAnswered = questions.filter((q) => isAnswerFilled(q, answers, ratings)).length;
    const completionRatio = questions.length ? pillarAnswered / questions.length : 0;
    return completionRatio >= 0.8 ? count + 1 : count;
  }, 0);

  const stage = brandLevel || getStageFromCompletion(completion);
  const environmentProgress = completion;
  const skyColor = lerpColor('#1e1b4b', '#7dd3fc', environmentProgress);
  const lightIntensity = clamp(0.6 + environmentProgress * 0.8, 0.6, 1.4);

  return {
    stage,
    treeScale,
    healthColor,
    leafDensity,
    fruitCount,
    environment: {
      skyColor,
      lightIntensity
    }
  };
};
