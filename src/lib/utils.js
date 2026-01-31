import { clsx } from "clsx"
import { twMerge } from "tailwind-merge"
import { SECTIONS, ACHIEVEMENTS } from './constants';

export const BRAND_LEVELS = ['Seed', 'Sprout', 'Star', 'Superbrand'];

const getLevelIndex = (level) => BRAND_LEVELS.indexOf(level);
const getLevelFromScore = (score) => {
  if (score > 75) return 'Superbrand';
  if (score > 50) return 'Star';
  if (score > 25) return 'Sprout';
  return 'Seed';
};

const isTextValue = (value) => typeof value === 'string' && !value.startsWith('data:') && !value.startsWith('#');

const getQuestionIds = () => Object.values(SECTIONS).flatMap((sectionList) =>
  sectionList.flatMap((section) => section.questions.map((q) => q.id))
);

export function cn(...inputs) {
  return twMerge(clsx(inputs))
}

export function calculateBrandHealth(ratings = {}) {
  let totalScore = 0;
  let totalQuestions = 0;
  const pillarScores = {};

  Object.entries(SECTIONS).forEach(([pillarKey, sections]) => {
    let pillarTotal = 0;
    let pillarCount = 0;

    sections.forEach(section => {
      section.questions.forEach(q => {
        const rating = ratings[q.id];
        let score = 0;
        
        if (rating === 'Excellent') score = 100;
        else if (rating === 'Good') score = 66;
        else if (rating === 'Needs Major Improvement') score = 33;
        else if (rating === 'Not Applicable') score = 0;
        
        // Exclude 'Not Applicable' from the denominator
        if (rating !== 'Not Applicable') {
          // If unrated (undefined), score is 0 but it counts towards the total (penalizing incomplete profiles)
          if (rating) {
             pillarTotal += score;
          }
          pillarCount++;
        }
      });
    });

    const pScore = pillarCount > 0 ? Math.round(pillarTotal / pillarCount) : 0;
    pillarScores[pillarKey] = pScore;
    
    totalScore += pillarTotal;
    totalQuestions += pillarCount;
  });

  const overallScore = totalQuestions > 0 ? Math.round(totalScore / totalQuestions) : 0;
  
  // Tier Logic
  let tier = 'Seed';
  if (overallScore > 75) tier = 'Superbrand';
  else if (overallScore > 50) tier = 'Star';
  else if (overallScore > 25) tier = 'Sprout';

  // Identify Critical Gaps (Top 3 Priorities)
  const gaps = [];
  Object.values(SECTIONS).flat().forEach(section => {
    section.questions.forEach(q => {
      const rating = ratings[q.id];
      // Priority 1: Seed items that are missing or poor
      if (q.recommended === 'SEED') {
        if (!rating || rating === 'Needs Major Improvement') {
          gaps.push({
            id: q.id,
            text: `Improve: ${q.label}`,
            priority: 'High',
            section: section.title
          });
        }
      }
      // Priority 2: Any items marked 'Needs Major Improvement'
      else if (rating === 'Needs Major Improvement') {
        gaps.push({
          id: q.id,
          text: `Refine: ${q.label}`,
          priority: 'Medium',
          section: section.title
        });
      }
    });
  });

  // Sort: High priority first, then take top 3
  const topPriorities = gaps
    .sort((a, b) => (a.priority === 'High' ? -1 : 1))
    .slice(0, 3);

  // Gamification: Calculate Earned Badges
  const earnedBadges = ACHIEVEMENTS.filter(badge => badge.condition(ratings, SECTIONS, overallScore));

  return {
    overallScore,
    pillarScores,
    tier,
    topPriorities,
    earnedBadges
  };
}

const validateLevelChange = (prevLevel, nextLevel, metrics) => {
  const prevIndex = getLevelIndex(prevLevel) >= 0 ? getLevelIndex(prevLevel) : 0;
  const nextIndex = getLevelIndex(nextLevel) >= 0 ? getLevelIndex(nextLevel) : 0;

  if (nextIndex <= prevIndex) {
    return { allowed: true, reason: 'stable_or_downshift' };
  }

  if (metrics.answeredTextCount < 6) return { allowed: false, reason: 'insufficient_answers' };
  if (metrics.completionScore < 30) return { allowed: false, reason: 'low_completion' };
  if (metrics.depthScore < 25) return { allowed: false, reason: 'low_depth' };
  if (metrics.consistencyScore < 40) return { allowed: false, reason: 'low_consistency' };

  if (nextIndex - prevIndex > 1 && (metrics.depthScore < 70 || metrics.consistencyScore < 70)) {
    return { allowed: false, reason: 'jump_too_high' };
  }

  return { allowed: true, reason: 'score' };
};

export const assessBrandLevel = (answers = {}, ratings = {}, prevLevel = 'Seed') => {
  const health = calculateBrandHealth(ratings);
  const questionIds = getQuestionIds();
  const textAnswerIds = questionIds.filter((id) => isTextValue(answers[id]));
  const answeredTextIds = textAnswerIds.filter((id) => answers[id].trim().length > 0);

  const wordCounts = answeredTextIds.map((id) => {
    const words = answers[id].trim().split(/\s+/).filter(Boolean);
    return words.length;
  });

  const avgWords = wordCounts.length ? wordCounts.reduce((a, b) => a + b, 0) / wordCounts.length : 0;
  const depthScore = Math.min(100, Math.round((avgWords / 40) * 100));
  const completionScore = textAnswerIds.length ? Math.round((answeredTextIds.length / textAnswerIds.length) * 100) : 0;
  const pairedCount = answeredTextIds.filter((id) => ratings[id]).length;
  const consistencyScore = textAnswerIds.length ? Math.round((pairedCount / textAnswerIds.length) * 100) : 0;
  const progressionScore = Math.round((completionScore + health.overallScore) / 2);

  const weightedScore = Math.round(
    (health.overallScore * 0.5) +
    (depthScore * 0.2) +
    (consistencyScore * 0.2) +
    (progressionScore * 0.1)
  );

  const targetLevel = getLevelFromScore(weightedScore);
  const validation = validateLevelChange(prevLevel, targetLevel, {
    depthScore,
    consistencyScore,
    completionScore,
    answeredTextCount: answeredTextIds.length
  });

  const level = validation.allowed ? targetLevel : prevLevel;
  const levelChanged = level !== prevLevel;
  const updatedAt = new Date().toISOString();

  const metrics = {
    depthScore,
    consistencyScore,
    completionScore,
    progressionScore,
    answerCount: answeredTextIds.length
  };

  const historyEntry = levelChanged ? {
    timestamp: updatedAt,
    from: prevLevel,
    to: level,
    score: weightedScore,
    metrics,
    reason: validation.reason
  } : null;

  const auditEntry = {
    timestamp: updatedAt,
    action: levelChanged ? 'level_change' : 'assessment',
    from: prevLevel,
    to: level,
    score: weightedScore,
    metrics,
    reason: validation.reason,
    targetLevel
  };

  const levelIndexChange = getLevelIndex(level) - getLevelIndex(prevLevel);

  return {
    level,
    score: weightedScore,
    metrics,
    health,
    levelChanged,
    historyEntry,
    auditEntry,
    blockedReason: validation.allowed ? null : validation.reason,
    targetLevel,
    levelIndexChange,
    updatedAt
  };
};
