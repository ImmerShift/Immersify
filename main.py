import streamlit as st
import os
import json
import time
import uuid
from datetime import datetime
import google.generativeai as genai
import prompts
import db

# --- CONFIG ---
st.set_page_config(page_title="IBE Engine - Immersify",
                   layout="wide",
                   initial_sidebar_state="expanded",
                   page_icon="🎨")

# --- CUSTOM CSS ---
st.markdown("""
    <style>
    .stTextArea textarea {
        background-color: #1e1e1e !important;
        color: #e0e0e0 !important;
        border: 1px solid #333 !important;
        border-radius: 4px !important;
        font-family: 'Inter', sans-serif !important;
        line-height: 1.6 !important;
        padding: 15px !important;
        min-height: 200px !important;
    }
    .stTextArea textarea:focus {
        border-color: #ff4b4b !important;
        box-shadow: 0 0 0 1px #ff4b4b !important;
    }
    .stTabs [data-baseweb="tab-list"] {
        gap: 8px;
        border-bottom: 1px solid #333;
    }
    .stTabs [data-baseweb="tab"] {
        height: 45px;
        white-space: pre-wrap;
        background-color: #121212;
        border-radius: 4px 4px 0px 0px;
        padding: 10px 20px;
    }
    .stInfo {
        background-color: #0e2a47 !important;
        color: #a3d1ff !important;
        border: 1px solid #1c4a7a !important;
    }
    .item-card {
        background-color: #2a2a2a;
        padding: 15px;
        border-radius: 8px;
        border: 1px solid #444;
        margin-bottom: 10px;
    }
    .action-button {
        font-size: 0.9em;
        padding: 5px 10px;
    }
    </style>
""",
            unsafe_allow_html=True)

# --- INITIALIZATION ---
if "db_init" not in st.session_state:
  db.init_db()
  st.session_state.db_init = True

if "strategy_data" not in st.session_state:
  st.session_state.strategy_data = {}

if "client_name" not in st.session_state:
  st.session_state.client_name = ""

if "edit_mode" not in st.session_state:
  st.session_state.edit_mode = {}

if "history" not in st.session_state:
  st.session_state.history = []

api_key = os.environ.get("GOOGLE_API_KEY") or os.environ.get("GEMINI_API_KEY")

# --- SIDEBAR ---
with st.sidebar:
  st.header("🎨 IBE Engine")
  st.caption("v16.0 | Enhanced CRUD")

  if not api_key:
    api_key = st.text_input("API Key", type="password")
  else:
    try:
      genai.configure(api_key=api_key)
      st.success("✓ API Key Configured")
    except:
      st.error("⚠ API Key Error")

  st.divider()
  st.subheader("📂 Saved Projects")
  projects = db.get_all_projects()
  if projects:
    project_options = {f"{p[1]} ({p[2][:10]})": p[0] for p in projects}
    selected_label = st.selectbox("Select Project",
                                  list(project_options.keys()))
    c1, c2 = st.columns(2)
    if c1.button("📂 Load", use_container_width=True):
      pid = project_options[selected_label]
      data, name = db.load_project(pid)
      if data:
        st.session_state.strategy_data = data
        st.session_state.client_name = name
        st.session_state.history = []
        st.rerun()
    if c2.button("🗑️ Delete", use_container_width=True):
      pid = project_options[selected_label]
      db.delete_project(pid)
      st.rerun()
  else:
    st.caption("No saved projects yet.")

  st.divider()
  if st.button("➕ Start New Project", use_container_width=True):
    st.session_state.strategy_data = {}
    st.session_state.client_name = ""
    st.session_state.history = []
    st.session_state.edit_mode = {}
    st.rerun()

  if st.session_state.strategy_data:
    st.divider()
    st.subheader("⚙️ Quick Actions")
    if st.button("💾 Save Current State", use_container_width=True):
      if st.session_state.client_name:
        if db.save_project(st.session_state.client_name,
                           st.session_state.strategy_data):
          st.success("Saved!")
          time.sleep(1)
          st.rerun()


