import OpenAI from "openai";

// the newest OpenAI model is "gpt-5" which was released August 7, 2025. do not change this unless explicitly requested by the user
const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

export interface SkillMapResult {
  technicalSkills: string[];
  leadershipSkills: string[];
  transferableSkills: string[];
  keywords: string[];
  brandStatement: string;
}

export interface ResumeContent {
  summary: string;
  experience: Array<{
    title: string;
    company: string;
    duration: string;
    bullets: string[];
  }>;
  skills: string[];
}

export interface AtsAnalysisResult {
  matchPercentage: number;
  keywordGaps: string[];
  improvements: string[];
  strengths: string[];
}

export interface LinkedInContent {
  headline: string;
  about: string;
  experienceSection: Array<{
    title: string;
    description: string;
  }>;
  skillsList: string[];
}

export interface InterviewFeedback {
  overallScore: number;
  strengths: string[];
  improvements: string[];
  specificFeedback: string;
}

export async function generateSkillMap(
  userInput: string,
  pathType: 'college' | 'professional' | 'starter'
): Promise<SkillMapResult> {
  const systemPrompts = {
    college: "You are a career coach helping recent college graduates identify their skills from academic projects, internships, and campus activities. Focus on translating educational experiences into professional competencies.",
    professional: "You are an executive career coach helping experienced professionals articulate their leadership impact and quantifiable achievements. Focus on strategic thinking, team leadership, and business results.",
    starter: "You are a supportive career coach helping newcomers identify transferable skills from life experiences, volunteer work, and personal projects. Focus on building confidence and finding hidden strengths.",
  };

  try {
    const response = await openai.chat.completions.create({
      model: "gpt-5",
      messages: [
        {
          role: "system",
          content: `${systemPrompts[pathType]} Analyze the user's experience and provide a comprehensive skill map. Respond with JSON in this format: { "technicalSkills": string[], "leadershipSkills": string[], "transferableSkills": string[], "keywords": string[], "brandStatement": string }`,
        },
        {
          role: "user",
          content: userInput,
        },
      ],
      response_format: { type: "json_object" },
      max_completion_tokens: 2048,
    });

    const result = JSON.parse(response.choices[0].message.content || "{}");
    return result;
  } catch (error: any) {
    throw new Error("Failed to generate skill map: " + error.message);
  }
}

export async function generateResume(
  skillMap: SkillMapResult,
  userInfo: any,
  pathType: 'college' | 'professional' | 'starter'
): Promise<ResumeContent> {
  const prompts = {
    college: "Create an ATS-friendly resume for a recent graduate. Focus on academic achievements, projects, and internships. Use strong action verbs and quantify achievements where possible.",
    professional: "Create an executive-level resume emphasizing leadership, strategic impact, and quantifiable business results. Use metrics and senior-level language.",
    starter: "Create a beginner-friendly resume that presents volunteer work, training, and life experiences professionally. Focus on transferable skills and enthusiasm.",
  };

  try {
    const response = await openai.chat.completions.create({
      model: "gpt-5",
      messages: [
        {
          role: "system",
          content: `${prompts[pathType]} Respond with JSON in this format: { "summary": string, "experience": [{ "title": string, "company": string, "duration": string, "bullets": string[] }], "skills": string[] }`,
        },
        {
          role: "user",
          content: `User info: ${JSON.stringify(userInfo)}\nSkill map: ${JSON.stringify(skillMap)}`,
        },
      ],
      response_format: { type: "json_object" },
      max_completion_tokens: 3000,
    });

    const result = JSON.parse(response.choices[0].message.content || "{}");
    return result;
  } catch (error: any) {
    throw new Error("Failed to generate resume: " + error.message);
  }
}

export async function analyzeAtsMatch(
  resumeContent: any,
  jobDescription: string
): Promise<AtsAnalysisResult> {
  try {
    const response = await openai.chat.completions.create({
      model: "gpt-5",
      messages: [
        {
          role: "system",
          content: "You are an ATS (Applicant Tracking System) expert. Analyze how well a resume matches a job description. Provide a match percentage (0-100), identify missing keywords, suggest improvements, and highlight strengths. Respond with JSON in this format: { \"matchPercentage\": number, \"keywordGaps\": string[], \"improvements\": string[], \"strengths\": string[] }",
        },
        {
          role: "user",
          content: `Resume:\n${JSON.stringify(resumeContent)}\n\nJob Description:\n${jobDescription}`,
        },
      ],
      response_format: { type: "json_object" },
      max_completion_tokens: 2048,
    });

    const result = JSON.parse(response.choices[0].message.content || "{}");
    return result;
  } catch (error: any) {
    throw new Error("Failed to analyze ATS match: " + error.message);
  }
}

