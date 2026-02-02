import { clsx } from "clsx";
import { twMerge } from "tailwind-merge";
import { SECTIONS, ACHIEVEMENTS } from './constants';

export const TIERS = ['Seed', 'Sprout', 'Star', 'Superbrand'];
export const TIER_THRESHOLDS = {
  Seed: 0,
  Sprout: 30,
  Star: 60,
  Superbrand: 85
};

const normalizeTier = (tier) => TIERS.includes(tier) ? tier : 'Seed';
const getTierIndex = (tier) => TIERS.indexOf(normalizeTier(tier));

export function cn(...inputs) {
  return twMerge(clsx(inputs));
}

const getAllQuestions = () => Object.values(SECTIONS).flatMap((questions) => questions);

const ratingToScore = (rating) => {
  if (rating === 'Excellent') return 100;
  if (rating === 'Good') return 75;
  if (rating === 'Poor' || rating === 'Needs Major Improvement') return 25;
  return null;
};

const hasTextAnswer = (value) => typeof value === 'string' && value.trim().length > 0;

const clamp = (value, min, max) => Math.min(Math.max(value, min), max);

const getStatusFromScore = (score) => {
  if (score >= 75) return 'Dominant';
  if (score >= 40) return 'Stable';
  return 'Emerging';
};

const calculateBasePillarScore = (pillarId, ratings = {}) => {
  const questions = SECTIONS[pillarId] || [];
  const scores = questions
    .map((q) => ratingToScore(ratings[q.id]))
    .filter((score) => typeof score === 'number');
  return scores.length
    ? Math.round(scores.reduce((a, b) => a + b, 0) / scores.length)
    : 0;
};

const keywordScore = (text, keywords) => {
  if (!text) return 0;
  const lower = text.toLowerCase();
  const hits = keywords.filter((word) => lower.includes(word)).length;
  return hits;
};

const calculateMarketScore = (answers = {}, ratings = {}, brandTier = 'Seed') => {
  const targetText = typeof answers.market_target === 'string' ? answers.market_target.trim() : '';
  const competitorText = typeof answers.market_competitors === 'string' ? answers.market_competitors.trim() : '';
  const tier = normalizeTier(brandTier);

  const bonusKeywords = ['segmentation', 'attribution', 'unit economics', 'market share', 'retention rate'];
  const bonusHitCount = keywordScore(`${targetText} ${competitorText}`, bonusKeywords);
  const bonusBoost = Math.min(15, bonusHitCount * 3);

  const targetPrecision = clamp(
    Math.round(((targetText.length / 120) * 100)) + bonusBoost,
    0,
    100
  );

  const channelKeywords = [
    'instagram', 'tiktok', 'linkedin', 'youtube', 'google', 'search', 'seo',
    'email', 'newsletter', 'podcast', 'events', 'retail', 'partners', 'affiliate',
    'community', 'webinar'
  ];
  const channelHits = keywordScore(targetText, channelKeywords);
  const channelAlignment = clamp(Math.round(channelHits * 12 + (targetText.length / 40)), 0, 100);

  const acquisitionKeywords = ['cac', 'ltv', 'paid', 'acquisition cost', 'conversion rate', 'roi', 'attribution'];
  const acquisitionHits = keywordScore(`${targetText} ${competitorText}`, acquisitionKeywords);
  const scalabilityIndex = clamp(Math.round(acquisitionHits * 15 + (targetText.length / 60)), 0, 100);

  const penetrationKeywords = ['market share', 'penetration', 'defensible', 'moat', 'dominant', 'category leader'];
  const competitiveHits = keywordScore(competitorText, penetrationKeywords);
  const competitiveAwareness = clamp(Math.round(competitiveHits * 18 + (competitorText.length / 40)), 0, 100);

  let score = 0;
  if (tier === 'Seed') {
    score = targetPrecision;
  } else if (tier === 'Sprout') {
    score = Math.round((channelAlignment + targetPrecision) / 2);
  } else if (tier === 'Star') {
    score = Math.round((scalabilityIndex * 0.6) + (competitiveAwareness * 0.4));
  } else {
    score = Math.round((competitiveAwareness * 0.7) + (scalabilityIndex * 0.3));
  }

  const organicOnlyKeywords = ['organic', 'word of mouth', 'referral', 'community only'];
  const paidSignals = ['paid', 'ads', 'ad spend', 'cac', 'ltv', 'attribution', 'roi'];
  const organicOnly = keywordScore(`${targetText} ${competitorText}`, organicOnlyKeywords) > 0
    && keywordScore(`${targetText} ${competitorText}`, paidSignals) === 0;
  if ((tier === 'Star' || tier === 'Superbrand') && organicOnly) {
    score = Math.min(score, 50);
  }

  const techScore = calculateBasePillarScore('technology', ratings);
  if (score >= 70 && techScore < 40) {
    score = Math.round(score * 0.8);
  }

  const finalScore = clamp(score, 0, 100);
  const strategicInsight = finalScore >= 75
    ? "Your market plan shows real leverage, but it must stay anchored to measurable acquisition economics."
    : finalScore >= 40
      ? "You have directional clarity, but the growth engine is still too dependent on intuition."
      : "You are playing small; define acquisition economics and defensibility before scaling.";

  return {
    pillarId: 'market_plan',
    score: finalScore,
    metrics: {
      targetPrecision,
      scalabilityIndex,
      competitiveAwareness
    },
    strategicInsight
  };
};

