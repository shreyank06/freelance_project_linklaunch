# LinkLaunch API Documentation

## Authentication Endpoints

### Register User
Create a new user account and initialize user session.

```http
POST /api/auth/register
Content-Type: application/json

{
  "email": "user@example.com",
  "password": "secure-password-123",
  "fullName": "John Doe",
  "pathType": "college"
}
```

**Response (201):**
```json
{
  "user": {
    "id": "uuid",
    "email": "user@example.com",
    "fullName": "John Doe"
  },
  "session": {
    "id": "session-uuid",
    "userId": "user-uuid",
    "pathType": "college",
    "currentModule": "welcome"
  }
}
```

**Errors:**
- `400` - Invalid path type or missing fields
- `400` - Email already registered

---

### Login User
Authenticate existing user.

```http
POST /api/auth/login
Content-Type: application/json

{
  "email": "user@example.com",
  "password": "secure-password-123"
}
```

**Response (200):**
```json
{
  "user": {
    "id": "uuid",
    "email": "user@example.com",
    "fullName": "John Doe"
  },
  "sessions": [
    {
      "id": "session-uuid",
      "pathType": "college",
      "currentModule": "welcome"
    }
  ],
  "currentSession": {
    "id": "session-uuid",
    "pathType": "college",
    "currentModule": "welcome"
  }
}
```

**Errors:**
- `401` - Invalid email or password
- `404` - No active session found

---

### Logout User
End user session.

```http
POST /api/auth/logout
```

**Response (200):**
```json
{
  "success": true
}
```

---

### Get Current User
Retrieve authenticated user info.

```http
GET /api/auth/me
```

**Response (200):**
```json
{
  "id": "uuid",
  "email": "user@example.com",
  "fullName": "John Doe",
  "isVerified": false,
  "createdAt": "2025-11-20T00:00:00Z"
}
```

**Errors:**
- `401` - Unauthorized (not logged in)

---

## Session & Module Endpoints

### Create User Session
Create a new user session for a different path.

```http
POST /api/sessions
Content-Type: application/json
Authorization: Required (via session)

{
  "pathType": "professional"
}
```

**Response (200):**
```json
{
  "id": "session-uuid",
  "userId": "user-uuid",
  "pathType": "professional",
  "currentModule": "welcome",
  "createdAt": "2025-11-20T00:00:00Z"
}
```

---

### Get User Sessions
List all sessions for authenticated user.

```http
GET /api/user/sessions
```

**Response (200):**
```json
[
  {
    "id": "session-uuid-1",
    "pathType": "college",
    "currentModule": "skill-discovery"
  },
  {
    "id": "session-uuid-2",
    "pathType": "professional",
    "currentModule": "welcome"
  }
]
```

---

### Get Module Progress
Retrieve progress for all modules in a session.

```http
GET /api/sessions/:sessionId/progress
```

**Response (200):**
```json
[
  {
    "id": "uuid",
    "sessionId": "session-uuid",
    "moduleName": "welcome",
    "status": "completed",
    "progress": 100,
    "startedAt": "2025-11-20T10:00:00Z",
    "completedAt": "2025-11-20T10:15:00Z"
  },
  {
    "id": "uuid",
    "sessionId": "session-uuid",
    "moduleName": "job-listings",
    "status": "in_progress",
    "progress": 45,
    "startedAt": "2025-11-20T10:15:00Z",
    "completedAt": null
  },
  {
    "id": "uuid",
    "sessionId": "session-uuid",
    "moduleName": "skill-discovery",
    "status": "locked",
    "progress": 0
  }
]
```

---

### Update Current Module
Switch to a different module (must be unlocked).

```http
POST /api/sessions/:sessionId/current-module
Content-Type: application/json

{
  "moduleName": "skill-discovery"
}
```

**Response (200):**
```json
[
  {
    "id": "session-uuid",
    "currentModule": "skill-discovery"
  }
]
```

**Errors:**
- `403` - Module is locked

---

### Complete Module
Mark a module as complete and unlock the next one.

```http
POST /api/sessions/:sessionId/complete-module
Content-Type: application/json

{
  "moduleName": "job-listings"
}
```

**Response (200):**
```json
{
  "success": true
}
```

---

### Update Module Progress
Update progress percentage for a module (0-100).

```http
POST /api/sessions/:sessionId/progress
Content-Type: application/json

{
  "moduleName": "skill-discovery",
  "progress": 65
}
```

**Response (200):**
```json
[
  {
    "id": "uuid",
    "sessionId": "session-uuid",
    "moduleName": "skill-discovery",
    "progress": 65
  }
]
```

