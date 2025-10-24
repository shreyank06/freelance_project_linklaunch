import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import { useLocation } from "wouter";

interface ModuleHeaderProps {
  title: string;
  description: string;
  pathColor: string;
  showBack?: boolean;
}

export function ModuleHeader({ title, description, pathColor, showBack = true }: ModuleHeaderProps) {
  const [, setLocation] = useLocation();

  return (
    <div className="border-b bg-card">
      <div className="container max-w-6xl mx-auto px-6 py-6">
        <div className="flex items-start justify-between gap-4">
          <div className="flex-1">
            {showBack && (
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setLocation('/')}
                className="mb-4"
                data-testid="button-back"
              >
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back to Home
              </Button>
            )}
            <div 
              className="inline-block px-3 py-1 rounded-full text-white text-sm font-medium mb-3"
              style={{ backgroundColor: pathColor }}
            >
              Current Module
            </div>
            <h1 className="font-accent text-3xl md:text-4xl font-bold mb-2">{title}</h1>
            <p className="text-lg text-muted-foreground max-w-3xl">{description}</p>
          </div>
        </div>
      </div>
    </div>
  );
}
