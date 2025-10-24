import { Bot, Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";

interface AiChatBubbleProps {
  message: string;
  isLoading?: boolean;
  className?: string;
}

export function AiChatBubble({ message, isLoading, className }: AiChatBubbleProps) {
  return (
    <div className={cn("flex gap-3", className)}>
      <div className="flex-shrink-0 h-10 w-10 rounded-full bg-primary flex items-center justify-center">
        <Bot className="h-5 w-5 text-primary-foreground" />
      </div>
      <div className="flex-1 bg-card border rounded-2xl rounded-tl-none p-4 max-w-2xl">
        {isLoading ? (
          <div className="flex items-center gap-2 text-muted-foreground">
            <Loader2 className="h-4 w-4 animate-spin" />
            <span className="text-sm">AI is thinking...</span>
          </div>
        ) : (
          <p className="text-base leading-relaxed whitespace-pre-wrap">{message}</p>
        )}
      </div>
    </div>
  );
}
