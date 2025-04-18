import React, { useState } from "react";
import {
  Search,
  Upload,
  Tag,
  Trash2,
  Edit,
  Plus,
  FileText,
  FolderOpen,
  Filter,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";

interface Document {
  id: string;
  title: string;
  content: string;
  tags: string[];
  dateAdded: string;
  type: "markdown" | "html" | "text";
}

interface Tag {
  id: string;
  name: string;
  color: string;
}

const KnowledgeBaseManager = () => {
  const [documents, setDocuments] = useState<Document[]>([
    {
      id: "1",
      title: "Product FAQ",
      content: "Frequently asked questions about our products and services.",
      tags: ["faq", "products", "help"],
      dateAdded: "2023-06-15",
      type: "markdown",
    },
    {
      id: "2",
      title: "Return Policy",
      content:
        "Our return policy allows returns within 30 days of purchase with receipt.",
      tags: ["policy", "returns", "customer-service"],
      dateAdded: "2023-05-22",
      type: "html",
    },
    {
      id: "3",
      title: "Company History",
      content:
        "Our company was founded in 2010 with a mission to provide excellent service.",
      tags: ["about", "company", "history"],
      dateAdded: "2023-04-10",
      type: "text",
    },
  ]);

  const [tags, setTags] = useState<Tag[]>([
    { id: "1", name: "faq", color: "bg-blue-500" },
    { id: "2", name: "policy", color: "bg-red-500" },
    { id: "3", name: "products", color: "bg-green-500" },
    { id: "4", name: "returns", color: "bg-yellow-500" },
    { id: "5", name: "customer-service", color: "bg-purple-500" },
    { id: "6", name: "about", color: "bg-indigo-500" },
    { id: "7", name: "company", color: "bg-pink-500" },
    { id: "8", name: "history", color: "bg-orange-500" },
    { id: "9", name: "help", color: "bg-teal-500" },
  ]);

  const [selectedDocument, setSelectedDocument] = useState<Document | null>(
    null,
  );
  const [searchQuery, setSearchQuery] = useState("");
  const [isUploadDialogOpen, setIsUploadDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isTagDialogOpen, setIsTagDialogOpen] = useState(false);
  const [newTag, setNewTag] = useState("");
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [activeTab, setActiveTab] = useState("documents");

  const filteredDocuments = documents.filter((doc) => {
    const matchesSearch =
      doc.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      doc.content.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesTags =
      selectedTags.length === 0 ||
      selectedTags.some((tag) => doc.tags.includes(tag));
    return matchesSearch && matchesTags;
  });

  const handleDocumentSelect = (doc: Document) => {
    setSelectedDocument(doc);
  };

  const handleTagSelect = (tag: string) => {
    if (selectedTags.includes(tag)) {
      setSelectedTags(selectedTags.filter((t) => t !== tag));
    } else {
      setSelectedTags([...selectedTags, tag]);
    }
  };

  const handleAddTag = () => {
    if (newTag.trim() && !tags.some((tag) => tag.name === newTag.trim())) {
      const randomColor = `bg-${["blue", "red", "green", "yellow", "purple", "indigo", "pink", "orange", "teal"][Math.floor(Math.random() * 9)]}-500`;
      setTags([
        ...tags,
        {
          id: (tags.length + 1).toString(),
          name: newTag.trim(),
          color: randomColor,
        },
      ]);
      setNewTag("");
    }
  };

  const getFileIcon = (type: string) => {
    switch (type) {
      case "markdown":
        return <FileText className="h-5 w-5 text-blue-500" />;
      case "html":
        return <FileText className="h-5 w-5 text-orange-500" />;
      case "text":
        return <FileText className="h-5 w-5 text-gray-500" />;
      default:
        return <FileText className="h-5 w-5" />;
    }
  };

  return (
    <div className="bg-background p-6 rounded-lg shadow-sm w-full h-full">
      <div className="flex flex-col h-full space-y-6">
        <div className="flex justify-between items-center">
          <h1 className="text-2xl font-bold">Knowledge Base Manager</h1>
          <div className="flex space-x-2">
            <Button variant="outline" onClick={() => setIsTagDialogOpen(true)}>
              <Tag className="h-4 w-4 mr-2" />
              Manage Tags
            </Button>
            <Button onClick={() => setIsUploadDialogOpen(true)}>
              <Upload className="h-4 w-4 mr-2" />
              Upload Document
            </Button>
          </div>
        </div>

        <div className="flex space-x-4 h-full">
          <div className="w-1/3 flex flex-col space-y-4">
            <div className="flex space-x-2">
              <div className="relative flex-grow">
                <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search documents..."
                  className="pl-8"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
              <Button variant="outline" size="icon">
                <Filter className="h-4 w-4" />
              </Button>
            </div>

            <div className="flex flex-wrap gap-2">
              {tags.map((tag) => (
                <Badge
                  key={tag.id}
                  variant={
                    selectedTags.includes(tag.name) ? "default" : "outline"
                  }
                  className="cursor-pointer"
                  onClick={() => handleTagSelect(tag.name)}
                >
                  {tag.name}
                </Badge>
              ))}
            </div>

            <ScrollArea className="flex-grow border rounded-md">
              <div className="p-4 space-y-2">
                {filteredDocuments.length > 0 ? (
                  filteredDocuments.map((doc) => (
                    <Card
                      key={doc.id}
                      className={`cursor-pointer hover:bg-accent/50 ${selectedDocument?.id === doc.id ? "border-primary" : ""}`}
                      onClick={() => handleDocumentSelect(doc)}
                    >
                      <CardContent className="p-4">
                        <div className="flex items-start space-x-2">
                          {getFileIcon(doc.type)}
                          <div className="flex-grow">
                            <h3 className="font-medium">{doc.title}</h3>
                            <p className="text-sm text-muted-foreground truncate">
                              {doc.content.substring(0, 60)}...
                            </p>
                            <div className="flex flex-wrap gap-1 mt-2">
                              {doc.tags.map((tagName) => {
                                const tag = tags.find(
                                  (t) => t.name === tagName,
                                );
                                return (
                                  <Badge
                                    key={tagName}
                                    variant="secondary"
                                    className="text-xs"
                                  >
                                    {tagName}
                                  </Badge>
                                );
                              })}
                            </div>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))
                ) : (
                  <div className="text-center py-8 text-muted-foreground">
                    No documents found
                  </div>
                )}
              </div>
            </ScrollArea>
          </div>

          <div className="w-2/3 border rounded-md bg-card">
            {selectedDocument ? (
              <Tabs defaultValue="preview" className="w-full h-full">
                <div className="flex justify-between items-center p-4 border-b">
                  <TabsList>
                    <TabsTrigger value="preview">Preview</TabsTrigger>
                    <TabsTrigger value="edit">Edit</TabsTrigger>
                    <TabsTrigger value="ai-usage">AI Usage</TabsTrigger>
                  </TabsList>
                  <div className="flex space-x-2">
                    <Button variant="outline" size="sm">
                      <Edit className="h-4 w-4 mr-2" />
                      Edit
                    </Button>
                    <Button variant="destructive" size="sm">
                      <Trash2 className="h-4 w-4 mr-2" />
                      Delete
                    </Button>
                  </div>
                </div>

                <TabsContent
                  value="preview"
                  className="p-6 h-[calc(100%-60px)] overflow-auto"
                >
                  <div>
                    <h2 className="text-2xl font-bold mb-4">
                      {selectedDocument.title}
                    </h2>
                    <div className="flex items-center space-x-4 mb-4 text-sm text-muted-foreground">
                      <div>Added: {selectedDocument.dateAdded}</div>
                      <div>Type: {selectedDocument.type.toUpperCase()}</div>
                    </div>
                    <div className="flex flex-wrap gap-2 mb-6">
                      {selectedDocument.tags.map((tagName) => {
                        const tag = tags.find((t) => t.name === tagName);
                        return (
                          <Badge key={tagName} variant="secondary">
                            {tagName}
                          </Badge>
                        );
                      })}
                    </div>
                    <Separator className="my-4" />
                    <div className="prose max-w-none">
                      <p>{selectedDocument.content}</p>
                    </div>
                  </div>
                </TabsContent>

                <TabsContent
                  value="edit"
                  className="p-6 h-[calc(100%-60px)] overflow-auto"
                >
                  <div className="space-y-4">
                    <div>
                      <label
                        className="block text-sm font-medium mb-1"
                        htmlFor="title"
                      >
                        Title
                      </label>
                      <Input id="title" value={selectedDocument.title} />
                    </div>
                    <div>
                      <label
                        className="block text-sm font-medium mb-1"
                        htmlFor="content"
                      >
                        Content
                      </label>
                      <Textarea
                        id="content"
                        value={selectedDocument.content}
                        className="min-h-[200px]"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-1">
                        Tags
                      </label>
                      <div className="flex flex-wrap gap-2">
                        {tags.map((tag) => (
                          <Badge
                            key={tag.id}
                            variant={
                              selectedDocument.tags.includes(tag.name)
                                ? "default"
                                : "outline"
                            }
                            className="cursor-pointer"
                          >
                            {tag.name}
                          </Badge>
                        ))}
                        <Badge variant="outline" className="cursor-pointer">
                          <Plus className="h-3 w-3 mr-1" /> Add Tag
                        </Badge>
                      </div>
                    </div>
                    <div className="pt-4">
                      <Button>Save Changes</Button>
                    </div>
                  </div>
                </TabsContent>

                <TabsContent
                  value="ai-usage"
                  className="p-6 h-[calc(100%-60px)] overflow-auto"
                >
                  <div className="space-y-6">
                    <div>
                      <h3 className="text-lg font-medium mb-2">
                        AI Response Integration
                      </h3>
                      <p className="text-muted-foreground mb-4">
                        Configure how this document is used in AI responses
                      </p>

                      <div className="space-y-4">
                        <div>
                          <label className="block text-sm font-medium mb-1">
                            Priority Level
                          </label>
                          <Select defaultValue="medium">
                            <SelectTrigger>
                              <SelectValue placeholder="Select priority" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="high">
                                High - Always include if relevant
                              </SelectItem>
                              <SelectItem value="medium">
                                Medium - Include when highly relevant
                              </SelectItem>
                              <SelectItem value="low">
                                Low - Include only if directly queried
                              </SelectItem>
                            </SelectContent>
                          </Select>
                        </div>

                        <div>
                          <label className="block text-sm font-medium mb-1">
                            Response Format
                          </label>
                          <Select defaultValue="summary">
                            <SelectTrigger>
                              <SelectValue placeholder="Select format" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="full">Full Content</SelectItem>
                              <SelectItem value="summary">
                                Summary with Link
                              </SelectItem>
                              <SelectItem value="quote">
                                Key Quotes Only
                              </SelectItem>
                            </SelectContent>
                          </Select>
                        </div>

                        <div>
                          <label className="block text-sm font-medium mb-1">
                            Trigger Keywords
                          </label>
                          <Textarea
                            placeholder="Enter keywords separated by commas"
                            defaultValue="return policy, refund, money back, exchange"
                            className="min-h-[80px]"
                          />
                          <p className="text-xs text-muted-foreground mt-1">
                            These keywords will trigger this document in AI
                            responses
                          </p>
                        </div>
                      </div>
                    </div>

                    <div>
                      <h3 className="text-lg font-medium mb-2">
                        AI Response Preview
                      </h3>
                      <Card>
                        <CardHeader className="pb-2">
                          <CardTitle className="text-md">
                            Example Query: "What is your return policy?"
                          </CardTitle>
                        </CardHeader>
                        <CardContent>
                          <div className="p-4 bg-muted rounded-md">
                            <p className="mb-2">
                              Based on our <strong>Return Policy</strong>:
                            </p>
                            <p>
                              Our return policy allows returns within 30 days of
                              purchase with receipt.
                            </p>
                            <p className="text-sm text-blue-500 mt-2 underline cursor-pointer">
                              Read full return policy
                            </p>
                          </div>
                        </CardContent>
                      </Card>
                    </div>

                    <div className="pt-4">
                      <Button>Save AI Settings</Button>
                    </div>
                  </div>
                </TabsContent>
              </Tabs>
            ) : (
              <div className="flex flex-col items-center justify-center h-full text-center p-6">
                <FolderOpen className="h-16 w-16 text-muted-foreground mb-4" />
                <h3 className="text-lg font-medium">No Document Selected</h3>
                <p className="text-muted-foreground mt-2 max-w-md">
                  Select a document from the list to view and edit its content,
                  or upload a new document to get started.
                </p>
                <Button
                  className="mt-4"
                  onClick={() => setIsUploadDialogOpen(true)}
                >
                  <Upload className="h-4 w-4 mr-2" />
                  Upload Document
                </Button>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Upload Document Dialog */}
      <Dialog open={isUploadDialogOpen} onOpenChange={setIsUploadDialogOpen}>
        <DialogContent className="sm:max-w-[525px]">
          <DialogHeader>
            <DialogTitle>Upload Document</DialogTitle>
            <DialogDescription>
              Add a new document to your knowledge base. Supported formats:
              Markdown, HTML, and plain text.
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div>
              <label
                className="block text-sm font-medium mb-1"
                htmlFor="upload-title"
              >
                Document Title
              </label>
              <Input id="upload-title" placeholder="Enter document title" />
            </div>
            <div>
              <label
                className="block text-sm font-medium mb-1"
                htmlFor="upload-type"
              >
                Document Type
              </label>
              <Select defaultValue="markdown">
                <SelectTrigger>
                  <SelectValue placeholder="Select document type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="markdown">Markdown</SelectItem>
                  <SelectItem value="html">HTML</SelectItem>
                  <SelectItem value="text">Plain Text</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <label
                className="block text-sm font-medium mb-1"
                htmlFor="upload-content"
              >
                Content
              </label>
              <Textarea
                id="upload-content"
                placeholder="Enter document content or paste from clipboard"
                className="min-h-[200px]"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Tags</label>
              <div className="flex flex-wrap gap-2 mb-2">
                {tags.map((tag) => (
                  <Badge
                    key={tag.id}
                    variant="outline"
                    className="cursor-pointer"
                  >
                    {tag.name}
                  </Badge>
                ))}
              </div>
              <div className="flex space-x-2">
                <Input
                  placeholder="Add new tag"
                  value={newTag}
                  onChange={(e) => setNewTag(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && handleAddTag()}
                />
                <Button variant="outline" onClick={handleAddTag}>
                  <Plus className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setIsUploadDialogOpen(false)}
            >
              Cancel
            </Button>
            <Button>Upload Document</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Manage Tags Dialog */}
      <Dialog open={isTagDialogOpen} onOpenChange={setIsTagDialogOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Manage Tags</DialogTitle>
            <DialogDescription>
              Create and organize tags to categorize your knowledge base
              documents.
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="flex space-x-2">
              <Input
                placeholder="Add new tag"
                value={newTag}
                onChange={(e) => setNewTag(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handleAddTag()}
              />
              <Button variant="outline" onClick={handleAddTag}>
                <Plus className="h-4 w-4" />
              </Button>
            </div>
            <div className="border rounded-md p-4 max-h-[300px] overflow-y-auto">
              <div className="space-y-2">
                {tags.map((tag) => (
                  <div
                    key={tag.id}
                    className="flex items-center justify-between group"
                  >
                    <div className="flex items-center space-x-2">
                      <div
                        className={`w-3 h-3 rounded-full ${tag.color}`}
                      ></div>
                      <span>{tag.name}</span>
                    </div>
                    <div className="flex space-x-1 opacity-0 group-hover:opacity-100 transition-opacity">
                      <Button variant="ghost" size="icon" className="h-7 w-7">
                        <Edit className="h-3 w-3" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-7 w-7 text-destructive"
                      >
                        <Trash2 className="h-3 w-3" />
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button onClick={() => setIsTagDialogOpen(false)}>Done</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default KnowledgeBaseManager;
