# LinkLaunch Quick Start Guide

## Setup & Installation

### 1. Install Dependencies
```bash
npm install
```

### 2. Environment Variables
Create a `.env` file in the root directory:

```env
# Database
DATABASE_URL=postgresql://user:password@host:port/database

# API Keys
OPENAI_API_KEY=sk-proj-your-api-key-here

# Session Secret (change this to a random string)
SESSION_SECRET=your-random-secret-key-here

# Node Environment
NODE_ENV=development

# Server Port
PORT=5000
```

### 3. Database Setup
First, ensure PostgreSQL is running and the database exists, then run migrations:

```bash
npm run db:push
```

### 4. Start Development Server
```bash
npm run dev
```

The app will be available at `http://localhost:5000`

---

## User Registration Flow

### 1. Navigate to Homepage
- User sees three career paths:
  - College Graduate (Blue)
  - Experienced Professional (Green)
  - Just Getting Started (Orange)

### 2. Register Account
Click desired path to open registration form:

```json
{
  "email": "user@example.com",
  "password": "secure-password",
  "fullName": "John Doe",
  "pathType": "college"  // or "professional" or "starter"
}
```

**Backend Request:**
```bash
curl -X POST http://localhost:5000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "email": "user@example.com",
    "password": "password123",
    "fullName": "John Doe",
    "pathType": "college"
  }'
```

### 3. Session Created
- User automatically logged in
- Module progress initialized
- Welcome module unlocked
- Redirected to welcome page

---

## Module Progression Flow

### Welcome Module (Unlocked by Default)
1. AI greets user with path-specific message
2. User reviews path overview
3. Complete module button moves to next

### Job Listings Module (Unlocks After Welcome)
1. View job listings filtered by experience level
2. Read job descriptions
3. Mark module complete to unlock next

### Skill Discovery Module
1. Answer AI question about skills/achievements
2. AI generates skill map
3. Review technical, leadership, transferable skills
4. AI-generated personal brand statement

### Resume Builder Module
1. AI generates initial resume draft
2. User can review and edit
3. Export as PDF or DOCX

### ATS Optimization Module
1. Paste job description
2. AI analyzes resume match
3. View match percentage and gaps
4. Get improvement suggestions

### LinkedIn Optimizer Module
1. View LinkedIn profile templates
2. Copy headline to clipboard
3. Copy about section
4. Copy experience section
5. Copy skills list
6. Paste into LinkedIn profile

### Interview Coach Module
1. AI asks interview question
2. User records/types answer
3. Receive AI feedback on:
   - Answer clarity
   - Structure (STAR method)
   - Confidence level
   - Suggestions for improvement

### Document Writer Module
1. Choose document type:
   - Cover letter
   - Follow-up email
   - Acceptance letter
   - Denial response letter
2. Provide recipient info
3. AI generates document
4. Export as PDF or DOCX

---

## API Usage Examples

### Register & Login
```bash
# Register
curl -X POST http://localhost:5000/api/auth/register \
  -H "Content-Type: application/json" \
  -c cookies.txt \
  -d '{
    "email": "user@example.com",
    "password": "password123",
    "fullName": "John Doe",
    "pathType": "college"
  }'

# Login
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -c cookies.txt \
  -d '{
    "email": "user@example.com",
    "password": "password123"
  }'
```

### Get Module Progress
```bash
curl -X GET http://localhost:5000/api/sessions/:sessionId/progress \
  -b cookies.txt
```

### Complete a Module
```bash
curl -X POST http://localhost:5000/api/sessions/:sessionId/complete-module \
  -H "Content-Type: application/json" \
  -b cookies.txt \
  -d '{"moduleName": "welcome"}'
```

### Generate Skill Map
```bash
curl -X POST http://localhost:5000/api/skill-map \
  -H "Content-Type: application/json" \
  -b cookies.txt \
  -d '{
    "sessionId": "session-uuid",
    "userInput": "I built a website with React and Node.js",
    "pathType": "college"
  }'
```

### Generate & Export Resume
```bash
# Generate
curl -X POST http://localhost:5000/api/resume \
  -H "Content-Type: application/json" \
  -b cookies.txt \
  -d '{
    "sessionId": "session-uuid",
    "pathType": "college",
    "userInfo": {"name": "John Doe", "email": "john@example.com"}
  }'

# Export as PDF
curl -X GET http://localhost:5000/api/resume/:sessionId/export/pdf \
  -b cookies.txt \
  -o resume.pdf

# Export as DOCX
curl -X GET http://localhost:5000/api/resume/:sessionId/export/docx \
  -b cookies.txt \
  -o resume.docx
```

