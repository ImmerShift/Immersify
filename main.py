import json

import google.generativeai as genai
import streamlit as st

# --- PAGE CONFIGURATION ---
st.set_page_config(page_title="ImmerShift Engine", layout="wide")

# --- SIDEBAR ---
with st.sidebar:
    st.header("⚡ ImmerShift Engine")
    api_key = st.text_input("Enter Google Gemini API Key", type="password")

    if api_key:
        st.success("API Key Provided")
        genai.configure(api_key=api_key)
    else:
        st.warning("Please enter your API Key to proceed.")

# --- MAIN INTERFACE ---
st.title("Immersify: 8-Pillar Brand Engine")
st.markdown(
    "### Generate comprehensive brand strategies based on the Immersive Framework."
)

col1, col2 = st.columns([1, 1])

with col1:
    st.subheader("1. Discovery Input")
    client_name = st.text_input("Client Name", placeholder="e.g. WoW Coliving")
    raw_notes = st.text_area("Paste Discovery Notes / Context", height=300, placeholder="Enter specific details about the brand, target audience, and goals...")

generate_btn = st.button("Generate Strategy", type="primary")

# --- CORE LOGIC ---
def get_system_prompt():
    return """
    You are a Strategic Brand Consultant for 'ImmerShift'. 
    Analyze the client input and generate a strategy based on the 'Immersive Brand Experience' framework.

    Output MUST be valid JSON with the following structure (no markdown formatting like ```json):
    {
        "executive_summary": "Short overview",
        "modules": {
            "1_core_story": "Brand Core Story & Ideation points...",
            "2_visual_identity": "Visual Identity direction...",
            "3_product_experience": "Product Experience insights...",
            "4_market_plan": "Market Plan strategy...",
            "5_tech_accessibility": "Technology & Accessibility recommendations...",
            "6_brand_activation": "Brand Activation ideas...",
            "7_team_branding": "Team Branding & Culture...",
            "8_security_trust": "Security and Trust protocols..."
        }
    }
    """

if generate_btn:
    if not api_key:
        st.error("❌ STOP: You need to put the Gemini API Key in the sidebar first.")
    elif not raw_notes:
        st.error("❌ STOP: Please provide discovery notes.")
    else:
        # Initialize variable to prevent crash if API fails
        raw_res = "No response generated."

        with col2:
            st.subheader("2. Strategic Output")
            status_box = st.empty()
            status_box.info("Thinking... Analyzing 8 Pillars...")

            try:
                # 1. Setup Model
                model = genai.GenerativeModel("gemini-1.5-flash")

                # 2. Construct Prompt
                full_prompt = f"{get_system_prompt()}\n\nCLIENT: {client_name}\nNOTES: {raw_notes}"

                # 3. Generate
                response = model.generate_content(full_prompt)
                raw_res = response.text 

                # 4. Clean JSON (Strip markdown if Gemini adds it)
                clean_json = raw_res.replace("```json", "").replace("```", "").strip()

                # 5. Parse
                data = json.loads(clean_json)

                status_box.success("Strategy Generated!")

                # --- DISPLAY TABS ---
                tabs = st.tabs(["Overview", "Core & Visuals", "Experience & Tech", "Market & Team", "Raw JSON"])

                modules = data.get('modules', {})

                # Tab 1: Overview
                with tabs[0]:
                    st.markdown(f"### Strategy for {client_name}")
                    st.write(data.get('executive_summary', 'No summary provided.'))

                # Tab 2: Core & Visuals (Pillars 1-2)
                with tabs[1]:
                    st.markdown("#### 1. Brand Core Story")
                    st.write(modules.get('1_core_story', 'N/A'))
                    st.divider()
                    st.markdown("#### 2. Visual Identity")
                    st.write(modules.get('2_visual_identity', 'N/A'))

                # Tab 3: Experience (Pillars 3, 5, 8)
                with tabs[2]:
                    st.markdown("#### 3. Product Experience")
                    st.write(modules.get('3_product_experience', 'N/A'))
                    st.divider()
                    st.markdown("#### 5. Technology & Accessibility")
                    st.write(modules.get('5_tech_accessibility', 'N/A'))
                    st.divider()
                    st.markdown("#### 8. Security & Trust")
                    st.write(modules.get('8_security_trust', 'N/A'))

                # Tab 4: Market & Team (Pillars 4, 6, 7)
                with tabs[3]:
                    st.markdown("#### 4. Market Plan")
                    st.write(modules.get('4_market_plan', 'N/A'))
                    st.divider()
                    st.markdown("#### 6. Brand Activation")
                    st.write(modules.get('6_brand_activation', 'N/A'))
                    st.divider()
                    st.markdown("#### 7. Team Branding")
                    st.write(modules.get('7_team_branding', 'N/A'))

                # Tab 5: Debug
                with tabs[4]:
                    st.json(data)

            except json.JSONDecodeError:
                st.error("Error: The AI generated invalid JSON.")
                with st.expander("View Raw Output to Debug"):
                    st.text(raw_res)
            except Exception as e:
                st.error(f"An error occurred: {e}")
                with st.expander("View Raw Output (if any)"):
                    st.text(raw_res)