---

## Job Listings Endpoints

### Get Job Listings
Retrieve jobs filtered by experience level.

```http
GET /api/jobs?experienceLevel=entry
```

**Query Parameters:**
- `experienceLevel` (optional) - "entry", "mid", "senior"

**Response (200):**
```json
[
  {
    "id": "uuid",
    "title": "Junior Developer",
    "company": "Tech Company",
    "location": "Remote",
    "description": "Job description...",
    "salaryRange": "$60k - $80k",
    "experienceLevel": "entry",
    "keywords": ["JavaScript", "React", "Node.js"]
  }
]
```

---

## Skill Discovery Endpoints

### Generate Skill Map
Use AI to generate skills from user input.

```http
POST /api/skill-map
Content-Type: application/json
Authorization: Required

{
  "sessionId": "session-uuid",
  "userInput": "I built a e-commerce website with React and Node.js...",
  "pathType": "college"
}
```

**Response (200):**
```json
{
  "id": "skill-map-uuid",
  "sessionId": "session-uuid",
  "technicalSkills": ["React", "Node.js", "JavaScript"],
  "leadershipSkills": ["Project Management"],
  "transferableSkills": ["Communication", "Problem Solving"],
  "keywords": ["Full-stack development", "E-commerce"],
  "brandStatement": "Full-stack developer with expertise in React and Node.js..."
}
```

---

### Get Skill Map
Retrieve skill map for a session.

```http
GET /api/skill-map/:sessionId
```

**Response (200):**
```json
{
  "id": "skill-map-uuid",
  "sessionId": "session-uuid",
  "technicalSkills": ["React", "Node.js"],
  "leadershipSkills": [],
  "transferableSkills": ["Communication"],
  "keywords": ["Full-stack"],
  "brandStatement": "..."
}
```

---

## Resume Endpoints

### Generate Resume
Create AI-powered resume based on skills.

```http
POST /api/resume
Content-Type: application/json
Authorization: Required

{
  "sessionId": "session-uuid",
  "pathType": "college",
  "userInfo": {
    "name": "John Doe",
    "email": "john@example.com",
    "phone": "(555) 123-4567"
  }
}
```

**Response (200):**
```json
{
  "id": "resume-uuid",
  "sessionId": "session-uuid",
  "content": {
    "name": "John Doe",
    "email": "john@example.com",
    "phone": "(555) 123-4567",
    "summary": "...",
    "experience": [...],
    "education": [...],
    "skills": [...]
  },
  "pdfUrl": null
}
```

---

### Get Resume
Retrieve resume for a session.

```http
GET /api/resume/:sessionId
```

**Response (200):**
```json
{
  "id": "resume-uuid",
  "content": { /* full resume content */ }
}
```

---

### Export Resume as PDF
Download resume as PDF file.

```http
GET /api/resume/:sessionId/export/pdf
```

**Response (200):**
- Content-Type: `application/pdf`
- Content-Disposition: `attachment; filename="resume.pdf"`
- Binary PDF file

---

### Export Resume as DOCX
Download resume as Word document.

```http
GET /api/resume/:sessionId/export/docx
```

**Response (200):**
- Content-Type: `application/vnd.openxmlformats-officedocument.wordprocessingml.document`
- Content-Disposition: `attachment; filename="resume.docx"`
- Binary DOCX file

---

## ATS Analysis Endpoints

### Analyze ATS Match
Compare resume against job description.

```http
POST /api/ats-analysis
Content-Type: application/json
Authorization: Required

{
  "sessionId": "session-uuid",
  "jobDescription": "We are looking for a React developer with Node.js experience...",
  "resumeId": "resume-uuid" // optional, uses most recent if not provided
}
```

**Response (200):**
```json
{
  "id": "analysis-uuid",
  "sessionId": "session-uuid",
  "resumeId": "resume-uuid",
  "matchPercentage": 78,
  "keywordGaps": ["TypeScript", "GraphQL"],
  "improvements": [
    "Add TypeScript skills",
    "Emphasize API design"
  ],
  "strengths": ["React", "Node.js", "Full-stack"]
}
```

---

### Get ATS Analyses
Retrieve all ATS analyses for a session.

```http
GET /api/ats-analysis/:sessionId
```

**Response (200):**
```json
[
  {
    "id": "analysis-uuid-1",
    "matchPercentage": 78,
    "keywords": [...]
  },
  {
    "id": "analysis-uuid-2",
    "matchPercentage": 82,
    "keywords": [...]
  }
]
```

