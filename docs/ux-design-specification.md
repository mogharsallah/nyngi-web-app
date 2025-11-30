# Name Your Next Great Idea UX Design Specification

_Created on 2025-11-26 by MG_
_Generated using BMad Method - Create UX Design Workflow v1.0_

---

## Executive Summary

"Name Your Next Great Idea" is a "Launch Certainty Engine" designed to disrupt the commoditized AI naming market. It bridges the "Legal Chasm" between creative ideation and trademark safety, serving Lean Entrepreneurs and High-Stakes Founders. The platform monetizes user anxiety through a "Trojan Horse" model, offering low-cost "De-Risking Reports" to drive high-margin affiliate hosting revenue and legal lead generation.

**Target Users:**

- **Lean Entrepreneur:** Seeks speed, friction minimization, and immediate execution.
- **High-Stakes Founder:** Seeks risk aversion, asset defensibility, and ROI.

---

## 1. Design System Foundation

### 1.1 Design System Choice

**Primary System:** **shadcn/ui**

- **Rationale:** Provides a professional, accessible foundation (Radix UI) with complete visual control via Tailwind CSS. It strikes the perfect balance between "Legal Trust" (clean, structured) and "Creative Agency" (customizable, modern).
- **Enhancement Layer:** **Aceternity UI**
  - **Role:** To deliver the "Elevated Creative" and "Novelty" required by the brand.
  - **Usage:** High-impact moments like the "Narrative Architect" chat interface, the "Traffic Light" reveal, and the "Brand Canvas" (future).
- **Styling Engine:** **Tailwind CSS** for rapid, utility-first styling.

**Component Strategy:**

- **Core UI:** shadcn/ui (Buttons, Inputs, Dialogs, Cards, Forms).
- **Hero/Feature UI:** Aceternity UI (Background beams, Sparkles, Moving borders for "Green Light" success states).
- **Layout:** Tailwind Grid/Flexbox.

---

## 2. Core User Experience

### 2.1 Defining Experience

**Core Loop:** Ideate (Chat) → Generate Names → Check Risk (Traffic Light).

**The "One Thing":** The seamless transition from creative brainstorming to immediate legal reality check. Users will spend the most time interacting with the "Narrative Architect" and scanning the resulting list for "Green" lights.

**Effortless Action:** Interpreting the "Traffic Light" risk signal. It must be instant and unambiguous—Green means go, Red means stop/danger.

**Critical Interaction:** The "Friction Event"—clicking on an "Amber" name. This moment must balance anxiety (risk warning) with a clear path to resolution (buying the report), without causing frustration-induced abandonment.

**Platform:**

- **Web Application:** Fully responsive web app accessible on desktop and mobile browsers. No native app planned.

**Emotional Goal:**

- **Primary:** Transformation from **Anxiety** (about legal risks) to **Certainty** (Launch Readiness).
- **Lean Entrepreneur:** Feels _Efficient_ and _Unblocked_.
- **High-Stakes Founder:** Feels _Secure_ and _Strategically Empowered_.

### 2.2 Novel UX Patterns

**1. The "Trojan Horse" Criteria Collection:**

- **Concept:** The initial chat/form isn't just for ideation; it's a segmentation tool.
- **Mechanism:** A "Segmentation Prompt" at the very start forces a choice:
  - **Path A (Speed):** "I need a name fast." (Lean Entrepreneur) → Short form, focuses on "Vibe" and "Availability."
  - **Path B (Certainty):** "I need a defensible brand." (High-Stakes Founder) → Deep dive, focuses on "Meaning Spectrum" and "Competitive Intensity."
- **Why Novel:** Most tools treat all users the same. This bifurcates the experience to maximize monetization for each type (Volume vs. Margin).

**2. The "Friction as a Feature" Traffic Light:**

- **Concept:** Deliberately slowing down the user at the moment of highest excitement.
- **Mechanism:** User clicks a "Green" name → Instant gratification. User clicks an "Amber" name → "Wait, there's a risk." → Upsell Report.
- **Why Novel:** It flips standard UX (remove friction) on its head to create value (safety).

