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
  const [followUpQuestions, setFollowUpQuestions] = useState<
    FollowUpQuestion[]
  >([
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

  const [selectedQuestionId, setSelectedQuestionId] = useState<string | null>(
    "q1",
  );
  const [editingQuestion, setEditingQuestion] =
    useState<FollowUpQuestion | null>(null);
  const [viewMode, setViewMode] = useState<"list" | "flow">("list");
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
    const updatedQuestions = followUpQuestions.map((q) => ({
      ...q,
      nextQuestions: q.nextQuestions?.filter((nextId) => nextId !== id),
    }));

    // Then filter out the question itself
    const filteredQuestions = updatedQuestions.filter((q) => q.id !== id);

    setFollowUpQuestions(filteredQuestions);

    if (selectedQuestionId === id) {
      setSelectedQuestionId(
        filteredQuestions.length > 0 ? filteredQuestions[0].id : null,
      );
      setEditingQuestion(null);
    }

    toast({
      title: "Question deleted",
      description: "The follow-up question has been removed.",
      duration: 3000,
    });
  };

  const handleDuplicateQuestion = (id: string) => {
    const questionToDuplicate = followUpQuestions.find((q) => q.id === id);
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

    const updatedQuestions = followUpQuestions.map((question) =>
      question.id === editingQuestion.id ? editingQuestion : question,
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

    const sourceQuestion = followUpQuestions.find((q) => q.id === sourceId);
    if (!sourceQuestion) return;

    // Check if this link already exists
    if (sourceQuestion.nextQuestions?.includes(targetId)) return;

    const updatedQuestions = followUpQuestions.map((q) => {
      if (q.id === sourceId) {
        return {
          ...q,
          nextQuestions: [...(q.nextQuestions || []), targetId],
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
    const updatedQuestions = followUpQuestions.map((q) => {
      if (q.id === sourceId) {
        return {
          ...q,
          nextQuestions: q.nextQuestions?.filter((id) => id !== targetId),
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
    ? followUpQuestions.find((q) => q.id === selectedQuestionId)
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
                  onClick={() =>
                    setViewMode(viewMode === "list" ? "flow" : "list")
                  }
                >
                  {viewMode === "list" ? (
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
                <Button variant="outline" size="sm" onClick={handleAddQuestion}>
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
                  onValueChange={(value) =>
                    setMaxQuestionsPerResponse(parseInt(value))
                  }
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

            {viewMode === "list" ? (
              <div className="divide-y max-h-[400px] overflow-y-auto">
                {followUpQuestions.map((question) => (
                  <div
                    key={question.id}
                    className={`p-3 cursor-pointer hover:bg-muted/50 ${selectedQuestionId === question.id ? "bg-primary/5" : ""}`}
                    onClick={() => {
                      setSelectedQuestionId(question.id);
                      setEditingQuestion(null);
                    }}
                  >
                    <div className="flex items-center justify-between">
                      <div>
                        <h3 className="font-medium">{question.question}</h3>
                        <div className="flex items-center gap-2 mt-1">
                          <Badge
                            variant={getCategoryBadgeColor(
                              question.category || "general",
                            )}
                            className="text-xs"
                          >
                            {question.category || "general"}
                          </Badge>
                          {question.isDefault && (
                            <Badge className="text-xs bg-primary/20 text-primary border-primary/20">
                              Default
                            </Badge>
                          )}
                          {question.condition && (
                            <span className="text-xs text-muted-foreground">
                              Condition: {question.condition}
                            </span>
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
                            setEditingQuestion(question);
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
                            handleDuplicateQuestion(question.id);
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
                            handleDeleteQuestion(question.id);
                          }}
                          disabled={question.isDefault}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="p-4 border rounded-md m-4 bg-muted/10 h-[400px] overflow-auto">
                <div className="text-center text-muted-foreground mb-4">
                  <Workflow className="h-5 w-5 mx-auto mb-2" />
                  <p>
                    Flow view allows you to visualize and create question
                    sequences
                  </p>
                  <p className="text-xs">
                    Drag between questions to create connections
                  </p>
                </div>

                <div className="flex flex-col gap-4">
                  {followUpQuestions.map((question) => (
                    <div
                      key={question.id}
                      className={`p-3 border rounded-md ${selectedQuestionId === question.id ? "border-primary" : "border-border"}`}
                      onClick={() => setSelectedQuestionId(question.id)}
                    >
                      <div className="flex items-center justify-between">
                        <h3 className="font-medium">{question.question}</h3>
                        <Badge
                          variant={getCategoryBadgeColor(
                            question.category || "general",
                          )}
                          className="text-xs"
                        >
                          {question.category || "general"}
                        </Badge>
                      </div>

                      {question.nextQuestions &&
                        question.nextQuestions.length > 0 && (
                          <div className="mt-2 pl-4 border-l-2 border-dashed border-muted-foreground/30">
                            <div className="text-xs text-muted-foreground mb-1">
                              Leads to:
                            </div>
                            <div className="space-y-1">
                              {question.nextQuestions.map((nextId) => {
                                const nextQuestion = followUpQuestions.find(
                                  (q) => q.id === nextId,
                                );
                                return nextQuestion ? (
                                  <div
                                    key={nextId}
                                    className="flex items-center gap-1"
                                  >
                                    <CornerDownRight className="h-3 w-3 text-muted-foreground" />
                                    <span className="text-sm">
                                      {nextQuestion.question}
                                    </span>
                                    <Button
                                      variant="ghost"
                                      size="icon"
                                      className="h-5 w-5 ml-auto"
                                      onClick={(e) => {
                                        e.stopPropagation();
                                        handleRemoveLink(question.id, nextId);
                                      }}
                                    >
                                      <X className="h-3 w-3" />
                                    </Button>
                                  </div>
                                ) : null;
                              })}
                            </div>
                          </div>
                        )}

                      {selectedQuestionId === question.id && (
                        <div className="mt-3 pt-3 border-t">
                          <div className="text-xs text-muted-foreground mb-2">
                            Link to another question:
                          </div>
                          <Select
                            onValueChange={(value) =>
                              handleLinkQuestions(question.id, value)
                            }
                          >
                            <SelectTrigger className="h-8">
                              <SelectValue placeholder="Select a question to link" />
                            </SelectTrigger>
                            <SelectContent>
                              {followUpQuestions
                                .filter((q) => q.id !== question.id)
                                .map((q) => (
                                  <SelectItem key={q.id} value={q.id}>
                                    {q.question}
                                  </SelectItem>
                                ))}
                            </SelectContent>
                          </Select>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}
          </CardContent>
          <CardFooter className="flex justify-between border-t pt-6">
            <Button variant="outline">
              <X className="mr-2 h-4 w-4" />
              Reset
            </Button>
            <Button onClick={handleSaveConfig}>
              <Save className="mr-2 h-4 w-4" />
              Save Configuration
            </Button>
          </CardFooter>
        </Card>
      </div>

      <div className="md:col-span-2">
        {editingQuestion ? (
          <Card>
            <CardHeader>
              <CardTitle>Edit Follow-Up Question</CardTitle>
              <CardDescription>
                Configure how and when this follow-up question will be presented
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="question-text">Question Text</Label>
                <Textarea
                  id="question-text"
                  value={editingQuestion.question}
                  onChange={(e) =>
                    setEditingQuestion({
                      ...editingQuestion,
                      question: e.target.value,
                    })
                  }
                  placeholder="Enter the follow-up question text"
                  rows={2}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="question-condition">Display Condition</Label>
                <Textarea
                  id="question-condition"
                  value={editingQuestion.condition || ""}
                  onChange={(e) =>
                    setEditingQuestion({
                      ...editingQuestion,
                      condition: e.target.value,
                    })
                  }
                  placeholder="e.g., response contains 'pricing' or user query mentions 'cost'"
                  rows={2}
                />
                <p className="text-xs text-muted-foreground">
                  Define when this question should be shown. Leave blank to
                  always include it based on priority.
                </p>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="question-category">Category</Label>
                  <Select
                    value={editingQuestion.category || "general"}
                    onValueChange={(value) =>
                      setEditingQuestion({
                        ...editingQuestion,
                        category: value,
                      })
                    }
                  >
                    <SelectTrigger id="question-category">
                      <SelectValue placeholder="Select a category" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="general">General</SelectItem>
                      <SelectItem value="technical">Technical</SelectItem>
                      <SelectItem value="examples">Examples</SelectItem>
                      <SelectItem value="clarification">
                        Clarification
                      </SelectItem>
                      <SelectItem value="instructions">Instructions</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="question-priority">Priority</Label>
                  <Input
                    id="question-priority"
                    type="number"
                    min="1"
                    max="10"
                    value={editingQuestion.priority}
                    onChange={(e) =>
                      setEditingQuestion({
                        ...editingQuestion,
                        priority: parseInt(e.target.value),
                      })
                    }
                  />
                  <p className="text-xs text-muted-foreground">
                    Higher priority questions (10) are shown before lower
                    priority ones (1)
                  </p>
                </div>
              </div>

              <Separator />

              <div className="flex items-center space-x-2">
                <Switch
                  id="is-default"
                  checked={editingQuestion.isDefault || false}
                  onCheckedChange={(checked) =>
                    setEditingQuestion({
                      ...editingQuestion,
                      isDefault: checked,
                    })
                  }
                />
                <div>
                  <Label htmlFor="is-default">Default Question</Label>
                  <p className="text-xs text-muted-foreground">
                    This question will always be included if no other questions
                    match
                  </p>
                </div>
              </div>
            </CardContent>
            <CardFooter className="flex justify-between border-t pt-6">
              <Button
                variant="outline"
                onClick={() => setEditingQuestion(null)}
              >
                Cancel
              </Button>
              <Button onClick={handleSaveQuestion}>
                <Check className="mr-2 h-4 w-4" />
                Save Question
              </Button>
            </CardFooter>
          </Card>
        ) : selectedQuestion ? (
          <Card>
            <CardHeader>
              <CardTitle>Question Details</CardTitle>
              <CardDescription>
                View and manage this follow-up question
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="bg-muted/20 p-4 rounded-md">
                <h3 className="text-sm font-medium mb-2">Question Text</h3>
                <div className="bg-background p-3 rounded-md">
                  {selectedQuestion.question}
                </div>
              </div>

              {selectedQuestion.condition && (
                <div className="bg-muted/20 p-4 rounded-md">
                  <h3 className="text-sm font-medium mb-2">
                    Display Condition
                  </h3>
                  <div className="bg-background p-3 rounded-md font-mono text-sm">
                    {selectedQuestion.condition}
                  </div>
                </div>
              )}

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <h3 className="text-sm font-medium mb-2">Category</h3>
                  <Badge
                    variant={getCategoryBadgeColor(
                      selectedQuestion.category || "general",
                    )}
                  >
                    {selectedQuestion.category || "general"}
                  </Badge>
                </div>

                <div>
                  <h3 className="text-sm font-medium mb-2">Priority</h3>
                  <div className="flex items-center gap-2">
                    <span className="font-medium">
                      {selectedQuestion.priority}
                    </span>
                    <span className="text-xs text-muted-foreground">
                      {selectedQuestion.priority >= 8
                        ? "High"
                        : selectedQuestion.priority >= 5
                          ? "Medium"
                          : "Low"}
                    </span>
                  </div>
                </div>
              </div>

              {selectedQuestion.nextQuestions &&
                selectedQuestion.nextQuestions.length > 0 && (
                  <div className="bg-muted/20 p-4 rounded-md">
                    <h3 className="text-sm font-medium mb-2">
                      Connected Questions
                    </h3>
                    <div className="space-y-2">
                      {selectedQuestion.nextQuestions.map((nextId) => {
                        const nextQuestion = followUpQuestions.find(
                          (q) => q.id === nextId,
                        );
                        return nextQuestion ? (
                          <div
                            key={nextId}
                            className="flex items-center gap-2 p-2 bg-background rounded-md"
                          >
                            <ArrowRight className="h-4 w-4 text-muted-foreground" />
                            <span>{nextQuestion.question}</span>
                          </div>
                        ) : null;
                      })}
                    </div>
                  </div>
                )}
            </CardContent>
            <CardFooter className="flex justify-between border-t pt-6">
              <Button
                variant="outline"
                onClick={() => handleDuplicateQuestion(selectedQuestion.id)}
              >
                <Copy className="mr-2 h-4 w-4" />
                Duplicate
              </Button>
              <Button onClick={() => setEditingQuestion(selectedQuestion)}>
                <Edit className="mr-2 h-4 w-4" />
                Edit Question
              </Button>
            </CardFooter>
          </Card>
        ) : (
          <Card>
            <CardHeader>
              <CardTitle>Follow-Up Questions</CardTitle>
              <CardDescription>
                Select a question from the list to view or edit its details
              </CardDescription>
            </CardHeader>
            <CardContent className="flex flex-col items-center justify-center h-[400px] text-center">
              <MessageSquare className="h-12 w-12 text-muted-foreground mb-4" />
              <h3 className="text-lg font-medium mb-2">No question selected</h3>
              <p className="text-muted-foreground mb-4 max-w-md">
                Follow-up questions help guide users through conversations by
                suggesting relevant next steps based on their queries and AI
                responses.
              </p>
              <Button onClick={handleAddQuestion}>
                <Plus className="mr-2 h-4 w-4" />
                Create New Question
              </Button>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
};

export default FollowUpQuestionBuilder;
