import { useMutation, useQuery } from "@tanstack/react-query";
import { apiRequest, queryClient } from "./queryClient";
import type {
  UserSession,
  SkillMap,
  Resume,
  AtsAnalysis,
  LinkedinProfile,
  InterviewSession,
  Document,
  JobListing,
  PathType,
} from "@shared/schema";

// Session hooks
export function useCreateSession() {
  return useMutation({
    mutationFn: async (pathType: PathType) => {
      return await apiRequest<UserSession>("POST", "/api/sessions", { pathType });
    },
    onError: (error: any) => {
      console.error("Create session error:", error);
    },
  });
}

// Job listings hooks
export function useJobListings(experienceLevel?: string) {
  return useQuery<JobListing[]>({
    queryKey: ["/api/jobs", experienceLevel],
    enabled: true,
  });
}

// Skill map hooks
export function useCreateSkillMap() {
  return useMutation({
    mutationFn: async (data: { sessionId: string; userInput: string; pathType: PathType }) => {
      return await apiRequest<SkillMap>("POST", "/api/skill-map", data);
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ["/api/skill-map", variables.sessionId] });
    },
  });
}

export function useSkillMap(sessionId: string | null) {
  return useQuery<SkillMap>({
    queryKey: ["/api/skill-map", sessionId],
    enabled: !!sessionId,
  });
}

// Resume hooks
export function useCreateResume() {
  return useMutation({
    mutationFn: async (data: {
      sessionId: string;
      pathType: PathType;
      userInfo: any;
      skillMapId?: string;
    }) => {
      return await apiRequest<Resume>("POST", "/api/resume", data);
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ["/api/resume", variables.sessionId] });
    },
  });
}

export function useResume(sessionId: string | null) {
  return useQuery<Resume>({
    queryKey: ["/api/resume", sessionId],
    enabled: !!sessionId,
  });
}

// ATS analysis hooks
export function useCreateAtsAnalysis() {
  return useMutation({
    mutationFn: async (data: {
      sessionId: string;
      resumeId?: string;
      jobDescription: string;
    }) => {
      return await apiRequest<AtsAnalysis>("POST", "/api/ats-analysis", data);
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ["/api/ats-analysis", variables.sessionId] });
    },
  });
}

export function useAtsAnalyses(sessionId: string | null) {
  return useQuery<AtsAnalysis[]>({
    queryKey: ["/api/ats-analysis", sessionId],
    enabled: !!sessionId,
  });
}

// LinkedIn profile hooks
export function useCreateLinkedInProfile() {
  return useMutation({
    mutationFn: async (data: { sessionId: string; pathType: PathType }) => {
      return await apiRequest<LinkedinProfile>("POST", "/api/linkedin-profile", data);
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({
        queryKey: ["/api/linkedin-profile", variables.sessionId],
      });
    },
  });
}

export function useLinkedInProfile(sessionId: string | null) {
  return useQuery<LinkedinProfile>({
    queryKey: ["/api/linkedin-profile", sessionId],
    enabled: !!sessionId,
  });
}

// Interview feedback hooks
export function useCreateInterviewFeedback() {
  return useMutation({
    mutationFn: async (data: {
      sessionId: string;
      pathType: PathType;
      question: string;
      answer: string;
    }) => {
      return await apiRequest<{
        session: InterviewSession;
        feedback: {
          overallScore: number;
          strengths: string[];
          improvements: string[];
          specificFeedback: string;
        };
      }>("POST", "/api/interview-feedback", data);
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({
        queryKey: ["/api/interview-sessions", variables.sessionId],
      });
    },
  });
}

export function useInterviewSessions(sessionId: string | null) {
  return useQuery<InterviewSession[]>({
    queryKey: ["/api/interview-sessions", sessionId],
    enabled: !!sessionId,
  });
}

// Document generation hooks
export function useCreateDocument() {
  return useMutation({
    mutationFn: async (data: {
      sessionId: string;
      documentType: "cover_letter" | "follow_up" | "thank_you";
      recipientInfo: { company?: string; position?: string; hiringManager?: string };
      pathType: PathType;
    }) => {
      return await apiRequest<Document>("POST", "/api/document", data);
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ["/api/documents", variables.sessionId] });
    },
  });
}

export function useDocuments(sessionId: string | null) {
  return useQuery<Document[]>({
    queryKey: ["/api/documents", sessionId],
    enabled: !!sessionId,
  });
}
