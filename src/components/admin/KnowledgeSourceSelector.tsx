import React, { useState, useEffect } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  CardFooter,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { useToast } from "@/components/ui/use-toast";
import {
  Search,
  Plus,
  FileText,
  Database,
  HelpCircle,
  Code,
  MessageSquare,
  Presentation,
  Trash2,
  Edit,
  RefreshCw,
  Info,
  Check,
  X,
  Filter,
  SlidersHorizontal,
  Clock,
  BookOpen,
  Upload,
  Download,
  AlertCircle,
  ExternalLink,
} from "lucide-react";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import knowledgeSourceService, {
  KnowledgeSource,
} from "@/services/knowledgeSourceService";

interface KnowledgeSourceSelectorProps {
  onSourcesChange?: (sources: KnowledgeSource[]) => void;
}

const KnowledgeSourceSelector = ({
  onSourcesChange,
}: KnowledgeSourceSelectorProps) => {
  const { toast } = useToast();
  const [sources, setSources] = useState<KnowledgeSource[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [filterType, setFilterType] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [selectedSource, setSelectedSource] = useState<string | null>(null);
  const [sourceStats, setSourceStats] = useState<{
    totalDocs: number;
    lastIndexed: Date;
    avgConfidence: number;
  } | null>(null);

  // Load sources on component mount
  useEffect(() => {
    loadSources();
  }, []);

  const loadSources = () => {
    setIsLoading(true);
    // In a real implementation, this would be an API call
    setTimeout(() => {
      const loadedSources = knowledgeSourceService.getSources();
      setSources(loadedSources);
      setIsLoading(false);
    }, 500);
  };

  const handleToggleSource = (id: string, isActive: boolean) => {
    const updatedSources = sources.map((source) =>
      source.id === id ? { ...source, isActive } : source,
    );
    setSources(updatedSources);
    knowledgeSourceService.updateSourceStatus(id, isActive);

    if (onSourcesChange) {
      onSourcesChange(updatedSources.filter((source) => source.isActive));
    }

    toast({
      title: isActive ? "Source activated" : "Source deactivated",
      description: `Knowledge source has been ${isActive ? "activated" : "deactivated"}.`,
      duration: 3000,
    });
  };

  const handleViewSourceDetails = (id: string) => {
    setSelectedSource(id);
    // Fetch source statistics
    const stats = knowledgeSourceService.getSourceStatistics(id);
    setSourceStats(stats);
  };

  const handleRefreshSources = () => {
    setIsLoading(true);
    setSearchQuery("");
    setFilterType(null);

    // In a real implementation, this would refresh from the backend
    setTimeout(() => {
      loadSources();
      toast({
        title: "Sources refreshed",
        description: "Knowledge sources have been refreshed.",
        duration: 3000,
      });
    }, 1000);
  };

  const filteredSources = sources.filter((source) => {
    // Apply search filter
    const matchesSearch = searchQuery
      ? source.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        source.description.toLowerCase().includes(searchQuery.toLowerCase())
      : true;

    // Apply type filter
    const matchesType = filterType ? source.type === filterType : true;

    return matchesSearch && matchesType;
  });

  const getSourceTypeIcon = (type: string) => {
    const iconMap: Record<string, React.ReactNode> = {
      internal: <FileText className="h-4 w-4" />,
      database: <Database className="h-4 w-4" />,
      knowledge_base: <BookOpen className="h-4 w-4" />,
      external: <ExternalLink className="h-4 w-4" />,
    };
    return iconMap[type] || <FileText className="h-4 w-4" />;
  };

  const getSourceIcon = (iconName?: string) => {
    if (!iconName) return <FileText className="h-4 w-4" />;

    const iconMap: Record<string, React.ReactNode> = {
      FileText: <FileText className="h-4 w-4" />,
      Database: <Database className="h-4 w-4" />,
      HelpCircle: <HelpCircle className="h-4 w-4" />,
      Code: <Code className="h-4 w-4" />,
      MessageSquare: <MessageSquare className="h-4 w-4" />,
      Presentation: <Presentation className="h-4 w-4" />,
      BookOpen: <BookOpen className="h-4 w-4" />,
    };

    return iconMap[iconName] || <FileText className="h-4 w-4" />;
  };

  const formatDate = (date: Date) => {
    return new Date(date).toLocaleDateString(undefined, {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  const selectedSourceData = selectedSource
    ? sources.find((s) => s.id === selectedSource)
    : null;

  return (
    <TooltipProvider>
      <Card className="h-full">
        <CardHeader>
          <div className="flex justify-between items-center">
            <CardTitle>Knowledge Sources</CardTitle>
            <div className="flex gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={handleRefreshSources}
                disabled={isLoading}
              >
                <RefreshCw
                  className={`h-4 w-4 mr-2 ${isLoading ? "animate-spin" : ""}`}
                />
                Refresh
              </Button>
              <Button variant="outline" size="sm">
                <Plus className="h-4 w-4 mr-2" />
                Add Source
              </Button>
            </div>
          </div>
          <CardDescription>
            Select which knowledge sources to include in AI responses
          </CardDescription>
        </CardHeader>
        <CardContent className="p-0">
          <div className="p-4 border-b flex flex-col sm:flex-row gap-3 justify-between">
            <div className="relative flex-1">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                type="text"
                placeholder="Search sources..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-8"
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery("")}
                  className="absolute right-2.5 top-2.5 text-muted-foreground hover:text-foreground"
                >
                  <X className="h-4 w-4" />
                </button>
              )}
            </div>
            <div className="flex gap-2">
              <Button
                variant={filterType === null ? "default" : "outline"}
                size="sm"
                onClick={() => setFilterType(null)}
                className="text-xs h-9"
              >
                All
              </Button>
              <Button
                variant={filterType === "internal" ? "default" : "outline"}
                size="sm"
                onClick={() => setFilterType("internal")}
                className="text-xs h-9"
              >
                <FileText className="h-3.5 w-3.5 mr-1" />
                Internal
              </Button>
              <Button
                variant={filterType === "database" ? "default" : "outline"}
                size="sm"
                onClick={() => setFilterType("database")}
                className="text-xs h-9"
              >
                <Database className="h-3.5 w-3.5 mr-1" />
                Database
              </Button>
              <Button
                variant={
                  filterType === "knowledge_base" ? "default" : "outline"
                }
                size="sm"
                onClick={() => setFilterType("knowledge_base")}
                className="text-xs h-9"
              >
                <BookOpen className="h-3.5 w-3.5 mr-1" />
                Knowledge Base
              </Button>
              <Button
                variant={filterType === "external" ? "default" : "outline"}
                size="sm"
                onClick={() => setFilterType("external")}
                className="text-xs h-9"
              >
                <ExternalLink className="h-3.5 w-3.5 mr-1" />
                External
              </Button>
            </div>
          </div>

          {isLoading ? (
            <div className="flex items-center justify-center h-[300px]">
              <div className="flex flex-col items-center gap-2">
                <RefreshCw className="h-8 w-8 text-muted-foreground animate-spin" />
                <p className="text-muted-foreground">Loading sources...</p>
              </div>
            </div>
          ) : filteredSources.length > 0 ? (
            <div className="divide-y max-h-[400px] overflow-y-auto">
              {filteredSources.map((source) => (
                <div
                  key={source.id}
                  className={`p-4 hover:bg-muted/50 ${selectedSource === source.id ? "bg-primary/5" : ""}`}
                  onClick={() => handleViewSourceDetails(source.id)}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="text-muted-foreground">
                        {getSourceIcon(source.icon)}
                      </div>
                      <div>
                        <h3 className="font-medium">{source.name}</h3>
                        <div className="flex items-center gap-2 mt-1">
                          <Badge
                            variant="outline"
                            className="text-xs flex items-center gap-1"
                          >
                            {getSourceTypeIcon(source.type)}
                            {source.type.replace("_", " ")}
                          </Badge>
                          <span className="text-xs text-muted-foreground">
                            {source.documentCount} documents
                          </span>
                          <span className="text-xs text-muted-foreground">
                            Updated: {formatDate(source.lastUpdated)}
                          </span>
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <div className="flex items-center">
                            <Switch
                              checked={source.isActive}
                              onCheckedChange={(checked) =>
                                handleToggleSource(source.id, checked)
                              }
                              onClick={(e) => e.stopPropagation()}
                            />
                          </div>
                        </TooltipTrigger>
                        <TooltipContent>
                          <p>
                            {source.isActive
                              ? "Disable this knowledge source"
                              : "Enable this knowledge source"}
                          </p>
                        </TooltipContent>
                      </Tooltip>
                    </div>
                  </div>
                  <p className="text-sm text-muted-foreground mt-2">
                    {source.description}
                  </p>
                </div>
              ))}
            </div>
          ) : (
            <div className="flex items-center justify-center h-[300px]">
              <div className="flex flex-col items-center gap-2">
                <AlertCircle className="h-8 w-8 text-muted-foreground" />
                <p className="text-muted-foreground">No sources found</p>
                <p className="text-xs text-muted-foreground">
                  Try a different search term or filter
                </p>
              </div>
            </div>
          )}
        </CardContent>
        <CardFooter className="flex justify-between border-t pt-6">
          <div className="text-sm text-muted-foreground">
            {filteredSources.length} sources found
          </div>
          <div className="flex gap-2">
            <Button variant="outline" size="sm">
              <Download className="h-4 w-4 mr-2" />
              Export Sources
            </Button>
            <Button variant="outline" size="sm">
              <Upload className="h-4 w-4 mr-2" />
              Import Sources
            </Button>
          </div>
        </CardFooter>
      </Card>

      {selectedSourceData && sourceStats && (
        <div className="mt-4">
          <Card>
            <CardHeader>
              <div className="flex justify-between items-center">
                <CardTitle>Source Details: {selectedSourceData.name}</CardTitle>
                <div className="flex gap-2">
                  <Button variant="outline" size="sm">
                    <Edit className="h-4 w-4 mr-2" />
                    Edit
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    className="text-destructive"
                  >
                    <Trash2 className="h-4 w-4 mr-2" />
                    Delete
                  </Button>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="space-y-2 p-4 border rounded-md">
                  <div className="flex items-center gap-2 text-muted-foreground">
                    <Database className="h-4 w-4" />
                    <h3 className="font-medium text-foreground">Documents</h3>
                  </div>
                  <div className="text-2xl font-bold">
                    {sourceStats.totalDocs}
                  </div>
                  <p className="text-sm text-muted-foreground">
                    Total documents in this source
                  </p>
                </div>

                <div className="space-y-2 p-4 border rounded-md">
                  <div className="flex items-center gap-2 text-muted-foreground">
                    <Clock className="h-4 w-4" />
                    <h3 className="font-medium text-foreground">
                      Last Indexed
                    </h3>
                  </div>
                  <div className="text-2xl font-bold">
                    {formatDate(sourceStats.lastIndexed)}
                  </div>
                  <p className="text-sm text-muted-foreground">
                    Last time this source was updated
                  </p>
                </div>

                <div className="space-y-2 p-4 border rounded-md">
                  <div className="flex items-center gap-2 text-muted-foreground">
                    <SlidersHorizontal className="h-4 w-4" />
                    <h3 className="font-medium text-foreground">
                      Average Confidence
                    </h3>
                  </div>
                  <div className="text-2xl font-bold">
                    {sourceStats.avgConfidence}%
                  </div>
                  <div className="w-full h-2 bg-muted rounded-full overflow-hidden">
                    <div
                      className="h-full bg-primary"
                      style={{ width: `${sourceStats.avgConfidence}%` }}
                    />
                  </div>
                  <p className="text-sm text-muted-foreground">
                    Average confidence score for this source
                  </p>
                </div>
              </div>

              <div className="mt-6 space-y-4">
                <h3 className="text-sm font-medium">Source Information</h3>
                <div className="grid grid-cols-2 gap-x-4 gap-y-2">
                  <div className="text-sm text-muted-foreground">Type:</div>
                  <div className="text-sm">
                    {selectedSourceData.type.replace("_", " ")}
                  </div>
                  <div className="text-sm text-muted-foreground">Status:</div>
                  <div className="text-sm">
                    {selectedSourceData.isActive ? "Active" : "Inactive"}
                  </div>
                  <div className="text-sm text-muted-foreground">
                    Last Updated:
                  </div>
                  <div className="text-sm">
                    {formatDate(selectedSourceData.lastUpdated)}
                  </div>
                  <div className="text-sm text-muted-foreground">
                    Document Count:
                  </div>
                  <div className="text-sm">
                    {selectedSourceData.documentCount}
                  </div>
                </div>

                <div className="mt-4">
                  <h3 className="text-sm font-medium mb-2">Description</h3>
                  <p className="text-sm text-muted-foreground">
                    {selectedSourceData.description}
                  </p>
                </div>
              </div>
            </CardContent>
            <CardFooter className="flex justify-between border-t pt-6">
              <Button variant="outline">
                <ExternalLink className="mr-2 h-4 w-4" />
                View Documents
              </Button>
              <Button>
                <RefreshCw className="mr-2 h-4 w-4" />
                Refresh Source
              </Button>
            </CardFooter>
          </Card>
        </div>
      )}
    </TooltipProvider>
  );
};

export default KnowledgeSourceSelector;
