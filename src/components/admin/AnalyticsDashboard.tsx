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
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  BarChart3,
  PieChart,
  LineChart,
  Download,
  RefreshCw,
  Calendar,
} from "lucide-react";

interface AnalyticsDashboardProps {
  className?: string;
}

const AnalyticsDashboard = ({ className = "" }: AnalyticsDashboardProps) => {
  const [timeRange, setTimeRange] = useState("7d");
  const [isLoading, setIsLoading] = useState(false);

  const refreshData = () => {
    setIsLoading(true);
    // In a real implementation, this would fetch updated analytics data
    setTimeout(() => {
      setIsLoading(false);
    }, 1000);
  };

  return (
    <div className={`space-y-6 ${className}`}>
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold">Analytics Dashboard</h2>
          <p className="text-muted-foreground">
            Monitor usage and performance of your AI chat system
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Select value={timeRange} onValueChange={setTimeRange}>
            <SelectTrigger className="w-[180px]">
              <Calendar className="mr-2 h-4 w-4" />
              <SelectValue placeholder="Select time range" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="24h">Last 24 hours</SelectItem>
              <SelectItem value="7d">Last 7 days</SelectItem>
              <SelectItem value="30d">Last 30 days</SelectItem>
              <SelectItem value="90d">Last 90 days</SelectItem>
              <SelectItem value="1y">Last year</SelectItem>
            </SelectContent>
          </Select>
          <Button variant="outline" onClick={refreshData} disabled={isLoading}>
            <RefreshCw
              className={`mr-2 h-4 w-4 ${isLoading ? "animate-spin" : ""}`}
            />
            Refresh
          </Button>
          <Button variant="outline">
            <Download className="mr-2 h-4 w-4" />
            Export
          </Button>
        </div>
      </div>

      {/* Overview Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="pt-6">
            <div className="text-2xl font-bold">1,234</div>
            <p className="text-muted-foreground">Total Conversations</p>
            <div className="text-xs text-green-500 mt-2 flex items-center">
              +12% from last{" "}
              {timeRange === "24h"
                ? "day"
                : timeRange === "7d"
                  ? "week"
                  : "month"}
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="text-2xl font-bold">5,678</div>
            <p className="text-muted-foreground">Total Messages</p>
            <div className="text-xs text-green-500 mt-2 flex items-center">
              +8% from last{" "}
              {timeRange === "24h"
                ? "day"
                : timeRange === "7d"
                  ? "week"
                  : "month"}
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="text-2xl font-bold">89%</div>
            <p className="text-muted-foreground">Satisfaction Rate</p>
            <div className="text-xs text-green-500 mt-2 flex items-center">
              +2% from last{" "}
              {timeRange === "24h"
                ? "day"
                : timeRange === "7d"
                  ? "week"
                  : "month"}
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="text-2xl font-bold">3.2s</div>
            <p className="text-muted-foreground">Avg. Response Time</p>
            <div className="text-xs text-red-500 mt-2 flex items-center">
              +0.3s from last{" "}
              {timeRange === "24h"
                ? "day"
                : timeRange === "7d"
                  ? "week"
                  : "month"}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card className="col-span-1">
          <CardHeader>
            <CardTitle>Conversation Volume</CardTitle>
            <CardDescription>Number of conversations over time</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="aspect-[4/3] bg-muted/20 rounded-md flex items-center justify-center">
              <LineChart className="h-16 w-16 text-muted-foreground" />
              <p className="text-muted-foreground ml-4">
                Conversation volume chart
              </p>
            </div>
          </CardContent>
        </Card>

        <Card className="col-span-1">
          <CardHeader>
            <CardTitle>User Satisfaction</CardTitle>
            <CardDescription>Feedback ratings distribution</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="aspect-[4/3] bg-muted/20 rounded-md flex items-center justify-center">
              <PieChart className="h-16 w-16 text-muted-foreground" />
              <p className="text-muted-foreground ml-4">
                User satisfaction chart
              </p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Detailed Analytics */}
      <Card>
        <CardHeader>
          <CardTitle>Detailed Analytics</CardTitle>
          <CardDescription>Explore detailed metrics and trends</CardDescription>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="usage">
            <TabsList className="mb-4">
              <TabsTrigger value="usage">Usage Metrics</TabsTrigger>
              <TabsTrigger value="performance">Performance</TabsTrigger>
              <TabsTrigger value="topics">Popular Topics</TabsTrigger>
              <TabsTrigger value="sources">Knowledge Sources</TabsTrigger>
            </TabsList>

            <TabsContent value="usage" className="space-y-4">
              <div className="aspect-video bg-muted/20 rounded-md flex items-center justify-center">
                <BarChart3 className="h-16 w-16 text-muted-foreground" />
                <p className="text-muted-foreground ml-4">
                  Usage metrics chart
                </p>
              </div>
            </TabsContent>

            <TabsContent value="performance" className="space-y-4">
              <div className="aspect-video bg-muted/20 rounded-md flex items-center justify-center">
                <LineChart className="h-16 w-16 text-muted-foreground" />
                <p className="text-muted-foreground ml-4">
                  Performance metrics chart
                </p>
              </div>
            </TabsContent>

            <TabsContent value="topics" className="space-y-4">
              <div className="aspect-video bg-muted/20 rounded-md flex items-center justify-center">
                <PieChart className="h-16 w-16 text-muted-foreground" />
                <p className="text-muted-foreground ml-4">
                  Popular topics chart
                </p>
              </div>
            </TabsContent>

            <TabsContent value="sources" className="space-y-4">
              <div className="aspect-video bg-muted/20 rounded-md flex items-center justify-center">
                <BarChart3 className="h-16 w-16 text-muted-foreground" />
                <p className="text-muted-foreground ml-4">
                  Knowledge sources chart
                </p>
              </div>
            </TabsContent>
          </Tabs>
        </CardContent>
        <CardFooter className="flex justify-between border-t pt-6">
          <Button variant="outline">
            <Download className="mr-2 h-4 w-4" />
            Export Data
          </Button>
          <Button>Generate Report</Button>
        </CardFooter>
      </Card>
    </div>
  );
};

export default AnalyticsDashboard;
