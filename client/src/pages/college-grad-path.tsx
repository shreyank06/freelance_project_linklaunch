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
import { ArrowRight, Download, Copy, Check, FileText, Briefcase, Target, MessageSquare, Loader } from "lucide-react";
import type { ModuleType, SkillMap } from "@shared/schema";
import { useCreateSkillMap } from "@/lib/api-hooks";
import { useSession } from "@/contexts/session-context";
import collegeHeroImage from "@assets/generated_images/College_graduates_celebrating_success_873a23d4.png";

const PATH_COLOR = "hsl(217 91% 50%)";

export default function CollegeGradPath() {
  const { sessionId } = useSession();
  const [currentModule, setCurrentModule] = useState<ModuleType>('welcome');
  const [userInput, setUserInput] = useState("");
  const [copiedSections, setCopiedSections] = useState<Set<string>>(new Set());
  const [skillMap, setSkillMap] = useState<SkillMap | null>(null);
  const createSkillMap = useCreateSkillMap();

  const handleGenerateSkillMap = async () => {
    if (!userInput.trim() || !sessionId) return;
    try {
      const result = await createSkillMap.mutateAsync({
        sessionId,
        userInput,
        pathType: 'college',
      });
      setSkillMap(result);
    } catch (error) {
      console.error("Failed to generate skill map:", error);
    }
  };

  const modules = [
    { id: 'welcome' as ModuleType, title: 'Welcome', completed: false, active: currentModule === 'welcome' },
    { id: 'job-listings' as ModuleType, title: 'LinkedIn Job Listings', completed: false, active: currentModule === 'job-listings' },
    { id: 'skill-discovery' as ModuleType, title: 'Skill Discovery & Career Mapping', completed: false, active: currentModule === 'skill-discovery' },
    { id: 'resume-builder' as ModuleType, title: 'Smart Resume Builder', completed: false, active: currentModule === 'resume-builder' },
    { id: 'ats-optimization' as ModuleType, title: 'ATS Insight & Optimization', completed: false, active: currentModule === 'ats-optimization' },
    { id: 'linkedin-optimizer' as ModuleType, title: 'LinkedIn Profile Optimizer', completed: false, active: currentModule === 'linkedin-optimizer' },
    { id: 'interview-coach' as ModuleType, title: 'Interview Coach', completed: false, active: currentModule === 'interview-coach' },
    { id: 'document-writer' as ModuleType, title: 'AI Document Writer', completed: false, active: currentModule === 'document-writer' },
  ];

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
                    onClick={() => setCurrentModule('job-listings')}
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

            {/* Job Listings Module */}
            {currentModule === 'job-listings' && (
              <div className="space-y-6">
                <AiChatBubble message="Let's explore job opportunities that match your interests. Browse these positions and identify roles that excite you." />

                <Card className="p-6">
                  <h3 className="font-accent text-xl font-semibold mb-4">Recommended Entry-Level Positions</h3>
                  
                  <div className="space-y-4">
                    {[
                      { title: "Junior Software Developer", company: "TechCorp", location: "San Francisco, CA", salary: "$70k - $90k" },
                      { title: "Marketing Associate", company: "BrandAgency", location: "New York, NY", salary: "$55k - $70k" },
                      { title: "Financial Analyst", company: "FinanceGroup", location: "Chicago, IL", salary: "$65k - $80k" },
                    ].map((job, i) => (
                      <div key={i} className="flex items-start justify-between p-4 border rounded-lg hover-elevate">
                        <div className="flex-1">
                          <h4 className="font-semibold mb-1">{job.title}</h4>
                          <div className="text-sm text-muted-foreground space-y-1">
                            <div className="flex items-center gap-2">
                              <Briefcase className="h-3 w-3" />
                              {job.company}
                            </div>
                            <div>{job.location} • {job.salary}</div>
                          </div>
                        </div>
                        <Button variant="outline" size="sm" data-testid={`button-view-job-${i}`}>View Details</Button>
                      </div>
                    ))}
                  </div>
                </Card>

                <div className="flex justify-end">
                  <Button 
                    onClick={() => setCurrentModule('skill-discovery')}
                    style={{ backgroundColor: PATH_COLOR }}
                    data-testid="button-continue-to-skill-discovery"
                  >
                    Continue to Skill Discovery
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                </div>
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
                <AiChatBubble message="Great! I'll help you create an ATS-friendly resume that highlights your education and projects. Let's start with your basic information." />

                <Card className="p-6">
                  <h3 className="font-accent text-xl font-semibold mb-6">Resume Builder</h3>
                  
                  <div className="grid md:grid-cols-2 gap-4 mb-6">
                    <div>
                      <Label htmlFor="name">Full Name</Label>
                      <Input id="name" placeholder="John Doe" data-testid="input-name" />
                    </div>
                    <div>
                      <Label htmlFor="email">Email</Label>
                      <Input id="email" type="email" placeholder="john@example.com" data-testid="input-email" />
                    </div>
                    <div>
                      <Label htmlFor="phone">Phone</Label>
                      <Input id="phone" placeholder="(555) 123-4567" data-testid="input-phone" />
                    </div>
                    <div>
                      <Label htmlFor="location">Location</Label>
                      <Input id="location" placeholder="San Francisco, CA" data-testid="input-location" />
                    </div>
                  </div>

                  <div className="mb-6">
                    <Label>Professional Summary</Label>
                    <Textarea 
                      className="min-h-24"
                      placeholder="AI will generate this based on your skill map..."
                      defaultValue="Recent computer science graduate with hands-on experience in full-stack development and a proven track record of leading successful team projects."
                      data-testid="input-summary"
                    />
                  </div>

                  <Button 
                    className="w-full"
                    style={{ backgroundColor: PATH_COLOR }}
                    data-testid="button-generate-resume"
                  >
                    <Download className="mr-2 h-4 w-4" />
                    Generate Resume (PDF/DOCX)
                  </Button>
                </Card>

                <div className="flex justify-end">
                  <Button 
                    onClick={() => setCurrentModule('ats-optimization')}
                    style={{ backgroundColor: PATH_COLOR }}
                    data-testid="button-run-ats-scan"
                  >
                    Run ATS Scan
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                </div>
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
              </div>
            )}
          </main>
        </div>
      </div>
    </div>
  );
}
