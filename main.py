import json
import os

import google.generativeai as genai
import streamlit as st

# IMPORT YOUR BRAIN
import prompts

# --- CONFIG ---
st.set_page_config(page_title="IBE Engine", layout="wide", initial_sidebar_state="expanded")

# --- AUTH ---
api_key = os.environ.get("GOOGLE_API_KEY") or os.environ.get("GEMINI_API_KEY")

# --- SIDEBAR ---
with st.sidebar:
    st.header("⚡ IBE Engine")
    st.caption("v2.0 | Modular Architecture")
    if not api_key:
        api_key = st.text_input("API Key Required", type="password")
    else:
        st.success("System Online 🟢")
        genai.configure(api_key=api_key)

# --- MAIN LAYOUT ---
c1, c2, c3 = st.columns([2, 1, 1])
with c1: st.title("IBE Strategy Generator")
with c2: brand_tone = st.selectbox("Tone", ["Premium & Minimalist", "Bold & Disruptive", "Warm & Community", "Corporate"], label_visibility="collapsed")
with c3: language = st.radio("Language", ["English", "Indonesian"], horizontal=True, label_visibility="collapsed")

st.divider()

left_col, right_col = st.columns([1, 1])

# --- INPUT ---
with left_col:
    st.subheader("1. Briefing")
    client_name = st.text_input("Project Name", placeholder="e.g. Kopi Mellow")
    raw_notes = st.text_area("Discovery Notes", height=450)
    generate_btn = st.button("🚀 Generate Strategy", type="primary", use_container_width=True)

# --- OUTPUT ---
with right_col:
    st.subheader("2. Strategy Output")

    if generate_btn:
        if not api_key or not raw_notes:
            st.error("Check API Key and Notes.")
            st.stop()

        status = st.info(f"🧠 Architects are working on {client_name}...")

        try:
            # 1. LOAD THE BRAIN FROM PROMPTS.PY
            system_prompt = prompts.get_system_prompt(brand_tone, language)

            # 2. RUN AI
            model = genai.GenerativeModel("gemini-1.5-flash")
            full_prompt = f"{system_prompt}\n\nCLIENT: {client_name}\nNOTES: {raw_notes}"
            response = model.generate_content(full_prompt)

            # 3. PARSE
            clean_json = response.text.replace("```json", "").replace("```", "").strip()
            data = json.loads(clean_json)

            status.empty()

            # 4. DOWNLOAD BUTTON (New Feature)
            st.download_button(
                label="📥 Download Strategy (JSON)",
                data=json.dumps(data, indent=4),
                file_name=f"{client_name}_Strategy.json",
                mime="application/json",
                use_container_width=True
            )

            # 5. DISPLAY TABS
            tabs = st.tabs(["Summary", "1-2 Core/Visual", "3-5 Exp/Tech", "4-6 Mkt/Act", "7-8 Team/Trust"])
            mods = data.get('modules', {})

            with tabs[0]: st.write(data.get('executive_summary'))
            with tabs[1]:
                st.markdown("#### 1. BRAND CORE"); st.write(mods.get('1_core_story'))
                st.divider()
                st.markdown("#### 2. VISUAL IDENTITY"); st.write(mods.get('2_visual_identity'))
            with tabs[2]:
                st.markdown("#### 3. PRODUCT EXP"); st.write(mods.get('3_product_experience'))
                st.divider()
                st.markdown("#### 5. DIGITAL INTEG"); st.write(mods.get('5_tech_accessibility'))
            with tabs[3]:
                st.markdown("#### 4. MARKET PLAN"); st.write(mods.get('4_market_plan'))
                st.divider()
                st.markdown("#### 6. ACTIVATION"); st.write(mods.get('6_brand_activation'))
            with tabs[4]:
                st.markdown("#### 7. TEAM"); st.write(mods.get('7_team_branding'))
                st.divider()
                st.markdown("#### 8. TRUST"); st.write(mods.get('8_security_trust'))

        except Exception as e:
            st.error(f"Error: {e}")