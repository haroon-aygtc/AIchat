// Configuration Service for managing chat widget and AI settings

import { AIModelConfig } from "./aiService";

export interface WidgetAppearance {
  primaryColor: string;
  secondaryColor: string;
  fontFamily: string;
  position: "bottom-right" | "bottom-left" | "top-right" | "top-left";
  initialMessage: string;
  title: string;
  subtitle: string;
  avatarUrl: string;
  logoUrl?: string;
  customCSS?: string;
}

export interface KnowledgeBaseConfig {
  enableKnowledgeBase: boolean;
  autoInjectRelevantContent: boolean;
  citeSources: boolean;
}

export interface ResponseFormattingConfig {
  enableFormatting: boolean;
  includeTitle: boolean;
  includeIntro: boolean;
  includeContentBlocks: boolean;
  includeFAQ: boolean;
  includeActions: boolean;
  includeDisclaimer: boolean;
  defaultDisclaimer: string;
  headingStyle?: "default" | "numbered" | "question" | "minimal";
  contentStyle?: "paragraphs" | "bullets" | "steps" | "cards";
  maxLength?: number;
}

export interface ChatSystemConfig {
  widgetAppearance: WidgetAppearance;
  knowledgeBase: KnowledgeBaseConfig;
  aiModel: AIModelConfig;
  responseFormatting: ResponseFormattingConfig;
}

// Default configuration
const defaultConfig: ChatSystemConfig = {
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

// Get the current configuration
const getConfig = (): ChatSystemConfig => {
  // In a real implementation, this would fetch from a database or API
  return { ...defaultConfig };
};

// Update the configuration
const updateConfig = (
  newConfig: Partial<ChatSystemConfig>,
): ChatSystemConfig => {
  // In a real implementation, this would update a database or API
  Object.assign(defaultConfig, newConfig);
  return { ...defaultConfig };
};

// Get widget appearance settings
const getWidgetAppearance = (): WidgetAppearance => {
  return { ...defaultConfig.widgetAppearance };
};

// Update widget appearance settings
const updateWidgetAppearance = (
  newAppearance: Partial<WidgetAppearance>,
): WidgetAppearance => {
  Object.assign(defaultConfig.widgetAppearance, newAppearance);
  return { ...defaultConfig.widgetAppearance };
};

// Get AI model settings
const getAIModelConfig = (): AIModelConfig => {
  return { ...defaultConfig.aiModel };
};

// Update AI model settings
const updateAIModelConfig = (
  newConfig: Partial<AIModelConfig>,
): AIModelConfig => {
  Object.assign(defaultConfig.aiModel, newConfig);
  return { ...defaultConfig.aiModel };
};

// Get knowledge base settings
const getKnowledgeBaseConfig = (): KnowledgeBaseConfig => {
  return { ...defaultConfig.knowledgeBase };
};

// Update knowledge base settings
const updateKnowledgeBaseConfig = (
  newConfig: Partial<KnowledgeBaseConfig>,
): KnowledgeBaseConfig => {
  Object.assign(defaultConfig.knowledgeBase, newConfig);
  return { ...defaultConfig.knowledgeBase };
};

// Get response formatting settings
const getResponseFormattingConfig = (): ResponseFormattingConfig => {
  return { ...defaultConfig.responseFormatting };
};

// Update response formatting settings
const updateResponseFormattingConfig = (
  newConfig: Partial<ResponseFormattingConfig>,
): ResponseFormattingConfig => {
  Object.assign(defaultConfig.responseFormatting, newConfig);
  return { ...defaultConfig.responseFormatting };
};

export const ConfigurationService = {
  getConfig,
  updateConfig,
  getWidgetAppearance,
  updateWidgetAppearance,
  getAIModelConfig,
  updateAIModelConfig,
  getKnowledgeBaseConfig,
  updateKnowledgeBaseConfig,
  getResponseFormattingConfig,
  updateResponseFormattingConfig,
};

export default ConfigurationService;
