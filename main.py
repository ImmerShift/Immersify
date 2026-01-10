import streamlit as st
import google.generativeai as genai
import json
import os
import random
import prompts 

# --- CONFIG ---
st.set_page_config(page_title="IBE Engine", layout="wide", initial_sidebar_state="expanded")

# --- SESSION STATE ---
if "strategy_data" not in st.session_state:
    st.session_state.strategy_data = None
if "chat_history" not in st.session_state:
    st.session_state.chat_history = []

# --- AUTH ---
api_key = os.environ.get("GOOGLE_API_KEY") or os.environ.get("GEMINI_API_KEY")

# --- SIDEBAR ---
with st.sidebar:
    st.header("⚡ IBE Engine")
    st.caption("v2.3 | Global Edition")
    if not api_key:
        api_key = st.text_input("API Key Required", type="password")
    else:
        st.success("System Online 🟢")
        try:
            genai.configure(api_key=api_key)
        except: pass

    st.divider()
    if st.button("🗑️ New Project (Clear)"):
        st.session_state.strategy_data = None
        st.session_state.chat_history = []
        st.rerun()

# --- MAIN LAYOUT ---
st.title("IBE Strategy Generator")
st.caption("Immersive Brand Experience Framework")

st.divider()

# --- INPUT SECTION (CONSOLIDATED) ---
with st.expander("1. BRIEFING & INPUTS", expanded=True):
    # ROW 1: Name & Action
    c1, c2 = st.columns([2, 1])
    with c1:
        client_name = st.text_input("Project Name", placeholder="e.g. Kopi Mellow")
    with c2:
        generate_btn = st.button("🚀 Generate Strategy", type="primary", use_container_width=True)

    # ROW 2: Settings (Tone & Language) - NOW HERE
    s1, s2 = st.columns(2)
    with s1:
        brand_tone = st.selectbox(
            "Brand Tone", 
            ["Premium & Minimalist", "Bold & Disruptive", "Warm & Community-Focused", "Corporate & Professional", "Luxury & Exclusive", "Playful & Gen Z"]
        )
    with s2:
        language = st.selectbox(
            "Output Language", 
            ["English", "Indonesian", "Spanish", "French", "German", "Japanese", "Chinese (Simplified)", "Arabic", "Russian", "Portuguese"]
        )

    # ROW 3: Notes
    raw_notes = st.text_area("Discovery Notes", height=200, placeholder="Paste interview notes, raw ideas, or meeting minutes here...")

# --- GENERATION LOGIC ---
if generate_btn:
    if not api_key or not raw_notes:
        st.error("⚠️ Check API Key and Notes.")
        st.stop()

    with st.spinner(f"🧠 Architects are drafting {language} strategy for {client_name}..."):
        try:
            system_prompt = prompts.get_system_prompt(brand_tone, language)
            model = genai.GenerativeModel("gemini-1.5-flash")
            full_prompt = f"{system_prompt}\n\nCLIENT: {client_name}\nNOTES: {raw_notes}"
            response = model.generate_content(full_prompt)

            clean_json = response.text.replace("```json", "").replace("```", "").strip()
            st.session_state.strategy_data = json.loads(clean_json)
            st.session_state.chat_history = [] 

        except Exception as e:
            st.error(f"Error: {e}")

# --- OUTPUT SECTION ---
if st.session_state.strategy_data:
    data = st.session_state.strategy_data
    mods = data.get('modules', {})

    st.subheader(f"2. STRATEGY: {client_name}")

    # DOWNLOAD
    st.download_button(
        label="📥 Download JSON",
        data=json.dumps(data, indent=4),
        file_name=f"{client_name}_Strategy.json",
        mime="application/json"
    )

    # TABS
    tabs = st.tabs(["Summary", "1-2 Core/Visual", "3-5 Experience", "6-8 Growth", "Raw"])

    with tabs[0]:
        st.write(data.get('executive_summary', 'No summary'))

    with tabs[1]:
        st.markdown("#### 1. Core Story")
        st.write(mods.get('1_core_story', 'N/A'))
        st.markdown("#### 2. Visual Identity")
        st.write(mods.get('2_visual_identity', 'N/A'))

    with tabs[2]:
        st.markdown("#### 3. Product Experience")
        st.write(mods.get('3_product_experience', 'N/A'))
        st.markdown("#### 5. Tech & Accessibility")
        st.write(mods.get('5_tech_accessibility', 'N/A'))

    with tabs[3]:
        st.markdown("#### 4. Market Plan")
        st.write(mods.get('4_market_plan', 'N/A'))
        st.markdown("#### 6. Brand Activation")
        st.write(mods.get('6_brand_activation', 'N/A'))
        st.markdown("#### 7. Team Branding")
        st.write(mods.get('7_team_branding', 'N/A'))
        st.markdown("#### 8. Security & Trust")
        st.write(mods.get('8_security_trust', 'N/A'))

    with tabs[4]:
        st.json(data)