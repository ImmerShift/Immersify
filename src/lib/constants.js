
export const SECTIONS = {
  "brand_core": [
    {
      id: "core_seed",
      title: "Brand Core Story & Ideation",
      tier: "Seed",
      questions: [
        { id: "core_why", label: "Why does your brand exist beyond profit?", placeholder: "Enter your response...", tips: ["What problem pulled you into this?", "What change do you want to see?"], recommended: "SEED" },
        { id: "core_how", label: "How do you solve the problem in your unique way?", placeholder: "Enter your response...", tips: ["Describe your process.", "What makes your way different?"], recommended: "SEED" },
        { id: "core_what", label: "What do you offer right now?", placeholder: "Enter your response...", tips: ["List your core products/services.", "Be specific."], recommended: "SEED" },
        { id: "core_story", label: "What is your 1-sentence origin story?", placeholder: "Enter your response...", tips: ["Origin + mission in one line.", "Keep it human."], recommended: "SEED" },
        { id: "core_emotion", label: "What emotion should customers feel after experiencing you?", placeholder: "Enter your response...", tips: ["Pick one emotion.", "Be consistent."], recommended: "SEED" }
      ]
    },
    {
      id: "core_sprout",
      title: "Proof & Clarity",
      tier: "Sprout",
      questions: [
        { id: "sprout_proof", label: "What proof shows your brand promise is real?", placeholder: "Enter your response...", tips: ["Examples, testimonials, results." ] },
        { id: "sprout_promise", label: "What is your strongest brand promise in one sentence?", placeholder: "Enter your response...", tips: ["Clear, specific, honest." ] }
      ]
    },
    {
      id: "core_star",
      title: "Belief & Differentiation",
      tier: "Star",
      questions: [
        { id: "star_belief", label: "What belief do loyal customers repeat about you?", placeholder: "Enter your response...", tips: ["Something they say without you prompting." ] },
        { id: "star_diff", label: "What line clearly separates you from the closest competitor?", placeholder: "Enter your response...", tips: ["One sentence, no fluff." ] }
      ]
    },
    {
      id: "core_superbrand",
      title: "Legacy & Philosophy",
      tier: "Superbrand",
      questions: [
        { id: "superbrand_philosophy", label: "What is your brand philosophy in one powerful sentence?", placeholder: "Enter your response...", tips: ["Timeless, direct, memorable." ] },
        { id: "superbrand_legacy", label: "What legacy do you want the brand to leave in 10 years?", placeholder: "Enter your response...", tips: ["Beyond sales. Impact and trust." ] }
      ]
    }
  ],
  "visual": [
    {
      id: "visual_seed",
      title: "Visual Identity Foundations",
      tier: "Seed",
      questions: [
        { id: "logo_upload", type: "upload", label: "Upload your primary logo", subLabel: "Upload logo variation (optional)" },
        { id: "logo_desc", label: "Describe your logo and what it represents", placeholder: "Enter your response...", tips: ["Symbols, shapes, and meaning."], recommended: "SEED" },
        { id: "colors_primary", type: "color", label: "Primary Brand Colors (pick up to 2)" },
        { id: "colors_secondary", type: "color", label: "Secondary/Accent Colors (pick up to 4)" },
        { id: "colors_emotion", label: "What emotions should your colors evoke?", placeholder: "Enter your response...", tips: ["Color psychology matters.", "Be intentional."], recommended: "SEED" }
      ]
    },
    {
      id: "visual_sprout",
      title: "Consistency System",
      tier: "Sprout",
      questions: [
        { id: "logo_vars", label: "Do you have logo variations for different contexts?", placeholder: "Enter your response...", tips: ["Light/dark, small/large." ] },
        { id: "colors_guide", label: "Are color usage rules documented and applied?", placeholder: "Enter your response...", tips: ["Strict rules vs flexible use." ] },
        { id: "imagery_style", label: "What is your visual style across materials?", placeholder: "Enter your response...", tips: ["Photography, illustration, layout." ] }
      ]
    },
    {
      id: "visual_star",
      title: "Visual Authority",
      tier: "Star",
      questions: [
        { id: "fonts_select", type: "font", label: "Select your brand fonts (pick 1-2 from Google Fonts)" },
        { id: "fonts_why", label: "Why did you choose these fonts?", placeholder: "Enter your response...", tips: ["What do they communicate?" ] },
        { id: "imagery_consistent", label: "Is imagery consistent across all touchpoints?", placeholder: "Enter your response...", tips: ["Every channel, same vibe." ] }
      ]
    },
    {
      id: "visual_superbrand",
      title: "Iconic Identity",
      tier: "Superbrand",
      questions: [
        { id: "visual_iconic", label: "What visual element is iconic enough to stand alone?", placeholder: "Enter your response...", tips: ["No text required." ] },
        { id: "visual_system_scale", label: "How will the identity stay consistent across regions?", placeholder: "Enter your response...", tips: ["Rules, guardians, audits." ] }
      ]
    }
  ],
  "product": [
    {
      id: "product_seed",
      title: "Product Experience Basics",
      tier: "Seed",
      questions: [
        { id: "prod_desc", label: "Describe your core product or service", placeholder: "Enter your response...", tips: ["What are you selling?", "Who is it for?"], recommended: "SEED" },
        { id: "prod_align", label: "How does your product align with your brand promise?", placeholder: "Enter your response...", tips: ["Does it deliver what you say?"], recommended: "SEED" },
        { id: "prod_difference", label: "What makes your product experience different?", placeholder: "Enter your response...", tips: ["Taste, feel, speed, packaging."], recommended: "SEED" },
        { id: "prod_moment", label: "What is the moment of delight in the first use?", placeholder: "Enter your response...", tips: ["One clear moment."], recommended: "SEED" },
        { id: "prod_standard", label: "What is your minimum quality standard?", placeholder: "Enter your response...", tips: ["Consistency first."], recommended: "SEED" }
      ]
    },
    {
      id: "product_sprout",
      title: "Journey & Touchpoints",
      tier: "Sprout",
      questions: [
        { id: "cust_journey", label: "Map the typical customer journey", placeholder: "Enter your response...", tips: ["Awareness to repeat." ] },
        { id: "cust_touchpoints", label: "List your main customer touchpoints", placeholder: "Enter your response...", tips: ["Web, store, social, email." ] },
        { id: "cust_consistency", label: "Is the experience consistent at every touchpoint?", placeholder: "Enter your response...", tips: ["Same feeling everywhere." ] }
      ]
    },
    {
      id: "product_star",
      title: "Quality & Improvement",
      tier: "Star",
      questions: [
        { id: "qual_measure", label: "How do you measure and maintain quality?", placeholder: "Enter your response...", tips: ["QA, reviews, repeat." ] },
        { id: "cust_feedback", label: "How do you gather and act on feedback?", placeholder: "Enter your response...", tips: ["Fast loop, real action." ] }
      ]
    },
    {
      id: "product_superbrand",
      title: "Signature Experience",
      tier: "Superbrand",
      questions: [
        { id: "superbrand_signature", label: "What signature experience makes people choose you at higher price?", placeholder: "Enter your response...", tips: ["One clear reason." ] },
        { id: "superbrand_quality_system", label: "What system protects quality at scale?", placeholder: "Enter your response...", tips: ["Processes, audits, standards." ] }
      ]
    }
  ],
  "market": [
    {
      id: "market_seed",
      title: "Market Plan Fundamentals",
      tier: "Seed",
      questions: [
        { id: "market_target", label: "Who is your first target customer?", placeholder: "Enter your response...", tips: ["Age, habit, location."], recommended: "SEED" },
        { id: "market_location", label: "Where do they usually discover you?", placeholder: "Enter your response...", tips: ["Street, social, delivery apps."], recommended: "SEED" },
        { id: "market_price", label: "What is your pricing logic today?", placeholder: "Enter your response...", tips: ["Cheap, fair, premium-small."], recommended: "SEED" },
        { id: "market_goal", label: "What is your 30-day sales goal?", placeholder: "Enter your response...", tips: ["Numeric and realistic."], recommended: "SEED" },
        { id: "market_competitor_diff", label: "What is your one clear difference vs the closest competitor?", placeholder: "Enter your response...", tips: ["One sentence."], recommended: "SEED" }
      ]
    },
    {
      id: "market_sprout",
      title: "Channel Focus",
      tier: "Sprout",
      questions: [
        { id: "sprout_channel", label: "Which channel brings real customers now?", placeholder: "Enter your response...", tips: ["Focus on one." ] },
        { id: "sprout_message", label: "What is your strongest marketing message?", placeholder: "Enter your response...", tips: ["Clear and direct." ] },
        { id: "sprout_repeat", label: "What drives repeat purchase today?", placeholder: "Enter your response...", tips: ["Habit, quality, convenience." ] }
      ]
    },
    {
      id: "market_star",
      title: "Growth Strategy",
      tier: "Star",
      questions: [
        { id: "market_trends", label: "What market trends affect you most?", placeholder: "Enter your response...", tips: ["Tech, culture, economy." ] },
        { id: "marketing_roi", label: "How do you measure and improve marketing ROI?", placeholder: "Enter your response...", tips: ["KPIs and optimization." ] },
        { id: "acq_strategy", label: "What is your acquisition strategy at scale?", placeholder: "Enter your response...", tips: ["Channel mix and focus." ] }
      ]
    },
    {
      id: "market_superbrand",
      title: "Category Leadership",
      tier: "Superbrand",
      questions: [
        { id: "superbrand_position", label: "What market position do you want to own permanently?", placeholder: "Enter your response...", tips: ["Category dominance." ] },
        { id: "superbrand_partnerships", label: "What strategic partnership locks your leadership?", placeholder: "Enter your response...", tips: ["Choose one." ] }
      ]
    }
  ],
  "tech": [
    {
      id: "tech_seed",
      title: "Technology & Accessibility Basics",
      tier: "Seed",
      questions: [
        { id: "tech_find", label: "How can customers find you fast today?", placeholder: "Enter your response...", tips: ["Maps, IG, WhatsApp."], recommended: "SEED" },
        { id: "tech_order", label: "What is the fastest way to order from you?", placeholder: "Enter your response...", tips: ["One clear path."], recommended: "SEED" },
        { id: "tech_contact", label: "How can customers ask questions easily?", placeholder: "Enter your response...", tips: ["WhatsApp, DM, phone."], recommended: "SEED" },
        { id: "tech_payments", label: "What payments are easiest for your customers?", placeholder: "Enter your response...", tips: ["Cash, QR, transfer."], recommended: "SEED" },
        { id: "tech_menu", label: "How do customers see your menu quickly?", placeholder: "Enter your response...", tips: ["Printed, QR, link."], recommended: "SEED" }
      ]
    },
    {
      id: "tech_sprout",
      title: "Digital Presence",
      tier: "Sprout",
      questions: [
        { id: "website_state", label: "Do you have a website? Describe its current state.", placeholder: "Enter your response...", tips: ["Modern, mobile, clear." ] },
        { id: "mobile_opt", label: "Is your website optimized for mobile?", placeholder: "Enter your response...", tips: ["Speed, layout, CTA." ] },
        { id: "web_brand_align", label: "How does your website reflect your brand?", placeholder: "Enter your response...", tips: ["Visuals, tone, UX." ] }
      ]
    },
    {
      id: "tech_star",
      title: "Systems & Tools",
      tier: "Star",
      questions: [
        { id: "tools_ops", label: "What key tools run your operations?", placeholder: "Enter your response...", tips: ["CRM, analytics, POS." ] },
        { id: "system_integration", label: "Do your systems integrate well?", placeholder: "Enter your response...", tips: ["Smooth data flow." ] },
        { id: "tech_personalization", label: "How do you personalize the customer experience?", placeholder: "Enter your response...", tips: ["Data-driven actions." ] }
      ]
    },
    {
      id: "tech_superbrand",
      title: "Data & Intelligence",
      tier: "Superbrand",
      questions: [
        { id: "key_metrics", label: "What key metrics do you track?", placeholder: "Enter your response...", tips: ["Traffic, conversion, retention." ] },
        { id: "data_decisions", label: "How do you use data to drive decisions?", placeholder: "Enter your response...", tips: ["A/B tests, cohorts." ] },
        { id: "predictive_analytics", label: "Do you use predictive analytics or AI insights?", placeholder: "Enter your response...", tips: ["Forecasting, alerts." ] }
      ]
    }
  ],
  "brand_activation": [
    {
      id: "activation_seed",
      title: "Brand Activation Starters",
      tier: "Seed",
      questions: [
        { id: "activation_first_buzz", label: "What one action creates your first buzz?", placeholder: "Enter your response...", tips: ["Small, fast, real."], recommended: "SEED" },
        { id: "activation_hook", label: "What hook makes people stop and notice?", placeholder: "Enter your response...", tips: ["One line or visual."], recommended: "SEED" },
        { id: "activation_photo", label: "What photo moment makes people share?", placeholder: "Enter your response...", tips: ["Something visual."], recommended: "SEED" },
        { id: "activation_campaign", label: "What is your smallest no-budget campaign?", placeholder: "Enter your response...", tips: ["Keep it simple."], recommended: "SEED" },
        { id: "activation_sample", label: "What is your first sampling or trial idea?", placeholder: "Enter your response...", tips: ["Low cost, high impact."], recommended: "SEED" }
      ]
    },
    {
      id: "activation_sprout",
      title: "Activation Rhythm",
      tier: "Sprout",
      questions: [
        { id: "activation_weekly", label: "What weekly activation will you repeat?", placeholder: "Enter your response...", tips: ["Consistency wins." ] },
        { id: "activation_collab", label: "What collaboration can you run monthly?", placeholder: "Enter your response...", tips: ["Local partners." ] },
        { id: "activation_share", label: "What shareable moment is strongest this month?", placeholder: "Enter your response...", tips: ["One clear moment." ] }
      ]
    },
    {
      id: "activation_star",
      title: "Local Dominance",
      tier: "Star",
      questions: [
        { id: "activation_event", label: "What event could make you locally unforgettable?", placeholder: "Enter your response...", tips: ["Community or culture." ] },
        { id: "activation_story", label: "What story will you turn into a campaign?", placeholder: "Enter your response...", tips: ["Human, real." ] }
      ]
    },
    {
      id: "activation_superbrand",
      title: "Flagship Moments",
      tier: "Superbrand",
      questions: [
        { id: "activation_flagship", label: "What flagship campaign creates talk without discounts?", placeholder: "Enter your response...", tips: ["Equity over price." ] },
        { id: "activation_ritual", label: "What annual ritual do fans expect?", placeholder: "Enter your response...", tips: ["Signature event." ] }
      ]
    }
  ],
  "team_branding": [
    {
      id: "team_seed",
      title: "Team Branding Basics",
      tier: "Seed",
      questions: [
        { id: "team_attitude", label: "What attitude must every customer feel?", placeholder: "Enter your response...", tips: ["One clear tone."], recommended: "SEED" },
        { id: "team_greeting", label: "What greeting ritual will every customer get?", placeholder: "Enter your response...", tips: ["Simple, repeatable."], recommended: "SEED" },
        { id: "team_nogo", label: "What behavior is never allowed?", placeholder: "Enter your response...", tips: ["Protect the brand."], recommended: "SEED" },
        { id: "team_tone", label: "Describe your service tone in one sentence", placeholder: "Enter your response...", tips: ["Friendly, fast, respectful."], recommended: "SEED" },
        { id: "team_queue", label: "How do you handle queues politely?", placeholder: "Enter your response...", tips: ["Respect time and trust."], recommended: "SEED" }
      ]
    },
    {
      id: "team_sprout",
      title: "Training & Rules",
      tier: "Sprout",
      questions: [
        { id: "team_rules", label: "What 3 rules define your service quality?", placeholder: "Enter your response...", tips: ["Short list." ] },
        { id: "team_training", label: "How do you train a new staff member in one day?", placeholder: "Enter your response...", tips: ["Steps and checklist." ] },
        { id: "team_uniform", label: "What is your standard uniform or visual cue?", placeholder: "Enter your response...", tips: ["Consistency builds trust." ] }
      ]
    },
    {
      id: "team_star",
      title: "Culture & Consistency",
      tier: "Star",
      questions: [
        { id: "team_ambassadors", label: "How do you turn staff into brand ambassadors?", placeholder: "Enter your response...", tips: ["Training and empowerment." ] },
        { id: "team_values", label: "What internal value is strongest today?", placeholder: "Enter your response...", tips: ["One clear value." ] }
      ]
    },
    {
      id: "team_superbrand",
      title: "Scale & Legacy",
      tier: "Superbrand",
      questions: [
        { id: "team_culture", label: "How do you build a culture that sustains excellence without you?", placeholder: "Enter your response...", tips: ["Systems and leaders." ] },
        { id: "team_scale", label: "What system prevents brand drift at scale?", placeholder: "Enter your response...", tips: ["Audits, training, rituals." ] }
      ]
    }
  ],
  "security_trust": [
    {
      id: "trust_seed",
      title: "Security & Trust Basics",
      tier: "Seed",
      questions: [
        { id: "trust_signal", label: "What visible signal builds trust instantly?", placeholder: "Enter your response...", tips: ["Cleanliness, transparency."], recommended: "SEED" },
        { id: "trust_complaints", label: "How do you handle mistakes or complaints?", placeholder: "Enter your response...", tips: ["Polite, fast, fair."], recommended: "SEED" },
        { id: "trust_transparency", label: "What can you show to prove honesty?", placeholder: "Enter your response...", tips: ["Pricing, ingredients, process."], recommended: "SEED" },
        { id: "trust_refund", label: "What is your basic refund or remake policy?", placeholder: "Enter your response...", tips: ["Simple and fair."], recommended: "SEED" },
        { id: "trust_hygiene", label: "How do customers see your hygiene or safety?", placeholder: "Enter your response...", tips: ["Visible practices."], recommended: "SEED" }
      ]
    },
    {
      id: "trust_sprout",
      title: "Trust Signals",
      tier: "Sprout",
      questions: [
        { id: "trust_clean_oil", label: "How do you show product safety consistently?", placeholder: "Enter your response...", tips: ["Quality checks." ] },
        { id: "trust_payment", label: "How do you keep payments secure?", placeholder: "Enter your response...", tips: ["QR, cash handling." ] },
        { id: "trust_promise", label: "What is your trust promise in one sentence?", placeholder: "Enter your response...", tips: ["Short and clear." ] }
      ]
    },
    {
      id: "trust_star",
      title: "Policy & Compliance",
      tier: "Star",
      questions: [
        { id: "trust_policy", label: "What policy protects customers and the brand?", placeholder: "Enter your response...", tips: ["Clear and enforceable." ] },
        { id: "trust_data", label: "How do you protect customer data?", placeholder: "Enter your response...", tips: ["Privacy and security." ] }
      ]
    },
    {
      id: "trust_superbrand",
      title: "Enterprise Trust",
      tier: "Superbrand",
      questions: [
        { id: "trust_public_signal", label: "What public trust signal proves reliability?", placeholder: "Enter your response...", tips: ["Certification, audits." ] },
        { id: "trust_boundary", label: "What ethical boundary will you never cross?", placeholder: "Enter your response...", tips: ["Protect reputation." ] }
      ]
    }
  ]
};

