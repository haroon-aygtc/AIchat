import React, { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
  Bell,
  Settings,
  Users,
  Database,
  MessageSquare,
  Layout,
  BarChart3,
  HelpCircle,
  LogOut,
} from "lucide-react";
import ConfigurationPanel from "@/components/admin/ConfigurationPanel";
import KnowledgeBaseManager from "@/components/admin/KnowledgeBaseManager";

const AdminPanel = () => {
  const [activeTab, setActiveTab] = useState("configuration");

  return (
    <div className="flex h-screen bg-background">
      {/* Sidebar */}
      <div className="w-64 border-r bg-card p-4 flex flex-col">
        <div className="flex items-center gap-2 mb-8">
          <div className="bg-primary p-2 rounded-md">
            <MessageSquare className="h-6 w-6 text-primary-foreground" />
          </div>
          <h1 className="text-xl font-bold">AI Chat Admin</h1>
        </div>

        <nav className="space-y-1 flex-1">
          <Button
            variant={activeTab === "configuration" ? "secondary" : "ghost"}
            className="w-full justify-start"
            onClick={() => setActiveTab("configuration")}
          >
            <Settings className="mr-2 h-4 w-4" />
            Configuration
          </Button>
          <Button
            variant={activeTab === "knowledge" ? "secondary" : "ghost"}
            className="w-full justify-start"
            onClick={() => setActiveTab("knowledge")}
          >
            <Database className="mr-2 h-4 w-4" />
            Knowledge Base
          </Button>
          <Button
            variant={activeTab === "prompts" ? "secondary" : "ghost"}
            className="w-full justify-start"
            onClick={() => setActiveTab("prompts")}
          >
            <MessageSquare className="mr-2 h-4 w-4" />
            Prompt Templates
          </Button>
          <Button
            variant={activeTab === "models" ? "secondary" : "ghost"}
            className="w-full justify-start"
            onClick={() => setActiveTab("models")}
          >
            <Layout className="mr-2 h-4 w-4" />
            AI Models
          </Button>
          <Button
            variant={activeTab === "appearance" ? "secondary" : "ghost"}
            className="w-full justify-start"
            onClick={() => setActiveTab("appearance")}
          >
            <Layout className="mr-2 h-4 w-4" />
            Widget Appearance
          </Button>
          <Button
            variant={activeTab === "analytics" ? "secondary" : "ghost"}
            className="w-full justify-start"
            onClick={() => setActiveTab("analytics")}
          >
            <BarChart3 className="mr-2 h-4 w-4" />
            Analytics
          </Button>
          <Button
            variant={activeTab === "users" ? "secondary" : "ghost"}
            className="w-full justify-start"
            onClick={() => setActiveTab("users")}
          >
            <Users className="mr-2 h-4 w-4" />
            User Management
          </Button>
        </nav>

        <div className="mt-auto pt-4 border-t">
          <Button variant="ghost" className="w-full justify-start">
            <HelpCircle className="mr-2 h-4 w-4" />
            Help & Support
          </Button>
          <Button
            variant="ghost"
            className="w-full justify-start text-destructive"
          >
            <LogOut className="mr-2 h-4 w-4" />
            Logout
          </Button>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Header */}
        <header className="border-b bg-card p-4">
          <div className="flex justify-between items-center">
            <h2 className="text-2xl font-bold">
              {activeTab === "configuration" && "Configuration"}
              {activeTab === "knowledge" && "Knowledge Base"}
              {activeTab === "prompts" && "Prompt Templates"}
              {activeTab === "models" && "AI Models"}
              {activeTab === "appearance" && "Widget Appearance"}
              {activeTab === "analytics" && "Analytics"}
              {activeTab === "users" && "User Management"}
            </h2>
            <div className="flex items-center gap-4">
              <Button variant="outline" size="icon">
                <Bell className="h-4 w-4" />
              </Button>
              <div className="flex items-center gap-2">
                <Avatar>
                  <AvatarImage src="https://api.dicebear.com/7.x/avataaars/svg?seed=admin" />
                  <AvatarFallback>AD</AvatarFallback>
                </Avatar>
                <div>
                  <p className="text-sm font-medium">Admin User</p>
                  <p className="text-xs text-muted-foreground">
                    admin@example.com
                  </p>
                </div>
              </div>
            </div>
          </div>
        </header>

        {/* Content Area */}
        <main className="flex-1 overflow-auto p-6">
          {activeTab === "configuration" && <ConfigurationPanel />}

          {activeTab === "knowledge" && <KnowledgeBaseManager />}

          {activeTab === "prompts" && (
            <Card>
              <CardHeader>
                <CardTitle>Prompt Templates</CardTitle>
                <CardDescription>
                  Create and manage reusable prompt templates for your AI chat
                  system.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="p-8 flex flex-col items-center justify-center text-center">
                  <MessageSquare className="h-12 w-12 text-muted-foreground mb-4" />
                  <h3 className="text-lg font-medium mb-2">
                    No prompt templates yet
                  </h3>
                  <p className="text-muted-foreground mb-4">
                    Create your first prompt template to get started.
                  </p>
                  <Button>Create Template</Button>
                </div>
              </CardContent>
            </Card>
          )}

          {activeTab === "models" && (
            <Card>
              <CardHeader>
                <CardTitle>AI Models Configuration</CardTitle>
                <CardDescription>
                  Configure AI models and their parameters for your chat system.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Tabs defaultValue="gemini">
                  <TabsList className="mb-4">
                    <TabsTrigger value="gemini">Gemini</TabsTrigger>
                    <TabsTrigger value="huggingface">Hugging Face</TabsTrigger>
                    <TabsTrigger value="custom">Custom</TabsTrigger>
                  </TabsList>
                  <TabsContent value="gemini" className="p-4 border rounded-md">
                    <h3 className="text-lg font-medium mb-4">
                      Gemini Model Settings
                    </h3>
                    <p className="text-muted-foreground mb-4">
                      Configure your Gemini API settings and parameters.
                    </p>
                    <div className="flex justify-end">
                      <Button>Save Settings</Button>
                    </div>
                  </TabsContent>
                  <TabsContent
                    value="huggingface"
                    className="p-4 border rounded-md"
                  >
                    <h3 className="text-lg font-medium mb-4">
                      Hugging Face Model Settings
                    </h3>
                    <p className="text-muted-foreground mb-4">
                      Configure your Hugging Face API settings and parameters.
                    </p>
                    <div className="flex justify-end">
                      <Button>Save Settings</Button>
                    </div>
                  </TabsContent>
                  <TabsContent value="custom" className="p-4 border rounded-md">
                    <h3 className="text-lg font-medium mb-4">
                      Custom Model Settings
                    </h3>
                    <p className="text-muted-foreground mb-4">
                      Configure your custom AI model settings and parameters.
                    </p>
                    <div className="flex justify-end">
                      <Button>Save Settings</Button>
                    </div>
                  </TabsContent>
                </Tabs>
              </CardContent>
            </Card>
          )}

          {activeTab === "appearance" && (
            <Card>
              <CardHeader>
                <CardTitle>Widget Appearance</CardTitle>
                <CardDescription>
                  Customize the look and feel of your chat widget.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 gap-6">
                  <div className="border rounded-md p-4">
                    <h3 className="text-lg font-medium mb-4">Widget Preview</h3>
                    <div className="aspect-video bg-muted rounded-md flex items-center justify-center">
                      <p className="text-muted-foreground">Widget Preview</p>
                    </div>
                  </div>
                  <div className="border rounded-md p-4">
                    <h3 className="text-lg font-medium mb-4">
                      Appearance Settings
                    </h3>
                    <p className="text-muted-foreground mb-4">
                      Customize colors, fonts, and layout of your chat widget.
                    </p>
                    <div className="flex justify-end">
                      <Button>Save Settings</Button>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}

          {activeTab === "analytics" && (
            <Card>
              <CardHeader>
                <CardTitle>Analytics</CardTitle>
                <CardDescription>
                  View usage statistics and performance metrics for your chat
                  system.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-3 gap-4 mb-6">
                  <Card>
                    <CardContent className="pt-6">
                      <div className="text-2xl font-bold">1,234</div>
                      <p className="text-muted-foreground">
                        Total Conversations
                      </p>
                    </CardContent>
                  </Card>
                  <Card>
                    <CardContent className="pt-6">
                      <div className="text-2xl font-bold">5,678</div>
                      <p className="text-muted-foreground">Total Messages</p>
                    </CardContent>
                  </Card>
                  <Card>
                    <CardContent className="pt-6">
                      <div className="text-2xl font-bold">89%</div>
                      <p className="text-muted-foreground">Satisfaction Rate</p>
                    </CardContent>
                  </Card>
                </div>
                <div className="aspect-video bg-muted rounded-md flex items-center justify-center">
                  <p className="text-muted-foreground">Analytics Charts</p>
                </div>
              </CardContent>
            </Card>
          )}

          {activeTab === "users" && (
            <Card>
              <CardHeader>
                <CardTitle>User Management</CardTitle>
                <CardDescription>
                  Manage users and their permissions for your chat system.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="p-8 flex flex-col items-center justify-center text-center">
                  <Users className="h-12 w-12 text-muted-foreground mb-4" />
                  <h3 className="text-lg font-medium mb-2">No users yet</h3>
                  <p className="text-muted-foreground mb-4">
                    Add users to your chat system to get started.
                  </p>
                  <Button>Add User</Button>
                </div>
              </CardContent>
            </Card>
          )}
        </main>
      </div>
    </div>
  );
};

export default AdminPanel;
