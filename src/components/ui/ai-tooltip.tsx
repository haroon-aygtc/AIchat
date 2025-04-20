import { useState, useEffect } from "react";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "./tooltip";
import { Sparkles } from "lucide-react";
import { cn } from "@/lib/utils";

type AITooltipProps = {
  children: React.ReactNode;
  content: React.ReactNode;
  className?: string;
  contextAware?: boolean;
  delay?: number;
};

export const AITooltip = ({
  children,
  content,
  className,
  contextAware = true,
  delay = 300,
}: AITooltipProps) => {
  const [tooltipContent, setTooltipContent] = useState(content);
  const [open, setOpen] = useState(false);

  // Simulate context-aware tooltip content
  useEffect(() => {
    if (contextAware && open) {
      // In a real app, this would analyze the page context
      // and provide relevant tooltip content
      const pageContext = "current page";
      const userContext = "recent actions";

      // This is just a simulation - in a real app this would be dynamic
      if (typeof content === "string") {
        setTooltipContent(
          <div className="space-y-2">
            <div className="flex items-center gap-1 text-primary">
              <Sparkles className="h-3 w-3" />
              <span className="text-xs font-medium">AI-Enhanced Tip</span>
            </div>
            <p>{content}</p>
            <div className="text-xs text-muted-foreground pt-1">
              Based on your current context
            </div>
          </div>,
        );
      }
    } else {
      setTooltipContent(content);
    }
  }, [content, contextAware, open]);

  return (
    <TooltipProvider>
      <Tooltip delayDuration={delay} onOpenChange={setOpen}>
        <TooltipTrigger asChild>{children}</TooltipTrigger>
        <TooltipContent
          className={cn(
            "p-3 rounded-lg border shadow-md max-w-xs",
            contextAware && "bg-background/95 backdrop-blur-sm",
            className,
          )}
        >
          {tooltipContent}
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
};
