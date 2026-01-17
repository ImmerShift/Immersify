// src/api/client.js

export const api = {
  auth: {
    me: async () => {
      const res = await fetch('/api/auth/me');
      return res.json();
    },
    logout: () => {
      window.location.reload(); // Simple reload to clear session for now
    }
  },

  questionnaire: {
    // Get the latest questionnaire for the user
    get: async () => {
      const res = await fetch('/api/questionnaire');
      const data = await res.json();
      return data ? [data] : [];
    },

    // Save or Update responses
    save: async (data) => {
      const res = await fetch('/api/questionnaire', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
      });
      return res.json();
    }
  },

  files: {
    upload: async ({ file }) => {
      const formData = new FormData();
      formData.append('file', file);

      const res = await fetch('/api/upload', {
        method: 'POST',
        body: formData
      });
      return res.json();
    }
  },

  ai: {
    // Determine if we need simple feedback or full analysis
    invoke: async ({ prompt }) => {
      const isAnalysis = prompt.includes("Brand Maturity Tier");
      const endpoint = isAnalysis ? '/api/ai/analyze' : '/api/ai/feedback';

      let body = {};

      if (isAnalysis) {
         // For full analysis, the server handles context via DB usually, 
         // but we pass a placeholder here to match the endpoint signature.
         body = { questionnaire: { maturity_tier: "Unknown", responses: {} } }; 
      } else {
         // Parse the prompt to extract specific inputs for feedback
         const inputMatch = prompt.match(/User's response: "(.*)"/);
         const contextMatch = prompt.match(/Analyze this user input for their (.*)\./);

         body = {
           value: inputMatch ? inputMatch[1] : "",
           context: contextMatch ? contextMatch[1] : "general"
         };
      }

      const res = await fetch(endpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body)
      });
      return res.json();
    }
  }
};