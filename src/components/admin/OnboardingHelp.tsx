import React from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Separator } from "@/components/ui/separator";
import {
  Database,
  MessageSquare,
  Settings,
  Zap,
  Palette,
  FileText,
  HelpCircle,
  ArrowRight,
  Check,
  Sparkles,
  Layers,
} from "lucide-react";

interface OnboardingHelpProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const OnboardingHelp = ({ open, onOpenChange }: OnboardingHelpProps) => {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-xl">
            <HelpCircle className="h-5 w-5 text-primary" />
            AI Configuration Panel Guide
          </DialogTitle>
          <DialogDescription>
            Learn how to configure your AI assistant for optimal performance
          </DialogDescription>
        </DialogHeader>

        <Tabs defaultValue="overview">
          <TabsList className="grid grid-cols-7 mb-4">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="knowledge-base">
              <Database className="h-4 w-4 mr-1" />
              Knowledge Base
            </TabsTrigger>
            <TabsTrigger value="prompt-templates">
              <MessageSquare className="h-4 w-4 mr-1" />
              Prompts
            </TabsTrigger>
            <TabsTrigger value="ai-models">
              <Settings className="h-4 w-4 mr-1" />
              AI Models
            </TabsTrigger>
            <TabsTrigger value="follow-up">
              <Zap className="h-4 w-4 mr-1" />
              Follow-Up
            </TabsTrigger>
            <TabsTrigger value="appearance">
              <Palette className="h-4 w-4 mr-1" />
              Appearance
            </TabsTrigger>
            <TabsTrigger value="formatting">
              <FileText className="h-4 w-4 mr-1" />
              Formatting
            </TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-4">
            <div className="space-y-2">
              <h3 className="text-lg font-medium">
                Welcome to the AI Configuration Panel
              </h3>
              <p className="text-muted-foreground">
                This panel allows you to customize every aspect of your AI
                assistant. Here's what you can do:
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="border rounded-md p-4 space-y-2">
                <div className="flex items-center gap-2">
                  <Database className="h-5 w-5 text-primary" />
                  <h4 className="font-medium">Knowledge Base</h4>
                </div>
                <p className="text-sm text-muted-foreground">
                  Select which knowledge sources the AI can access when
                  responding to queries.
                </p>
                <div className="flex items-center gap-1 text-sm text-primary">
                  <ArrowRight className="h-3.5 w-3.5" />
                  <span>Configure knowledge sources</span>
                </div>
              </div>

              <div className="border rounded-md p-4 space-y-2">
                <div className="flex items-center gap-2">
                  <MessageSquare className="h-5 w-5 text-primary" />
                  <h4 className="font-medium">Prompt Templates</h4>
                </div>
                <p className="text-sm text-muted-foreground">
                  Create and manage templates that control how the AI interprets
                  user queries.
                </p>
                <div className="flex items-center gap-1 text-sm text-primary">
                  <ArrowRight className="h-3.5 w-3.5" />
                  <span>Design prompt templates</span>
                </div>
              </div>

              <div className="border rounded-md p-4 space-y-2">
                <div className="flex items-center gap-2">
                  <Settings className="h-5 w-5 text-primary" />
                  <h4 className="font-medium">AI Models</h4>
                </div>
                <p className="text-sm text-muted-foreground">
                  Configure which AI models to use and adjust their parameters
                  for optimal results.
                </p>
                <div className="flex items-center gap-1 text-sm text-primary">
                  <ArrowRight className="h-3.5 w-3.5" />
                  <span>Set up AI models</span>
                </div>
              </div>

              <div className="border rounded-md p-4 space-y-2">
                <div className="flex items-center gap-2">
                  <Zap className="h-5 w-5 text-primary" />
                  <h4 className="font-medium">Follow-Up Questions</h4>
                </div>
                <p className="text-sm text-muted-foreground">
                  Create automated follow-up questions to enhance user
                  engagement.
                </p>
                <div className="flex items-center gap-1 text-sm text-primary">
                  <ArrowRight className="h-3.5 w-3.5" />
                  <span>Build follow-up flows</span>
                </div>
              </div>

              <div className="border rounded-md p-4 space-y-2">
                <div className="flex items-center gap-2">
                  <Palette className="h-5 w-5 text-primary" />
                  <h4 className="font-medium">Widget Appearance</h4>
                </div>
                <p className="text-sm text-muted-foreground">
                  Customize how the chat widget looks and behaves on your
                  website.
                </p>
                <div className="flex items-center gap-1 text-sm text-primary">
                  <ArrowRight className="h-3.5 w-3.5" />
                  <span>Style your widget</span>
                </div>
              </div>

