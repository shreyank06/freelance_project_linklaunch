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
import { ArrowRight, Download, Copy, Check, FileText, TrendingUp, Target, Loader } from "lucide-react";
import type { ModuleType, SkillMap } from "@shared/schema";
import { useCreateSkillMap } from "@/lib/api-hooks";
import { useSession } from "@/contexts/session-context";
import professionalHeroImage from "@assets/generated_images/Professional_business_strategy_meeting_12e0d9aa.png";

const PATH_COLOR = "hsl(142 70% 42%)";

export default function ExperiencedPath() {
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
        pathType: 'professional',
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
    { id: 'resume-builder' as ModuleType, title: 'Resume Builder', completed: false, active: currentModule === 'resume-builder' },
    { id: 'ats-optimization' as ModuleType, title: 'ATS Optimization', completed: false, active: currentModule === 'ats-optimization' },
    { id: 'linkedin-optimizer' as ModuleType, title: 'LinkedIn Optimizer', completed: false, active: currentModule === 'linkedin-optimizer' },
    { id: 'interview-coach' as ModuleType, title: 'Interview Trainer', completed: false, active: currentModule === 'interview-coach' },
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
        title="Experienced Professional Path"
        description="Reframe your work experience to position yourself for career growth or transition"
        pathColor={PATH_COLOR}
      />

      <div className="container max-w-7xl mx-auto px-6 py-8">
        <div className="grid lg:grid-cols-[300px_1fr] gap-8">
          <aside className="lg:sticky lg:top-24 h-fit">
            <Card className="p-6">
              <ProgressTracker modules={modules} pathColor={PATH_COLOR} />
            </Card>
          </aside>

          <main className="space-y-8">
            {currentModule === 'welcome' && (
              <div className="space-y-6">
                <div 
                  className="relative h-64 rounded-2xl overflow-hidden bg-cover bg-center"
                  style={{ backgroundImage: `url(${professionalHeroImage})` }}
                >
                  <div className="absolute inset-0 bg-gradient-to-b from-black/50 to-black/70 flex items-center justify-center">
                    <div className="text-center text-white px-6">
                      <h2 className="font-accent text-4xl font-bold mb-4">
                        You've built experience—let's position it for your next opportunity.
                      </h2>
                    </div>
                  </div>
                </div>

                <Card className="p-8">
                  <h3 className="font-accent text-2xl font-semibold mb-4">Welcome, Professional</h3>
                  <p className="text-muted-foreground mb-6">
                    With your track record of accomplishments, you're ready for the next level. Our AI will help you articulate your impact in ways that position you for senior roles or career transitions.
                  </p>
                  
                  <div className="grid md:grid-cols-3 gap-4 mb-8">
                    {[
                      { icon: Target, title: "Impact Mapping", desc: "Quantify your achievements and leadership" },
                      { icon: TrendingUp, title: "Career Positioning", desc: "Frame experience for advancement" },
                      { icon: FileText, title: "Executive Presence", desc: "Interview coaching for senior roles" },
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
                    data-testid="button-map-skills"
                  >
                    Map My Skills
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                </Card>
              </div>
            )}

            {currentModule === 'job-listings' && (
              <div className="space-y-6">
                <AiChatBubble message="Let's explore senior-level opportunities that align with your experience. Identify roles that match your career goals." />

                <Card className="p-6">
                  <h3 className="font-accent text-xl font-semibold mb-4">Senior-Level Positions</h3>
                  
                  <div className="space-y-4">
                    {[
                      { title: "Senior Product Manager", company: "InnovateCorp", location: "Seattle, WA", salary: "$140k - $180k" },
                      { title: "Engineering Manager", company: "TechLeaders", location: "Austin, TX", salary: "$160k - $200k" },
                      { title: "Director of Operations", company: "GlobalBiz", location: "Remote", salary: "$150k - $190k" },
                    ].map((job, i) => (
                      <div key={i} className="flex items-start justify-between p-4 border rounded-lg hover-elevate">
                        <div className="flex-1">
                          <h4 className="font-semibold mb-1">{job.title}</h4>
                          <div className="text-sm text-muted-foreground space-y-1">
                            <div>{job.company}</div>
                            <div>{job.location} • {job.salary}</div>
                          </div>
                        </div>
                        <Button variant="outline" size="sm" data-testid={`button-apply-${i}`}>Apply</Button>
                      </div>
                    ))}
                  </div>
                </Card>

                <div className="flex justify-end">
                  <Button 
                    onClick={() => setCurrentModule('skill-discovery')}
                    style={{ backgroundColor: PATH_COLOR }}
                    data-testid="button-explore-roles"
                  >
                    Continue to Skill Mapping
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                </div>
              </div>
            )}

            {currentModule === 'skill-discovery' && (
              <div className="space-y-6">
                <AiChatBubble message="What accomplishments are you most proud of? Tell me about projects where you led teams, improved processes, or delivered significant results." />

                <Card className="p-6">
                  <Label htmlFor="accomplishments" className="text-base font-semibold mb-2">Your Key Accomplishments</Label>
                  <Textarea
                    id="accomplishments"
                    placeholder="Example: Led a cross-functional team of 15 to deliver a $2M product launch 3 weeks ahead of schedule, resulting in 40% increase in quarterly revenue..."
                    className="min-h-32 mb-4"
                    value={userInput}
                    onChange={(e) => setUserInput(e.target.value)}
                    data-testid="input-accomplishments"
                  />
                  <Button
                    className="w-full"
                    style={{ backgroundColor: PATH_COLOR }}
                    data-testid="button-analyze-impact"
                    onClick={handleGenerateSkillMap}
                    disabled={createSkillMap.isPending || !userInput.trim()}
                  >
                    {createSkillMap.isPending ? (
                      <>
                        <Loader className="mr-2 h-4 w-4 animate-spin" />
                        Analyzing...
                      </>
                    ) : (
                      "Analyze My Impact"
                    )}
                  </Button>
                </Card>

                {skillMap && (
                  <Card className="p-6">
                    <h3 className="font-accent text-xl font-semibold mb-4">Leadership & Impact Map</h3>

                    <div className="space-y-6">
                      {Array.isArray(skillMap.leadershipSkills) && skillMap.leadershipSkills.length > 0 && (
                        <div>
                          <h4 className="font-semibold mb-3">Leadership Competencies</h4>
                          <SkillTagCloud
                            skills={skillMap.leadershipSkills}
                            highlightedSkills={skillMap.leadershipSkills.slice(0, 3)}
                            pathColor={PATH_COLOR}
                          />
                        </div>
                      )}

                      {skillMap.brandStatement && (
                        <div>
                          <h4 className="font-semibold mb-3">Your Executive Summary</h4>
                          <p className="text-sm italic">{skillMap.brandStatement}</p>
                        </div>
                      )}

                      {Array.isArray(skillMap.keywords) && skillMap.keywords.length > 0 && (
                        <div>
                          <h4 className="font-semibold mb-3">Key Impact Areas</h4>
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
                      data-testid="button-optimize-resume"
                    >
                      Optimize My Resume
                      <ArrowRight className="ml-2 h-4 w-4" />
                    </Button>
                  </div>
                )}
              </div>
            )}

            {currentModule === 'resume-builder' && (
              <div className="space-y-6">
                <AiChatBubble message="I'll rewrite your experience with metrics and a senior-level tone that resonates with executive recruiters." />

                <Card className="p-6">
                  <h3 className="font-accent text-xl font-semibold mb-6">Executive Resume Builder</h3>
                  
                  <div className="space-y-4">
                    <div>
                      <Label>Current Title</Label>
                      <Input placeholder="e.g., Senior Product Manager" data-testid="input-title" />
                    </div>

                    <div>
                      <Label>Years of Experience</Label>
                      <Input type="number" placeholder="e.g., 8" data-testid="input-years" />
                    </div>

                    <div>
                      <Label>Executive Summary</Label>
                      <Textarea 
                        className="min-h-24"
                        placeholder="AI will generate a compelling executive summary..."
                        defaultValue="Results-driven product leader with 8+ years of experience scaling SaaS products from $0 to $50M ARR. Proven track record of building and leading high-performing teams, driving strategic initiatives, and delivering measurable business impact."
                        data-testid="input-exec-summary"
                      />
                    </div>

                    <Button 
                      className="w-full"
                      style={{ backgroundColor: PATH_COLOR }}
                      data-testid="button-generate-resume"
                    >
                      <Download className="mr-2 h-4 w-4" />
                      Generate Professional Resume
                    </Button>
                  </div>
                </Card>

                <div className="flex justify-end">
                  <Button 
                    onClick={() => setCurrentModule('ats-optimization')}
                    style={{ backgroundColor: PATH_COLOR }}
                    data-testid="button-run-ats"
                  >
                    Run ATS Optimization
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                </div>
              </div>
            )}

            {currentModule === 'ats-optimization' && (
              <div className="space-y-6">
                <AiChatBubble message="I'll compare your resume against senior-level job postings and show you exactly how to improve your keyword match and positioning." />

                <Card className="p-8">
                  <div className="flex flex-col md:flex-row items-center gap-8 mb-8">
                    <div className="flex-shrink-0">
                      <AtsScoreDisplay percentage={85} size="lg" />
                    </div>
                    <div className="flex-1 text-center md:text-left">
                      <h3 className="font-accent text-2xl font-semibold mb-2">Excellent Match!</h3>
                      <p className="text-muted-foreground">
                        Your resume is well-positioned for senior roles. A few tweaks will get you to 95%+.
                      </p>
                    </div>
                  </div>

                  <div className="grid md:grid-cols-2 gap-6">
                    <div>
                      <h4 className="font-semibold mb-3">Enhancement Opportunities</h4>
                      <div className="space-y-2">
                        {["Add metrics to leadership section", "Include industry certifications", "Highlight P&L responsibility"].map((tip, i) => (
                          <div key={i} className="text-sm p-2 bg-path-starter/10 rounded border-l-2 border-path-starter">
                            {tip}
                          </div>
                        ))}
                      </div>
                    </div>

                    <div>
                      <h4 className="font-semibold mb-3">Strong Points</h4>
                      <div className="space-y-2">
                        {["Clear leadership narrative", "Quantified achievements", "Industry-specific keywords", "Strategic impact demonstrated"].map((strength, i) => (
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
                    data-testid="button-enhance-linkedin"
                  >
                    Enhance LinkedIn Presence
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                </div>
              </div>
            )}

            {currentModule === 'linkedin-optimizer' && (
              <div className="space-y-6">
                <AiChatBubble message="I'll create an expert-level headline and About section that positions you as an industry authority and attracts executive recruiters." />

                <Card className="p-6">
                  <h3 className="font-accent text-xl font-semibold mb-6">LinkedIn Executive Profile</h3>
                  
                  <div className="space-y-6">
                    {[
                      { 
                        title: "Headline", 
                        content: "Senior Product Leader | Scaled SaaS Products $0→$50M ARR | Team Builder | Innovation Driver" 
                      },
                      { 
                        title: "About Section", 
                        content: "I'm a product leader who thrives at the intersection of technology, business strategy, and team development.\n\nOver the past 8 years, I've:\n• Scaled products from concept to $50M+ ARR\n• Built and led cross-functional teams of 50+ professionals\n• Launched 15+ products serving millions of users\n• Driven strategic initiatives resulting in 40% productivity gains\n\nMy approach combines data-driven decision-making with human-centered design principles. I believe the best products are built by empowered, diverse teams working toward a shared vision.\n\nSpecializations: Product Strategy | Team Leadership | SaaS Growth | Go-to-Market | Agile Methodologies" 
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
                    data-testid="button-sharpen-interview"
                  >
                    Sharpen My Interview Edge
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                </div>
              </div>
            )}

            {currentModule === 'interview-coach' && (
              <div className="space-y-6">
                <AiChatBubble message="Let's practice senior-level interviews. I'll help you master leadership storytelling and executive presence." />

                <Card className="p-6">
                  <h3 className="font-accent text-xl font-semibold mb-4">Executive Interview Training</h3>
                  
                  <div className="space-y-6">
                    <div className="p-4 bg-accent rounded-lg">
                      <p className="font-semibold mb-2">Leadership Question:</p>
                      <p>"Describe a time when you had to make a difficult decision that affected your entire team."</p>
                    </div>

                    <div>
                      <Label>Your Response</Label>
                      <Textarea 
                        className="min-h-32"
                        placeholder="Focus on strategic thinking, stakeholder management, and measurable outcomes..."
                        data-testid="input-leadership-answer"
                      />
                    </div>

                    <Button 
                      variant="outline"
                      className="w-full"
                      data-testid="button-get-feedback"
                    >
                      Get Executive Coaching Feedback
                    </Button>

                    <div className="p-4 border rounded-lg bg-card">
                      <h4 className="font-semibold mb-2">AI Coach Feedback</h4>
                      <div className="space-y-3 text-sm">
                        <div className="flex items-start gap-2">
                          <Check className="h-4 w-4 text-path-professional mt-0.5" />
                          <span>Strong demonstration of strategic thinking</span>
                        </div>
                        <div className="flex items-start gap-2">
                          <Check className="h-4 w-4 text-path-professional mt-0.5" />
                          <span>Excellent quantification of business impact</span>
                        </div>
                        <div className="flex items-start gap-2">
                          <span className="h-4 w-4 text-path-starter mt-0.5">⚠</span>
                          <span>Consider emphasizing long-term organizational impact</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </Card>

                <div className="flex justify-end">
                  <Button 
                    onClick={() => setCurrentModule('document-writer')}
                    style={{ backgroundColor: PATH_COLOR }}
                    data-testid="button-track-momentum"
                  >
                    Track My Career Momentum
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                </div>
              </div>
            )}

            {currentModule === 'document-writer' && (
              <div className="space-y-6">
                <AiChatBubble message="Generate professional correspondence for executive-level communications." />

                <Card className="p-6">
                  <h3 className="font-accent text-xl font-semibold mb-6">Professional Correspondence</h3>
                  
                  <div className="grid md:grid-cols-3 gap-4 mb-6">
                    {[
                      { title: "Executive Cover Letter", desc: "Strategic positioning letter" },
                      { title: "Follow-Up Letter", desc: "Post-interview executive note" },
                      { title: "Negotiation Letter", desc: "Professional offer discussion" },
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
                      <Label>Company/Recipient</Label>
                      <Input placeholder="e.g., InnovateCorp" data-testid="input-recipient" />
                    </div>
                    <div>
                      <Label>Position/Context</Label>
                      <Input placeholder="e.g., Senior Product Manager" data-testid="input-context" />
                    </div>
                    <Button 
                      className="w-full"
                      style={{ backgroundColor: PATH_COLOR }}
                      data-testid="button-generate-document"
                    >
                      Generate Document
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
