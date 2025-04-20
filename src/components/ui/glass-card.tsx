import { cn } from "@/lib/utils";
import { Spotlight } from "./spotlight";
import { AnimatedGradient } from "./animated-gradient";

type GlassCardProps = {
  className?: string;
  children: React.ReactNode;
  spotlight?: boolean;
  gradient?: boolean;
  hoverEffect?: boolean;
};

export const GlassCard = ({
  className,
  children,
  spotlight = true,
  gradient = false,
  hoverEffect = true,
}: GlassCardProps) => {
  return (
    <div
      className={cn(
        "relative overflow-hidden rounded-xl border bg-background/30 p-6 backdrop-blur-md transition-all",
        hoverEffect &&
          "hover:shadow-lg hover:shadow-primary/5 hover:-translate-y-1",
        className,
      )}
    >
      {spotlight && <Spotlight />}
      {gradient ? <AnimatedGradient>{children}</AnimatedGradient> : children}
    </div>
  );
};
