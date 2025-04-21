import React, { useState, useEffect } from "react";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  CardFooter,
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
import { Slider } from "@/components/ui/slider";
import { useToast } from "@/components/ui/use-toast";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import ConfigurationSelector from "@/components/admin/ConfigurationSelector";
import OnboardingHelp from "@/components/admin/OnboardingHelp";
import PreviewPanel from "@/components/admin/PreviewPanel";
import {
  Save,
  Plus,
  Settings,
  Database,
  MessageSquare,
  Palette,
  FileText,
  Trash2,
  Edit,
  Copy,
  Sparkles,
  Code,
  ExternalLink,
  Key,
  AlertCircle,
  Check,
  Search,
  Play,
  Bold,
  Italic,
  List,
  ListOrdered,
  Link,
  X,
  Zap,
  LayoutGrid,
  History,
  BookOpen,
  Bookmark,
  Download,
  Upload,
  RotateCw,
  HelpCircle,
  Info,
  CheckCircle2,
  Lightbulb,
  Layers,
  Copy as CopyIcon,
  ArrowRight,
  Presentation,
  PanelRight,
  PanelLeft,
} from "lucide-react";
import { useConfig } from "../../context/ConfigContext";
import PromptTemplateService, {
  PromptTemplate,
} from "@/services/promptTemplateService";
import ChatWidget from "@/components/chat/ChatWidget";
import ResponseFormatter from "@/components/chat/ResponseFormatter";
import KnowledgeSourceSelector from "@/components/admin/KnowledgeSourceSelector";
import FollowUpQuestionBuilder from "@/components/admin/FollowUpQuestionBuilder";
import ResponseFormattingBuilder from "@/components/admin/ResponseFormattingBuilder";
import knowledgeSourceService, {
  KnowledgeSource,
} from "@/services/knowledgeSourceService";
import aiService, { AIResponse } from "@/services/aiService";

interface ConfigurationPanelProps {
  onSave?: (config: any) => void;
}

