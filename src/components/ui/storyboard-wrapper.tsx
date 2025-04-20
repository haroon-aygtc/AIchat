import React from "react";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";
import { Spotlight } from "./spotlight";

interface StoryboardWrapperProps {
  children: React.ReactNode;
  title?: string;
  description?: string;
  className?: string;
  variant?: "default" | "gradient" | "subtle" | "glass";
  showAnimation?: boolean;
  showSpotlight?: boolean;
}

const StoryboardWrapper = ({
  children,
  title,
  description,
  className = "",
  variant = "default",
  showAnimation = true,
  showSpotlight = true,
}: StoryboardWrapperProps) => {
  const variants = {
    default: "bg-background",
    gradient: "bg-gradient-to-br from-background to-muted",
    subtle: "bg-muted/30",
    glass: "bg-background/80 backdrop-blur-sm",
  };

  const containerVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.5,
        staggerChildren: 0.1,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 10 },
    visible: { opacity: 1, y: 0 },
  };

  const Wrapper = showAnimation ? motion.div : "div";
  const HeaderWrapper = showAnimation ? motion.div : "div";
  const ContentWrapper = showAnimation ? motion.div : "div";

  return (
    <Wrapper
      className={cn(`p-6 ${variants[variant]}`, className)}
      initial={showAnimation ? "hidden" : undefined}
      animate={showAnimation ? "visible" : undefined}
      variants={showAnimation ? containerVariants : undefined}
    >
      {(title || description) && (
        <HeaderWrapper
          className="mb-6"
          variants={showAnimation ? itemVariants : undefined}
        >
          {title && (
            <h2 className="text-2xl font-bold tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-primary to-primary/70">
              {title}
            </h2>
          )}
          {description && (
            <p className="text-muted-foreground mt-1">{description}</p>
          )}
        </HeaderWrapper>
      )}
      <ContentWrapper
        className={cn(
          "border rounded-lg p-6 bg-white shadow-sm relative overflow-hidden",
          variant === "glass" && "bg-white/80 backdrop-blur-sm border-white/20",
        )}
        variants={showAnimation ? itemVariants : undefined}
      >
        {showSpotlight && <Spotlight />}
        <div className="relative z-10">{children}</div>
      </ContentWrapper>
    </Wrapper>
  );
};

export default StoryboardWrapper;
