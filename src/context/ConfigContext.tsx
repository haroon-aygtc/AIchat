import React, { createContext, useContext, useState, useEffect } from "react";
import ConfigurationService, {
  ChatSystemConfig,
} from "../services/configurationService";

interface ConfigContextType {
  config: ChatSystemConfig;
  allConfigurations: ChatSystemConfig[];
  updateConfig: (newConfig: Partial<ChatSystemConfig>) => void;
  updateWidgetAppearance: (newAppearance: any) => void;
  updateAIModelConfig: (newConfig: any) => void;
  updateKnowledgeBaseConfig: (newConfig: any) => void;
  updateResponseFormattingConfig: (newConfig: any) => void;
  createConfiguration: (config: Partial<ChatSystemConfig>) => ChatSystemConfig;
  deleteConfiguration: (id: string) => boolean;
  setActiveConfiguration: (id: string) => boolean;
  isLoading: boolean;
}

const ConfigContext = createContext<ConfigContextType | undefined>(undefined);

export const ConfigProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [config, setConfig] = useState<ChatSystemConfig>(
    ConfigurationService.getConfig(),
  );
  const [allConfigurations, setAllConfigurations] = useState<
    ChatSystemConfig[]
  >(ConfigurationService.getAllConfigurations());
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // In a real implementation, this would fetch from an API
    setConfig(ConfigurationService.getConfig());
    setAllConfigurations(ConfigurationService.getAllConfigurations());
    setIsLoading(false);
  }, []);

  const updateConfig = (newConfig: Partial<ChatSystemConfig>) => {
    const updatedConfig = ConfigurationService.updateConfig(newConfig);
    setConfig(updatedConfig);
    setAllConfigurations(ConfigurationService.getAllConfigurations());
  };

  const updateWidgetAppearance = (newAppearance: any) => {
    const updatedAppearance =
      ConfigurationService.updateWidgetAppearance(newAppearance);
    setConfig({
      ...config,
      widgetAppearance: updatedAppearance,
    });
    setAllConfigurations(ConfigurationService.getAllConfigurations());
  };

  const updateAIModelConfig = (newConfig: any) => {
    const updatedConfig = ConfigurationService.updateAIModelConfig(newConfig);
    setConfig({
      ...config,
      aiModel: updatedConfig,
    });
    setAllConfigurations(ConfigurationService.getAllConfigurations());
  };

  const updateKnowledgeBaseConfig = (newConfig: any) => {
    const updatedConfig =
      ConfigurationService.updateKnowledgeBaseConfig(newConfig);
    setConfig({
      ...config,
      knowledgeBase: updatedConfig,
    });
    setAllConfigurations(ConfigurationService.getAllConfigurations());
  };

  const updateResponseFormattingConfig = (newConfig: any) => {
    const updatedConfig =
      ConfigurationService.updateResponseFormattingConfig(newConfig);
    setConfig({
      ...config,
      responseFormatting: updatedConfig,
    });
    setAllConfigurations(ConfigurationService.getAllConfigurations());
  };

  const createConfiguration = (configData: Partial<ChatSystemConfig>) => {
    const newConfig = ConfigurationService.createConfiguration(configData);
    setAllConfigurations(ConfigurationService.getAllConfigurations());
    return newConfig;
  };

  const deleteConfiguration = (id: string) => {
    const result = ConfigurationService.deleteConfiguration(id);
    if (result) {
      setAllConfigurations(ConfigurationService.getAllConfigurations());
      setConfig(ConfigurationService.getConfig());
    }
    return result;
  };

  const setActiveConfiguration = (id: string) => {
    const result = ConfigurationService.setActiveConfiguration(id);
    if (result) {
      setConfig(ConfigurationService.getConfig());
      setAllConfigurations(ConfigurationService.getAllConfigurations());
    }
    return result;
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
