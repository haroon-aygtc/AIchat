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
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Search,
  Download,
  Calendar,
  RefreshCw,
  Eye,
  MessageSquare,
  AlertTriangle,
  CheckCircle,
  XCircle,
  Clock,
  Filter,
} from "lucide-react";

interface SessionLog {
  id: string;
  userId: string;
  userName: string;
  userEmail: string;
  timestamp: string;
  duration: number;
  messageCount: number;
  status: "completed" | "error" | "active";
  source: "widget" | "api" | "admin";
  ipAddress: string;
  userAgent: string;
  errorMessage?: string;
}

interface SessionLogsProps {
  className?: string;
}

const SessionLogs = ({ className = "" }: SessionLogsProps) => {
  const [searchQuery, setSearchQuery] = useState("");
  const [timeRange, setTimeRange] = useState("7d");
  const [statusFilter, setStatusFilter] = useState<string | undefined>();
  const [sourceFilter, setSourceFilter] = useState<string | undefined>();
  const [isLoading, setIsLoading] = useState(false);

  // Mock session logs data
  const mockLogs: SessionLog[] = [
    {
      id: "log-1",
      userId: "user-1",
      userName: "John Doe",
      userEmail: "john@example.com",
      timestamp: "2023-09-15T10:30:00",
      duration: 245,
      messageCount: 8,
      status: "completed",
      source: "widget",
      ipAddress: "192.168.1.1",
      userAgent: "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36",
    },
    {
      id: "log-2",
      userId: "user-2",
      userName: "Jane Smith",
      userEmail: "jane@example.com",
      timestamp: "2023-09-15T09:15:00",
      duration: 180,
      messageCount: 5,
      status: "completed",
      source: "api",
      ipAddress: "192.168.1.2",
      userAgent: "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7)",
    },
    {
      id: "log-3",
      userId: "user-3",
      userName: "Bob Johnson",
      userEmail: "bob@example.com",
      timestamp: "2023-09-14T14:20:00",
      duration: 60,
      messageCount: 3,
      status: "error",
      source: "widget",
      ipAddress: "192.168.1.3",
      userAgent: "Mozilla/5.0 (iPhone; CPU iPhone OS 14_7_1)",
      errorMessage: "API rate limit exceeded",
    },
    {
      id: "log-4",
      userId: "user-4",
      userName: "Alice Brown",
      userEmail: "alice@example.com",
      timestamp: "2023-09-14T11:45:00",
      duration: 0,
      messageCount: 1,
      status: "active",
      source: "admin",
      ipAddress: "192.168.1.4",
      userAgent: "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36",
    },
    {
      id: "log-5",
      userId: "user-5",
      userName: "Charlie Davis",
      userEmail: "charlie@example.com",
      timestamp: "2023-09-13T16:30:00",
      duration: 120,
      messageCount: 4,
      status: "completed",
      source: "widget",
      ipAddress: "192.168.1.5",
      userAgent: "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7)",
    },
  ];

  // Filter logs based on search query and filters
  const filteredLogs = mockLogs.filter((log) => {
    const matchesSearch =
      log.userName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      log.userEmail.toLowerCase().includes(searchQuery.toLowerCase()) ||
      log.id.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesStatus = !statusFilter || log.status === statusFilter;
    const matchesSource = !sourceFilter || log.source === sourceFilter;

    return matchesSearch && matchesStatus && matchesSource;
  });

  const refreshData = () => {
    setIsLoading(true);
    // In a real implementation, this would fetch updated logs data
    setTimeout(() => {
      setIsLoading(false);
    }, 1000);
  };

  const formatDuration = (seconds: number): string => {
    if (seconds === 0) return "Active";
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}m ${remainingSeconds}s`;
  };

  const getStatusBadgeVariant = (status: string) => {
    switch (status) {
      case "completed":
        return "default";
      case "active":
        return "secondary";
      case "error":
        return "destructive";
      default:
        return "outline";
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "completed":
        return <CheckCircle className="h-4 w-4" />;
      case "active":
        return <Clock className="h-4 w-4" />;
      case "error":
        return <XCircle className="h-4 w-4" />;
      default:
        return null;
    }
  };

  return (
    <div className={`space-y-6 ${className}`}>
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold">Session Logs</h2>
          <p className="text-muted-foreground">
            View and analyze chat session logs
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

      <Card>
        <CardHeader>
          <CardTitle>Chat Sessions</CardTitle>
          <CardDescription>
            Browse and search through all chat sessions
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search by user or session ID..."
                className="pl-8"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Filter by status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="">All statuses</SelectItem>
                <SelectItem value="completed">Completed</SelectItem>
                <SelectItem value="active">Active</SelectItem>
                <SelectItem value="error">Error</SelectItem>
              </SelectContent>
            </Select>
            <Select value={sourceFilter} onValueChange={setSourceFilter}>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Filter by source" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="">All sources</SelectItem>
                <SelectItem value="widget">Widget</SelectItem>
                <SelectItem value="api">API</SelectItem>
                <SelectItem value="admin">Admin</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {filteredLogs.length > 0 ? (
            <div className="rounded-md border">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>User</TableHead>
                    <TableHead>Time</TableHead>
                    <TableHead>Duration</TableHead>
                    <TableHead>Messages</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Source</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredLogs.map((log) => (
                    <TableRow key={log.id}>
                      <TableCell>
                        <div>
                          <div className="font-medium">{log.userName}</div>
                          <div className="text-sm text-muted-foreground">
                            {log.userEmail}
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>
                        {new Date(log.timestamp).toLocaleString()}
                      </TableCell>
                      <TableCell>{formatDuration(log.duration)}</TableCell>
                      <TableCell>{log.messageCount}</TableCell>
                      <TableCell>
                        <Badge
                          variant={getStatusBadgeVariant(log.status)}
                          className="flex items-center gap-1"
                        >
                          {getStatusIcon(log.status)}
                          {log.status.charAt(0).toUpperCase() +
                            log.status.slice(1)}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <Badge variant="outline">
                          {log.source.charAt(0).toUpperCase() +
                            log.source.slice(1)}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-right">
                        <Button variant="ghost" size="icon">
                          <Eye className="h-4 w-4" />
                          <span className="sr-only">View details</span>
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          ) : (
            <div className="p-8 flex flex-col items-center justify-center text-center">
              <MessageSquare className="h-12 w-12 text-muted-foreground mb-4" />
              <h3 className="text-lg font-medium mb-2">
                No session logs found
              </h3>
              <p className="text-muted-foreground mb-4">
                {searchQuery || statusFilter || sourceFilter
                  ? "No logs match your search criteria. Try adjusting your filters."
                  : "There are no chat session logs for the selected time period."}
              </p>
              {searchQuery || statusFilter || sourceFilter ? (
                <Button
                  variant="outline"
                  onClick={() => {
                    setSearchQuery("");
                    setStatusFilter(undefined);
                    setSourceFilter(undefined);
                  }}
                >
                  <RefreshCw className="mr-2 h-4 w-4" />
                  Reset Filters
                </Button>
              ) : (
                <Button variant="outline" onClick={refreshData}>
                  <RefreshCw className="mr-2 h-4 w-4" />
                  Refresh Data
                </Button>
              )}
            </div>
          )}
        </CardContent>
        <CardFooter className="flex justify-between border-t pt-6">
          <div className="text-sm text-muted-foreground">
            Showing {filteredLogs.length} of {mockLogs.length} sessions
          </div>
          <Button variant="outline">
            <Filter className="mr-2 h-4 w-4" />
            Advanced Filters
          </Button>
        </CardFooter>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Session Statistics</CardTitle>
          <CardDescription>
            Overview of session metrics and trends
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="overview">
            <TabsList className="mb-4">
              <TabsTrigger value="overview">Overview</TabsTrigger>
              <TabsTrigger value="errors">Errors</TabsTrigger>
              <TabsTrigger value="performance">Performance</TabsTrigger>
            </TabsList>

            <TabsContent value="overview" className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <Card>
                  <CardContent className="pt-6">
                    <div className="text-2xl font-bold">{mockLogs.length}</div>
                    <p className="text-muted-foreground">Total Sessions</p>
                  </CardContent>
                </Card>
                <Card>
                  <CardContent className="pt-6">
                    <div className="text-2xl font-bold">
                      {mockLogs.reduce((sum, log) => sum + log.messageCount, 0)}
                    </div>
                    <p className="text-muted-foreground">Total Messages</p>
                  </CardContent>
                </Card>
                <Card>
                  <CardContent className="pt-6">
                    <div className="text-2xl font-bold">
                      {Math.round(
                        mockLogs.reduce((sum, log) => sum + log.duration, 0) /
                          mockLogs.filter((log) => log.status === "completed")
                            .length,
                      )}
                    </div>
                    <p className="text-muted-foreground">
                      Avg. Session Duration (s)
                    </p>
                  </CardContent>
                </Card>
              </div>

              <div className="aspect-video bg-muted/20 rounded-md flex items-center justify-center">
                <p className="text-muted-foreground">Session volume chart</p>
              </div>
            </TabsContent>

            <TabsContent value="errors" className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Card>
                  <CardContent className="pt-6">
                    <div className="text-2xl font-bold">
                      {mockLogs.filter((log) => log.status === "error").length}
                    </div>
                    <p className="text-muted-foreground">Total Errors</p>
                  </CardContent>
                </Card>
                <Card>
                  <CardContent className="pt-6">
                    <div className="text-2xl font-bold">
                      {(
                        (mockLogs.filter((log) => log.status === "error")
                          .length /
                          mockLogs.length) *
                        100
                      ).toFixed(1)}
                      %
                    </div>
                    <p className="text-muted-foreground">Error Rate</p>
                  </CardContent>
                </Card>
              </div>

              <div className="rounded-md border">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Error Type</TableHead>
                      <TableHead>Count</TableHead>
                      <TableHead>Last Occurred</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    <TableRow>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <AlertTriangle className="h-4 w-4 text-destructive" />
                          <span>API rate limit exceeded</span>
                        </div>
                      </TableCell>
                      <TableCell>1</TableCell>
                      <TableCell>
                        {new Date("2023-09-14T14:20:00").toLocaleString()}
                      </TableCell>
                    </TableRow>
                  </TableBody>
                </Table>
              </div>
            </TabsContent>

            <TabsContent value="performance" className="space-y-4">
              <div className="aspect-video bg-muted/20 rounded-md flex items-center justify-center">
                <p className="text-muted-foreground">
                  Performance metrics chart
                </p>
              </div>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
};

export default SessionLogs;
