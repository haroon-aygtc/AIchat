import { cn } from "@/lib/utils";
import { Sparkles } from "lucide-react";
import { Badge } from "./badge";

type AIBadgeProps = {
  className?: string;
  variant?: "default" | "outline" | "secondary" | "destructive";
  size?: "default" | "sm" | "lg";
  children?: React.ReactNode;
  showSparkles?: boolean;
};

export const AIBadge = ({
  className,
  variant = "default",
  size = "default",
  children,
  showSparkles = true,
}: AIBadgeProps) => {
  return (
    <Badge
      variant={variant}
      className={cn(
        "bg-gradient-to-r from-primary to-primary/80 text-primary-foreground",
        size === "sm" && "text-xs py-0 h-5",
        size === "lg" && "text-sm py-1 h-7",
        className,
      )}
    >
      {showSparkles && <Sparkles className="mr-1 h-3 w-3" />}
      {children || "AI-Powered"}
    </Badge>
  );
};