---

## 3. Visual Foundation

### 3.1 Color System

**Theme Name:** "The Hybrid" (Legal Futurist + Creative Architect)

**Rationale:**
Combines the authoritative grounding of deep midnight blue (Legal Certainty) with the vibrant energy of indigo and electric teal (Creative AI). This palette perfectly supports the "Trojan Horse" model—it looks like a cool creative tool but feels like a safe legal platform.

**Palette:**

- **Primary (Authority):** Deep Midnight Blue (`#0B1120`) - Used for backgrounds, headers, and primary text. Anchors the "Legal" trust.
- **Accent (Creativity):** Indigo (`#6366F1`) - Used for primary actions (CTAs), active states, and brand moments. Signals "AI Magic."
- **Highlight (Innovation):** Electric Teal (`#2DD4BF`) - Used for icons, success indicators, and "Green Light" moments. Signals "Freshness/Safety."
- **Neutral:** Slate (`#F8FAFC` to `#1E293B`) - Clean, professional structure.

**Semantic Colors (The Traffic Light):**

- **Safe (Green):** Emerald (`#059669`) - Clear, calming, "Go."
- **Caution (Amber):** Amber (`#D97706`) - Visible but not alarming. "Pause and check."
- **Risk (Red):** Red (`#DC2626`) - Urgent, definitive. "Stop."

**Typography:**

- **Headings:** `Inter` (Tight tracking, bold weights) - Clean, modern, authoritative.
- **Body:** `Inter` (Regular weights) - Highly legible for reports and lists.
- **Monospace:** `JetBrains Mono` or `Geist Mono` - For code snippets, IP data, or "AI typing" effects.

**Interactive Visualizations:**

- Color Theme Explorer: [ux-color-themes.html](./ux-color-themes.html)

---

## 4. Design Direction

### 4.1 Chosen Design Approach

**Direction:** "The Studio" (Split-Screen Layout)

**Rationale:**
This layout perfectly supports the "Consultative AI" value proposition. By keeping the "Narrative Architect" (chat) always visible on the left, we reinforce that this is a _conversation_ with an expert, not just a search engine. The right side acts as a dynamic "Canvas" for results, allowing users to see the immediate impact of their chat inputs.

**Key Characteristics:**

- **Layout:** Split-Screen (Fixed Left Sidebar / Scrollable Right Canvas).
- **Navigation:** Contextual within the chat or canvas. No heavy top-nav distraction.
- **Visual Hierarchy:**
  - **Primary Focus:** The Chat (The "Architect").
  - **Secondary Focus:** The Results Grid (The "Output").
  - **Tertiary Focus:** Filters and Export actions.
- **Interaction Pattern:** "Conversational Creation." User types "Make it more abstract" → Canvas updates instantly.

**Responsive Strategy:**

- **Desktop:** Split screen (Chat 30% / Canvas 70%).
- **Mobile:** Tabbed interface. User toggles between "Chat" and "Results" views, or Chat is a drawer that slides over.

**Interactive Mockups:**

- Design Direction Showcase: [ux-design-directions.html](./ux-design-directions.html)

---

## 5. User Journey Flows

### 5.1 Critical User Paths

**Journey 1: The Lean Entrepreneur (Speed & Volume)**
_Goal: Rapidly find a "good enough" name and unblock launch._

1.  **Entry (Segmentation):**

    - User lands on Home.
    - Clicks "I need a name fast" (Path A).
    - **UX:** Instant transition to "Narrative Architect" (Lite Mode).

2.  **Input (Ideation):**

    - Chat asks: "What's your industry?" and "Pick 3 vibes."
    - **UX:** Low-friction chips/pills. No typing required.

3.  **Output (The Hook):**

    - "Canvas" fills with 10-20 names.
    - **UX:** Names are catchy, memorable (Rhyme, Alliteration).
    - **Visual:** "Traffic Lights" are visible but subtle initially.

