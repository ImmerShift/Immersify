
export const SECTIONS = {
  brand_core: [
    {
      id: "core_purpose",
      label: "Why does your brand exist beyond making money?",
      subLabel: "",
      placeholder: "Explain the deeper mission behind your brand.",
      tier: "Seed",
      type: "textarea",
      aiTag: "Mission",
      minChars: 20
    },
    {
      id: "core_vision",
      label: "Where do you see the brand in 10 years?",
      subLabel: "",
      placeholder: "Describe the future state you are building toward.",
      tier: "Seed",
      type: "textarea",
      aiTag: "Vision",
      minChars: 20
    },
    {
      id: "core_values",
      label: "What are your 3 non-negotiable guiding principles?",
      subLabel: "",
      placeholder: "List the core values that drive every decision.",
      tier: "Seed",
      type: "textarea",
      aiTag: "Values",
      minChars: 15
    }
  ],
  visual_identity: [
    {
      id: "visual_logo",
      label: "Upload your primary logo.",
      subLabel: "",
      placeholder: "Upload a PNG, SVG, or JPG file.",
      tier: "Seed",
      type: "upload",
      aiTag: "Logo",
      minChars: 0
    },
    {
      id: "visual_palette_primary",
      label: "Select your primary brand color.",
      subLabel: "",
      placeholder: "Choose one dominant brand color.",
      tier: "Seed",
      type: "color",
      aiTag: "Primary Color",
      minChars: 0
    },
    {
      id: "visual_consistency",
      label: "How consistent is your visual identity across all current touchpoints?",
      subLabel: "",
      placeholder: "Rate your visual consistency.",
      tier: "Seed",
      type: "rating",
      aiTag: "Visual Consistency",
      minChars: 0
    }
  ],
  product_experience: [
    {
      id: "product_signature",
      label: "What is the one 'signature moment' customers always remember?",
      subLabel: "",
      placeholder: "Describe the exact moment that stands out.",
      tier: "Sprout",
      type: "textarea",
      aiTag: "USP",
      minChars: 20
    },
    {
      id: "product_journey",
      label: "Describe the customer journey from discovery to purchase.",
      subLabel: "",
      placeholder: "Outline the steps from first touch to conversion.",
      tier: "Sprout",
      type: "textarea",
      aiTag: "UX Flow",
      minChars: 30
    }
  ],
  market_plan: [
    {
      id: "market_target",
      label: "Who is your absolute ideal customer profile (ICP)?",
      subLabel: "",
      placeholder: "Describe demographics, behaviors, and needs.",
      tier: "Sprout",
      type: "textarea",
      aiTag: "Target Audience",
      minChars: 20
    },
    {
      id: "market_competitors",
      label: "Who are your top 3 direct competitors?",
      subLabel: "",
      placeholder: "List the three closest competitors.",
      tier: "Sprout",
      type: "text",
      aiTag: "Competition",
      minChars: 5
    }
  ],
  technology: [
    {
      id: "tech_stack",
      label: "What platforms run your business (CRM, CMS, etc.)?",
      subLabel: "",
      placeholder: "List your core platforms and tools.",
      tier: "Star",
      type: "textarea",
      aiTag: "Tech Stack",
      minChars: 15
    },
    {
      id: "tech_data",
      label: "How do you currently collect and use customer data?",
      subLabel: "",
      placeholder: "Explain collection, storage, and usage.",
      tier: "Star",
      type: "textarea",
      aiTag: "Data Strategy",
      minChars: 20
    }
  ],
  brand_activation: [
    {
      id: "activation_campaigns",
      label: "Describe your most successful past marketing campaign.",
      subLabel: "",
      placeholder: "What made it effective and memorable?",
      tier: "Star",
      type: "textarea",
      aiTag: "Marketing History",
      minChars: 20
    }
  ],
  team_branding: [
    {
      id: "team_culture",
      label: "How do your employees describe working here?",
      subLabel: "",
      placeholder: "Describe the internal culture in their words.",
      tier: "Superbrand",
      type: "textarea",
      aiTag: "Internal Culture",
      minChars: 20
    }
  ],
  security_trust: [
    {
      id: "trust_compliance",
      label: "What certifications or security measures do you have in place?",
      subLabel: "",
      placeholder: "List relevant certifications and safeguards.",
      tier: "Superbrand",
      type: "textarea",
      aiTag: "Trust Signals",
      minChars: 15
    }
  ]
};

export const ACHIEVEMENTS = [
  {
    id: "first_step",
    title: "The Awakening",
    description: "Started the journey by answering the first question.",
    icon: "🌱",
    condition: (ratings) => Object.keys(ratings).length >= 1
  },
  {
    id: "brand_architect",
    title: "Brand Architect",
    description: "Completed all Brand Core questions.",
    icon: "🏛️",
    condition: (ratings, sections) =>
      (sections.brand_core || []).every((q) => ratings[q.id] && ratings[q.id] !== "Not Applicable")
  },
  {
    id: "visual_virtuoso",
    title: "Visual Virtuoso",
    description: "Completed all Visual Identity questions.",
    icon: "🎨",
    condition: (ratings, sections) =>
      (sections.visual_identity || []).every((q) => ratings[q.id] && ratings[q.id] !== "Not Applicable")
  },
  {
    id: "rising_star",
    title: "Rising Star",
    description: "Achieved an overall Brand Health Score of 50% or higher.",
    icon: "⭐",
    condition: (ratings, sections, score) => score >= 50
  },
  {
    id: "superbrand_status",
    title: "Superbrand Legend",
    description: "Achieved Superbrand status (Score > 75%).",
    icon: "👑",
    condition: (ratings, sections, score) => score > 75
  }
];
