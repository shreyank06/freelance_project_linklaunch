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
import { randomUUID } from "crypto";

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

export class MemStorage implements IStorage {
  private sessions: Map<string, UserSession>;
  private skillMaps: Map<string, SkillMap>;
  private resumes: Map<string, Resume>;
  private atsAnalyses: Map<string, AtsAnalysis>;
  private linkedinProfiles: Map<string, LinkedinProfile>;
  private interviewSessions: Map<string, InterviewSession>;
  private documents: Map<string, Document>;
  private jobListings: Map<string, JobListing>;

  constructor() {
    this.sessions = new Map();
    this.skillMaps = new Map();
    this.resumes = new Map();
    this.atsAnalyses = new Map();
    this.linkedinProfiles = new Map();
    this.interviewSessions = new Map();
    this.documents = new Map();
    this.jobListings = new Map();
    
    // Seed initial job listings
    this.seedJobListings();
  }

  // User sessions
  async createSession(insertSession: InsertUserSession): Promise<UserSession> {
    const id = randomUUID();
    const session: UserSession = {
      id,
      ...insertSession,
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    this.sessions.set(id, session);
    return session;
  }

  async getSession(id: string): Promise<UserSession | undefined> {
    return this.sessions.get(id);
  }

  async updateSession(id: string, data: Partial<InsertUserSession>): Promise<UserSession | undefined> {
    const session = this.sessions.get(id);
    if (!session) return undefined;
    
    const updated: UserSession = {
      ...session,
      ...data,
      updatedAt: new Date(),
    };
    this.sessions.set(id, updated);
    return updated;
  }

  // Skill maps
  async createSkillMap(insertSkillMap: InsertSkillMap): Promise<SkillMap> {
    const id = randomUUID();
    const skillMap: SkillMap = {
      id,
      ...insertSkillMap,
      createdAt: new Date(),
    };
    this.skillMaps.set(id, skillMap);
    return skillMap;
  }

  async getSkillMapBySession(sessionId: string): Promise<SkillMap | undefined> {
    return Array.from(this.skillMaps.values()).find(sm => sm.sessionId === sessionId);
  }

  // Resumes
  async createResume(insertResume: InsertResume): Promise<Resume> {
    const id = randomUUID();
    const resume: Resume = {
      id,
      ...insertResume,
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    this.resumes.set(id, resume);
    return resume;
  }

  async getResumeBySession(sessionId: string): Promise<Resume | undefined> {
    return Array.from(this.resumes.values()).find(r => r.sessionId === sessionId);
  }

  async updateResume(id: string, data: Partial<InsertResume>): Promise<Resume | undefined> {
    const resume = this.resumes.get(id);
    if (!resume) return undefined;
    
    const updated: Resume = {
      ...resume,
      ...data,
      updatedAt: new Date(),
    };
    this.resumes.set(id, updated);
    return updated;
  }

  // ATS analyses
  async createAtsAnalysis(insertAnalysis: InsertAtsAnalysis): Promise<AtsAnalysis> {
    const id = randomUUID();
    const analysis: AtsAnalysis = {
      id,
      ...insertAnalysis,
      createdAt: new Date(),
    };
    this.atsAnalyses.set(id, analysis);
    return analysis;
  }

  async getAtsAnalysesBySession(sessionId: string): Promise<AtsAnalysis[]> {
    return Array.from(this.atsAnalyses.values()).filter(a => a.sessionId === sessionId);
  }

  // LinkedIn profiles
  async createLinkedinProfile(insertProfile: InsertLinkedinProfile): Promise<LinkedinProfile> {
    const id = randomUUID();
    const profile: LinkedinProfile = {
      id,
      ...insertProfile,
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    this.linkedinProfiles.set(id, profile);
    return profile;
  }

  async getLinkedinProfileBySession(sessionId: string): Promise<LinkedinProfile | undefined> {
    return Array.from(this.linkedinProfiles.values()).find(p => p.sessionId === sessionId);
  }

  async updateLinkedinProfile(id: string, data: Partial<InsertLinkedinProfile>): Promise<LinkedinProfile | undefined> {
    const profile = this.linkedinProfiles.get(id);
    if (!profile) return undefined;
    
    const updated: LinkedinProfile = {
      ...profile,
      ...data,
      updatedAt: new Date(),
    };
    this.linkedinProfiles.set(id, updated);
    return updated;
  }

  // Interview sessions
  async createInterviewSession(insertSession: InsertInterviewSession): Promise<InterviewSession> {
    const id = randomUUID();
    const session: InterviewSession = {
      id,
      ...insertSession,
      createdAt: new Date(),
    };
    this.interviewSessions.set(id, session);
    return session;
  }

  async getInterviewSessionsBySession(sessionId: string): Promise<InterviewSession[]> {
    return Array.from(this.interviewSessions.values()).filter(s => s.sessionId === sessionId);
  }

  // Documents
  async createDocument(insertDocument: InsertDocument): Promise<Document> {
    const id = randomUUID();
    const document: Document = {
      id,
      ...insertDocument,
      createdAt: new Date(),
    };
    this.documents.set(id, document);
    return document;
  }

  async getDocumentsBySession(sessionId: string): Promise<Document[]> {
    return Array.from(this.documents.values()).filter(d => d.sessionId === sessionId);
  }

  // Job listings
  async getAllJobListings(experienceLevel?: string): Promise<JobListing[]> {
    const listings = Array.from(this.jobListings.values());
    if (experienceLevel) {
      return listings.filter(l => l.experienceLevel === experienceLevel);
    }
    return listings;
  }

  async seedJobListings(): Promise<void> {
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
      // Mid level
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

    for (const listing of listings) {
      const id = randomUUID();
      const jobListing: JobListing = {
        id,
        ...listing,
        createdAt: new Date(),
      };
      this.jobListings.set(id, jobListing);
    }
  }
}

export const storage = new MemStorage();
