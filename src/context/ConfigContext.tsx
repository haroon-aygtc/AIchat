import React, { createContext, useContext, useState, useEffect } from "react";
import ConfigurationService, {
  ChatSystemConfig,
} from "../services/configurationService";

interface ConfigContextType {
  config: ChatSystemConfig;
  updateConfig: (newConfig: Partial<ChatSystemConfig>) => void;
  updateWidgetAppearance: (newAppearance: any) => void;
  updateAIModelConfig: (newConfig: any) => void;
  updateKnowledgeBaseConfig: (newConfig: any) => void;
  updateResponseFormattingConfig: (newConfig: any) => void;
  isLoading: boolean;
}

const ConfigContext = createContext<ConfigContextType | undefined>(undefined);

export const ConfigProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [config, setConfig] = useState<ChatSystemConfig>(
    ConfigurationService.getConfig(),
  );
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // In a real implementation, this would fetch from an API
    setConfig(ConfigurationService.getConfig());
    setIsLoading(false);
  }, []);

  const updateConfig = (newConfig: Partial<ChatSystemConfig>) => {
    const updatedConfig = ConfigurationService.updateConfig(newConfig);
    setConfig(updatedConfig);
  };

  const updateWidgetAppearance = (newAppearance: any) => {
    const updatedAppearance =
      ConfigurationService.updateWidgetAppearance(newAppearance);
    setConfig({
      ...config,
      widgetAppearance: updatedAppearance,
    });
  };

  const updateAIModelConfig = (newConfig: any) => {
    const updatedConfig = ConfigurationService.updateAIModelConfig(newConfig);
    setConfig({
      ...config,
      aiModel: updatedConfig,
    });
  };

  const updateKnowledgeBaseConfig = (newConfig: any) => {
    const updatedConfig =
      ConfigurationService.updateKnowledgeBaseConfig(newConfig);
    setConfig({
      ...config,
      knowledgeBase: updatedConfig,
    });
  };

  const updateResponseFormattingConfig = (newConfig: any) => {
    const updatedConfig =
      ConfigurationService.updateResponseFormattingConfig(newConfig);
    setConfig({
      ...config,
      responseFormatting: updatedConfig,
    });
  };

  return (
    <ConfigContext.Provider
      value={{
        config,
        updateConfig,
        updateWidgetAppearance,
        updateAIModelConfig,
        updateKnowledgeBaseConfig,
        updateResponseFormattingConfig,
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
