import { CheckCircle, Circle } from "lucide-react";
import { cn } from "@/lib/utils";
import type { ModuleType } from "@shared/schema";

interface Module {
  id: ModuleType;
  title: string;
  completed: boolean;
  active: boolean;
}

interface ProgressTrackerProps {
  modules: Module[];
  pathColor: string;
}

export function ProgressTracker({ modules, pathColor }: ProgressTrackerProps) {
  const completedCount = modules.filter(m => m.completed).length;
  const percentage = Math.round((completedCount / modules.length) * 100);

  return (
    <div className="space-y-6">
      <div>
        <div className="flex items-center justify-between mb-2">
          <span className="text-sm font-medium">Progress</span>
          <span className="text-sm font-medium">{percentage}%</span>
        </div>
        <div className="h-2 rounded-full bg-muted overflow-hidden">
          <div 
            className="h-full transition-all duration-500 rounded-full"
            style={{ 
              width: `${percentage}%`,
              backgroundColor: pathColor
            }}
          />
        </div>
      </div>

      <div className="space-y-2">
        {modules.map((module, index) => (
          <div
            key={module.id}
            className={cn(
              "flex items-center gap-3 p-3 rounded-lg transition-colors",
              module.active && "bg-accent",
              !module.active && "hover-elevate cursor-pointer"
            )}
            data-testid={`module-${module.id}`}
          >
            <div className="flex-shrink-0">
              {module.completed ? (
                <CheckCircle className="h-5 w-5" style={{ color: pathColor }} />
              ) : (
                <Circle className="h-5 w-5 text-muted-foreground" />
              )}
            </div>
            <div className="flex-1 min-w-0">
              <div className={cn(
                "text-sm font-medium truncate",
                module.active && "text-foreground",
                !module.active && module.completed && "text-foreground",
                !module.active && !module.completed && "text-muted-foreground"
              )}>
                {index + 1}. {module.title}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
