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
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
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
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import {
  Plus,
  Trash2,
  Copy as CopyIcon,
  CheckCircle2,
  Settings,
  MessageSquare,
  Database,
  Palette,
  FileText,
  Zap,
  Calendar,
  MoreHorizontal,
  Edit,
  Download,
  Upload,
  Check,
  X,
} from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { ChatSystemConfig } from "@/services/configurationService";

interface ConfigurationSelectorProps {
  configurations: ChatSystemConfig[];
  activeConfigId: string;
  onActivate: (id: string) => void;
  onDuplicate: (id: string) => void;
  onDelete: (id: string) => void;
  onCreateNew: (name: string, description: string) => void;
}

const ConfigurationSelector = ({
  configurations,
  activeConfigId,
  onActivate,
  onDuplicate,
  onDelete,
  onCreateNew,
}: ConfigurationSelectorProps) => {
  const { toast } = useToast();
  const [newConfigName, setNewConfigName] = useState("");
  const [newConfigDescription, setNewConfigDescription] = useState("");
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [configToDelete, setConfigToDelete] = useState<string | null>(null);

  const handleCreateConfig = () => {
    if (!newConfigName.trim()) {
      toast({
        title: "Name required",
        description: "Please provide a name for your configuration.",
        variant: "destructive",
        duration: 3000,
      });
      return;
    }

    onCreateNew(newConfigName, newConfigDescription);
    setNewConfigName("");
    setNewConfigDescription("");
    setIsCreateDialogOpen(false);
  };

  const formatDate = (date?: Date) => {
    if (!date) return "Never";
    return new Date(date).toLocaleDateString(undefined, {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  return (
    <Card>
      <CardHeader className="pb-3">
        <div className="flex justify-between items-center">
          <CardTitle>AI Configurations</CardTitle>
          <Dialog
            open={isCreateDialogOpen}
            onOpenChange={setIsCreateDialogOpen}
          >
            <DialogTrigger asChild>
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button size="sm">
                      <Plus className="h-4 w-4 mr-2" />
                      New Configuration
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>Create a new AI configuration</p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Create New Configuration</DialogTitle>
                <DialogDescription>
                  Create a new AI configuration based on current settings.
                </DialogDescription>
              </DialogHeader>
              <div className="space-y-4 py-4">
                <div className="space-y-2">
                  <Label htmlFor="config-name">Configuration Name</Label>
                  <Input
                    id="config-name"
                    placeholder="E.g., Customer Support Bot"
                    value={newConfigName}
                    onChange={(e) => setNewConfigName(e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="config-description">Description</Label>
                  <Textarea
                    id="config-description"
                    placeholder="Describe the purpose of this configuration"
                    value={newConfigDescription}
                    onChange={(e) => setNewConfigDescription(e.target.value)}
                    rows={3}
                  />
                </div>
              </div>
              <DialogFooter>
                <Button
                  variant="outline"
                  onClick={() => {
                    setNewConfigName("");
                    setNewConfigDescription("");
                    setIsCreateDialogOpen(false);
                  }}
                >
                  Cancel
                </Button>
                <Button onClick={handleCreateConfig}>
                  Create Configuration
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>
        <CardDescription>
          Switch between different AI configurations for various use cases
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {configurations.map((configItem) => (
            <div
              key={configItem.id}
              className={`border rounded-lg p-4 ${configItem.isActive ? "border-primary bg-primary/5" : ""}`}
            >
              <div className="flex justify-between items-start mb-2">
                <div>
                  <h3 className="font-medium flex items-center gap-2">
                    {configItem.name}
                    {configItem.isActive && (
                      <Badge
                        variant="outline"
                        className="bg-primary/20 text-primary border-primary/10"
                      >
                        Active
                      </Badge>
                    )}
                  </h3>
                  <p className="text-sm text-muted-foreground">
                    {configItem.description}
                  </p>
                </div>
                <div>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="icon" className="h-8 w-8">
                        <MoreHorizontal className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuLabel>Actions</DropdownMenuLabel>
                      <DropdownMenuSeparator />
                      {!configItem.isActive && (
                        <DropdownMenuItem
                          onClick={() => onActivate(configItem.id || "")}
                        >
                          <CheckCircle2 className="h-4 w-4 mr-2" />
                          Activate
                        </DropdownMenuItem>
                      )}
                      <DropdownMenuItem
                        onClick={() => onDuplicate(configItem.id || "")}
                      >
                        <CopyIcon className="h-4 w-4 mr-2" />
                        Duplicate
                      </DropdownMenuItem>
                      <DropdownMenuItem>
                        <Edit className="h-4 w-4 mr-2" />
                        Rename
                      </DropdownMenuItem>
                      <DropdownMenuItem>
                        <Download className="h-4 w-4 mr-2" />
                        Export
                      </DropdownMenuItem>
                      <DropdownMenuSeparator />
                      {!configItem.isActive && configItem.id !== "default" && (
                        <DropdownMenuItem
                          className="text-destructive focus:text-destructive"
                          onClick={() => setConfigToDelete(configItem.id || "")}
                        >
                          <Trash2 className="h-4 w-4 mr-2" />
                          Delete
                        </DropdownMenuItem>
                      )}
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-x-4 gap-y-1 mt-4 text-xs text-muted-foreground">
                <div>Model:</div>
                <div className="font-medium text-foreground">
                  {configItem.aiModel.modelType === "gemini"
                    ? "Google Gemini"
                    : configItem.aiModel.modelType === "huggingface"
                      ? "Hugging Face"
                      : "Custom Model"}
                </div>

                <div>Knowledge Base:</div>
                <div className="font-medium text-foreground">
                  {configItem.knowledgeBase.enableKnowledgeBase
                    ? "Enabled"
                    : "Disabled"}
                </div>

                <div>Last Updated:</div>
                <div className="font-medium text-foreground">
                  {formatDate(configItem.updatedAt)}
                </div>
              </div>

              {!configItem.isActive && (
                <Button
                  className="w-full mt-4"
                  variant="outline"
                  size="sm"
                  onClick={() => onActivate(configItem.id || "")}
                >
                  <CheckCircle2 className="h-4 w-4 mr-2" />
                  Activate Configuration
                </Button>
              )}
            </div>
          ))}
        </div>
      </CardContent>
      <CardFooter className="flex justify-between pt-6">
        <Button variant="outline" size="sm">
          <Upload className="h-4 w-4 mr-2" />
          Import Configuration
        </Button>
        <Button variant="outline" size="sm">
          <Settings className="h-4 w-4 mr-2" />
          Manage All Configurations
        </Button>
      </CardFooter>

      <AlertDialog
        open={!!configToDelete}
        onOpenChange={(open) => !open && setConfigToDelete(null)}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Configuration</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete this configuration? This action
              cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
              onClick={() => {
                if (configToDelete) {
                  onDelete(configToDelete);
                  setConfigToDelete(null);
                }
              }}
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </Card>
  );
};

export default ConfigurationSelector;
