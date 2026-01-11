"# Complete CRUD Guide for IBE Strategy Generator

## Overview
This guide explains all Create, Read, Update, and Delete operations available in the IBE Strategy Generator.

---

## \ud83c\udfaf CRUD Operations Summary

### **C - CREATE**
- Generate complete brand strategies
- Add new sections/fields
- Add items to lists
- Create alternative versions

### **R - READ**
- View all strategy content
- Browse organized sections
- Export reports
- Review version history

### **U - UPDATE**
- Edit text directly
- AI-powered refinement
- Generate alternatives
- Regenerate sections

### **D - DELETE**
- Remove list items
- Delete fields
- Remove entire sections
- Delete projects

---

## Detailed Operations

### 1. CREATE Operations

#### 1.1 Generate New Strategy
**Location**: Main page, \"BRIEFING & GENERATION\" section

**Steps**:
1. Enter Project Name
2. Select Tone and Language
3. Add Discovery Notes
4. Select pillars to generate
5. Click \"Generate Full Strategy\"

**Result**: Complete strategy generated across selected pillars

#### 1.2 Add New Field to Section
**Location**: Within any pillar tab

**Steps**:
1. Navigate to desired pillar
2. Click \"\u2795 Add Field\" button
3. Enter field name
4. Enter field value
5. Click \"Add\"

**Example**: Adding a new \"Brand Personality\" field to Brand Core section

#### 1.3 Add Item to List
**Location**: Within any field that contains a list

