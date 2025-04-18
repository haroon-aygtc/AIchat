import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import ChatWidget from "./chat/ChatWidget";
import { ArrowRight } from "lucide-react";

function Home() {
  const [showChat, setShowChat] = useState(false);

  return (
    <div className="w-screen min-h-screen bg-gradient-to-b from-background to-muted p-6">
      <header className="max-w-7xl mx-auto py-6">
        <div className="flex justify-between items-center">
          <div className="flex items-center gap-2">
            <div className="bg-primary p-2 rounded-md">
              <span className="text-primary-foreground font-bold">AI</span>
            </div>
            <h1 className="text-2xl font-bold">AI Chat System</h1>
          </div>
          <div className="flex gap-4">
            <Button
              variant="outline"
              onClick={() => (window.location.href = "/admin")}
            >
              Admin Panel
            </Button>
            <Button>Get Started</Button>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
          <div>
            <h2 className="text-4xl font-bold mb-6">
              Intelligent Conversations for Your Business
            </h2>
            <p className="text-xl text-muted-foreground mb-8">
              Enhance customer engagement with our AI-powered chat system.
              Easily customizable, context-aware, and ready to integrate with
              your existing knowledge base.
            </p>
            <div className="flex gap-4">
              <Button size="lg" onClick={() => setShowChat(true)}>
                Try Demo
              </Button>
              <Button size="lg" variant="outline">
                Learn More
              </Button>
            </div>
          </div>
          <div className="bg-card rounded-xl p-6 shadow-lg">
            <img
              src="https://images.unsplash.com/photo-1579546929518-9e396f3cc809?w=800&q=80"
              alt="AI Chat Illustration"
              className="rounded-lg w-full"
            />
          </div>
        </div>

        <div className="mt-24">
          <h2 className="text-3xl font-bold text-center mb-12">Key Features</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <Card>
              <CardHeader>
                <CardTitle>Context-Aware Responses</CardTitle>
              </CardHeader>
              <CardContent>
                <p>
                  Our AI understands the context of conversations and provides
                  relevant, accurate responses based on your business knowledge.
                </p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader>
                <CardTitle>Knowledge Base Integration</CardTitle>
              </CardHeader>
              <CardContent>
                <p>
                  Easily connect your existing documentation, FAQs, and business
                  information to power intelligent responses.
                </p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader>
                <CardTitle>Customizable Interface</CardTitle>
              </CardHeader>
              <CardContent>
                <p>
                  Tailor the chat widget to match your brand with customizable
                  colors, positioning, and messaging.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>

        <div className="mt-24 text-center">
          <h2 className="text-3xl font-bold mb-6">Ready to Get Started?</h2>
          <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
            Set up your AI chat system in minutes with our easy-to-use admin
            panel and configuration tools.
          </p>
          <Button size="lg" className="gap-2">
            Get Started <ArrowRight className="h-4 w-4" />
          </Button>
        </div>
      </main>

      {showChat && (
        <ChatWidget
          title="Demo Assistant"
          subtitle="Ask me anything about our platform"
          onSendMessage={async (message) => {
            // Simulate AI response
            await new Promise((resolve) => setTimeout(resolve, 1000));
            if (message.toLowerCase().includes("feature")) {
              return "Our platform includes features like context-aware AI responses, knowledge base integration, and a fully customizable interface.";
            } else if (
              message.toLowerCase().includes("price") ||
              message.toLowerCase().includes("cost")
            ) {
              return "We offer flexible pricing plans starting at $29/month. Would you like to see a detailed breakdown of our pricing tiers?";
            } else {
              return "Thanks for your question! Our AI chat system helps businesses provide instant, accurate responses to customer inquiries. How can I help you learn more about our platform?";
            }
          }}
        />
      )}
    </div>
  );
}

export default Home;
