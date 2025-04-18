import React, { useState } from "react";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import {
  Save,
  Plus,
  Settings,
  Database,
  MessageSquare,
  Palette,
  FileText,
} from "lucide-react";

interface ConfigurationPanelProps {
  onSave?: (config: any) => void;
}

const ConfigurationPanel = ({ onSave = () => {} }: ConfigurationPanelProps) => {
  const [activeTab, setActiveTab] = useState("knowledge-base");

  // Mock data for demonstration purposes
  const [knowledgeBaseConfig, setKnowledgeBaseConfig] = useState({
    enableKnowledgeBase: true,
    autoInjectRelevantContent: true,
    citeSources: true,
  });

  const [promptTemplates, setPromptTemplates] = useState([
    {
      id: "1",
      name: "General Inquiry",
      template:
        "Answer the following question: {{user_query}}. Be concise and helpful.",
    },
    {
      id: "2",
      name: "Technical Support",
      template:
        "Provide technical support for the following issue: {{user_query}}. Include step-by-step instructions.",
    },
  ]);

  const [aiModelConfig, setAiModelConfig] = useState({
    defaultModel: "gemini",
    temperature: 0.7,
    maxTokens: 1000,
    topP: 0.9,
  });

  const [widgetAppearance, setWidgetAppearance] = useState({
    primaryColor: "#4f46e5",
    secondaryColor: "#ffffff",
    fontFamily: "Inter",
    position: "bottom-right",
    initialMessage: "Hello! How can I help you today?",
  });

  const [responseFormatting, setResponseFormatting] = useState({
    enableFormatting: true,
    includeTitle: true,
    includeIntro: true,
    includeContentBlocks: true,
    includeFAQ: false,
    includeActions: true,
    includeDisclaimer: false,
    defaultDisclaimer:
      "This information is provided for general guidance only.",
  });

  const handleSaveConfig = () => {
    const config = {
      knowledgeBase: knowledgeBaseConfig,
      promptTemplates,
      aiModel: aiModelConfig,
      widgetAppearance,
      responseFormatting,
    };
    onSave(config);
  };

  return (
    <div className="w-full h-full bg-background p-6">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl font-bold">Configuration Panel</h1>
          <p className="text-muted-foreground">
            Configure your AI chat system settings
          </p>
        </div>
        <Button onClick={handleSaveConfig}>
          <Save className="mr-2 h-4 w-4" />
          Save Configuration
        </Button>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid grid-cols-5 gap-4 mb-6">
          <TabsTrigger value="knowledge-base" className="flex items-center">
            <Database className="mr-2 h-4 w-4" />
            Knowledge Base
          </TabsTrigger>
          <TabsTrigger value="prompt-templates" className="flex items-center">
            <MessageSquare className="mr-2 h-4 w-4" />
            Prompt Templates
          </TabsTrigger>
          <TabsTrigger value="ai-models" className="flex items-center">
            <Settings className="mr-2 h-4 w-4" />
            AI Models
          </TabsTrigger>
          <TabsTrigger value="widget-appearance" className="flex items-center">
            <Palette className="mr-2 h-4 w-4" />
            Widget Appearance
          </TabsTrigger>
          <TabsTrigger
            value="response-formatting"
            className="flex items-center"
          >
            <FileText className="mr-2 h-4 w-4" />
            Response Formatting
          </TabsTrigger>
        </TabsList>

        {/* Knowledge Base Tab */}
        <TabsContent value="knowledge-base" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Knowledge Base Settings</CardTitle>
              <CardDescription>
                Configure how the AI uses your knowledge base to enhance
                responses.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label htmlFor="enable-kb">Enable Knowledge Base</Label>
                  <p className="text-sm text-muted-foreground">
                    Allow the AI to use your knowledge base for responses
                  </p>
                </div>
                <Switch
                  id="enable-kb"
                  checked={knowledgeBaseConfig.enableKnowledgeBase}
                  onCheckedChange={(checked) =>
                    setKnowledgeBaseConfig({
                      ...knowledgeBaseConfig,
                      enableKnowledgeBase: checked,
                    })
                  }
                />
              </div>
              <Separator />
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label htmlFor="auto-inject">
                    Auto-inject Relevant Content
                  </Label>
                  <p className="text-sm text-muted-foreground">
                    Automatically include relevant knowledge base content in AI
                    responses
                  </p>
                </div>
                <Switch
                  id="auto-inject"
                  checked={knowledgeBaseConfig.autoInjectRelevantContent}
                  onCheckedChange={(checked) =>
                    setKnowledgeBaseConfig({
                      ...knowledgeBaseConfig,
                      autoInjectRelevantContent: checked,
                    })
                  }
                />
              </div>
              <Separator />
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label htmlFor="cite-sources">Cite Sources</Label>
                  <p className="text-sm text-muted-foreground">
                    Include citations when knowledge base content is used
                  </p>
                </div>
                <Switch
                  id="cite-sources"
                  checked={knowledgeBaseConfig.citeSources}
                  onCheckedChange={(checked) =>
                    setKnowledgeBaseConfig({
                      ...knowledgeBaseConfig,
                      citeSources: checked,
                    })
                  }
                />
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Prompt Templates Tab */}
        <TabsContent value="prompt-templates" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Prompt Templates</CardTitle>
              <CardDescription>
                Create and manage templates for different types of user queries.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="mb-4">
                <Button variant="outline">
                  <Plus className="mr-2 h-4 w-4" />
                  Add New Template
                </Button>
              </div>
              <div className="space-y-4">
                {promptTemplates.map((template) => (
                  <Card key={template.id}>
                    <CardHeader className="pb-2">
                      <div className="flex justify-between items-center">
                        <CardTitle className="text-lg">
                          {template.name}
                        </CardTitle>
                        <Badge variant="outline">Template</Badge>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-4">
                        <div>
                          <Label htmlFor={`template-name-${template.id}`}>
                            Template Name
                          </Label>
                          <Input
                            id={`template-name-${template.id}`}
                            value={template.name}
                            onChange={(e) => {
                              const updated = promptTemplates.map((t) =>
                                t.id === template.id
                                  ? { ...t, name: e.target.value }
                                  : t,
                              );
                              setPromptTemplates(updated);
                            }}
                          />
                        </div>
                        <div>
                          <Label htmlFor={`template-content-${template.id}`}>
                            Template Content
                          </Label>
                          <Textarea
                            id={`template-content-${template.id}`}
                            value={template.template}
                            rows={4}
                            onChange={(e) => {
                              const updated = promptTemplates.map((t) =>
                                t.id === template.id
                                  ? { ...t, template: e.target.value }
                                  : t,
                              );
                              setPromptTemplates(updated);
                            }}
                          />
                          <p className="text-xs text-muted-foreground mt-1">
                            Use {{ user_query }} to include the user's question.
                            Other placeholders: {{ business_name }},{" "}
                            {{ context }}
                          </p>
                        </div>
                        <div className="flex justify-end space-x-2">
                          <Button variant="outline" size="sm">
                            Delete
                          </Button>
                          <Button size="sm">Save</Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* AI Models Tab */}
        <TabsContent value="ai-models" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>AI Model Settings</CardTitle>
              <CardDescription>
                Configure which AI models to use and their parameters.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="default-model">Default AI Model</Label>
                <Select
                  value={aiModelConfig.defaultModel}
                  onValueChange={(value) =>
                    setAiModelConfig({ ...aiModelConfig, defaultModel: value })
                  }
                >
                  <SelectTrigger id="default-model">
                    <SelectValue placeholder="Select a model" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="gemini">Google Gemini</SelectItem>
                    <SelectItem value="huggingface">Hugging Face</SelectItem>
                    <SelectItem value="custom">Custom Model</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="temperature">Temperature</Label>
                  <div className="flex items-center space-x-2">
                    <Input
                      id="temperature"
                      type="number"
                      min="0"
                      max="1"
                      step="0.1"
                      value={aiModelConfig.temperature}
                      onChange={(e) =>
                        setAiModelConfig({
                          ...aiModelConfig,
                          temperature: parseFloat(e.target.value),
                        })
                      }
                    />
                    <span className="text-sm text-muted-foreground">0-1</span>
                  </div>
                  <p className="text-xs text-muted-foreground">
                    Controls randomness: lower values are more deterministic
                  </p>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="max-tokens">Max Tokens</Label>
                  <Input
                    id="max-tokens"
                    type="number"
                    min="100"
                    max="4000"
                    value={aiModelConfig.maxTokens}
                    onChange={(e) =>
                      setAiModelConfig({
                        ...aiModelConfig,
                        maxTokens: parseInt(e.target.value),
                      })
                    }
                  />
                  <p className="text-xs text-muted-foreground">
                    Maximum length of generated responses
                  </p>
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="top-p">Top P</Label>
                <div className="flex items-center space-x-2">
                  <Input
                    id="top-p"
                    type="number"
                    min="0"
                    max="1"
                    step="0.1"
                    value={aiModelConfig.topP}
                    onChange={(e) =>
                      setAiModelConfig({
                        ...aiModelConfig,
                        topP: parseFloat(e.target.value),
                      })
                    }
                  />
                  <span className="text-sm text-muted-foreground">0-1</span>
                </div>
                <p className="text-xs text-muted-foreground">
                  Controls diversity via nucleus sampling
                </p>
              </div>

              <div className="pt-4">
                <Button>Apply Model Settings</Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Widget Appearance Tab */}
        <TabsContent value="widget-appearance" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Widget Appearance</CardTitle>
              <CardDescription>
                Customize how your chat widget looks and behaves.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="primary-color">Primary Color</Label>
                  <div className="flex items-center space-x-2">
                    <Input
                      id="primary-color"
                      type="color"
                      value={widgetAppearance.primaryColor}
                      onChange={(e) =>
                        setWidgetAppearance({
                          ...widgetAppearance,
                          primaryColor: e.target.value,
                        })
                      }
                      className="w-12 h-8 p-1"
                    />
                    <Input
                      value={widgetAppearance.primaryColor}
                      onChange={(e) =>
                        setWidgetAppearance({
                          ...widgetAppearance,
                          primaryColor: e.target.value,
                        })
                      }
                      className="flex-1"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="secondary-color">Secondary Color</Label>
                  <div className="flex items-center space-x-2">
                    <Input
                      id="secondary-color"
                      type="color"
                      value={widgetAppearance.secondaryColor}
                      onChange={(e) =>
                        setWidgetAppearance({
                          ...widgetAppearance,
                          secondaryColor: e.target.value,
                        })
                      }
                      className="w-12 h-8 p-1"
                    />
                    <Input
                      value={widgetAppearance.secondaryColor}
                      onChange={(e) =>
                        setWidgetAppearance({
                          ...widgetAppearance,
                          secondaryColor: e.target.value,
                        })
                      }
                      className="flex-1"
                    />
                  </div>
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="font-family">Font Family</Label>
                <Select
                  value={widgetAppearance.fontFamily}
                  onValueChange={(value) =>
                    setWidgetAppearance({
                      ...widgetAppearance,
                      fontFamily: value,
                    })
                  }
                >
                  <SelectTrigger id="font-family">
                    <SelectValue placeholder="Select a font" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Inter">Inter</SelectItem>
                    <SelectItem value="Roboto">Roboto</SelectItem>
                    <SelectItem value="Open Sans">Open Sans</SelectItem>
                    <SelectItem value="Lato">Lato</SelectItem>
                    <SelectItem value="Poppins">Poppins</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="widget-position">Widget Position</Label>
                <Select
                  value={widgetAppearance.position}
                  onValueChange={(value) =>
                    setWidgetAppearance({
                      ...widgetAppearance,
                      position: value,
                    })
                  }
                >
                  <SelectTrigger id="widget-position">
                    <SelectValue placeholder="Select a position" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="bottom-right">Bottom Right</SelectItem>
                    <SelectItem value="bottom-left">Bottom Left</SelectItem>
                    <SelectItem value="top-right">Top Right</SelectItem>
                    <SelectItem value="top-left">Top Left</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="initial-message">Initial Message</Label>
                <Textarea
                  id="initial-message"
                  value={widgetAppearance.initialMessage}
                  onChange={(e) =>
                    setWidgetAppearance({
                      ...widgetAppearance,
                      initialMessage: e.target.value,
                    })
                  }
                  rows={3}
                />
                <p className="text-xs text-muted-foreground">
                  This message will be displayed when a user first opens the
                  chat
                </p>
              </div>

              <div className="pt-4">
                <Button>Preview Widget</Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Response Formatting Tab */}
        <TabsContent value="response-formatting" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Response Formatting</CardTitle>
              <CardDescription>
                Configure how AI responses are structured and formatted.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label htmlFor="enable-formatting">
                    Enable Response Formatting
                  </Label>
                  <p className="text-sm text-muted-foreground">
                    Apply structured formatting to AI responses
                  </p>
                </div>
                <Switch
                  id="enable-formatting"
                  checked={responseFormatting.enableFormatting}
                  onCheckedChange={(checked) =>
                    setResponseFormatting({
                      ...responseFormatting,
                      enableFormatting: checked,
                    })
                  }
                />
              </div>

              <Separator />

              <div className="space-y-4">
                <h3 className="text-sm font-medium">
                  Response Structure Elements
                </h3>
                <div className="grid grid-cols-2 gap-4">
                  <div className="flex items-center space-x-2">
                    <Switch
                      id="include-title"
                      checked={responseFormatting.includeTitle}
                      onCheckedChange={(checked) =>
                        setResponseFormatting({
                          ...responseFormatting,
                          includeTitle: checked,
                        })
                      }
                    />
                    <Label htmlFor="include-title">Include Title</Label>
                  </div>

                  <div className="flex items-center space-x-2">
                    <Switch
                      id="include-intro"
                      checked={responseFormatting.includeIntro}
                      onCheckedChange={(checked) =>
                        setResponseFormatting({
                          ...responseFormatting,
                          includeIntro: checked,
                        })
                      }
                    />
                    <Label htmlFor="include-intro">Include Introduction</Label>
                  </div>

                  <div className="flex items-center space-x-2">
                    <Switch
                      id="include-content-blocks"
                      checked={responseFormatting.includeContentBlocks}
                      onCheckedChange={(checked) =>
                        setResponseFormatting({
                          ...responseFormatting,
                          includeContentBlocks: checked,
                        })
                      }
                    />
                    <Label htmlFor="include-content-blocks">
                      Include Content Blocks
                    </Label>
                  </div>

                  <div className="flex items-center space-x-2">
                    <Switch
                      id="include-faq"
                      checked={responseFormatting.includeFAQ}
                      onCheckedChange={(checked) =>
                        setResponseFormatting({
                          ...responseFormatting,
                          includeFAQ: checked,
                        })
                      }
                    />
                    <Label htmlFor="include-faq">Include FAQ Section</Label>
                  </div>

                  <div className="flex items-center space-x-2">
                    <Switch
                      id="include-actions"
                      checked={responseFormatting.includeActions}
                      onCheckedChange={(checked) =>
                        setResponseFormatting({
                          ...responseFormatting,
                          includeActions: checked,
                        })
                      }
                    />
                    <Label htmlFor="include-actions">
                      Include Action Buttons
                    </Label>
                  </div>

                  <div className="flex items-center space-x-2">
                    <Switch
                      id="include-disclaimer"
                      checked={responseFormatting.includeDisclaimer}
                      onCheckedChange={(checked) =>
                        setResponseFormatting({
                          ...responseFormatting,
                          includeDisclaimer: checked,
                        })
                      }
                    />
                    <Label htmlFor="include-disclaimer">
                      Include Disclaimer
                    </Label>
                  </div>
                </div>
              </div>

              {responseFormatting.includeDisclaimer && (
                <div className="space-y-2">
                  <Label htmlFor="default-disclaimer">
                    Default Disclaimer Text
                  </Label>
                  <Textarea
                    id="default-disclaimer"
                    value={responseFormatting.defaultDisclaimer}
                    onChange={(e) =>
                      setResponseFormatting({
                        ...responseFormatting,
                        defaultDisclaimer: e.target.value,
                      })
                    }
                    rows={2}
                  />
                </div>
              )}

              <div className="pt-4">
                <Button>Apply Formatting Settings</Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default ConfigurationPanel;