---

## Frontend Integration

### Using Session Context
```typescript
import { useSession } from '@/contexts/session-context';

function MyComponent() {
  const {
    userId,
    user,
    sessionId,
    pathType,
    isAuthenticated,
    isLoading,
    login,
    register,
    logout
  } = useSession();

  if (isLoading) return <div>Loading...</div>;

  if (!isAuthenticated) {
    return (
      <button onClick={() => register('email@example.com', 'pass', 'Name', 'college')}>
        Register
      </button>
    );
  }

  return (
    <div>
      <h1>Welcome {user?.fullName}</h1>
      <p>Current session: {sessionId}</p>
      <p>Path: {pathType}</p>
      <button onClick={logout}>Logout</button>
    </div>
  );
}
```

### Using LinkedIn Templates
```typescript
import { LinkedInTemplateDisplay } from '@/components/linkedin-template-display';

function LinkedInModule({ profile, pathType }) {
  return (
    <div>
      <h2>LinkedIn Profile Templates</h2>
      <LinkedInTemplateDisplay
        profile={profile}
        pathType={pathType}
      />
    </div>
  );
}
```

---

## Database Schema Overview

### Users Table
```sql
CREATE TABLE users (
  id UUID PRIMARY KEY,
  email VARCHAR(255) UNIQUE NOT NULL,
  passwordHash TEXT NOT NULL,
  fullName VARCHAR(255),
  isVerified BOOLEAN DEFAULT false,
  createdAt TIMESTAMP DEFAULT NOW(),
  updatedAt TIMESTAMP DEFAULT NOW()
);
```

### User Sessions Table
```sql
CREATE TABLE user_sessions (
  id UUID PRIMARY KEY,
  userId UUID NOT NULL REFERENCES users(id),
  pathType TEXT NOT NULL,
  currentModule TEXT DEFAULT 'welcome',
  createdAt TIMESTAMP DEFAULT NOW(),
  updatedAt TIMESTAMP DEFAULT NOW()
);
```

### Module Progress Table
```sql
CREATE TABLE module_progress (
  id UUID PRIMARY KEY,
  sessionId UUID NOT NULL REFERENCES user_sessions(id),
  moduleName TEXT NOT NULL,
  status TEXT CHECK (status IN ('locked', 'in_progress', 'completed')),
  progress INTEGER DEFAULT 0,
  startedAt TIMESTAMP,
  completedAt TIMESTAMP,
  createdAt TIMESTAMP DEFAULT NOW(),
  updatedAt TIMESTAMP DEFAULT NOW()
);
```

---

## Troubleshooting

### Issue: "Database connection failed"
**Solution:** Verify `DATABASE_URL` is correct and PostgreSQL is running

### Issue: "Unauthorized" error
**Solution:** Ensure you're passing session cookies with requests

### Issue: Module won't unlock
**Solution:** Check that previous module is marked as completed

### Issue: Resume export fails
**Solution:** Ensure resume has been generated first

### Issue: OpenAI API errors
**Solution:** Verify `OPENAI_API_KEY` is valid and has sufficient balance

---

## Development Tips

### Enable Debug Logging
```bash
DEBUG=* npm run dev
```

### Check TypeScript Errors
```bash
npm run check
```

### Build for Production
```bash
npm run build
```

### Run Production Build Locally
```bash
npm run build && npm run start
```

---

## Next Steps

1. **Customize AI Prompts**
   - Edit `server/ai-service.ts` for path-specific prompts

2. **Add LinkedIn OAuth** (Phase 2)
   - LinkedIn profile connection
   - Auto-fetch job listings

3. **Build Dashboard** (Phase 2)
   - User progress visualization
   - Document management

4. **Add More Features** (Phase 2)
   - Advanced interview practice
   - Portfolio generation
   - Email notifications

---

## Support Resources

- **API Documentation:** See `API_DOCUMENTATION.md`
- **Productionization Details:** See `PRODUCTIONIZATION_SUMMARY.md`
- **Route Definitions:** See `server/routes.ts`
- **Database Schema:** See `shared/schema.ts`
- **Auth Logic:** See `server/auth-service.ts`

---

**Ready to go!** Start with `npm run dev` and navigate to `http://localhost:5000` 🚀