export async function generateLinkedInProfile(
  skillMap: SkillMapResult,
  resumeContent: any,
  pathType: 'college' | 'professional' | 'starter'
): Promise<LinkedInContent> {
  const prompts = {
    college: "Create a LinkedIn profile for a recent graduate. Use professional but approachable language. Translate student experiences into impact language.",
    professional: "Create an executive LinkedIn profile that positions the candidate as an industry authority. Use strategic language and emphasize leadership.",
    starter: "Create a friendly, encouraging LinkedIn profile for someone new to the professional world. Focus on potential and transferable skills.",
  };

  try {
    const response = await openai.chat.completions.create({
      model: "gpt-5",
      messages: [
        {
          role: "system",
          content: `${prompts[pathType]} Respond with JSON in this format: { "headline": string, "about": string, "experienceSection": [{ "title": string, "description": string }], "skillsList": string[] }`,
        },
        {
          role: "user",
          content: `Skill map: ${JSON.stringify(skillMap)}\nResume: ${JSON.stringify(resumeContent)}`,
        },
      ],
      response_format: { type: "json_object" },
      max_completion_tokens: 3000,
    });

    const result = JSON.parse(response.choices[0].message.content || "{}");
    return result;
  } catch (error: any) {
    throw new Error("Failed to generate LinkedIn profile: " + error.message);
  }
}

export async function generateInterviewFeedback(
  question: string,
  answer: string,
  pathType: 'college' | 'professional' | 'starter'
): Promise<InterviewFeedback> {
  const prompts = {
    college: "Evaluate this interview answer from a recent graduate using the STAR method. Provide encouraging but constructive feedback.",
    professional: "Evaluate this executive-level interview answer. Focus on strategic thinking, leadership demonstration, and business impact.",
    starter: "Evaluate this beginner interview answer. Be supportive and encouraging while providing helpful tips for improvement.",
  };

  try {
    const response = await openai.chat.completions.create({
      model: "gpt-5",
      messages: [
        {
          role: "system",
          content: `${prompts[pathType]} Respond with JSON in this format: { "overallScore": number (1-10), "strengths": string[], "improvements": string[], "specificFeedback": string }`,
        },
        {
          role: "user",
          content: `Question: ${question}\nAnswer: ${answer}`,
        },
      ],
      response_format: { type: "json_object" },
      max_completion_tokens: 2048,
    });

    const result = JSON.parse(response.choices[0].message.content || "{}");
    return result;
  } catch (error: any) {
    throw new Error("Failed to generate interview feedback: " + error.message);
  }
}

export async function generateDocument(
  documentType: 'cover_letter' | 'follow_up' | 'thank_you',
  recipientInfo: { company?: string; position?: string; hiringManager?: string },
  userProfile: any,
  pathType: 'college' | 'professional' | 'starter'
): Promise<string> {
  const prompts = {
    college: "Write a professional cover letter for a recent graduate. Show enthusiasm and connect academic experiences to the role.",
    professional: "Write an executive-level cover letter that demonstrates strategic thinking and leadership experience.",
    starter: "Write a warm, professional cover letter for someone new to the workforce. Emphasize transferable skills and eagerness to learn.",
  };

  const documentPrompts = {
    cover_letter: prompts[pathType],
    follow_up: "Write a professional follow-up email after a job application or interview.",
    thank_you: "Write a thoughtful thank-you note after an interview.",
  };

  try {
    const response = await openai.chat.completions.create({
      model: "gpt-5",
      messages: [
        {
          role: "system",
          content: documentPrompts[documentType],
        },
        {
          role: "user",
          content: `Recipient: ${JSON.stringify(recipientInfo)}\nUser profile: ${JSON.stringify(userProfile)}`,
        },
      ],
      max_completion_tokens: 2048,
    });

    return response.choices[0].message.content || "";
  } catch (error: any) {
    throw new Error("Failed to generate document: " + error.message);
  }
}
