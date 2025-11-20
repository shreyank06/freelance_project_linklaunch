import {
  type UserSession, type InsertUserSession,
  type SkillMap, type InsertSkillMap,
  type Resume, type InsertResume,
  type AtsAnalysis, type InsertAtsAnalysis,
  type LinkedinProfile, type InsertLinkedinProfile,
  type InterviewSession, type InsertInterviewSession,
  type Document, type InsertDocument,
  type JobListing, type InsertJobListing,
} from "@shared/schema";

export interface IStorage {
  // User sessions
  createSession(session: InsertUserSession): Promise<UserSession>;
  getSession(id: string): Promise<UserSession | undefined>;
  updateSession(id: string, data: Partial<InsertUserSession>): Promise<UserSession | undefined>;
  
  // Skill maps
  createSkillMap(skillMap: InsertSkillMap): Promise<SkillMap>;
  getSkillMapBySession(sessionId: string): Promise<SkillMap | undefined>;
  
  // Resumes
  createResume(resume: InsertResume): Promise<Resume>;
  getResumeBySession(sessionId: string): Promise<Resume | undefined>;
  updateResume(id: string, data: Partial<InsertResume>): Promise<Resume | undefined>;
  
  // ATS analyses
  createAtsAnalysis(analysis: InsertAtsAnalysis): Promise<AtsAnalysis>;
  getAtsAnalysesBySession(sessionId: string): Promise<AtsAnalysis[]>;
  
  // LinkedIn profiles
  createLinkedinProfile(profile: InsertLinkedinProfile): Promise<LinkedinProfile>;
  getLinkedinProfileBySession(sessionId: string): Promise<LinkedinProfile | undefined>;
  updateLinkedinProfile(id: string, data: Partial<InsertLinkedinProfile>): Promise<LinkedinProfile | undefined>;
  
  // Interview sessions
  createInterviewSession(session: InsertInterviewSession): Promise<InterviewSession>;
  getInterviewSessionsBySession(sessionId: string): Promise<InterviewSession[]>;
  
  // Documents
  createDocument(document: InsertDocument): Promise<Document>;
  getDocumentsBySession(sessionId: string): Promise<Document[]>;
  
  // Job listings
  getAllJobListings(experienceLevel?: string): Promise<JobListing[]>;
  seedJobListings(): Promise<void>;
}

// MemStorage class removed - using DatabaseStorage instead

import { db } from "./db";
import { eq } from "drizzle-orm";
import {
  userSessions, skillMaps, resumes, atsAnalyses, linkedinProfiles,
  interviewSessions, documents, jobListings
} from "@shared/schema";
import { MemoryStorage } from "./storage-memory";

export class DatabaseStorage implements IStorage {
  constructor() {
    // Seed job listings on startup
    this.seedJobListings();
  }

  // User sessions
  async createSession(insertSession: InsertUserSession): Promise<UserSession> {
    const [session] = await db.insert(userSessions).values(insertSession).returning();
    return session;
  }

  async getSession(id: string): Promise<UserSession | undefined> {
    const [session] = await db.select().from(userSessions).where(eq(userSessions.id, id));
    return session || undefined;
  }

  async updateSession(id: string, data: Partial<InsertUserSession>): Promise<UserSession | undefined> {
    const [updated] = await db.update(userSessions)
      .set({ ...data, updatedAt: new Date() })
      .where(eq(userSessions.id, id))
      .returning();
    return updated || undefined;
  }

  // Skill maps
  async createSkillMap(insertSkillMap: InsertSkillMap): Promise<SkillMap> {
    const [skillMap] = await db.insert(skillMaps).values(insertSkillMap).returning();
    return skillMap;
  }

  async getSkillMapBySession(sessionId: string): Promise<SkillMap | undefined> {
    const [skillMap] = await db.select().from(skillMaps).where(eq(skillMaps.sessionId, sessionId));
    return skillMap || undefined;
  }

  // Resumes
  async createResume(insertResume: InsertResume): Promise<Resume> {
    const [resume] = await db.insert(resumes).values(insertResume).returning();
    return resume;
  }

  async getResumeBySession(sessionId: string): Promise<Resume | undefined> {
    const [resume] = await db.select().from(resumes).where(eq(resumes.sessionId, sessionId));
    return resume || undefined;
  }

  async updateResume(id: string, data: Partial<InsertResume>): Promise<Resume | undefined> {
    const [updated] = await db.update(resumes)
      .set({ ...data, updatedAt: new Date() })
      .where(eq(resumes.id, id))
      .returning();
    return updated || undefined;
  }

  // ATS analyses
  async createAtsAnalysis(insertAnalysis: InsertAtsAnalysis): Promise<AtsAnalysis> {
    const [analysis] = await db.insert(atsAnalyses).values(insertAnalysis).returning();
    return analysis;
  }

