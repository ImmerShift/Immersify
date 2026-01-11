"# Application Architecture - IBE Strategy Generator

## System Overview

```
┌─────────────────────────────────────────────────────────────────┐
│                     User Browser                                │
│                   http://localhost:8501                         │
└────────────────────────────┬────────────────────────────────────┘
                             │
                             ▼
┌─────────────────────────────────────────────────────────────────┐
│                   Streamlit Application                         │
│                      (Port 8501)                                │
│  ┌───────────────────────────────────────────────────────────┐ │
│  │  app.py - Main Application                                │ │
│  │  • UI Rendering                                           │ │
│  │  • State Management                                       │ │
│  │  • CRUD Operations                                        │ │
│  │  • Event Handling                                         │ │
│  └───────────────────────────────────────────────────────────┘ │
│                             │                                   │
│  ┌──────────────────┬───────┴──────┬────────────────────────┐  │
│  │                  │              │                        │  │
│  ▼                  ▼              ▼                        ▼  │
│  prompts.py      db.py     session_state         UI Components│
│  • AI Prompts    • CRUD     • strategy_data      • Tabs       │
│  • Templates     • SQLite   • history            • Expanders  │
│  • 9 Pillars     • Versions • edit_mode          • Buttons    │
└──────┬───────────────┬────────────────────────────────────┬────┘
       │               │                                    │
       ▼               ▼                                    ▼
┌─────────────┐ ┌─────────────┐                    ┌──────────────┐
│ Google      │ │  SQLite DB  │                    │  Export      │
│ Gemini API  │ │  immersify  │                    │  .txt Files  │
│ (AI)        │ │  .db        │                    │              │
└─────────────┘ └─────────────┘                    └──────────────┘
```

## Component Architecture

### 1. Presentation Layer (UI)

```python
# Main Components:
- Sidebar: Project management, API key, quick actions
- Main Area: Briefing form, strategy tabs, CRUD controls
- Expandable Sections: Fields with edit/delete/AI operations
- Popovers: AI refinement, alternatives, add operations
```

**Key UI Elements:**
- `st.sidebar`: Project list, save/load, new project
- `st.tabs()`: 9 pillar navigation
- `st.expander()`: Collapsible field sections
- `st.popover()`: AI operations modal
- `st.text_area()`: Content editing
- `st.button()`: Action triggers

### 2. Application Layer

```
app.py Architecture:

┌─────────────────────────────────────────┐
│         Initialization                  │
│  • Config (page, theme)                 │
│  • Session state setup                  │
│  • Database init                        │
└──────────────┬──────────────────────────┘
               │
┌──────────────▼──────────────────────────┐
│       Utility Functions                 │
│  • get_working_model()                  │
│  • clean_json()                         │
│  • format_report()                      │
│  • get_dynamic_icon()                   │
│  • refine_text()                        │
│  • regenerate_section()                 │
│  • generate_alternatives()              │
│  • save_to_history()                    │
│  • undo_last_change()                   │
└──────────────┬──────────────────────────┘
               │
┌──────────────▼──────────────────────────┐
│       Render Functions                  │
│  • render_list_item()                   │
│  • render_field()                       │
│  • render_section()                     │
└──────────────┬──────────────────────────┘
               │
┌──────────────▼──────────────────────────┐
│         Main App Logic                  │
│  • Sidebar rendering                    │
│  • Briefing section                     │
│  • Strategy generation                  │
│  • Tab navigation                       │
│  • Section rendering                    │
└─────────────────────────────────────────┘
```

### 3. Data Layer

```
Session State Structure:

st.session_state = {
    \"db_init\": bool,              # DB initialized
    \"strategy_data\": {            # Main strategy store
        \"1_core_story\": {
            \"core_purpose\": str,
            \"brand_name_critique\": str,
            ...
        },
        \"2_visual_identity\": {...},
        ...
    },
    \"client_name\": str,           # Project name
    \"edit_mode\": {                # Edit state tracking
        \"section_field_idx\": bool,
        ...
    },
    \"history\": [                  # Undo stack
        {
            \"timestamp\": str,
            \"data\": json_str
        },
        ...
    ],
    \"draft_section_field\": str,   # AI draft previews
    \"alts_section_field\": [],     # Alternative versions
    \"show_add_section\": bool      # Add field UI state
}
```

### 4. Database Layer