# --- UTILITY FUNCTIONS ---
def get_working_model():
  try:
    models = list(genai.list_models())
    model_names = [
        m.name for m in models
        if 'generateContent' in m.supported_generation_methods
    ]
    if "models/gemini-1.5-flash" in model_names:
      return "models/gemini-1.5-flash"
    return model_names[0] if model_names else "gemini-pro"
  except:
    return "gemini-pro"


def clean_json(text):
  return text.replace("```json", "").replace("```", "").strip()


def format_report(full_data, client_name):
  text = f"IMMERSIVE BRAND STRATEGY: {client_name}\n{'='*50}\n\n"
  for section_key, section_data in full_data.items():
    text += f"--- {section_key.upper()} ---\n"
    if isinstance(section_data, dict):
      for k, v in section_data.items():
        text += f"[{k.replace('_', ' ').upper()}]\n{str(v)}\n\n"
  return text


def get_dynamic_icon(key):
  k = key.lower()
  icon_map = {
      "purpose": "🧭", "why": "🧭", "name": "🏷️", "proposition": "💎",
      "unique_value": "💎", "promise": "🤝", "hero": "📖", "narrat": "📖",
      "archetype": "🎭", "guideline": "📜", "vision": "🚀", "color": "🎨",
      "typograph": "🔤", "prompt": "📸", "logo": "🛡️", "graphic": "🧱",
      "sense": "🖐️", "ritual": "☕", "packag": "📦", "wow": "✨",
      "atmosph": "☁️", "audience": "👯", "content": "📝", "competitor": "🥊",
      "channel": "📢", "influenc": "🌟", "empower": "🔋", "ux": "🖱️",
      "integration": "📲", "operation": "⚙️", "accessib": "♿", "launch": "🎆",
      "wardrobe": "👗", "verbal": "💬", "culture": "❤️", "desire": "🧠",
      "leader": "🦁", "privacy": "🔒", "safety": "⛑️", "trust": "✅",
      "tagline": "🗣️", "pitch": "⚡", "headline": "💻", "social": "📱",
      "about": "🌱", "service": "💼"
  }
  for keyword, icon in icon_map.items():
    if keyword in k:
      return icon
  return "📌"


def refine_text(current_text, instruction, client_name):
  model = genai.GenerativeModel(get_working_model())
  prompt = f"""ROLE: Brand Strategy Editor. CLIENT: {client_name}.
    ORIGINAL TEXT: '{current_text}'.
    INSTRUCTION: {instruction}.
    TASK: Rewrite text following the instruction. Output ONLY the new text, no explanations."""
  try:
    response = model.generate_content(prompt)
    return response.text.strip()
  except Exception as e:
    return f"Error: {e}"


def regenerate_section(section_key, client_name, notes, tone, lang):
  model = genai.GenerativeModel(get_working_model())
  sys = prompts.get_system_prompt(tone, lang)
  prompt = prompts.get_smart_prompt([section_key], client_name, notes)
  try:
    response = model.generate_content(sys + prompt)
    return json.loads(clean_json(response.text))
  except Exception as e:
    st.error(f"Regeneration Error: {e}")
    return None


def generate_alternatives(current_text, count, client_name):
  model = genai.GenerativeModel(get_working_model())
  prompt = f"""ROLE: Brand Strategy Expert. CLIENT: {client_name}.
    ORIGINAL: '{current_text}'.
    TASK: Generate {count} creative alternative versions maintaining the same intent but with fresh perspectives.
    Output as JSON array: ["alternative1", "alternative2", ...]"""
  try:
    response = model.generate_content(prompt)
    return json.loads(clean_json(response.text))
  except:
    return []


def save_to_history():
  st.session_state.history.append({
      "timestamp": datetime.now().isoformat(),
      "data": json.dumps(st.session_state.strategy_data)
  })
  if len(st.session_state.history) > 10:
    st.session_state.history = st.session_state.history[-10:]


def undo_last_change():
  if st.session_state.history:
    last_state = st.session_state.history.pop()
    st.session_state.strategy_data = json.loads(last_state["data"])
    st.rerun()


