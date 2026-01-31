export const STORAGE_KEY = 'immersify_app_v2';

export const getStore = () => {
  try {
    const data = localStorage.getItem(STORAGE_KEY);
    return data ? JSON.parse(data) : {
      userTier: null, // 'Seed', 'Sprout', 'Star', 'Superbrand'
      answers: {},    // Questionnaire responses
      strategy: null, // Generated IBE Strategy
      apiKey: '',     // User's Gemini API Key (stored locally for demo)
    };
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
