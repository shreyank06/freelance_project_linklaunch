import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import * as aiService from "./ai-service";
import { z } from "zod";
import { insertSkillMapSchema, insertResumeSchema, insertAtsAnalysisSchema, insertLinkedinProfileSchema, insertInterviewSessionSchema, insertDocumentSchema } from "@shared/schema";

export async function registerRoutes(app: Express): Promise<Server> {
  // Create a new user session
  app.post("/api/sessions", async (req, res) => {
    try {
      const { pathType } = req.body;
      
      if (!['college', 'professional', 'starter'].includes(pathType)) {
        return res.status(400).json({ error: "Invalid path type" });
      }

      const session = await storage.createSession({
        pathType,
        currentModule: 'welcome',
      });

      res.json(session);
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  });

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

  // Generate skill map
  app.post("/api/skill-map", async (req, res) => {
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

  // Generate resume
  app.post("/api/resume", async (req, res) => {
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

  // Analyze ATS match
  app.post("/api/ats-analysis", async (req, res) => {
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

  // Generate LinkedIn profile
  app.post("/api/linkedin-profile", async (req, res) => {
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

  // Generate interview feedback
  app.post("/api/interview-feedback", async (req, res) => {
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

  // Generate document
  app.post("/api/document", async (req, res) => {
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

  const httpServer = createServer(app);
  return httpServer;
}
