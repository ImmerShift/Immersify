# Immersify MVP Jira Backlog (Sections B, C, D)

## Epic A — AI Prompt Library

### Story A1 — Prompt Registry Framework
**Acceptance Criteria**
- Registry supports `pillar_id`, `tier`
- Template injection supports `{QUESTION_CONTEXT}`, `{USER_ANSWER}`
- JSON output schema enforced

### Story A2 — Pillars 2–5 Prompts (Seed + Star)
**Acceptance Criteria**
- Prompts created for Visual Identity, Product Experience, Market Plan, Technology & Accessibility
- Outputs match JSON schema

### Story A3 — Pillars 6–8 Prompts (Seed + Star)
**Acceptance Criteria**
- Prompts created for Brand Activation, Team Branding, Security & Trust
- Outputs match JSON schema

### Story A4 — Prompt Library Artifacts
**Acceptance Criteria**
- `prompt-library.json` created
- `prompt-library.md` created
- Example I/O cases added

## Epic B — Workbook & AI Feedback APIs

### Story B1 — POST /api/workbook/submit
**Acceptance Criteria**
- Validates input schema
- Persists answer
- Calls Gemini Flash
- Updates brand health score
- Awards XP on verification

### Story B2 — PUT /api/workbook/upload-evidence
**Acceptance Criteria**
- Multipart upload accepted
- Asset saved to S3
- Verification status updated
- XP awarded

## Epic C — Gamification & Progression

### Story C1 — GET /api/users/gamification
**Acceptance Criteria**
- Returns tier, XP, next threshold, streak, multiplier, achievements

### Story C2 — XP Ledger + Achievements
**Acceptance Criteria**
- `user_activity_log` used for XP actions
- `user_achievements` records badge unlocks

## Epic D — Strategy Generation

### Story D1 — POST /api/projects/{id}/generate-strategy
**Acceptance Criteria**
- Returns job ID + status URL
- Async job created

### Story D2 — GET /api/projects/jobs/{job_id}
**Acceptance Criteria**
- Status transitions: queued → processing → completed/failed
- Returns final JSON on completion

## Epic E — Export & Reporting

### Story E1 — GET /api/projects/{id}/export
**Acceptance Criteria**
- Supports pdf, docx, txt
- Returns signed URL expiring in 15 minutes

## Epic F — AI Ops Logging

### Story F1 — ai_api_calls Tracking
**Acceptance Criteria**
- Logs prompt type, model, tokens, cost, status
- Index supports billing queries

## Epic G — Database Migrations

### Story G1 — Create Execution Tables
**Acceptance Criteria**
- `user_activity_log`, `user_achievements`, `ai_api_calls`, `brand_health_scores`, `subscriptions` created
- Indexes applied

