import React from "react";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
import { MessageSquare, Sparkles } from "lucide-react";

interface FollowUpQuestionGeneratorProps {
  currentTopic: string;
  onSelectQuestion: (question: string) => void;
  className?: string;
}

const FollowUpQuestionGenerator = ({
  currentTopic = "general inquiry",
  onSelectQuestion,
  className = "",
}: FollowUpQuestionGeneratorProps) => {
  // In a real implementation, these would be dynamically generated based on the conversation context
  // and potentially using an AI model to generate relevant follow-up questions
  const generateQuestions = (topic: string): string[] => {
    const questionSets: Record<string, string[]> = {
      "general inquiry": [
        "Can you provide more details about your services?",
        "What are your business hours?",
        "How can I contact customer support?",
      ],
      "technical support": [
        "Have you tried restarting the device?",
        "What error message are you seeing?",
        "Which version of the software are you using?",
      ],
      "product information": [
        "What are the key features of this product?",
        "How does this compare to your other offerings?",
        "Is there a warranty included?",
      ],
      pricing: [
        "Are there any discounts available?",
        "Do you offer subscription plans?",
        "What payment methods do you accept?",
      ],
      account: [
        "How do I reset my password?",
        "Can I change my email address?",
        "How do I update my billing information?",
      ],
    };

    return questionSets[topic.toLowerCase()] || questionSets["general inquiry"];
  };

  const questions = generateQuestions(currentTopic);

  return (
    <div className={`space-y-2 ${className}`}>
      <div className="flex items-center gap-2 text-sm text-muted-foreground mb-1">
        <Sparkles className="h-3.5 w-3.5" />
        <span>Suggested follow-up questions</span>
      </div>
      <div className="flex flex-wrap gap-2">
        {questions.map((question, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
          >
            <Button
              variant="outline"
              size="sm"
              className="text-sm flex items-center gap-1.5 bg-primary/5 hover:bg-primary/10 border-primary/10"
              onClick={() => onSelectQuestion(question)}
            >
              <MessageSquare className="h-3 w-3" />
              {question}
            </Button>
          </motion.div>
        ))}
      </div>
    </div>
  );
};

export default FollowUpQuestionGenerator;