              <div className="border rounded-md p-4 space-y-2">
                <div className="flex items-center gap-2">
                  <FileText className="h-5 w-5 text-primary" />
                  <h4 className="font-medium">Response Formatting</h4>
                </div>
                <p className="text-sm text-muted-foreground">
                  Control how AI responses are structured and formatted for
                  users.
                </p>
                <div className="flex items-center gap-1 text-sm text-primary">
                  <ArrowRight className="h-3.5 w-3.5" />
                  <span>Format responses</span>
                </div>
              </div>
            </div>

            <div className="bg-muted/20 p-4 rounded-md">
              <div className="flex items-center gap-2 mb-2">
                <Layers className="h-5 w-5 text-primary" />
                <h4 className="font-medium">Multiple Configurations</h4>
              </div>
              <p className="text-sm text-muted-foreground mb-2">
                You can create and save multiple AI configurations for different
                use cases. For example, you might have one configuration for
                customer support and another for sales.
              </p>
              <div className="flex items-center gap-1 text-sm">
                <Check className="h-4 w-4 text-green-500" />
                <span>
                  Click the "Configurations" button to manage your saved
                  configurations.
                </span>
              </div>
            </div>

            <div className="bg-muted/20 p-4 rounded-md">
              <div className="flex items-center gap-2 mb-2">
                <Sparkles className="h-5 w-5 text-primary" />
                <h4 className="font-medium">Test Your Configuration</h4>
              </div>
              <p className="text-sm text-muted-foreground mb-2">
                You can test your AI configuration at any time to see how it
                performs with real queries.
              </p>
              <div className="flex items-center gap-1 text-sm">
                <Check className="h-4 w-4 text-green-500" />
                <span>
                  Click the "Test Configuration" button to try out your
                  settings.
                </span>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="knowledge-base" className="space-y-4">
            <div className="space-y-2">
              <h3 className="text-lg font-medium">
                Knowledge Base Configuration
              </h3>
              <p className="text-muted-foreground">
                The Knowledge Base tab allows you to select which knowledge
                sources the AI can access when responding to user queries.
              </p>
            </div>

            <div className="space-y-4">
              <div className="border rounded-md p-4 space-y-2">
                <h4 className="font-medium">Knowledge Sources</h4>
                <p className="text-sm text-muted-foreground">
                  These are the different sources of information that the AI can
                  use to answer questions. Sources can include internal
                  documentation, databases, external APIs, and more.
                </p>
                <div className="flex items-center gap-1 text-sm">
                  <Check className="h-4 w-4 text-green-500" />
                  <span>
                    Toggle sources on/off to control which ones the AI can
                    access.
                  </span>
                </div>
                <div className="flex items-center gap-1 text-sm">
                  <Check className="h-4 w-4 text-green-500" />
                  <span>
                    Click on a source to view its details and statistics.
                  </span>
                </div>
              </div>

              <div className="border rounded-md p-4 space-y-2">
                <h4 className="font-medium">Knowledge Base Settings</h4>
                <p className="text-sm text-muted-foreground">
                  These settings control how the AI uses the knowledge base when
                  generating responses.
                </p>
                <div className="flex items-center gap-1 text-sm">
                  <Check className="h-4 w-4 text-green-500" />
                  <span>
                    <strong>Enable Knowledge Base:</strong> Turn the entire
                    knowledge base on or off.
                  </span>
                </div>
                <div className="flex items-center gap-1 text-sm">
                  <Check className="h-4 w-4 text-green-500" />
                  <span>
                    <strong>Auto-inject Relevant Content:</strong> Automatically
                    include relevant knowledge base content in responses.
                  </span>
                </div>
                <div className="flex items-center gap-1 text-sm">
                  <Check className="h-4 w-4 text-green-500" />
                  <span>
                    <strong>Cite Sources:</strong> Include citations when
                    knowledge base content is used.
                  </span>
                </div>
                <div className="flex items-center gap-1 text-sm">
                  <Check className="h-4 w-4 text-green-500" />
                  <span>
                    <strong>Relevance Threshold:</strong> Set the minimum
                    relevance score for content to be included.
                  </span>
                </div>
                <div className="flex items-center gap-1 text-sm">
                  <Check className="h-4 w-4 text-green-500" />
                  <span>
                    <strong>Maximum Sources:</strong> Limit the number of
                    knowledge sources used in a response.
                  </span>
                </div>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="prompt-templates" className="space-y-4">
            <div className="space-y-2">
              <h3 className="text-lg font-medium">Prompt Templates</h3>
              <p className="text-muted-foreground">
                Prompt templates control how the AI interprets and responds to
                user queries. They provide structure and context to help the AI
                generate better responses.
              </p>
            </div>

