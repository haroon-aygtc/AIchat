// Configuration Service for managing chat widget and AI settings
import { configApi } from "../mocks/api";
import { AIModelConfig } from "./aiService";
import { defaultConfig } from "../mocks/data/configurations";

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

// Cache for active configuration
let activeConfigCache: ChatSystemConfig | null = null;

// Get the current configuration
const getConfig = async (): Promise<ChatSystemConfig> => {
  if (!activeConfigCache) {
    activeConfigCache = await configApi.getActiveConfiguration();
  }
  return { ...activeConfigCache };
};

// Get all saved configurations
const getAllConfigurations = async (): Promise<ChatSystemConfig[]> => {
  return await configApi.getAllConfigurations();
};

// Get a configuration by ID
const getConfigurationById = async (
  id: string,
): Promise<ChatSystemConfig | undefined> => {
  return await configApi.getConfigurationById(id);
};

// Create a new configuration
const createConfiguration = async (
  config: Partial<ChatSystemConfig>,
): Promise<ChatSystemConfig> => {
  return await configApi.createConfiguration(config);
};

// Delete a configuration
const deleteConfiguration = async (id: string): Promise<boolean> => {
  const result = await configApi.deleteConfiguration(id);
  if (result) {
    // Clear cache if we deleted the active config
    const deletedConfig = await configApi.getConfigurationById(id);
    if (deletedConfig?.isActive) {
      activeConfigCache = null;
    }
  }
  return result;
};

// Set a configuration as active
const setActiveConfiguration = async (id: string): Promise<boolean> => {
  const result = await configApi.setActiveConfiguration(id);
  if (result) {
    // Update cache with the new active config
    activeConfigCache = (await configApi.getConfigurationById(id)) || null;
  }
  return result;
};

// Update the configuration
const updateConfig = async (
  newConfig: Partial<ChatSystemConfig>,
): Promise<ChatSystemConfig> => {
  if (!activeConfigCache?.id) {
    activeConfigCache = await getConfig();
  }
  const updatedConfig = await configApi.updateConfiguration(
    activeConfigCache.id || "default",
    newConfig,
  );
  activeConfigCache = updatedConfig;
  return updatedConfig;
};

// Get widget appearance settings
const getWidgetAppearance = async (): Promise<WidgetAppearance> => {
  const config = await getConfig();
  return { ...config.widgetAppearance };
};

// Update widget appearance settings
const updateWidgetAppearance = async (
  newAppearance: Partial<WidgetAppearance>,
): Promise<WidgetAppearance> => {
  if (!activeConfigCache?.id) {
    activeConfigCache = await getConfig();
  }
  const updatedConfig = await configApi.updateConfiguration(
    activeConfigCache.id || "default",
    {
      widgetAppearance: {
        ...activeConfigCache.widgetAppearance,
        ...newAppearance,
      },
    },
  );
  activeConfigCache = updatedConfig;
  return updatedConfig.widgetAppearance;
};

// Get AI model settings
const getAIModelConfig = async (): Promise<AIModelConfig> => {
  const config = await getConfig();
  return { ...config.aiModel };
};

// Update AI model settings
const updateAIModelConfig = async (
  newConfig: Partial<AIModelConfig>,
): Promise<AIModelConfig> => {
  if (!activeConfigCache?.id) {
    activeConfigCache = await getConfig();
  }
  const updatedConfig = await configApi.updateConfiguration(
    activeConfigCache.id || "default",
    {
      aiModel: { ...activeConfigCache.aiModel, ...newConfig },
    },
  );
  activeConfigCache = updatedConfig;
  return updatedConfig.aiModel;
};

// Get knowledge base settings
const getKnowledgeBaseConfig = async (): Promise<KnowledgeBaseConfig> => {
  const config = await getConfig();
  return { ...config.knowledgeBase };
};

// Update knowledge base settings
const updateKnowledgeBaseConfig = async (
  newConfig: Partial<KnowledgeBaseConfig>,
): Promise<KnowledgeBaseConfig> => {
  if (!activeConfigCache?.id) {
    activeConfigCache = await getConfig();
  }
  const updatedConfig = await configApi.updateConfiguration(
    activeConfigCache.id || "default",
    {
      knowledgeBase: { ...activeConfigCache.knowledgeBase, ...newConfig },
    },
  );
  activeConfigCache = updatedConfig;
  return updatedConfig.knowledgeBase;
};

// Get response formatting settings
const getResponseFormattingConfig =
  async (): Promise<ResponseFormattingConfig> => {
    const config = await getConfig();
    return { ...config.responseFormatting };
  };

// Update response formatting settings
const updateResponseFormattingConfig = async (
  newConfig: Partial<ResponseFormattingConfig>,
): Promise<ResponseFormattingConfig> => {
  if (!activeConfigCache?.id) {
    activeConfigCache = await getConfig();
  }
  const updatedConfig = await configApi.updateConfiguration(
    activeConfigCache.id || "default",
    {
      responseFormatting: {
        ...activeConfigCache.responseFormatting,
        ...newConfig,
      },
    },
  );
  activeConfigCache = updatedConfig;
  return updatedConfig.responseFormatting;
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
