// Mock API service

import { configurations, defaultConfig } from "../data/configurations";
import { knowledgeSources, sourceStatistics } from "../data/knowledgeSources";
import { ChatSystemConfig } from "../../services/configurationService";
import { KnowledgeSource } from "../../services/knowledgeSourceService";

// Simulate API delay
const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

// Configuration API
const configApi = {
  // Get all configurations
  getAllConfigurations: async (): Promise<ChatSystemConfig[]> => {
    await delay(300); // Simulate network delay
    return [...configurations];
  },

  // Get active configuration
  getActiveConfiguration: async (): Promise<ChatSystemConfig> => {
    await delay(200);
    const activeConfig =
      configurations.find((config) => config.isActive) || configurations[0];
    return { ...activeConfig };
  },

  // Get configuration by ID
  getConfigurationById: async (
    id: string,
  ): Promise<ChatSystemConfig | undefined> => {
    await delay(200);
    return configurations.find((config) => config.id === id);
  },

  // Create new configuration
  createConfiguration: async (
    config: Partial<ChatSystemConfig>,
  ): Promise<ChatSystemConfig> => {
    await delay(500);
    const newConfig: ChatSystemConfig = {
      ...defaultConfig,
      ...config,
      id: `config-${Date.now()}`,
      createdAt: new Date(),
      updatedAt: new Date(),
      isActive: false,
    };

    configurations.push(newConfig);
    return newConfig;
  },

  // Update configuration
  updateConfiguration: async (
    id: string,
    updates: Partial<ChatSystemConfig>,
  ): Promise<ChatSystemConfig> => {
    await delay(400);
    const configIndex = configurations.findIndex((config) => config.id === id);
    if (configIndex === -1)
      throw new Error(`Configuration with ID ${id} not found`);

    configurations[configIndex] = {
      ...configurations[configIndex],
      ...updates,
      updatedAt: new Date(),
    };

    return configurations[configIndex];
  },

  // Delete configuration
  deleteConfiguration: async (id: string): Promise<boolean> => {
    await delay(300);
    const configIndex = configurations.findIndex((config) => config.id === id);
    if (configIndex === -1) return false;
    if (id === "default") return false; // Don't allow deleting default config

    // If deleting active config, activate default
    if (configurations[configIndex].isActive) {
      const defaultConfigIndex = configurations.findIndex(
        (config) => config.id === "default",
      );
      if (defaultConfigIndex !== -1)
        configurations[defaultConfigIndex].isActive = true;
    }

    configurations.splice(configIndex, 1);
    return true;
  },

  // Set active configuration
  setActiveConfiguration: async (id: string): Promise<boolean> => {
    await delay(300);
    const configToActivate = configurations.find((config) => config.id === id);
    if (!configToActivate) return false;

    // Deactivate all configurations
    configurations.forEach((config) => {
      config.isActive = config.id === id;
    });

    return true;
  },
};

// Knowledge Source API
const knowledgeSourceApi = {
  // Get all knowledge sources
  getAllSources: async (): Promise<KnowledgeSource[]> => {
    await delay(300);
    return [...knowledgeSources];
  },

  // Get source by ID
  getSourceById: async (id: string): Promise<KnowledgeSource | undefined> => {
    await delay(200);
    return knowledgeSources.find((source) => source.id === id);
  },

  // Update source status (active/inactive)
  updateSourceStatus: async (
    id: string,
    isActive: boolean,
  ): Promise<KnowledgeSource | undefined> => {
    await delay(300);
    const sourceIndex = knowledgeSources.findIndex(
      (source) => source.id === id,
    );
    if (sourceIndex === -1) return undefined;

    knowledgeSources[sourceIndex].isActive = isActive;
    return knowledgeSources[sourceIndex];
  },

  // Get source statistics
  getSourceStatistics: async (id: string): Promise<any> => {
    await delay(200);
    return sourceStatistics[id as keyof typeof sourceStatistics] || null;
  },
};

export { configApi, knowledgeSourceApi };