const getVisualIdentityScore = (answers = {}, ratings = {}, brandTier = 'Seed') => {
  const logoPresent = !!answers.visual_logo;
  const palettePresent = !!answers.visual_palette_primary;
  const consistencyRating = ratingToScore(ratings.visual_consistency) ?? 0;

  const clarityScore = (logoPresent ? 60 : 0) + (palettePresent ? 40 : 0);
  const consistencyScore = consistencyRating;
  const coreAnswers = ['core_purpose', 'core_vision', 'core_values'];
  const coreAlignmentScore = Math.round(
    (coreAnswers.filter((id) => hasTextAnswer(answers[id])).length / coreAnswers.length) * 100
  );

  const scalabilityScore = Math.round(
    ((logoPresent ? 1 : 0) + (palettePresent ? 1 : 0) + (consistencyRating >= 75 ? 1 : 0)) / 3 * 100
  );
  const omnichannelScore = consistencyRating;
  const assetEquityScore = Math.round(
    ((logoPresent ? 1 : 0) + (palettePresent ? 1 : 0) + (consistencyRating >= 75 ? 1 : 0)) / 3 * 100
  );
  const psychologicalPrimingScore = consistencyRating;

  const tierWeights = {
    Seed: { clarity: 0.8, consistency: 0.2 },
    Sprout: { consistency: 0.5, alignment: 0.5 },
    Star: { scalability: 0.4, omnichannel: 0.6 },
    Superbrand: { equity: 0.3, priming: 0.7 }
  };

  const weights = tierWeights[normalizeTier(brandTier)] || tierWeights.Seed;
  let score = 0;

  if (normalizeTier(brandTier) === 'Seed') {
    score = clarityScore * weights.clarity + consistencyScore * weights.consistency;
  } else if (normalizeTier(brandTier) === 'Sprout') {
    score = consistencyScore * weights.consistency + coreAlignmentScore * weights.alignment;
  } else if (normalizeTier(brandTier) === 'Star') {
    score = scalabilityScore * weights.scalability + omnichannelScore * weights.omnichannel;
  } else {
    score = assetEquityScore * weights.equity + psychologicalPrimingScore * weights.priming;
  }

  const consistencyDescription = typeof answers.visual_consistency === 'string' ? answers.visual_consistency.trim() : '';
  if (consistencyDescription && consistencyDescription.length < 50) {
    score = score * 0.85;
  }

  if (!logoPresent && getTierIndex(brandTier) >= getTierIndex('Sprout')) {
    score = Math.min(score, 30);
  }

  if (!palettePresent && getTierIndex(brandTier) >= getTierIndex('Star')) {
    score = Math.min(score, 40);
  }

  const systemicRisk = normalizeTier(brandTier) === 'Superbrand' && ratings.visual_consistency && ratings.visual_consistency !== 'Excellent';

  const finalScore = Math.round(clamp(score, 0, 100));

  return {
    pillarId: 'visual_identity',
    score: finalScore,
    breakdown: {
      clarity: Math.round(clarityScore),
      consistency: Math.round(consistencyScore),
      defensibility: Math.round(
        normalizeTier(brandTier) === 'Sprout' ? coreAlignmentScore :
          normalizeTier(brandTier) === 'Star' ? scalabilityScore :
            normalizeTier(brandTier) === 'Superbrand' ? psychologicalPrimingScore : 0
      )
    },
    status: getStatusFromScore(finalScore),
    systemicRisk
  };
};

const calculateTechScore = (answers = {}, ratings = {}, brandTier = 'Seed') => {
  const stackText = typeof answers.tech_stack === 'string' ? answers.tech_stack.trim() : '';
  const dataText = typeof answers.tech_data === 'string' ? answers.tech_data.trim() : '';
  const tier = normalizeTier(brandTier);

  const basePresenceKeywords = ['domain', 'website', 'site', 'mobile', 'responsive', 'hosting', 'ssl'];
  const cohesionKeywords = ['crm', 'cms', 'integration', 'zapier', 'automation', 'api', 'sync'];
  const automationKeywords = ['workflow', 'automation', 'trigger', 'pipeline', 'analytics', 'monitoring'];
  const accessibilityKeywords = ['accessibility', 'inclusion', 'wcag', 'screen reader', 'screen readers'];
  const sovereigntyKeywords = ['first-party', 'proprietary', 'data warehouse', 'own data', 'in-house'];

  const basePresenceScore = clamp(keywordScore(`${stackText} ${dataText}`, basePresenceKeywords) * 15 + (stackText.length / 40), 0, 100);
  const cohesionScore = clamp(keywordScore(`${stackText} ${dataText}`, cohesionKeywords) * 18 + (stackText.length / 60), 0, 100);
  const automationScore = clamp(keywordScore(`${stackText} ${dataText}`, automationKeywords) * 18 + (dataText.length / 60), 0, 100);
  const accessibilityScore = clamp(keywordScore(`${stackText} ${dataText}`, accessibilityKeywords) * 25, 0, 100);
  const sovereigntyScore = clamp(keywordScore(`${stackText} ${dataText}`, sovereigntyKeywords) * 20, 0, 100);

  let score = 0;
  if (tier === 'Seed') {
    score = basePresenceScore * 0.8 + automationScore * 0.2;
  } else if (tier === 'Sprout') {
    score = cohesionScore * 0.6 + automationScore * 0.4;
  } else if (tier === 'Star') {
    score = automationScore * 0.7 + cohesionScore * 0.3;
  } else {
    score = accessibilityScore * 0.8 + sovereigntyScore * 0.2;
  }

  const manualIndicators = ['manual', 'spreadsheet', 'excel', 'csv', 'copy paste'];
  const crmIndicators = ['crm', 'hubspot', 'salesforce', 'pipedrive'];
  const manualDetected = keywordScore(`${stackText} ${dataText}`, manualIndicators) > 0;
  const crmMissing = keywordScore(`${stackText} ${dataText}`, crmIndicators) === 0;
  if ((tier === 'Star' || tier === 'Superbrand') && (manualDetected || crmMissing)) {
    score = Math.min(score, 45);
  }

  if (accessibilityScore > 0) {
    score = Math.min(100, score * 1.15);
  }

  if (tier === 'Superbrand' && sovereigntyScore > 0) {
    score = Math.min(100, score + 10);
  }

  const finalScore = Math.round(clamp(score, 0, 100));
  const technicalVerdict = finalScore >= 75
    ? "Your infrastructure can scale, but keep tightening automation and data intelligence."
    : finalScore >= 40
      ? "You have functional infrastructure, but it will strain under aggressive growth."
      : "Your tech foundation is fragile; manual processes will choke scale.";

  return {
    pillarId: 'technology_accessibility',
    score: finalScore,
    audit: {
      infrastructureHealth: Math.round(basePresenceScore),
      automationLevel: Math.round(automationScore),
      accessibilityCompliance: Math.round(accessibilityScore)
    },
    technicalVerdict
  };
};

