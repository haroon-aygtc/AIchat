import React, { useState, useRef } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Separator } from "@/components/ui/separator";
import { useToast } from "@/components/ui/use-toast";
import { motion } from "framer-motion";
import {
  Heading1,
  Heading2,
  Heading3,
  List,
  ListOrdered,
  Quote,
  AlignLeft,
  AlignCenter,
  AlignRight,
  Bold,
  Italic,
  Underline,
  Code,
  Link,
  Image,
  Table,
  GripVertical,
  Plus,
  Trash2,
  Copy,
  Check,
  X,
  MoveUp,
  MoveDown,
  Eye,
  Settings,
  Save,
} from "lucide-react";

interface ResponseFormattingBuilderProps {
  onSave?: (config: any) => void;
}

interface FormattingBlock {
  id: string;
  type: string;
  title?: string;
  content?: string;
  isRequired?: boolean;
  isVisible?: boolean;
  settings?: Record<string, any>;
}

const ResponseFormattingBuilder = ({
  onSave,
}: ResponseFormattingBuilderProps) => {
  const { toast } = useToast();
  const [blocks, setBlocks] = useState<FormattingBlock[]>([
    {
      id: "block-1",
      type: "title",
      title: "Response Title",
      isRequired: true,
      isVisible: true,
      settings: {
        alignment: "left",
        style: "h1",
      },
    },
    {
      id: "block-2",
      type: "paragraph",
      title: "Introduction",
      content:
        "This is the introduction paragraph that summarizes the response.",
      isRequired: true,
      isVisible: true,
      settings: {
        alignment: "left",
      },
    },
    {
      id: "block-3",
      type: "list",
      title: "Key Points",
      content: "Point 1\nPoint 2\nPoint 3",
      isRequired: false,
      isVisible: true,
      settings: {
        listType: "bullet",
      },
    },
    {
      id: "block-4",
      type: "paragraph",
      title: "Conclusion",
      content: "This is the conclusion paragraph that wraps up the response.",
      isRequired: false,
      isVisible: true,
      settings: {
        alignment: "left",
      },
    },
  ]);

  const [selectedBlockId, setSelectedBlockId] = useState<string | null>(
    "block-1",
  );
  const [previewMode, setPreviewMode] = useState(false);
  const [brandingEnabled, setBrandingEnabled] = useState(true);
  const [brandSettings, setBrandSettings] = useState({
    logo: "https://api.dicebear.com/7.x/initials/svg?seed=AI",
    primaryColor: "#7c3aed",
    secondaryColor: "#a78bfa",
    fontFamily: "Inter",
  });

  // Drag and drop functionality
  const [draggedBlockId, setDraggedBlockId] = useState<string | null>(null);
  const [dragOverBlockId, setDragOverBlockId] = useState<string | null>(null);
  const dragTimeoutRef = useRef<number | null>(null);

  const handleAddBlock = (type: string) => {
    const newBlock: FormattingBlock = {
      id: `block-${Date.now()}`,
      type,
      title: getDefaultTitleForType(type),
      content: getDefaultContentForType(type),
      isRequired: false,
      isVisible: true,
      settings: getDefaultSettingsForType(type),
    };

    setBlocks([...blocks, newBlock]);
    setSelectedBlockId(newBlock.id);

    toast({
      title: "Block added",
      description: `A new ${type} block has been added to your response format.`,
      duration: 3000,
    });
  };

  const handleDeleteBlock = (id: string) => {
    const blockToDelete = blocks.find((block) => block.id === id);
    if (blockToDelete?.isRequired) {
      toast({
        title: "Cannot delete required block",
        description: "This block is required and cannot be removed.",
        variant: "destructive",
        duration: 3000,
      });
      return;
    }

    const updatedBlocks = blocks.filter((block) => block.id !== id);
    setBlocks(updatedBlocks);

    if (selectedBlockId === id) {
      setSelectedBlockId(updatedBlocks.length > 0 ? updatedBlocks[0].id : null);
    }

    toast({
      title: "Block deleted",
      description: "The block has been removed from your response format.",
      duration: 3000,
    });
  };

  const handleDuplicateBlock = (id: string) => {
    const blockToDuplicate = blocks.find((block) => block.id === id);
    if (!blockToDuplicate) return;

    const newBlock: FormattingBlock = {
      ...blockToDuplicate,
      id: `block-${Date.now()}`,
      title: `${blockToDuplicate.title} (Copy)`,
      isRequired: false,
    };

    const blockIndex = blocks.findIndex((block) => block.id === id);
    const updatedBlocks = [...blocks];
    updatedBlocks.splice(blockIndex + 1, 0, newBlock);

    setBlocks(updatedBlocks);
    setSelectedBlockId(newBlock.id);

    toast({
      title: "Block duplicated",
      description: "A copy of the block has been created.",
      duration: 3000,
    });
  };

  const handleMoveBlock = (id: string, direction: "up" | "down") => {
    const blockIndex = blocks.findIndex((block) => block.id === id);
    if (blockIndex === -1) return;

    if (direction === "up" && blockIndex === 0) return;
    if (direction === "down" && blockIndex === blocks.length - 1) return;

    const updatedBlocks = [...blocks];
    const targetIndex = direction === "up" ? blockIndex - 1 : blockIndex + 1;

    [updatedBlocks[blockIndex], updatedBlocks[targetIndex]] = [
      updatedBlocks[targetIndex],
      updatedBlocks[blockIndex],
    ];

    setBlocks(updatedBlocks);
  };

  const handleDragStart = (id: string) => {
    if (previewMode) return;
    setDraggedBlockId(id);
  };

  const handleDragOver = (e: React.DragEvent, id: string) => {
    e.preventDefault();
    if (previewMode || !draggedBlockId || draggedBlockId === id) return;
    setDragOverBlockId(id);

    // Auto-scroll functionality
    const container = e.currentTarget.parentElement;
    if (!container) return;

    const containerRect = container.getBoundingClientRect();
    const scrollThreshold = 40; // pixels from top/bottom to trigger scroll

    if (e.clientY - containerRect.top < scrollThreshold) {
      // Near the top, scroll up
      if (dragTimeoutRef.current) window.clearTimeout(dragTimeoutRef.current);
      dragTimeoutRef.current = window.setTimeout(() => {
        container.scrollBy({ top: -20, behavior: "smooth" });
        dragTimeoutRef.current = null;
      }, 100);
    } else if (containerRect.bottom - e.clientY < scrollThreshold) {
      // Near the bottom, scroll down
      if (dragTimeoutRef.current) window.clearTimeout(dragTimeoutRef.current);
      dragTimeoutRef.current = window.setTimeout(() => {
        container.scrollBy({ top: 20, behavior: "smooth" });
        dragTimeoutRef.current = null;
      }, 100);
    }
  };

  const handleDragEnd = () => {
    if (
      previewMode ||
      !draggedBlockId ||
      !dragOverBlockId ||
      draggedBlockId === dragOverBlockId
    ) {
      setDraggedBlockId(null);
      setDragOverBlockId(null);
      return;
    }

    const draggedIndex = blocks.findIndex(
      (block) => block.id === draggedBlockId,
    );
    const dropIndex = blocks.findIndex((block) => block.id === dragOverBlockId);

    if (draggedIndex !== -1 && dropIndex !== -1) {
      const updatedBlocks = [...blocks];
      const [movedBlock] = updatedBlocks.splice(draggedIndex, 1);
      updatedBlocks.splice(dropIndex, 0, movedBlock);
      setBlocks(updatedBlocks);

      toast({
        title: "Block moved",
        description: "The block has been repositioned in your response format.",
        duration: 2000,
      });
    }

    setDraggedBlockId(null);
    setDragOverBlockId(null);
    if (dragTimeoutRef.current) {
      window.clearTimeout(dragTimeoutRef.current);
      dragTimeoutRef.current = null;
    }
  };

  const handleDragLeave = () => {
    setDragOverBlockId(null);
  };

  const handleUpdateBlock = (id: string, updates: Partial<FormattingBlock>) => {
    const updatedBlocks = blocks.map((block) =>
      block.id === id ? { ...block, ...updates } : block,
    );

    setBlocks(updatedBlocks);
  };

  const handleUpdateBlockSetting = (
    id: string,
    settingKey: string,
    value: any,
  ) => {
    const updatedBlocks = blocks.map((block) =>
      block.id === id
        ? {
            ...block,
            settings: {
              ...block.settings,
              [settingKey]: value,
            },
          }
        : block,
    );

    setBlocks(updatedBlocks);
  };

  const handleSaveFormat = () => {
    // In a real implementation, this would save the format to the backend
    toast({
      title: "Format saved",
      description: "Your response format has been saved successfully.",
      duration: 3000,
    });

    if (onSave) {
      onSave({
        blocks: blocks.filter((block) => block.isVisible),
        branding: brandingEnabled ? brandSettings : null,
      });
    }
  };

  const getDefaultTitleForType = (type: string): string => {
    const typeMap: Record<string, string> = {
      title: "Response Title",
      paragraph: "Text Block",
      list: "List Items",
      quote: "Quote Block",
      code: "Code Snippet",
      image: "Image",
      table: "Data Table",
      divider: "Section Divider",
    };

    return typeMap[type] || "New Block";
  };

  const getDefaultContentForType = (type: string): string => {
    const typeMap: Record<string, string> = {
      paragraph: "Enter your text content here.",
      list: "Item 1\nItem 2\nItem 3",
      quote: "Enter a notable quote or important information here.",
      code: "function example() {\n  return 'Hello, world!';\n}",
      table:
        "Header 1 | Header 2 | Header 3\n--- | --- | ---\nCell 1 | Cell 2 | Cell 3\nCell 4 | Cell 5 | Cell 6",
    };

    return typeMap[type] || "";
  };

  const getDefaultSettingsForType = (type: string): Record<string, any> => {
    const typeMap: Record<string, Record<string, any>> = {
      title: { alignment: "left", style: "h1" },
      paragraph: { alignment: "left" },
      list: { listType: "bullet" },
      quote: { alignment: "left" },
      code: { language: "javascript" },
      image: { alignment: "center", maxWidth: 100 },
      table: { includeHeader: true },
      divider: { style: "solid" },
    };

    return typeMap[type] || {};
  };

  const getBlockIcon = (type: string) => {
    const iconMap: Record<string, React.ReactNode> = {
      title: <Heading1 className="h-4 w-4" />,
      paragraph: <AlignLeft className="h-4 w-4" />,
      list: <List className="h-4 w-4" />,
      quote: <Quote className="h-4 w-4" />,
      code: <Code className="h-4 w-4" />,
      image: <Image className="h-4 w-4" />,
      table: <Table className="h-4 w-4" />,
      divider: <Separator className="h-4 w-4" />,
    };

    return iconMap[type] || <AlignLeft className="h-4 w-4" />;
  };

  const selectedBlock = selectedBlockId
    ? blocks.find((block) => block.id === selectedBlockId)
    : null;

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      <div className="md:col-span-1">
        <Card className="h-full">
          <CardHeader>
            <CardTitle>Response Structure</CardTitle>
            <CardDescription>
              Arrange and configure blocks to format AI responses
            </CardDescription>
          </CardHeader>
          <CardContent className="p-0">
            <div className="p-4 border-b flex items-center justify-between">
              <div className="flex gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setPreviewMode(!previewMode)}
                >
                  {previewMode ? (
                    <>
                      <Settings className="h-4 w-4 mr-2" />
                      Edit Mode
                    </>
                  ) : (
                    <>
                      <Eye className="h-4 w-4 mr-2" />
                      Preview
                    </>
                  )}
                </Button>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-sm text-muted-foreground">Branding</span>
                <Switch
                  checked={brandingEnabled}
                  onCheckedChange={setBrandingEnabled}
                />
              </div>
            </div>
            <div
              className="divide-y"
              style={{ minHeight: blocks.length ? "auto" : "100px" }}
            >
              {blocks.map((block) => (
                <motion.div
                  key={block.id}
                  className={`p-3 ${!previewMode ? "cursor-pointer hover:bg-muted/50" : ""} ${selectedBlockId === block.id && !previewMode ? "bg-primary/5" : ""} ${!block.isVisible ? "opacity-50" : ""} ${dragOverBlockId === block.id ? "border-2 border-primary border-dashed" : ""} ${draggedBlockId === block.id ? "opacity-60 bg-muted" : ""}`}
                  onClick={() => !previewMode && setSelectedBlockId(block.id)}
                  draggable={!previewMode}
                  onDragStart={() => handleDragStart(block.id)}
                  onDragOver={(e) => handleDragOver(e, block.id)}
                  onDragEnd={handleDragEnd}
                  onDragLeave={handleDragLeave}
                  animate={{
                    y: draggedBlockId === block.id ? 5 : 0,
                    scale: draggedBlockId === block.id ? 0.98 : 1,
                  }}
                  transition={{ type: "spring", stiffness: 300, damping: 20 }}
                >
                  {!previewMode ? (
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <div className="text-muted-foreground cursor-grab active:cursor-grabbing">
                          <GripVertical className="h-4 w-4" />
                        </div>
                        <div className="flex items-center gap-1.5">
                          {getBlockIcon(block.type)}
                          <span className="font-medium">{block.title}</span>
                        </div>
                        {block.isRequired && (
                          <Badge variant="outline" className="text-xs">
                            Required
                          </Badge>
                        )}
                      </div>
                      <div className="flex items-center gap-1">
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-7 w-7"
                          onClick={(e) => {
                            e.stopPropagation();
                            handleUpdateBlock(block.id, {
                              isVisible: !block.isVisible,
                            });
                          }}
                        >
                          {block.isVisible ? (
                            <Eye className="h-3.5 w-3.5" />
                          ) : (
                            <Eye className="h-3.5 w-3.5 text-muted-foreground" />
                          )}
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-7 w-7"
                          onClick={(e) => {
                            e.stopPropagation();
                            handleMoveBlock(block.id, "up");
                          }}
                          disabled={blocks.indexOf(block) === 0}
                        >
                          <MoveUp className="h-3.5 w-3.5" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-7 w-7"
                          onClick={(e) => {
                            e.stopPropagation();
                            handleMoveBlock(block.id, "down");
                          }}
                          disabled={blocks.indexOf(block) === blocks.length - 1}
                        >
                          <MoveDown className="h-3.5 w-3.5" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-7 w-7"
                          onClick={(e) => {
                            e.stopPropagation();
                            handleDuplicateBlock(block.id);
                          }}
                        >
                          <Copy className="h-3.5 w-3.5" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-7 w-7 text-destructive"
                          onClick={(e) => {
                            e.stopPropagation();
                            handleDeleteBlock(block.id);
                          }}
                          disabled={block.isRequired}
                        >
                          <Trash2 className="h-3.5 w-3.5" />
                        </Button>
                      </div>
                    </div>
                  ) : (
                    <div className="py-1">
                      {block.type === "title" && (
                        <div
                          className={`text-${block.settings?.style || "xl"} font-bold text-${block.settings?.alignment || "left"}`}
                        >
                          {block.title}
                        </div>
                      )}

                      {block.type === "paragraph" && (
                        <div
                          className={`text-${block.settings?.alignment || "left"}`}
                        >
                          {block.content}
                        </div>
                      )}

                      {block.type === "list" && (
                        <div>
                          {block.settings?.listType === "bullet" ? (
                            <ul className="list-disc pl-5 space-y-1">
                              {block.content
                                ?.split("\n")
                                .map((item, i) => <li key={i}>{item}</li>)}
                            </ul>
                          ) : (
                            <ol className="list-decimal pl-5 space-y-1">
                              {block.content
                                ?.split("\n")
                                .map((item, i) => <li key={i}>{item}</li>)}
                            </ol>
                          )}
                        </div>
                      )}

                      {block.type === "quote" && (
                        <blockquote className="border-l-4 border-muted pl-4 italic">
                          {block.content}
                        </blockquote>
                      )}

                      {block.type === "code" && (
                        <pre className="bg-muted p-3 rounded-md font-mono text-sm overflow-x-auto">
                          {block.content}
                        </pre>
                      )}

                      {block.type === "divider" && (
                        <Separator className="my-2" />
                      )}
                    </div>
                  )}
                </motion.div>
              ))}
            </div>

            {!previewMode && (
              <div className="p-4 border-t">
                <div className="text-sm font-medium mb-2">Add New Block</div>
                <div className="grid grid-cols-4 gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    className="h-auto py-2 px-2 flex flex-col items-center gap-1"
                    onClick={() => handleAddBlock("title")}
                  >
                    <Heading1 className="h-4 w-4" />
                    <span className="text-xs">Title</span>
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    className="h-auto py-2 px-2 flex flex-col items-center gap-1"
                    onClick={() => handleAddBlock("paragraph")}
                  >
                    <AlignLeft className="h-4 w-4" />
                    <span className="text-xs">Text</span>
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    className="h-auto py-2 px-2 flex flex-col items-center gap-1"
                    onClick={() => handleAddBlock("list")}
                  >
                    <List className="h-4 w-4" />
                    <span className="text-xs">List</span>
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    className="h-auto py-2 px-2 flex flex-col items-center gap-1"
                    onClick={() => handleAddBlock("quote")}
                  >
                    <Quote className="h-4 w-4" />
                    <span className="text-xs">Quote</span>
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    className="h-auto py-2 px-2 flex flex-col items-center gap-1"
                    onClick={() => handleAddBlock("code")}
                  >
                    <Code className="h-4 w-4" />
                    <span className="text-xs">Code</span>
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    className="h-auto py-2 px-2 flex flex-col items-center gap-1"
                    onClick={() => handleAddBlock("image")}
                  >
                    <Image className="h-4 w-4" />
                    <span className="text-xs">Image</span>
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    className="h-auto py-2 px-2 flex flex-col items-center gap-1"
                    onClick={() => handleAddBlock("table")}
                  >
                    <Table className="h-4 w-4" />
                    <span className="text-xs">Table</span>
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    className="h-auto py-2 px-2 flex flex-col items-center gap-1"
                    onClick={() => handleAddBlock("divider")}
                  >
                    <Separator className="h-4 w-4" />
                    <span className="text-xs">Divider</span>
                  </Button>
                </div>
              </div>
            )}
          </CardContent>
          <CardFooter className="flex justify-between border-t pt-6">
            <Button variant="outline">
              <X className="mr-2 h-4 w-4" />
              Reset
            </Button>
            <Button onClick={handleSaveFormat}>
              <Save className="mr-2 h-4 w-4" />
              Save Format
            </Button>
          </CardFooter>
        </Card>
      </div>

      <div className="md:col-span-2">
        {!previewMode && selectedBlock ? (
          <Card>
            <CardHeader>
              <CardTitle>Block Settings</CardTitle>
              <CardDescription>
                Configure the selected block properties
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="block-title">Block Title</Label>
                <Input
                  id="block-title"
                  value={selectedBlock.title || ""}
                  onChange={(e) =>
                    handleUpdateBlock(selectedBlock.id, {
                      title: e.target.value,
                    })
                  }
                  placeholder="Enter a title for this block"
                />
              </div>

              {(selectedBlock.type === "paragraph" ||
                selectedBlock.type === "list" ||
                selectedBlock.type === "quote" ||
                selectedBlock.type === "code") && (
                <div className="space-y-2">
                  <Label htmlFor="block-content">
                    {selectedBlock.type === "list"
                      ? "List Items (one per line)"
                      : "Content"}
                  </Label>
                  <Textarea
                    id="block-content"
                    value={selectedBlock.content || ""}
                    onChange={(e) =>
                      handleUpdateBlock(selectedBlock.id, {
                        content: e.target.value,
                      })
                    }
                    rows={5}
                    placeholder={getDefaultContentForType(selectedBlock.type)}
                  />
                </div>
              )}

              <Separator />

              <div className="space-y-4">
                <h3 className="text-sm font-medium">Display Settings</h3>

                {selectedBlock.type === "title" && (
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="title-style">Heading Style</Label>
                      <div className="flex gap-2">
                        <Button
                          variant={
                            selectedBlock.settings?.style === "h1"
                              ? "default"
                              : "outline"
                          }
                          size="sm"
                          onClick={() =>
                            handleUpdateBlockSetting(
                              selectedBlock.id,
                              "style",
                              "h1",
                            )
                          }
                        >
                          <Heading1 className="h-4 w-4" />
                        </Button>
                        <Button
                          variant={
                            selectedBlock.settings?.style === "h2"
                              ? "default"
                              : "outline"
                          }
                          size="sm"
                          onClick={() =>
                            handleUpdateBlockSetting(
                              selectedBlock.id,
                              "style",
                              "h2",
                            )
                          }
                        >
                          <Heading2 className="h-4 w-4" />
                        </Button>
                        <Button
                          variant={
                            selectedBlock.settings?.style === "h3"
                              ? "default"
                              : "outline"
                          }
                          size="sm"
                          onClick={() =>
                            handleUpdateBlockSetting(
                              selectedBlock.id,
                              "style",
                              "h3",
                            )
                          }
                        >
                          <Heading3 className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="title-alignment">Alignment</Label>
                      <div className="flex gap-2">
                        <Button
                          variant={
                            selectedBlock.settings?.alignment === "left"
                              ? "default"
                              : "outline"
                          }
                          size="sm"
                          onClick={() =>
                            handleUpdateBlockSetting(
                              selectedBlock.id,
                              "alignment",
                              "left",
                            )
                          }
                        >
                          <AlignLeft className="h-4 w-4" />
                        </Button>
                        <Button
                          variant={
                            selectedBlock.settings?.alignment === "center"
                              ? "default"
                              : "outline"
                          }
                          size="sm"
                          onClick={() =>
                            handleUpdateBlockSetting(
                              selectedBlock.id,
                              "alignment",
                              "center",
                            )
                          }
                        >
                          <AlignCenter className="h-4 w-4" />
                        </Button>
                        <Button
                          variant={
                            selectedBlock.settings?.alignment === "right"
                              ? "default"
                              : "outline"
                          }
                          size="sm"
                          onClick={() =>
                            handleUpdateBlockSetting(
                              selectedBlock.id,
                              "alignment",
                              "right",
                            )
                          }
                        >
                          <AlignRight className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  </div>
                )}

                {selectedBlock.type === "paragraph" && (
                  <div className="space-y-2">
                    <Label htmlFor="paragraph-alignment">Text Alignment</Label>
                    <div className="flex gap-2">
                      <Button
                        variant={
                          selectedBlock.settings?.alignment === "left"
                            ? "default"
                            : "outline"
                        }
                        size="sm"
                        onClick={() =>
                          handleUpdateBlockSetting(
                            selectedBlock.id,
                            "alignment",
                            "left",
                          )
                        }
                      >
                        <AlignLeft className="h-4 w-4" />
                      </Button>
                      <Button
                        variant={
                          selectedBlock.settings?.alignment === "center"
                            ? "default"
                            : "outline"
                        }
                        size="sm"
                        onClick={() =>
                          handleUpdateBlockSetting(
                            selectedBlock.id,
                            "alignment",
                            "center",
                          )
                        }
                      >
                        <AlignCenter className="h-4 w-4" />
                      </Button>
                      <Button
                        variant={
                          selectedBlock.settings?.alignment === "right"
                            ? "default"
                            : "outline"
                        }
                        size="sm"
                        onClick={() =>
                          handleUpdateBlockSetting(
                            selectedBlock.id,
                            "alignment",
                            "right",
                          )
                        }
                      >
                        <AlignRight className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                )}

                {selectedBlock.type === "list" && (
                  <div className="space-y-2">
                    <Label htmlFor="list-type">List Type</Label>
                    <div className="flex gap-2">
                      <Button
                        variant={
                          selectedBlock.settings?.listType === "bullet"
                            ? "default"
                            : "outline"
                        }
                        size="sm"
                        onClick={() =>
                          handleUpdateBlockSetting(
                            selectedBlock.id,
                            "listType",
                            "bullet",
                          )
                        }
                      >
                        <List className="h-4 w-4 mr-2" />
                        Bullet List
                      </Button>
                      <Button
                        variant={
                          selectedBlock.settings?.listType === "numbered"
                            ? "default"
                            : "outline"
                        }
                        size="sm"
                        onClick={() =>
                          handleUpdateBlockSetting(
                            selectedBlock.id,
                            "listType",
                            "numbered",
                          )
                        }
                      >
                        <ListOrdered className="h-4 w-4 mr-2" />
                        Numbered List
                      </Button>
                    </div>
                  </div>
                )}

                {selectedBlock.type === "code" && (
                  <div className="space-y-2">
                    <Label htmlFor="code-language">Language</Label>
                    <div className="flex gap-2">
                      <Button
                        variant={
                          selectedBlock.settings?.language === "javascript"
                            ? "default"
                            : "outline"
                        }
                        size="sm"
                        onClick={() =>
                          handleUpdateBlockSetting(
                            selectedBlock.id,
                            "language",
                            "javascript",
                          )
                        }
                      >
                        JavaScript
                      </Button>
                      <Button
                        variant={
                          selectedBlock.settings?.language === "python"
                            ? "default"
                            : "outline"
                        }
                        size="sm"
                        onClick={() =>
                          handleUpdateBlockSetting(
                            selectedBlock.id,
                            "language",
                            "python",
                          )
                        }
                      >
                        Python
                      </Button>
                      <Button
                        variant={
                          selectedBlock.settings?.language === "html"
                            ? "default"
                            : "outline"
                        }
                        size="sm"
                        onClick={() =>
                          handleUpdateBlockSetting(
                            selectedBlock.id,
                            "language",
                            "html",
                          )
                        }
                      >
                        HTML
                      </Button>
                    </div>
                  </div>
                )}
              </div>

              <Separator />

              <div className="flex items-center space-x-2">
                <Switch
                  id="block-required"
                  checked={selectedBlock.isRequired || false}
                  onCheckedChange={(checked) =>
                    handleUpdateBlock(selectedBlock.id, { isRequired: checked })
                  }
                />
                <div>
                  <Label htmlFor="block-required">Required Block</Label>
                  <p className="text-xs text-muted-foreground">
                    This block will always be included in the response
                  </p>
                </div>
              </div>
            </CardContent>
            <CardFooter className="flex justify-between border-t pt-6">
              <Button
                variant="outline"
                onClick={() => setSelectedBlockId(null)}
              >
                Cancel
              </Button>
              <Button>
                <Check className="mr-2 h-4 w-4" />
                Apply Changes
              </Button>
            </CardFooter>
          </Card>
        ) : (
          <Card>
            <CardHeader>
              <CardTitle>Response Preview</CardTitle>
              <CardDescription>
                {previewMode
                  ? "Preview how your AI responses will be formatted"
                  : "Select a block to edit its properties"}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div
                className={`p-6 border rounded-md ${brandingEnabled ? "bg-gradient-to-br from-white to-muted/30" : "bg-white"}`}
              >
                {brandingEnabled && (
                  <div className="flex items-center gap-2 mb-4 pb-4 border-b">
                    <div className="h-8 w-8 rounded-full overflow-hidden bg-primary/10">
                      <img
                        src={brandSettings.logo}
                        alt="Brand logo"
                        className="h-full w-full object-cover"
                      />
                    </div>
                    <div>
                      <div
                        className="font-medium"
                        style={{ color: brandSettings.primaryColor }}
                      >
                        AI Assistant
                      </div>
                      <div className="text-xs text-muted-foreground">
                        Powered by Your Brand
                      </div>
                    </div>
                  </div>
                )}

                <div className="space-y-4">
                  {blocks
                    .filter((block) => block.isVisible)
                    .map((block) => (
                      <div key={block.id} className="py-1">
                        {block.type === "title" && (
                          <div
                            className={`text-${block.settings?.style === "h1" ? "2xl" : block.settings?.style === "h2" ? "xl" : "lg"} font-bold text-${block.settings?.alignment || "left"}`}
                            style={{
                              color: brandingEnabled
                                ? brandSettings.primaryColor
                                : undefined,
                            }}
                          >
                            {block.title}
                          </div>
                        )}

                        {block.type === "paragraph" && (
                          <div
                            className={`text-${block.settings?.alignment || "left"}`}
                          >
                            {block.content}
                          </div>
                        )}

                        {block.type === "list" && (
                          <div>
                            {block.settings?.listType === "bullet" ? (
                              <ul className="list-disc pl-5 space-y-1">
                                {block.content
                                  ?.split("\n")
                                  .map((item, i) => <li key={i}>{item}</li>)}
                              </ul>
                            ) : (
                              <ol className="list-decimal pl-5 space-y-1">
                                {block.content
                                  ?.split("\n")
                                  .map((item, i) => <li key={i}>{item}</li>)}
                              </ol>
                            )}
                          </div>
                        )}

                        {block.type === "quote" && (
                          <blockquote
                            className="border-l-4 pl-4 italic"
                            style={{
                              borderColor: brandingEnabled
                                ? brandSettings.secondaryColor
                                : undefined,
                            }}
                          >
                            {block.content}
                          </blockquote>
                        )}

                        {block.type === "code" && (
                          <pre className="bg-muted p-3 rounded-md font-mono text-sm overflow-x-auto">
                            {block.content}
                          </pre>
                        )}

                        {block.type === "divider" && (
                          <Separator className="my-2" />
                        )}
                      </div>
                    ))}
                </div>

                {brandingEnabled && (
                  <div className="mt-6 pt-4 border-t flex justify-between items-center text-xs text-muted-foreground">
                    <div>Generated by AI Assistant</div>
                    <div style={{ color: brandSettings.secondaryColor }}>
                      Your Brand © {new Date().getFullYear()}
                    </div>
                  </div>
                )}
              </div>
            </CardContent>
            {brandingEnabled && (
              <CardFooter className="flex-col items-start gap-4 border-t pt-6">
                <h3 className="text-sm font-medium">Branding Settings</h3>
                <div className="grid grid-cols-2 gap-4 w-full">
                  <div className="space-y-2">
                    <Label htmlFor="brand-primary-color">Primary Color</Label>
                    <div className="flex items-center space-x-2">
                      <Input
                        id="brand-primary-color"
                        type="color"
                        value={brandSettings.primaryColor}
                        onChange={(e) =>
                          setBrandSettings({
                            ...brandSettings,
                            primaryColor: e.target.value,
                          })
                        }
                        className="w-12 h-8 p-1"
                      />
                      <Input
                        value={brandSettings.primaryColor}
                        onChange={(e) =>
                          setBrandSettings({
                            ...brandSettings,
                            primaryColor: e.target.value,
                          })
                        }
                        className="flex-1"
                      />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="brand-secondary-color">
                      Secondary Color
                    </Label>
                    <div className="flex items-center space-x-2">
                      <Input
                        id="brand-secondary-color"
                        type="color"
                        value={brandSettings.secondaryColor}
                        onChange={(e) =>
                          setBrandSettings({
                            ...brandSettings,
                            secondaryColor: e.target.value,
                          })
                        }
                        className="w-12 h-8 p-1"
                      />
                      <Input
                        value={brandSettings.secondaryColor}
                        onChange={(e) =>
                          setBrandSettings({
                            ...brandSettings,
                            secondaryColor: e.target.value,
                          })
                        }
                        className="flex-1"
                      />
                    </div>
                  </div>
                </div>
              </CardFooter>
            )}
          </Card>
        )}
      </div>
    </div>
  );
};

export default ResponseFormattingBuilder;