**Steps**:
1. Expand the field (e.g., \"Brand Taglines\")
2. Scroll to \"\u2795 Add New Item\"
3. Enter the new item
4. Click \"Add\"

**Example**: Adding a 6th tagline to \"Brand Taglines\" list

#### 1.4 Create New Project
**Location**: Sidebar

**Steps**:
1. Click \"\u2795 Start New Project\"
2. Existing data is cleared
3. Start fresh generation

---

### 2. READ Operations

#### 2.1 View Strategy Content
**Location**: All pillar tabs

**Features**:
- Expandable sections with icons
- Organized by pillars
- Collapsible for easy navigation

#### 2.2 Browse Projects
**Location**: Sidebar

**Steps**:
1. View \"Saved Projects\" list
2. See project name and date
3. Select from dropdown

#### 2.3 Export Report
**Location**: Below strategy header

**Steps**:
1. Click \"\ud83d\udcc4 Download Report\"
2. Text file downloads with complete strategy
3. Filename: `{ProjectName}_Strategy.txt`

#### 2.4 Review History
**Location**: Main action bar

**Info**: View count of saved states (up to 10)

---

### 3. UPDATE Operations

#### 3.1 Direct Text Editing
**Location**: Any text field

**Steps**:
1. Expand the field
2. Edit content in text area
3. Click \"\ud83d\udcbe Save Changes\"

**Auto-save**: No - must click save button

#### 3.2 Edit List Item
**Location**: Any list field

**Steps**:
1. Expand the field with list items
2. Click \u270f\ufe0f (edit) button on item
3. Modify text in input field
4. Click \"\ud83d\udcbe Save\"

#### 3.3 AI Refinement
**Location**: AI Operations section in each field

**Steps**:
1. Click \"\u2728 Refine\" popover
2. Enter refinement instruction
   - Example: \"Make it more playful\"
   - Example: \"Add emotional appeal\"
   - Example: \"Shorten to 2 sentences\"
3. Click \"Generate\"
4. Preview refined version
5. Click \"\u2705 Accept\" to apply

**Tips**:
- Be specific with instructions
- Preview before accepting
- Can discard and try again

#### 3.4 Generate Alternatives
**Location**: AI Operations section in each field

**Steps**:
1. Click \"\ud83d\udd04 Alternatives\" popover
2. Select how many (2-5)
3. Click \"Generate\"
4. Review all options
5. Click on preferred option to apply

**Use Cases**:
- Stuck on current wording
- Want fresh perspectives
- Comparing different approaches

#### 3.5 Regenerate Entire Section
**Location**: Top of each pillar tab

**Steps**:
1. Navigate to pillar tab
2. Click \"\ud83d\udd04 Regenerate Section\"
3. Wait for AI generation
4. Review new content
5. Use Undo if not satisfied

**Warning**: This replaces ALL content in that section

#### 3.6 Update Project in Database
**Location**: Main action bar

**Steps**:
1. Make changes to strategy
2. Click \"\ud83d\udcbe Save to Database\"
3. Project is updated (or created if new)

---

### 4. DELETE Operations

#### 4.1 Delete List Item
**Location**: Any list field

**Steps**:
1. Expand field with list
2. Click \ud83d\uddd1\ufe0f (delete) button on item
3. Item is immediately removed

**Note**: No confirmation - use Undo if mistake

#### 4.2 Delete Field
**Location**: AI Operations section

**Steps**:
1. Expand the field
2. Scroll to AI Operations
3. Click \"\ud83d\uddd1\ufe0f Delete\"
4. Field is removed from section

**Use Case**: Remove fields you don't need

#### 4.3 Delete Project
**Location**: Sidebar

**Steps**:
1. Select project from dropdown
2. Click \"\ud83d\uddd1\ufe0f Delete\"
3. Project and all versions removed

**Warning**: Cannot be undone

---

## \ud83d\udd04 Version Control

### Undo Last Change
**Location**: Main action bar

**How it Works**:
- Automatically tracks last 10 changes
- Changes include:
  - Text edits
  - List modifications
  - Field additions/deletions
  - AI operations

**Steps**:
1. Make a change you want to revert
2. Click \"\u21a9\ufe0f Undo Last Change\"
3. Strategy reverts to previous state

**Limitations**: 
- Only 10 states tracked
- Cleared when loading project
- Cleared when starting new project

### Manual Save Points
**Location**: Sidebar \"Quick Actions\"

**Steps**:
1. At good stopping point
2. Click \"\ud83d\udcbe Save Current State\"
3. Creates permanent database record

---

## \ud83e\udd16 AI Operations Deep Dive

### When to Use Each AI Operation

#### \u2728 Refine
**Best for**:
- Improving existing content
- Adjusting tone
- Adding/removing details
- Fixing issues

**Example Instructions**:
- \"Make more concise\"
- \"Add concrete examples\"
- \"Use simpler language\"
- \"Make it more emotional\"
- \"Add specific numbers\"

#### \ud83d\udd04 Alternatives
**Best for**:
- Writer's block
- Comparing options
- Fresh perspectives
- A/B testing content

**Tips**:
- Generate 3-4 for best variety
- Compare against original
- Can run multiple times

#### \ud83d\udd04 Regenerate Section
**Best for**:
- Completely unhappy with section
- Want fresh start
- Major brief changes
- Exploring different directions

**Caution**:
- Loses all manual edits
- Use Undo if needed

---

## \ud83d\udcbe Database Operations

### Project Storage

#### Save Project
- Saves complete strategy as JSON
- Updates if project name exists
- Creates version history entry

#### Load Project
- Retrieves full strategy
- Clears current work
- Resets undo history

#### Project Versions
- Each save creates version entry
- Can track evolution
- Currently view-only (future: restore versions)

### Database Location
`/app/streamlit/immersify.db`

### Tables
- `projects`: Main project data
- `project_versions`: Version history

---

## \ud83c\udfaf Workflow Examples

### Example 1: Creating New Brand Strategy

1. **Create**
   - Click \"Start New Project\"
   - Enter \"Kopi Mellow\" as name
   - Add discovery notes about coffee shop
   - Select \"Warm & Community\" tone
   - Generate all 9 pillars

2. **Read**
   - Review generated content in each tab
   - Check Brand Core for mission/vision
   - Review Visual Identity colors

3. **Update**
   - Edit taglines in Copywriting pillar
   - Refine mission statement: \"Make it warmer\"
   - Generate 3 alternative color palettes

4. **Save**
   - Click \"Save to Database\"
   - Download report for client

### Example 2: Updating Existing Project

1. **Load**
   - Select \"Kopi Mellow\" from sidebar
   - Click \"Load\"

2. **Review**
   - Navigate to Target Audience
   - Current: Generic description

3. **Update**
   - Click \"Refine\"
   - Instruction: \"Define as persona: 'The Burned-Out Remote Worker'\"
   - Accept refined version

4. **Add**
   - Go to Market Plan
   - Add field \"Partnership Ideas\"
   - List co-working spaces

5. **Delete**
   - Remove generic \"Services\" field
   - Add specific service descriptions

6. **Save**
   - Save to database
   - New version created

### Example 3: Iterative Refinement

1. **Generate baseline**
   - Create initial strategy

2. **First pass edits**
   - Fix obvious issues
   - Remove irrelevant sections

3. **AI enhancement**
   - Refine each key field
   - Generate alternatives for taglines

4. **Save checkpoint**
   - Manual save

5. **Experiment**
   - Try regenerating weak sections
   - Use Undo if worse

6. **Final polish**
   - Direct text edits for perfection
   - Final save

---

## \u26a1 Keyboard Shortcuts

Currently no keyboard shortcuts (Streamlit limitation), but planned for future:
- Ctrl+S: Save
- Ctrl+Z: Undo
- Ctrl+E: Enter edit mode

---

## \ud83d\udca1 Tips & Best Practices

### Creating Content
1. **Be detailed in discovery notes**: More context = better AI output
2. **Select appropriate tone**: Dramatically affects output style
3. **Start with all pillars**: Can delete sections later
4. **Review before saving**: Check for AI hallucinations

### Updating Content
1. **Save before major changes**: Use manual save before experiments
2. **Be specific with AI instructions**: Vague = unpredictable results
3. **Compare alternatives**: Don't accept first option
4. **Edit incrementally**: Small changes are easier to track

### Managing Projects
1. **Use clear project names**: \"Kopi Mellow v2\" vs \"Project123\"
2. **Save frequently**: Don't lose work
3. **Download reports**: External backup
4. **Clean old projects**: Delete unused ones

### AI Operations
1. **Refine > Regenerate**: Try refining before full regeneration
2. **Iterate instructions**: If result not good, try different instruction
3. **Keep originals**: Always preview before accepting
4. **Use alternatives for lists**: Great for taglines, services, etc.

---

## \ud83d\udeab Common Mistakes

### 1. Not Saving Before Experimenting
**Problem**: Try regeneration, hate it, can't undo
**Solution**: Save to database before major changes

### 2. Accepting First AI Output
**Problem**: First result may not be best
**Solution**: Generate alternatives, compare options

### 3. Vague AI Instructions
**Problem**: \"Make it better\" gives unpredictable results
**Solution**: \"Shorten to 20 words and add emotional appeal\"

### 4. Deleting Without Checking
**Problem**: Accidentally delete important field
**Solution**: Use Undo immediately, or reload project

### 5. Not Using Discovery Notes
**Problem**: Generic AI output
**Solution**: Provide detailed brief, target audience, challenges

---

## \ud83c\udd98 Troubleshooting

### \"Error\" in AI Operations
**Cause**: API issue, rate limit, or invalid request
**Solution**: 
- Check API key
- Wait 30 seconds
- Try again
- Check internet connection

### Content Not Saving
**Cause**: Forgot to click save button
**Solution**: Always click \"Save Changes\" after editing

### Undo Not Available
**Cause**: History was cleared or no changes made
**Solution**: Manual database saves create permanent checkpoints

### Project Not Loading
**Cause**: Database corruption or deleted
**Solution**: Check `/app/streamlit/immersify.db` exists

---

## \ud83d\udd2e Advanced Features (Coming Soon)

- Export to PDF with styling
- Restore from version history
- Collaborative editing
- Custom pillar creation
- Brand consistency scoring
- Multi-language export
- Template library
- AI chat assistant

---

## \ud83d\udcda Additional Resources

- **README.md**: Installation and setup
- **prompts.py**: View/modify AI prompts
- **db.py**: Database schema and operations

---

**Last Updated**: January 2025
**Version**: 16.0
**Platform**: Immersify IBE Engine
"