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
import { ArrowRight, Download, Copy, Check, FileText, Lightbulb, Heart } from "lucide-react";
import type { ModuleType } from "@shared/schema";
import starterHeroImage from "@assets/generated_images/Career_starter_working_determinedly_33310ce1.png";

const PATH_COLOR = "hsl(24 90% 55%)";

export default function StarterPath() {
  const [currentModule, setCurrentModule] = useState<ModuleType>('welcome');
  const [copiedSections, setCopiedSections] = useState<Set<string>>(new Set());

  const modules = [
    { id: 'welcome' as ModuleType, title: 'Welcome', completed: false, active: currentModule === 'welcome' },
    { id: 'job-listings' as ModuleType, title: 'LinkedIn Job Listings', completed: false, active: currentModule === 'job-listings' },
    { id: 'skill-discovery' as ModuleType, title: 'Skill Discovery', completed: false, active: currentModule === 'skill-discovery' },
    { id: 'resume-builder' as ModuleType, title: 'Resume Builder', completed: false, active: currentModule === 'resume-builder' },
    { id: 'ats-optimization' as ModuleType, title: 'ATS Scan', completed: false, active: currentModule === 'ats-optimization' },
    { id: 'linkedin-optimizer' as ModuleType, title: 'LinkedIn Optimizer', completed: false, active: currentModule === 'linkedin-optimizer' },
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
        title="Just Getting Started Path"
        description="Discover your transferable skills and enter the job market with confidence"
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
                  style={{ backgroundImage: `url(${starterHeroImage})` }}
                >
                  <div className="absolute inset-0 bg-gradient-to-b from-black/50 to-black/70 flex items-center justify-center">
                    <div className="text-center text-white px-6">
                      <h2 className="font-accent text-4xl font-bold mb-4">
                        Starting from scratch? You already have valuable skills—let's uncover them.
                      </h2>
                    </div>
                  </div>
                </div>

                <Card className="p-8">
                  <h3 className="font-accent text-2xl font-semibold mb-4">Welcome to Your Fresh Start</h3>
                  <p className="text-muted-foreground mb-6">
                    Whether you're changing careers, entering the workforce for the first time, or returning after a break, you have more to offer than you think. Our AI will help you identify and showcase your transferable skills.
                  </p>
                  
                  <div className="grid md:grid-cols-3 gap-4 mb-8">
                    {[
                      { icon: Lightbulb, title: "Skill Discovery", desc: "Find your hidden strengths" },
                      { icon: FileText, title: "First Resume", desc: "Build your professional foundation" },
                      { icon: Heart, title: "Confidence Building", desc: "Prepare with supportive AI coaching" },
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
                    data-testid="button-discover-strengths"
                  >
                    Discover My Strengths
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                </Card>
              </div>
            )}

            {currentModule === 'job-listings' && (
              <div className="space-y-6">
                <AiChatBubble message="Let's explore entry-level opportunities across different industries. Don't worry if you don't have direct experience—we'll show you how your skills transfer." />

                <Card className="p-6">
                  <h3 className="font-accent text-xl font-semibold mb-4">Entry-Level Opportunities</h3>
                  
                  <div className="space-y-4">
                    {[
                      { title: "Customer Success Associate", company: "SupportCo", location: "Remote", salary: "$40k - $50k" },
                      { title: "Administrative Assistant", company: "OfficeWorks", location: "Boston, MA", salary: "$35k - $45k" },
                      { title: "Sales Development Representative", company: "SalesTeam", location: "Denver, CO", salary: "$45k - $55k" },
                    ].map((job, i) => (
                      <div key={i} className="flex items-start justify-between p-4 border rounded-lg hover-elevate">
                        <div className="flex-1">
                          <h4 className="font-semibold mb-1">{job.title}</h4>
                          <div className="text-sm text-muted-foreground space-y-1">
                            <div>{job.company}</div>
                            <div>{job.location} • {job.salary}</div>
                          </div>
                        </div>
                        <Button variant="outline" size="sm" data-testid={`button-learn-more-${i}`}>Learn More</Button>
                      </div>
                    ))}
                  </div>
                </Card>

                <div className="flex justify-end">
                  <Button 
                    onClick={() => setCurrentModule('skill-discovery')}
                    style={{ backgroundColor: PATH_COLOR }}
                    data-testid="button-view-openings"
                  >
                    Continue to Skill Discovery
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                </div>
              </div>
            )}

            {currentModule === 'skill-discovery' && (
              <div className="space-y-6">
                <AiChatBubble message="What do people often ask you for help with? Think about volunteer work, personal projects, hobbies, or even everyday situations where you've helped others." />

                <Card className="p-6">
                  <Label htmlFor="strengths" className="text-base font-semibold mb-2">Tell Me About Your Strengths</Label>
                  <Textarea
                    id="strengths"
                    placeholder="Example: I've organized community events with 100+ attendees, managed social media for a local nonprofit, and friends always ask me to help them plan their trips because I'm good at organizing details..."
                    className="min-h-32 mb-4"
                    data-testid="input-strengths"
                  />
                  <Button 
                    className="w-full"
                    style={{ backgroundColor: PATH_COLOR }}
                    data-testid="button-discover-skills"
                  >
                    Discover My Transferable Skills
                  </Button>
                </Card>

                <Card className="p-6">
                  <h3 className="font-accent text-xl font-semibold mb-4">Your Transferable Skills</h3>
                  
                  <div className="space-y-6">
                    <div>
                      <h4 className="font-semibold mb-3">Core Competencies</h4>
                      <SkillTagCloud
                        skills={["Organization", "Communication", "Problem Solving", "Attention to Detail", "Time Management", "Teamwork"]}
                        highlightedSkills={["Organization", "Communication", "Problem Solving"]}
                        pathColor={PATH_COLOR}
                      />
                    </div>
                    
                    <div className="p-4 bg-accent/30 rounded-lg border-l-4" style={{ borderColor: PATH_COLOR }}>
                      <h4 className="font-semibold mb-2">✨ Suggested Entry-Level Roles</h4>
                      <ul className="space-y-1 text-sm">
                        <li>• Event Coordinator</li>
                        <li>• Administrative Assistant</li>
                        <li>• Customer Service Representative</li>
                        <li>• Social Media Coordinator</li>
                      </ul>
                    </div>

                    <div className="p-4 bg-primary/10 rounded-lg">
                      <h4 className="font-semibold mb-2">Confidence Boost</h4>
                      <p className="text-sm italic">
                        "Your organizational skills and ability to manage details show you're ready for professional roles. Many employers value these foundational skills because they can be applied across any industry!"
                      </p>
                    </div>
                  </div>
                </Card>

                <div className="flex justify-end">
                  <Button 
                    onClick={() => setCurrentModule('resume-builder')}
                    style={{ backgroundColor: PATH_COLOR }}
                    data-testid="button-create-resume"
                  >
                    Create My First Resume
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                </div>
              </div>
            )}

            {currentModule === 'resume-builder' && (
              <div className="space-y-6">
                <AiChatBubble message="Don't worry if you don't have traditional work experience. I'll help you present your volunteer work, training, and life experiences in a professional way." />

                <Card className="p-6">
                  <h3 className="font-accent text-xl font-semibold mb-6">Build Your First Resume</h3>
                  
                  <div className="space-y-4">
                    <div className="grid md:grid-cols-2 gap-4">
                      <div>
                        <Label>Full Name</Label>
                        <Input placeholder="Your name" data-testid="input-name" />
                      </div>
                      <div>
                        <Label>Email</Label>
                        <Input type="email" placeholder="your.email@example.com" data-testid="input-email" />
                      </div>
                      <div>
                        <Label>Phone</Label>
                        <Input placeholder="(555) 123-4567" data-testid="input-phone" />
                      </div>
                      <div>
                        <Label>City, State</Label>
                        <Input placeholder="Denver, CO" data-testid="input-location" />
                      </div>
                    </div>

                    <div>
                      <Label>About You (Optional)</Label>
                      <Textarea 
                        className="min-h-20"
                        placeholder="AI will create a professional summary based on your skills..."
                        defaultValue="Motivated professional with strong organizational and communication skills seeking to contribute to a dynamic team."
                        data-testid="input-about"
                      />
                    </div>

                    <div className="p-4 bg-accent/30 rounded-lg">
                      <p className="text-sm text-muted-foreground mb-2">💡 Tip:</p>
                      <p className="text-sm">
                        We'll automatically format your volunteer work, courses, and skills into a professional resume that passes ATS systems.
                      </p>
                    </div>

                    <Button 
                      className="w-full"
                      style={{ backgroundColor: PATH_COLOR }}
                      data-testid="button-build-resume"
                    >
                      <Download className="mr-2 h-4 w-4" />
                      Build My Resume
                    </Button>
                  </div>
                </Card>

                <div className="flex justify-end">
                  <Button 
                    onClick={() => setCurrentModule('ats-optimization')}
                    style={{ backgroundColor: PATH_COLOR }}
                    data-testid="button-check-ats"
                  >
                    Check My ATS Readiness
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                </div>
              </div>
            )}

            {currentModule === 'ats-optimization' && (
              <div className="space-y-6">
                <AiChatBubble message="Let me explain how ATS systems work and show you which industries are the best match for your skills. I'll keep it simple!" />

                <Card className="p-8">
                  <div className="flex flex-col md:flex-row items-center gap-8 mb-8">
                    <div className="flex-shrink-0">
                      <AtsScoreDisplay percentage={72} size="lg" />
                    </div>
                    <div className="flex-1 text-center md:text-left">
                      <h3 className="font-accent text-2xl font-semibold mb-2">Great Start!</h3>
                      <p className="text-muted-foreground">
                        Your resume is ATS-friendly. Here are a few simple improvements to make it even better.
                      </p>
                    </div>
                  </div>

                  <div className="space-y-6">
                    <div>
                      <h4 className="font-semibold mb-3">Skills to Add</h4>
                      <div className="space-y-2">
                        {["Microsoft Office", "Customer Service", "Data Entry", "Email Communication"].map((skill, i) => (
                          <div key={i} className="flex items-center justify-between p-3 bg-accent/30 rounded-lg">
                            <span className="text-sm">{skill}</span>
                            <Button size="sm" variant="outline" data-testid={`button-add-skill-${i}`}>Add to Resume</Button>
                          </div>
                        ))}
                      </div>
                    </div>

                    <div className="p-4 bg-primary/10 rounded-lg">
                      <h4 className="font-semibold mb-2">Job Fit Analysis</h4>
                      <p className="text-sm mb-3">
                        Based on your skills, you're a strong match for these industries:
                      </p>
                      <div className="flex flex-wrap gap-2">
                        {["Administrative", "Customer Service", "Hospitality", "Retail", "Non-Profit"].map((industry, i) => (
                          <span key={i} className="text-xs px-3 py-1 rounded-full bg-background">
                            {industry}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>
                </Card>

                <div className="flex justify-end">
                  <Button 
                    onClick={() => setCurrentModule('linkedin-optimizer')}
                    style={{ backgroundColor: PATH_COLOR }}
                    data-testid="button-make-linkedin-standout"
                  >
                    Make My LinkedIn Stand Out
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                </div>
              </div>
            )}

            {currentModule === 'linkedin-optimizer' && (
              <div className="space-y-6">
                <AiChatBubble message="Let's create your first LinkedIn profile! I'll use friendly, positive language that makes you approachable to employers." />

                <Card className="p-6">
                  <h3 className="font-accent text-xl font-semibold mb-6">LinkedIn Profile Templates</h3>
                  
                  <div className="space-y-6">
                    {[
                      { 
                        title: "Starter Headline", 
                        content: "Organized Professional | Strong Communicator | Ready to Contribute & Learn" 
                      },
                      { 
                        title: "Friendly About Section", 
                        content: "I'm excited to start my professional journey and contribute to a team that values organization, clear communication, and dedication.\n\nWhat I bring:\n• Strong attention to detail and organizational skills\n• Experience coordinating events and managing projects\n• Excellent communication and team collaboration\n• Quick learner eager to develop new professional skills\n\nI'm looking for an opportunity where I can apply my skills, learn from experienced professionals, and make a positive impact." 
                      },
                      { 
                        title: "Intro Post Plan", 
                        content: "Hi LinkedIn! I'm excited to be here and connect with professionals in [your industry]. I'm passionate about [your interest] and looking forward to learning from this community. Feel free to connect!" 
                      },
                    ].map((section, i) => (
                      <div key={i} className="border rounded-lg p-4">
                        <div className="flex items-center justify-between mb-3">
                          <h4 className="font-semibold">{section.title}</h4>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleCopy(section.title, section.content)}
                            data-testid={`button-copy-${section.title.toLowerCase().replace(/\s+/g, '-')}`}
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
                    data-testid="button-get-interview-ready"
                  >
                    Get Interview Ready
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                </div>
              </div>
            )}

            {currentModule === 'interview-coach' && (
              <div className="space-y-6">
                <AiChatBubble message="Let's practice common entry-level interview questions. I'll give you supportive feedback to build your confidence!" />

                <Card className="p-6">
                  <h3 className="font-accent text-xl font-semibold mb-4">Beginner-Friendly Interview Practice</h3>
                  
                  <div className="space-y-6">
                    <div className="p-4 bg-accent rounded-lg">
                      <p className="font-semibold mb-2">Common Question:</p>
                      <p>"Why do you want to work here?"</p>
                    </div>

                    <div>
                      <Label>Practice Your Answer</Label>
                      <Textarea 
                        className="min-h-24"
                        placeholder="Tip: Research the company, mention what excites you, and explain how you can contribute..."
                        data-testid="input-practice-answer"
                      />
                    </div>

                    <Button 
                      variant="outline"
                      className="w-full"
                      data-testid="button-get-coaching"
                    >
                      Get Supportive Feedback
                    </Button>

                    <div className="p-4 border rounded-lg bg-card">
                      <h4 className="font-semibold mb-2">Encouraging Feedback</h4>
                      <div className="space-y-3 text-sm">
                        <div className="flex items-start gap-2">
                          <Check className="h-4 w-4 text-path-professional mt-0.5" />
                          <span>Great enthusiasm! Employers love to see genuine interest</span>
                        </div>
                        <div className="flex items-start gap-2">
                          <Check className="h-4 w-4 text-path-professional mt-0.5" />
                          <span>You connected your skills to the role well</span>
                        </div>
                        <div className="flex items-start gap-2">
                          <Lightbulb className="h-4 w-4 text-path-starter mt-0.5" />
                          <span>Try adding a specific example from your experience</span>
                        </div>
                      </div>
                    </div>

                    <div className="p-4 bg-primary/10 rounded-lg">
                      <p className="text-sm font-semibold mb-2">💪 You've Got This!</p>
                      <p className="text-sm">
                        Remember: Every professional started somewhere. Your willingness to learn and grow is what employers value most in entry-level candidates.
                      </p>
                    </div>
                  </div>
                </Card>

                <div className="flex justify-end">
                  <Button 
                    onClick={() => setCurrentModule('document-writer')}
                    style={{ backgroundColor: PATH_COLOR }}
                    data-testid="button-view-next-steps"
                  >
                    View My Next Steps
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                </div>
              </div>
            )}

            {currentModule === 'document-writer' && (
              <div className="space-y-6">
                <AiChatBubble message="I'll help you write professional emails and letters for your job search. These templates make it easy!" />

                <Card className="p-6">
                  <h3 className="font-accent text-xl font-semibold mb-6">Simple Document Generator</h3>
                  
                  <div className="grid md:grid-cols-3 gap-4 mb-6">
                    {[
                      { title: "Cover Letter", desc: "Simple and professional" },
                      { title: "Thank You Email", desc: "After your interview" },
                      { title: "Follow-Up Note", desc: "Check on your application" },
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
                      <Input placeholder="e.g., SupportCo" data-testid="input-company-name" />
                    </div>
                    <div>
                      <Label>Job Title</Label>
                      <Input placeholder="e.g., Customer Success Associate" data-testid="input-job-title" />
                    </div>
                    <Button 
                      className="w-full"
                      style={{ backgroundColor: PATH_COLOR }}
                      data-testid="button-generate-my-letter"
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
