import assert from 'node:assert/strict';
import { performance } from 'node:perf_hooks';
import { getPermissionMatrix, getQuestionAccess, getQuestionVariant, authorizeSubmission, buildQuestionIndex, getTierComparison } from './accessControl.js';

const SAMPLE_SECTIONS = {
  core: [
    {
      id: 'core',
      title: 'Core',
      questions: [
        { id: 'q_seed', label: 'Why does your brand exist? (Purpose beyond profit)', placeholder: 'Explain in one sentence.', tips: ['Explain your mission clearly.', 'Avoid jargon.'], tier: 'Seed' },
        { id: 'q_star', label: 'What is your measurable 90-day growth target?', placeholder: 'Enter a number and goal.', tips: ['Use real metrics.'], tier: 'Star' },
        { id: 'q_super', label: 'What category will you redefine?', placeholder: 'Define the category shift.', tips: ['Be bold but real.'], tier: 'Superbrand' }
      ]
    }
  ]
};

const run = async () => {
  const permissionsSeed = getPermissionMatrix('Seed');
  assert.equal(permissionsSeed.view_questions, true);
  assert.equal(permissionsSeed.submit_superbrand, false);

  const permissionsSuper = getPermissionMatrix('Superbrand');
  assert.equal(permissionsSuper.submit_superbrand, true);

  const seedAccessSuper = getQuestionAccess(SAMPLE_SECTIONS.core[0].questions[2], 'Seed');
  assert.equal(seedAccessSuper.canView, true);
  assert.equal(seedAccessSuper.canSubmit, false);

  const starAccessSuper = getQuestionAccess(SAMPLE_SECTIONS.core[0].questions[2], 'Star');
  assert.equal(starAccessSuper.canView, true);
  assert.equal(starAccessSuper.canSubmit, false);
  assert.equal(starAccessSuper.readOnly, true);

  const superAccessSuper = getQuestionAccess(SAMPLE_SECTIONS.core[0].questions[2], 'Superbrand');
  assert.equal(superAccessSuper.canSubmit, true);

  const variantSeed = getQuestionVariant(SAMPLE_SECTIONS.core[0].questions[0], 'Seed');
  assert.ok(variantSeed.label.length <= SAMPLE_SECTIONS.core[0].questions[0].label.length);

  let forbiddenCaught = false;
  try {
    authorizeSubmission(SAMPLE_SECTIONS.core[0].questions[2], 'Star');
  } catch (error) {
    forbiddenCaught = error.status === 403;
  }
  assert.equal(forbiddenCaught, true);

  const index = buildQuestionIndex(SAMPLE_SECTIONS);
  assert.equal(index.q_seed.label.includes('brand'), true);

  const comparison = getTierComparison(SAMPLE_SECTIONS, 'Seed');
  assert.ok(comparison.Superbrand.length > 0);

  const start = performance.now();
  for (let i = 0; i < 10000; i += 1) {
    getQuestionAccess(SAMPLE_SECTIONS.core[0].questions[2], 'Star');
  }
  const duration = performance.now() - start;
  assert.ok(duration < 50);
};

run();
