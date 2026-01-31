export const TIER_ORDER = ['Seed', 'Sprout', 'Star', 'Superbrand'];

const normalizeTier = (tier) => TIER_ORDER.includes(tier) ? tier : 'Seed';
const getTierIndex = (tier) => TIER_ORDER.indexOf(normalizeTier(tier));

const simplifyText = (text) => {
  if (!text) return '';
  const trimmed = text.replace(/\(.*?\)/g, '').replace(/\s+/g, ' ').trim();
  const firstSentence = trimmed.split(/[.!?]/)[0].trim();
  return firstSentence || trimmed;
};

const simplifyTips = (tips) => {
  if (!tips || !tips.length) return tips;
  return tips.slice(0, 2).map((tip) => simplifyText(tip));
};

export const getPermissionMatrix = (tier) => {
  const normalized = normalizeTier(tier);
  return {
    tier: normalized,
    view_questions: true,
    submit_answers: true,
    submit_superbrand: normalized === 'Superbrand',
    submit_higher_tiers: normalized === 'Superbrand'
  };
};

export const getQuestionVariant = (question, tier) => {
  if (!question) return question;
  const normalized = normalizeTier(tier);
  const variants = question.variants || {};
  const variant = variants[normalized];

  if (variant) {
    return {
      ...question,
      ...variant
    };
  }

  if (normalized === 'Seed') {
    return {
      ...question,
      label: simplifyText(question.label),
      placeholder: question.placeholder ? simplifyText(question.placeholder) : question.placeholder,
      tips: simplifyTips(question.tips)
    };
  }

  return question;
};

export const getQuestionAccess = (question, userTier) => {
  const normalizedTier = normalizeTier(userTier);
  const questionTier = normalizeTier(question?.tier || 'Seed');
  const userIndex = getTierIndex(normalizedTier);
  const questionIndex = getTierIndex(questionTier);
  const canView = true;

  if (normalizedTier === 'Superbrand') {
    return { canView, canSubmit: true, readOnly: false, reason: null, tier: normalizedTier, questionTier };
  }

  if (questionTier === 'Superbrand' && (normalizedTier === 'Star' || normalizedTier === 'Sprout')) {
    return { canView, canSubmit: false, readOnly: true, reason: 'superbrand_locked', tier: normalizedTier, questionTier };
  }

  if (normalizedTier === 'Seed' && questionIndex > userIndex) {
    return { canView, canSubmit: false, readOnly: true, reason: 'higher_tier_locked', tier: normalizedTier, questionTier };
  }

  if (questionIndex > userIndex) {
    return { canView, canSubmit: false, readOnly: true, reason: 'higher_tier_locked', tier: normalizedTier, questionTier };
  }

  return { canView, canSubmit: true, readOnly: false, reason: null, tier: normalizedTier, questionTier };
};

export const buildQuestionIndex = (sections) => {
  const index = {};
  Object.values(sections).forEach((sectionList) => {
    sectionList.forEach((section) => {
      section.questions.forEach((question) => {
        index[question.id] = {
          ...question,
          tier: question.tier || section.tier || 'Seed'
        };
      });
    });
  });
  return index;
};

export const authorizeSubmission = (question, userTier) => {
  const access = getQuestionAccess(question, userTier);
  if (!access.canSubmit) {
    const error = new Error('Forbidden');
    error.status = 403;
    error.reason = access.reason;
    throw error;
  }
  return access;
};

export const getTierComparison = (sections, userTier) => {
  const normalizedTier = normalizeTier(userTier);
  const userIndex = getTierIndex(normalizedTier);
  const grouped = {};

  Object.values(sections).forEach((sectionList) => {
    sectionList.forEach((section) => {
      section.questions.forEach((question) => {
        const questionTier = normalizeTier(question?.tier || section.tier || 'Seed');
        const questionIndex = getTierIndex(questionTier);
        if (questionIndex > userIndex) {
          if (!grouped[questionTier]) grouped[questionTier] = [];
          grouped[questionTier].push(question.label);
        }
      });
    });
  });

  return grouped;
};
