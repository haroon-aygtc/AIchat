// Mock data for configurations

import { ChatSystemConfig } from "../../services/configurationService";

// Default configuration
const defaultConfig: ChatSystemConfig = {
  id: "default",
  name: "Default Configuration",
  description: "The default AI assistant configuration",
  isActive: true,
  createdAt: new Date(),
  updatedAt: new Date(),
  widgetAppearance: {
    primaryColor: "#4f46e5",
    secondaryColor: "#ffffff",
    fontFamily: "Inter",
    position: "bottom-right",
    initialMessage: "Hello! How can I help you today?",
    title: "AI Assistant",
    subtitle: "Ask me anything!",
    avatarUrl: "https://api.dicebear.com/7.x/avataaars/svg?seed=aiassistant",
  },
  knowledgeBase: {
    enableKnowledgeBase: true,
    autoInjectRelevantContent: true,
    citeSources: true,
    relevanceThreshold: 75,
    maxSources: 3,
  },
  aiModel: {
    modelType: "gemini",
    temperature: 0.7,
    maxTokens: 1000,
    topP: 0.9,
  },
  responseFormatting: {
    enableFormatting: true,
    includeTitle: true,
    includeIntro: true,
    includeContentBlocks: true,
    includeFAQ: false,
    includeActions: true,
    includeDisclaimer: false,
    defaultDisclaimer:
      "This information is provided for general guidance only.",
    headingStyle: "default",
    contentStyle: "paragraphs",
    maxLength: 500,
  },
};

// Saved configurations
const configurations: ChatSystemConfig[] = [
  {
    ...defaultConfig,
    id: "default",
    name: "Default Configuration",
    description: "The default AI assistant configuration",
    isActive: true,
  },
  {
    ...defaultConfig,
    id: "customer-support",
    name: "Customer Support",
    description: "Optimized for customer support interactions",
    isActive: false,
    aiModel: {
      modelType: "gemini",
      temperature: 0.5,
      maxTokens: 800,
      topP: 0.95,
    },
    responseFormatting: {
      enableFormatting: true,
      includeTitle: false,
      includeIntro: true,
      includeContentBlocks: true,
      includeFAQ: true,
      includeActions: true,
      includeDisclaimer: true,
      defaultDisclaimer:
        "For additional assistance, please contact our support team.",
      headingStyle: "question",
      contentStyle: "steps",
      maxLength: 600,
    },
  },
  {
    ...defaultConfig,
    id: "sales-assistant",
    name: "Sales Assistant",
    description: "Configured for product inquiries and sales",
    isActive: false,
    widgetAppearance: {
      primaryColor: "#10b981",
      secondaryColor: "#ffffff",
      fontFamily: "Poppins",
      position: "bottom-right",
      initialMessage:
        "Hello! I can help you find the perfect product for your needs. What are you looking for today?",
      title: "Sales Assistant",
      subtitle: "Product recommendations & more",
      avatarUrl: "https://api.dicebear.com/7.x/avataaars/svg?seed=sales",
    },
    aiModel: {
      modelType: "gemini",
      temperature: 0.8,
      maxTokens: 1200,
      topP: 0.9,
    },
  },
];

export { defaultConfig, configurations };