const calculateActivationScore = (answers = {}, ratings = {}, brandTier = 'Seed') => {
  const activationText = typeof answers.activation_campaigns === 'string' ? answers.activation_campaigns.trim() : '';
  const tier = normalizeTier(brandTier);

  const exposureKeywords = ['reach', 'visibility', 'awareness', 'pr', 'press', 'stunt', 'partnership', 'viral', 'collab', 'launch'];
  const connectionKeywords = ['community', 'event', 'ugc', 'user-generated', 'interactive', 'storytelling', 'ambassador', 'dialogue', 'two-way', 'sensory', 'touchpoints'];
  const immersionKeywords = ['immersive', 'experience', 'live', 'in-person', 'activation', 'pop-up', 'workshop'];

  const exposureHits = keywordScore(activationText, exposureKeywords);
  const connectionHits = keywordScore(activationText, connectionKeywords);
  const immersionHits = keywordScore(activationText, immersionKeywords);

  const exposureReach = clamp(Math.round(exposureHits * 12 + (activationText.length / 50)), 0, 100);
  const connectionDepth = clamp(Math.round(connectionHits * 14 + (activationText.length / 80)), 0, 100);
  const immersionFactor = clamp(Math.round(immersionHits * 15 + (activationText.length / 90)), 0, 100);

  const weights = {
    Seed: { exposure: 0.7, connection: 0.3 },
    Sprout: { exposure: 0.5, connection: 0.5 },
    Star: { exposure: 0.4, connection: 0.6 },
    Superbrand: { exposure: 0.3, connection: 0.7 }
  };

  const tierWeights = weights[tier] || weights.Seed;
  let score = Math.round((tierWeights.exposure * exposureReach) + (tierWeights.connection * connectionDepth));

  const ghostingKeywords = ['social media ads', 'posting content', 'boosted posts', 'just ads'];
  const interactionKeywords = ['event', 'community', 'ugc', 'interactive', 'dialogue', 'ambassador', 'two-way', 'live', 'workshop'];
  const ghosting = keywordScore(activationText, ghostingKeywords) > 0 && keywordScore(activationText, interactionKeywords) === 0;
  if (ghosting) {
    score = Math.round(score * 0.7);
  }

  score = clamp(score + Math.round(immersionFactor * 0.1), 0, 100);

  const advisoryNote = score >= 75
    ? "Your activation has both reach and connection, but keep compounding community-driven loops."
    : score >= 40
      ? "You have visibility, but connection is thin; activation must become a two-way engine."
      : "You have exposure without connection; you are a billboard, not a brand.";

  return {
    pillarId: 'brand_activation',
    score,
    experienceMetrics: {
      exposureReach,
      connectionDepth,
      immersionFactor
    },
    advisoryNote
  };
};

const calculateTeamScore = (answers = {}, ratings = {}, brandTier = 'Seed') => {
  const cultureText = typeof answers.team_culture === 'string' ? answers.team_culture.trim() : '';
  const tier = normalizeTier(brandTier);

  const founderSignals = ['founder', 'mission', 'values', 'purpose', 'leadership'];
  const transmissionSignals = ['story', 'shared', 'communicate', 'values', 'alignment', 'rituals'];
  const standardizationSignals = ['brand bible', 'culture deck', 'guidelines', 'playbook', 'training', 'onboarding'];
  const advocacySignals = ['employee advocacy', 'ambassador', 'brand champion', 'shared values', 'internal training', 'brand bible', 'onboarding'];

  const founderClarity = clamp(keywordScore(cultureText, founderSignals) * 18 + (cultureText.length / 40), 0, 100);
  const culturalConsistency = clamp(keywordScore(cultureText, transmissionSignals) * 16 + (cultureText.length / 45), 0, 100);
  const standardizationScore = clamp(keywordScore(cultureText, standardizationSignals) * 22 + (cultureText.length / 55), 0, 100);
  const advocacyLevel = clamp(keywordScore(cultureText, advocacySignals) * 20 + (cultureText.length / 70), 0, 100);

  let score = 0;
  if (tier === 'Seed') {
    score = founderClarity * 0.9 + culturalConsistency * 0.1;
  } else if (tier === 'Sprout') {
    score = culturalConsistency * 0.7 + founderClarity * 0.3;
  } else if (tier === 'Star') {
    score = standardizationScore * 0.7 + culturalConsistency * 0.3;
  } else {
    score = advocacyLevel * 0.8 + standardizationScore * 0.2;
  }

  const vagueIndicators = ['informal', 'casual', 'ad hoc', 'we just talk', 'vibes'];
  const hasFormalSystem = keywordScore(cultureText, standardizationSignals) > 0;
  const vagueCulture = keywordScore(cultureText, vagueIndicators) > 0 || cultureText.length < 40;
  if ((tier === 'Star' || tier === 'Superbrand') && (!hasFormalSystem || vagueCulture)) {
    score = Math.min(score, 45);
  }

  if (keywordScore(cultureText, advocacySignals) > 0) {
    score = Math.min(100, score * 1.2);
  }

  const coreScore = calculateBasePillarScore('brand_core', ratings);
  const hollowBrandWarning = coreScore >= 70 && score < 40;

  const finalScore = Math.round(clamp(score, 0, 100));
  const internalVerdict = hollowBrandWarning
    ? "Your external story is polished, but internally it is not believed. This is a hollow brand."
    : finalScore >= 75
      ? "Your team acts as a living brand system, not just staff."
      : finalScore >= 40
        ? "Your culture exists, but it is not yet systemized enough to scale."
        : "Your internal alignment is fragile; people cannot defend what they do not understand.";

  return {
    pillarId: 'team_branding',
    score: finalScore,
    internalMetrics: {
      founderClarity: Math.round(founderClarity),
      culturalConsistency: Math.round(culturalConsistency),
      advocacyLevel: Math.round(advocacyLevel)
    },
    internalVerdict
  };
};

