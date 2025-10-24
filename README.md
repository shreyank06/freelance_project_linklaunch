# LinkLaunch - AI-Powered Career Coach Platform

## Execution
**Set Env Variables**
```
export OPENAI_API_KEY="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"
```
```
export DATABASE_URL="postgresql://neondb_owner:npg_yvEqgA8T2ZPG@ep-cold-thunder-ada6aulb-pooler.c-2.us-east-1.aws.neon.tech/neondb?sslmode=require"
```
**Get your actual Neon URL:**
```
Go to Neon Console
Find your project → Connection String
Copy the URL and set it as your DATABASE_URL
```


**Install Dependencies**
```
cd linklaunch (or whatever the name of the folder)
npm install
npm install react-router-dom
npx drizzle-kit generate
npx drizzle-kit push
```

**Setup Enviornment Variables**
Create a .env file with these variables
```
DATABASE_URL = your_postgres_connection_string
OPEN_API_KEY = your_openai_api_key
SESSION_SECRET = your_random_secret_string
```
**Run the application**
```
npm run dev
```
**URL**
```
 http://localhost:5000
 ```

## Overview

LinkLaunch is an all-in-one AI-powered career coaching platform that helps users build, optimize, and launch their careers. The application provides personalized career guidance through three distinct paths (College Graduates, Experienced Professionals, and Career Starters), offering tools for skill discovery, resume building, ATS optimization, LinkedIn profile enhancement, interview coaching, and AI-powered document writing.

The platform uses conversational AI to guide users through their career development journey, analyzing their background and generating tailored content to help them stand out in the job market.

## User Preferences

Preferred communication style: Simple, everyday language.

## System Architecture

### Frontend Architecture

**Framework**: React with TypeScript using Vite as the build tool and development server.

**Routing**: Wouter for lightweight client-side routing, managing navigation between the home page and three career path pages (college-grad, experienced, starter).

**UI Component System**: Shadcn UI (New York variant) with Radix UI primitives for accessible, composable components. The design system uses Tailwind CSS with custom HSL-based color variables for theming and a carefully considered spacing/typography scale defined in the design guidelines.

**State Management**: 
- React Context API for session management (SessionContext stores sessionId and pathType in localStorage)
- TanStack Query (React Query) for server state management and API data fetching/caching
- Local component state with React hooks for UI-specific state

**Design System**: Based on reference designs from LinkedIn (professional patterns), Notion/Linear (clean productivity UI), Stripe/Vercel (modern marketing polish), and Intercom (conversational AI patterns). Typography uses Inter for UI/body and Sora for headlines, loaded via Google Fonts CDN.

### Backend Architecture

**Framework**: Express.js server running on Node.js with TypeScript.

**API Design**: RESTful endpoints organized in `server/routes.ts` that handle:
- Session management (`/api/sessions`)
- Job listings (`/api/jobs`)
- Skill mapping (`/api/skill-map`)
- Resume operations (creation, retrieval, updates)
- ATS analysis
- LinkedIn profile management
- Interview sessions
- Document generation

**Storage Layer**: Abstracted through an `IStorage` interface with in-memory implementation (`MemStorage`). The schema is defined using Drizzle ORM with PostgreSQL dialect, supporting future database integration. Data models include user sessions, skill maps, resumes, ATS analyses, LinkedIn profiles, interview sessions, documents, and job listings.

**AI Service**: Centralized AI functionality in `server/ai-service.ts` using OpenAI's API (configured for GPT-5). Functions include:
- Skill mapping and keyword extraction
- Resume content generation
- ATS analysis and optimization recommendations
- LinkedIn content creation
- Interview feedback generation

**Development Tools**: Vite middleware integration for HMR in development, with custom logging and error handling. Production builds bundle the server with esbuild.

### Data Model

The application uses Drizzle ORM to define a PostgreSQL schema with the following core entities:

**User Sessions**: Tracks user journey through path type (college/professional/starter) and current module progress.

**Skill Maps**: Stores AI-generated skill analysis including technical skills, leadership skills, transferable skills, keywords, and brand statements.

**Resumes**: Flexible JSONB storage for resume content including personal info, summary, experience, education, and skills.

**ATS Analyses**: Stores ATS compatibility scores, keyword gaps, improvement suggestions, and strengths for each resume submission.

**LinkedIn Profiles**: Manages LinkedIn content including headlines, about sections, experience descriptions, and skill lists.

**Interview Sessions**: Records interview practice sessions with questions, answers, feedback, and scoring.

**Documents**: General-purpose document storage for AI-generated content like cover letters and emails.

**Job Listings**: Curated or scraped job postings with metadata for experience levels and categories.

### Architecture Patterns

**Separation of Concerns**: Clear separation between client (React), server (Express), and shared code (schema definitions, types). Path aliases (`@/`, `@shared/`, `@assets/`) enforce clean import structures.

**Type Safety**: Full TypeScript coverage with shared Zod schemas for runtime validation and type inference. Drizzle-zod integration ensures type safety between database schema and application code.

**Progressive Enhancement**: The application starts with a simple session-based flow and scales functionality based on user path selection. Each career path shares common modules but can be customized.

**Modular UI Components**: Shared components (ProgressTracker, AiChatBubble, SkillTagCloud, AtsScoreDisplay) are reusable across all three career paths, maintaining consistency while allowing path-specific customization via props (pathColor, etc.).

## External Dependencies

### AI Services
- **OpenAI API**: Primary AI service for generating career coaching content, skill analysis, resume optimization, and interview feedback. Configured to use GPT-5 model.

### Database
- **Neon Serverless PostgreSQL**: Database provider (via `@neondatabase/serverless` package). Connection managed through `DATABASE_URL` environment variable.
- **Drizzle ORM**: Database toolkit providing type-safe query building and schema management.

### UI Component Libraries
- **Radix UI**: Comprehensive set of accessible, unstyled component primitives (@radix-ui/* packages) for building the UI component system.
- **Shadcn UI**: Pre-built component implementations using Radix UI primitives with Tailwind styling.
- **Lucide React**: Icon library for consistent iconography throughout the application.

### Styling
- **Tailwind CSS**: Utility-first CSS framework with custom configuration for colors, spacing, and design tokens.
- **Google Fonts**: CDN-hosted fonts (Inter and Sora) for typography system.

### Development Tools
- **Vite**: Build tool and development server with plugins for React, runtime error overlays, and Replit-specific features (cartographer, dev banner).
- **TypeScript**: Type system for compile-time type checking.
- **esbuild**: Fast bundler for production server builds.

### Form Management
- **React Hook Form**: Form state management and validation.
- **Zod**: Schema validation library integrated with React Hook Form via @hookform/resolvers.

### Utility Libraries
- **date-fns**: Date manipulation and formatting.
- **clsx** + **tailwind-merge**: Utility for conditional CSS class composition.
- **class-variance-authority**: Type-safe variant styling for component APIs.
- **wouter**: Lightweight routing library for client-side navigation.