export const ACHIEVEMENTS = [
  {
    id: 'first_step',
    title: 'The Awakening',
    description: 'Started the journey by answering the first question.',
    icon: '🌱',
    condition: (ratings) => Object.keys(ratings).length >= 1
  },
  {
    id: 'brand_architect',
    title: 'Brand Architect',
    description: 'Completed all Brand Core questions.',
    icon: '🏛️',
    condition: (ratings, sections) => {
       const coreIds = sections.brand_core.flatMap(s => s.questions.map(q => q.id));
       return coreIds.every(id => ratings[id] && ratings[id] !== 'Not Applicable');
    }
  },
  {
    id: 'visual_virtuoso',
    title: 'Visual Virtuoso',
    description: 'Completed all Visual Identity questions.',
    icon: '🎨',
    condition: (ratings, sections) => {
       const visualIds = sections.visual.flatMap(s => s.questions.map(q => q.id));
       return visualIds.every(id => ratings[id] && ratings[id] !== 'Not Applicable');
    }
  },
  {
    id: 'rising_star',
    title: 'Rising Star',
    description: 'Achieved an overall Brand Health Score of 50% or higher.',
    icon: '⭐',
    condition: (ratings, sections, score) => score >= 50
  },
  {
    id: 'superbrand_status',
    title: 'Superbrand Legend',
    description: 'Achieved Superbrand status (Score > 75%).',
    icon: '👑',
    condition: (ratings, sections, score) => score > 75
  }
];
