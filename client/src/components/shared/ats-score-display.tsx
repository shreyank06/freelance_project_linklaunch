import { cn } from "@/lib/utils";

interface AtsScoreDisplayProps {
  percentage: number;
  size?: "sm" | "md" | "lg";
  className?: string;
}

export function AtsScoreDisplay({ percentage, size = "md", className }: AtsScoreDisplayProps) {
  const sizes = {
    sm: { container: "h-24 w-24", text: "text-2xl", stroke: 6 },
    md: { container: "h-32 w-32", text: "text-3xl", stroke: 8 },
    lg: { container: "h-40 w-40", text: "text-4xl", stroke: 10 },
  };

  const config = sizes[size];
  const circumference = 2 * Math.PI * 45;
  const strokeDashoffset = circumference - (percentage / 100) * circumference;

  const getColor = (score: number) => {
    if (score >= 80) return "hsl(142 70% 42%)";
    if (score >= 60) return "hsl(24 90% 55%)";
    return "hsl(0 84% 48%)";
  };

  return (
    <div className={cn("relative inline-flex items-center justify-center", className)}>
      <svg className={config.container} viewBox="0 0 100 100">
        {/* Background circle */}
        <circle
          cx="50"
          cy="50"
          r="45"
          fill="none"
          stroke="hsl(var(--muted))"
          strokeWidth={config.stroke}
        />
        {/* Progress circle */}
        <circle
          cx="50"
          cy="50"
          r="45"
          fill="none"
          stroke={getColor(percentage)}
          strokeWidth={config.stroke}
          strokeLinecap="round"
          strokeDasharray={circumference}
          strokeDashoffset={strokeDashoffset}
          transform="rotate(-90 50 50)"
          className="transition-all duration-1000 ease-out"
        />
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <span className={cn("font-accent font-bold", config.text)}>{percentage}%</span>
      </div>
    </div>
  );
}
