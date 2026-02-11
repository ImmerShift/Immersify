import { SEED_QUESTIONNAIRE } from '@/data/questionnaires/v3/seed';
import { SPROUT_QUESTIONNAIRE } from '@/data/questionnaires/v3/sprout';
import { STAR_QUESTIONNAIRE } from '@/data/questionnaires/v3/star';
import { SUPERBRAND_QUESTIONNAIRE } from '@/data/questionnaires/v3/superbrand';

const QUESTION_WEIGHT = 5;
const CHECKLIST_WEIGHT = 10;

const TIER_ORDER = ['seed', 'sprout', 'star', 'superbrand'] as const;

const TIER_DATA = {
  seed: SEED_QUESTIONNAIRE,
  sprout: SPROUT_QUESTIONNAIRE,
  star: STAR_QUESTIONNAIRE,
  superbrand: SUPERBRAND_QUESTIONNAIRE
} as const;

type TierKey = keyof typeof TIER_DATA;

interface Question {
  id: string;
  type: string;
  text: string;
}

interface ChecklistItem {
  id: string;
  label: string;
  required?: boolean;
}

interface Section {
  title: string;
  description?: string;
  questions?: Question[];
  checklist?: {
    title: string;
    description: string;
    items: ChecklistItem[];
  };
}

interface Pillar {
  pillarId: number;
  pillarTitle: string;
  sections: Section[];
}

type TierIndex = {
  questions: string[];
  checklist: string[];
};

const buildTierIndex = (tierKey: TierKey): TierIndex => {
  const questions: string[] = [];
  const checklist: string[] = [];
  
  // Cast to Pillar[] because the imported JSON/data might not have explicit types attached
  const pillars = TIER_DATA[tierKey] as unknown as Pillar[];

  pillars.forEach((pillar) => {
    pillar.sections.forEach((section) => {
      (section.questions || []).forEach((question) => {
        questions.push(question.id);
      });
      section.checklist?.items?.forEach((item) => {
        checklist.push(item.id);
      });
    });
  });
  return { questions, checklist };
};

const TIER_INDEX = {
  seed: buildTierIndex('seed'),
  sprout: buildTierIndex('sprout'),
  star: buildTierIndex('star'),
  superbrand: buildTierIndex('superbrand')
};

const getAnswerValue = (answers: Record<string, any>, tierKey: TierKey, id: string) => {
  if (answers?.[tierKey] && typeof answers[tierKey] === 'object' && id in answers[tierKey]) {
    return answers[tierKey][id];
  }
  return answers?.[id];
};

const isTextComplete = (value: unknown) =>
  typeof value === 'string' && value.trim().length > 10;

const isChecklistComplete = (value: unknown) => Boolean(value) === true;

const hasAnyResponse = (answers: Record<string, any>, tierKey: TierKey, index: TierIndex) => {
  for (const id of index.questions) {
    const value = getAnswerValue(answers, tierKey, id);
    if (typeof value === 'string' && value.trim().length > 0) return true;
  }
  for (const id of index.checklist) {
    const value = getAnswerValue(answers, tierKey, id);
    if (Boolean(value)) return true;
  }
  return false;
};

const calculateTierScore = (answers: Record<string, any>, tierKey: TierKey) => {
  const index = TIER_INDEX[tierKey];
  const totalPossible =
    index.questions.length * QUESTION_WEIGHT +
    index.checklist.length * CHECKLIST_WEIGHT;
  let currentPoints = 0;

  index.questions.forEach((id) => {
    const value = getAnswerValue(answers, tierKey, id);
    if (isTextComplete(value)) {
      currentPoints += QUESTION_WEIGHT;
    }
  });

  index.checklist.forEach((id) => {
    const value = getAnswerValue(answers, tierKey, id);
    if (isChecklistComplete(value)) {
      currentPoints += CHECKLIST_WEIGHT;
    }
  });

  const score = totalPossible
    ? Math.round((currentPoints / totalPossible) * 100)
    : 0;

  return {
    score,
    hasResponses: hasAnyResponse(answers, tierKey, index)
  };
};

export const calculateBrandHealth = (answers: Record<string, any> = {}) => {
  const breakdown = {
    seed: 0,
    sprout: 0,
    star: 0,
    superbrand: 0
  };

  const unlockedScores: number[] = [];

  (TIER_ORDER as readonly TierKey[]).forEach((tierKey) => {
    const { score, hasResponses } = calculateTierScore(answers, tierKey);
    breakdown[tierKey] = score;
    if (hasResponses) {
      unlockedScores.push(score);
    }
  });

  const globalScore = unlockedScores.length
    ? Math.round(unlockedScores.reduce((sum, val) => sum + val, 0) / unlockedScores.length)
    : 0;

  return {
    globalScore,
    breakdown
  };
};
