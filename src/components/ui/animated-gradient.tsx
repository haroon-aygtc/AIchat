import { cn } from "@/lib/utils";
import { useEffect, useRef } from "react";

type AnimatedGradientProps = {
  className?: string;
  containerClassName?: string;
  gradientClassName?: string;
  children?: React.ReactNode;
};

export const AnimatedGradient = ({
  className,
  containerClassName,
  gradientClassName,
  children,
}: AnimatedGradientProps) => {
  const containerRef = useRef<HTMLDivElement>(null);

  return (
    <div
      ref={containerRef}
      className={cn(
        "relative overflow-hidden rounded-[inherit]",
        containerClassName,
      )}
    >
      <div
        className={cn(
          "pointer-events-none absolute inset-0 z-0 transition duration-500 animate-gradient bg-gradient-to-r from-primary/20 via-secondary/20 to-primary/20 bg-[length:200%_auto]",
          gradientClassName,
        )}
      />
      <div className={cn("relative z-10", className)}>{children}</div>
    </div>
  );
};
