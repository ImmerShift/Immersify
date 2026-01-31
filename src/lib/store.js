export const STORAGE_KEY = 'immersify_app_v2';

export const getStore = () => {
  try {
    const data = localStorage.getItem(STORAGE_KEY);
  const store = data ? JSON.parse(data) : {
      userTier: null,
      answers: {},
      strategy: null,
      apiKey: '',
      brandLevel: null,
      levelHistory: [],
      levelAuditLog: [],
      permissionAuditLog: []
    };
    
    // Always inject env key if available (Secret Mode)
    if (import.meta.env.VITE_GEMINI_API_KEY) {
      store.apiKey = import.meta.env.VITE_GEMINI_API_KEY;
    }
    
    return store;
  } catch (e) {
    console.error("Storage Error:", e);
    return {};
  }
};

export const updateStore = (updates) => {
  const current = getStore();
  const next = { ...current, ...updates };
  localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
  return next;
};

export const clearStore = () => {
  localStorage.removeItem(STORAGE_KEY);
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

  localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
  return { success: true, brandLevel: nextBrandLevel };
};