const calculateCoreScore = (answers = {}, ratings = {}, brandTier = 'Seed') => {
  const purposeText = typeof answers.core_purpose === 'string' ? answers.core_purpose.trim() : '';
  const visionText = typeof answers.core_vision === 'string' ? answers.core_vision.trim() : '';
  const valuesText = typeof answers.core_values === 'string' ? answers.core_values.trim() : '';
  const combined = `${purposeText} ${visionText} ${valuesText}`.trim();
  const tier = normalizeTier(brandTier);

  const claritySignals = ['purpose', 'why', 'mission', 'impact', 'legacy', 'transformation', 'paradigm'];
  const alignmentSignals = ['action', 'execution', 'goals', 'strategy', 'roadmap', 'plan'];
  const differentiatorSignals = ['unique', 'distinct', 'differentiated', 'unlike', 'only', 'category'];
  const defensibilitySignals = ['moat', 'defensible', 'positioning', 'psychological', 'ownership', 'credibility'];

  const purposeClarity = clamp(keywordScore(combined, claritySignals) * 18 + (purposeText.length / 40), 0, 100);
  const missionAlignment = clamp(keywordScore(combined, alignmentSignals) * 16 + (visionText.length / 45), 0, 100);
  const differentiatorStrength = clamp(keywordScore(combined, differentiatorSignals) * 20 + (valuesText.length / 50), 0, 100);
  const defensibilityIndex = clamp(keywordScore(combined, defensibilitySignals) * 22 + (combined.length / 80), 0, 100);

  let score = 0;
  if (tier === 'Seed') {
    score = purposeClarity * 0.9 + missionAlignment * 0.1;
  } else if (tier === 'Sprout') {
    score = missionAlignment * 0.7 + purposeClarity * 0.3;
  } else if (tier === 'Star') {
    score = differentiatorStrength * 0.6 + missionAlignment * 0.4;
  } else {
    score = defensibilityIndex * 0.8 + differentiatorStrength * 0.2;
  }

  const corporateSpeak = [
    'we want to be the best',
    'customer-centric',
    'world-class service',
    'innovative solutions',
    'industry-leading',
    'best-in-class'
  ];
  const genericDetected = keywordScore(combined, corporateSpeak) > 0 && combined.length < 160;
  if ((tier === 'Star' || tier === 'Superbrand') && genericDetected) {
    score = Math.min(score, 45);
  }

  if (purposeText && purposeText.length < 50) {
    score = Math.round(score * 0.8);
  }

  const integrityKeywords = ['legacy', 'transformation', 'paradigm', 'impact'];
  if (keywordScore(combined, integrityKeywords) > 0) {
    score = Math.min(100, score * 1.15);
  }

  const hollowSoul = ratingToScore(ratings.visual_consistency) === 100 && score < 40;

  const finalScore = Math.round(clamp(score, 0, 100));
  const coreVerdict = hollowSoul
    ? "Hollow Brand warning: your visuals shine, but the core story lacks soul and defensibility."
    : finalScore >= 75
      ? "Your core story is clear and defensible; keep sharpening the narrative edges."
      : finalScore >= 40
        ? "Your core story exists, but it lacks the depth to hold under competitive pressure."
        : "Your brand core is shallow; clarify the why before scaling the how.";

  return {
    pillarId: 'brand_core',
    score: finalScore,
    coreMetrics: {
      purposeClarity: Math.round(purposeClarity),
      strategicUniqueness: Math.round(differentiatorStrength),
      authenticityFactor: Math.round(missionAlignment)
    },
    coreVerdict,
    hollowSoul
  };
};

