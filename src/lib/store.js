import { useSyncExternalStore } from 'react';
import { calculateScore, determineTier, TIERS } from '@/lib/utils';

export const STORAGE_KEY = 'immersify_app_v2';

const DEFAULT_STATE = {
  userTier: null,
  answers: {},
  ratings: {},
  mentorFeedback: {},
  strategy: null,
  apiKey: '',
  brandLevel: null,
  levelHistory: [],
  levelAuditLog: [],
  permissionAuditLog: []
};

let storeState = null;

const listeners = new Set();

const emitChange = () => {
  listeners.forEach((listener) => listener());
};

export const subscribe = (listener) => {
  listeners.add(listener);
  return () => listeners.delete(listener);
};

const loadStoreState = () => {
  if (storeState) return storeState;
  try {
    const data = localStorage.getItem(STORAGE_KEY);
    const parsed = data ? JSON.parse(data) : { ...DEFAULT_STATE };
    if (import.meta.env.VITE_GEMINI_API_KEY) {
      parsed.apiKey = import.meta.env.VITE_GEMINI_API_KEY;
    }
    storeState = parsed;
    return storeState;
  } catch (e) {
    console.error("Storage Error:", e);
    storeState = { ...DEFAULT_STATE };
    return storeState;
  }
};

export const getStore = () => {
  return loadStoreState();
};

export const updateStore = (updates) => {
  const current = getStore();
  const next = { ...current, ...updates };
  storeState = next;
  localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
  emitChange();
  return next;
};

const normalizeTier = (tier) => TIERS.includes(tier) ? tier : 'Seed';
const getTierIndex = (tier) => TIERS.indexOf(normalizeTier(tier));

const applyTierUpdate = (state, nextAnswers, nextRatings) => {
  const scores = calculateScore(nextAnswers, nextRatings);
  const targetTier = determineTier(scores.overallScore);
  const currentTier = normalizeTier(state.brandLevel?.level || state.userTier || 'Seed');
  if (getTierIndex(targetTier) > getTierIndex(currentTier)) {
    const brandLevel = {
      level: targetTier,
      score: scores.overallScore,
      metrics: scores,
      updatedAt: new Date().toISOString()
    };
    return {
      ...state,
      answers: nextAnswers,
      ratings: nextRatings,
      brandLevel,
      userTier: targetTier
    };
  }
  return {
    ...state,
    answers: nextAnswers,
    ratings: nextRatings
  };
};

export const setAnswer = (id, value) => {
  const current = getStore();
  const nextAnswers = { ...(current.answers || {}), [id]: value };
  const nextRatings = current.ratings || {};
  const next = applyTierUpdate(current, nextAnswers, nextRatings);
  storeState = next;
  localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
  emitChange();
  return next;
};

export const setRating = (id, value) => {
  const current = getStore();
  const nextRatings = { ...(current.ratings || {}), [id]: value };
  const nextAnswers = current.answers || {};
  const next = applyTierUpdate(current, nextAnswers, nextRatings);
  storeState = next;
  localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
  emitChange();
  return next;
};

export const clearStore = () => {
  localStorage.removeItem(STORAGE_KEY);
  storeState = { ...DEFAULT_STATE };
  emitChange();
  return getStore();
};

export const rollbackLastLevelChange = () => {
  const store = getStore();
  const history = store.levelHistory || [];

  if (history.length === 0) {
    return { success: false, message: 'No level history to rollback.' };
  }

  const trimmedHistory = history.slice(0, -1);
  const previousEntry = trimmedHistory[trimmedHistory.length - 1];

  const nextBrandLevel = previousEntry ? {
    level: previousEntry.to,
    score: previousEntry.score,
    metrics: previousEntry.metrics,
    updatedAt: new Date().toISOString()
  } : null;

  const auditEntry = {
    timestamp: new Date().toISOString(),
    action: 'rollback',
    from: history[history.length - 1].to,
    to: previousEntry ? previousEntry.to : null,
    reason: 'user_rollback'
  };

  const next = {
    ...store,
    brandLevel: nextBrandLevel,
    userTier: nextBrandLevel ? nextBrandLevel.level : store.userTier,
    levelHistory: trimmedHistory,
    levelAuditLog: [...(store.levelAuditLog || []), auditEntry],
    permissionAuditLog: store.permissionAuditLog || []
  };

  storeState = next;
  localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
  emitChange();
  return { success: true, brandLevel: nextBrandLevel };
};

export const useStore = (selector = (state) => state) => {
  const getSnapshot = () => selector(getStore());
  return useSyncExternalStore(subscribe, getSnapshot, getSnapshot);
};