# --- RENDER FUNCTIONS ---
def render_list_item(items, section_key, field_key, client_name):
  """Render list items with CRUD operations"""
  if not isinstance(items, list):
    items = [items]

  for idx, item in enumerate(items):
    col1, col2, col3 = st.columns([8, 1, 1])

    with col1:
      item_key = f"{section_key}_{field_key}_{idx}"
      if st.session_state.edit_mode.get(item_key, False):
        new_val = st.text_input("Edit:", value=str(item), key=f"edit_{item_key}")
        if st.button("💾 Save", key=f"save_{item_key}"):
          save_to_history()
          st.session_state.strategy_data[section_key][field_key][idx] = new_val
          st.session_state.edit_mode[item_key] = False
          st.rerun()
      else:
        st.markdown(f"• {item}")

    with col2:
      if st.button("✏️", key=f"edit_btn_{section_key}_{field_key}_{idx}"):
        st.session_state.edit_mode[item_key] = True
        st.rerun()

    with col3:
      if st.button("🗑️", key=f"del_{section_key}_{field_key}_{idx}"):
        save_to_history()
        st.session_state.strategy_data[section_key][field_key].pop(idx)
        st.rerun()

  # Add new item
  with st.expander("➕ Add New Item"):
    new_item = st.text_input("New item:", key=f"new_{section_key}_{field_key}")
    if st.button("Add", key=f"add_btn_{section_key}_{field_key}"):
      if new_item:
        save_to_history()
        if not isinstance(st.session_state.strategy_data[section_key][field_key], list):
          st.session_state.strategy_data[section_key][field_key] = [st.session_state.strategy_data[section_key][field_key]]
        st.session_state.strategy_data[section_key][field_key].append(new_item)
        st.rerun()


def render_field(section_key, field_key, value, client_name):
  """Render a single field with full CRUD operations"""
  title = field_key.replace("_", " ").title()
  icon = get_dynamic_icon(field_key)

  with st.expander(f"{icon} {title}", expanded=False):
    # Display current value
    if isinstance(value, list):
      st.markdown("**Current Items:**")
      render_list_item(value, section_key, field_key, client_name)
    elif isinstance(value, dict):
      st.markdown("**Current Content:**")
      for k, v in value.items():
        st.markdown(f"**{k.replace('_', ' ').title()}:** {v}")
    else:
      widget_key = f"txt_{section_key}_{field_key}"

      # Main text area with explicit save
      new_val = st.text_area("Content", value=str(value), height=200, key=widget_key)

      # Show save button only if content changed
      if new_val != str(value):
        if st.button("💾 Save Changes", key=f"save_{widget_key}"):
          save_to_history()
          st.session_state.strategy_data[section_key][field_key] = new_val
          st.success("Saved!")
          time.sleep(0.5)
          st.rerun()

    # AI Operations
    st.divider()
    st.markdown("**🤖 AI Operations**")

    col1, col2, col3 = st.columns(3)

    with col1:
      with st.popover("✨ Refine"):
        inst = st.text_input("Instruction:", key=f"inst_{section_key}_{field_key}")
        if st.button("Generate", key=f"refine_{section_key}_{field_key}"):
          if inst:
            current = str(value)
            with st.spinner("Refining..."):
              refined = refine_text(current, inst, client_name)
            st.session_state[f"draft_{section_key}_{field_key}"] = refined
            st.rerun()

        if f"draft_{section_key}_{field_key}" in st.session_state:
          st.info(st.session_state[f"draft_{section_key}_{field_key}"])
          if st.button("✅ Accept", key=f"accept_{section_key}_{field_key}"):
            save_to_history()
            st.session_state.strategy_data[section_key][field_key] = st.session_state[f"draft_{section_key}_{field_key}"]
            del st.session_state[f"draft_{section_key}_{field_key}"]
            st.rerun()

    with col2:
      with st.popover("🔄 Alternatives"):
        count = st.slider("How many?", 2, 5, 3, key=f"alt_count_{section_key}_{field_key}")
        if st.button("Generate", key=f"gen_alt_{section_key}_{field_key}"):
          with st.spinner("Generating alternatives..."):
            alts = generate_alternatives(str(value), count, client_name)
          st.session_state[f"alts_{section_key}_{field_key}"] = alts
          st.rerun()

        if f"alts_{section_key}_{field_key}" in st.session_state:
          for i, alt in enumerate(st.session_state[f"alts_{section_key}_{field_key}"]):
            if st.button(f"Option {i+1}", key=f"alt_{section_key}_{field_key}_{i}"):
              save_to_history()
              st.session_state.strategy_data[section_key][field_key] = alt
              del st.session_state[f"alts_{section_key}_{field_key}"]
              st.rerun()
            st.caption(alt[:100] + "..." if len(str(alt)) > 100 else str(alt))

    with col3:
      if st.button("🗑️ Delete", key=f"delete_{section_key}_{field_key}"):
        save_to_history()
        del st.session_state.strategy_data[section_key][field_key]
        st.rerun()


