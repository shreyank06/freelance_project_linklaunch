import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import * as aiService from "./ai-service";
import * as authService from "./auth-service";
import * as documentExporter from "./document-export-service";
import { z } from "zod";
import { insertSkillMapSchema, insertResumeSchema, insertAtsAnalysisSchema, insertLinkedinProfileSchema, insertInterviewSessionSchema, insertDocumentSchema } from "@shared/schema";
import { Readable } from "stream";

// Authentication middleware
function requireAuth(req: any, res: any, next: any) {
  if (!req.session?.userId) {
    return res.status(401).json({ error: "Unauthorized" });
  }
  next();
}

export async function registerRoutes(app: Express): Promise<Server> {
  // ==================== AUTHENTICATION ROUTES ====================

  // Register
  app.post("/api/auth/register", async (req, res) => {
    try {
      const { email, password, fullName, pathType } = req.body;

      if (!email || !password || !pathType) {
        return res.status(400).json({ error: "Missing required fields" });
      }

      // Validate path type
      if (!['college', 'professional', 'starter'].includes(pathType)) {
        return res.status(400).json({ error: "Invalid path type" });
      }

      // Create user
      const user = await authService.createUser(email, password, fullName);

      // Create user session
      const userSession = await authService.createUserSession(user.id, pathType);

      // Store in session
      req.session.userId = user.id;
      req.session.sessionId = userSession.id;

      res.json({
        user: { id: user.id, email: user.email, fullName: user.fullName },
        session: userSession,
      });
    } catch (error: any) {
      res.status(400).json({ error: error.message });
    }
  });

  // Login
  app.post("/api/auth/login", async (req, res) => {
    try {
      const { email, password } = req.body;

      if (!email || !password) {
        return res.status(400).json({ error: "Missing email or password" });
      }

      // Find user
      const user = await authService.getUserByEmail(email);

      if (!user) {
        return res.status(401).json({ error: "Invalid email or password" });
      }

      // Verify password
      const isValid = await authService.verifyPassword(password, user.passwordHash);

      if (!isValid) {
        return res.status(401).json({ error: "Invalid email or password" });
      }

      // Get user sessions
      const sessions = await authService.getUserSessions(user.id);

      if (sessions.length === 0) {
        return res.status(404).json({ error: "No active session found. Please select a path to start." });
      }

      // Use the first session (or most recent)
      const userSession = sessions[0];

      req.session.userId = user.id;
      req.session.sessionId = userSession.id;

      res.json({
        user: { id: user.id, email: user.email, fullName: user.fullName },
        sessions,
        currentSession: userSession,
      });
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  });

  // Logout
  app.post("/api/auth/logout", (req, res) => {
    req.session.destroy((err: any) => {
      if (err) {
        return res.status(500).json({ error: "Logout failed" });
      }
      res.json({ success: true });
    });
  });

  // Get current user
  app.get("/api/auth/me", requireAuth, async (req, res) => {
    try {
      const user = await authService.getUserById(req.session.userId);
      res.json(user);
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  });

  // ==================== SESSION & MODULE ROUTES ====================

  // Create a new user session (demo mode - no auth required for initial path selection)
  app.post("/api/sessions", async (req, res) => {
    try {
      const { pathType } = req.body;

      if (!['college', 'professional', 'starter'].includes(pathType)) {
        return res.status(400).json({ error: "Invalid path type" });
      }

      // For demo mode, create a session without requiring authentication
      // Users can continue as guests and optionally authenticate later
      let userId = req.session.userId;

      if (!userId) {
        // Create a temporary demo user/session
        const demoSession = await storage.createSession({
          pathType,
          createdAt: new Date(),
          updatedAt: new Date(),
        });
        req.session.sessionId = demoSession.id;
        res.json(demoSession);
      } else {
        // If user is authenticated, create a session for them
        const session = await authService.createUserSession(userId, pathType);
        req.session.sessionId = session.id;
        res.json(session);
      }
    } catch (error: any) {
      console.error("Session creation error:", error);
      res.status(500).json({ error: error.message });
    }
  });

  // Get current session
  app.get("/api/sessions/:sessionId", requireAuth, async (req, res) => {
    try {
      const session = await authService.getUserSession(req.params.sessionId);

      if (!session) {
        return res.status(404).json({ error: "Session not found" });
      }

      res.json(session);
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  });

  // Get user's sessions
  app.get("/api/user/sessions", requireAuth, async (req, res) => {
    try {
      const sessions = await authService.getUserSessions(req.session.userId);
      res.json(sessions);
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  });

  // Get module progress
  app.get("/api/sessions/:sessionId/progress", requireAuth, async (req, res) => {
    try {
      const progress = await authService.getModuleProgress(req.params.sessionId);
      res.json(progress);
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  });

  // Update current module
  app.post("/api/sessions/:sessionId/current-module", requireAuth, async (req, res) => {
    try {
      const { moduleName } = req.body;

      // Check if module is unlocked
      const isUnlocked = await authService.isModuleUnlocked(req.params.sessionId, moduleName);

      if (!isUnlocked) {
        return res.status(403).json({ error: "Module is locked. Complete previous modules first." });
      }

      const result = await authService.updateCurrentModule(req.params.sessionId, moduleName);
      res.json(result);
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  });

  // Complete module
  app.post("/api/sessions/:sessionId/complete-module", requireAuth, async (req, res) => {
    try {
      const { moduleName } = req.body;

      const result = await authService.completeModule(req.params.sessionId, moduleName);
      res.json({ success: result });
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  });

  // Update module progress (0-100)
  app.post("/api/sessions/:sessionId/progress", requireAuth, async (req, res) => {
    try {
      const { moduleName, progress } = req.body;

      if (typeof progress !== 'number' || progress < 0 || progress > 100) {
        return res.status(400).json({ error: "Progress must be between 0 and 100" });
      }

      const result = await authService.updateModuleProgress(
        req.params.sessionId,
        moduleName,
        progress
      );
      res.json(result);
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  });

  // ==================== JOB LISTINGS ROUTES ====================

  // Get job listings
  app.get("/api/jobs", async (req, res) => {
    try {
      const { experienceLevel } = req.query;
      const jobs = await storage.getAllJobListings(experienceLevel as string);
      res.json(jobs);
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  });

  // ==================== SKILL DISCOVERY ROUTES ====================

  // Generate skill map
  app.post("/api/skill-map", requireAuth, async (req, res) => {
    try {
      const { sessionId, userInput, pathType } = req.body;

      if (!sessionId || !userInput || !pathType) {
        return res.status(400).json({ error: "Missing required fields" });
      }

      // Generate skill map using AI
      const skillMapResult = await aiService.generateSkillMap(userInput, pathType);

      // Store in database
      const skillMap = await storage.createSkillMap({
        sessionId,
        pathType,
        userInput,
        technicalSkills: skillMapResult.technicalSkills,
        leadershipSkills: skillMapResult.leadershipSkills,
        transferableSkills: skillMapResult.transferableSkills,
        keywords: skillMapResult.keywords,
        brandStatement: skillMapResult.brandStatement,
      });

      res.json(skillMap);
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  });

  // Get skill map by session
  app.get("/api/skill-map/:sessionId", async (req, res) => {
    try {
      const { sessionId } = req.params;
      const skillMap = await storage.getSkillMapBySession(sessionId);

      if (!skillMap) {
        return res.status(404).json({ error: "Skill map not found" });
      }

      res.json(skillMap);
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  });

  // ==================== RESUME ROUTES ====================

  // Generate resume
  app.post("/api/resume", requireAuth, async (req, res) => {
    try {
      const { sessionId, pathType, userInfo, skillMapId } = req.body;

      if (!sessionId || !pathType) {
        return res.status(400).json({ error: "Missing required fields" });
      }

      // Get skill map
      const skillMap = await storage.getSkillMapBySession(sessionId);

      if (!skillMap) {
        return res.status(400).json({ error: "Please complete skill discovery first" });
      }

      // Generate resume using AI
      const resumeContent = await aiService.generateResume(
        {
          technicalSkills: skillMap.technicalSkills as string[],
          leadershipSkills: skillMap.leadershipSkills as string[],
          transferableSkills: skillMap.transferableSkills as string[],
          keywords: skillMap.keywords as string[],
          brandStatement: skillMap.brandStatement || "",
        },
        userInfo,
        pathType
      );

      // Store in database
      const resume = await storage.createResume({
        sessionId,
        pathType,
        content: resumeContent,
        pdfUrl: null,
      });

      res.json(resume);
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  });

  // Get resume by session
  app.get("/api/resume/:sessionId", async (req, res) => {
    try {
      const { sessionId } = req.params;
      const resume = await storage.getResumeBySession(sessionId);

      if (!resume) {
        return res.status(404).json({ error: "Resume not found" });
      }

      res.json(resume);
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  });

  // Export resume as PDF
  app.get("/api/resume/:sessionId/export/pdf", async (req, res) => {
    try {
      const resume = await storage.getResumeBySession(req.params.sessionId);

      if (!resume) {
        return res.status(404).json({ error: "Resume not found" });
      }

      const pdfBuffer = await documentExporter.generateResumePDF(resume);

      res.setHeader('Content-Type', 'application/pdf');
      res.setHeader('Content-Disposition', 'attachment; filename="resume.pdf"');
      res.send(pdfBuffer);
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  });

  // Export resume as DOCX
  app.get("/api/resume/:sessionId/export/docx", async (req, res) => {
    try {
      const resume = await storage.getResumeBySession(req.params.sessionId);

      if (!resume) {
        return res.status(404).json({ error: "Resume not found" });
      }

      const docxBuffer = await documentExporter.generateResumeDOCX(resume);

      res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document');
      res.setHeader('Content-Disposition', 'attachment; filename="resume.docx"');
      res.send(docxBuffer);
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  });

  // ==================== ATS ANALYSIS ROUTES ====================

  // Analyze ATS match
  app.post("/api/ats-analysis", requireAuth, async (req, res) => {
    try {
      const { sessionId, resumeId, jobDescription } = req.body;

      if (!sessionId || !jobDescription) {
        return res.status(400).json({ error: "Missing required fields" });
      }

      // Get resume
      const resume = resumeId
        ? await storage.resumes?.get(resumeId)
        : await storage.getResumeBySession(sessionId);

      if (!resume) {
        return res.status(400).json({ error: "Please create a resume first" });
      }

      // Analyze ATS match using AI
      const analysisResult = await aiService.analyzeAtsMatch(resume.content, jobDescription);

      // Store in database
      const analysis = await storage.createAtsAnalysis({
        sessionId,
        resumeId: resume.id,
        jobDescription,
        matchPercentage: analysisResult.matchPercentage,
        keywordGaps: analysisResult.keywordGaps,
        improvements: analysisResult.improvements,
        strengths: analysisResult.strengths,
      });

      res.json(analysis);
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  });

  // Get ATS analyses by session
  app.get("/api/ats-analysis/:sessionId", async (req, res) => {
    try {
      const { sessionId } = req.params;
      const analyses = await storage.getAtsAnalysesBySession(sessionId);
      res.json(analyses);
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  });

  // ==================== LINKEDIN PROFILE ROUTES ====================

  // Generate LinkedIn profile
  app.post("/api/linkedin-profile", requireAuth, async (req, res) => {
    try {
      const { sessionId, pathType } = req.body;

      if (!sessionId || !pathType) {
        return res.status(400).json({ error: "Missing required fields" });
      }

      // Get skill map and resume
      const skillMap = await storage.getSkillMapBySession(sessionId);
      const resume = await storage.getResumeBySession(sessionId);

      if (!skillMap) {
        return res.status(400).json({ error: "Please complete skill discovery first" });
      }

      // Generate LinkedIn profile using AI
      const profileContent = await aiService.generateLinkedInProfile(
        {
          technicalSkills: skillMap.technicalSkills as string[],
          leadershipSkills: skillMap.leadershipSkills as string[],
          transferableSkills: skillMap.transferableSkills as string[],
          keywords: skillMap.keywords as string[],
          brandStatement: skillMap.brandStatement || "",
        },
        resume?.content || {},
        pathType
      );

      // Store in database
      const profile = await storage.createLinkedinProfile({
        sessionId,
        pathType,
        headline: profileContent.headline,
        about: profileContent.about,
        experienceSection: profileContent.experienceSection,
        skillsList: profileContent.skillsList,
      });

      res.json(profile);
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  });

  // Get LinkedIn profile by session
  app.get("/api/linkedin-profile/:sessionId", async (req, res) => {
    try {
      const { sessionId } = req.params;
      const profile = await storage.getLinkedinProfileBySession(sessionId);

      if (!profile) {
        return res.status(404).json({ error: "LinkedIn profile not found" });
      }

      res.json(profile);
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  });

  // ==================== INTERVIEW COACHING ROUTES ====================

  // Generate interview feedback
  app.post("/api/interview-feedback", requireAuth, async (req, res) => {
    try {
      const { sessionId, pathType, question, answer } = req.body;

      if (!sessionId || !pathType || !question || !answer) {
        return res.status(400).json({ error: "Missing required fields" });
      }

      // Generate feedback using AI
      const feedback = await aiService.generateInterviewFeedback(question, answer, pathType);

      // Store interview session
      const session = await storage.createInterviewSession({
        sessionId,
        pathType,
        questions: [{
          question,
          userAnswer: answer,
          feedback: feedback.specificFeedback,
          score: feedback.overallScore,
        }],
        overallFeedback: feedback.specificFeedback,
      });

      res.json({ session, feedback });
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  });

  // Get interview sessions by session
  app.get("/api/interview-sessions/:sessionId", async (req, res) => {
    try {
      const { sessionId } = req.params;
      const sessions = await storage.getInterviewSessionsBySession(sessionId);
      res.json(sessions);
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  });

  // ==================== DOCUMENT GENERATION ROUTES ====================

  // Generate document
  app.post("/api/document", requireAuth, async (req, res) => {
    try {
      const { sessionId, documentType, recipientInfo, pathType } = req.body;

      if (!sessionId || !documentType || !pathType) {
        return res.status(400).json({ error: "Missing required fields" });
      }

      // Get user's skill map and resume for context
      const skillMap = await storage.getSkillMapBySession(sessionId);
      const resume = await storage.getResumeBySession(sessionId);

      // Generate document using AI
      const content = await aiService.generateDocument(
        documentType,
        recipientInfo || {},
        {
          skillMap,
          resume: resume?.content,
        },
        pathType
      );

      // Store document
      const document = await storage.createDocument({
        sessionId,
        documentType,
        content,
        recipientInfo: recipientInfo || {},
      });

      res.json(document);
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  });

  // Get documents by session
  app.get("/api/documents/:sessionId", async (req, res) => {
    try {
      const { sessionId } = req.params;
      const documents = await storage.getDocumentsBySession(sessionId);
      res.json(documents);
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  });

  // Export document as PDF
  app.get("/api/document/:documentId/export/pdf", async (req, res) => {
    try {
      const document = await storage.documents?.get(req.params.documentId);

      if (!document) {
        return res.status(404).json({ error: "Document not found" });
      }

      const pdfBuffer = await documentExporter.generateCoverLetterPDF(document);

      res.setHeader('Content-Type', 'application/pdf');
      res.setHeader('Content-Disposition', `attachment; filename="${document.documentType}.pdf"`);
      res.send(pdfBuffer);
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  });

  // Export document as DOCX
  app.get("/api/document/:documentId/export/docx", async (req, res) => {
    try {
      const document = await storage.documents?.get(req.params.documentId);

      if (!document) {
        return res.status(404).json({ error: "Document not found" });
      }

      const docxBuffer = await documentExporter.generateCoverLetterDOCX(document);

      res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document');
      res.setHeader('Content-Disposition', `attachment; filename="${document.documentType}.docx"`);
      res.send(docxBuffer);
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}