```sql
Database Schema:

┌─────────────────────────────────────┐
│          projects                   │
├─────────────────────────────────────┤
│ id              INTEGER PK          │
│ client_name     TEXT                │
│ strategy_data   TEXT (JSON)         │
│ created_at      TIMESTAMP           │
│ updated_at      TIMESTAMP           │
└────────────┬────────────────────────┘
             │ 1:N
             │
┌────────────▼────────────────────────┐
│      project_versions               │
├─────────────────────────────────────┤
│ id              INTEGER PK          │
│ project_id      INTEGER FK          │
│ strategy_data   TEXT (JSON)         │
│ created_at      TIMESTAMP           │
└─────────────────────────────────────┘
```

### 5. AI Integration Layer

```
AI Flow:

User Action → Build Prompt → Call Gemini API → Parse Response → Update State → Rerender

Generation:
  prompts.get_system_prompt(tone, lang)
  + prompts.get_smart_prompt(pillars, client, notes)
  → genai.GenerativeModel().generate_content()
  → clean_json()
  → json.loads()
  → st.session_state.strategy_data

Refinement:
  refine_text(current, instruction, client)
  → Custom prompt with context
  → Gemini API
  → Draft preview
  → User accepts/rejects

Alternatives:
  generate_alternatives(current, count, client)
  → Generate N versions
  → Present as options
  → One-click apply
```

## Data Flow Diagrams

### Create Flow

```
User fills brief
     │
     ▼
Select pillars
     │
     ▼
Click Generate
     │
     ▼
For each pillar:
  Build prompt
  Call Gemini API
  Parse JSON
  Update session_state
     │
     ▼
Rerender UI with tabs
     │
     ▼
User can now CRUD
```

### Update Flow (Direct Edit)

```
User expands field
     │
     ▼
Edit text in textarea
     │
     ▼
Click Save Changes
     │
     ▼
save_to_history()
     │
     ▼
Update session_state
     │
     ▼
st.rerun()
     │
     ▼
UI shows updated content
```

### Update Flow (AI Refine)

```
User clicks Refine
     │
     ▼
Enter instruction
     │
     ▼
Click Generate
     │
     ▼
Call refine_text()
  → Gemini API with instruction
  → Get refined version
     │
     ▼
Store in draft_key
     │
     ▼
Display preview in popover
     │
     ▼
User clicks Accept?
   │         │
   YES       NO
   │         │
   ▼         ▼
Replace   Discard
content   draft
```

### Delete Flow

```
User clicks Delete
     │
     ▼
save_to_history()
     │
     ▼
Remove from session_state
     │
     ▼
st.rerun()
     │
     ▼
UI shows without item
```

## State Management

### Session State Lifecycle

```
App Start
  ↓
Initialize session_state
  ↓
Load defaults
  ↓
User generates strategy
  ↓
strategy_data populated
  ↓
User makes edits
  ↓
history[] updated
  ↓
User saves to DB
  ↓
Database persistence
  ↓
User can load later
```

### Rerun Triggers

Streamlit reruns the entire script on:
- Button clicks
- Input changes (with callbacks)
- Explicit st.rerun() calls

**Critical Pattern:**
```python
# Before any state change:
save_to_history()

# Make the change:
st.session_state.strategy_data[key] = new_value

# Force rerender:
st.rerun()
```

## CRUD Implementation Details

### CREATE

**1. Generate Strategy**
```python
# Location: Main briefing section
for pillar in selected_pillars:
    prompt = build_prompt(pillar, brief)
    response = genai.generate(prompt)
    data = parse_json(response)
    session_state.strategy_data.update(data)
```

**2. Add Field**
```python
# Location: Section header
if button(\"Add Field\"):
    session_state[f\"show_add_{section}\"] = True
# Then in conditional:
if show_add:
    name = text_input(\"Name\")
    value = text_area(\"Value\")
    if button(\"Confirm\"):
        session_state.data[section][name] = value
```

**3. Add List Item**
```python
# Location: Within list field
new_item = text_input(\"New item\")
if button(\"Add\"):
    session_state.data[section][field].append(new_item)
```

### READ

**1. Display Content**
```python
# Location: render_field()
if isinstance(value, list):
    for item in value:
        st.markdown(f\"• {item}\")
elif isinstance(value, dict):
    for k, v in value.items():
        st.markdown(f\"**{k}**: {v}\")
else:
    st.text_area(\"Content\", value=value)
```

