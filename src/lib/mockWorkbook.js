import { getPromptTemplate } from '@/lib/promptLibrary';

const clampScore = (value) => Math.max(1, Math.min(10, value));

const getStrengthScore = (answerText) => {
  const length = answerText.trim().length;
  if (length >= 140) return 8;
  if (length >= 90) return 6;
  return 4;
};

const inferPillarId = (questionId) => {
  if (!questionId || typeof questionId !== 'string') return null;
  const match = questionId.match(/_p(\d+)_/i) || questionId.match(/^p(\d+)_/i);
  if (!match) return null;
  const value = Number(match[1]);
  return Number.isNaN(value) ? null : value;
};

export const mockWorkbookSubmit = ({ question, answerText, tierContext }) => {
  const pillarId =
    question?.pillarId ||
    question?.pillar_id ||
    inferPillarId(question?.id) ||
    2;
  const template = getPromptTemplate(pillarId, tierContext);
  const strengthScore = getStrengthScore(answerText);
  const role = template?.role || 'Mentor';
  const concept = `${role} summary of the core idea.`;
  const critique = strengthScore >= 7
    ? 'The answer is focused and shows real intent. It can be sharpened with clearer proof.'
    : 'The idea is promising but lacks precision and proof to be actionable.';
  const proTip = strengthScore >= 7
    ? 'Add one concrete example to make this feel real.'
    : 'Add one concrete example and a single measurable outcome.';
  const xp_awarded = strengthScore >= 7 ? 50 : 0;

  return {
    success: true,
    response_id: crypto.randomUUID?.() || `mock-${Date.now()}`,
    verification_status: strengthScore >= 7 ? 'verified' : 'failed',
    ai_feedback: {
      concept,
      critique,
      proTip,
      strengthScore: clampScore(strengthScore)
    },
    gamification: {
      xp_awarded
    }
  };
};
