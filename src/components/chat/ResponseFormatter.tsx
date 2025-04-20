import React from "react";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

interface ResponseFormatterProps {
  response: string;
  format?: "default" | "structured" | "minimal";
  includeTitle?: boolean;
  includeIntro?: boolean;
  includeContentBlocks?: boolean;
  includeFAQ?: boolean;
  includeActions?: boolean;
  includeDisclaimer?: boolean;
  defaultDisclaimer?: string;
  className?: string;
  actions?: {
    label: string;
    onClick: () => void;
    icon?: React.ReactNode;
  }[];
}

const ResponseFormatter = ({
  response,
  format = "structured",
  includeTitle = true,
  includeIntro = true,
  includeContentBlocks = true,
  includeFAQ = false,
  includeActions = true,
  includeDisclaimer = false,
  defaultDisclaimer = "This information is provided for general guidance only.",
  className = "",
  actions = [],
}: ResponseFormatterProps) => {
  // In a real implementation, this would use NLP/AI to extract or generate these components
  // For demo purposes, we'll simulate structured content extraction
  const extractTitle = (text: string): string => {
    // Simple heuristic: first sentence or first line could be the title
    const firstLine = text.split("\n")[0].trim();
    if (firstLine.length < 60) return firstLine;

    const firstSentence = text.split(".")[0].trim();
    if (firstSentence.length < 60) return firstSentence + ".";

    return "Response Summary";
  };

  const extractIntro = (text: string): string => {
    // Simple heuristic: first paragraph after title could be intro
    const paragraphs = text.split("\n\n");
    if (paragraphs.length > 1) return paragraphs[0];

    const sentences = text.split(".");
    if (sentences.length > 2) return sentences[0] + ". " + sentences[1] + ".";

    return (
      text.substring(0, Math.min(150, text.length)) +
      (text.length > 150 ? "..." : "")
    );
  };

  const extractMainContent = (text: string): string => {
    // Simple heuristic: everything after intro
    const paragraphs = text.split("\n\n");
    if (paragraphs.length > 1) return paragraphs.slice(1).join("\n\n");

    return text;
  };

  const formatContentBlocks = (content: string): React.ReactNode => {
    // Simple formatting: split by paragraphs and add styling
    const paragraphs = content.split("\n\n");

    return (
      <div className="space-y-4">
        {paragraphs.map((paragraph, index) => {
          // Check if paragraph is a list
          if (paragraph.includes("\n- ") || paragraph.includes("\n* ")) {
            const listItems = paragraph
              .split("\n")
              .filter((line) => line.startsWith("- ") || line.startsWith("* "))
              .map((line) => line.substring(2));

            return (
              <ul key={index} className="list-disc pl-5 space-y-1">
                {listItems.map((item, i) => (
                  <li key={i}>{item}</li>
                ))}
              </ul>
            );
          }

          // Check if paragraph is numbered list
          if (/\d+\.\s/.test(paragraph)) {
            const listItems = paragraph
              .split("\n")
              .filter((line) => /^\d+\.\s/.test(line))
              .map((line) => line.replace(/^\d+\.\s/, ""));

            return (
              <ol key={index} className="list-decimal pl-5 space-y-1">
                {listItems.map((item, i) => (
                  <li key={i}>{item}</li>
                ))}
              </ol>
            );
          }

          return <p key={index}>{paragraph}</p>;
        })}
      </div>
    );
  };

  // Mock FAQ extraction - in a real implementation, this would use AI to generate FAQs
  const mockFAQs = [
    {
      question: "How can I get more information?",
      answer: "Contact our support team for more details.",
    },
    {
      question: "Is this information up to date?",
      answer: "This information is regularly updated to ensure accuracy.",
    },
  ];

  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 10 },
    visible: { opacity: 1, y: 0 },
  };

  if (format === "minimal") {
    return <div className={className}>{response}</div>;
  }

  const title = extractTitle(response);
  const intro = extractIntro(response);
  const mainContent = extractMainContent(response);

  return (
    <motion.div
      className={cn("space-y-4", className)}
      initial="hidden"
      animate="visible"
      variants={containerVariants}
    >
      {includeTitle && format === "structured" && (
        <motion.h3 className="text-lg font-medium" variants={itemVariants}>
          {title}
        </motion.h3>
      )}

      {includeIntro && format === "structured" && (
        <motion.p className="text-muted-foreground" variants={itemVariants}>
          {intro}
        </motion.p>
      )}

      {includeContentBlocks && format === "structured" ? (
        <motion.div variants={itemVariants}>
          {formatContentBlocks(mainContent)}
        </motion.div>
      ) : (
        <motion.div variants={itemVariants}>{response}</motion.div>
      )}

      {includeFAQ && format === "structured" && (
        <motion.div className="space-y-3 mt-6" variants={itemVariants}>
          <h4 className="text-sm font-medium">Frequently Asked Questions</h4>
          <div className="space-y-2">
            {mockFAQs.map((faq, index) => (
              <div key={index} className="bg-muted/20 p-3 rounded-md">
                <p className="text-sm font-medium">{faq.question}</p>
                <p className="text-sm">{faq.answer}</p>
              </div>
            ))}
          </div>
        </motion.div>
      )}

      {includeActions && actions.length > 0 && format === "structured" && (
        <motion.div
          className="flex flex-wrap gap-2 mt-4"
          variants={itemVariants}
        >
          {actions.map((action, index) => (
            <button
              key={index}
              onClick={action.onClick}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 text-sm bg-primary/10 hover:bg-primary/20 text-primary rounded-md transition-colors"
            >
              {action.icon}
              {action.label}
            </button>
          ))}
        </motion.div>
      )}

      {includeDisclaimer && format === "structured" && (
        <motion.p
          className="text-xs text-muted-foreground mt-4"
          variants={itemVariants}
        >
          {defaultDisclaimer}
        </motion.p>
      )}
    </motion.div>
  );
};

export default ResponseFormatter;
