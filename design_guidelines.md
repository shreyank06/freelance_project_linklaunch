# LinkLaunch Design Guidelines

## Design Approach

**Selected Approach**: Reference-Based with Modern SaaS Influences

Drawing inspiration from:
- **LinkedIn**: Professional tone, career-focused UI patterns, credibility signals
- **Notion/Linear**: Clean productivity interfaces, intuitive workflows, progress visualization
- **Stripe/Vercel**: Modern marketing pages, trust-building design, professional polish
- **Intercom**: Conversational AI patterns, friendly guidance, progress tracking

**Core Principle**: Create a professional yet approachable platform that builds user confidence through clear visual hierarchy, guided interactions, and polished execution.

---

## Typography System

**Font Families** (via Google Fonts CDN):
- Primary: Inter (400, 500, 600, 700) - UI, body text, navigation
- Accent: Sora (600, 700) - Headlines, hero sections, CTAs

**Type Scale**:
- Hero Headlines: text-5xl to text-6xl (Sora, font-bold)
- Section Headers: text-3xl to text-4xl (Sora, font-semibold)
- Card Titles: text-xl to text-2xl (Inter, font-semibold)
- Body Text: text-base to text-lg (Inter, font-normal)
- AI Messages: text-base (Inter, font-medium)
- Supporting Text: text-sm (Inter, font-normal)
- CTAs: text-base to text-lg (Inter, font-semibold)

---

## Layout System

**Spacing Primitives**: Use Tailwind units of **4, 6, 8, 12, 16, 20, 24** for consistency
- Component padding: p-6, p-8
- Section spacing: py-16, py-20, py-24
- Card gaps: gap-6, gap-8
- Element margins: m-4, mb-8, mt-12

**Container Strategy**:
- Marketing pages: max-w-7xl with px-6
- Dashboard/Tools: max-w-6xl with px-4
- Content sections: max-w-4xl for readability
- Forms/Builders: max-w-3xl centered

**Grid Patterns**:
- Homepage features: 3-column grid (lg:grid-cols-3, md:grid-cols-2, grid-cols-1)
- Path selection cards: 3-column grid with equal height cards
- Testimonials: 2-column grid (lg:grid-cols-2)
- Dashboard stats: 4-column grid (lg:grid-cols-4, md:grid-cols-2)

---

## Component Library

### Navigation
- **Homepage Header**: Full-width with logo left, navigation center, CTAs right, sticky on scroll
- **Dashboard Navigation**: Sidebar layout (w-64) with collapsible sections, active state indicators, progress tracking module at bottom

### Hero Sections
- **Homepage Hero**: Full-width with gradient overlay, centered content, large headline (text-5xl), supporting text (text-xl), three prominent path selection cards below hero
- **Path Heroes**: Reduced height (60vh), personalized AI greeting in speech bubble style, single focused CTA

### Cards & Modules
- **Path Selection Cards**: Rounded-2xl, border treatment, hover lift effect (transform hover:scale-105 transition), icon at top, title, description, prominent CTA button
- **Module Progress Cards**: Horizontal layout with numbered circle indicator, title, status badge, chevron right
- **AI Response Cards**: Chat-style bubbles with rounded corners, subtle shadow, max-width for readability
- **Feature Cards**: Icon top-left, bold title, concise description, minimal decoration

### Forms & Inputs
- **Text Inputs**: Rounded-lg, border treatment, focus ring, label above, helper text below
- **AI Prompt Fields**: Larger text area, placeholder with example questions, character count
- **File Upload**: Drag-and-drop zone with dashed border, upload icon, supporting text
- **Resume Builder**: Split-pane interface (left: form inputs, right: live preview with PDF aesthetic)

### Buttons
- **Primary CTAs**: Rounded-lg, generous padding (px-8 py-4), shadow-md, font-semibold, icon optional
- **Secondary**: Border treatment, transparent background, same padding
- **AI Actions**: Inline style with icon prefix, subtle hover state
- **Hero Buttons (on images)**: backdrop-blur-md with semi-transparent background, no custom hover states

