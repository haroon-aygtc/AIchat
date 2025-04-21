import React, { useState } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Slider } from "@/components/ui/slider";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useToast } from "@/components/ui/use-toast";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import {
  LayoutGrid,
  Plus,
  Trash2,
  Copy,
  Move,
  Layers,
  Save,
  Eye,
  EyeOff,
  PanelLeft,
  PanelRight,
  LayoutTemplate,
  Palette,
  Settings,
  Database,
  LineChart,
  List,
  Table,
  BarChart,
  PieChart,
  Timer,
  Gauge,
  Sparkles,
  Undo2,
  Redo2,
  History,
  Download,
  Upload,
  Smartphone,
  Tablet,
  Monitor,
  Maximize2,
  Minimize2,
  Lock,
  Unlock,
  Lightbulb,
  Zap,
  Check,
  X,
  ArrowRight,
} from "lucide-react";

interface WidgetBuilderProps {
  onSave?: (widgetConfig: any) => void;
}

const WidgetBuilder = ({ onSave = () => {} }: WidgetBuilderProps) => {
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState("layout");
  const [selectedWidget, setSelectedWidget] = useState<string | null>(null);
  const [widgets, setWidgets] = useState<any[]>([
    {
      id: "widget-1",
      type: "chart",
      chartType: "bar",
      title: "Response Time Analysis",
      dataSource: "chat-logs",
      position: { x: 20, y: 20 },
      size: { width: 400, height: 300 },
      style: {
        borderRadius: 8,
        backgroundColor: "#ffffff",
        borderColor: "#e2e8f0",
        padding: 16,
        shadow: "md",
      },
      isLocked: false,
      isVisible: true,
    },
    {
      id: "widget-2",
      type: "kpi",
      title: "Average Response Time",
      value: "1.2s",
      icon: "timer",
      dataSource: "service-stats",
      position: { x: 440, y: 20 },
      size: { width: 200, height: 150 },
      style: {
        borderRadius: 8,
        backgroundColor: "#f8fafc",
        borderColor: "#e2e8f0",
        padding: 16,
        shadow: "sm",
      },
      isLocked: false,
      isVisible: true,
    },
    {
      id: "widget-3",
      type: "table",
      title: "Recent Conversations",
      dataSource: "chat-history",
      position: { x: 20, y: 340 },
      size: { width: 620, height: 250 },
      style: {
        borderRadius: 8,
        backgroundColor: "#ffffff",
        borderColor: "#e2e8f0",
        padding: 16,
        shadow: "md",
      },
      isLocked: false,
      isVisible: true,
    },
  ]);
  const [layoutType, setLayoutType] = useState("freeform");
  const [previewMode, setPreviewMode] = useState(false);
  const [deviceView, setDeviceView] = useState("desktop");
  const [widgetLibrary, setWidgetLibrary] = useState([
    { type: "chart", name: "Chart", icon: <LineChart className="h-4 w-4" /> },
    { type: "kpi", name: "KPI Card", icon: <Gauge className="h-4 w-4" /> },
    { type: "table", name: "Table", icon: <Table className="h-4 w-4" /> },
    { type: "list", name: "List", icon: <List className="h-4 w-4" /> },
    { type: "timeline", name: "Timeline", icon: <Timer className="h-4 w-4" /> },
  ]);

  const handleAddWidget = (type: string) => {
    const newWidget = {
      id: `widget-${widgets.length + 1}`,
      type,
      title: `New ${type.charAt(0).toUpperCase() + type.slice(1)} Widget`,
      dataSource: "",
      position: { x: 50, y: 50 },
      size: { width: 300, height: 200 },
      style: {
        borderRadius: 8,
        backgroundColor: "#ffffff",
        borderColor: "#e2e8f0",
        padding: 16,
        shadow: "md",
      },
      isLocked: false,
      isVisible: true,
    };

    setWidgets([...widgets, newWidget]);
    setSelectedWidget(newWidget.id);

    toast({
      title: "Widget added",
      description: `New ${type} widget has been added to your dashboard.`,
      duration: 3000,
    });
  };

  const handleDuplicateWidget = (id: string) => {
    const widgetToDuplicate = widgets.find((w) => w.id === id);
    if (!widgetToDuplicate) return;

    const newWidget = {
      ...widgetToDuplicate,
      id: `widget-${widgets.length + 1}`,
      title: `${widgetToDuplicate.title} (Copy)`,
      position: {
        x: widgetToDuplicate.position.x + 20,
        y: widgetToDuplicate.position.y + 20,
      },
    };

    setWidgets([...widgets, newWidget]);
    setSelectedWidget(newWidget.id);

    toast({
      title: "Widget duplicated",
      description: `A copy of the widget has been created.`,
      duration: 3000,
    });
  };

  const handleDeleteWidget = (id: string) => {
    const updatedWidgets = widgets.filter((w) => w.id !== id);
    setWidgets(updatedWidgets);

    if (selectedWidget === id) {
      setSelectedWidget(
        updatedWidgets.length > 0 ? updatedWidgets[0].id : null,
      );
    }

    toast({
      title: "Widget deleted",
      description: "The widget has been removed from your dashboard.",
      duration: 3000,
    });
  };

  const handleWidgetVisibility = (id: string, isVisible: boolean) => {
    const updatedWidgets = widgets.map((widget) =>
      widget.id === id ? { ...widget, isVisible } : widget,
    );
    setWidgets(updatedWidgets);
  };

  const handleWidgetLock = (id: string, isLocked: boolean) => {
    const updatedWidgets = widgets.map((widget) =>
      widget.id === id ? { ...widget, isLocked } : widget,
    );
    setWidgets(updatedWidgets);
  };

  const handleSaveLayout = () => {
    // In a real implementation, this would save the layout configuration
    toast({
      title: "Layout saved",
      description: "Your dashboard layout has been saved successfully.",
      duration: 3000,
    });

    if (onSave) {
      onSave({
        widgets,
        layoutType,
        lastSaved: new Date(),
      });
    }
  };

  const handleExportLayout = () => {
    // In a real implementation, this would export the layout as JSON
    const dataStr = JSON.stringify({ widgets, layoutType }, null, 2);
    const dataUri = `data:application/json;charset=utf-8,${encodeURIComponent(dataStr)}`;

    const exportFileDefaultName = `widget-dashboard-${new Date().toISOString().slice(0, 10)}.json`;

    const linkElement = document.createElement("a");
    linkElement.setAttribute("href", dataUri);
    linkElement.setAttribute("download", exportFileDefaultName);
    linkElement.click();

    toast({
      title: "Layout exported",
      description: "Your dashboard configuration has been exported as JSON.",
      duration: 3000,
    });
  };

  const handleImportLayout = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const content = e.target?.result as string;
        const importedData = JSON.parse(content);

        if (importedData.widgets && Array.isArray(importedData.widgets)) {
          setWidgets(importedData.widgets);
          if (importedData.layoutType) {
            setLayoutType(importedData.layoutType);
          }

          toast({
            title: "Layout imported",
            description: `Successfully imported ${importedData.widgets.length} widgets.`,
            duration: 3000,
          });
        } else {
          throw new Error("Invalid format");
        }
      } catch (error) {
        toast({
          title: "Import failed",
          description: "The file format is invalid or corrupted.",
          variant: "destructive",
          duration: 3000,
        });
      }
    };
    reader.readAsText(file);
  };

  const getWidgetIcon = (type: string) => {
    switch (type) {
      case "chart":
        return <LineChart className="h-4 w-4" />;
      case "bar-chart":
        return <BarChart className="h-4 w-4" />;
      case "pie-chart":
        return <PieChart className="h-4 w-4" />;
      case "kpi":
        return <Gauge className="h-4 w-4" />;
      case "table":
        return <Table className="h-4 w-4" />;
      case "list":
        return <List className="h-4 w-4" />;
      case "timeline":
        return <Timer className="h-4 w-4" />;
      default:
        return <LayoutGrid className="h-4 w-4" />;
    }
  };

  const selectedWidgetData = selectedWidget
    ? widgets.find((w) => w.id === selectedWidget)
    : null;

  return (
    <div className="w-full h-full bg-background">
      <div className="flex h-full">
        {/* Left Panel - Widget Library */}
        <div className="w-64 border-r p-4 flex flex-col h-full">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-medium">Widget Library</h3>
            <Button variant="ghost" size="icon" className="h-8 w-8">
              <Plus className="h-4 w-4" />
            </Button>
          </div>

          <ScrollArea className="flex-1">
            <div className="space-y-2">
              {widgetLibrary.map((widget, index) => (
                <div
                  key={index}
                  className="flex items-center p-2 rounded-md hover:bg-muted cursor-pointer"
                  onClick={() => handleAddWidget(widget.type)}
                >
                  <div className="mr-2">{widget.icon}</div>
                  <span>{widget.name}</span>
                </div>
              ))}
            </div>

            <Separator className="my-4" />

            <div className="space-y-2">
              <h4 className="text-sm font-medium mb-2">Saved Templates</h4>
              <div className="flex items-center p-2 rounded-md hover:bg-muted cursor-pointer">
                <LayoutTemplate className="h-4 w-4 mr-2" />
                <span>Analytics Dashboard</span>
              </div>
              <div className="flex items-center p-2 rounded-md hover:bg-muted cursor-pointer">
                <LayoutTemplate className="h-4 w-4 mr-2" />
                <span>Support Overview</span>
              </div>
            </div>
          </ScrollArea>

          <div className="mt-4 space-y-2">
            <Button
              variant="outline"
              className="w-full justify-start"
              onClick={handleSaveLayout}
            >
              <Save className="mr-2 h-4 w-4" />
              Save Layout
            </Button>
            <div className="flex gap-2">
              <Button
                variant="outline"
                className="flex-1 justify-center"
                onClick={handleExportLayout}
              >
                <Download className="mr-2 h-4 w-4" />
                Export
              </Button>
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <div className="relative">
                      <input
                        type="file"
                        accept=".json"
                        onChange={handleImportLayout}
                        className="absolute inset-0 opacity-0 cursor-pointer"
                      />
                      <Button
                        variant="outline"
                        className="flex-1 justify-center"
                      >
                        <Upload className="mr-2 h-4 w-4" />
                        Import
                      </Button>
                    </div>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>Import a widget layout JSON file</p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            </div>
          </div>
        </div>

        {/* Center Panel - Canvas */}
        <div className="flex-1 flex flex-col h-full">
          <div className="border-b p-2 flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <Select value={layoutType} onValueChange={setLayoutType}>
                <SelectTrigger className="w-[180px] h-8">
                  <SelectValue placeholder="Select layout" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="freeform">Freeform Layout</SelectItem>
                  <SelectItem value="grid">Grid Layout</SelectItem>
                  <SelectItem value="split">Split Layout</SelectItem>
                  <SelectItem value="stacked">Stacked Layout</SelectItem>
                  <SelectItem value="masonry">Masonry Layout</SelectItem>
                </SelectContent>
              </Select>

              <div className="flex border rounded-md">
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Button
                        variant={
                          deviceView === "desktop" ? "secondary" : "ghost"
                        }
                        size="icon"
                        className="h-8 w-8 rounded-none rounded-l-md"
                        onClick={() => setDeviceView("desktop")}
                      >
                        <Monitor className="h-4 w-4" />
                      </Button>
                    </TooltipTrigger>
                    <TooltipContent>
                      <p>Desktop view</p>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>

                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Button
                        variant={
                          deviceView === "tablet" ? "secondary" : "ghost"
                        }
                        size="icon"
                        className="h-8 w-8 rounded-none"
                        onClick={() => setDeviceView("tablet")}
                      >
                        <Tablet className="h-4 w-4" />
                      </Button>
                    </TooltipTrigger>
                    <TooltipContent>
                      <p>Tablet view</p>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>

                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Button
                        variant={
                          deviceView === "mobile" ? "secondary" : "ghost"
                        }
                        size="icon"
                        className="h-8 w-8 rounded-none rounded-r-md"
                        onClick={() => setDeviceView("mobile")}
                      >
                        <Smartphone className="h-4 w-4" />
                      </Button>
                    </TooltipTrigger>
                    <TooltipContent>
                      <p>Mobile view</p>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              </div>
            </div>

            <div className="flex items-center space-x-2">
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-8 w-8"
                      onClick={() => setPreviewMode(!previewMode)}
                    >
                      {previewMode ? (
                        <EyeOff className="h-4 w-4" />
                      ) : (
                        <Eye className="h-4 w-4" />
                      )}
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>
                      {previewMode ? "Exit preview mode" : "Enter preview mode"}
                    </p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>

              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button variant="ghost" size="icon" className="h-8 w-8">
                      <Undo2 className="h-4 w-4" />
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>Undo</p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>

              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button variant="ghost" size="icon" className="h-8 w-8">
                      <Redo2 className="h-4 w-4" />
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>Redo</p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>

              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button variant="ghost" size="icon" className="h-8 w-8">
                      <History className="h-4 w-4" />
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>Version history</p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            </div>
          </div>

          <div className="flex-1 p-4 bg-muted/20 overflow-auto">
            <div
              className={`relative bg-background rounded-lg shadow-sm border ${deviceView === "mobile" ? "w-[320px]" : deviceView === "tablet" ? "w-[768px]" : "w-full"} h-full mx-auto`}
            >
              {/* Canvas with widgets */}
              {widgets
                .filter((w) => w.isVisible)
                .map((widget) => (
                  <div
                    key={widget.id}
                    className={`absolute rounded-lg border shadow-sm overflow-hidden ${selectedWidget === widget.id && !previewMode ? "ring-2 ring-primary" : ""}`}
                    style={{
                      left: `${widget.position.x}px`,
                      top: `${widget.position.y}px`,
                      width: `${widget.size.width}px`,
                      height: `${widget.size.height}px`,
                      backgroundColor: widget.style.backgroundColor,
                      borderColor: widget.style.borderColor,
                      borderRadius: `${widget.style.borderRadius}px`,
                      padding: `${widget.style.padding}px`,
                      boxShadow:
                        widget.style.shadow === "sm"
                          ? "0 1px 2px 0 rgba(0, 0, 0, 0.05)"
                          : widget.style.shadow === "md"
                            ? "0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)"
                            : widget.style.shadow === "lg"
                              ? "0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)"
                              : "none",
                    }}
                    onClick={() =>
                      !previewMode &&
                      !widget.isLocked &&
                      setSelectedWidget(widget.id)
                    }
                  >
                    {!previewMode && (
                      <div className="absolute top-2 right-2 flex gap-1 z-10">
                        <TooltipProvider>
                          <Tooltip>
                            <TooltipTrigger asChild>
                              <Button
                                variant="ghost"
                                size="icon"
                                className="h-6 w-6 bg-background/80 backdrop-blur-sm"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  handleWidgetVisibility(
                                    widget.id,
                                    !widget.isVisible,
                                  );
                                }}
                              >
                                {widget.isVisible ? (
                                  <Eye className="h-3 w-3" />
                                ) : (
                                  <EyeOff className="h-3 w-3" />
                                )}
                              </Button>
                            </TooltipTrigger>
                            <TooltipContent>
                              <p>
                                {widget.isVisible
                                  ? "Hide widget"
                                  : "Show widget"}
                              </p>
                            </TooltipContent>
                          </Tooltip>
                        </TooltipProvider>

                        <TooltipProvider>
                          <Tooltip>
                            <TooltipTrigger asChild>
                              <Button
                                variant="ghost"
                                size="icon"
                                className="h-6 w-6 bg-background/80 backdrop-blur-sm"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  handleWidgetLock(widget.id, !widget.isLocked);
                                }}
                              >
                                {widget.isLocked ? (
                                  <Lock className="h-3 w-3" />
                                ) : (
                                  <Unlock className="h-3 w-3" />
                                )}
                              </Button>
                            </TooltipTrigger>
                            <TooltipContent>
                              <p>
                                {widget.isLocked
                                  ? "Unlock widget"
                                  : "Lock widget"}
                              </p>
                            </TooltipContent>
                          </Tooltip>
                        </TooltipProvider>
                      </div>
                    )}

                    <div className="flex flex-col h-full">
                      <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center">
                          {getWidgetIcon(widget.type)}
                          <h3 className="font-medium text-sm ml-2">
                            {widget.title}
                          </h3>
                        </div>
                      </div>

                      <div className="flex-1 flex items-center justify-center bg-muted/10 rounded">
                        {widget.type === "kpi" && (
                          <div className="text-center">
                            <div className="text-3xl font-bold">
                              {widget.value || "--"}
                            </div>
                            <div className="text-xs text-muted-foreground mt-1">
                              Average Response Time
                            </div>
                          </div>
                        )}

                        {widget.type === "chart" && (
                          <div className="w-full h-full flex items-center justify-center">
                            <div className="text-muted-foreground text-sm">
                              [Chart Visualization]
                            </div>
                          </div>
                        )}

                        {widget.type === "table" && (
                          <div className="w-full h-full flex items-center justify-center">
                            <div className="text-muted-foreground text-sm">
                              [Table Data]
                            </div>
                          </div>
                        )}

                        {widget.type === "list" && (
                          <div className="w-full h-full flex items-center justify-center">
                            <div className="text-muted-foreground text-sm">
                              [List Items]
                            </div>
                          </div>
                        )}

                        {widget.type === "timeline" && (
                          <div className="w-full h-full flex items-center justify-center">
                            <div className="text-muted-foreground text-sm">
                              [Timeline Events]
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
            </div>
          </div>
        </div>

        {/* Right Panel - Properties */}
        {selectedWidget && !previewMode && (
          <div className="w-80 border-l h-full flex flex-col">
            <div className="p-4 border-b flex items-center justify-between">
              <h3 className="font-medium">Widget Properties</h3>
              <div className="flex gap-1">
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8"
                        onClick={() => handleDuplicateWidget(selectedWidget)}
                      >
                        <Copy className="h-4 w-4" />
                      </Button>
                    </TooltipTrigger>
                    <TooltipContent>
                      <p>Duplicate widget</p>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>

                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8 text-destructive"
                        onClick={() => handleDeleteWidget(selectedWidget)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </TooltipTrigger>
                    <TooltipContent>
                      <p>Delete widget</p>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              </div>
            </div>

            <Tabs
              value={activeTab}
              onValueChange={setActiveTab}
              className="flex-1 flex flex-col"
            >
              <TabsList className="grid grid-cols-3 p-2">
                <TabsTrigger value="layout" className="text-xs">
                  <LayoutGrid className="h-3 w-3 mr-1" />
                  Layout
                </TabsTrigger>
                <TabsTrigger value="style" className="text-xs">
                  <Palette className="h-3 w-3 mr-1" />
                  Style
                </TabsTrigger>
                <TabsTrigger value="data" className="text-xs">
                  <Database className="h-3 w-3 mr-1" />
                  Data
                </TabsTrigger>
              </TabsList>

              <ScrollArea className="flex-1">
                <TabsContent value="layout" className="p-4 space-y-4">
                  {selectedWidgetData && (
                    <>
                      <div className="space-y-2">
                        <Label htmlFor="widget-title">Widget Title</Label>
                        <Input
                          id="widget-title"
                          value={selectedWidgetData.title}
                          onChange={(e) => {
                            const updatedWidgets = widgets.map((widget) =>
                              widget.id === selectedWidget
                                ? { ...widget, title: e.target.value }
                                : widget,
                            );
                            setWidgets(updatedWidgets);
                          }}
                        />
                      </div>

                      <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label htmlFor="position-x">Position X</Label>
                          <Input
                            id="position-x"
                            type="number"
                            value={selectedWidgetData.position.x}
                            onChange={(e) => {
                              const updatedWidgets = widgets.map((widget) =>
                                widget.id === selectedWidget
                                  ? {
                                      ...widget,
                                      position: {
                                        ...widget.position,
                                        x: parseInt(e.target.value) || 0,
                                      },
                                    }
                                  : widget,
                              );
                              setWidgets(updatedWidgets);
                            }}
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="position-y">Position Y</Label>
                          <Input
                            id="position-y"
                            type="number"
                            value={selectedWidgetData.position.y}
                            onChange={(e) => {
                              const updatedWidgets = widgets.map((widget) =>
                                widget.id === selectedWidget
                                  ? {
                                      ...widget,
                                      position: {
                                        ...widget.position,
                                        y: parseInt(e.target.value) || 0,
                                      },
                                    }
                                  : widget,
                              );
                              setWidgets(updatedWidgets);
                            }}
                          />
                        </div>
                      </div>

                      <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label htmlFor="width">Width</Label>
                          <Input
                            id="width"
                            type="number"
                            value={selectedWidgetData.size.width}
                            onChange={(e) => {
                              const updatedWidgets = widgets.map((widget) =>
                                widget.id === selectedWidget
                                  ? {
                                      ...widget,
                                      size: {
                                        ...widget.size,
                                        width: parseInt(e.target.value) || 100,
                                      },
                                    }
                                  : widget,
                              );
                              setWidgets(updatedWidgets);
                            }}
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="height">Height</Label>
                          <Input
                            id="height"
                            type="number"
                            value={selectedWidgetData.size.height}
                            onChange={(e) => {
                              const updatedWidgets = widgets.map((widget) =>
                                widget.id === selectedWidget
                                  ? {
                                      ...widget,
                                      size: {
                                        ...widget.size,
                                        height: parseInt(e.target.value) || 100,
                                      },
                                    }
                                  : widget,
                              );
                              setWidgets(updatedWidgets);
                            }}
                          />
                        </div>
                      </div>

                      <div className="space-y-2">
                        <div className="flex items-center justify-between">
                          <Label htmlFor="widget-locked">Lock Position</Label>
                          <Switch
                            id="widget-locked"
                            checked={selectedWidgetData.isLocked}
                            onCheckedChange={(checked) =>
                              handleWidgetLock(selectedWidget, checked)
                            }
                          />
                        </div>
                        <p className="text-xs text-muted-foreground">
                          Prevent widget from being moved or resized
                        </p>
                      </div>

                      <div className="space-y-2">
                        <div className="flex items-center justify-between">
                          <Label htmlFor="widget-visible">Visibility</Label>
                          <Switch
                            id="widget-visible"
                            checked={selectedWidgetData.isVisible}
                            onCheckedChange={(checked) =>
                              handleWidgetVisibility(selectedWidget, checked)
                            }
                          />
                        </div>
                        <p className="text-xs text-muted-foreground">
                          Show or hide this widget
                        </p>
                      </div>
                    </>
                  )}
                </TabsContent>

                <TabsContent value="style" className="p-4 space-y-4">
                  {selectedWidgetData && (
                    <>
                      <div className="space-y-2">
                        <Label htmlFor="background-color">
                          Background Color
                        </Label>
                        <div className="flex gap-2">
                          <Input
                            id="background-color"
                            type="color"
                            value={selectedWidgetData.style.backgroundColor}
                            onChange={(e) => {
                              const updatedWidgets = widgets.map((widget) =>
                                widget.id === selectedWidget
                                  ? {
                                      ...widget,
                                      style: {
                                        ...widget.style,
                                        backgroundColor: e.target.value,
                                      },
                                    }
                                  : widget,
                              );
                              setWidgets(updatedWidgets);
                            }}
                            className="w-12 h-8 p-1"
                          />
                          <Input
                            value={selectedWidgetData.style.backgroundColor}
                            onChange={(e) => {
                              const updatedWidgets = widgets.map((widget) =>
                                widget.id === selectedWidget
                                  ? {
                                      ...widget,
                                      style: {
                                        ...widget.style,
                                        backgroundColor: e.target.value,
                                      },
                                    }
                                  : widget,
                              );
                              setWidgets(updatedWidgets);
                            }}
                            className="flex-1"
                          />
                        </div>
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="border-color">Border Color</Label>
                        <div className="flex gap-2">
                          <Input
                            id="border-color"
                            type="color"
                            value={selectedWidgetData.style.borderColor}
                            onChange={(e) => {
                              const updatedWidgets = widgets.map((widget) =>
                                widget.id === selectedWidget
                                  ? {
                                      ...widget,
                                      style: {
                                        ...widget.style,
                                        borderColor: e.target.value,
                                      },
                                    }
                                  : widget,
                              );
                              setWidgets(updatedWidgets);
                            }}
                            className="w-12 h-8 p-1"
                          />
                          <Input
                            value={selectedWidgetData.style.borderColor}
                            onChange={(e) => {
                              const updatedWidgets = widgets.map((widget) =>
                                widget.id === selectedWidget
                                  ? {
                                      ...widget,
                                      style: {
                                        ...widget.style,
                                        borderColor: e.target.value,
                                      },
                                    }
                                  : widget,
                              );
                              setWidgets(updatedWidgets);
                            }}
                            className="flex-1"
                          />
                        </div>
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="border-radius">Border Radius</Label>
                        <div className="space-y-2">
                          <Slider
                            id="border-radius"
                            min={0}
                            max={20}
                            step={1}
                            value={[selectedWidgetData.style.borderRadius]}
                            onValueChange={(value) => {
                              const updatedWidgets = widgets.map((widget) =>
                                widget.id === selectedWidget
                                  ? {
                                      ...widget,
                                      style: {
                                        ...widget.style,
                                        borderRadius: value[0],
                                      },
                                    }
                                  : widget,
                              );
                              setWidgets(updatedWidgets);
                            }}
                          />
                          <div className="flex justify-between text-xs text-muted-foreground">
                            <span>0px</span>
                            <span>10px</span>
                            <span>20px</span>
                          </div>
                        </div>
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="padding">Padding</Label>
                        <div className="space-y-2">
                          <Slider
                            id="padding"
                            min={0}
                            max={32}
                            step={4}
                            value={[selectedWidgetData.style.padding]}
                            onValueChange={(value) => {
                              const updatedWidgets = widgets.map((widget) =>
                                widget.id === selectedWidget
                                  ? {
                                      ...widget,
                                      style: {
                                        ...widget.style,
                                        padding: value[0],
                                      },
                                    }
                                  : widget,
                              );
                              setWidgets(updatedWidgets);
                            }}
                          />
                          <div className="flex justify-between text-xs text-muted-foreground">
                            <span>0px</span>
                            <span>16px</span>
                            <span>32px</span>
                          </div>
                        </div>
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="shadow">Shadow</Label>
                        <Select
                          value={selectedWidgetData.style.shadow}
                          onValueChange={(value) => {
                            const updatedWidgets = widgets.map((widget) =>
                              widget.id === selectedWidget
                                ? {
                                    ...widget,
                                    style: {
                                      ...widget.style,
                                      shadow: value,
                                    },
                                  }
                                : widget,
                            );
                            setWidgets(updatedWidgets);
                          }}
                        >
                          <SelectTrigger id="shadow">
                            <SelectValue placeholder="Select shadow style" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="none">None</SelectItem>
                            <SelectItem value="sm">Small</SelectItem>
                            <SelectItem value="md">Medium</SelectItem>
                            <SelectItem value="lg">Large</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>

                      <div className="pt-4">
                        <Button variant="outline" className="w-full">
                          <Sparkles className="mr-2 h-4 w-4" />
                          AI Style Suggestions
                        </Button>
                      </div>
                    </>
                  )}
                </TabsContent>

                <TabsContent value="data" className="p-4 space-y-4">
                  {selectedWidgetData && (
                    <>
                      <div className="space-y-2">
                        <Label htmlFor="widget-type">Widget Type</Label>
                        <Select
                          value={selectedWidgetData.type}
                          onValueChange={(value) => {
                            const updatedWidgets = widgets.map((widget) =>
                              widget.id === selectedWidget
                                ? { ...widget, type: value }
                                : widget,
                            );
                            setWidgets(updatedWidgets);
                          }}
                        >
                          <SelectTrigger id="widget-type">
                            <SelectValue placeholder="Select widget type" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="chart">Chart</SelectItem>
                            <SelectItem value="kpi">KPI Card</SelectItem>
                            <SelectItem value="table">Table</SelectItem>
                            <SelectItem value="list">List</SelectItem>
                            <SelectItem value="timeline">Timeline</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>

                      {selectedWidgetData.type === "chart" && (
                        <div className="space-y-2">
                          <Label htmlFor="chart-type">Chart Type</Label>
                          <Select
                            value={selectedWidgetData.chartType || "bar"}
                            onValueChange={(value) => {
                              const updatedWidgets = widgets.map((widget) =>
                                widget.id === selectedWidget
                                  ? { ...widget, chartType: value }
                                  : widget,
                              );
                              setWidgets(updatedWidgets);
                            }}
                          >
                            <SelectTrigger id="chart-type">
                              <SelectValue placeholder="Select chart type" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="bar">Bar Chart</SelectItem>
                              <SelectItem value="line">Line Chart</SelectItem>
                              <SelectItem value="pie">Pie Chart</SelectItem>
                              <SelectItem value="area">Area Chart</SelectItem>
                              <SelectItem value="radar">Radar Chart</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                      )}

                      <div className="space-y-2">
                        <Label htmlFor="data-source">Data Source</Label>
                        <Select
                          value={selectedWidgetData.dataSource}
                          onValueChange={(value) => {
                            const updatedWidgets = widgets.map((widget) =>
                              widget.id === selectedWidget
                                ? { ...widget, dataSource: value }
                                : widget,
                            );
                            setWidgets(updatedWidgets);
                          }}
                        >
                          <SelectTrigger id="data-source">
                            <SelectValue placeholder="Select data source" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="chat-logs">Chat Logs</SelectItem>
                            <SelectItem value="service-stats">
                              Service Statistics
                            </SelectItem>
                            <SelectItem value="chat-history">
                              Chat History
                            </SelectItem>
                            <SelectItem value="user-feedback">
                              User Feedback
                            </SelectItem>
                            <SelectItem value="custom-api">
                              Custom API
                            </SelectItem>
                          </SelectContent>
                        </Select>
                      </div>

                      {selectedWidgetData.dataSource === "custom-api" && (
                        <div className="space-y-2">
                          <Label htmlFor="api-endpoint">API Endpoint</Label>
                          <Input
                            id="api-endpoint"
                            placeholder="https://api.example.com/data"
                          />
                        </div>
                      )}

                      <div className="space-y-2">
                        <Label htmlFor="refresh-interval">
                          Refresh Interval
                        </Label>
                        <Select defaultValue="manual">
                          <SelectTrigger id="refresh-interval">
                            <SelectValue placeholder="Select refresh interval" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="live">
                              Live (Real-time)
                            </SelectItem>
                            <SelectItem value="30s">
                              Every 30 seconds
                            </SelectItem>
                            <SelectItem value="1m">Every minute</SelectItem>
                            <SelectItem value="5m">Every 5 minutes</SelectItem>
                            <SelectItem value="manual">
                              Manual refresh only
                            </SelectItem>
                          </SelectContent>
                        </Select>
                      </div>

                      <div className="pt-4">
                        <Button variant="outline" className="w-full">
                          <Zap className="mr-2 h-4 w-4" />
                          AI Data Recommendations
                        </Button>
                      </div>
                    </>
                  )}
                </TabsContent>
              </ScrollArea>

              <div className="p-4 border-t">
                <Button className="w-full">
                  <Check className="mr-2 h-4 w-4" />
                  Apply Changes
                </Button>
              </div>
            </Tabs>
          </div>
        )}
      </div>
    </div>
  );
};

export default WidgetBuilder;
