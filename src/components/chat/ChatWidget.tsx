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

interface Message {
  id: string;
  content: string;
  sender: "user" | "ai";
  timestamp: Date;
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

      const aiMessage: Message = {
        id: `ai-${Date.now()}`,
        content: response,
        sender: "ai",
        timestamp: new Date(),
      };

      setMessages((prev) => [...prev, aiMessage]);
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
                            <p className="text-sm whitespace-pre-wrap break-words">
                              {message.content}
                            </p>
                            <span className="text-xs opacity-70 block text-right mt-1">
                              {formatTime(message.timestamp)}
                            </span>
                          </div>
                        </div>
                      ))}
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
