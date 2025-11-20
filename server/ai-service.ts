import OpenAI from "openai";

// the newest OpenAI model is "gpt-5" which was released August 7, 2025. do not change this unless explicitly requested by the user
let openai: OpenAI | null = null;

function getOpenAI() {
  if (!openai) {
    openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });
  }
  return openai;
}

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
    const response = await getOpenAI().chat.completions.create({
      model: "gpt-4o",
      messages: [
        {
          role: "system",
          content: `${systemPrompts[pathType]} Analyze the user's experience and provide a comprehensive skill map. Respond with ONLY valid JSON (no markdown, no code blocks) in this exact format: { "technicalSkills": ["skill1", "skill2"], "leadershipSkills": ["skill1", "skill2"], "transferableSkills": ["skill1", "skill2"], "keywords": ["keyword1", "keyword2"], "brandStatement": "A compelling one-sentence summary" }`,
        },
        {
          role: "user",
          content: userInput,
        },
      ],
      temperature: 0.7,
    });

    const content = response.choices[0].message.content?.trim() || "{}";
    const jsonMatch = content.match(/\{[\s\S]*\}/);
    const result = JSON.parse(jsonMatch ? jsonMatch[0] : content);
    return result;
  } catch (error: any) {
    console.error("Skill map generation error:", error);
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
    const response = await getOpenAI().chat.completions.create({
      model: "gpt-4o",
      messages: [
        {
          role: "system",
          content: `${prompts[pathType]} Respond with ONLY valid JSON (no markdown, no code blocks) in this exact format: { "summary": "A professional summary", "experience": [{ "title": "Job Title", "company": "Company Name", "duration": "MM/YYYY - MM/YYYY", "bullets": ["Achievement 1", "Achievement 2"] }], "skills": ["Skill1", "Skill2"] }`,
        },
        {
          role: "user",
          content: `User info: ${JSON.stringify(userInfo)}\nSkill map: ${JSON.stringify(skillMap)}`,
        },
      ],
      temperature: 0.7,
    });

    const content = response.choices[0].message.content?.trim() || "{}";
    const jsonMatch = content.match(/\{[\s\S]*\}/);
    const result = JSON.parse(jsonMatch ? jsonMatch[0] : content);
    return result;
  } catch (error: any) {
    console.error("Resume generation error:", error);
    throw new Error("Failed to generate resume: " + error.message);
  }
}

export async function analyzeAtsMatch(
  resumeContent: any,
  jobDescription: string
): Promise<AtsAnalysisResult> {
  try {
    const response = await getOpenAI().chat.completions.create({
      model: "gpt-4o",
      messages: [
        {
          role: "system",
          content: "You are an ATS (Applicant Tracking System) expert. Analyze how well a resume matches a job description. Provide a match percentage (0-100), identify missing keywords, suggest improvements, and highlight strengths. Respond with ONLY valid JSON (no markdown, no code blocks) in this exact format: { \"matchPercentage\": 85, \"keywordGaps\": [\"Missing keyword 1\"], \"improvements\": [\"Improvement 1\"], \"strengths\": [\"Strength 1\"] }",
        },
        {
          role: "user",
          content: `Resume:\n${JSON.stringify(resumeContent)}\n\nJob Description:\n${jobDescription}`,
        },
      ],
      temperature: 0.7,
    });

    const content = response.choices[0].message.content?.trim() || "{}";
    const jsonMatch = content.match(/\{[\s\S]*\}/);
    const result = JSON.parse(jsonMatch ? jsonMatch[0] : content);
    return result;
  } catch (error: any) {
    console.error("ATS analysis error:", error);
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
    const response = await getOpenAI().chat.completions.create({
      model: "gpt-4o",
      messages: [
        {
          role: "system",
          content: `${prompts[pathType]} Respond with ONLY valid JSON (no markdown, no code blocks) in this exact format: { "headline": "Professional headline", "about": "About section content", "experienceSection": [{ "title": "Role Title", "description": "Role description" }], "skillsList": ["Skill1", "Skill2"] }`,
        },
        {
          role: "user",
          content: `Skill map: ${JSON.stringify(skillMap)}\nResume: ${JSON.stringify(resumeContent)}`,
        },
      ],
      temperature: 0.7,
    });

    const content = response.choices[0].message.content?.trim() || "{}";
    const jsonMatch = content.match(/\{[\s\S]*\}/);
    const result = JSON.parse(jsonMatch ? jsonMatch[0] : content);
    return result;
  } catch (error: any) {
    console.error("LinkedIn profile generation error:", error);
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
    const response = await getOpenAI().chat.completions.create({
      model: "gpt-4o",
      messages: [
        {
          role: "system",
          content: `${prompts[pathType]} Respond with ONLY valid JSON (no markdown, no code blocks) in this exact format: { "overallScore": 8, "strengths": ["Strength 1"], "improvements": ["Improvement 1"], "specificFeedback": "Detailed feedback" }`,
        },
        {
          role: "user",
          content: `Question: ${question}\nAnswer: ${answer}`,
        },
      ],
      temperature: 0.7,
    });

    const content = response.choices[0].message.content?.trim() || "{}";
    const jsonMatch = content.match(/\{[\s\S]*\}/);
    const result = JSON.parse(jsonMatch ? jsonMatch[0] : content);
    return result;
  } catch (error: any) {
    console.error("Interview feedback generation error:", error);
    throw new Error("Failed to generate interview feedback: " + error.message);
  }
}

export async function generateDocument(
  documentType: 'cover_letter' | 'follow_up' | 'thank_you',
  recipientInfo: { company?: string; position?: string; hiringManager?: string },
  userProfile: any,
  pathType: 'college' | 'professional' | 'starter'
): Promise<string> {
  const basePrompts = {
    college: "Write a professional cover letter for a recent graduate. Show enthusiasm and connect academic experiences to the role.",
    professional: "Write an executive-level cover letter that demonstrates strategic thinking and leadership experience.",
    starter: "Write a warm, professional cover letter for someone new to the workforce. Emphasize transferable skills and eagerness to learn.",
  };

  const documentPrompts = {
    cover_letter: basePrompts[pathType],
    follow_up: "Write a professional follow-up email after a job application or interview.",
    thank_you: "Write a thoughtful thank-you note after an interview.",
  };

  try {
    const response = await getOpenAI().chat.completions.create({
      model: "gpt-4o",
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
      temperature: 0.7,
    });

    return response.choices[0].message.content || "";
  } catch (error: any) {
    console.error("Document generation error:", error);
    throw new Error("Failed to generate document: " + error.message);
  }
}