            <div className="space-y-4">
              <div className="border rounded-md p-4 space-y-2">
                <h4 className="font-medium">Template Library</h4>
                <p className="text-sm text-muted-foreground">
                  Browse, search, and manage your prompt templates. You can
                  create new templates, edit existing ones, and delete templates
                  you no longer need.
                </p>
                <div className="flex items-center gap-1 text-sm">
                  <Check className="h-4 w-4 text-green-500" />
                  <span>Click on a template to view its details.</span>
                </div>
                <div className="flex items-center gap-1 text-sm">
                  <Check className="h-4 w-4 text-green-500" />
                  <span>
                    Use the "Add New" button to create a new template.
                  </span>
                </div>
              </div>

              <div className="border rounded-md p-4 space-y-2">
                <h4 className="font-medium">Template Editor</h4>
                <p className="text-sm text-muted-foreground">
                  Create and edit prompt templates with variables that can be
                  replaced with actual values when the template is used.
                </p>
                <div className="flex items-center gap-1 text-sm">
                  <Check className="h-4 w-4 text-green-500" />
                  <span>
                    Use variables like {`{{user_query}}`} to insert dynamic
                    content.
                  </span>
                </div>
                <div className="flex items-center gap-1 text-sm">
                  <Check className="h-4 w-4 text-green-500" />
                  <span>
                    Test your template with sample queries to see how it
                    performs.
                  </span>
                </div>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="ai-models" className="space-y-4">
            <div className="space-y-2">
              <h3 className="text-lg font-medium">AI Model Settings</h3>
              <p className="text-muted-foreground">
                Configure which AI models to use and adjust their parameters for
                optimal results.
              </p>
            </div>

            <div className="space-y-4">
              <div className="border rounded-md p-4 space-y-2">
                <h4 className="font-medium">Model Selection</h4>
                <p className="text-sm text-muted-foreground">
                  Choose which AI model to use for generating responses.
                  Different models have different capabilities and performance
                  characteristics.
                </p>
                <div className="flex items-center gap-1 text-sm">
                  <Check className="h-4 w-4 text-green-500" />
                  <span>
                    Select from Google Gemini, Hugging Face, or custom models.
                  </span>
                </div>
              </div>

              <div className="border rounded-md p-4 space-y-2">
                <h4 className="font-medium">API Key Configuration</h4>
                <p className="text-sm text-muted-foreground">
                  Enter your API keys for the selected AI model providers. These
                  keys are required to access the AI models.
                </p>
                <div className="flex items-center gap-1 text-sm">
                  <Check className="h-4 w-4 text-green-500" />
                  <span>Test your API keys to ensure they are valid.</span>
                </div>
                <div className="flex items-center gap-1 text-sm">
                  <Check className="h-4 w-4 text-green-500" />
                  <span>API keys are securely stored and never shared.</span>
                </div>
              </div>

              <div className="border rounded-md p-4 space-y-2">
                <h4 className="font-medium">Model Parameters</h4>
                <p className="text-sm text-muted-foreground">
                  Adjust parameters that control how the AI generates responses.
                  These settings affect the creativity, length, and quality of
                  the responses.
                </p>
                <div className="flex items-center gap-1 text-sm">
                  <Check className="h-4 w-4 text-green-500" />
                  <span>
                    <strong>Temperature:</strong> Controls randomness. Lower
                    values are more deterministic, higher values are more
                    creative.
                  </span>
                </div>
                <div className="flex items-center gap-1 text-sm">
                  <Check className="h-4 w-4 text-green-500" />
                  <span>
                    <strong>Max Tokens:</strong> Controls the maximum length of
                    generated responses.
                  </span>
                </div>
                <div className="flex items-center gap-1 text-sm">
                  <Check className="h-4 w-4 text-green-500" />
                  <span>
                    <strong>Top P:</strong> Controls diversity via nucleus
                    sampling.
                  </span>
                </div>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="follow-up" className="space-y-4">
            <div className="space-y-2">
              <h3 className="text-lg font-medium">Follow-Up Questions</h3>
              <p className="text-muted-foreground">
                Create automated follow-up questions to enhance user engagement
                and guide conversations.
              </p>
            </div>

