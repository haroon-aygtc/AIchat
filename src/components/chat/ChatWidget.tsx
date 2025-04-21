import React, { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  MessageCircle,
  X,
  Send,
  Minimize2,
  Maximize2,
  ChevronDown,
  ChevronUp,
  Info,
  AlertCircle,
  CheckCircle2,
  HelpCircle,
  Lightbulb,
  Sparkles,
} from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
} from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Badge } from "@/components/ui/badge";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import ResponseFormatter from "./ResponseFormatter";
import FollowUpQuestionGenerator from "./FollowUpQuestionGenerator";

interface Message {
  id: string;
  content: string;
  sender: "user" | "ai";
  timestamp: Date;
  confidenceScore?: number;
  reasoningPath?: string[];
  sources?: {
    id: string;
    name: string;
    relevance: number;
    snippet?: string;
  }[];
}

interface ChatWidgetProps {
  title?: string;
  subtitle?: string;
  position?: "bottom-right" | "bottom-left" | "top-right" | "top-left";
  avatarUrl?: string;
  primaryColor?: string;
  initialMessage?: string;
  onSendMessage?: (message: string) => Promise<string>;
}

const ChatWidget = ({
  title = "AI Assistant",
  subtitle = "Ask me anything!",
  position = "bottom-right",
  avatarUrl = "https://api.dicebear.com/7.x/avataaars/svg?seed=aiassistant",
  primaryColor = "#4f46e5",
  initialMessage = "Hello! How can I help you today?",
  onSendMessage = async (message) =>
    `You said: ${message}. This is a default response. Please implement your AI logic.`,
}: ChatWidgetProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const [isMinimized, setIsMinimized] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputValue, setInputValue] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [widgetPosition, setWidgetPosition] = useState({ x: 0, y: 0 });
  const [dragConstraints, setDragConstraints] = useState({
    left: 0,
    right: 0,
    top: 0,
    bottom: 0,
  });
  const [showFollowUp, setShowFollowUp] = useState(false);
  const [currentTopic, setCurrentTopic] = useState("general inquiry");

  const chatContainerRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Add initial message when component mounts
  useEffect(() => {
    if (initialMessage) {
      setMessages([
        {
          id: "initial-message",
          content: initialMessage,
          sender: "ai",
          timestamp: new Date(),
        },
      ]);
    }
  }, [initialMessage]);

  // Set drag constraints based on window size
  useEffect(() => {
    const updateConstraints = () => {
      if (chatContainerRef.current) {
        const { width, height } =
          chatContainerRef.current.getBoundingClientRect();
        setDragConstraints({
          left: -window.innerWidth + width,
          right: 0,
          top: -window.innerHeight + height,
          bottom: 0,
        });
      }
    };

    updateConstraints();
    window.addEventListener("resize", updateConstraints);
    return () => window.removeEventListener("resize", updateConstraints);
  }, [isOpen]);

  // Scroll to bottom when messages change
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  // Focus input when chat opens
  useEffect(() => {
    if (isOpen && !isMinimized) {
      inputRef.current?.focus();
    }
  }, [isOpen, isMinimized]);

  const toggleChat = () => {
    setIsOpen(!isOpen);
    if (!isOpen) {
      setIsMinimized(false);
    }
  };

  const toggleMinimize = (e: React.MouseEvent) => {
    e.stopPropagation();
    setIsMinimized(!isMinimized);
  };

  const handleSendMessage = async () => {
    if (!inputValue.trim()) return;

    const userMessage: Message = {
      id: `user-${Date.now()}`,
      content: inputValue,
      sender: "user",
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setInputValue("");
    setIsLoading(true);

    try {
      const response = await onSendMessage(inputValue);

      // In a real implementation, the response would include confidence score and reasoning path
      // For demo purposes, we'll simulate these
      const confidenceScore = Math.floor(Math.random() * 29) + 70; // 70-99%

      const reasoningPath = [
        "Analyzed user query for intent",
        "Retrieved relevant knowledge base entries",
        "Applied prompt template based on query type",
        "Generated initial response draft",
        "Refined response based on context and formatting rules",
      ];

      const sources = [
        {
          id: "doc-1",
          name: "Product Documentation",
          relevance: 0.92,
          snippet: "Relevant information from the product documentation.",
        },
        {
          id: "kb-3",
          name: "Knowledge Base Article #3",
          relevance: 0.85,
          snippet: "Additional context from the knowledge base.",
        },
      ];

      const aiMessage: Message = {
        id: `ai-${Date.now()}`,
        content: response,
        sender: "ai",
        timestamp: new Date(),
        confidenceScore,
        reasoningPath,
        sources,
      };

      setMessages((prev) => [...prev, aiMessage]);

      // Show follow-up questions after AI response
      // In a real implementation, you would analyze the message content
      // to determine the appropriate topic for follow-up questions
      const topicMap: Record<string, string> = {
        password: "account",
        pricing: "pricing",
        cost: "pricing",
        product: "product information",
        technical: "technical support",
        error: "technical support",
        issue: "technical support",
      };

      // Simple topic detection based on keywords
      const lowerContent = inputValue.toLowerCase();
      let detectedTopic = "general inquiry";

      Object.entries(topicMap).forEach(([keyword, topic]) => {
        if (lowerContent.includes(keyword)) {
          detectedTopic = topic;
        }
      });

      setCurrentTopic(detectedTopic);
      setShowFollowUp(true);
    } catch (error) {
      console.error("Error sending message:", error);

      const errorMessage: Message = {
        id: `error-${Date.now()}`,
        content: "Sorry, I encountered an error processing your request.",
        sender: "ai",
        timestamp: new Date(),
      };

      setMessages((prev) => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const handleFollowUpQuestion = (question: string) => {
    setInputValue(question);
    setShowFollowUp(false);
    // Optional: auto-send the follow-up question
    // handleSendMessage();
  };

  const getPositionStyles = () => {
    switch (position) {
      case "bottom-left":
        return "left-4 bottom-4";
      case "top-right":
        return "right-4 top-4";
      case "top-left":
        return "left-4 top-4";
      case "bottom-right":
      default:
        return "right-4 bottom-4";
    }
  };

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
  };

  return (
    <div className="fixed z-50 bg-transparent" style={{ ...position }}>
      {/* Chat toggle button */}
      {!isOpen && (
        <motion.button
          className="rounded-full p-3 shadow-lg focus:outline-none"
          style={{ backgroundColor: primaryColor }}
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          onClick={toggleChat}
          aria-label="Open chat"
        >
          <MessageCircle className="h-6 w-6 text-white" />
        </motion.button>
      )}

      {/* Chat widget */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            ref={chatContainerRef}
            className={`${getPositionStyles()} fixed shadow-xl rounded-lg overflow-hidden bg-white`}
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.8 }}
            transition={{ type: "spring", damping: 25, stiffness: 300 }}
            drag={!isMinimized}
            dragConstraints={dragConstraints}
            dragElastic={0.1}
            onDragStart={() => setIsDragging(true)}
            onDragEnd={() => setIsDragging(false)}
            style={{ width: "350px", height: isMinimized ? "auto" : "500px" }}
          >
            <Card className="border-0 h-full flex flex-col bg-white">
              {/* Header */}
              <CardHeader
                className="p-3 flex flex-row items-center justify-between cursor-move"
                style={{ backgroundColor: primaryColor }}
              >
                <div className="flex items-center">
                  <Avatar className="h-8 w-8 mr-2">
                    <AvatarImage src={avatarUrl} alt="AI Assistant" />
                    <AvatarFallback>AI</AvatarFallback>
                  </Avatar>
                  <div>
                    <h3 className="text-sm font-medium text-white">{title}</h3>
                    <p className="text-xs text-white/80">{subtitle}</p>
                  </div>
                </div>
                <div className="flex space-x-1">
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-6 w-6 text-white hover:bg-white/20 rounded-full"
                    onClick={toggleMinimize}
                  >
                    {isMinimized ? (
                      <ChevronUp className="h-4 w-4" />
                    ) : (
                      <ChevronDown className="h-4 w-4" />
                    )}
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-6 w-6 text-white hover:bg-white/20 rounded-full"
                    onClick={toggleChat}
                  >
                    <X className="h-4 w-4" />
                  </Button>
                </div>
              </CardHeader>

              {/* Chat content */}
              {!isMinimized && (
                <>
                  <CardContent className="flex-grow p-0 overflow-hidden">
                    <ScrollArea className="h-[380px] p-4">
                      {messages.map((message) => (
                        <div
                          key={message.id}
                          className={`mb-4 flex ${message.sender === "user" ? "justify-end" : "justify-start"}`}
                        >
                          {message.sender === "ai" && (
                            <Avatar className="h-8 w-8 mr-2 flex-shrink-0">
                              <AvatarImage src={avatarUrl} alt="AI Assistant" />
                              <AvatarFallback>AI</AvatarFallback>
                            </Avatar>
                          )}
                          <div
                            className={`max-w-[80%] rounded-lg px-3 py-2 ${
                              message.sender === "user"
                                ? "bg-primary text-primary-foreground"
                                : "bg-muted"
                            }`}
                          >
                            {message.sender === "user" ? (
                              <p className="text-sm whitespace-pre-wrap break-words">
                                {message.content}
                              </p>
                            ) : (
                              <>
                                {message.confidenceScore && (
                                  <div className="flex items-center gap-1.5 mb-2">
                                    <TooltipProvider>
                                      <Tooltip>
                                        <TooltipTrigger asChild>
                                          <div className="flex items-center gap-1.5">
                                            <Sparkles className="h-3.5 w-3.5 text-primary" />
                                            <div className="w-24 h-1.5 bg-muted-foreground/20 rounded-full overflow-hidden">
                                              <div
                                                className={`h-full ${message.confidenceScore >= 90 ? "bg-green-500" : message.confidenceScore >= 75 ? "bg-primary" : "bg-amber-500"}`}
                                                style={{
                                                  width: `${message.confidenceScore}%`,
                                                }}
                                              />
                                            </div>
                                            <span className="text-xs font-medium">
                                              {message.confidenceScore}%
                                            </span>
                                          </div>
                                        </TooltipTrigger>
                                        <TooltipContent>
                                          <p>AI confidence score</p>
                                        </TooltipContent>
                                      </Tooltip>
                                    </TooltipProvider>
                                  </div>
                                )}
                                <ResponseFormatter
                                  response={message.content}
                                  format="structured"
                                  includeTitle={false}
                                  includeIntro={false}
                                  includeContentBlocks={true}
                                  includeFAQ={false}
                                  includeActions={false}
                                  includeDisclaimer={false}
                                  className="text-sm whitespace-pre-wrap break-words"
                                />

                                {message.sources &&
                                  message.sources.length > 0 && (
                                    <div className="mt-3 pt-2 border-t border-muted-foreground/20">
                                      <div className="flex items-center gap-1.5 mb-1.5 text-xs text-muted-foreground">
                                        <Info className="h-3 w-3" />
                                        <span>Sources:</span>
                                      </div>
                                      <div className="space-y-1">
                                        {message.sources.map((source) => (
                                          <div
                                            key={source.id}
                                            className="flex items-center gap-1.5"
                                          >
                                            <Badge
                                              variant="outline"
                                              className="text-xs py-0 h-5"
                                            >
                                              {source.name}
                                            </Badge>
                                            <span className="text-xs text-muted-foreground">
                                              {Math.round(
                                                source.relevance * 100,
                                              )}
                                              % match
                                            </span>
                                          </div>
                                        ))}
                                      </div>
                                    </div>
                                  )}

                                {message.reasoningPath && (
                                  <div className="mt-2 pt-2 border-t border-muted-foreground/20">
                                    <TooltipProvider>
                                      <Tooltip>
                                        <TooltipTrigger asChild>
                                          <Button
                                            variant="ghost"
                                            size="sm"
                                            className="h-6 text-xs px-2 text-muted-foreground hover:text-foreground"
                                          >
                                            <Lightbulb className="h-3 w-3 mr-1" />
                                            View reasoning path
                                          </Button>
                                        </TooltipTrigger>
                                        <TooltipContent className="w-60">
                                          <div className="space-y-1">
                                            <p className="font-medium text-xs">
                                              AI Reasoning Path:
                                            </p>
                                            <ol className="text-xs space-y-1 list-decimal list-inside">
                                              {message.reasoningPath.map(
                                                (step, index) => (
                                                  <li key={index}>{step}</li>
                                                ),
                                              )}
                                            </ol>
                                          </div>
                                        </TooltipContent>
                                      </Tooltip>
                                    </TooltipProvider>
                                  </div>
                                )}
                              </>
                            )}
                            <span className="text-xs opacity-70 block text-right mt-1">
                              {formatTime(message.timestamp)}
                            </span>
                          </div>
                        </div>
                      ))}

                      {showFollowUp &&
                        messages.length > 0 &&
                        messages[messages.length - 1].sender === "ai" && (
                          <div className="mt-6 mb-2">
                            <FollowUpQuestionGenerator
                              currentTopic={currentTopic}
                              onSelectQuestion={handleFollowUpQuestion}
                            />
                          </div>
                        )}

                      <div ref={messagesEndRef} />
                    </ScrollArea>
                  </CardContent>

                  {/* Input area */}
                  <CardFooter className="p-3 border-t">
                    <div className="flex w-full items-center space-x-2">
                      <Input
                        ref={inputRef}
                        type="text"
                        placeholder="Type your message..."
                        value={inputValue}
                        onChange={(e) => setInputValue(e.target.value)}
                        onKeyDown={handleKeyDown}
                        className="flex-grow"
                        disabled={isLoading}
                      />
                      <Button
                        onClick={handleSendMessage}
                        disabled={!inputValue.trim() || isLoading}
                        size="icon"
                        style={{ backgroundColor: primaryColor }}
                      >
                        <Send className="h-4 w-4" />
                      </Button>
                    </div>
                  </CardFooter>
                </>
              )}
            </Card>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default ChatWidget;