**2. Load Project**
```python
# Location: Sidebar
if button(\"Load\"):
    data, name = db.load_project(project_id)
    session_state.strategy_data = data
    session_state.client_name = name
    st.rerun()
```

### UPDATE

**1. Direct Edit**
```python
# Location: render_field()
widget_key = f\"txt_{section}_{field}\"
new_val = text_area(\"Content\", value=value, key=widget_key)
if button(\"Save\"):
    save_to_history()
    session_state.data[section][field] = new_val
    st.rerun()
```

**2. AI Refine**
```python
# Location: AI Operations popover
instruction = text_input(\"Instruction\")
if button(\"Generate\"):
    draft = refine_text(current, instruction)
    session_state[f\"draft_{key}\"] = draft
if button(\"Accept\"):
    save_to_history()
    session_state.data[section][field] = draft
    st.rerun()
```

**3. Generate Alternatives**
```python
# Location: AI Operations popover
count = slider(\"Count\", 2, 5)
if button(\"Generate\"):
    alts = generate_alternatives(current, count)
    session_state[f\"alts_{key}\"] = alts
for i, alt in enumerate(alts):
    if button(f\"Option {i}\"):
        save_to_history()
        session_state.data[section][field] = alt
        st.rerun()
```

### DELETE

**1. Delete List Item**
```python
# Location: render_list_item()
if button(\"Delete\"):
    save_to_history()
    session_state.data[section][field].pop(index)
    st.rerun()
```

**2. Delete Field**
```python
# Location: AI Operations
if button(\"Delete\"):
    save_to_history()
    del session_state.data[section][field]
    st.rerun()
```

**3. Delete Project**
```python
# Location: Sidebar
if button(\"Delete\"):
    db.delete_project(project_id)
    st.rerun()
```

## Version Control Implementation

```python
# History Stack (max 10)
session_state.history = [
    {\"timestamp\": \"2025-01-11T10:00:00\", \"data\": \"{...}\"},
    {\"timestamp\": \"2025-01-11T10:05:00\", \"data\": \"{...}\"},
    ...
]

# Save before change
def save_to_history():
    session_state.history.append({
        \"timestamp\": datetime.now().isoformat(),
        \"data\": json.dumps(session_state.strategy_data)
    })
    if len(session_state.history) > 10:
        session_state.history = session_state.history[-10:]

# Undo
def undo_last_change():
    if session_state.history:
        last_state = session_state.history.pop()
        session_state.strategy_data = json.loads(last_state[\"data\"])
        st.rerun()
```

## Performance Considerations

### Optimization Strategies

1. **Lazy Loading**
   - Sections expand on demand
   - AI operations on click, not auto

2. **Caching**
   - Session state persists across reruns
   - Database queries minimal

3. **Efficient Reruns**
   - Only rerun when necessary
   - Use callbacks for immediate updates

4. **API Rate Limiting**
   - 2-second delay between pillar generations
   - User-initiated only (no auto-refresh)

### Bottlenecks

1. **AI Generation**: 3-5 seconds per call
   - Solution: Progress indicators

2. **Full Strategy**: 20-30 seconds
   - Solution: Progress bar, batch processing

3. **Large JSON**: Potential memory issue
   - Solution: Pagination (future)

## Security Considerations

### API Key Protection
```python
# Environment variable (preferred)
api_key = os.environ.get(\"GOOGLE_API_KEY\")

# UI input (session only)
if not api_key:
    api_key = st.text_input(\"API Key\", type=\"password\")

# Never log or store
genai.configure(api_key=api_key)
```

### Database Security
- Local file, no network exposure
- File permissions control access
- No sensitive data stored (user responsibility)

### XSS Prevention
- Streamlit handles sanitization
- User input not eval'd
- JSON parsing with try/except

## Error Handling

### API Errors
```python
try:
    response = model.generate_content(prompt)
    return response.text
except Exception as e:
    st.error(f\"API Error: {e}\")
    return None
```

### Database Errors
```python
try:
    db.save_project(name, data)
    return True
except Exception as e:
    st.error(f\"Database Error: {e}\")
    return False
```

### JSON Parsing
```python
try:
    data = json.loads(clean_json(response))
except:
    st.warning(\"Invalid JSON, skipping\")
    continue
```

