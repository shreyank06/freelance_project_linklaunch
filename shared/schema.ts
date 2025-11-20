import { sql } from "drizzle-orm";
import { pgTable, text, varchar, jsonb, timestamp, integer, boolean } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

// Users table for authentication
export const users = pgTable("users", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  email: varchar("email", { length: 255 }).notNull().unique(),
  passwordHash: text("password_hash").notNull(),
  fullName: varchar("full_name", { length: 255 }),
  isVerified: boolean("is_verified").default(false),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// User session data
export const userSessions = pgTable("user_sessions", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  userId: varchar("user_id").notNull().references(() => users.id),
  pathType: text("path_type").notNull(), // 'college', 'professional', 'starter'
  currentModule: text("current_module").notNull().default('welcome'),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// Module progress tracking
export const moduleProgress = pgTable("module_progress", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  sessionId: varchar("session_id").notNull().references(() => userSessions.id),
  moduleName: text("module_name").notNull(),
  status: text("status").$type<'locked' | 'in_progress' | 'completed'>().notNull().default('locked'),
  progress: integer("progress").default(0), // 0-100
  startedAt: timestamp("started_at"),
  completedAt: timestamp("completed_at"),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// Skill discovery results
export const skillMaps = pgTable("skill_maps", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  sessionId: varchar("session_id").notNull(),
  pathType: text("path_type").notNull(),
  userInput: text("user_input").notNull(),
  technicalSkills: jsonb("technical_skills").$type<string[]>(),
  leadershipSkills: jsonb("leadership_skills").$type<string[]>(),
  transferableSkills: jsonb("transferable_skills").$type<string[]>(),
  keywords: jsonb("keywords").$type<string[]>(),
  brandStatement: text("brand_statement"),
  createdAt: timestamp("created_at").defaultNow(),
});

// Resume data
export const resumes = pgTable("resumes", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  sessionId: varchar("session_id").notNull(),
  pathType: text("path_type").notNull(),
  content: jsonb("content").$type<{
    name?: string;
    email?: string;
    phone?: string;
    summary?: string;
    experience?: Array<{
      title: string;
      company: string;
      duration: string;
      bullets: string[];
    }>;
    education?: Array<{
      degree: string;
      school: string;
      year: string;
    }>;
    skills?: string[];
  }>(),
  pdfUrl: text("pdf_url"),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// ATS analysis results
export const atsAnalyses = pgTable("ats_analyses", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  sessionId: varchar("session_id").notNull(),
  resumeId: varchar("resume_id"),
  jobDescription: text("job_description").notNull(),
  matchPercentage: integer("match_percentage").notNull(),
  keywordGaps: jsonb("keyword_gaps").$type<string[]>(),
  improvements: jsonb("improvements").$type<string[]>(),
  strengths: jsonb("strengths").$type<string[]>(),
  createdAt: timestamp("created_at").defaultNow(),
});

// LinkedIn profile content
export const linkedinProfiles = pgTable("linkedin_profiles", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  sessionId: varchar("session_id").notNull(),
  pathType: text("path_type").notNull(),
  headline: text("headline"),
  about: text("about"),
  experienceSection: jsonb("experience_section").$type<Array<{
    title: string;
    description: string;
  }>>(),
  skillsList: jsonb("skills_list").$type<string[]>(),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// Interview practice sessions
export const interviewSessions = pgTable("interview_sessions", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  sessionId: varchar("session_id").notNull(),
  pathType: text("path_type").notNull(),
  questions: jsonb("questions").$type<Array<{
    question: string;
    userAnswer?: string;
    feedback?: string;
    score?: number;
  }>>(),
  overallFeedback: text("overall_feedback"),
  createdAt: timestamp("created_at").defaultNow(),
});

// Generated documents (cover letters, etc.)
export const documents = pgTable("documents", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  sessionId: varchar("session_id").notNull(),
  documentType: text("document_type").notNull(), // 'cover_letter', 'follow_up', 'acceptance', 'denial'
  content: text("content").notNull(),
  recipientInfo: jsonb("recipient_info").$type<{
    company?: string;
    position?: string;
    hiringManager?: string;
  }>(),
  createdAt: timestamp("created_at").defaultNow(),
});

// Job listings (simulated for MVP)
export const jobListings = pgTable("job_listings", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  title: text("title").notNull(),
  company: text("company").notNull(),
  location: text("location").notNull(),
  description: text("description").notNull(),
  salaryRange: text("salary_range"),
  experienceLevel: text("experience_level").notNull(), // 'entry', 'mid', 'senior'
  keywords: jsonb("keywords").$type<string[]>(),
  createdAt: timestamp("created_at").defaultNow(),
});

// Insert schemas
export const insertUserSchema = createInsertSchema(users).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

export const insertUserSessionSchema = createInsertSchema(userSessions).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

export const insertModuleProgressSchema = createInsertSchema(moduleProgress).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

export const insertSkillMapSchema = createInsertSchema(skillMaps).omit({
  id: true,
  createdAt: true,
});

export const insertResumeSchema = createInsertSchema(resumes).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

export const insertAtsAnalysisSchema = createInsertSchema(atsAnalyses).omit({
  id: true,
  createdAt: true,
});

export const insertLinkedinProfileSchema = createInsertSchema(linkedinProfiles).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

export const insertInterviewSessionSchema = createInsertSchema(interviewSessions).omit({
  id: true,
  createdAt: true,
});

export const insertDocumentSchema = createInsertSchema(documents).omit({
  id: true,
  createdAt: true,
});

export const insertJobListingSchema = createInsertSchema(jobListings).omit({
  id: true,
  createdAt: true,
});

// Types
export type User = typeof users.$inferSelect;
export type InsertUser = z.infer<typeof insertUserSchema>;

export type UserSession = typeof userSessions.$inferSelect;
export type InsertUserSession = z.infer<typeof insertUserSessionSchema>;

export type ModuleProgress = typeof moduleProgress.$inferSelect;
export type InsertModuleProgress = z.infer<typeof insertModuleProgressSchema>;

export type SkillMap = typeof skillMaps.$inferSelect;
export type InsertSkillMap = z.infer<typeof insertSkillMapSchema>;

export type Resume = typeof resumes.$inferSelect;
export type InsertResume = z.infer<typeof insertResumeSchema>;

export type AtsAnalysis = typeof atsAnalyses.$inferSelect;
export type InsertAtsAnalysis = z.infer<typeof insertAtsAnalysisSchema>;

export type LinkedinProfile = typeof linkedinProfiles.$inferSelect;
export type InsertLinkedinProfile = z.infer<typeof insertLinkedinProfileSchema>;

export type InterviewSession = typeof interviewSessions.$inferSelect;
export type InsertInterviewSession = z.infer<typeof insertInterviewSessionSchema>;

export type Document = typeof documents.$inferSelect;
export type InsertDocument = z.infer<typeof insertDocumentSchema>;

export type JobListing = typeof jobListings.$inferSelect;
export type InsertJobListing = z.infer<typeof insertJobListingSchema>;

// Path type enum for type safety
export type PathType = 'college' | 'professional' | 'starter';

// Module progression enum
export type ModuleType = 
  | 'welcome'
  | 'job-listings'
  | 'skill-discovery'
  | 'resume-builder'
  | 'ats-optimization'
  | 'linkedin-optimizer'
  | 'interview-coach'
  | 'document-writer';
