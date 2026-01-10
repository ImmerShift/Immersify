import json
import os

import google.generativeai as genai
import streamlit as st

st.set_page_config(page_title="ImmerShift Engine", layout="wide")

# --- SMART API KEY LOADING ---
# This checks for EITHER name, so it works with your current Secret
api_key = os.environ.get("GOOGLE_API_KEY") or os.environ.get("GEMINI_API_KEY")

with st.sidebar:
    st.header("⚡ ImmerShift Engine")

    if api_key:
        st.success("API Key Auto-Loaded 🔒")
    else:
        # Only asks if NO secret is found
        api_key = st.text_input("Enter API Key", type="password")

    if api_key:
        try:
            genai.configure(api_key=api_key)
        except Exception as e:
            st.error(f"Key Error: {e}")

# --- APP INTERFACE ---
st.title("Immersify: 8-Pillar Brand Engine")

col1, col2 = st.columns([1, 1])

with col1:
    st.subheader("1. Discovery Input")
    client_name = st.text_input("Client Name")
    raw_notes = st.text_area("Discovery Notes", height=300)
    generate_btn = st.button("Generate Strategy", type="primary")

def get_system_prompt():
    return """You are a Strategic Brand Consultant. Output valid JSON only.
    Structure: {"executive_summary": "...", "modules": {"1_core_story": "...", "2_visual_identity": "...", "3_product_experience": "...", "4_market_plan": "...", "5_tech_accessibility": "...", "6_brand_activation": "...", "7_team_branding": "...", "8_security_trust": "..."}}"""

if generate_btn:
    if not api_key:
        st.error("❌ API Key missing. Check Replit Secrets.")
    elif not raw_notes:
        st.error("❌ Please enter notes.")
    else:
        with col2:
            st.subheader("2. Strategic Output")
            status = st.info("Thinking...")
            try:
                model = genai.GenerativeModel("gemini-1.5-flash")
                full_prompt = f"{get_system_prompt()}\nCLIENT: {client_name}\nNOTES: {raw_notes}"

                response = model.generate_content(full_prompt)
                clean_json = response.text.replace("```json", "").replace("```", "").strip()
                data = json.loads(clean_json)

                status.success("Done!")

                tabs = st.tabs(["Overview", "Brand Core", "Experience", "Growth", "Raw"])

                with tabs[0]:
                    st.write(data.get('executive_summary'))

                # Grouping for cleaner code
                mods = data.get('modules', {})
                with tabs[1]:
                    st.markdown("#### 1. Core Story"); st.write(mods.get('1_core_story'))
                    st.markdown("#### 2. Visuals"); st.write(mods.get('2_visual_identity'))
                with tabs[2]:
                    st.markdown("#### 3. Product"); st.write(mods.get('3_product_experience'))
                    st.markdown("#### 5. Tech"); st.write(mods.get('5_tech_accessibility'))
                    st.markdown("#### 8. Security"); st.write(mods.get('8_security_trust'))
                with tabs[3]:
                    st.markdown("#### 4. Market"); st.write(mods.get('4_market_plan'))
                    st.markdown("#### 6. Activation"); st.write(mods.get('6_brand_activation'))
                    st.markdown("#### 7. Team"); st.write(mods.get('7_team_branding'))
                with tabs[4]: st.json(data)

            except Exception as e:
                st.error(f"Error: {e}")
                st.text(response.text if 'response' in locals() else "No response")