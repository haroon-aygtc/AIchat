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
  relevanceThreshold?: number;
  maxSources?: number;
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
  id?: string;
  name?: string;
  description?: string;
  isActive?: boolean;
  createdAt?: Date;
  updatedAt?: Date;
  widgetAppearance: WidgetAppearance;
  knowledgeBase: KnowledgeBaseConfig;
  aiModel: AIModelConfig;
  responseFormatting: ResponseFormattingConfig;
}

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
const savedConfigurations: ChatSystemConfig[] = [
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

// Get the current configuration
const getConfig = (): ChatSystemConfig => {
  // In a real implementation, this would fetch from a database or API
  const activeConfig =
    savedConfigurations.find((config) => config.isActive) ||
    savedConfigurations[0];
  return { ...activeConfig };
};

// Get all saved configurations
const getAllConfigurations = (): ChatSystemConfig[] => {
  return [...savedConfigurations];
};

// Get a configuration by ID
const getConfigurationById = (id: string): ChatSystemConfig | undefined => {
  return savedConfigurations.find((config) => config.id === id);
};

// Create a new configuration
const createConfiguration = (
  config: Partial<ChatSystemConfig>,
): ChatSystemConfig => {
  const newConfig: ChatSystemConfig = {
    ...defaultConfig,
    ...config,
    id: `config-${Date.now()}`,
    createdAt: new Date(),
    updatedAt: new Date(),
    isActive: false,
  };

  savedConfigurations.push(newConfig);
  return newConfig;
};

// Delete a configuration
const deleteConfiguration = (id: string): boolean => {
  const index = savedConfigurations.findIndex((config) => config.id === id);
  if (index === -1) return false;

  // Don't allow deleting the default configuration
  if (id === "default") return false;

  // If deleting the active configuration, activate the default
  if (savedConfigurations[index].isActive) {
    const defaultConfig = savedConfigurations.find(
      (config) => config.id === "default",
    );
    if (defaultConfig) defaultConfig.isActive = true;
  }

  savedConfigurations.splice(index, 1);
  return true;
};

// Set a configuration as active
const setActiveConfiguration = (id: string): boolean => {
  const configToActivate = savedConfigurations.find(
    (config) => config.id === id,
  );
  if (!configToActivate) return false;

  // Deactivate all configurations
  savedConfigurations.forEach((config) => {
    config.isActive = config.id === id;
  });

  return true;
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
  getAllConfigurations,
  getConfigurationById,
  createConfiguration,
  deleteConfiguration,
  setActiveConfiguration,
};

export default ConfigurationService;
