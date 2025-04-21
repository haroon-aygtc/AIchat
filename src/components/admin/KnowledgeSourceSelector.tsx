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
import { Switch } from "@/components/ui/switch";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Progress } from "@/components/ui/progress";
import { useToast } from "@/components/ui/use-toast";
import {
  FileText,
  Database,
  HelpCircle,
  Code,
  MessageSquare,
  Presentation,
  Search,
  Plus,
  RefreshCw,
  ExternalLink,
  Info,
  X,
  Check,
  AlertCircle,
  Filter,
} from "lucide-react";
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
  const [sources, setSources] = useState<KnowledgeSource[]>(
    knowledgeSourceService.getSources(),
  );
  const [searchQuery, setSearchQuery] = useState("");
  const [activeTab, setActiveTab] = useState("all");
  const [selectedSource, setSelectedSource] = useState<string | null>(null);
  const [isRefreshing, setIsRefreshing] = useState(false);

  // Filter sources based on search query and active tab
  const filteredSources = sources.filter((source) => {
    const matchesSearch =
      searchQuery.trim() === "" ||
      source.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      source.description.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesTab =
      activeTab === "all" ||
      (activeTab === "active" && source.isActive) ||
      (activeTab === "inactive" && !source.isActive) ||
      activeTab === source.type;

    return matchesSearch && matchesTab;
  });

  const handleToggleSource = (id: string, newStatus: boolean) => {
    const updatedSources = sources.map((source) =>
      source.id === id ? { ...source, isActive: newStatus } : source,
    );

    setSources(updatedSources);
    knowledgeSourceService.updateSourceStatus(id, newStatus);

    if (onSourcesChange) {
      onSourcesChange(updatedSources.filter((s) => s.isActive));
    }

    toast({
      title: newStatus ? "Source activated" : "Source deactivated",
      description: `${sources.find((s) => s.id === id)?.name} is now ${newStatus ? "active" : "inactive"}.`,
      duration: 3000,
    });
  };

  const handleRefreshSources = () => {
    setIsRefreshing(true);

    // Simulate refreshing sources
    setTimeout(() => {
      setIsRefreshing(false);
      toast({
        title: "Sources refreshed",
        description: "All knowledge sources have been refreshed and reindexed.",
        duration: 3000,
      });
    }, 2000);
  };

  const getIconComponent = (iconName: string) => {
    const iconMap: Record<string, React.ReactNode> = {
      FileText: <FileText className="h-4 w-4" />,
      Database: <Database className="h-4 w-4" />,
      HelpCircle: <HelpCircle className="h-4 w-4" />,
      Code: <Code className="h-4 w-4" />,
      MessageSquare: <MessageSquare className="h-4 w-4" />,
      Presentation: <Presentation className="h-4 w-4" />,
    };

    return iconMap[iconName] || <FileText className="h-4 w-4" />;
  };

  const getSourceTypeLabel = (type: string) => {
    const typeMap: Record<
      string,
      {
        label: string;
        variant: "default" | "secondary" | "outline" | "destructive";
      }
    > = {
      internal: { label: "Internal", variant: "default" },
      database: { label: "Database", variant: "secondary" },
      external: { label: "External", variant: "outline" },
      knowledge_base: { label: "Knowledge Base", variant: "default" },
    };

    return typeMap[type] || { label: type, variant: "outline" };
  };

  return (
    <Card className="w-full">
      <CardHeader>
        <div className="flex justify-between items-center">
          <div>
            <CardTitle>Knowledge Sources</CardTitle>
            <CardDescription>
              Select which knowledge sources the AI should use when responding
            </CardDescription>
          </div>
          <div className="flex gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={handleRefreshSources}
              disabled={isRefreshing}
            >
              {isRefreshing ? (
                <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
              ) : (
                <RefreshCw className="h-4 w-4 mr-2" />
              )}
              Refresh Sources
            </Button>
            <Button variant="outline" size="sm">
              <Plus className="h-4 w-4 mr-2" />
              Add Source
            </Button>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="flex items-center gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                type="text"
                placeholder="Search knowledge sources..."
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
            <Button variant="outline" size="icon">
              <Filter className="h-4 w-4" />
            </Button>
          </div>

          <Tabs value={activeTab} onValueChange={setActiveTab}>
            <TabsList className="grid grid-cols-7">
              <TabsTrigger value="all">All</TabsTrigger>
              <TabsTrigger value="active">Active</TabsTrigger>
              <TabsTrigger value="inactive">Inactive</TabsTrigger>
              <TabsTrigger value="internal">Internal</TabsTrigger>
              <TabsTrigger value="database">Database</TabsTrigger>
              <TabsTrigger value="external">External</TabsTrigger>
              <TabsTrigger value="knowledge_base">Knowledge Base</TabsTrigger>
            </TabsList>
          </Tabs>

          <div className="bg-muted/20 rounded-md">
            <div className="grid grid-cols-[auto_1fr_auto] gap-2 p-3 text-sm font-medium text-muted-foreground border-b">
              <div className="w-16 text-center">Status</div>
              <div>Source</div>
              <div className="w-24 text-right">Documents</div>
            </div>
            <ScrollArea className="h-[320px]">
              {filteredSources.length > 0 ? (
                filteredSources.map((source) => (
                  <div
                    key={source.id}
                    className={`grid grid-cols-[auto_1fr_auto] gap-2 p-3 border-b hover:bg-muted/30 cursor-pointer ${selectedSource === source.id ? "bg-primary/5" : ""}`}
                    onClick={() =>
                      setSelectedSource(
                        source.id === selectedSource ? null : source.id,
                      )
                    }
                  >
                    <div className="flex justify-center items-center">
                      <Switch
                        checked={source.isActive}
                        onCheckedChange={(checked) => {
                          handleToggleSource(source.id, checked);
                        }}
                        onClick={(e) => e.stopPropagation()}
                      />
                    </div>
                    <div>
                      <div className="font-medium flex items-center gap-2">
                        {source.icon && getIconComponent(source.icon)}
                        {source.name}
                        <Badge
                          variant={getSourceTypeLabel(source.type).variant}
                          className="ml-2"
                        >
                          {getSourceTypeLabel(source.type).label}
                        </Badge>
                      </div>
                      <div className="text-sm text-muted-foreground mt-1">
                        {source.description}
                      </div>
                      <div className="text-xs text-muted-foreground mt-1">
                        Last updated: {source.lastUpdated.toLocaleDateString()}
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="font-medium">{source.documentCount}</div>
                      <div className="text-xs text-muted-foreground">
                        documents
                      </div>
                    </div>
                  </div>
                ))
              ) : (
                <div className="p-8 text-center">
                  <AlertCircle className="mx-auto h-8 w-8 text-muted-foreground mb-2" />
                  <p className="text-muted-foreground font-medium">
                    No sources found
                  </p>
                  <p className="text-sm text-muted-foreground mt-1">
                    Try adjusting your search or filters
                  </p>
                </div>
              )}
            </ScrollArea>
          </div>

          {selectedSource && (
            <div className="bg-muted/20 p-4 rounded-md">
              <h3 className="text-sm font-medium mb-2 flex items-center gap-2">
                <Info className="h-4 w-4" />
                Source Details
              </h3>

              {(() => {
                const source = sources.find((s) => s.id === selectedSource);
                if (!source) return null;

                const stats = knowledgeSourceService.getSourceStatistics(
                  source.id,
                );

                return (
                  <div className="space-y-4">
                    <div className="grid grid-cols-3 gap-4">
                      <div className="space-y-1">
                        <div className="text-xs text-muted-foreground">
                          Total Documents
                        </div>
                        <div className="font-medium">{stats.totalDocs}</div>
                      </div>
                      <div className="space-y-1">
                        <div className="text-xs text-muted-foreground">
                          Last Indexed
                        </div>
                        <div className="font-medium">
                          {stats.lastIndexed.toLocaleDateString()}
                        </div>
                      </div>
                      <div className="space-y-1">
                        <div className="text-xs text-muted-foreground">
                          Avg. Confidence
                        </div>
                        <div className="font-medium">
                          {stats.avgConfidence}%
                        </div>
                      </div>
                    </div>

                    <div className="space-y-1">
                      <div className="text-xs text-muted-foreground">
                        Indexing Status
                      </div>
                      <div className="flex items-center gap-2">
                        <Progress value={100} className="h-2" />
                        <span className="text-xs font-medium">100%</span>
                      </div>
                    </div>

                    <div className="flex justify-end gap-2 pt-2">
                      <Button variant="outline" size="sm">
                        <ExternalLink className="h-3.5 w-3.5 mr-1.5" />
                        View Documents
                      </Button>
                      <Button variant="outline" size="sm">
                        <RefreshCw className="h-3.5 w-3.5 mr-1.5" />
                        Reindex
                      </Button>
                    </div>
                  </div>
                );
              })()}
            </div>
          )}
        </div>
      </CardContent>
      <CardFooter className="flex justify-between border-t pt-6">
        <div className="text-sm text-muted-foreground">
          {sources.filter((s) => s.isActive).length} of {sources.length} sources
          active
        </div>
        <Button>
          <Check className="mr-2 h-4 w-4" />
          Apply Source Selection
        </Button>
      </CardFooter>
    </Card>
  );
};

export default KnowledgeSourceSelector;
