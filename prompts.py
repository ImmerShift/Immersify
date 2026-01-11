def get_system_prompt(tone, language):
    return f"""
    ROLE: 
    You are an expert Brand Architect & Copywriting Chief specializing in the 'Immersive Brand Experience' (IBE) framework.
    Your goal is not just to fill boxes, but to build a "Soul" for the client.

    TONE: {tone}
    LANGUAGE: {language}
    FORMAT: JSON ONLY. No intro, no markdown.
    """

# THE MASTER DICTIONARY (STANDARD TERMS)
PILLAR_DEFINITIONS = {
    "1_core_story": """
        "1_core_story": { 
            "core_purpose": "Don't just write a history. Write the emotional spark that started it all. Why does this exist beyond money?", 
            "brand_name_critique": "Analyze the current name's phonetics and psychology. Does it sound like the brand's promise? If not, suggest 3 evocative alternatives.", 
            "unique_value_proposition": "Why is this the *only* solution for a specific audience? What is the strategic hook that makes competition irrelevant?", 
            "brand_promise": "A single, unbreakable promise the brand makes to every customer, every time.", 
            "hero_journey": "Frame the customer as the Hero and the brand as the Guide. What dragon are they slaying?", 
            "brand_archetypes": "Who is the brand? (e.g., The Rebel, The Sage). Define its personality traits.", 
            "brand_guidelines_outline": "A structure for the sacred document that keeps the brand consistent.", 
            "vision_and_mission": "The North Star (Vision) and the Daily March (Mission)."
        } 
        INSTRUCTION: Focus on the 'Soul' and 'Truth' of the brand. Be deep and specific.
    """,

    "2_visual_identity": """
        "2_visual_identity": { 
            "color_palette": "Don't just pick colors; explain their emotional impact. Why 'Sage Green'? (e.g., to lower cortisol). Provide Hex Codes.", 
            "typography": "Select fonts that 'speak' the brand's tone. (e.g., A Serif for authority, a Script for intimacy).", 
            "visual_prompts": "Write 3 highly descriptive, artistic prompts the user can paste into Midjourney/DALL-E to generate the *exact* vibe.", 
            "logo_usage": "Rules for where the mark lives to maximize status and recognition.", 
            "graphic_elements": "The supporting visual language (e.g., grit, gradients, patterns)."
        } 
        INSTRUCTION: Be artistic, vivid, and highly specific.
    """,

    "3_product_experience": """
        "3_product_experience": { 
            "5_senses": "Break down the experience beyond sight. What does the brand *smell* like? *Sound* like? *Feel* like under the fingertips?", 
            "unboxing_ritual": "The 'peak moment' of delivery. How do we turn a simple transaction into a ceremonial memory?", 
            "packaging_design": "How the physical container communicates value before the product is even seen.", 
            "wow_moments": "Planned surprises in the customer journey that trigger dopamine.", 
            "atmosphere": "Designing the 'Vibe' (lighting, temperature, flow) to control the customer's mood."
        } 
        INSTRUCTION: Focus on sensory immersion and memory creation.
    """,

    "4_market_plan": """
        "4_market_plan": { 
            "target_audience": "Forget 'Males 25-40.' Who are they *internally*? What do they fear? What do they desire? (e.g., 'The Burned-Out Achiever').", 
            "content_pillars": "The 3-4 core themes the brand will own in the conversation.", 
            "distribution_channels": "Where does the audience hang out? (Online & Offline mix).", 
            "competitor_analysis": "What is everyone else doing wrong, and how will we do it right?", 
            "community_strategy": "How to turn customers into fans who talk to *each other*.", 
            "influencer_strategy": "Which voices does the audience trust?"
        } 
        INSTRUCTION: Focus on 'Tribe', 'Belonging', and 'Internal Desires'.
    """,

    "5_tech_accessibility": """
        "5_tech_accessibility": { 
            "tech_empowerment": "How does technology remove friction and lift the burden for the customer? (e.g., Automating boring tasks, simplifying complex choices).", 
            "user_experience_ux": "Define the 'feel' of the website/app. It must match the brand's soul (e.g., Calm & Minimalist vs. Bold & Fast).", 
            "digital_integration": "How to use digital tools to enhance the physical space? (e.g., QR storytelling, interactive displays, smart lighting).", 
            "operational_systems": "(If relevant) Brief suggestion on internal systems (ERP/POS) that ensure the brand promise is delivered consistently.", 
            "accessibility_standards": "Going beyond compliance. How to design for Neurodiversity, Physical Ease, and Digital Inclusion so the brand welcomes everyone."
        } 
        INSTRUCTION: Focus on 'Tech as a Friendly Giant' that empowers the user.
    """,

    "6_brand_activation": """
        "6_brand_activation": { 
            "launch_event": "A high-impact event concept to announce the brand's arrival.", 
            "community_rituals": "Weekly or monthly traditions that build habit and belonging (e.g., 'Sunday Silent Hours').", 
            "partnerships": "Partnerships with other brands that share the same values but different products.", 
            "offline_activations": "Physical pop-ups or guerrilla marketing ideas to meet the customer in the real world."
        } 
        INSTRUCTION: Focus on high-impact, real-world connection.
    """,

    "7_team_branding": """
        "7_team_branding": { 
            "wardrobe_guidelines": "How the team looks is part of the UI. Define the 'Uniform' not as clothing, but as a costume for the role.", 
            "verbal_identity": "Scripts, greetings, and vocabulary. How do we say 'Hello' and 'Sorry' in the brand's voice?", 
            "service_culture": "The code of conduct. Is it 'formal & invisible' or 'casual & best-friend'?", 
            "core_customer_desires": "Explicitly define the TWO deep emotional needs this team must fulfill for the customer (e.g., 'To feel Safe' and 'To feel Important').", 
            "leadership_style": "How leaders exemplify the brand values to the team, so the team can exemplify them to the customer."
        } 
        INSTRUCTION: The team are the ambassadors. Focus on culture and behavior.
    """,

    "8_security_trust": """
        "8_security_trust": { 
            "data_privacy": "How we protect their digital self. Privacy as a premium service.", 
            "physical_safety": "Protocols that make the customer feel physically secure in the space.", 
            "reputation_management": "Strategy for handling bad reviews with grace and turning critics into fans.", 
            "trust_signals": "Certifications, transparency policies, and social proof elements."
        } 
        INSTRUCTION: Trust is the new currency. Be specific.
    """,

    "9_copywriting_suite": """
        "9_copywriting_suite": { 
            "brand_taglines": "5 catchy, memorable, 'sticky' taglines that summarize the UVP.", 
            "elevator_pitch": "A 30-second script that sells the brand instantly to a stranger.", 
            "website_headlines": "A Hook (Headline) and a Reassurance (Subheadline) for the Homepage.", 
            "about_us_story": "A 2-paragraph soulful narrative about how and why this started.", 
            "service_descriptions": "Compelling, benefit-driven copy for 3 core offerings.", 
            "social_media_captions": "5 ready-to-post captions for Instagram/TikTok that match the Brand Tone."
        } 
        INSTRUCTION: Write final, copy-paste ready creative text. No placeholders.
    """
}

def get_smart_prompt(selected_pillars, client_name, notes):
    """Dynamically builds a prompt based on EXACTLY what the user selected."""
    requested_keys = ""
    for p in selected_pillars:
        if p in PILLAR_DEFINITIONS:
            requested_keys += PILLAR_DEFINITIONS[p] + "\n"

    return f"""
    CLIENT: {client_name}
    NOTES: {notes}

    TASK: Generate the following specific sections of the strategy.
    Use the specific sub-instructions provided for each section.

    SECTIONS TO GENERATE:
    {requested_keys}

    IMPORTANT: Output MUST be a valid JSON object containing exactly the top-level keys listed above (e.g., "1_core_story", "2_visual_identity").
    """

LUCKY_PIVOTS = [
    "Pivot to 'Dark Mode': Moody, mysterious, and exclusive.",
    "Pivot to 'Gen Z Chaos': Use slang, memes, and unhinged energy.",
    "Pivot to 'Ultra-Luxury': High price point, snobbish, and elegant.",
    "Pivot to 'Eco-Radical': Sustainability is the only thing that matters.",
    "Pivot to 'Minimalist Zen': Apple-like simplicity. Less is more.",
    "Pivot to 'Gamified': Make everything a game/challenge for customers."
]