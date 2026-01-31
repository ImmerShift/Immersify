# IBE Strategy Generator - Immersify

## Overview
An AI-powered Immersive Brand Experience (IBE) Strategy Generator with comprehensive CRUD functionality.

## Features

### 🎯 Core Capabilities
- **9-Pillar IBE Framework**: Complete brand strategy generation
- **AI-Powered Generation**: Uses Google Gemini for intelligent content creation
- **Full CRUD Operations**: Create, Read, Update, Delete on all strategy elements
- **Version Control**: Undo/redo functionality with history tracking
- **Project Management**: Save, load, and manage multiple projects

### ✨ Enhanced CRUD Features

#### **Create**
- Generate complete brand strategies across 9 pillars
- Add new fields to any section
- Add new items to lists (taglines, colors, services, etc.)
- Create custom content sections

#### **Read**
- View organized strategy in tabbed interface
- Browse all sections with expandable fields
- Export as downloadable text reports
- Review version history

#### **Update**
- Direct text editing with save functionality
- AI-powered refinement with custom instructions
- Generate alternative versions
- Regenerate entire sections
- Real-time editing for list items

#### **Delete**
- Remove individual list items
- Delete entire fields
- Remove projects from database
- Clear specific sections

### 🤖 AI Operations

1. **Refine with AI**
   - Provide custom instructions
   - Preview refined version before accepting
   - Maintain original content if not satisfied

2. **Generate Alternatives**
   - Create 2-5 alternative versions
   - Choose the best option
   - Maintain brand consistency

3. **Section Regeneration**
   - Regenerate entire pillars
   - Fresh perspectives while maintaining context
   - Undo if not satisfied

### 💾 Data Management

- **Auto-save**: Manual save checkpoints
- **Version History**: Track up to 10 changes
- **Undo Functionality**: Revert to previous states
- **Database Storage**: SQLite with version tracking
- **Export Options**: Download complete reports

## Installation

### Prerequisites
- Python 3.8+
- Google Gemini API Key

### Setup

```bash
cd /app/streamlit
pip install -r requirements.txt
```

### Environment Variables

Set your Google Gemini API key:

```bash
export GOOGLE_API_KEY="your-api-key-here"
# or
export GEMINI_API_KEY="your-api-key-here"
```

Alternatively, enter it in the sidebar when you run the app.

## Usage

### Running the App

```bash
streamlit run app.py --server.port 8501
```

The app will be available at `http://localhost:8501`

### Workflow

1. **Start New Project**
   - Click "Start New Project" in sidebar
   - Enter project name and discovery notes
   - Select tone and language
   - Choose which pillars to generate
   - Click "Generate Full Strategy"

2. **Edit Content**
   - Navigate to any pillar tab
   - Expand fields to view/edit
   - Use text areas for direct editing
   - Click "Save Changes" to commit

3. **Use AI Operations**
   - **Refine**: Provide instructions to improve content
   - **Alternatives**: Generate multiple options
   - **Regenerate**: Create fresh section content

4. **Manage Lists**
   - Edit individual items with ✏️ button
   - Delete items with 🗑️ button
   - Add new items with "➕ Add New Item"

5. **Version Control**
   - Changes are tracked automatically
   - Click "Undo Last Change" to revert
   - Save states manually with "Save Current State"

6. **Save & Export**
   - "Save to Database": Store project
   - "Download Report": Export as text file
   - Load projects from sidebar

## The 9 Pillars

1. **Brand Core & Ideation**: Purpose, values, mission, vision, UVP
2. **Visual Identity**: Colors, typography, logo, visual prompts
3. **Product Experience**: Sensory design, packaging, wow moments
4. **Market Plan**: Audience, content, channels, competitors
5. **Technology & Accessibility**: UX, digital integration, accessibility
6. **Brand Activation**: Events, rituals, partnerships, activations
7. **Team Branding**: Culture, verbal identity, service standards
8. **Security & Trust**: Privacy, safety, reputation, trust signals
9. **Copywriting Suite**: Taglines, pitches, headlines, social content

## File Structure

```
/app/streamlit/
├── app.py              # Main Streamlit application
├── prompts.py          # AI prompt templates
├── db.py               # Database operations
├── requirements.txt    # Python dependencies
├── README.md           # This file
└── immersify.db        # SQLite database (auto-created)
```

## Database Schema

### projects
- `id`: Primary key
- `client_name`: Project name
- `strategy_data`: JSON strategy content
- `created_at`: Creation timestamp
- `updated_at`: Last update timestamp

### project_versions
- `id`: Primary key
- `project_id`: Foreign key to projects
- `strategy_data`: JSON snapshot
- `created_at`: Version timestamp

## Features in Detail

### List Management
- Add/edit/delete individual items
- Automatic list conversion (string → list)
- Inline editing with save confirmation

### Field Operations
- Add custom fields to any section
- Delete fields you don't need
- Reorganize content structure

### AI Refinement
- Context-aware improvements
- Custom instruction support
- Preview before accepting
- Maintains brand tone and language

### Alternative Generation
- Generate 2-5 alternatives per field
- Compare options side-by-side
- One-click replacement

### Section Regeneration
- Complete pillar regeneration
- Uses original brief context
- Maintains consistency with other sections

## Tips & Best Practices

1. **Save Frequently**: Use "Save Current State" before major changes
2. **Use AI Wisely**: Refine with specific instructions for best results
3. **Review Alternatives**: Generate alternatives when stuck
4. **Version Control**: Leverage undo for experimentation
5. **Export Regularly**: Download reports as backups

## Troubleshooting

### API Key Issues
- Ensure your Gemini API key is valid
- Check quota and rate limits
- Try alternative model if gemini-1.5-flash fails

### Generation Errors
- Provide detailed discovery notes
- Check internet connection
- Retry individual sections if batch fails

### Database Issues
- Check file permissions for `immersify.db`
- Delete database to reset (removes all projects)

## Version History

- **v16.0**: Enhanced CRUD with item-level operations
- **v15.0**: Callback architecture for state management
- **v14.0**: AI refinement features
- **v13.0**: Initial database integration

## License
Proprietary - Immersify Platform

## Support
For issues or questions, contact the Immersify team.
