import builtins
import contextlib
import json
import os
import random  # <--- NEW IMPORT

import google.generativeai as genai
import streamlit as st

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
    st.caption("v2.2 | Lucky Mode")
    if not api_key:
        api_key = st.text_input("API Key Required", type="password")
    else:
        st.success("System Online 🟢")
        with contextlib.suppress(builtins.BaseException):
            genai.configure(api_key=api_key)

    st.divider()
    if st.button("🗑️ New Project (Clear)"):
        st.session_state.strategy_data = None
        st.session_state.chat_history = []
        st.rerun()

# --- MAIN LAYOUT ---
c1, c2, c3 = st.columns([2, 1, 1])
with c1: st.title("IBE Strategy Generator")
with c2: brand_tone = st.selectbox("Tone", ["Premium & Minimalist", "Bold & Disruptive", "Warm & Community", "Corporate"], label_visibility="collapsed")
with c3: language = st.radio("Language", ["English", "Indonesian"], horizontal=True, label_visibility="collapsed")

st.divider()

# --- INPUT SECTION ---
with st.expander("1. BRIEFING & INPUTS", expanded=True):
    lc, rc = st.columns([1, 1])
    with lc:
        client_name = st.text_input("Project Name", placeholder="e.g. Kopi Mellow")
    with rc:
        generate_btn = st.button("🚀 Generate Strategy", type="primary", use_container_width=True)

    raw_notes = st.text_area("Discovery Notes", height=200, placeholder="Paste interview notes here...")

# --- GENERATION LOGIC ---
if generate_btn:
    if not api_key or not raw_notes:
        st.error("Check API Key and Notes.")
        st.stop()

    with st.spinner(f"🧠 Architects are drafting strategy for {client_name}..."):
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
    tabs = st.tabs(["Summary", "1-2 Core/Visual", "3-5 Exp/Tech", "4-6 Mkt/Act", "7-8 Team/Trust"])

    with tabs[0]: st.write(data.get('executive_summary'))
    with tabs[1]:
        c1, c2 = st.columns(2)
        with c1: st.markdown("#### 1. BRAND CORE"); st.write(mods.get('1_core_story'))
        with c2: st.markdown("#### 2. VISUAL IDENTITY"); st.write(mods.get('2_visual_identity'))
    with tabs[2]:
        c1, c2 = st.columns(2)
        with c1: st.markdown("#### 3. PRODUCT EXP"); st.write(mods.get('3_product_experience'))
        with c2: st.markdown("#### 5. DIGITAL INTEG"); st.write(mods.get('5_tech_accessibility'))
    with tabs[3]:
        c1, c2 = st.columns(2)
        with c1: st.markdown("#### 4. MARKET PLAN"); st.write(mods.get('4_market_plan'))
        with c2: st.markdown("#### 6. ACTIVATION"); st.write(mods.get('6_brand_activation'))
    with tabs[4]:
        c1, c2 = st.columns(2)
        with c1: st.markdown("#### 7. TEAM"); st.write(mods.get('7_team_branding'))
        with c2: st.markdown("#### 8. TRUST"); st.write(mods.get('8_security_trust'))

    st.divider()

    # --- 3. REFINEMENT & LUCKY BUTTON ---
    st.subheader("3. Refine & Polish")

    # HISTORY
    for message in st.session_state.chat_history:
        with st.chat_message(message["role"]):
            st.write(message["content"])

    # LOGIC: Check for "Lucky" click OR Manual Input
    user_input = st.chat_input("Ex: 'Make the tone more aggressive'...")
    lucky_clicked = st.button("🎲 I'm Feeling Lucky (Random Pivot)", help="Click to generate a random creative variation")

    prompt_to_process = None

    if lucky_clicked:
        # 1. Pick a random direction from prompts.py
        pivot = random.choice(prompts.LUCKY_PIVOTS)
        prompt_to_process = f"🎲 LUCKY MODE: {pivot}"

    elif user_input:
        prompt_to_process = user_input

    # PROCESS THE PROMPT
    if prompt_to_process:
        # Add to history
        st.session_state.chat_history.append({"role": "user", "content": prompt_to_process})
        with st.chat_message("user"):
            st.write(prompt_to_process)

        # Generate Response
        with st.chat_message("assistant"):
            with st.spinner("Refining Strategy..."):
                refine_prompt = f"""
                CONTEXT: You are the IBE Brand Strategist.
                CURRENT STRATEGY JSON: {json.dumps(st.session_state.strategy_data)}
                USER REQUEST: {prompt_to_process}

                INSTRUCTION: Provide a revised version or creative variation based on the request.
                """
                model = genai.GenerativeModel("gemini-1.5-flash")
                response = model.generate_content(refine_prompt)

                st.write(response.text)
                st.session_state.chat_history.append({"role": "assistant", "content": response.text})