### Data Visualization
- **ATS Score Display**: Circular progress indicator (0-100%), central percentage, outer ring, status text below
- **Skill Maps**: Tag cloud style with varying sizes, rounded-full pills, interactive hover
- **Progress Trackers**: Horizontal stepped progress bar, completed/active/upcoming states, step labels
- **Match Percentage**: Large number display with supporting context, visual indicator (ring or bar)

### Dashboard Components
- **Stat Cards**: Compact cards with large number, label, trend indicator (arrow up/down), minimal decoration
- **Activity Feed**: Timeline style with dates left, activities right, connecting line
- **Document Library**: Grid of document cards with thumbnail preview, title, date, action menu
- **Job Listings**: Card layout with company logo, job title, location, salary range, quick apply button

---

## Page Layouts

### Homepage
- Hero section (90vh) with large background image showing diverse professionals, gradient overlay
- Three path selection cards immediately below hero
- "How It Works" section (4-step visual process with numbered circles and connecting lines)
- Social proof section (2-column: testimonials left, stats right)
- CTA section with AI preview mockup
- Footer with newsletter signup, quick links, social icons, trust badges

### Path Pages (College/Professional/Starter)
- Personalized hero (60vh) with path-specific imagery
- Welcome module with AI greeting card
- Module progression list (vertical timeline of 8 numbered modules)
- Each module expands to sub-steps on click
- Floating progress sidebar (desktop) showing completion percentage

### Tool Pages (Resume Builder, LinkedIn Optimizer, etc.)
- Fixed top bar with tool name, save/export actions
- Split-pane layout (adjustable divider)
- Left: Input forms with AI suggestions inline
- Right: Live preview pane with export button
- Bottom: AI coach panel (collapsible) with tips and feedback

### Dashboard
- Top bar: User avatar, notifications, settings
- Left sidebar: Navigation with icons, progress widget at bottom
- Main area: Grid of stat cards, activity feed, upcoming tasks, recent documents
- Quick action buttons (floating action button style) for common tasks

---

## Icons & Assets

**Icon Library**: Heroicons (via CDN) - use outline style for navigation, solid for actions

**Key Icons**:
- Paths: AcademicCapIcon, BriefcaseIcon, SparklesIcon
- Modules: DocumentTextIcon, ChartBarIcon, UserIcon, ChatBubbleLeftIcon
- Actions: ArrowRightIcon, CheckCircleIcon, CloudArrowUpIcon
- Navigation: HomeIcon, Cog6ToothIcon, BellIcon

**Images**:
- **Homepage Hero**: Large background image showing diverse professionals in modern office/collaborative setting, confident and successful poses
- **Path Heroes**: 
  - College: Young graduates in cap and gown celebrating
  - Professional: Mid-career professionals in meeting/strategy session
  - Starter: Person at laptop with thoughtful/determined expression
- **Feature Sections**: Abstract illustrations of AI/technology elements, resume documents, interview scenarios
- **Testimonials**: Professional headshots (circular crop) with role titles

---

## Interaction Patterns

### AI Interactions
- Chat-style interface with alternating message bubbles
- Typing indicator during AI processing (three animated dots)
- Inline suggestions appear as chips below AI messages
- Response acceptance via checkmark or edit icon

### Progress & Feedback
- Toast notifications (top-right) for actions completed
- Inline validation on forms (real-time feedback)
- Success states with checkmark icons and brief celebratory micro-animation
- Loading states: skeleton screens for content areas, spinners for actions

### Navigation Flow
- Breadcrumbs on tool pages showing path context
- "Next Step" CTA prominently placed at module completion
- Back navigation always available but not emphasized
- Floating "Help" button (bottom-right) for AI assistance

---

## Accessibility & Performance

- Maintain consistent tab order throughout application
- All interactive elements keyboard accessible
- Form labels always visible and associated
- Focus indicators clearly visible (ring-2 with appropriate offset)
- Semantic HTML structure with proper heading hierarchy
- Alt text for all images describing context and purpose
- Icon-only buttons include aria-labels
- Color not sole indicator of state (use icons/text)

---

**Design Tone**: Professional, trustworthy, encouraging - balancing career advancement seriousness with AI-powered ease and approachability. Visual language should communicate competence while removing intimidation from career development process.