            <div className="space-y-4">
              <div className="border rounded-md p-4 space-y-2">
                <h4 className="font-medium">Question Management</h4>
                <p className="text-sm text-muted-foreground">
                  Create, edit, and manage follow-up questions that will be
                  presented to users after the AI responds to their initial
                  query.
                </p>
                <div className="flex items-center gap-1 text-sm">
                  <Check className="h-4 w-4 text-green-500" />
                  <span>
                    Toggle between list view and flow view to manage questions.
                  </span>
                </div>
                <div className="flex items-center gap-1 text-sm">
                  <Check className="h-4 w-4 text-green-500" />
                  <span>Add new questions using the "Add" button.</span>
                </div>
              </div>

              <div className="border rounded-md p-4 space-y-2">
                <h4 className="font-medium">Question Settings</h4>
                <p className="text-sm text-muted-foreground">
                  Configure when and how follow-up questions are presented to
                  users.
                </p>
                <div className="flex items-center gap-1 text-sm">
                  <Check className="h-4 w-4 text-green-500" />
                  <span>
                    <strong>Display Condition:</strong> Set conditions for when
                    a question should be shown.
                  </span>
                </div>
                <div className="flex items-center gap-1 text-sm">
                  <Check className="h-4 w-4 text-green-500" />
                  <span>
                    <strong>Priority:</strong> Set the priority of questions
                    when multiple match the conditions.
                  </span>
                </div>
                <div className="flex items-center gap-1 text-sm">
                  <Check className="h-4 w-4 text-green-500" />
                  <span>
                    <strong>Default Question:</strong> Set a question to always
                    be included if no others match.
                  </span>
                </div>
              </div>

              <div className="border rounded-md p-4 space-y-2">
                <h4 className="font-medium">Question Flow</h4>
                <p className="text-sm text-muted-foreground">
                  Create sequences of follow-up questions to guide users through
                  a conversation flow.
                </p>
                <div className="flex items-center gap-1 text-sm">
                  <Check className="h-4 w-4 text-green-500" />
                  <span>
                    Link questions together to create conversation paths.
                  </span>
                </div>
                <div className="flex items-center gap-1 text-sm">
                  <Check className="h-4 w-4 text-green-500" />
                  <span>
                    Use flow view to visualize and edit question sequences.
                  </span>
                </div>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="appearance" className="space-y-4">
            <div className="space-y-2">
              <h3 className="text-lg font-medium">Widget Appearance</h3>
              <p className="text-muted-foreground">
                Customize how the chat widget looks and behaves on your website.
              </p>
            </div>

            <div className="space-y-4">
              <div className="border rounded-md p-4 space-y-2">
                <h4 className="font-medium">Basic Settings</h4>
                <p className="text-sm text-muted-foreground">
                  Configure the basic appearance and behavior of the chat
                  widget.
                </p>
                <div className="flex items-center gap-1 text-sm">
                  <Check className="h-4 w-4 text-green-500" />
                  <span>
                    <strong>Widget Title:</strong> Set the title displayed at
                    the top of the chat widget.
                  </span>
                </div>
                <div className="flex items-center gap-1 text-sm">
                  <Check className="h-4 w-4 text-green-500" />
                  <span>
                    <strong>Widget Subtitle:</strong> Set the subtitle displayed
                    below the title.
                  </span>
                </div>
                <div className="flex items-center gap-1 text-sm">
                  <Check className="h-4 w-4 text-green-500" />
                  <span>
                    <strong>Initial Message:</strong> Set the message displayed
                    when a user first opens the chat.
                  </span>
                </div>
              </div>

              <div className="border rounded-md p-4 space-y-2">
                <h4 className="font-medium">Styling</h4>
                <p className="text-sm text-muted-foreground">
                  Customize the visual appearance of the chat widget to match
                  your brand.
                </p>
                <div className="flex items-center gap-1 text-sm">
                  <Check className="h-4 w-4 text-green-500" />
                  <span>
                    <strong>Primary Color:</strong> Set the main color used
                    throughout the widget.
                  </span>
                </div>
                <div className="flex items-center gap-1 text-sm">
                  <Check className="h-4 w-4 text-green-500" />
                  <span>
                    <strong>Secondary Color:</strong> Set the secondary color
                    used for accents.
                  </span>
                </div>
                <div className="flex items-center gap-1 text-sm">
                  <Check className="h-4 w-4 text-green-500" />
                  <span>
                    <strong>Font Family:</strong> Choose the font used in the
                    widget.
                  </span>
                </div>
                <div className="flex items-center gap-1 text-sm">
                  <Check className="h-4 w-4 text-green-500" />
                  <span>
                    <strong>Avatar URL:</strong> Set the URL for the avatar
                    image shown in the chat.
                  </span>
                </div>
              </div>