4.  **Friction (The Pivot):**

    - User clicks a name they like (e.g., "NovusArc").
    - **System:** Checks IP risk. Result: "Amber" (Caution).
    - **Feedback:** "⚠️ Potential Conflict Found. We found a similar trademark in Class 42."
    - **Tone:** **Helpful/Balanced.** "Let's check if it's a blocker." (Avoids panic, encourages resolution).

5.  **Resolution (Conversion):**
    - CTA: "Get De-Risking Report ($7.99)."
    - **Value Prop:** "See exactly why it's flagged and if you can still use it."
    - **Success:** PDF Report delivered + "Launch Checklist" (Hosting Affiliate Links).

**Journey 2: The High-Stakes Founder (Safety & Strategy)**
_Goal: Secure a defensible IP asset._

1.  **Entry:** Clicks "I need a defensible brand" (Path B).
2.  **Input:** Deep dive form (Meaning Spectrum, Competitive Intensity).
3.  **Output:** "Fanciful" names (Abstract, Unique).
4.  **Validation:** "Green Light" is the goal.
5.  **Conversion:** Upsell to "Full Legal Audit" or "Attorney Consultation."

---

## 6. Component Library

### 6.1 Component Strategy

**Base System:** **shadcn/ui** (Radix Primitives + Tailwind).

**Custom Components (The "Secret Sauce"):**

1.  **The "Traffic Light" Badge:**

    - **Purpose:** Core risk indicator.
    - **Visual:** Pill-shaped badge with glowing dot.
    - **States:**
      - **Green:** `bg-emerald-50 text-emerald-600 border-emerald-200` + Pulse effect.
      - **Amber:** `bg-amber-50 text-amber-600 border-amber-200`.
      - **Red:** `bg-red-50 text-red-600 border-red-200`.

2.  **The "Name Card" (Hero Component):**

    - **Purpose:** Display generated names with high utility.
    - **Layout:**
      - **Top:** Name (Large, Bold) + Traffic Light (Right).
      - **Middle:** Short description/rationale.
      - **Bottom:** **Domain Availability (Immediate Visibility).**
        - Row of badges: `.com` (Green/Red), `.io`, `.ai`.
        - **Why Immediate:** "Lean Entrepreneurs" need to know if the .com is taken _instantly_. It's a primary filter for them.

3.  **The "Narrative Architect" Chat Interface:**

    - **Purpose:** AI consultation.
    - **Features:**
      - **Streaming Text:** Typewriter effect for AI responses.
      - **Smart Chips:** Clickable suggestion pills ("Make it shorter", "More abstract").
      - **Structured Output:** AI can render "Mini Cards" inside the chat stream.

4.  **The "De-Risking Report" Preview:**
    - **Purpose:** Conversion driver.
    - **Visual:** "Blurred Paper" effect.
    - **Content:** Shows the "Risk Score" (e.g., 72/100) clearly, but blurs the specific conflict details until unlocked.

---

## 7. UX Pattern Decisions

### 7.1 Consistency Rules

**Button Hierarchy:**

- **Primary:** Indigo (`bg-indigo-600`). Used for "Generate", "Unlock Report", "Buy".
- **Secondary:** White with Border (`border-slate-200`). Used for "Filter", "Export", "Cancel".
- **Ghost:** Transparent. Used for "Favorite", "Copy", "More Options".

**Feedback Patterns:**

- **Success:** Toast Notification (Top Right). "Name saved to list."
- **Error:** Inline (Form fields) + Toast (System errors).
- **Loading:** Skeleton loaders (shimmer) for cards; "Thinking..." dots for chat.

**Mobile Navigation:**

- **Pattern:** **Bottom Tab Bar**.
- **Items:** [Chat] | [Results] | [Saved] | [Profile].
- **Rationale:** Supports the "Studio" layout on mobile by allowing instant toggling between the "Architect" (Chat) and the "Canvas" (Results) without losing context.

**Modal Patterns:**