---

## LinkedIn Profile Endpoints

### Generate LinkedIn Profile
Create optimized LinkedIn profile sections.

```http
POST /api/linkedin-profile
Content-Type: application/json
Authorization: Required

{
  "sessionId": "session-uuid",
  "pathType": "college"
}
```

**Response (200):**
```json
{
  "id": "profile-uuid",
  "sessionId": "session-uuid",
  "headline": "Junior Full-Stack Developer | React & Node.js | Open to Opportunities",
  "about": "Passionate full-stack developer...",
  "experienceSection": [
    {
      "title": "Senior Developer",
      "description": "Led team of 5 developers..."
    }
  ],
  "skillsList": ["React", "Node.js", "JavaScript"]
}
```

---

### Get LinkedIn Profile
Retrieve LinkedIn profile for a session.

```http
GET /api/linkedin-profile/:sessionId
```

**Response (200):**
```json
{
  "id": "profile-uuid",
  "headline": "...",
  "about": "...",
  "experienceSection": [...],
  "skillsList": [...]
}
```

---

## Interview Coaching Endpoints

### Get Interview Feedback
Practice interview question and receive feedback.

```http
POST /api/interview-feedback
Content-Type: application/json
Authorization: Required

{
  "sessionId": "session-uuid",
  "pathType": "college",
  "question": "Tell me about a challenging project you've worked on",
  "answer": "I built a real-time chat application using WebSockets..."
}
```

**Response (200):**
```json
{
  "session": {
    "id": "interview-uuid",
    "questions": [
      {
        "question": "...",
        "userAnswer": "...",
        "feedback": "Good structure, but could add more metrics",
        "score": 7.5
      }
    ]
  },
  "feedback": {
    "specificFeedback": "Strong answer with good examples...",
    "overallScore": 7.5
  }
}
```

---

### Get Interview Sessions
Retrieve all interview sessions for a user.

```http
GET /api/interview-sessions/:sessionId
```

**Response (200):**
```json
[
  {
    "id": "interview-uuid",
    "sessionId": "session-uuid",
    "questions": [...]
  }
]
```

---

## Document Generation Endpoints

### Generate Document
Create professional documents (cover letter, follow-up, etc.).

```http
POST /api/document
Content-Type: application/json
Authorization: Required

{
  "sessionId": "session-uuid",
  "documentType": "cover_letter",
  "pathType": "college",
  "recipientInfo": {
    "company": "Tech Company",
    "position": "Junior Developer",
    "hiringManager": "Jane Smith"
  }
}
```

**Response (200):**
```json
{
  "id": "document-uuid",
  "sessionId": "session-uuid",
  "documentType": "cover_letter",
  "content": "Dear Jane Smith,\n\nI am writing to express...",
  "recipientInfo": {
    "company": "Tech Company",
    "position": "Junior Developer",
    "hiringManager": "Jane Smith"
  }
}
```

---

### Get Documents
Retrieve all documents for a session.

```http
GET /api/documents/:sessionId
```

**Response (200):**
```json
[
  {
    "id": "document-uuid-1",
    "documentType": "cover_letter",
    "content": "..."
  },
  {
    "id": "document-uuid-2",
    "documentType": "follow_up",
    "content": "..."
  }
]
```

---

### Export Document as PDF
Download document as PDF.

```http
GET /api/document/:documentId/export/pdf
```

**Response (200):**
- Content-Type: `application/pdf`
- Binary PDF file

---

### Export Document as DOCX
Download document as Word document.

```http
GET /api/document/:documentId/export/docx
```

**Response (200):**
- Content-Type: `application/vnd.openxmlformats-officedocument.wordprocessingml.document`
- Binary DOCX file

---

## Error Responses

All error responses follow this format:

```json
{
  "error": "Error message describing what went wrong"
}
```

### Common HTTP Status Codes

- `200 OK` - Request successful
- `400 Bad Request` - Invalid request parameters
- `401 Unauthorized` - Authentication required
- `403 Forbidden` - Access denied (e.g., module locked)
- `404 Not Found` - Resource not found
- `500 Internal Server Error` - Server error

---

## Authentication

Most endpoints require authentication via session cookies. The session is automatically created after successful login or registration.

**Required Header (optional, cookies sent automatically):**
```http
Cookie: connect.sid=session-token
```

---

## Rate Limiting

Not yet implemented. Will be added in Phase 2.

---

## Webhook Support

Not currently available. May be added in future versions.

---

**Last Updated:** 2025-11-20
**Version:** 1.0.0