              <div className="border rounded-md p-4 space-y-2">
                <h4 className="font-medium">Placement</h4>
                <p className="text-sm text-muted-foreground">
                  Control where the chat widget appears on your website.
                </p>
                <div className="flex items-center gap-1 text-sm">
                  <Check className="h-4 w-4 text-green-500" />
                  <span>
                    <strong>Widget Position:</strong> Choose where the widget
                    appears (bottom-right, bottom-left, etc.).
                  </span>
                </div>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="formatting" className="space-y-4">
            <div className="space-y-2">
              <h3 className="text-lg font-medium">Response Formatting</h3>
              <p className="text-muted-foreground">
                Control how AI responses are structured and formatted for users.
              </p>
            </div>

            <div className="space-y-4">
              <div className="border rounded-md p-4 space-y-2">
                <h4 className="font-medium">Response Structure</h4>
                <p className="text-sm text-muted-foreground">
                  Arrange and configure blocks to format AI responses. You can
                  add, remove, and reorder blocks to create the perfect response
                  structure.
                </p>
                <div className="flex items-center gap-1 text-sm">
                  <Check className="h-4 w-4 text-green-500" />
                  <span>Drag and drop blocks to reorder them.</span>
                </div>
                <div className="flex items-center gap-1 text-sm">
                  <Check className="h-4 w-4 text-green-500" />
                  <span>
                    Toggle visibility of blocks to show or hide them in
                    responses.
                  </span>
                </div>
                <div className="flex items-center gap-1 text-sm">
                  <Check className="h-4 w-4 text-green-500" />
                  <span>
                    Mark blocks as required to ensure they are always included.
                  </span>
                </div>
              </div>

              <div className="border rounded-md p-4 space-y-2">
                <h4 className="font-medium">Block Types</h4>
                <p className="text-sm text-muted-foreground">
                  Different types of blocks that can be used to format
                  responses.
                </p>
                <div className="flex items-center gap-1 text-sm">
                  <Check className="h-4 w-4 text-green-500" />
                  <span>
                    <strong>Title:</strong> A heading for the response.
                  </span>
                </div>
                <div className="flex items-center gap-1 text-sm">
                  <Check className="h-4 w-4 text-green-500" />
                  <span>
                    <strong>Text:</strong> A paragraph of text.
                  </span>
                </div>
                <div className="flex items-center gap-1 text-sm">
                  <Check className="h-4 w-4 text-green-500" />
                  <span>
                    <strong>List:</strong> A bullet or numbered list.
                  </span>
                </div>
                <div className="flex items-center gap-1 text-sm">
                  <Check className="h-4 w-4 text-green-500" />
                  <span>
                    <strong>Quote:</strong> A blockquote for important
                    information.
                  </span>
                </div>
                <div className="flex items-center gap-1 text-sm">
                  <Check className="h-4 w-4 text-green-500" />
                  <span>
                    <strong>Code:</strong> A code snippet.
                  </span>
                </div>
                <div className="flex items-center gap-1 text-sm">
                  <Check className="h-4 w-4 text-green-500" />
                  <span>
                    <strong>Divider:</strong> A horizontal line to separate
                    sections.
                  </span>
                </div>
              </div>

              <div className="border rounded-md p-4 space-y-2">
                <h4 className="font-medium">Branding</h4>
                <p className="text-sm text-muted-foreground">
                  Add branding elements to your AI responses.
                </p>
                <div className="flex items-center gap-1 text-sm">
                  <Check className="h-4 w-4 text-green-500" />
                  <span>Toggle branding on/off.</span>
                </div>
                <div className="flex items-center gap-1 text-sm">
                  <Check className="h-4 w-4 text-green-500" />
                  <span>Customize branding colors and logo.</span>
                </div>
              </div>
            </div>
          </TabsContent>
        </Tabs>

        <Separator className="my-4" />

        <DialogFooter>
          <Button onClick={() => onOpenChange(false)}>Close Guide</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default OnboardingHelp;