const calculateSecurityScore = (answers = {}, ratings = {}, brandTier = 'Seed') => {
  const trustText = typeof answers.trust_compliance === 'string' ? answers.trust_compliance.trim() : '';
  const tier = normalizeTier(brandTier);

  const transparencySignals = ['transparent', 'honest', 'limitations', 'terms', 'disclosure'];
  const protectionSignals = ['https', 'ssl', 'privacy policy', 'secure payments', 'pci', '2fa', 'encryption'];
  const reliabilitySignals = ['sla', 'uptime', 'incident', 'crisis', 'backup', 'monitoring', 'support'];
  const sovereigntySignals = ['zero-trust', 'first-party', 'proprietary', 'audit', 'governance', 'risk'];

  const transparencyLevel = clamp(keywordScore(trustText, transparencySignals) * 18 + (trustText.length / 50), 0, 100);
  const dataIntegrity = clamp(keywordScore(trustText, protectionSignals) * 20 + (trustText.length / 60), 0, 100);
  const riskMitigation = clamp(keywordScore(trustText, reliabilitySignals) * 18 + (trustText.length / 70), 0, 100);
  const sovereigntyIndex = clamp(keywordScore(trustText, sovereigntySignals) * 22 + (trustText.length / 80), 0, 100);

  let score = 0;
  if (tier === 'Seed') {
    score = transparencyLevel * 0.8 + dataIntegrity * 0.2;
  } else if (tier === 'Sprout') {
    score = dataIntegrity * 0.7 + transparencyLevel * 0.3;
  } else if (tier === 'Star') {
    score = riskMitigation * 0.7 + dataIntegrity * 0.3;
  } else {
    score = sovereigntyIndex * 0.8 + riskMitigation * 0.2;
  }

  const fragilityIndicators = ['no formal policy', 'just shopify', 'third-party apps', 'no oversight', 'manual'];
  const fragilityDetected = keywordScore(trustText, fragilityIndicators) > 0;
  if ((tier === 'Star' || tier === 'Superbrand') && fragilityDetected) {
    score = Math.min(score, 35);
  }

  const radicalTransparencyKeywords = ['end-to-end encryption', 'first-party data', 'ethical sourcing', 'crisis protocol', 'third-party audit', 'privacy by design'];
  if (keywordScore(trustText, radicalTransparencyKeywords) > 0) {
    score = Math.min(100, score * 1.2);
  }

  const techScore = calculateBasePillarScore('technology', ratings);
  const systemicFragility = techScore >= 70 && score < 40;

  const finalScore = Math.round(clamp(score, 0, 100));
  const securityVerdict = systemicFragility
    ? "Systemic fragility detected: your tech is strong but trust safeguards are weak."
    : finalScore >= 75
      ? "Your trust infrastructure is credible, but it must remain actively governed."
      : finalScore >= 40
        ? "Your trust posture is functional but lacks strategic rigor."
        : "Your security foundation is exposed; fix the trust gaps before scaling.";

  return {
    pillarId: 'security_trust',
    score: finalScore,
    trustProfile: {
      transparencyLevel: Math.round(transparencyLevel),
      dataIntegrity: Math.round(dataIntegrity),
      riskMitigation: Math.round(riskMitigation)
    },
    securityVerdict,
    systemicFragility
  };
};

const calculateProductExperienceScore = (answers = {}, ratings = {}, brandTier = 'Seed') => {
  const signatureText = typeof answers.product_signature === 'string' ? answers.product_signature.trim() : '';
  const journeyText = typeof answers.product_journey === 'string' ? answers.product_journey.trim() : '';
  const combined = `${signatureText} ${journeyText}`.trim();
  const tier = normalizeTier(brandTier);

  const utilitySignals = ['solve', 'problem', 'useful', 'benefit', 'need', 'outcome'];
  const onboardingSignals = ['onboarding', 'unboxing', 'setup', 'first impression', 'first use', 'activation'];
  const retentionSignals = ['retention', 'repeat', 'loyalty', 'habit', 'feedback loop', 'update'];
  const loyaltySignals = ['delight', 'frictionless', 'emotion', 'connection', 'ecosystem', 'lifestyle'];

  const utilityValue = clamp(keywordScore(combined, utilitySignals) * 18 + (signatureText.length / 40), 0, 100);
  const onboardingScore = clamp(keywordScore(combined, onboardingSignals) * 20 + (journeyText.length / 50), 0, 100);
  const retentionPotential = clamp(keywordScore(combined, retentionSignals) * 20 + (journeyText.length / 60), 0, 100);
  const emotionalLoyalty = clamp(keywordScore(combined, loyaltySignals) * 22 + (combined.length / 80), 0, 100);

  let score = 0;
  if (tier === 'Seed') {
    score = utilityValue * 0.8 + onboardingScore * 0.2;
  } else if (tier === 'Sprout') {
    score = onboardingScore * 0.6 + utilityValue * 0.4;
  } else if (tier === 'Star') {
    score = retentionPotential * 0.7 + onboardingScore * 0.3;
  } else {
    score = emotionalLoyalty * 0.8 + retentionPotential * 0.2;
  }

  const frictionIndicators = ['manual support', 'email only', 'no tracking'];
  const frictionDetected = keywordScore(combined, frictionIndicators) > 0;
  if ((tier === 'Star' || tier === 'Superbrand') && frictionDetected) {
    score = Math.min(score, 40);
  }

  const delightKeywords = ['user journey mapping', 'frictionless', 'post-purchase', 'community-led', 'user feedback loop'];
  if (keywordScore(combined, delightKeywords) > 0) {
    score = Math.min(100, score * 1.2);
  }

  const featureSignals = ['feature', 'features', 'function', 'spec', 'specs'];
  const benefitSignals = ['benefit', 'feel', 'experience', 'delight', 'outcome'];
  if (keywordScore(combined, featureSignals) > 0 && keywordScore(combined, benefitSignals) === 0) {
    score = Math.round(score * 0.85);
  }

  const premiumSignals = ['premium', 'luxury', 'exclusive', 'elite', 'high-end'];
  const coreText = `${answers.core_purpose || ''} ${answers.core_vision || ''} ${answers.core_values || ''}`.toLowerCase();
  const corePremium = keywordScore(coreText, premiumSignals) > 0;
  const experienceGeneric = score < 40;

  const finalScore = Math.round(clamp(score, 0, 100));
  const productVerdict = corePremium && experienceGeneric
    ? "Brand-Value Mismatch: the core promises premium, but the experience feels generic."
    : finalScore >= 75
      ? "Your product experience reinforces the brand promise with clarity and loyalty."
      : finalScore >= 40
        ? "Your product delivers value, but friction and retention gaps still leak trust."
        : "Your product experience does not yet match the story you tell the market.";

  return {
    pillarId: 'product_experience',
    score: finalScore,
    experienceMetrics: {
      utilityValue: Math.round(utilityValue),
      frictionLevel: Math.round(100 - clamp(score, 0, 100)),
      retentionPotential: Math.round(retentionPotential)
    },
    productVerdict
  };
};