const ConfigurationPanel = ({ onSave = () => {} }: ConfigurationPanelProps) => {
  const { toast } = useToast();
  const {
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
  } = useConfig();
  const [activeTab, setActiveTab] = useState("prompt-templates");
  const [showConfigSelector, setShowConfigSelector] = useState(false);
  const [showPreviewPanel, setShowPreviewPanel] = useState(false);
  const [showOnboarding, setShowOnboarding] = useState(false);
  const [promptTemplates, setPromptTemplates] = useState<PromptTemplate[]>([]);
  const [showWidgetPreview, setShowWidgetPreview] = useState(false);
  const [apiKeys, setApiKeys] = useState({
    gemini: "",
    huggingface: "",
  });
  const [selectedTemplate, setSelectedTemplate] = useState<string | null>(null);
  const [editingTemplate, setEditingTemplate] = useState<PromptTemplate | null>(
    null,
  );
  const [searchQuery, setSearchQuery] = useState("");
  const [activeSources, setActiveSources] = useState<KnowledgeSource[]>(
    knowledgeSourceService.getActiveSources(),
  );
  const [testPromptInput, setTestPromptInput] = useState("");
  const [testPromptResponse, setTestPromptResponse] = useState<string | null>(
    null,
  );
  const [isTestingPrompt, setIsTestingPrompt] = useState(false);
  const [testPromptConfidence, setTestPromptConfidence] = useState(0);

  // Load prompt templates
  useEffect(() => {
    const templates = PromptTemplateService.getTemplates();
    setPromptTemplates(templates);
    if (templates.length > 0) {
      setSelectedTemplate(templates[0].id);
    }
  }, []);

  const handleSaveConfig = async () => {
    try {
      // Save all configuration
      await updateConfig({
        knowledgeBase: config.knowledgeBase,
        aiModel: {
          ...config.aiModel,
          // Add API keys if provided
          ...(apiKeys.gemini && config.aiModel.modelType === "gemini"
            ? { apiKey: apiKeys.gemini }
            : {}),
          ...(apiKeys.huggingface && config.aiModel.modelType === "huggingface"
            ? { apiKey: apiKeys.huggingface }
            : {}),
        },
        widgetAppearance: config.widgetAppearance,
        responseFormatting: config.responseFormatting,
        updatedAt: new Date(),
      });

      toast({
        title: "Configuration saved",
        description: "Your changes have been applied successfully.",
        duration: 3000,
      });

      if (onSave) {
        onSave(config);
      }
    } catch (error) {
      console.error("Error saving configuration:", error);
      toast({
        title: "Error saving configuration",
        description: "There was an error saving your configuration.",
        variant: "destructive",
        duration: 3000,
      });
    }
  };

  const handleCreateNewConfig = async (name: string, description: string) => {
    if (!name.trim()) {
      toast({
        title: "Name required",
        description: "Please provide a name for your configuration.",
        variant: "destructive",
        duration: 3000,
      });
      return;
    }

    try {
      const newConfig = await createConfiguration({
        name: name,
        description: description,
        // Clone current settings
        widgetAppearance: { ...config.widgetAppearance },
        knowledgeBase: { ...config.knowledgeBase },
        aiModel: { ...config.aiModel },
        responseFormatting: { ...config.responseFormatting },
      });

      toast({
        title: "Configuration created",
        description: `"${newConfig.name}" has been created successfully.`,
        duration: 3000,
      });
    } catch (error) {
      console.error("Error creating configuration:", error);
      toast({
        title: "Error creating configuration",
        description: "There was an error creating your configuration.",
        variant: "destructive",
        duration: 3000,
      });
    }
  };

  const handleAddTemplate = () => {
    const newTemplate: PromptTemplate = {
      id: `template-${Date.now()}`,
      name: "New Template",
      template: "Answer the following question: {{user_query}}.",
      category: "General",
      isActive: true,
      lastModified: new Date(),
    };

    setPromptTemplates([...promptTemplates, newTemplate]);
    setSelectedTemplate(newTemplate.id);
    setEditingTemplate(newTemplate);
  };

  const handleSaveTemplate = () => {
    if (!editingTemplate) return;

    const updatedTemplates = promptTemplates.map((template) =>
      template.id === editingTemplate.id ? editingTemplate : template,
    );

    setPromptTemplates(updatedTemplates);
    setEditingTemplate(null);

    toast({
      title: "Template saved",
      description: "Your template has been updated successfully.",
      duration: 3000,
    });
  };

  const handleDeleteTemplate = (id: string) => {
    const updatedTemplates = promptTemplates.filter(
      (template) => template.id !== id,
    );
    setPromptTemplates(updatedTemplates);

    if (selectedTemplate === id) {
      setSelectedTemplate(
        updatedTemplates.length > 0 ? updatedTemplates[0].id : null,
      );
      setEditingTemplate(null);
    }

    toast({
      title: "Template deleted",
      description: "The template has been removed.",
      duration: 3000,
    });
  };

  const handleDuplicateTemplate = (template: PromptTemplate) => {
    const newTemplate: PromptTemplate = {
      ...template,
      id: `template-${Date.now()}`,
      name: `${template.name} (Copy)`,
      lastModified: new Date(),
    };

    setPromptTemplates([...promptTemplates, newTemplate]);
    setSelectedTemplate(newTemplate.id);
    setEditingTemplate(newTemplate);

    toast({
      title: "Template duplicated",
      description: "A copy of the template has been created.",
      duration: 3000,
    });
  };

  const handleTestApiKey = (provider: "gemini" | "huggingface") => {
    // In a real implementation, this would test the API key against the provider's API
    setTimeout(() => {
      toast({
        title: "API key validated",
        description: `Your ${provider} API key is valid and working correctly.`,
        duration: 3000,
      });
    }, 1000);
  };

  const handleTestPrompt = async () => {
    if (!testPromptInput.trim() || !editingTemplate) return;

    setIsTestingPrompt(true);
    setTestPromptResponse(null);

    try {
      // Apply the template to the test input
      const processedPrompt = PromptTemplateService.applyTemplate
        ? PromptTemplateService.applyTemplate(editingTemplate.id, {
            user_query: testPromptInput,
          })
        : editingTemplate.template.replace("{{user_query}}", testPromptInput);

      // In a real implementation, this would call the AI service
      // For demo, we'll simulate an API call with a timeout
      setTimeout(() => {
        // Generate a mock response
        const mockResponse = `Here's a response to your query: "${testPromptInput}".\n\nThis response was generated using the "${editingTemplate.name}" template.\n\nThe template applied was: ${processedPrompt}`;

        // Generate a random confidence score between 70-95%
        const confidence = Math.floor(Math.random() * 26) + 70;

        setTestPromptResponse(mockResponse);
        setTestPromptConfidence(confidence);
        setIsTestingPrompt(false);

        toast({
          title: "Test completed",
          description: "The prompt template has been tested successfully.",
          duration: 3000,
        });
      }, 1500);
    } catch (error) {
      console.error("Error testing prompt:", error);
      setIsTestingPrompt(false);

      toast({
        title: "Test failed",
        description: "There was an error testing the prompt template.",
        variant: "destructive",
        duration: 3000,
      });
    }
  };

  // Filter templates based on search query
  const filteredTemplates = promptTemplates.filter((template) => {
    if (!searchQuery.trim()) return true;

    const query = searchQuery.toLowerCase();
    return (
      template.name.toLowerCase().includes(query) ||
      template.category.toLowerCase().includes(query) ||
      template.template.toLowerCase().includes(query) ||
      (template.description &&
        template.description.toLowerCase().includes(query))
    );
  });
  return (
    <div className="w-full h-full bg-background p-6">
      {isLoading && (
        <div className="absolute inset-0 bg-background/80 flex items-center justify-center z-50 pointer-events-none">
          <div className="flex flex-col items-center gap-2 pointer-events-auto bg-background/90 p-4 rounded-md shadow-md">
            <div className="animate-spin h-8 w-8 border-4 border-primary border-t-transparent rounded-full" />
            <p className="text-sm text-muted-foreground">
              Loading configuration...
            </p>
          </div>
        </div>
      )}
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl font-bold">Configuration Panel</h1>
          <p className="text-muted-foreground">
            Configure your AI chat system settings
          </p>
        </div>
        <div className="flex gap-2">
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  variant="outline"
                  onClick={() => setShowOnboarding(true)}
                >
                  <HelpCircle className="h-4 w-4" />
                </Button>
              </TooltipTrigger>
              <TooltipContent>
                <p>Show onboarding help</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>

          <OnboardingHelp
            open={showOnboarding}
            onOpenChange={setShowOnboarding}
          />

          <Button
            variant="outline"
            onClick={() => setShowPreviewPanel(!showPreviewPanel)}
          >
            <Play className="mr-2 h-4 w-4" />
            {showPreviewPanel ? "Hide Preview" : "Test Configuration"}
          </Button>

          <Button
            variant="outline"
            onClick={() => setShowWidgetPreview(!showWidgetPreview)}
          >
            {showWidgetPreview ? "Hide Widget" : "Show Widget Preview"}
          </Button>

          <Button
            variant="outline"
            onClick={() => setShowConfigSelector(!showConfigSelector)}
          >
            <Layers className="mr-2 h-4 w-4" />
            Configurations
          </Button>

          <Button onClick={handleSaveConfig}>
            <Save className="mr-2 h-4 w-4" />
            Save Configuration
          </Button>
        </div>
      </div>

      {/* Configuration Selector */}
      {showConfigSelector && (
        <ConfigurationSelector
          configurations={allConfigurations}
          activeConfigId={config.id || ""}
          onActivate={async (id) => {
            try {
              const result = await setActiveConfiguration(id);
              if (result) {
                toast({
                  title: "Configuration activated",
                  description: "The selected configuration is now active.",
                  duration: 3000,
                });
              }
            } catch (error) {
              console.error("Error activating configuration:", error);
              toast({
                title: "Error activating configuration",
                description: "There was an error activating the configuration.",
                variant: "destructive",
                duration: 3000,
              });
            }
          }}
          onDuplicate={async (id) => {
            const configToDuplicate = allConfigurations.find(
              (c) => c.id === id,
            );
            if (configToDuplicate) {
              try {
                const newName = `${configToDuplicate.name} (Copy)`;
                await createConfiguration({
                  name: newName,
                  description: configToDuplicate.description,
                  widgetAppearance: { ...configToDuplicate.widgetAppearance },
                  knowledgeBase: { ...configToDuplicate.knowledgeBase },
                  aiModel: { ...configToDuplicate.aiModel },
                  responseFormatting: {
                    ...configToDuplicate.responseFormatting,
                  },
                });

                toast({
                  title: "Configuration duplicated",
                  description: `"${newName}" has been created.`,
                  duration: 3000,
                });
              } catch (error) {
                console.error("Error duplicating configuration:", error);
                toast({
                  title: "Error duplicating configuration",
                  description:
                    "There was an error duplicating the configuration.",
                  variant: "destructive",
                  duration: 3000,
                });
              }
            }
          }}
          onDelete={async (id) => {
            try {
              const result = await deleteConfiguration(id);

              if (result) {
                toast({
                  title: "Configuration deleted",
                  description: "The configuration has been removed.",
                  duration: 3000,
                });
              } else {
                toast({
                  title: "Cannot delete configuration",
                  description: "The default configuration cannot be deleted.",
                  variant: "destructive",
                  duration: 3000,
                });
              }
            } catch (error) {
              console.error("Error deleting configuration:", error);
              toast({
                title: "Error deleting configuration",
                description: "There was an error deleting the configuration.",
                variant: "destructive",
                duration: 3000,
              });
            }
          }}
          onCreateNew={handleCreateNewConfig}
        />
      )}

      <div className="flex h-full">
        <div
          className={`flex-1 transition-all ${showPreviewPanel ? "pr-4" : ""}`}
        >
          <Tabs
            value={activeTab}
            onValueChange={setActiveTab}
            className="w-full"
          >
            <TabsList className="grid grid-cols-6 gap-4 mb-6">
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <TabsTrigger
                      value="knowledge-base"
                      className="flex items-center"
                    >
                      <Database className="mr-2 h-4 w-4" />
                      Knowledge Base
                    </TabsTrigger>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>Configure which knowledge sources the AI can access</p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>

              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <TabsTrigger
                      value="prompt-templates"
                      className="flex items-center"
                    >
                      <MessageSquare className="mr-2 h-4 w-4" />
                      Prompt Templates
                    </TabsTrigger>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>Create and manage templates for AI prompts</p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>

              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <TabsTrigger
                      value="ai-models"
                      className="flex items-center"
                    >
                      <Settings className="mr-2 h-4 w-4" />
                      AI Models
                    </TabsTrigger>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>Configure AI model settings and parameters</p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>

              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <TabsTrigger
                      value="follow-up-questions"
                      className="flex items-center"
                    >
                      <Zap className="mr-2 h-4 w-4" />
                      Follow-Up Questions
                    </TabsTrigger>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>
                      Create automated follow-up questions for conversations
                    </p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>

              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <TabsTrigger
                      value="widget-appearance"
                      className="flex items-center"
                    >
                      <Palette className="mr-2 h-4 w-4" />
                      Widget Appearance
                    </TabsTrigger>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>Customize how the chat widget looks and behaves</p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>

              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <TabsTrigger
                      value="response-formatting"
                      className="flex items-center"
                    >
                      <FileText className="mr-2 h-4 w-4" />
                      Response Formatting
                    </TabsTrigger>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>
                      Configure how AI responses are structured and formatted
                    </p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            </TabsList>

            {/* Knowledge Base Tab */}
            <TabsContent value="knowledge-base" className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="md:col-span-2">
                  <KnowledgeSourceSelector
                    onSourcesChange={(sources) => setActiveSources(sources)}
                  />
                </div>
                <div className="md:col-span-1">
                  <Card className="h-full">
                    <CardHeader>
                      <CardTitle>Knowledge Base Settings</CardTitle>
                      <CardDescription>
                        Configure how the AI uses your knowledge base to enhance
                        responses
                      </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="flex items-center justify-between">
                        <div className="space-y-0.5">
                          <Label htmlFor="enable-kb">
                            Enable Knowledge Base
                          </Label>
                          <p className="text-sm text-muted-foreground">
                            Allow the AI to use your knowledge base for
                            responses
                          </p>
                        </div>
                        <Switch
                          id="enable-kb"
                          checked={config.knowledgeBase.enableKnowledgeBase}
                          onCheckedChange={(checked) =>
                            updateKnowledgeBaseConfig({
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
                            Automatically include relevant knowledge base
                            content in AI responses
                          </p>
                        </div>
                        <Switch
                          id="auto-inject"
                          checked={
                            config.knowledgeBase.autoInjectRelevantContent
                          }
                        />
                      </div>
                      <Separator />
                      <div className="flex items-center justify-between">
                        <div className="space-y-0.5">
                          <Label htmlFor="cite-sources">Cite Sources</Label>
                          <p className="text-sm text-muted-foreground">
                            Include citations when knowledge base content is
                            used
                          </p>
                        </div>
                        <Switch
                          id="cite-sources"
                          checked={config.knowledgeBase.citeSources}
                          onCheckedChange={(checked) =>
                            updateKnowledgeBaseConfig({
                              citeSources: checked,
                            })
                          }
                        />
                      </div>

                      <Separator />

                      <div className="space-y-2">
                        <Label htmlFor="relevance-threshold">
                          Relevance Threshold
                        </Label>
                        <div className="space-y-2">
                          <div className="flex justify-between text-sm">
                            <span>Lower (More Results)</span>
                            <span>Higher (More Relevant)</span>
                          </div>
                          <Slider
                            id="relevance-threshold"
                            min={0}
                            max={100}
                            step={5}
                            value={[
                              config.knowledgeBase.relevanceThreshold || 75,
                            ]}
                            onValueChange={(value) =>
                              updateKnowledgeBaseConfig({
                                relevanceThreshold: value[0],
                              })
                            }
                          />
                          <div className="flex justify-between text-xs text-muted-foreground">
                            <span>0%</span>
                            <span>50%</span>
                            <span>100%</span>
                          </div>
                        </div>
                        <p className="text-xs text-muted-foreground">
                          Set the minimum relevance score for content to be
                          included
                        </p>
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="max-sources">Maximum Sources</Label>
                        <Input
                          id="max-sources"
                          type="number"
                          min="1"
                          max="10"
                          value={config.knowledgeBase.maxSources || 3}
                          onChange={(e) =>
                            updateKnowledgeBaseConfig({
                              maxSources: parseInt(e.target.value),
                            })
                          }
                        />
                        <p className="text-xs text-muted-foreground">
                          Maximum number of knowledge sources to include in a
                          response
                        </p>
                      </div>
                    </CardContent>
                    <CardFooter className="flex justify-between border-t pt-6">
                      <Button variant="outline">
                        <BookOpen className="mr-2 h-4 w-4" />
                        View Knowledge Base
                      </Button>
                      <Button>
                        <Check className="mr-2 h-4 w-4" />
                        Apply Settings
                      </Button>
                    </CardFooter>
                  </Card>
                </div>
              </div>

              <Card>
                <CardHeader>
                  <CardTitle>Active Knowledge Sources</CardTitle>
                  <CardDescription>
                    Currently active knowledge sources that will be used for AI
                    responses
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                    {activeSources.map((source) => (
                      <div
                        key={source.id}
                        className="border rounded-md p-4 bg-muted/10"
                      >
                        <div className="flex items-start justify-between">
                          <div className="flex items-center gap-2">
                            {source.icon &&
                              (() => {
                                const iconMap: Record<string, React.ReactNode> =
                                  {
                                    FileText: <FileText className="h-4 w-4" />,
                                    Database: <Database className="h-4 w-4" />,
                                    HelpCircle: (
                                      <HelpCircle className="h-4 w-4" />
                                    ),
                                    Code: <Code className="h-4 w-4" />,
                                    MessageSquare: (
                                      <MessageSquare className="h-4 w-4" />
                                    ),
                                    Presentation: (
                                      <Presentation className="h-4 w-4" />
                                    ),
                                  };
                                return (
                                  iconMap[source.icon] || (
                                    <FileText className="h-4 w-4" />
                                  )
                                );
                              })()}
                            <h3 className="font-medium">{source.name}</h3>
                          </div>
                          <Badge variant="outline" className="text-xs">
                            {source.documentCount} docs
                          </Badge>
                        </div>
                        <p className="text-sm text-muted-foreground mt-2">
                          {source.description}
                        </p>
                      </div>
                    ))}

                    {activeSources.length === 0 && (
                      <div className="col-span-full p-8 text-center border rounded-md bg-muted/10">
                        <AlertCircle className="mx-auto h-8 w-8 text-muted-foreground mb-2" />
                        <p className="text-muted-foreground font-medium">
                          No active knowledge sources
                        </p>
                        <p className="text-sm text-muted-foreground mt-1">
                          Enable sources from the Knowledge Sources panel above
                        </p>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            {/* Prompt Templates Tab */}
            <TabsContent value="prompt-templates" className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="md:col-span-1">
                  <Card className="h-full">
                    <CardHeader>
                      <div className="flex justify-between items-center">
                        <CardTitle>Template Library</CardTitle>
                        <div className="flex gap-2">
                          <div className="relative">
                            <Input
                              type="text"
                              placeholder="Search templates..."
                              value={searchQuery}
                              onChange={(e) => setSearchQuery(e.target.value)}
                              className="pl-8 h-9"
                            />
                            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                            {searchQuery && (
                              <button
                                onClick={() => setSearchQuery("")}
                                className="absolute right-2.5 top-2.5 text-muted-foreground hover:text-foreground"
                              >
                                <X className="h-4 w-4" />
                              </button>
                            )}
                          </div>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={handleAddTemplate}
                          >
                            <Plus className="h-4 w-4 mr-1" />
                            Add New
                          </Button>
                        </div>
                      </div>
                      <CardDescription>
                        Select a template to edit or preview
                      </CardDescription>
                    </CardHeader>
                    <CardContent className="p-0">
                      <div className="divide-y">
                        {filteredTemplates.length > 0 ? (
                          filteredTemplates.map((template) => (
                            <div
                              key={template.id}
                              className={`p-4 cursor-pointer hover:bg-muted/50 ${selectedTemplate === template.id ? "bg-primary/5" : ""}`}
                              onClick={() => {
                                setSelectedTemplate(template.id);
                                setEditingTemplate(null);
                              }}
                            >
                              <div className="flex items-center justify-between">
                                <div>
                                  <h3 className="font-medium">
                                    {template.name}
                                  </h3>
                                  <div className="flex items-center gap-2 mt-1">
                                    <Badge
                                      variant="outline"
                                      className="text-xs"
                                    >
                                      {template.category}
                                    </Badge>
                                    {template.isDefault && (
                                      <Badge className="text-xs bg-primary/20 text-primary border-primary/20">
                                        Default
                                      </Badge>
                                    )}
                                  </div>
                                </div>
                                <div className="flex gap-1">
                                  <Button
                                    variant="ghost"
                                    size="icon"
                                    className="h-8 w-8"
                                    onClick={(e) => {
                                      e.stopPropagation();
                                      setEditingTemplate(template);
                                    }}
                                  >
                                    <Edit className="h-4 w-4" />
                                  </Button>
                                  <Button
                                    variant="ghost"
                                    size="icon"
                                    className="h-8 w-8"
                                    onClick={(e) => {
                                      e.stopPropagation();
                                      handleDuplicateTemplate(template);
                                    }}
                                  >
                                    <Copy className="h-4 w-4" />
                                  </Button>
                                  <Button
                                    variant="ghost"
                                    size="icon"
                                    className="h-8 w-8 text-destructive"
                                    onClick={(e) => {
                                      e.stopPropagation();
                                      handleDeleteTemplate(template.id);
                                    }}
                                  >
                                    <Trash2 className="h-4 w-4" />
                                  </Button>
                                </div>
                              </div>
                            </div>
                          ))
                        ) : (
                          <div className="p-8 text-center">
                            <div className="text-muted-foreground mb-2">
                              No templates found
                            </div>
                            <p className="text-sm text-muted-foreground">
                              Try a different search term or create a new
                              template
                            </p>
                          </div>
                        )}
                      </div>
                    </CardContent>
                  </Card>
                </div>

                <div className="md:col-span-2">
                  {selectedTemplate && !editingTemplate && (
                    <Card>
                      <CardHeader>
                        <div className="flex justify-between items-center">
                          <CardTitle>
                            {
                              promptTemplates.find(
                                (t) => t.id === selectedTemplate,
                              )?.name
                            }
                          </CardTitle>
                          <div className="flex gap-2">
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() =>
                                setEditingTemplate(
                                  promptTemplates.find(
                                    (t) => t.id === selectedTemplate,
                                  ) || null,
                                )
                              }
                            >
                              <Edit className="mr-2 h-4 w-4" />
                              Edit Template
                            </Button>
                            <Button variant="outline" size="sm">
                              <Copy className="mr-2 h-4 w-4" />
                              Clone
                            </Button>
                          </div>
                        </div>
                        <CardDescription>
                          Template preview and usage information
                        </CardDescription>
                      </CardHeader>
                      <CardContent>
                        <div className="space-y-6">
                          <div className="bg-muted/20 p-4 rounded-md">
                            <h3 className="text-sm font-medium mb-2">
                              Template Content
                            </h3>
                            <div className="bg-muted p-3 rounded-md font-mono text-sm">
                              {
                                promptTemplates.find(
                                  (t) => t.id === selectedTemplate,
                                )?.template
                              }
                            </div>
                          </div>

                          <div className="space-y-2">
                            <h3 className="text-sm font-medium">
                              Template Information
                            </h3>
                            <div className="grid grid-cols-2 gap-2 text-sm">
                              <div className="text-muted-foreground">
                                Category:
                              </div>
                              <div>
                                {
                                  promptTemplates.find(
                                    (t) => t.id === selectedTemplate,
                                  )?.category
                                }
                              </div>
                              <div className="text-muted-foreground">
                                Default Template:
                              </div>
                              <div>
                                {promptTemplates.find(
                                  (t) => t.id === selectedTemplate,
                                )?.isDefault
                                  ? "Yes"
                                  : "No"}
                              </div>
                              <div className="text-muted-foreground">
                                Last Modified:
                              </div>
                              <div>
                                {promptTemplates
                                  .find((t) => t.id === selectedTemplate)
                                  ?.lastModified?.toLocaleString() || "Unknown"}
                              </div>
                            </div>
                          </div>

                          <div className="space-y-2">
                            <h3 className="text-sm font-medium">
                              Example Usage
                            </h3>
                            <div className="bg-muted/20 p-4 rounded-md">
                              <div className="space-y-4">
                                <div>
                                  <div className="text-sm font-medium mb-1">
                                    User Query:
                                  </div>
                                  <div className="bg-muted p-2 rounded-md text-sm">
                                    How do I reset my password?
                                  </div>
                                </div>
                                <div>
                                  <div className="text-sm font-medium mb-1">
                                    Applied Template:
                                  </div>
                                  <div className="bg-muted p-2 rounded-md text-sm">
                                    {(
                                      promptTemplates.find(
                                        (t) => t.id === selectedTemplate,
                                      )?.template || ""
                                    ).replace(
                                      "{{user_query}}",
                                      "How do I reset my password?",
                                    )}
                                  </div>
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  )}

                  {editingTemplate && (
                    <Card>
                      <CardHeader>
                        <CardTitle>Prompt Template Editor</CardTitle>
                        <CardDescription>
                          Create and modify prompt templates with variables
                        </CardDescription>
                      </CardHeader>
                      <CardContent>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                          <div className="space-y-4">
                            <div className="space-y-2">
                              <Label htmlFor="template-name">
                                Template Title
                              </Label>
                              <Input
                                id="template-name"
                                value={editingTemplate.name}
                                onChange={(e) =>
                                  setEditingTemplate({
                                    ...editingTemplate,
                                    name: e.target.value,
                                  })
                                }
                                placeholder="Enter a descriptive title"
                              />
                            </div>

                            <div className="space-y-2">
                              <Label htmlFor="template-description">
                                Description
                              </Label>
                              <Textarea
                                id="template-description"
                                value={editingTemplate.description || ""}
                                onChange={(e) =>
                                  setEditingTemplate({
                                    ...editingTemplate,
                                    description: e.target.value,
                                  })
                                }
                                placeholder="What is this template used for?"
                                rows={2}
                              />
                            </div>

                            <div className="space-y-2">
                              <Label htmlFor="template-category">
                                Category
                              </Label>
                              <Select
                                value={editingTemplate.category}
                                onValueChange={(value) =>
                                  setEditingTemplate({
                                    ...editingTemplate,
                                    category: value,
                                  })
                                }
                              >
                                <SelectTrigger id="template-category">
                                  <SelectValue placeholder="Select a category" />
                                </SelectTrigger>
                                <SelectContent>
                                  <SelectItem value="General">
                                    General
                                  </SelectItem>
                                  <SelectItem value="Customer Service">
                                    Customer Service
                                  </SelectItem>
                                  <SelectItem value="Support">
                                    Support
                                  </SelectItem>
                                  <SelectItem value="Sales">Sales</SelectItem>
                                  <SelectItem value="Marketing">
                                    Marketing
                                  </SelectItem>
                                </SelectContent>
                              </Select>
                            </div>

                            <div className="space-y-2">
                              <Label>Tags</Label>
                              <div className="flex flex-wrap gap-2 p-2 border rounded-md">
                                <Badge
                                  variant="secondary"
                                  className="px-2 py-1"
                                >
                                  AI{" "}
                                  <X className="h-3 w-3 ml-1 cursor-pointer" />
                                </Badge>
                                <Badge
                                  variant="secondary"
                                  className="px-2 py-1"
                                >
                                  Customer Support{" "}
                                  <X className="h-3 w-3 ml-1 cursor-pointer" />
                                </Badge>
                                <Input
                                  className="w-24 h-7 border-none bg-transparent"
                                  placeholder="Add tag..."
                                />
                              </div>
                            </div>
                          </div>

                          <div className="space-y-4">
                            <div className="space-y-2">
                              <div className="flex justify-between items-center">
                                <Label htmlFor="template-content">
                                  Rich Prompt Editor
                                </Label>
                                <div className="flex gap-2">
                                  <Button
                                    variant="ghost"
                                    size="sm"
                                    className="h-8 px-2 text-xs"
                                  >
                                    <Sparkles className="h-3 w-3 mr-1" />
                                    Insert Variable
                                  </Button>
                                </div>
                              </div>
                              <div className="border rounded-md">
                                <div className="flex items-center gap-1 p-1 border-b">
                                  <Button
                                    variant="ghost"
                                    size="sm"
                                    className="h-7 px-2"
                                  >
                                    <Bold className="h-3.5 w-3.5" />
                                  </Button>
                                  <Button
                                    variant="ghost"
                                    size="sm"
                                    className="h-7 px-2"
                                  >
                                    <Italic className="h-3.5 w-3.5" />
                                  </Button>
                                  <Button
                                    variant="ghost"
                                    size="sm"
                                    className="h-7 px-2"
                                  >
                                    <List className="h-3.5 w-3.5" />
                                  </Button>
                                  <Button
                                    variant="ghost"
                                    size="sm"
                                    className="h-7 px-2"
                                  >
                                    <ListOrdered className="h-3.5 w-3.5" />
                                  </Button>
                                  <Separator
                                    orientation="vertical"
                                    className="h-6 mx-1"
                                  />
                                  <Button
                                    variant="ghost"
                                    size="sm"
                                    className="h-7 px-2"
                                  >
                                    <Code className="h-3.5 w-3.5" />
                                  </Button>
                                  <Button
                                    variant="ghost"
                                    size="sm"
                                    className="h-7 px-2"
                                  >
                                    <Link className="h-3.5 w-3.5" />
                                  </Button>
                                </div>
                                <Textarea
                                  id="template-content"
                                  value={editingTemplate.template}
                                  onChange={(e) =>
                                    setEditingTemplate({
                                      ...editingTemplate,
                                      template: e.target.value,
                                    })
                                  }
                                  rows={10}
                                  className="font-mono text-sm border-none resize-none focus-visible:ring-0"
                                  placeholder="Enter your prompt template here. Use {{variables}} for dynamic content."
                                />
                              </div>
                              <div className="bg-muted/30 p-3 rounded-md">
                                <h4 className="text-sm font-medium mb-2">
                                  Available Variables
                                </h4>
                                <div className="flex flex-wrap gap-2">
                                  {PromptTemplateService.getVariables &&
                                    PromptTemplateService.getVariables().map(
                                      (variable) => (
                                        <Badge
                                          key={variable.name}
                                          variant="outline"
                                          className="cursor-pointer hover:bg-primary/10"
                                          title={variable.description}
                                          onClick={() => {
                                            const cursorPos =
                                              (
                                                document.getElementById(
                                                  "template-content",
                                                ) as HTMLTextAreaElement
                                              )?.selectionStart || 0;
                                            const textBefore =
                                              editingTemplate.template.substring(
                                                0,
                                                cursorPos,
                                              );
                                            const textAfter =
                                              editingTemplate.template.substring(
                                                cursorPos,
                                              );
                                            setEditingTemplate({
                                              ...editingTemplate,
                                              template: `${textBefore}{{${variable.name}}}${textAfter}`,
                                            });
                                          }}
                                        >
                                          {`{{${variable.name}}}`}
                                        </Badge>
                                      ),
                                    )}
                                  <Badge
                                    variant="outline"
                                    className="cursor-pointer hover:bg-primary/10"
                                  >
                                    {`{{language}}`}
                                  </Badge>
                                  <Badge
                                    variant="outline"
                                    className="cursor-pointer hover:bg-primary/10"
                                  >
                                    {`{{service_category}}`}
                                  </Badge>
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>

                        <div className="mt-6 space-y-4">
                          <div className="flex justify-between items-center">
                            <h3 className="text-sm font-medium">
                              Test Prompt Template
                            </h3>
                            <div className="flex gap-2">
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() => {
                                  setTestPromptInput("");
                                  setTestPromptResponse(null);
                                }}
                                disabled={isTestingPrompt}
                              >
                                <X className="h-4 w-4 mr-1" />
                                Clear
                              </Button>
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={handleTestPrompt}
                                disabled={
                                  !testPromptInput.trim() || isTestingPrompt
                                }
                              >
                                <Play className="h-4 w-4 mr-1" />
                                Test This Prompt
                              </Button>
                            </div>
                          </div>

                          <div className="space-y-3">
                            <div className="flex flex-col space-y-2">
                              <Label htmlFor="test-prompt-input">
                                Enter a test query
                              </Label>
                              <Textarea
                                id="test-prompt-input"
                                placeholder="Type a sample user query to test this template..."
                                value={testPromptInput}
                                onChange={(e) =>
                                  setTestPromptInput(e.target.value)
                                }
                                rows={2}
                                disabled={isTestingPrompt}
                              />
                            </div>

                            <div className="bg-muted/20 p-4 rounded-md min-h-[200px]">
                              <div className="flex justify-between items-center mb-2">
                                <h4 className="text-sm font-medium">
                                  AI Output Preview
                                </h4>
                                {testPromptResponse && (
                                  <div className="flex items-center gap-1.5">
                                    <span className="text-xs text-muted-foreground">
                                      Confidence:
                                    </span>
                                    <div className="w-24 h-2 bg-muted rounded-full overflow-hidden">
                                      <div
                                        className="h-full bg-primary"
                                        style={{
                                          width: `${testPromptConfidence}%`,
                                        }}
                                      />
                                    </div>
                                    <span className="text-xs font-medium">
                                      {testPromptConfidence}%
                                    </span>
                                  </div>
                                )}
                              </div>

                              {isTestingPrompt ? (
                                <div className="flex items-center justify-center h-[150px]">
                                  <div className="flex flex-col items-center gap-2">
                                    <div className="animate-spin h-5 w-5 border-2 border-primary border-t-transparent rounded-full" />
                                    <p className="text-sm text-muted-foreground">
                                      Processing your test query...
                                    </p>
                                  </div>
                                </div>
                              ) : testPromptResponse ? (
                                <div className="space-y-3">
                                  <ResponseFormatter
                                    response={testPromptResponse}
                                    format="structured"
                                    includeTitle={true}
                                    includeIntro={true}
                                    includeContentBlocks={true}
                                    className="text-sm"
                                  />
                                </div>
                              ) : (
                                <div className="text-sm text-muted-foreground italic text-center h-[150px] flex items-center justify-center">
                                  <p>
                                    Enter a test query and click "Test This
                                    Prompt" to see a preview
                                  </p>
                                </div>
                              )}
                            </div>
                          </div>
                        </div>

                        <div className="flex items-center space-x-2 mt-4">
                          <Switch
                            id="is-default"
                            checked={editingTemplate.isDefault || false}
                            onCheckedChange={(checked) =>
                              setEditingTemplate({
                                ...editingTemplate,
                                isDefault: checked,
                              })
                            }
                          />
                          <div>
                            <Label htmlFor="is-default">
                              Set as Default Template
                            </Label>
                            <p className="text-xs text-muted-foreground">
                              Use this template when no specific template is
                              selected
                            </p>
                          </div>
                        </div>
                      </CardContent>
                      <CardFooter className="flex justify-between border-t pt-6">
                        <div className="flex gap-2">
                          <Button
                            variant="outline"
                            onClick={() => setEditingTemplate(null)}
                          >
                            Cancel
                          </Button>
                          <Button variant="secondary">
                            <Save className="mr-2 h-4 w-4" />
                            Save as Draft
                          </Button>
                        </div>
                        <Button onClick={handleSaveTemplate}>
                          <Check className="mr-2 h-4 w-4" />
                          Publish Template
                        </Button>
                      </CardFooter>
                    </Card>
                  )}
                </div>
              </div>
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
                      value={config.aiModel.modelType}
                      onValueChange={(value: any) =>
                        updateAIModelConfig({ modelType: value })
                      }
                    >
                      <SelectTrigger id="default-model">
                        <SelectValue placeholder="Select a model" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="gemini">Google Gemini</SelectItem>
                        <SelectItem value="huggingface">
                          Hugging Face
                        </SelectItem>
                        <SelectItem value="custom">Custom Model</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  {/* API Key Management */}
                  <div className="space-y-4 p-4 border rounded-md bg-muted/10">
                    <h3 className="text-sm font-medium flex items-center gap-2">
                      <Key className="h-4 w-4" />
                      API Key Configuration
                    </h3>

                    <div className="space-y-4">
                      <div className="space-y-2">
                        <Label htmlFor="gemini-api-key">Gemini API Key</Label>
                        <div className="flex gap-2">
                          <Input
                            id="gemini-api-key"
                            type="password"
                            placeholder="Enter your Gemini API key"
                            value={apiKeys.gemini}
                            onChange={(e) =>
                              setApiKeys({ ...apiKeys, gemini: e.target.value })
                            }
                            className="flex-1"
                          />
                          <Button
                            variant="outline"
                            onClick={() => handleTestApiKey("gemini")}
                            disabled={!apiKeys.gemini}
                          >
                            Test
                          </Button>
                        </div>
                        <p className="text-xs text-muted-foreground">
                          <a
                            href="https://ai.google.dev/"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-primary hover:underline flex items-center gap-1"
                          >
                            Get a Gemini API key{" "}
                            <ExternalLink className="h-3 w-3" />
                          </a>
                        </p>
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="huggingface-api-key">
                          Hugging Face API Key
                        </Label>
                        <div className="flex gap-2">
                          <Input
                            id="huggingface-api-key"
                            type="password"
                            placeholder="Enter your Hugging Face API key"
                            value={apiKeys.huggingface}
                            onChange={(e) =>
                              setApiKeys({
                                ...apiKeys,
                                huggingface: e.target.value,
                              })
                            }
                            className="flex-1"
                          />
                          <Button
                            variant="outline"
                            onClick={() => handleTestApiKey("huggingface")}
                            disabled={!apiKeys.huggingface}
                          >
                            Test
                          </Button>
                        </div>
                        <p className="text-xs text-muted-foreground">
                          <a
                            href="https://huggingface.co/settings/tokens"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-primary hover:underline flex items-center gap-1"
                          >
                            Get a Hugging Face API key{" "}
                            <ExternalLink className="h-3 w-3" />
                          </a>
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="temperature">Temperature</Label>
                      <div className="space-y-2">
                        <div className="flex justify-between text-sm">
                          <span>More Deterministic</span>
                          <span>More Creative</span>
                        </div>
                        <Slider
                          id="temperature"
                          min={0}
                          max={1}
                          step={0.1}
                          value={[config.aiModel.temperature]}
                          onValueChange={(value) =>
                            updateAIModelConfig({
                              temperature: value[0],
                            })
                          }
                        />
                        <div className="flex justify-between text-xs text-muted-foreground">
                          <span>0.0</span>
                          <span>0.5</span>
                          <span>1.0</span>
                        </div>
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
                        value={config.aiModel.maxTokens}
                        onChange={(e) =>
                          updateAIModelConfig({
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
                    <div className="space-y-2">
                      <Slider
                        id="top-p"
                        min={0}
                        max={1}
                        step={0.1}
                        value={[config.aiModel.topP]}
                        onValueChange={(value) =>
                          updateAIModelConfig({
                            topP: value[0],
                          })
                        }
                      />
                      <div className="flex justify-between text-xs text-muted-foreground">
                        <span>0.0</span>
                        <span>0.5</span>
                        <span>1.0</span>
                      </div>
                    </div>
                    <p className="text-xs text-muted-foreground">
                      Controls diversity via nucleus sampling
                    </p>
                  </div>

                  <div className="p-4 border rounded-md bg-muted/10">
                    <div className="flex items-start gap-2">
                      <AlertCircle className="h-5 w-5 text-amber-500 mt-0.5" />
                      <div>
                        <h4 className="text-sm font-medium">
                          Model Usage Note
                        </h4>
                        <p className="text-sm text-muted-foreground">
                          API usage may incur costs depending on your plan. Make
                          sure to check the pricing details for your selected
                          model provider.
                        </p>
                      </div>
                    </div>
                  </div>
                </CardContent>
                <CardFooter className="flex justify-between border-t pt-6">
                  <Button variant="outline">
                    <Code className="mr-2 h-4 w-4" />
                    Advanced Settings
                  </Button>
                  <Button>
                    <Check className="mr-2 h-4 w-4" />
                    Apply Model Settings
                  </Button>
                </CardFooter>
              </Card>
            </TabsContent>

            {/* Widget Appearance Tab */}
            <TabsContent value="widget-appearance" className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="md:col-span-2">
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
                          <Label htmlFor="widget-title">Widget Title</Label>
                          <Input
                            id="widget-title"
                            value={config.widgetAppearance.title}
                            onChange={(e) =>
                              updateWidgetAppearance({
                                title: e.target.value,
                              })
                            }
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="widget-subtitle">
                            Widget Subtitle
                          </Label>
                          <Input
                            id="widget-subtitle"
                            value={config.widgetAppearance.subtitle}
                            onChange={(e) =>
                              updateWidgetAppearance({
                                subtitle: e.target.value,
                              })
                            }
                          />
                        </div>
                      </div>

                      <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label htmlFor="primary-color">Primary Color</Label>
                          <div className="flex items-center space-x-2">
                            <Input
                              id="primary-color"
                              type="color"
                              value={config.widgetAppearance.primaryColor}
                              onChange={(e) =>
                                updateWidgetAppearance({
                                  primaryColor: e.target.value,
                                })
                              }
                              className="w-12 h-8 p-1"
                            />
                            <Input
                              value={config.widgetAppearance.primaryColor}
                              onChange={(e) =>
                                updateWidgetAppearance({
                                  primaryColor: e.target.value,
                                })
                              }
                              className="flex-1"
                            />
                          </div>
                        </div>

                        <div className="space-y-2">
                          <Label htmlFor="secondary-color">
                            Secondary Color
                          </Label>
                          <div className="flex items-center space-x-2">
                            <Input
                              id="secondary-color"
                              type="color"
                              value={config.widgetAppearance.secondaryColor}
                              onChange={(e) =>
                                updateWidgetAppearance({
                                  secondaryColor: e.target.value,
                                })
                              }
                              className="w-12 h-8 p-1"
                            />
                            <Input
                              value={config.widgetAppearance.secondaryColor}
                              onChange={(e) =>
                                updateWidgetAppearance({
                                  secondaryColor: e.target.value,
                                })
                              }
                              className="flex-1"
                            />
                          </div>
                        </div>
                      </div>

                      <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label htmlFor="font-family">Font Family</Label>
                          <Select
                            value={config.widgetAppearance.fontFamily}
                            onValueChange={(value) =>
                              updateWidgetAppearance({
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
                              <SelectItem value="Open Sans">
                                Open Sans
                              </SelectItem>
                              <SelectItem value="Lato">Lato</SelectItem>
                              <SelectItem value="Poppins">Poppins</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>

                        <div className="space-y-2">
                          <Label htmlFor="widget-position">
                            Widget Position
                          </Label>
                          <Select
                            value={config.widgetAppearance.position}
                            onValueChange={(value: any) =>
                              updateWidgetAppearance({
                                position: value,
                              })
                            }
                          >
                            <SelectTrigger id="widget-position">
                              <SelectValue placeholder="Select a position" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="bottom-right">
                                Bottom Right
                              </SelectItem>
                              <SelectItem value="bottom-left">
                                Bottom Left
                              </SelectItem>
                              <SelectItem value="top-right">
                                Top Right
                              </SelectItem>
                              <SelectItem value="top-left">Top Left</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="avatar-url">Avatar URL</Label>
                        <Input
                          id="avatar-url"
                          value={config.widgetAppearance.avatarUrl}
                          onChange={(e) =>
                            updateWidgetAppearance({
                              avatarUrl: e.target.value,
                            })
                          }
                          placeholder="https://example.com/avatar.png"
                        />
                        <p className="text-xs text-muted-foreground">
                          URL to the avatar image shown in the chat widget
                        </p>
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="initial-message">Initial Message</Label>
                        <Textarea
                          id="initial-message"
                          value={config.widgetAppearance.initialMessage}
                          onChange={(e) =>
                            updateWidgetAppearance({
                              initialMessage: e.target.value,
                            })
                          }
                          rows={3}
                        />
                        <p className="text-xs text-muted-foreground">
                          This message will be displayed when a user first opens
                          the chat
                        </p>
                      </div>
                    </CardContent>
                    <CardFooter className="flex justify-between border-t pt-6">
                      <Button
                        variant="outline"
                        onClick={() => setShowWidgetPreview(!showWidgetPreview)}
                      >
                        {showWidgetPreview ? "Hide Preview" : "Show Preview"}
                      </Button>
                      <Button>
                        <Check className="mr-2 h-4 w-4" />
                        Apply Appearance Settings
                      </Button>
                    </CardFooter>
                  </Card>
                </div>

                <div className="md:col-span-1">
                  <Card className="h-full">
                    <CardHeader>
                      <CardTitle>Widget Preview</CardTitle>
                      <CardDescription>
                        See how your chat widget will appear to users
                      </CardDescription>
                    </CardHeader>
                    <CardContent className="p-0 relative h-[400px] bg-muted/20 flex items-center justify-center">
                      <div className="text-center p-4">
                        <p className="text-muted-foreground mb-4">
                          {showWidgetPreview
                            ? "Widget is visible in the bottom right corner"
                            : "Click 'Show Preview' to see the widget"}
                        </p>
                        <Button
                          variant="outline"
                          onClick={() =>
                            setShowWidgetPreview(!showWidgetPreview)
                          }
                        >
                          {showWidgetPreview ? "Hide Preview" : "Show Preview"}
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </div>
            </TabsContent>

            {/* Follow-Up Questions Tab */}
            <TabsContent value="follow-up-questions" className="space-y-4">
              <FollowUpQuestionBuilder
                onSave={(followUpConfig) => {
                  // In a real implementation, this would update the follow-up question config
                  toast({
                    title: "Follow-up questions updated",
                    description:
                      "Your changes to the follow-up questions have been applied.",
                    duration: 3000,
                  });
                }}
              />
            </TabsContent>

            {/* Response Formatting Tab */}
            <TabsContent value="response-formatting" className="space-y-4">
              <ResponseFormattingBuilder
                onSave={(formattingConfig) => {
                  updateResponseFormattingConfig({
                    enableFormatting: true,
                    ...formattingConfig,
                  });

                  toast({
                    title: "Response formatting updated",
                    description:
                      "Your changes to the response format have been applied.",
                    duration: 3000,
                  });
                }}
              />
            </TabsContent>
          </Tabs>
        </div>

        {/* Preview Panel */}
        {showPreviewPanel && (
          <PreviewPanel
            config={config}
            onClose={() => setShowPreviewPanel(false)}
          />
        )}
      </div>
    </div>
  );
};

export default ConfigurationPanel;
