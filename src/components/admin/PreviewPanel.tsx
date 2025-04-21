import React, { useState } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  CardFooter,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { Play, X } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";
import ResponseFormatter from "@/components/chat/ResponseFormatter";
import aiService, { AIResponse } from "@/services/aiService";
import { ChatSystemConfig } from "@/services/configurationService";

interface PreviewPanelProps {
  config: ChatSystemConfig;
  onClose: () => void;
}

const PreviewPanel = ({ config, onClose }: PreviewPanelProps) => {
  const { toast } = useToast();
  const [previewPrompt, setPreviewPrompt] = useState("");
  const [previewResponse, setPreviewResponse] = useState<AIResponse | null>(
    null,
  );
  const [isGeneratingPreview, setIsGeneratingPreview] = useState(false);

  const handleGeneratePreview = async () => {
    if (!previewPrompt.trim()) {
      toast({
        title: "Prompt required",
        description: "Please enter a prompt to generate a preview.",
        variant: "destructive",
        duration: 3000,
      });
      return;
    }

    setIsGeneratingPreview(true);
    setPreviewResponse(null);

    try {
      // Configure AI service with current settings
      aiService.setConfig(config.aiModel);

      // Generate response
      const response = await aiService.generateResponse(previewPrompt, {
        includeReasoning: true,
        includeSources: config.knowledgeBase.enableKnowledgeBase,
      });

      setPreviewResponse(response);
    } catch (error) {
      console.error("Error generating preview:", error);
      toast({
        title: "Preview generation failed",
        description: "There was an error generating the preview.",
        variant: "destructive",
        duration: 3000,
      });
    } finally {
      setIsGeneratingPreview(false);
    }
  };

  return (
    <div className="w-[400px] border-l pl-4 flex flex-col h-full">
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-lg font-medium">Configuration Preview</h3>
        <Button variant="ghost" size="icon" onClick={onClose}>
          <X className="h-4 w-4" />
        </Button>
      </div>

      <div className="space-y-4 flex-1 overflow-auto">
        <div className="space-y-2">
          <Label htmlFor="preview-prompt">Test Prompt</Label>
          <Textarea
            id="preview-prompt"
            placeholder="Enter a prompt to test the current configuration..."
            value={previewPrompt}
            onChange={(e) => setPreviewPrompt(e.target.value)}
            rows={3}
            className="resize-none"
          />
        </div>

        <Button
          onClick={handleGeneratePreview}
          disabled={!previewPrompt.trim() || isGeneratingPreview}
          className="w-full"
        >
          {isGeneratingPreview ? (
            <>
              <div className="animate-spin h-4 w-4 mr-2 border-2 border-current border-t-transparent rounded-full" />
              Generating...
            </>
          ) : (
            <>
              <Play className="h-4 w-4 mr-2" />
              Generate Response
            </>
          )}
        </Button>

        <Separator />

        <div className="flex-1">
          <div className="text-sm font-medium mb-2">Preview Result:</div>

          {isGeneratingPreview ? (
            <div className="flex items-center justify-center h-[200px]">
              <div className="flex flex-col items-center gap-2">
                <div className="animate-spin h-6 w-6 border-2 border-primary border-t-transparent rounded-full" />
                <p className="text-sm text-muted-foreground">
                  Generating preview...
                </p>
              </div>
            </div>
          ) : previewResponse ? (
            <div className="space-y-4 p-4 border rounded-md bg-muted/20">
              <ResponseFormatter
                response={previewResponse.content}
                format={config.responseFormatting.format || "structured"}
                includeTitle={config.responseFormatting.includeTitle}
                includeIntro={config.responseFormatting.includeIntro}
                includeContentBlocks={
                  config.responseFormatting.includeContentBlocks
                }
                className="text-sm"
              />

              {previewResponse.confidenceScore !== undefined && (
                <div className="flex items-center gap-1.5 mt-2 pt-2 border-t">
                  <span className="text-xs text-muted-foreground">
                    Confidence:
                  </span>
                  <div className="w-24 h-2 bg-muted rounded-full overflow-hidden">
                    <div
                      className={`h-full ${
                        previewResponse.confidenceScore >= 90
                          ? "bg-green-500"
                          : previewResponse.confidenceScore >= 75
                            ? "bg-amber-500"
                            : "bg-red-500"
                      }`}
                      style={{ width: `${previewResponse.confidenceScore}%` }}
                    />
                  </div>
                  <span className="text-xs font-medium">
                    {previewResponse.confidenceScore}%
                  </span>
                </div>
              )}

              {previewResponse.sources &&
                previewResponse.sources.length > 0 && (
                  <div className="mt-4 pt-2 border-t">
                    <h4 className="text-xs font-medium mb-2">
                      Knowledge Sources:
                    </h4>
                    <ul className="text-xs space-y-1">
                      {previewResponse.sources.map((source, index) => (
                        <li key={index} className="flex items-start gap-1">
                          <span className="text-primary">•</span>
                          <span className="text-muted-foreground">
                            {source.title || source.url}
                          </span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
            </div>
          ) : (
            <div className="flex items-center justify-center h-[200px] text-center p-4 border rounded-md bg-muted/20">
              <p className="text-sm text-muted-foreground">
                Enter a test prompt and click "Generate Response" to see how the
                AI would respond with the current configuration.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default PreviewPanel;