export const calculatePillarScore = (pillarId, answers = {}, ratings = {}, brandTier = 'Seed') => {
  if (pillarId === 'brand_core') {
    return calculateCoreScore(answers, ratings, brandTier);
  }
  if (pillarId === 'visual_identity') {
    return getVisualIdentityScore(answers, ratings, brandTier);
  }
  if (pillarId === 'market_plan') {
    return calculateMarketScore(answers, ratings, brandTier);
  }
  if (pillarId === 'technology') {
    return calculateTechScore(answers, ratings, brandTier);
  }
  if (pillarId === 'brand_activation') {
    return calculateActivationScore(answers, ratings, brandTier);
  }
  if (pillarId === 'team_branding') {
    return calculateTeamScore(answers, ratings, brandTier);
  }
  if (pillarId === 'security_trust') {
    return calculateSecurityScore(answers, ratings, brandTier);
  }
  if (pillarId === 'product_experience') {
    return calculateProductExperienceScore(answers, ratings, brandTier);
  }
  const pillarScore = calculateBasePillarScore(pillarId, ratings);
  return {
    pillarId,
    score: pillarScore,
    breakdown: {
      clarity: pillarScore,
      consistency: pillarScore,
      defensibility: 0
    },
    status: getStatusFromScore(pillarScore),
    systemicRisk: false
  };
};

export const generateAuditSummary = (answers = {}, ratings = {}, brandLevel = null) => {
  const baseScores = calculateScore(answers, ratings);
  const currentTier = brandLevel?.level || determineTier(baseScores.overallScore);
  const tierIndex = getTierIndex(currentTier);
  const pillarScores = {};
  const pillarDetails = {};
  const pillarMinTier = {};

  Object.entries(SECTIONS).forEach(([pillarKey, questions]) => {
    const minTierIndex = Math.min(
      ...questions.map((q) => getTierIndex(q.tier || 'Seed'))
    );
    pillarMinTier[pillarKey] = minTierIndex;
    const detail = calculatePillarScore(pillarKey, answers, ratings, currentTier);
    pillarDetails[pillarKey] = detail;
    pillarScores[pillarKey] = detail.score;
  });

  const requiredPillars = Object.keys(pillarScores).filter(
    (pillarKey) => pillarMinTier[pillarKey] <= tierIndex
  );
  const bottleneckKey = (requiredPillars.length ? requiredPillars : Object.keys(pillarScores))
    .reduce((lowestKey, key) => (pillarScores[key] < pillarScores[lowestKey] ? key : lowestKey), requiredPillars[0] || Object.keys(pillarScores)[0]);

  const highKey = Object.keys(pillarScores)
    .reduce((highestKey, key) => (pillarScores[key] > pillarScores[highestKey] ? key : highestKey), Object.keys(pillarScores)[0]);
  const lowKey = Object.keys(pillarScores)
    .reduce((lowestKey, key) => (pillarScores[key] < pillarScores[lowestKey] ? key : lowestKey), Object.keys(pillarScores)[0]);
  const synergyGap = Math.abs(pillarScores[highKey] - pillarScores[lowKey]);

  const labelMap = {
    brand_core: 'Brand Core',
    visual_identity: 'Visual Identity',
    product_experience: 'Product Experience',
    market_plan: 'Market Plan',
    technology: 'Technology',
    brand_activation: 'Brand Activation',
    team_branding: 'Team Branding',
    security_trust: 'Security & Trust'
  };

  const bottleneckSeverity = (currentTier === 'Star' || currentTier === 'Superbrand') && bottleneckKey === 'security_trust'
    ? 'Catastrophic Risk'
    : 'Priority #1 Action Item';

  const synergyVerdict = synergyGap > 50
    ? `Your brand is fragmented. You are over-investing in ${labelMap[highKey]} while neglecting the foundation of ${labelMap[lowKey]}.`
    : 'Your pillars are balanced enough to scale without structural drag.';

  const advisorMirror = (() => {
    if (currentTier === 'Seed') {
      return baseScores.overallScore >= 40
        ? "Your soul is forming, but survival depends on sharper clarity and consistency. Without a true why, you will be drowned out."
        : "You are still invisible. Clarify the purpose before you chase traction.";
    }
    if (currentTier === 'Sprout') {
      return baseScores.overallScore >= 50
        ? "You are building momentum, but misalignment is wasting energy. Tighten the system so every touchpoint says the same thing."
        : "You have movement without cohesion. Align the core before you scale the noise.";
    }
    if (currentTier === 'Star') {
      return baseScores.overallScore >= 60
        ? "You have leverage potential, but scale will punish weak infrastructure. Strengthen the system before the market tests you."
        : "You are aiming for scale without the engine to survive it. Fix the foundation before you accelerate.";
    }
    return baseScores.overallScore >= 75
      ? "You are operating like a legacy brand, but defense must be relentless. Fortify the weakest pillar before competitors attack it."
      : "You look like a leader but you are not yet defensible. Build the moat or risk becoming a fad.";
  })();

  const nextTierIndex = Math.min(tierIndex + 1, TIERS.length - 1);
  const nextTier = TIERS[nextTierIndex];
  const nextMilestone = nextTierIndex === tierIndex
    ? 'Maintain Superbrand dominance'
    : `${nextTier} at ${TIER_THRESHOLDS[nextTier]}%`;

  const recommendation = nextTierIndex === tierIndex
    ? `Protect ${labelMap[bottleneckKey]} to defend your Superbrand position.`
    : `To move from ${currentTier} to ${nextTier}, close the gap in ${labelMap[bottleneckKey]} and lift it above ${TIER_THRESHOLDS[nextTier]}%.`;

  return {
    currentTier,
    overallScore: baseScores.overallScore,
    nextMilestone,
    pillarScores,
    pillarDetails,
    bottleneck: {
      id: bottleneckKey,
      label: labelMap[bottleneckKey],
      score: pillarScores[bottleneckKey],
      severity: bottleneckSeverity
    },
    synergy: {
      gap: synergyGap,
      highPillar: labelMap[highKey],
      lowPillar: labelMap[lowKey],
      verdict: synergyVerdict
    },
    advisorMirror,
    recommendation
  };
};

