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
import { Textarea } from "@/components/ui/textarea";
import { Separator } from "@/components/ui/separator";
import { useToast } from "@/components/ui/use-toast";
import {
  Plus,
  Trash2,
  Copy,
  Check,
  X,
  ArrowRight,
  MessageSquare,
  Save,
  HelpCircle,
  Sparkles,
  Zap,
  LayoutGrid,
  ArrowDown,
  ArrowUp,
  Edit,
  Eye,
  Settings,
  CornerDownRight,
  Workflow,
  GitBranch,
  GitMerge,
  GitFork,
} from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface FollowUpQuestionBuilderProps {
  onSave?: (config: any) => void;
}

interface FollowUpQuestion {
  id: string;
  question: string;
  condition?: string;
  priority: number;
  isDefault?: boolean;
  category?: string;
  nextQuestions?: string[];
}

const FollowUpQuestionBuilder = ({ onSave }: FollowUpQuestionBuilderProps) => {
  const { toast } = useToast();
  const [followUpQuestions, setFollowUpQuestions] = useState<FollowUpQuestion[]>([
    {
      id: "q1",
      question: "Would you like more details about this topic?",
      priority: 10,
      isDefault: true,
      category: "general",
    },
    {
      id: "q2",
      question: "Do you need help implementing this solution?",
      condition: "response contains 'solution' or 'implementation'",
      priority: 8,
      category: "technical",
    },
    {
      id: "q3",
      question: "Would you like to see some examples?",
      condition: "user query contains 'how' or 'example'",
      priority: 7,
      category: "examples",
      nextQuestions: ["q5"],
    },
    {
      id: "q4",
      question: "Is there a specific part you'd like me to explain further?",
      condition: "response length > 200 words",
      priority: 5,
      category: "clarification",
    },
    {
      id: "q5",
      question: "Would you like me to provide step-by-step instructions?",
      condition: "user query contains 'how to' or 'steps'",
      priority: 6,
      category: "instructions",
    },
  ]);
  
  const [selectedQuestionId, setSelectedQuestionId] = useState<string | null>("q1");
  const [editingQuestion, setEditingQuestion] = useState<FollowUpQuestion | null>(null);
  const [viewMode, setViewMode] = useState<'list' | 'flow'>('list');
  const [enableFollowUp, setEnableFollowUp] = useState(true);
  const [maxQuestionsPerResponse, setMaxQuestionsPerResponse] = useState(3);
  
  const handleAddQuestion = () => {
    const newQuestion: FollowUpQuestion = {
      id: `q${Date.now()}`,
      question: "What else would you like to know?",
      priority: 1,
      category: "general",
    };

    setFollowUpQuestions([...followUpQuestions, newQuestion]);
    setSelectedQuestionId(newQuestion.id);
    setEditingQuestion(newQuestion);

    toast({
      title: "Question added",
      description: "A new follow-up question has been added.",
      duration: 3000,
    });
  };

  const handleDeleteQuestion = (id: string) => {
    // Remove this question from any nextQuestions arrays
    const updatedQuestions = followUpQuestions.map(q => ({
      ...q,
      nextQuestions: q.nextQuestions?.filter(nextId => nextId !== id)
    }));
    
    // Then filter out the question itself
    const filteredQuestions = updatedQuestions.filter(q => q.id !== id);
    
    setFollowUpQuestions(filteredQuestions);
    
    if (selectedQuestionId === id) {
      setSelectedQuestionId(filteredQuestions.length > 0 ? filteredQuestions[0].id : null);
      setEditingQuestion(null);
    }

    toast({
      title: "Question deleted",
      description: "The follow-up question has been removed.",
      duration: 3000,
    });
  };

  const handleDuplicateQuestion = (id: string) => {
    const questionToDuplicate = followUpQuestions.find(q => q.id === id);
    if (!questionToDuplicate) return;

    const newQuestion: FollowUpQuestion = {
      ...questionToDuplicate,
      id: `q${Date.now()}`,
      question: `${questionToDuplicate.question} (Copy)`,
      isDefault: false,
    };

    setFollowUpQuestions([...followUpQuestions, newQuestion]);
    setSelectedQuestionId(newQuestion.id);
    setEditingQuestion(newQuestion);

    toast({
      title: "Question duplicated",
      description: "A copy of the question has been created.",
      duration: 3000,
    });
  };

  const handleSaveQuestion = () => {
    if (!editingQuestion) return;

    const updatedQuestions = followUpQuestions.map(question =>
      question.id === editingQuestion.id ? editingQuestion : question
    );

    setFollowUpQuestions(updatedQuestions);
    setEditingQuestion(null);

    toast({
      title: "Question saved",
      description: "Your follow-up question has been updated.",
      duration: 3000,
    });
  };

  const handleSaveConfig = () => {
    // In a real implementation, this would save the config to the backend
    if (onSave) {
      onSave({
        enableFollowUp,
        maxQuestionsPerResponse,
        questions: followUpQuestions,
      });
    }

    toast({
      title: "Configuration saved",
      description: "Your follow-up question settings have been saved.",
      duration: 3000,
    });
  };

  const handleLinkQuestions = (sourceId: string, targetId: string) => {
    if (sourceId === targetId) return;
    
    const sourceQuestion = followUpQuestions.find(q => q.id === sourceId);
    if (!sourceQuestion) return;
    
    // Check if this link already exists
    if (sourceQuestion.nextQuestions?.includes(targetId)) return;
    
    const updatedQuestions = followUpQuestions.map(q => {
      if (q.id === sourceId) {
        return {
          ...q,
          nextQuestions: [...(q.nextQuestions || []), targetId]
        };
      }
      return q;
    });
    
    setFollowUpQuestions(updatedQuestions);
    
    toast({
      title: "Questions linked",
      description: "The selected questions have been connected in the flow.",
      duration: 3000,
    });
  };

  const handleRemoveLink = (sourceId: string, targetId: string) => {
    const updatedQuestions = followUpQuestions.map(q => {
      if (q.id === sourceId) {
        return {
          ...q,
          nextQuestions: q.nextQuestions?.filter(id => id !== targetId)
        };
      }
      return q;
    });
    
    setFollowUpQuestions(updatedQuestions);
  };

  const getCategoryBadgeColor = (category: string) => {
    const categoryMap: Record<string, string> = {
      general: "default",
      technical: "secondary",
      examples: "outline",
      clarification: "destructive",
      instructions: "default",
    };
    
    return categoryMap[category] || "outline";
  };

  const selectedQuestion = selectedQuestionId 
    ? followUpQuestions.find(q => q.id === selectedQuestionId) 
    : null;

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      <div className="md:col-span-1">
        <Card className="h-full">
          <CardHeader>
            <div className="flex justify-between items-center">
              <CardTitle>Follow-Up Questions</CardTitle>
              <div className="flex gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setViewMode(viewMode === 'list' ? 'flow' : 'list')}
                >
                  {viewMode === 'list' ? (
                    <>
                      <Workflow className="h-4 w-4 mr-2" />
                      Flow View
                    </>
                  ) : (
                    <>
                      <LayoutGrid className="h-4 w-4 mr-2" />
                      List View
                    </>
                  )}
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleAddQuestion}
                >
                  <Plus className="h-4 w-4 mr-2" />
                  Add
                </Button>
              </div>
            </div>
            <CardDescription>
              Configure follow-up questions to enhance user engagement
            </CardDescription>
          </CardHeader>
          <CardContent className="p-0">
            <div className="p-4 border-b flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Switch
                  checked={enableFollowUp}
                  onCheckedChange={setEnableFollowUp}
                />
                <span className="text-sm font-medium">
                  Enable Follow-Up Questions
                </span>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-sm text-muted-foreground">
                  Max per response:
                </span>
                <Select
                  value={maxQuestionsPerResponse.toString()}
                  onValueChange={(value) => setMaxQuestionsPerResponse(parseInt(value))}
                >
                  <SelectTrigger className="w-16 h-8">
                    <SelectValue placeholder="3" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="1">1</SelectItem>
                    <SelectItem value="2">2</SelectItem>
                    <SelectItem value="3">3</SelectItem>
                    <SelectItem value="4">4</SelectItem>
                    <SelectItem value="5">5</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            {viewMode === 'list' ? (
              <div className="divide-y max-h-[400px] overflow-y-auto">
                {followUpQuestions.map((question) => (
                  <div
                    key={question.id}
                    className={`p-3 cursor-pointer hover:bg-muted/50 ${selectedQuestionId === question.id ? 'bg-primary/5