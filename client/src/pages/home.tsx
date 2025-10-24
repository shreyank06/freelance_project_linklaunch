import { useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { GraduationCap, Briefcase, Sparkles, CheckCircle, Users, TrendingUp, ArrowRight } from "lucide-react";
import homeHeroImage from "@assets/generated_images/Homepage_hero_diverse_professionals_b63c19ee.png";
import { useCreateSession } from "@/lib/api-hooks";
import { useSession } from "@/contexts/session-context";
import type { PathType } from "@shared/schema";
import { Link } from "react-router-dom";

export default function Home() {
  const [, setLocation] = useLocation();
  const { setSession } = useSession();
  const createSession = useCreateSession();

  const handlePathSelect = async (pathType: PathType, route: string) => {
    try {
      const session = await createSession.mutateAsync(pathType);
      setSession(session.id, pathType);
      setLocation(route);
    } catch (error) {
      console.error("Failed to create session:", error);
    }
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container flex h-16 items-center justify-between px-6">
          <div className="flex items-center gap-2">
            <Sparkles className="h-6 w-6 text-primary" />
            <span className="font-accent text-xl font-bold">LinkLaunch</span>
          </div>
          <nav className="hidden md:flex items-center gap-8">
            <a href="#how-it-works" className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors">
              How It Works
            </a>
            <a href="#testimonials" className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors">
              Success Stories
            </a>
            <a href="#about" className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors">
              About
            </a>
          </nav>
          <Button size="sm" data-testid="button-get-started">
            Get Started
          </Button>
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative h-[90vh] flex items-center justify-center overflow-hidden">
        <div 
          className="absolute inset-0 bg-cover bg-center"
          style={{ backgroundImage: `url(${homeHeroImage})` }}
        >
          <div className="absolute inset-0 bg-gradient-to-b from-black/70 via-black/60 to-black/70"></div>
        </div>
        
        <div className="relative z-10 container px-6 text-center text-white">
          <h1 className="font-accent text-5xl md:text-6xl lg:text-7xl font-bold mb-6 max-w-5xl mx-auto leading-tight">
            The All-in-One AI-Powered Platform to Build, Optimize, and Launch Your Career
          </h1>
          <p className="text-xl md:text-2xl mb-12 max-w-3xl mx-auto text-white/90">
            Personalized AI coaching for every career stage. From skill discovery to interview prep, we've got you covered.
          </p>
          
          {/* Path Selection Cards */}
          <div className="grid md:grid-cols-3 gap-6 max-w-6xl mx-auto mt-16">
            <Card 
              onClick={() => handlePathSelect('college', '/college-grad-path')}
              className="group p-8 bg-white/10 backdrop-blur-md border-white/20 hover:bg-white/15 hover:scale-105 transition-all duration-300 cursor-pointer h-full" 
              data-testid="card-path-college"
            >
              <div className="flex flex-col items-center text-center gap-4">
                <div className="h-16 w-16 rounded-full bg-path-college flex items-center justify-center">
                  <GraduationCap className="h-8 w-8 text-white" />
                </div>
                <h3 className="font-accent text-2xl font-semibold text-white">College Graduate</h3>
                <p className="text-white/80 text-sm">
                  Turn your education and projects into recruiter-ready content
                </p>
                <Button 
                  variant="outline" 
                  className="mt-auto bg-white/20 border-white/30 text-white hover:bg-white/30" 
                  data-testid="button-select-college"
                  disabled={createSession.isPending}
                >
                  {createSession.isPending ? "Starting..." : "Start Your Journey"}
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </div>
            </Card>

            <Card 
              onClick={() => handlePathSelect('professional', '/experienced-path')}
              className="group p-8 bg-white/10 backdrop-blur-md border-white/20 hover:bg-white/15 hover:scale-105 transition-all duration-300 cursor-pointer h-full" 
              data-testid="card-path-professional"
            >
              <div className="flex flex-col items-center text-center gap-4">
                <div className="h-16 w-16 rounded-full bg-path-professional flex items-center justify-center">
                  <Briefcase className="h-8 w-8 text-white" />
                </div>
                <h3 className="font-accent text-2xl font-semibold text-white">Experienced Professional</h3>
                <p className="text-white/80 text-sm">
                  Position your experience for career growth or transition
                </p>
                <Button 
                  variant="outline" 
                  className="mt-auto bg-white/20 border-white/30 text-white hover:bg-white/30" 
                  data-testid="button-select-professional"
                  disabled={createSession.isPending}
                >
                  {createSession.isPending ? "Starting..." : "Advance Your Career"}
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </div>
            </Card>

            <Card 
              onClick={() => handlePathSelect('starter', '/starter-path')}
              className="group p-8 bg-white/10 backdrop-blur-md border-white/20 hover:bg-white/15 hover:scale-105 transition-all duration-300 cursor-pointer h-full" 
              data-testid="card-path-starter"
            >
              <div className="flex flex-col items-center text-center gap-4">
                <div className="h-16 w-16 rounded-full bg-path-starter flex items-center justify-center">
                  <Sparkles className="h-8 w-8 text-white" />
                </div>
                <h3 className="font-accent text-2xl font-semibold text-white">Just Getting Started</h3>
                <p className="text-white/80 text-sm">
                  Discover your skills and enter the job market with confidence
                </p>
                <Button 
                  variant="outline" 
                  className="mt-auto bg-white/20 border-white/30 text-white hover:bg-white/30" 
                  data-testid="button-select-starter"
                  disabled={createSession.isPending}
                >
                  {createSession.isPending ? "Starting..." : "Begin Your Path"}
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </div>
            </Card>
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section id="how-it-works" className="py-24 bg-card">
        <div className="container px-6 max-w-6xl mx-auto">
          <h2 className="font-accent text-4xl md:text-5xl font-bold text-center mb-16">How It Works</h2>
          
          <div className="grid md:grid-cols-4 gap-8">
            {[
              { number: "1", title: "Choose Your Path", desc: "Select the journey that matches your career stage" },
              { number: "2", title: "AI-Guided Discovery", desc: "Our AI helps you identify and articulate your unique value" },
              { number: "3", title: "Build Your Arsenal", desc: "Create ATS-optimized resumes, LinkedIn profiles, and more" },
              { number: "4", title: "Launch with Confidence", desc: "Practice interviews and generate professional correspondence" },
            ].map((step, i) => (
              <div key={i} className="relative text-center">
                <div className="mb-4 mx-auto h-16 w-16 rounded-full bg-primary text-primary-foreground flex items-center justify-center font-accent text-2xl font-bold">
                  {step.number}
                </div>
                {i < 3 && (
                  <div className="hidden md:block absolute top-8 left-[calc(50%+2rem)] w-[calc(100%-4rem)] h-0.5 bg-border"></div>
                )}
                <h3 className="font-semibold text-lg mb-2">{step.title}</h3>
                <p className="text-sm text-muted-foreground">{step.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-24">
        <div className="container px-6 max-w-6xl mx-auto">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="font-accent text-4xl font-bold mb-6">Built by Career Experts, Powered by AI</h2>
              <p className="text-lg text-muted-foreground mb-8">
                LinkLaunch combines proven career development strategies with cutting-edge AI to give you personalized guidance at every step of your journey.
              </p>
              <div className="space-y-4">
                {[
                  "ATS-optimized resume templates",
                  "LinkedIn profile optimization",
                  "STAR method interview coaching",
                  "Professional document generation",
                ].map((feature, i) => (
                  <div key={i} className="flex items-center gap-3">
                    <CheckCircle className="h-5 w-5 text-primary flex-shrink-0" />
                    <span className="text-foreground">{feature}</span>
                  </div>
                ))}
              </div>
            </div>
            
            <div className="grid grid-cols-2 gap-6">
              {[
                { icon: Users, value: "10K+", label: "Careers Launched" },
                { icon: TrendingUp, value: "94%", label: "Success Rate" },
                { icon: CheckCircle, value: "500K+", label: "Resumes Created" },
                { icon: Sparkles, value: "24/7", label: "AI Support" },
              ].map((stat, i) => (
                <Card key={i} className="p-6 text-center hover-elevate">
                  <stat.icon className="h-8 w-8 text-primary mx-auto mb-3" />
                  <div className="font-accent text-3xl font-bold mb-1">{stat.value}</div>
                  <div className="text-sm text-muted-foreground">{stat.label}</div>
                </Card>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section id="testimonials" className="py-24 bg-card">
        <div className="container px-6 max-w-6xl mx-auto">
          <h2 className="font-accent text-4xl md:text-5xl font-bold text-center mb-16">Success Stories</h2>
          
          <div className="grid md:grid-cols-2 gap-8">
            {[
              {
                name: "Sarah Chen",
                role: "Recent Graduate → Software Engineer",
                quote: "LinkLaunch helped me translate my class projects into a resume that got me interviews at top tech companies. I landed my dream job in just 6 weeks!",
              },
              {
                name: "Michael Rodriguez",
                role: "Mid-Career → Senior Manager",
                quote: "The AI coaching helped me articulate my leadership experience in a way that resonated with recruiters. I got three offers above my target salary.",
              },
            ].map((testimonial, i) => (
              <Card key={i} className="p-8">
                <p className="text-lg mb-6 italic">"{testimonial.quote}"</p>
                <div>
                  <div className="font-semibold">{testimonial.name}</div>
                  <div className="text-sm text-muted-foreground">{testimonial.role}</div>
                </div>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section id="about" className="py-24">
        <div className="container px-6 max-w-4xl mx-auto text-center">
          <h2 className="font-accent text-4xl md:text-5xl font-bold mb-6">Ready to Launch Your Career?</h2>
          <p className="text-xl text-muted-foreground mb-12">
            Join thousands of professionals who have transformed their careers with AI-powered guidance.
          </p>
          <Button size="lg" className="text-lg px-8 py-6 h-auto" data-testid="button-start-launch-plan">
            Start My Launch Plan
            <ArrowRight className="ml-2 h-5 w-5" />
          </Button>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t py-12 bg-card">
        <div className="container px-6 max-w-6xl mx-auto">
          <div className="grid md:grid-cols-4 gap-8 mb-8">
            <div>
              <div className="flex items-center gap-2 mb-4">
                <Sparkles className="h-5 w-5 text-primary" />
                <span className="font-accent text-lg font-bold">LinkLaunch</span>
              </div>
              <p className="text-sm text-muted-foreground">
                AI-powered career coaching for every stage of your professional journey.
              </p>
            </div>
            
            <div>
              <h3 className="font-semibold mb-4">Paths</h3>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li><Link to="/college-grad-path" className="hover:text-foreground transition-colors">College Graduate</Link></li>
                <li><Link to="/experienced-path" className="hover:text-foreground transition-colors">Experienced Professional</Link></li>
                <li><Link to="/starter-path" className="hover:text-foreground transition-colors">Just Getting Started</Link></li>
              </ul>
            </div>
            
            <div>
              <h3 className="font-semibold mb-4">Resources</h3>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li><a href="#" className="hover:text-foreground transition-colors">Career Blog</a></li>
                <li><a href="#" className="hover:text-foreground transition-colors">Resume Templates</a></li>
                <li><a href="#" className="hover:text-foreground transition-colors">Interview Tips</a></li>
              </ul>
            </div>
            
            <div>
              <h3 className="font-semibold mb-4">Company</h3>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li><a href="#" className="hover:text-foreground transition-colors">About Us</a></li>
                <li><a href="#" className="hover:text-foreground transition-colors">Contact</a></li>
                <li><a href="#" className="hover:text-foreground transition-colors">Privacy Policy</a></li>
              </ul>
            </div>
          </div>
          
          <div className="pt-8 border-t text-center text-sm text-muted-foreground">
            © 2025 LinkLaunch. All rights reserved.
          </div>
        </div>
      </footer>
    </div>
  );
}