def render_section(data_dict, section_key, client_name, tone, lang, notes):
  """Render an entire section with CRUD"""
  if not data_dict or section_key not in data_dict:
    return

  content = data_dict[section_key]

  # Section-level operations
  col1, col2, col3 = st.columns([6, 2, 2])
  with col1:
    st.markdown(f"### {section_key.replace('_', ' ').title()}")
  with col2:
    if st.button("🔄 Regenerate Section", key=f"regen_{section_key}"):
      with st.spinner(f"Regenerating {section_key}..."):
        new_data = regenerate_section(section_key, client_name, notes, tone, lang)
        if new_data and section_key in new_data:
          save_to_history()
          st.session_state.strategy_data[section_key] = new_data[section_key]
          st.success("Regenerated!")
          time.sleep(1)
          st.rerun()
  with col3:
    if st.button("➕ Add Field", key=f"add_field_{section_key}"):
      st.session_state[f"show_add_{section_key}"] = True

  if st.session_state.get(f"show_add_{section_key}", False):
    with st.container():
      new_field_name = st.text_input("Field Name:", key=f"new_field_name_{section_key}")
      new_field_value = st.text_area("Field Value:", key=f"new_field_value_{section_key}")
      col_a, col_b = st.columns(2)
      if col_a.button("Add", key=f"confirm_add_{section_key}"):
        if new_field_name and new_field_value:
          save_to_history()
          st.session_state.strategy_data[section_key][new_field_name] = new_field_value
          st.session_state[f"show_add_{section_key}"] = False
          st.rerun()
      if col_b.button("Cancel", key=f"cancel_add_{section_key}"):
        st.session_state[f"show_add_{section_key}"] = False
        st.rerun()

  st.divider()

  if isinstance(content, dict):
    for k, v in content.items():
      render_field(section_key, k, v, client_name)


# --- MAIN APP ---
st.title("🎨 IBE Strategy Generator")
st.caption("Immersive Brand Experience Framework with Full CRUD")
st.divider()

