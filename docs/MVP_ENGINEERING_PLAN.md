# Immersify MVP Engineering Plan (Sections B, C, D)

## Scope
This plan consolidates:
- Section B: AI Prompt Library (Pillars 2–8)
- Section C: Expanded API Documentation
- Section D: Database Schema (Execution Tables)

## 1) AI Prompt Library (Pillars 2–8)

### 1.1 Registry + Schema
- Registry keys: `pillar_id`, `tier`
- Template variables: `{QUESTION_CONTEXT}`, `{USER_ANSWER}`
- JSON output schema:
  - `concept`
  - `critique`
  - `proTip`
  - `strengthScore`

### 1.2 Coverage
**Pillars 2–5**
- Visual Identity (Seed, Star)
- Product Experience (Seed, Star)
- Market Plan (Seed, Star)
- Technology & Accessibility (Seed, Star)

**Pillars 6–8**
- Brand Activation (Seed, Star)
- Team Branding (Seed, Star)
- Security & Trust (Seed, Star)

### 1.3 Deliverables
- `prompt-library.json`
- `prompt-library.md` (human-readable appendix)
- Example I/O test cases per prompt

## 2) API Documentation (Expanded)

### 2.1 Workbook & AI Feedback
**POST /api/workbook/submit**
- Saves answer
- Triggers Gemini Flash
- Updates brand health score
- Awards XP on verification

**PUT /api/workbook/upload-evidence**
- Multipart upload to S3
- Verification status update
- XP update

### 2.2 Gamification & Progression
**GET /api/users/gamification**
- Returns tier, XP, streak, multiplier, achievements

### 2.3 Strategy Generation (Async)
**POST /api/projects/{id}/generate-strategy**
- Returns job ID + status URL
**GET /api/projects/jobs/{job_id}**
- Polling endpoint

### 2.4 Export & Reporting
**GET /api/projects/{id}/export**
- Generates PDF/DOCX/TXT
- Returns signed URL with 15 min expiry

### 2.5 Deliverables
- API spec (OpenAPI + Markdown)
- Error catalog
- Auth rules (JWT)
- Rate limit guidance for AI endpoints

## 3) Database Schema (Execution Tables)

### 3.1 Gamification & Activity
**user_activity_log**
- Immutable XP ledger
- Index: `(user_id, created_at DESC)`

**user_achievements**
- Badge unlocks + tier at unlock

### 3.2 System & Analytics (AI Ops)
**ai_api_calls**
- Token usage + cost tracking
- Index: `(user_id, created_at)`

### 3.3 Projects & Content (Analytics)
**brand_health_scores**
- Score snapshots + pillar breakdowns

### 3.4 Subscription & Billing
**subscriptions**
- Stripe customer + plan tier + status

### 3.5 Deliverables
- SQL migrations + indexes
- ERD updates

## 4) Sprint Order (Recommended)
1. Prompt Registry + Pillars 2–5
2. Workbook submit + AI feedback loop
3. Pillars 6–8 prompts
4. Evidence upload + verification
5. Gamification API + XP ledger tables
6. AI ops logging
7. Strategy gen async + job polling
8. Export pipeline + signed URLs