## Deployment Architecture

```
┌─────────────────────────────────────────────┐
│           Host System (Linux)               │
│                                             │
│  ┌────────────────────────────────────┐    │
│  │       Supervisor                   │    │
│  │  (Process Manager)                 │    │
│  │                                    │    │
│  │  ┌──────────────────────────────┐ │    │
│  │  │  streamlit                   │ │    │
│  │  │  Port: 8501                  │ │    │
│  │  │  Auto-restart: Yes           │ │    │
│  │  │  Log: /var/log/supervisor/   │ │    │
│  │  └──────────────────────────────┘ │    │
│  │                                    │    │
│  │  ┌──────────────────────────────┐ │    │
│  │  │  backend (FastAPI)           │ │    │
│  │  │  Port: 8001                  │ │    │
│  │  └──────────────────────────────┘ │    │
│  │                                    │    │
│  │  ┌──────────────────────────────┐ │    │
│  │  │  frontend (React)            │ │    │
│  │  │  Port: 3000                  │ │    │
│  │  └──────────────────────────────┘ │    │
│  │                                    │    │
│  │  ┌──────────────────────────────┐ │    │
│  │  │  mongodb                     │ │    │
│  │  │  Port: 27017                 │ │    │
│  │  └──────────────────────────────┘ │    │
│  └────────────────────────────────────┘    │
│                                             │
│  ┌────────────────────────────────────┐    │
│  │  File System                       │    │
│  │  /app/streamlit/                   │    │
│  │  /app/backend/                     │    │
│  │  /app/frontend/                    │    │
│  └────────────────────────────────────┘    │
└─────────────────────────────────────────────┘
```

## Extension Points

### Adding New Pillars
```python
# 1. Add to prompts.py
PILLAR_DEFINITIONS[\"10_new_pillar\"] = \"\"\"...\"\"\"

# 2. Add checkbox in briefing
p10 = checkbox(\"10. New Pillar\")

# 3. Add to requests list
if p10: requests.append(\"10_new_pillar\")

# 4. Add tab
tabs = st.tabs([..., \"10. New Pillar\"])

# 5. Add render call
with tabs[9]:
    render_section(data, \"10_new_pillar\", ...)
```

### Adding New AI Operations
```python
# 1. Create function
def new_ai_operation(current_text, params):
    # Custom prompt
    # Call Gemini
    # Return result
    pass

# 2. Add UI in render_field()
with st.popover(\"🎯 New Operation\"):
    params = st.text_input(\"Params\")
    if st.button(\"Generate\"):
        result = new_ai_operation(current, params)
        st.session_state[f\"result_{key}\"] = result
```

### Adding Export Formats
```python
def export_as_pdf(data, client_name):
    # Generate PDF
    return pdf_bytes

def export_as_json(data):
    return json.dumps(data, indent=2)

# In UI
if st.button(\"📄 Export PDF\"):
    pdf = export_as_pdf(data, name)
    st.download_button(\"Download\", pdf, \"strategy.pdf\")
```

## Testing Strategy

### Unit Tests (Future)
```python
# test_db.py
def test_save_project():
    assert db.save_project(\"Test\", {}) == True

# test_prompts.py
def test_get_system_prompt():
    prompt = prompts.get_system_prompt(\"Warm\", \"EN\")
    assert \"Warm\" in prompt
```

### Integration Tests
```python
# test_app.py
def test_generation_flow():
    # Simulate user input
    # Check state updates
    # Verify database
    pass
```

### Manual Testing Checklist
- [ ] Generate strategy
- [ ] Edit content
- [ ] AI refinement
- [ ] Save/load
- [ ] Undo/redo
- [ ] Export

## Monitoring & Logging

### Application Logs
```bash
# stdout (info)
tail -f /var/log/supervisor/streamlit.out.log

# stderr (errors)
tail -f /var/log/supervisor/streamlit.err.log
```

### Metrics to Track
- Generation time per pillar
- API call success rate
- Database operation latency
- User session duration
- Most used features

## Conclusion

This architecture provides:
- ✅ Separation of concerns
- ✅ Modular components
- ✅ Clear data flow
- ✅ Extensibility
- ✅ Error handling
- ✅ State management
- ✅ Performance optimization

The system is designed for maintainability, scalability, and user experience.
"