# Generation Section
with st.expander("1️⃣ BRIEFING & GENERATION", expanded=not st.session_state.strategy_data):
  c1, c2 = st.columns([2, 1])
  client = c1.text_input("Project Name", placeholder="e.g. Kopi Mellow", value=st.session_state.client_name)

  s1, s2 = st.columns(2)
  tone = s1.selectbox("Tone", [
      "Premium & Minimalist", "Bold & Disruptive", "Warm & Community",
      "Corporate & Professional", "Luxury & Exclusive", "Playful & Gen Z",
      "Eco-Conscious & Organic"
  ])
  lang = s2.selectbox("Language", [
      "English", "Indonesian", "Spanish", "French", "German", "Japanese",
      "Chinese (Simplified)", "Arabic", "Russian", "Portuguese"
  ])
  notes = st.text_area(
      "Discovery Notes",
      height=150,
      placeholder="Describe the brand, target audience, challenges, vision...")

  with st.expander("⚙️ Select Pillars"):
    col_p1, col_p2, col_p3 = st.columns(3)
    p1 = col_p1.checkbox("1. Brand Core & Ideation", value=True)
    p2 = col_p1.checkbox("2. Visual Identity", value=True)
    p3 = col_p1.checkbox("3. Product Experience", value=True)
    p4 = col_p2.checkbox("4. Market Plan", value=True)
    p5 = col_p2.checkbox("5. Technology & Accessibility", value=True)
    p6 = col_p2.checkbox("6. Brand Activation", value=True)
    p7 = col_p3.checkbox("7. Team Branding", value=True)
    p8 = col_p3.checkbox("8. Security & Trust", value=True)
    p9 = col_p3.checkbox("9. Copywriting Suite", value=True)

  run_btn = st.button("🚀 Generate Full Strategy", type="primary", use_container_width=True)

  if run_btn:
    if not api_key or not notes or not client:
      st.error("⚠️ Please provide API Key, Project Name, and Discovery Notes")
      st.stop()

    requests = []
    if p1: requests.append("1_core_story")
    if p2: requests.append("2_visual_identity")
    if p3: requests.append("3_product_experience")
    if p4: requests.append("4_market_plan")
    if p5: requests.append("5_tech_accessibility")
    if p6: requests.append("6_brand_activation")
    if p7: requests.append("7_team_branding")
    if p8: requests.append("8_security_trust")
    if p9: requests.append("9_copywriting_suite")

    model = genai.GenerativeModel(get_working_model())
    sys = prompts.get_system_prompt(tone, lang)
    master_data = {}
    my_bar = st.progress(0, text="Architecting Strategy...")

    for i, batch in enumerate(requests):
      prompt = prompts.get_smart_prompt([batch], client, notes)
      try:
        response = model.generate_content(sys + prompt)
        batch_data = json.loads(clean_json(response.text))
        master_data.update(batch_data)
      except Exception as e:
        st.warning(f"Skipped {batch}: {e}")
      my_bar.progress((i + 1) / len(requests), text=f"Drafting {batch}...")
      time.sleep(2.0)

    my_bar.empty()
    st.session_state.strategy_data = master_data
    st.session_state.client_name = client
    st.session_state.history = []
    st.success("Strategy Generated!")
    time.sleep(1)
    st.rerun()

# Display Strategy
if st.session_state.strategy_data:
  data = st.session_state.strategy_data
  c_name = st.session_state.client_name

  st.divider()
  st.header(f"STRATEGY: {c_name.upper()}")

  # Action buttons
  col1, col2, col3, col4 = st.columns(4)
  with col1:
    report = format_report(data, c_name)
    st.download_button("📄 Download Report",
                       report,
                       file_name=f"{c_name}_Strategy.txt",
                       use_container_width=True)
  with col2:
    if st.button("💾 Save to Database", use_container_width=True):
      if db.save_project(c_name, data):
        st.success("Saved!")
        time.sleep(1)
        st.rerun()
  with col3:
    if st.button("↩️ Undo Last Change", use_container_width=True, disabled=len(st.session_state.history) == 0):
      undo_last_change()
  with col4:
    st.caption(f"History: {len(st.session_state.history)} states")

  st.divider()

  # Tabs for each pillar
  tabs = st.tabs([
      "1. Brand Core", "2. Visual Identity", "3. Product Experience",
      "4. Market Plan", "5. Tech & Accessibility", "6. Brand Activation",
      "7. Team Branding", "8. Security & Trust", "9. Copywriting"
  ])

  # Store tone, lang, notes for regeneration
  if 'tone' not in locals(): tone = "Premium & Minimalist"
  if 'lang' not in locals(): lang = "English"
  if 'notes' not in locals(): notes = ""

  with tabs[0]:
    render_section(data, "1_core_story", c_name, tone, lang, notes)
  with tabs[1]:
    render_section(data, "2_visual_identity", c_name, tone, lang, notes)
  with tabs[2]:
    render_section(data, "3_product_experience", c_name, tone, lang, notes)
  with tabs[3]:
    render_section(data, "4_market_plan", c_name, tone, lang, notes)
  with tabs[4]:
    render_section(data, "5_tech_accessibility", c_name, tone, lang, notes)
  with tabs[5]:
    render_section(data, "6_brand_activation", c_name, tone, lang, notes)
  with tabs[6]:
    render_section(data, "7_team_branding", c_name, tone, lang, notes)
  with tabs[7]:
    render_section(data, "8_security_trust", c_name, tone, lang, notes)
  with tabs[8]:
    render_section(data, "9_copywriting_suite", c_name, tone, lang, notes)