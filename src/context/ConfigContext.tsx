import React, { createContext, useContext, useState, useEffect } from "react";
import ConfigurationService, {
  ChatSystemConfig,
} from "../services/configurationService";
import { defaultConfig } from "../mocks/data/configurations";

interface ConfigContextType {
  config: ChatSystemConfig;
  allConfigurations: ChatSystemConfig[];
  updateConfig: (newConfig: Partial<ChatSystemConfig>) => Promise<void>;
  updateWidgetAppearance: (newAppearance: any) => Promise<void>;
  updateAIModelConfig: (newConfig: any) => Promise<void>;
  updateKnowledgeBaseConfig: (newConfig: any) => Promise<void>;
  updateResponseFormattingConfig: (newConfig: any) => Promise<void>;
  createConfiguration: (
    config: Partial<ChatSystemConfig>,
  ) => Promise<ChatSystemConfig>;
  deleteConfiguration: (id: string) => Promise<boolean>;
  setActiveConfiguration: (id: string) => Promise<boolean>;
  isLoading: boolean;
}

const ConfigContext = createContext<ConfigContextType | undefined>(undefined);

export const ConfigProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [config, setConfig] = useState<ChatSystemConfig>(defaultConfig);
  const [allConfigurations, setAllConfigurations] = useState<
    ChatSystemConfig[]
  >([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setIsLoading(true);
        const activeConfig = await ConfigurationService.getConfig();
        const configurations =
          await ConfigurationService.getAllConfigurations();

        setConfig(activeConfig);
        setAllConfigurations(configurations);
      } catch (error) {
        console.error("Error fetching configurations:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, []);

  const updateConfig = async (newConfig: Partial<ChatSystemConfig>) => {
    try {
      setIsLoading(true);
      const updatedConfig = await ConfigurationService.updateConfig(newConfig);
      setConfig(updatedConfig);
      const configurations = await ConfigurationService.getAllConfigurations();
      setAllConfigurations(configurations);
    } catch (error) {
      console.error("Error updating config:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const updateWidgetAppearance = async (newAppearance: any) => {
    try {
      setIsLoading(true);
      const updatedAppearance =
        await ConfigurationService.updateWidgetAppearance(newAppearance);
      setConfig({
        ...config,
        widgetAppearance: updatedAppearance,
      });
      const configurations = await ConfigurationService.getAllConfigurations();
      setAllConfigurations(configurations);
    } catch (error) {
      console.error("Error updating widget appearance:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const updateAIModelConfig = async (newConfig: any) => {
    try {
      setIsLoading(true);
      const updatedConfig =
        await ConfigurationService.updateAIModelConfig(newConfig);
      setConfig({
        ...config,
        aiModel: updatedConfig,
      });
      const configurations = await ConfigurationService.getAllConfigurations();
      setAllConfigurations(configurations);
    } catch (error) {
      console.error("Error updating AI model config:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const updateKnowledgeBaseConfig = async (newConfig: any) => {
    try {
      setIsLoading(true);
      const updatedConfig =
        await ConfigurationService.updateKnowledgeBaseConfig(newConfig);
      setConfig({
        ...config,
        knowledgeBase: updatedConfig,
      });
      const configurations = await ConfigurationService.getAllConfigurations();
      setAllConfigurations(configurations);
    } catch (error) {
      console.error("Error updating knowledge base config:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const updateResponseFormattingConfig = async (newConfig: any) => {
    try {
      setIsLoading(true);
      const updatedConfig =
        await ConfigurationService.updateResponseFormattingConfig(newConfig);
      setConfig({
        ...config,
        responseFormatting: updatedConfig,
      });
      const configurations = await ConfigurationService.getAllConfigurations();
      setAllConfigurations(configurations);
    } catch (error) {
      console.error("Error updating response formatting config:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const createConfiguration = async (configData: Partial<ChatSystemConfig>) => {
    try {
      setIsLoading(true);
      const newConfig =
        await ConfigurationService.createConfiguration(configData);
      const configurations = await ConfigurationService.getAllConfigurations();
      setAllConfigurations(configurations);
      return newConfig;
    } catch (error) {
      console.error("Error creating configuration:", error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const deleteConfiguration = async (id: string) => {
    try {
      setIsLoading(true);
      const result = await ConfigurationService.deleteConfiguration(id);
      if (result) {
        const configurations =
          await ConfigurationService.getAllConfigurations();
        setAllConfigurations(configurations);
        const activeConfig = await ConfigurationService.getConfig();
        setConfig(activeConfig);
      }
      return result;
    } catch (error) {
      console.error("Error deleting configuration:", error);
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  const setActiveConfiguration = async (id: string) => {
    try {
      setIsLoading(true);
      const result = await ConfigurationService.setActiveConfiguration(id);
      if (result) {
        const activeConfig = await ConfigurationService.getConfig();
        setConfig(activeConfig);
        const configurations =
          await ConfigurationService.getAllConfigurations();
        setAllConfigurations(configurations);
      }
      return result;
    } catch (error) {
      console.error("Error setting active configuration:", error);
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <ConfigContext.Provider
      value={{
        config,
        allConfigurations,
        updateConfig,
        updateWidgetAppearance,
        updateAIModelConfig,
        updateKnowledgeBaseConfig,
        updateResponseFormattingConfig,
        createConfiguration,
        deleteConfiguration,
        setActiveConfiguration,
        isLoading,
      }}
    >
      {children}
    </ConfigContext.Provider>
  );
};

export const useConfig = () => {
  const context = useContext(ConfigContext);
  if (context === undefined) {
    throw new Error("useConfig must be used within a ConfigProvider");
  }
  return context;
};
