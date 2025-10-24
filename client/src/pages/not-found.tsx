import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { Home as HomeIcon } from "lucide-react";

export default function NotFound() {
  return (
    <div className="min-h-screen bg-background flex items-center justify-center px-6">
      <div className="max-w-md text-center">
        <h1 className="font-accent text-6xl font-bold text-primary mb-4">404</h1>
        <h2 className="font-accent text-2xl font-semibold mb-4">Page Not Found</h2>
        <p className="text-muted-foreground mb-8">
          Looks like you've wandered off the career path. Let's get you back on track!
        </p>
        <Link href="/">
          <Button data-testid="button-home">
            <HomeIcon className="mr-2 h-4 w-4" />
            Back to Home
          </Button>
        </Link>
      </div>
    </div>
  );
}