export const generateStrategicRoadmap = (answers = {}, ratings = {}, brandLevel = null) => {
  const baseScores = calculateScore(answers, ratings);
  const currentTier = brandLevel?.level || determineTier(baseScores.overallScore);
  const tierIndex = getTierIndex(currentTier);
  const nextTier = TIERS[Math.min(tierIndex + 1, TIERS.length - 1)];

  const pillarScores = {};
  const pillarMinTier = {};
  Object.entries(SECTIONS).forEach(([pillarKey, questions]) => {
    const minTierIndex = Math.min(
      ...questions.map((q) => getTierIndex(q.tier || 'Seed'))
    );
    pillarMinTier[pillarKey] = minTierIndex;
    pillarScores[pillarKey] = calculatePillarScore(pillarKey, answers, ratings, currentTier).score;
  });

  const requiredPillars = Object.keys(pillarScores).filter(
    (pillarKey) => pillarMinTier[pillarKey] <= tierIndex
  );
  const bottleneckKey = (requiredPillars.length ? requiredPillars : Object.keys(pillarScores))
    .reduce((lowestKey, key) => (pillarScores[key] < pillarScores[lowestKey] ? key : lowestKey), requiredPillars[0] || Object.keys(pillarScores)[0]);

  const labelMap = {
    brand_core: 'Brand Core',
    visual_identity: 'Visual Identity',
    product_experience: 'Product Experience',
    market_plan: 'Market Plan',
    technology: 'Technology',
    brand_activation: 'Brand Activation',
    team_branding: 'Team Branding',
    security_trust: 'Security & Trust'
  };

  const actionLibrary = {
    Seed: {
      brand_core: "Draft a Non-Negotiables list that defines why your brand exists.",
      visual_identity: "Create a single, consistent logo and color rule for all touchpoints.",
      product_experience: "Document the core utility and the one outcome you must deliver.",
      market_plan: "Define a precise ICP with behaviors and buying triggers.",
      technology: "Secure a live domain and mobile-ready site foundation.",
      brand_activation: "Launch one exposure play that proves initial demand.",
      team_branding: "Write a founder manifesto that sets the cultural baseline.",
      security_trust: "Publish transparent terms and limitations in plain language."
    },
    Sprout: {
      brand_core: "Align your mission to the business roadmap with explicit 90-day goals.",
      visual_identity: "Standardize all social touchpoints into a 1-page Brand Style Guide.",
      product_experience: "Map onboarding friction and remove the first three drop-off points.",
      market_plan: "Validate two channels that match your ICP behavior.",
      technology: "Connect core tools so leads flow into a single system of record.",
      brand_activation: "Build a repeatable activation loop that generates feedback.",
      team_branding: "Create a simple culture deck and share it with early hires.",
      security_trust: "Implement basic security protocols and publish a privacy policy."
    },
    Star: {
      brand_core: "Define the unique differentiator that survives a crowded market.",
      visual_identity: "Audit omnichannel consistency and enforce a single visual system.",
      product_experience: "Build retention loops and track post-purchase behavior.",
      market_plan: "Model CAC vs LTV and prove scalable acquisition economics.",
      technology: "Automate workflows and measure performance bottlenecks.",
      brand_activation: "Design a community-led activation that compounds reach.",
      team_branding: "Create a Brand Bible and train every team lead on it.",
      security_trust: "Implement a Zero-Trust policy and run a third-party vulnerability audit."
    },
    Superbrand: {
      brand_core: "Codify your institutional narrative and defend it in the market.",
      visual_identity: "Institutionalize visual equity across every ecosystem partner.",
      product_experience: "Engineer frictionless loyalty with ecosystem-level retention.",
      market_plan: "Lock market penetration with defensible strategic positioning.",
      technology: "Build first-party data intelligence and predictive governance.",
      brand_activation: "Design cultural landmark activations that create legacy memory.",
      team_branding: "Operationalize internal advocacy with governance and incentives.",
      security_trust: "Own security protocols and formalize brand governance systems."
    }
  };

  const pickTask = (pillarKey) => actionLibrary[currentTier]?.[pillarKey] || actionLibrary.Seed[pillarKey];

  const phaseOne = {
    title: "Day 1-30: The Foundation",
    badge: "Critical",
    pillar: labelMap[bottleneckKey],
    action: pickTask(bottleneckKey),
    realityCheck: `If you ignore ${labelMap[bottleneckKey]} and chase growth, you are building on a cracked foundation.`
  };

  const phaseTwo = {
    title: "Day 31-60: The Alignment",
    badge: "Strategic",
    pillar: "Brand Core + Market Plan",
    action: `${pickTask('brand_core')} Then ${pickTask('market_plan')}.`,
    realityCheck: "If your story and go-to-market do not align, every campaign will leak credibility."
  };

  const scalePillar = pillarScores.technology <= pillarScores.brand_activation ? 'technology' : 'brand_activation';
  const phaseThree = {
    title: "Day 61-90: The Scale",
    badge: "Growth",
    pillar: labelMap[scalePillar],
    action: pickTask(scalePillar),
    realityCheck: `If you ignore ${labelMap[scalePillar]} now, the next tier will collapse under its own weight.`
  };

  const targetMetric = Math.max(75, TIER_THRESHOLDS[nextTier]);
  const successMetric = nextTier === currentTier
    ? `Maintain a ${labelMap[scalePillar]} score above ${targetMetric}% to defend your current tier.`
    : `By Day 90, your ${labelMap[scalePillar]} score must reach ${targetMetric}% to sustain a ${nextTier} upgrade.`;

  const boardNote = nextTier === currentTier
    ? "Protect dominance by eliminating the weakest pillar before competitors exploit it."
    : `This roadmap is built to move you from ${currentTier} to ${nextTier} by fixing the leak, aligning the message, then scaling the engine.`;

  return {
    currentTier,
    nextTier,
    strategicBottleneck: {
      id: bottleneckKey,
      label: labelMap[bottleneckKey],
      score: pillarScores[bottleneckKey]
    },
    phases: [phaseOne, phaseTwo, phaseThree],
    successMetric,
    boardNote
  };
};