  async getAtsAnalysesBySession(sessionId: string): Promise<AtsAnalysis[]> {
    return await db.select().from(atsAnalyses).where(eq(atsAnalyses.sessionId, sessionId));
  }

  // LinkedIn profiles
  async createLinkedinProfile(insertProfile: InsertLinkedinProfile): Promise<LinkedinProfile> {
    const [profile] = await db.insert(linkedinProfiles).values(insertProfile).returning();
    return profile;
  }

  async getLinkedinProfileBySession(sessionId: string): Promise<LinkedinProfile | undefined> {
    const [profile] = await db.select().from(linkedinProfiles).where(eq(linkedinProfiles.sessionId, sessionId));
    return profile || undefined;
  }

  async updateLinkedinProfile(id: string, data: Partial<InsertLinkedinProfile>): Promise<LinkedinProfile | undefined> {
    const [updated] = await db.update(linkedinProfiles)
      .set({ ...data, updatedAt: new Date() })
      .where(eq(linkedinProfiles.id, id))
      .returning();
    return updated || undefined;
  }

  // Interview sessions
  async createInterviewSession(insertSession: InsertInterviewSession): Promise<InterviewSession> {
    const [session] = await db.insert(interviewSessions).values(insertSession).returning();
    return session;
  }

  async getInterviewSessionsBySession(sessionId: string): Promise<InterviewSession[]> {
    return await db.select().from(interviewSessions).where(eq(interviewSessions.sessionId, sessionId));
  }

  // Documents
  async createDocument(insertDocument: InsertDocument): Promise<Document> {
    const [document] = await db.insert(documents).values(insertDocument).returning();
    return document;
  }

  async getDocumentsBySession(sessionId: string): Promise<Document[]> {
    return await db.select().from(documents).where(eq(documents.sessionId, sessionId));
  }

  // Job listings
  async getAllJobListings(experienceLevel?: string): Promise<JobListing[]> {
    if (experienceLevel) {
      return await db.select().from(jobListings).where(eq(jobListings.experienceLevel, experienceLevel));
    }
    return await db.select().from(jobListings);
  }

  async seedJobListings(): Promise<void> {
    // Check if we already have job listings
    const existing = await db.select().from(jobListings).limit(1);
    if (existing.length > 0) return;

    const listings = [
      // Entry level
      {
        title: "Junior Software Developer",
        company: "TechCorp",
        location: "San Francisco, CA",
        description: "Join our dynamic development team as a junior developer. Perfect for recent graduates!",
        salaryRange: "$70,000 - $90,000",
        experienceLevel: "entry" as const,
        keywords: ["JavaScript", "React", "Git", "Agile"],
      },
      {
        title: "Customer Success Associate",
        company: "SupportCo",
        location: "Remote",
        description: "Help customers succeed with our SaaS platform. Great entry point into tech!",
        salaryRange: "$40,000 - $50,000",
        experienceLevel: "entry" as const,
        keywords: ["Customer Service", "Communication", "Problem Solving"],
      },
      {
        title: "Marketing Associate",
        company: "BrandAgency",
        location: "New York, NY",
        description: "Support our marketing campaigns and learn from experienced professionals.",
        salaryRange: "$55,000 - $70,000",
        experienceLevel: "entry" as const,
        keywords: ["Marketing", "Social Media", "Content Creation"],
      },
      // Mid/Senior level
      {
        title: "Senior Product Manager",
        company: "InnovateCorp",
        location: "Seattle, WA",
        description: "Lead product strategy for our flagship SaaS platform.",
        salaryRange: "$140,000 - $180,000",
        experienceLevel: "mid" as const,
        keywords: ["Product Management", "Strategy", "Leadership", "SaaS"],
      },
      {
        title: "Engineering Manager",
        company: "TechLeaders",
        location: "Austin, TX",
        description: "Manage a team of 10+ engineers building cutting-edge applications.",
        salaryRange: "$160,000 - $200,000",
        experienceLevel: "senior" as const,
        keywords: ["Team Leadership", "Engineering", "Agile", "Mentorship"],
      },
      {
        title: "Director of Operations",
        company: "GlobalBiz",
        location: "Remote",
        description: "Oversee operations across multiple departments and drive efficiency.",
        salaryRange: "$150,000 - $190,000",
        experienceLevel: "senior" as const,
        keywords: ["Operations", "Process Improvement", "Leadership", "Budget Management"],
      },
    ];

    await db.insert(jobListings).values(listings);
  }
}

// Use memory storage if database is not available
export const storage: IStorage = db ? new DatabaseStorage() : new MemoryStorage();
