import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ProgressTracker } from "@/components/shared/progress-tracker";
import { AiChatBubble } from "@/components/shared/ai-chat-bubble";
import { ModuleHeader } from "@/components/shared/module-header";
import { SkillTagCloud } from "@/components/shared/skill-tag-cloud";
import { AtsScoreDisplay } from "@/components/shared/ats-score-display";
import { ArrowRight, Download, Copy, Check, FileText, Target, MessageSquare, Loader, Upload, X, Briefcase, MapPin, DollarSign, ExternalLink } from "lucide-react";
import type { ModuleType, SkillMap, Resume } from "@shared/schema";
import { useCreateSkillMap, useCreateResume } from "@/lib/api-hooks";
import { useSession } from "@/contexts/session-context";
import collegeHeroImage from "@assets/generated_images/College_graduates_celebrating_success_873a23d4.png";

const PATH_COLOR = "hsl(217 91% 50%)";

export default function CollegeGradPath() {
  const { sessionId } = useSession();
  const [currentModule, setCurrentModule] = useState<ModuleType>('welcome');
  const [userInput, setUserInput] = useState("");
  const [copiedSections, setCopiedSections] = useState<Set<string>>(new Set());
  const [skillMap, setSkillMap] = useState<SkillMap | null>(null);
  const [resume, setResume] = useState<Resume | null>(null);
  const [resumeFormData, setResumeFormData] = useState({ fullName: "", email: "", phone: "", location: "" });
  const [professionalSummary, setProfessionalSummary] = useState("");
  const [existingResume, setExistingResume] = useState("");
  const [resumeFile, setResumeFile] = useState<File | null>(null);
  const [resumeStep, setResumeStep] = useState<"input" | "form">("input");

  // Job search state
  const [jobKeyword, setJobKeyword] = useState("");
  const [jobLocation, setJobLocation] = useState("");
  const [jobSalaryMin, setJobSalaryMin] = useState("");
  const [jobType, setJobType] = useState("");
  const [searchResults, setSearchResults] = useState<any[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [searchError, setSearchError] = useState("");

  const createSkillMap = useCreateSkillMap();
  const createResume = useCreateResume();

  const handleGenerateSkillMap = async () => {
    if (!userInput.trim() || !sessionId) return;
    try {
      const result = await createSkillMap.mutateAsync({
        sessionId,
        userInput,
        pathType: 'college',
      });
      setSkillMap(result);
      setProfessionalSummary(result.brandStatement || "");
    } catch (error) {
      console.error("Failed to generate skill map:", error);
    }
  };

  const handleGenerateResume = async () => {
    if (!sessionId) return;
    try {
      const result = await createResume.mutateAsync({
        sessionId,
        pathType: 'college',
        userInfo: { ...resumeFormData, professionalSummary, existingResume },
        skillMapId: skillMap?.id,
      });
      setResume(result);
      setResumeStep("input");
    } catch (error) {
      console.error("Failed to generate resume:", error);
    }
  };

  const handleSearchJobs = async () => {
    if (!jobKeyword.trim() || !jobLocation.trim()) {
      setSearchError("Please enter job title and location");
      return;
    }

    setIsSearching(true);
    setSearchError("");
    setSearchResults([]);

    try {
      const response = await fetch("/api/jobs/jooble-search", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          keyword: jobKeyword,
          location: jobLocation,
          salary_min: jobSalaryMin || undefined,
          job_type: jobType || undefined,
        }),
      });

      if (!response.ok) {
        const error = await response.json();
        setSearchError(error.message || "Failed to search jobs");
        return;
      }

      const data = await response.json();
      setSearchResults(data.jobs || []);
    } catch (error) {
      setSearchError("Error searching jobs. Please try again.");
      console.error("Job search error:", error);
    } finally {
      setIsSearching(false);
    }
  };

  const modules = [
    { id: 'welcome' as ModuleType, title: 'Welcome', completed: false, active: currentModule === 'welcome' },
    { id: 'skill-discovery' as ModuleType, title: 'Skill Discovery & Career Mapping', completed: false, active: currentModule === 'skill-discovery' },
    { id: 'resume-builder' as ModuleType, title: 'Smart Resume Builder', completed: false, active: currentModule === 'resume-builder' },
    { id: 'ats-optimization' as ModuleType, title: 'ATS Insight & Optimization', completed: false, active: currentModule === 'ats-optimization' },
    { id: 'linkedin-optimizer' as ModuleType, title: 'LinkedIn Profile Optimizer', completed: false, active: currentModule === 'linkedin-optimizer' },
    { id: 'interview-coach' as ModuleType, title: 'Interview Coach', completed: false, active: currentModule === 'interview-coach' },
    { id: 'document-writer' as ModuleType, title: 'AI Document Writer', completed: false, active: currentModule === 'document-writer' },
    { id: 'job-search' as ModuleType, title: 'Job Search & Apply', completed: false, active: currentModule === 'job-search' },
  ];

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    // Validate file type
    const validTypes = ['application/pdf', 'image/jpeg', 'image/jpg', 'image/png'];
    if (!validTypes.includes(file.type)) {
      alert('Please upload a PDF, JPG, or PNG file');
      return;
    }

    // Validate file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      alert('File size must be less than 5MB');
      return;
    }

    setResumeFile(file);
  };

  const handleCopy = (section: string, text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedSections(prev => new Set(prev).add(section));
    setTimeout(() => {
      setCopiedSections(prev => {
        const newSet = new Set(prev);
        newSet.delete(section);
        return newSet;
      });
    }, 2000);
  };

  return (
    <div className="min-h-screen bg-background">
      <ModuleHeader
        title="College Graduate Path"
        description="Transform your education, internships, and campus projects into recruiter-ready content"
        pathColor={PATH_COLOR}
      />

      <div className="container max-w-7xl mx-auto px-6 py-8">
        <div className="grid lg:grid-cols-[300px_1fr] gap-8">
          {/* Sidebar - Progress Tracker */}
          <aside className="lg:sticky lg:top-24 h-fit">
            <Card className="p-6">
              <ProgressTracker modules={modules} pathColor={PATH_COLOR} />
            </Card>
          </aside>

          {/* Main Content */}
          <main className="space-y-8">
            {/* Welcome Module */}
            {currentModule === 'welcome' && (
              <div className="space-y-6">
                <div 
                  className="relative h-64 rounded-2xl overflow-hidden bg-cover bg-center"
                  style={{ backgroundImage: `url(${collegeHeroImage})` }}
                >
                  <div className="absolute inset-0 bg-gradient-to-b from-black/50 to-black/70 flex items-center justify-center">
                    <div className="text-center text-white px-6">
                      <h2 className="font-accent text-4xl font-bold mb-4">
                        You've got the degree. Let's help recruiters see your potential.
                      </h2>
                    </div>
                  </div>
                </div>

                <Card className="p-8">
                  <h3 className="font-accent text-2xl font-semibold mb-4">Welcome to Your Career Launch</h3>
                  <p className="text-muted-foreground mb-6">
                    As a recent graduate, you have valuable skills and experiences that employers are looking for. 
                    Our AI will help you identify, articulate, and showcase these strengths in ways that resonate with recruiters.
                  </p>
                  
                  <div className="grid md:grid-cols-3 gap-4 mb-8">
                    {[
                      { icon: Target, title: "Skill Discovery", desc: "Map your academic achievements to market skills" },
                      { icon: FileText, title: "Resume Building", desc: "Create ATS-optimized resumes that get noticed" },
                      { icon: MessageSquare, title: "Interview Prep", desc: "Practice with AI and master the STAR method" },
                    ].map((feature, i) => (
                      <div key={i} className="text-center p-4 rounded-lg bg-accent/50">
                        <feature.icon className="h-8 w-8 mx-auto mb-2" style={{ color: PATH_COLOR }} />
                        <h4 className="font-semibold mb-1">{feature.title}</h4>
                        <p className="text-sm text-muted-foreground">{feature.desc}</p>
                      </div>
                    ))}
                  </div>

                  <Button
                    onClick={() => setCurrentModule('skill-discovery')}
                    className="w-full"
                    style={{ backgroundColor: PATH_COLOR }}
                    data-testid="button-start-skill-discovery"
                  >
                    Start Skill Discovery
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                </Card>
              </div>
            )}


            {/* Skill Discovery Module */}
            {currentModule === 'skill-discovery' && (
              <div className="space-y-6">
                <AiChatBubble message="What class projects or achievements are you most proud of? Tell me about your internships, research, or campus activities." />

                <Card className="p-6">
                  <Label htmlFor="achievements" className="text-base font-semibold mb-2">Your Achievements</Label>
                  <Textarea
                    id="achievements"
                    placeholder="Example: Led a team of 4 students to build a mobile app that won our university's hackathon. Managed project timeline and conducted user testing with 50+ students..."
                    className="min-h-32 mb-4"
                    value={userInput}
                    onChange={(e) => setUserInput(e.target.value)}
                    data-testid="input-achievements"
                  />
                  <Button
                    className="w-full"
                    style={{ backgroundColor: PATH_COLOR }}
                    data-testid="button-generate-skills"
                    onClick={handleGenerateSkillMap}
                    disabled={createSkillMap.isPending || !userInput.trim()}
                  >
                    {createSkillMap.isPending ? (
                      <>
                        <Loader className="mr-2 h-4 w-4 animate-spin" />
                        Generating...
                      </>
                    ) : (
                      "Generate My Skill Map"
                    )}
                  </Button>
                </Card>

                {/* AI Generated Skills */}
                {skillMap && (
                  <Card className="p-6">
                    <h3 className="font-accent text-xl font-semibold mb-4">Your Skill Map</h3>

                    <div className="space-y-6">
                      {Array.isArray(skillMap.technicalSkills) && skillMap.technicalSkills.length > 0 && (
                        <div>
                          <h4 className="font-semibold mb-3">Technical Skills</h4>
                          <SkillTagCloud
                            skills={skillMap.technicalSkills}
                            highlightedSkills={skillMap.technicalSkills.slice(0, 3)}
                            pathColor={PATH_COLOR}
                          />
                        </div>
                      )}

                      {Array.isArray(skillMap.leadershipSkills) && skillMap.leadershipSkills.length > 0 && (
                        <div>
                          <h4 className="font-semibold mb-3">Leadership & Soft Skills</h4>
                          <SkillTagCloud
                            skills={skillMap.leadershipSkills}
                            highlightedSkills={skillMap.leadershipSkills.slice(0, 2)}
                            pathColor={PATH_COLOR}
                          />
                        </div>
                      )}

                      {skillMap.brandStatement && (
                        <div className="p-4 bg-accent rounded-lg">
                          <h4 className="font-semibold mb-2">Personal Brand Statement</h4>
                          <p className="text-sm italic">{skillMap.brandStatement}</p>
                        </div>
                      )}

                      {Array.isArray(skillMap.keywords) && skillMap.keywords.length > 0 && (
                        <div className="p-4 border border-accent rounded-lg">
                          <h4 className="font-semibold mb-2">ATS Keywords</h4>
                          <SkillTagCloud
                            skills={skillMap.keywords}
                            pathColor={PATH_COLOR}
                          />
                        </div>
                      )}
                    </div>
                  </Card>
                )}

                {skillMap && (
                  <div className="flex justify-end">
                    <Button
                      onClick={() => setCurrentModule('resume-builder')}
                      style={{ backgroundColor: PATH_COLOR }}
                      data-testid="button-build-resume"
                    >
                      Build My Resume with My AI Coach
                      <ArrowRight className="ml-2 h-4 w-4" />
                    </Button>
                  </div>
                )}
              </div>
            )}

            {/* Resume Builder Module */}
            {currentModule === 'resume-builder' && (
              <div className="space-y-6">
                {resumeStep === "input" && (
                  <>
                    <AiChatBubble message="Do you have an existing resume? Upload your PDF or image file and I'll analyze if it's ATS-friendly and optimize it accordingly. If not, I can generate a new one for you." />

                    <Card className="p-6">
                      <h3 className="font-accent text-xl font-semibold mb-6">Do You Have an Existing Resume?</h3>

                      <div className="mb-6">
                        <Label className="text-base font-semibold mb-3 block">Upload Your Resume (Optional)</Label>
                        <div className="border-2 border-dashed rounded-lg p-6 text-center hover:bg-accent/30 transition-colors">
                          <input
                            type="file"
                            id="resume-upload"
                            accept=".pdf,.jpg,.jpeg,.png"
                            onChange={handleFileUpload}
                            className="hidden"
                            data-testid="input-resume-file"
                          />
                          <label htmlFor="resume-upload" className="cursor-pointer flex flex-col items-center gap-2">
                            <Upload className="h-8 w-8 text-muted-foreground" />
                            <span className="font-semibold">Click to upload or drag and drop</span>
                            <span className="text-sm text-muted-foreground">PDF, JPG, or PNG (Max 5MB)</span>
                          </label>
                        </div>

                        {resumeFile && (
                          <div className="mt-4 p-3 bg-green-50 border border-green-200 rounded-lg flex items-center justify-between">
                            <div className="flex items-center gap-2">
                              <FileText className="h-5 w-5 text-green-600" />
                              <span className="text-sm font-medium text-green-700">{resumeFile.name}</span>
                            </div>
                            <button
                              onClick={() => setResumeFile(null)}
                              className="text-green-600 hover:text-green-700"
                              data-testid="button-remove-resume"
                            >
                              <X className="h-5 w-5" />
                            </button>
                          </div>
                        )}
                      </div>

                      <div className="flex gap-3">
                        <Button
                          className="flex-1"
                          style={{ backgroundColor: PATH_COLOR }}
                          onClick={() => setResumeStep("form")}
                          data-testid="button-proceed-resume"
                        >
                          {resumeFile ? "Analyze & Optimize Resume" : "Generate New Resume"}
                          <ArrowRight className="ml-2 h-4 w-4" />
                        </Button>
                      </div>
                    </Card>
                  </>
                )}

                {resumeStep === "form" && (
                  <>
                    <AiChatBubble message={existingResume.trim() ? "Let me verify your basic information and then I'll analyze your resume for ATS compatibility." : "Great! I'll create an ATS-friendly resume. Let's start with your basic information."} />

                    <Card className="p-6">
                      <h3 className="font-accent text-xl font-semibold mb-6">Resume Information</h3>

                      <div className="grid md:grid-cols-2 gap-4 mb-6">
                    <div>
                      <Label htmlFor="name">Full Name</Label>
                      <Input
                        id="name"
                        placeholder="John Doe"
                        value={resumeFormData.fullName}
                        onChange={(e) => setResumeFormData({...resumeFormData, fullName: e.target.value})}
                        data-testid="input-name"
                      />
                    </div>
                    <div>
                      <Label htmlFor="email">Email</Label>
                      <Input
                        id="email"
                        type="email"
                        placeholder="john@example.com"
                        value={resumeFormData.email}
                        onChange={(e) => setResumeFormData({...resumeFormData, email: e.target.value})}
                        data-testid="input-email"
                      />
                    </div>
                    <div>
                      <Label htmlFor="phone">Phone</Label>
                      <Input
                        id="phone"
                        placeholder="(555) 123-4567"
                        value={resumeFormData.phone}
                        onChange={(e) => setResumeFormData({...resumeFormData, phone: e.target.value})}
                        data-testid="input-phone"
                      />
                    </div>
                    <div>
                      <Label htmlFor="location">Location</Label>
                      <Input
                        id="location"
                        placeholder="San Francisco, CA"
                        value={resumeFormData.location}
                        onChange={(e) => setResumeFormData({...resumeFormData, location: e.target.value})}
                        data-testid="input-location"
                      />
                    </div>
                  </div>

                  <div className="mb-6">
                    <Label>Professional Summary</Label>
                    <Textarea
                      className="min-h-24"
                      placeholder="AI will generate this based on your skill map..."
                      value={professionalSummary}
                      onChange={(e) => setProfessionalSummary(e.target.value)}
                      data-testid="input-summary"
                    />
                  </div>

                  <Button
                    className="w-full"
                    style={{ backgroundColor: PATH_COLOR }}
                    data-testid="button-generate-resume"
                    onClick={handleGenerateResume}
                    disabled={createResume.isPending || !resumeFormData.fullName.trim() || !resumeFormData.email.trim()}
                  >
                    {createResume.isPending ? (
                      <>
                        <Loader className="mr-2 h-4 w-4 animate-spin" />
                        Generating Resume...
                      </>
                    ) : (
                      <>
                        <Download className="mr-2 h-4 w-4" />
                        Generate Resume
                      </>
                    )}
                  </Button>
                </Card>
                  </>
                )}

                {resume && (
                  <Card className="p-6">
                    <h3 className="font-accent text-xl font-semibold mb-4">Your Generated Resume</h3>

                    <div className="space-y-4 mb-6">
                      <div>
                        <h4 className="font-semibold text-lg">{resume.content?.summary}</h4>
                      </div>

                      {Array.isArray(resume.content?.experience) && resume.content.experience.length > 0 && (
                        <div>
                          <h4 className="font-semibold mb-3">Experience</h4>
                          {resume.content.experience.map((exp: any, i: number) => (
                            <div key={i} className="mb-4 pb-4 border-b last:border-b-0">
                              <div className="flex justify-between">
                                <h5 className="font-semibold">{exp.title}</h5>
                                <span className="text-sm text-muted-foreground">{exp.duration}</span>
                              </div>
                              <p className="text-sm text-muted-foreground mb-2">{exp.company}</p>
                              <ul className="text-sm space-y-1 ml-4">
                                {Array.isArray(exp.bullets) && exp.bullets.map((bullet: string, j: number) => (
                                  <li key={j}>• {bullet}</li>
                                ))}
                              </ul>
                            </div>
                          ))}
                        </div>
                      )}

                      {Array.isArray(resume.content?.skills) && resume.content.skills.length > 0 && (
                        <div>
                          <h4 className="font-semibold mb-3">Skills</h4>
                          <SkillTagCloud
                            skills={resume.content.skills}
                            pathColor={PATH_COLOR}
                          />
                        </div>
                      )}
                    </div>

                    <div className="p-4 bg-accent/30 rounded-lg mb-6">
                      <p className="text-sm text-muted-foreground">
                        💡 You can now download this resume as PDF or DOCX from the buttons below, or continue to optimize it with ATS scanning.
                      </p>
                    </div>
                  </Card>
                )}

                {resume && (
                  <div className="flex justify-end gap-4">
                    <Button
                      variant="outline"
                      onClick={() => setCurrentModule('ats-optimization')}
                      data-testid="button-run-ats-scan"
                    >
                      Run ATS Scan
                      <ArrowRight className="ml-2 h-4 w-4" />
                    </Button>
                  </div>
                )}
              </div>
            )}

            {/* ATS Optimization Module */}
            {currentModule === 'ats-optimization' && (
              <div className="space-y-6">
                <AiChatBubble message="Here's how your resume matches your dream job. I'll show you the match percentage, keyword gaps, and specific improvements you can make." />

                <Card className="p-8">
                  <div className="flex flex-col md:flex-row items-center gap-8 mb-8">
                    <div className="flex-shrink-0">
                      <AtsScoreDisplay percentage={78} size="lg" />
                    </div>
                    <div className="flex-1 text-center md:text-left">
                      <h3 className="font-accent text-2xl font-semibold mb-2">Good Match!</h3>
                      <p className="text-muted-foreground">
                        Your resume has a strong foundation. Let's optimize it to reach 90%+ match rate.
                      </p>
                    </div>
                  </div>

                  <div className="grid md:grid-cols-2 gap-6">
                    <div>
                      <h4 className="font-semibold mb-3 flex items-center gap-2">
                        <span className="h-2 w-2 rounded-full bg-destructive"></span>
                        Missing Keywords
                      </h4>
                      <div className="space-y-2">
                        {["Agile methodology", "CI/CD", "RESTful APIs", "Cloud platforms"].map((keyword, i) => (
                          <div key={i} className="text-sm p-2 bg-destructive/10 rounded border-l-2 border-destructive">
                            {keyword}
                          </div>
                        ))}
                      </div>
                    </div>

                    <div>
                      <h4 className="font-semibold mb-3 flex items-center gap-2">
                        <span className="h-2 w-2 rounded-full bg-path-professional"></span>
                        Strengths
                      </h4>
                      <div className="space-y-2">
                        {["Team collaboration", "Full-stack development", "Problem solving", "JavaScript expertise"].map((strength, i) => (
                          <div key={i} className="text-sm p-2 bg-path-professional/10 rounded border-l-2 border-path-professional">
                            {strength}
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </Card>

                <div className="flex justify-end">
                  <Button 
                    onClick={() => setCurrentModule('linkedin-optimizer')}
                    style={{ backgroundColor: PATH_COLOR }}
                    data-testid="button-polish-linkedin"
                  >
                    Polish My LinkedIn Profile
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                </div>
              </div>
            )}

            {/* LinkedIn Optimizer Module */}
            {currentModule === 'linkedin-optimizer' && (
              <div className="space-y-6">
                <AiChatBubble message="I'll help you create a compelling LinkedIn profile that translates your student work into impact language. You can copy and paste these sections directly into LinkedIn." />

                <Card className="p-6">
                  <h3 className="font-accent text-xl font-semibold mb-6">LinkedIn Profile Optimizer</h3>

                  <div className="space-y-6">
                    {[
                      {
                        title: "Headline",
                        content: "Computer Science Graduate | Full-Stack Developer | Passionate About Building User-Centered Solutions"
                      },
                      {
                        title: "About Section",
                        content: "I'm a recent computer science graduate with a passion for creating elegant solutions to complex problems. Through my coursework and hands-on projects, I've developed expertise in full-stack development, with a particular focus on React and Python.\n\nHighlights:\n• Led a team of 4 to build an award-winning mobile app\n• Completed 3 internships in software development\n• Active contributor to open-source projects\n\nI'm excited to bring my technical skills and collaborative mindset to a dynamic development team."
                      },
                    ].map((section, i) => (
                      <div key={i} className="border rounded-lg p-4">
                        <div className="flex items-center justify-between mb-3">
                          <h4 className="font-semibold">{section.title}</h4>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleCopy(section.title, section.content)}
                            data-testid={`button-copy-${section.title.toLowerCase()}`}
                          >
                            {copiedSections.has(section.title) ? (
                              <>
                                <Check className="h-4 w-4 mr-2" />
                                Copied!
                              </>
                            ) : (
                              <>
                                <Copy className="h-4 w-4 mr-2" />
                                Copy
                              </>
                            )}
                          </Button>
                        </div>
                        <p className="text-sm whitespace-pre-wrap bg-accent/30 p-3 rounded">{section.content}</p>
                      </div>
                    ))}
                  </div>
                </Card>

                <div className="flex justify-end">
                  <Button
                    onClick={() => setCurrentModule('interview-coach')}
                    style={{ backgroundColor: PATH_COLOR }}
                    data-testid="button-interview-practice"
                  >
                    Interview Practice
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                </div>
              </div>
            )}

            {/* Interview Coach Module */}
            {currentModule === 'interview-coach' && (
              <div className="space-y-6">
                <AiChatBubble message="Let's practice common interview questions using the STAR method (Situation, Task, Action, Result). I'll give you feedback on your responses." />

                <Card className="p-6">
                  <h3 className="font-accent text-xl font-semibold mb-4">Interview Practice</h3>

                  <div className="space-y-6">
                    <div className="p-4 bg-accent rounded-lg">
                      <p className="font-semibold mb-2">Question:</p>
                      <p>"Tell me about a time when you had to work on a team project with conflicting ideas."</p>
                    </div>

                    <div>
                      <Label>Your Answer</Label>
                      <Textarea
                        className="min-h-32"
                        placeholder="Use the STAR method: Situation, Task, Action, Result..."
                        data-testid="input-interview-answer"
                      />
                    </div>

                    <Button
                      variant="outline"
                      className="w-full"
                      data-testid="button-get-feedback"
                    >
                      Get AI Feedback
                    </Button>

                    <div className="p-4 border rounded-lg bg-card">
                      <h4 className="font-semibold mb-2">Feedback</h4>
                      <div className="space-y-3 text-sm">
                        <div className="flex items-start gap-2">
                          <Check className="h-4 w-4 text-path-professional mt-0.5" />
                          <span>Good use of STAR structure</span>
                        </div>
                        <div className="flex items-start gap-2">
                          <Check className="h-4 w-4 text-path-professional mt-0.5" />
                          <span>Clear explanation of your role</span>
                        </div>
                        <div className="flex items-start gap-2">
                          <span className="h-4 w-4 text-path-starter mt-0.5">⚠</span>
                          <span>Consider adding more specific metrics to your result</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </Card>

                <div className="flex justify-end">
                  <Button
                    onClick={() => setCurrentModule('document-writer')}
                    style={{ backgroundColor: PATH_COLOR }}
                    data-testid="button-view-dashboard"
                  >
                    View My Dashboard
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                </div>
              </div>
            )}

            {/* Document Writer Module */}
            {currentModule === 'document-writer' && (
              <div className="space-y-6">
                <AiChatBubble message="Need professional correspondence? I can help you create cover letters, follow-up emails, and more." />

                <Card className="p-6">
                  <h3 className="font-accent text-xl font-semibold mb-6">AI Document Writer</h3>

                  <div className="grid md:grid-cols-3 gap-4 mb-6">
                    {[
                      { title: "Cover Letter", desc: "Customized for each application" },
                      { title: "Follow-Up Email", desc: "After interview or networking" },
                      { title: "Thank You Note", desc: "Post-interview appreciation" },
                    ].map((type, i) => (
                      <Card key={i} className="p-4 hover-elevate cursor-pointer" data-testid={`card-document-${i}`}>
                        <FileText className="h-8 w-8 mb-2" style={{ color: PATH_COLOR }} />
                        <h4 className="font-semibold mb-1">{type.title}</h4>
                        <p className="text-sm text-muted-foreground">{type.desc}</p>
                      </Card>
                    ))}
                  </div>

                  <div className="space-y-4">
                    <div>
                      <Label>Company Name</Label>
                      <Input placeholder="e.g., TechCorp" data-testid="input-company" />
                    </div>
                    <div>
                      <Label>Position</Label>
                      <Input placeholder="e.g., Junior Software Developer" data-testid="input-position" />
                    </div>
                    <Button
                      className="w-full"
                      style={{ backgroundColor: PATH_COLOR }}
                      data-testid="button-generate-letter"
                    >
                      Generate My Letter
                    </Button>
                  </div>
                </Card>

                <div className="flex justify-end">
                  <Button
                    onClick={() => setCurrentModule('job-search')}
                    style={{ backgroundColor: PATH_COLOR }}
                  >
                    Find Jobs to Apply
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                </div>
              </div>
            )}

            {/* Job Search Module */}
            {currentModule === 'job-search' && (
              <div className="space-y-6">
                <AiChatBubble message="Ready to find your next opportunity? Search jobs from Jooble's database and apply with your customized resume and cover letter." />

                <Card className="p-8">
                  <h3 className="font-accent text-2xl font-semibold mb-6">Job Search & Apply</h3>

                  <div className="grid md:grid-cols-2 gap-6 mb-6">
                    <div>
                      <Label htmlFor="job-keyword">Job Title or Keywords</Label>
                      <Input
                        id="job-keyword"
                        placeholder="e.g., Software Developer, Frontend Engineer"
                        value={jobKeyword}
                        onChange={(e) => setJobKeyword(e.target.value)}
                      />
                    </div>
                    <div>
                      <Label htmlFor="job-location">Location</Label>
                      <Input
                        id="job-location"
                        placeholder="e.g., San Francisco, CA or Remote"
                        value={jobLocation}
                        onChange={(e) => setJobLocation(e.target.value)}
                      />
                    </div>
                    <div>
                      <Label htmlFor="job-salary">Minimum Salary (Optional)</Label>
                      <Input
                        id="job-salary"
                        placeholder="e.g., 80000"
                        value={jobSalaryMin}
                        onChange={(e) => setJobSalaryMin(e.target.value)}
                      />
                    </div>
                    <div>
                      <Label htmlFor="job-type">Job Type (Optional)</Label>
                      <Input
                        id="job-type"
                        placeholder="e.g., full-time, part-time, contract"
                        value={jobType}
                        onChange={(e) => setJobType(e.target.value)}
                      />
                    </div>
                  </div>

                  {searchError && (
                    <div className="p-4 bg-destructive/10 border border-destructive rounded-lg mb-6">
                      <p className="text-sm text-destructive">{searchError}</p>
                    </div>
                  )}

                  <Button
                    className="w-full"
                    style={{ backgroundColor: PATH_COLOR }}
                    onClick={handleSearchJobs}
                    disabled={isSearching}
                  >
                    {isSearching ? (
                      <>
                        <Loader className="mr-2 h-4 w-4 animate-spin" />
                        Searching Jobs...
                      </>
                    ) : (
                      <>
                        <Briefcase className="mr-2 h-4 w-4" />
                        Search Jobs
                      </>
                    )}
                  </Button>
                </Card>

                {searchResults.length > 0 && (
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <h4 className="font-semibold text-lg">Found {searchResults.length} Jobs</h4>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => setSearchResults([])}
                      >
                        Clear Results
                      </Button>
                    </div>

                    {searchResults.map((job, index) => (
                      <Card key={index} className="p-6 hover:shadow-md transition-shadow">
                        <div className="flex flex-col md:flex-row justify-between md:items-start gap-4 mb-4">
                          <div className="flex-1">
                            <h5 className="font-semibold text-lg mb-2">{job.title}</h5>
                            <p className="text-muted-foreground font-medium mb-3">{job.company}</p>

                            <div className="flex flex-wrap gap-4 text-sm text-muted-foreground">
                              <div className="flex items-center gap-2">
                                <MapPin className="h-4 w-4" />
                                {job.location}
                              </div>
                              {job.salary && (
                                <div className="flex items-center gap-2">
                                  <DollarSign className="h-4 w-4" />
                                  {job.salary}
                                </div>
                              )}
                              {job.dateCaption && (
                                <div className="text-xs bg-accent px-2 py-1 rounded">
                                  {job.dateCaption}
                                </div>
                              )}
                            </div>
                          </div>
                          <Button
                            onClick={() => window.open(job.url, '_blank')}
                            className="whitespace-nowrap"
                            style={{ backgroundColor: PATH_COLOR }}
                          >
                            <ExternalLink className="h-4 w-4 mr-2" />
                            View Job
                          </Button>
                        </div>

                        {job.description && (
                          <div className="text-sm text-muted-foreground line-clamp-2 bg-accent/30 p-3 rounded mt-3">
                            {job.description}
                          </div>
                        )}
                      </Card>
                    ))}
                  </div>
                )}

                {searchResults.length === 0 && !isSearching && !searchError && (
                  <Card className="p-8 text-center">
                    <Briefcase className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                    <p className="text-muted-foreground">Search for jobs to get started</p>
                  </Card>
                )}
              </div>
            )}
          </main>
        </div>
      </div>
    </div>
  );
}