- **Behavior:** Blurred backdrop (`backdrop-blur-sm`). Click outside to dismiss (except Checkout).

---

## 8. Responsive Design & Accessibility

### 8.1 Responsive Strategy

**Breakpoint Strategy:**

- **Mobile (< 768px):**
  - **Layout:** Single View (Tabbed). User sees _either_ Chat _or_ Results.
  - **Navigation:** Bottom Tab Bar.
  - **Cards:** Full width, stacked vertically.
- **Tablet (768px - 1024px):**
  - **Layout:** Split Screen (Chat 35% / Results 65%).
  - **Navigation:** Side Rail or Condensed Sidebar.
  - **Cards:** 2-column grid.
- **Desktop (> 1024px):**
  - **Layout:** Full Studio (Chat 30% / Results 70%).
  - **Cards:** 3-column or 4-column grid.

**Accessibility (WCAG 2.1 AA):**

- **Color Contrast:** All text must meet 4.5:1 ratio. (Note: Be careful with "Amber" text on white; use darker shade `#D97706`).
- **Focus States:** Visible indigo ring (`ring-2 ring-indigo-500`) on all interactive elements.
- **Screen Readers:**
  - "Traffic Light" badges must have `aria-label="Risk Level: High/Medium/Low"`.
  - Chat updates must use `aria-live="polite"` to announce new messages.
- **Keyboard Nav:** Full tab support for navigating the grid of names.

---

## 9. Implementation Guidance

### 9.1 Completion Summary

**Design System:** **shadcn/ui** + **Aceternity UI** (Tailwind CSS).
**Theme:** "The Hybrid" (Midnight Blue + Indigo + Teal).
**Layout:** "The Studio" (Split-Screen Chat/Canvas).
**Key Interaction:** "Traffic Light" Risk System (Green/Amber/Red).

**Deliverables:**

- UX Design Document: `docs/ux-design-specification.md`
- Interactive Color Themes: `docs/ux-color-themes.html`
- Design Direction Mockups: `docs/ux-design-directions.html`

**Next Steps:**

1.  **Wireframing:** Create detailed wireframes for the "De-Risking Report" and "Checkout" flows.
2.  **Prototyping:** Build a clickable prototype of the "Chat-to-Canvas" interaction.
3.  **Development:** Initialize Next.js project with shadcn/ui and Tailwind.

---

## Appendix

### Related Documents

- Product Requirements: `{{prd_file}}`
- Product Brief: `{{brief_file}}`
- Brainstorming: `{{brainstorm_file}}`

### Core Interactive Deliverables

This UX Design Specification was created through visual collaboration:

- **Color Theme Visualizer**: ./ux-color-themes.html

  - Interactive HTML showing all color theme options explored
  - Live UI component examples in each theme
  - Side-by-side comparison and semantic color usage

- **Design Direction Mockups**: ./ux-design-directions.html
  - Interactive HTML with 6-8 complete design approaches
  - Full-screen mockups of key screens
  - Design philosophy and rationale for each direction

### Optional Enhancement Deliverables

_This section will be populated if additional UX artifacts are generated through follow-up workflows._

<!-- Additional deliverables added here by other workflows -->

### Next Steps & Follow-Up Workflows

This UX Design Specification can serve as input to:

- **Wireframe Generation Workflow** - Create detailed wireframes from user flows
- **Figma Design Workflow** - Generate Figma files via MCP integration
- **Interactive Prototype Workflow** - Build clickable HTML prototypes
- **Component Showcase Workflow** - Create interactive component library
- **AI Frontend Prompt Workflow** - Generate prompts for v0, Lovable, Bolt, etc.
- **Solution Architecture Workflow** - Define technical architecture with UX context

### Version History

| Date       | Version | Changes                         | Author |
| ---------- | ------- | ------------------------------- | ------ |
| 2025-11-26 | 1.0     | Initial UX Design Specification | MG     |

---

_This UX Design Specification was created through collaborative design facilitation, not template generation. All decisions were made with user input and are documented with rationale._