export const calculateScore = (answers = {}, ratings = {}) => {
  const questions = getAllQuestions();
  const totalQuestions = questions.length || 1;
  const completedTextareas = questions.filter(
    (q) => q.type === 'textarea' && hasTextAnswer(answers[q.id])
  ).length;

  const completionPercentage = Math.round((completedTextareas / totalQuestions) * 100);

  const ratingScores = questions
    .map((q) => ratingToScore(ratings[q.id]))
    .filter((score) => typeof score === 'number');

  const healthScore = ratingScores.length
    ? Math.round(ratingScores.reduce((a, b) => a + b, 0) / ratingScores.length)
    : 0;

  const preliminaryOverall = Math.round((completionPercentage + healthScore) / 2);
  const preliminaryTier = determineTier(preliminaryOverall);
  const visualIdentity = calculatePillarScore('visual_identity', answers, ratings, preliminaryTier);
  const overallScore = Math.round((completionPercentage + healthScore + visualIdentity.score) / 3);

  return {
    completionPercentage,
    healthScore,
    overallScore,
    visualIdentity
  };
};

export const determineTier = (overallScore = 0) => {
  let tier = 'Seed';
  TIERS.forEach((level) => {
    if (overallScore >= TIER_THRESHOLDS[level]) tier = level;
  });
  return tier;
};

export const getQuestionAccess = (questionTier, currentUserTier) => {
  const questionIndex = getTierIndex(questionTier);
  const userIndex = getTierIndex(currentUserTier);
  const isLocked = questionIndex > userIndex;
  return {
    isLocked,
    isReadOnly: isLocked,
    blurAmount: isLocked ? 'blur-sm' : ''
  };
};

export const calculateBrandHealth = (ratings = {}) => {
  const { overallScore } = calculateScore({}, ratings);
  const tier = determineTier(overallScore);
  const pillarScores = {};

  Object.entries(SECTIONS).forEach(([pillarKey, questions]) => {
    const scores = questions
      .map((q) => ratingToScore(ratings[q.id]))
      .filter((score) => typeof score === 'number');
    const pillarScore = scores.length
      ? Math.round(scores.reduce((a, b) => a + b, 0) / scores.length)
      : 0;
    pillarScores[pillarKey] = pillarScore;
  });

  const gaps = [];
  Object.entries(SECTIONS).forEach(([pillarKey, questions]) => {
    questions.forEach((q) => {
      const rating = ratings[q.id];
      const sectionLabel = pillarKey.replace(/_/g, ' ').replace(/\b\w/g, (c) => c.toUpperCase());
      if (q.tier === 'Seed' && (!rating || rating === 'Needs Major Improvement' || rating === 'Poor')) {
        gaps.push({
          id: q.id,
          text: `Improve: ${q.label}`,
          priority: 'High',
          section: sectionLabel
        });
      } else if (rating === 'Needs Major Improvement' || rating === 'Poor') {
        gaps.push({
          id: q.id,
          text: `Refine: ${q.label}`,
          priority: 'Medium',
          section: sectionLabel
        });
      }
    });
  });

  const topPriorities = gaps
    .sort((a, b) => (a.priority === 'High' ? -1 : 1))
    .slice(0, 3);

  const earnedBadges = ACHIEVEMENTS.filter((badge) => badge.condition(ratings, SECTIONS, overallScore));

  return {
    overallScore,
    pillarScores,
    tier,
    topPriorities,
    earnedBadges
  };
};

export const assessBrandLevel = (answers = {}, ratings = {}, prevLevel = 'Seed') => {
  const { completionPercentage, healthScore, overallScore } = calculateScore(answers, ratings);
  const targetLevel = determineTier(overallScore);
  const level = targetLevel;
  const levelChanged = level !== prevLevel;
  const updatedAt = new Date().toISOString();

  const metrics = {
    completionPercentage,
    healthScore,
    overallScore
  };

  const historyEntry = levelChanged ? {
    timestamp: updatedAt,
    from: prevLevel,
    to: level,
    score: overallScore,
    metrics,
    reason: 'score'
  } : null;

  const auditEntry = {
    timestamp: updatedAt,
    action: levelChanged ? 'level_change' : 'assessment',
    from: prevLevel,
    to: level,
    score: overallScore,
    metrics,
    reason: 'score',
    targetLevel
  };

  const levelIndexChange = getTierIndex(level) - getTierIndex(prevLevel);

  return {
    level,
    score: overallScore,
    metrics,
    health: calculateBrandHealth(ratings),
    levelChanged,
    historyEntry,
    auditEntry,
    blockedReason: null,
    targetLevel,
    levelIndexChange,
    updatedAt
  };
};
