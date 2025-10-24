import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

interface SkillTagCloudProps {
  skills: string[];
  highlightedSkills?: string[];
  pathColor?: string;
  className?: string;
}

export function SkillTagCloud({ skills, highlightedSkills = [], pathColor, className }: SkillTagCloudProps) {
  return (
    <div className={cn("flex flex-wrap gap-2", className)}>
      {skills.map((skill, index) => {
        const isHighlighted = highlightedSkills.includes(skill);
        return (
          <Badge
            key={index}
            variant={isHighlighted ? "default" : "secondary"}
            className={cn(
              "text-sm px-3 py-1",
              isHighlighted && pathColor && "text-white"
            )}
            style={isHighlighted && pathColor ? { backgroundColor: pathColor } : undefined}
            data-testid={`skill-tag-${index}`}
          >
            {skill}
          </Badge>
        );
      })}
    </div>
  );
}
