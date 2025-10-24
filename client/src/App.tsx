import { Switch, Route } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { SessionProvider } from "@/contexts/session-context";
import Home from "@/pages/home";
import CollegeGradPath from "@/pages/college-grad-path";
import ExperiencedPath from "@/pages/experienced-path";
import StarterPath from "@/pages/starter-path";
import NotFound from "@/pages/not-found";

function Router() {
  return (
    <Switch>
      <Route path="/" component={Home} />
      <Route path="/college-grad-path" component={CollegeGradPath} />
      <Route path="/experienced-path" component={ExperiencedPath} />
      <Route path="/starter-path" component={StarterPath} />
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <SessionProvider>
        <TooltipProvider>
          <Toaster />
          <Router />
        </TooltipProvider>
      </SessionProvider>
    </QueryClientProvider>
  );
}

export default App;
