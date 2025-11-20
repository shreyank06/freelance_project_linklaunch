import { v4 as uuidv4 } from 'uuid';
import type {
  UserSession, InsertUserSession,
  SkillMap, InsertSkillMap,
  Resume, InsertResume,
  AtsAnalysis, InsertAtsAnalysis,
  LinkedinProfile, InsertLinkedinProfile,
  InterviewSession, InsertInterviewSession,
  Document, InsertDocument,
  JobListing, InsertJobListing,
} from "@shared/schema";

// In-memory storage for demo/testing
export class MemoryStorage {
  private sessions = new Map<string, UserSession>();
  private skillMaps = new Map<string, SkillMap>();
  private resumes = new Map<string, Resume>();
  private atsAnalyses = new Map<string, AtsAnalysis>();
  private linkedinProfiles = new Map<string, LinkedinProfile>();
  private interviewSessions = new Map<string, InterviewSession>();
  private documents = new Map<string, Document>();
  private jobListings = new Map<string, JobListing>();

  async createSession(session: InsertUserSession): Promise<UserSession> {
    const id = uuidv4();
    const newSession: UserSession = {
      ...session,
      id,
      createdAt: new Date(),
      updatedAt: new Date(),
    } as UserSession;
    this.sessions.set(id, newSession);
    return newSession;
  }

  async getSession(id: string): Promise<UserSession | undefined> {
    return this.sessions.get(id);
  }

  async updateSession(id: string, data: Partial<InsertUserSession>): Promise<UserSession | undefined> {
    const session = this.sessions.get(id);
    if (!session) return undefined;
    const updated = { ...session, ...data, updatedAt: new Date() };
    this.sessions.set(id, updated);
    return updated;
  }

  async createSkillMap(skillMap: InsertSkillMap): Promise<SkillMap> {
    const id = uuidv4();
    const newSkillMap: SkillMap = {
      ...skillMap,
      id,
      createdAt: new Date(),
    } as SkillMap;
    this.skillMaps.set(id, newSkillMap);
    return newSkillMap;
  }

  async getSkillMapBySession(sessionId: string): Promise<SkillMap | undefined> {
    for (const skillMap of this.skillMaps.values()) {
      if (skillMap.sessionId === sessionId) return skillMap;
    }
    return undefined;
  }

  async createResume(resume: InsertResume): Promise<Resume> {
    const id = uuidv4();
    const newResume: Resume = {
      ...resume,
      id,
      createdAt: new Date(),
      updatedAt: new Date(),
    } as Resume;
    this.resumes.set(id, newResume);
    return newResume;
  }

  async getResumeBySession(sessionId: string): Promise<Resume | undefined> {
    for (const resume of this.resumes.values()) {
      if (resume.sessionId === sessionId) return resume;
    }
    return undefined;
  }

  async updateResume(id: string, data: Partial<InsertResume>): Promise<Resume | undefined> {
    const resume = this.resumes.get(id);
    if (!resume) return undefined;
    const updated = { ...resume, ...data, updatedAt: new Date() };
    this.resumes.set(id, updated);
    return updated;
  }

  async createAtsAnalysis(analysis: InsertAtsAnalysis): Promise<AtsAnalysis> {
    const id = uuidv4();
    const newAnalysis: AtsAnalysis = {
      ...analysis,
      id,
      createdAt: new Date(),
    } as AtsAnalysis;
    this.atsAnalyses.set(id, newAnalysis);
    return newAnalysis;
  }

  async getAtsAnalysesBySession(sessionId: string): Promise<AtsAnalysis[]> {
    const analyses: AtsAnalysis[] = [];
    for (const analysis of this.atsAnalyses.values()) {
      if (analysis.sessionId === sessionId) analyses.push(analysis);
    }
    return analyses;
  }

  async createLinkedinProfile(profile: InsertLinkedinProfile): Promise<LinkedinProfile> {
    const id = uuidv4();
    const newProfile: LinkedinProfile = {
      ...profile,
      id,
      createdAt: new Date(),
      updatedAt: new Date(),
    } as LinkedinProfile;
    this.linkedinProfiles.set(id, newProfile);
    return newProfile;
  }

  async getLinkedinProfileBySession(sessionId: string): Promise<LinkedinProfile | undefined> {
    for (const profile of this.linkedinProfiles.values()) {
      if (profile.sessionId === sessionId) return profile;
    }
    return undefined;
  }

  async updateLinkedinProfile(id: string, data: Partial<InsertLinkedinProfile>): Promise<LinkedinProfile | undefined> {
    const profile = this.linkedinProfiles.get(id);
    if (!profile) return undefined;
    const updated = { ...profile, ...data, updatedAt: new Date() };
    this.linkedinProfiles.set(id, updated);
    return updated;
  }

  async createInterviewSession(session: InsertInterviewSession): Promise<InterviewSession> {
    const id = uuidv4();
    const newSession: InterviewSession = {
      ...session,
      id,
      createdAt: new Date(),
    } as InterviewSession;
    this.interviewSessions.set(id, newSession);
    return newSession;
  }

  async getInterviewSessionsBySession(sessionId: string): Promise<InterviewSession[]> {
    const sessions: InterviewSession[] = [];
    for (const session of this.interviewSessions.values()) {
      if (session.sessionId === sessionId) sessions.push(session);
    }
    return sessions;
  }

  async createDocument(document: InsertDocument): Promise<Document> {
    const id = uuidv4();
    const newDocument: Document = {
      ...document,
      id,
      createdAt: new Date(),
    } as Document;
    this.documents.set(id, newDocument);
    return newDocument;
  }

  async getDocumentsBySession(sessionId: string): Promise<Document[]> {
    const documents: Document[] = [];
    for (const doc of this.documents.values()) {
      if (doc.sessionId === sessionId) documents.push(doc);
    }
    return documents;
  }

  async getAllJobListings(experienceLevel?: string): Promise<JobListing[]> {
    const jobs: JobListing[] = [];
    for (const job of this.jobListings.values()) {
      if (!experienceLevel || job.experienceLevel === experienceLevel) {
        jobs.push(job);
      }
    }
    return jobs;
  }

  async seedJobListings(): Promise<void> {
    const seedJobs: JobListing[] = [
      {
        id: uuidv4(),
        title: "Junior Frontend Developer",
        company: "Tech Startup",
        location: "Remote",
        description: "Looking for a junior frontend developer with React experience",
        salaryRange: "$60k - $80k",
        experienceLevel: "entry",
        keywords: ["React", "JavaScript", "CSS", "HTML"],
        createdAt: new Date(),
      },
      {
        id: uuidv4(),
        title: "Senior Full-Stack Engineer",
        company: "Fortune 500 Company",
        location: "San Francisco, CA",
        description: "Seeking experienced full-stack engineer for leadership role",
        salaryRange: "$150k - $200k",
        experienceLevel: "senior",
        keywords: ["Node.js", "React", "AWS", "Docker", "Team Leadership"],
        createdAt: new Date(),
      },
      {
        id: uuidv4(),
        title: "Mid-Level Product Manager",
        company: "SaaS Company",
        location: "New York, NY",
        description: "Product manager with 3-5 years experience",
        salaryRange: "$120k - $150k",
        experienceLevel: "mid",
        keywords: ["Product Strategy", "Analytics", "User Research"],
        createdAt: new Date(),
      },
    ];

    for (const job of seedJobs) {
      this.jobListings.set(job.id, job);
    }
  }
}

export const memoryStorage = new MemoryStorage();
// Seed job listings on startup
memoryStorage.seedJobListings();
