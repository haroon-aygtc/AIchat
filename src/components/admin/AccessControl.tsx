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
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
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
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Shield,
  Plus,
  Edit,
  Trash2,
  MoreHorizontal,
  Check,
  X,
  Lock,
  Key,
  Globe,
  Users,
  UserPlus,
  ShieldAlert,
  ShieldCheck,
  Save,
} from "lucide-react";

interface Role {
  id: string;
  name: string;
  description: string;
  permissions: Permission[];
  userCount: number;
}

interface Permission {
  id: string;
  name: string;
  description: string;
  category: "admin" | "content" | "user" | "system";
  isGranted: boolean;
}

interface AccessControlProps {
  className?: string;
}

const AccessControl = ({ className = "" }: AccessControlProps) => {
  const [activeTab, setActiveTab] = useState("roles");
  const [isAddRoleDialogOpen, setIsAddRoleDialogOpen] = useState(false);
  const [selectedRole, setSelectedRole] = useState<string | null>(null);
  const [isEditingPermissions, setIsEditingPermissions] = useState(false);

  // Mock roles data
  const mockRoles: Role[] = [
    {
      id: "role-1",
      name: "Administrator",
      description: "Full access to all system features and settings",
      permissions: [
        {
          id: "perm-1",
          name: "Manage Users",
          description: "Create, edit, and delete user accounts",
          category: "admin",
          isGranted: true,
        },
        {
          id: "perm-2",
          name: "Manage Roles",
          description: "Create, edit, and delete roles and permissions",
          category: "admin",
          isGranted: true,
        },
        {
          id: "perm-3",
          name: "Manage Knowledge Base",
          description: "Add, edit, and delete knowledge base content",
          category: "content",
          isGranted: true,
        },
        {
          id: "perm-4",
          name: "View Analytics",
          description: "Access analytics and reporting features",
          category: "system",
          isGranted: true,
        },
        {
          id: "perm-5",
          name: "Configure System",
          description: "Modify system settings and configurations",
          category: "system",
          isGranted: true,
        },
      ],
      userCount: 2,
    },
    {
      id: "role-2",
      name: "Content Manager",
      description: "Manage knowledge base content and prompts",
      permissions: [
        {
          id: "perm-1",
          name: "Manage Users",
          description: "Create, edit, and delete user accounts",
          category: "admin",
          isGranted: false,
        },
        {
          id: "perm-2",
          name: "Manage Roles",
          description: "Create, edit, and delete roles and permissions",
          category: "admin",
          isGranted: false,
        },
        {
          id: "perm-3",
          name: "Manage Knowledge Base",
          description: "Add, edit, and delete knowledge base content",
          category: "content",
          isGranted: true,
        },
        {
          id: "perm-4",
          name: "View Analytics",
          description: "Access analytics and reporting features",
          category: "system",
          isGranted: true,
        },
        {
          id: "perm-5",
          name: "Configure System",
          description: "Modify system settings and configurations",
          category: "system",
          isGranted: false,
        },
      ],
      userCount: 3,
    },
    {
      id: "role-3",
      name: "Viewer",
      description: "View-only access to content and basic analytics",
      permissions: [
        {
          id: "perm-1",
          name: "Manage Users",
          description: "Create, edit, and delete user accounts",
          category: "admin",
          isGranted: false,
        },
        {
          id: "perm-2",
          name: "Manage Roles",
          description: "Create, edit, and delete roles and permissions",
          category: "admin",
          isGranted: false,
        },
        {
          id: "perm-3",
          name: "Manage Knowledge Base",
          description: "Add, edit, and delete knowledge base content",
          category: "content",
          isGranted: false,
        },
        {
          id: "perm-4",
          name: "View Analytics",
          description: "Access analytics and reporting features",
          category: "system",
          isGranted: true,
        },
        {
          id: "perm-5",
          name: "Configure System",
          description: "Modify system settings and configurations",
          category: "system",
          isGranted: false,
        },
      ],
      userCount: 5,
    },
  ];

  // Mock API keys data
  const mockApiKeys = [
    {
      id: "key-1",
      name: "Production API Key",
      key: "sk_prod_...3f8a",
      created: "2023-08-15T10:00:00",
      lastUsed: "2023-09-15T14:30:00",
      status: "active",
    },
    {
      id: "key-2",
      name: "Development API Key",
      key: "sk_dev_...7b2c",
      created: "2023-08-20T11:15:00",
      lastUsed: "2023-09-14T09:45:00",
      status: "active",
    },
    {
      id: "key-3",
      name: "Testing API Key",
      key: "sk_test_...9d4e",
      created: "2023-09-01T09:30:00",
      lastUsed: "2023-09-10T16:20:00",
      status: "revoked",
    },
  ];

  const selectedRoleData = selectedRole
    ? mockRoles.find((role) => role.id === selectedRole)
    : null;

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case "admin":
        return <Shield className="h-4 w-4" />;
      case "content":
        return <Edit className="h-4 w-4" />;
      case "user":
        return <Users className="h-4 w-4" />;
      case "system":
        return <Key className="h-4 w-4" />;
      default:
        return null;
    }
  };

  return (
    <div className={`space-y-6 ${className}`}>
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold">Access Control</h2>
          <p className="text-muted-foreground">
            Manage roles, permissions, and API access
          </p>
        </div>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="mb-4">
          <TabsTrigger value="roles" className="flex items-center gap-1">
            <ShieldCheck className="h-4 w-4" />
            Roles & Permissions
          </TabsTrigger>
          <TabsTrigger value="api" className="flex items-center gap-1">
            <Key className="h-4 w-4" />
            API Keys
          </TabsTrigger>
          <TabsTrigger value="security" className="flex items-center gap-1">
            <ShieldAlert className="h-4 w-4" />
            Security Settings
          </TabsTrigger>
        </TabsList>

        {/* Roles & Permissions Tab */}
        <TabsContent value="roles" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="md:col-span-1">
              <Card className="h-full">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <div>
                    <CardTitle>Roles</CardTitle>
                    <CardDescription>
                      Manage user roles and access levels
                    </CardDescription>
                  </div>
                  <Button
                    size="sm"
                    onClick={() => setIsAddRoleDialogOpen(true)}
                  >
                    <Plus className="h-4 w-4 mr-1" /> Add Role
                  </Button>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    {mockRoles.map((role) => (
                      <div
                        key={role.id}
                        className={`p-3 rounded-md cursor-pointer hover:bg-muted/50 ${selectedRole === role.id ? "bg-primary/10 border-l-4 border-primary" : ""}`}
                        onClick={() => setSelectedRole(role.id)}
                      >
                        <div className="flex justify-between items-start">
                          <div>
                            <h3 className="font-medium">{role.name}</h3>
                            <p className="text-sm text-muted-foreground">
                              {role.description}
                            </p>
                          </div>
                          <Badge variant="outline">
                            {role.userCount} users
                          </Badge>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>

            <div className="md:col-span-2">
              {selectedRoleData ? (
                <Card>
                  <CardHeader>
                    <div className="flex justify-between items-start">
                      <div>
                        <CardTitle>{selectedRoleData.name}</CardTitle>
                        <CardDescription>
                          {selectedRoleData.description}
                        </CardDescription>
                      </div>
                      <div className="flex gap-2">
                        {isEditingPermissions ? (
                          <>
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => setIsEditingPermissions(false)}
                            >
                              Cancel
                            </Button>
                            <Button
                              size="sm"
                              onClick={() => setIsEditingPermissions(false)}
                            >
                              <Save className="h-4 w-4 mr-1" /> Save Changes
                            </Button>
                          </>
                        ) : (
                          <>
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => setIsEditingPermissions(true)}
                            >
                              <Edit className="h-4 w-4 mr-1" /> Edit Permissions
                            </Button>
                            <DropdownMenu>
                              <DropdownMenuTrigger asChild>
                                <Button variant="outline" size="icon">
                                  <MoreHorizontal className="h-4 w-4" />
                                </Button>
                              </DropdownMenuTrigger>
                              <DropdownMenuContent align="end">
                                <DropdownMenuLabel>Actions</DropdownMenuLabel>
                                <DropdownMenuItem>
                                  <Edit className="h-4 w-4 mr-2" /> Rename Role
                                </DropdownMenuItem>
                                <DropdownMenuItem>
                                  <UserPlus className="h-4 w-4 mr-2" /> Assign
                                  Users
                                </DropdownMenuItem>
                                <DropdownMenuSeparator />
                                <DropdownMenuItem className="text-destructive">
                                  <Trash2 className="h-4 w-4 mr-2" /> Delete
                                  Role
                                </DropdownMenuItem>
                              </DropdownMenuContent>
                            </DropdownMenu>
                          </>
                        )}
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-6">
                      <div>
                        <h3 className="text-sm font-medium mb-2">
                          Permissions
                        </h3>
                        <div className="space-y-4">
                          {["admin", "content", "system", "user"].map(
                            (category) => {
                              const categoryPermissions =
                                selectedRoleData.permissions.filter(
                                  (p) => p.category === category,
                                );
                              if (categoryPermissions.length === 0) return null;

                              return (
                                <div key={category} className="space-y-2">
                                  <h4 className="text-sm font-medium flex items-center gap-1 text-muted-foreground">
                                    {getCategoryIcon(category)}
                                    {category.charAt(0).toUpperCase() +
                                      category.slice(1)}
                                  </h4>
                                  <div className="bg-muted/20 rounded-md">
                                    <Table>
                                      <TableBody>
                                        {categoryPermissions.map(
                                          (permission) => (
                                            <TableRow key={permission.id}>
                                              <TableCell className="py-2">
                                                <div>
                                                  <div className="font-medium">
                                                    {permission.name}
                                                  </div>
                                                  <div className="text-sm text-muted-foreground">
                                                    {permission.description}
                                                  </div>
                                                </div>
                                              </TableCell>
                                              <TableCell className="text-right py-2">
                                                {isEditingPermissions ? (
                                                  <Switch
                                                    checked={
                                                      permission.isGranted
                                                    }
                                                    // In a real implementation, this would update the permission
                                                  />
                                                ) : permission.isGranted ? (
                                                  <Badge className="bg-green-500/10 text-green-500 hover:bg-green-500/20 border-green-500/20">
                                                    <Check className="h-3.5 w-3.5 mr-1" />
                                                    Granted
                                                  </Badge>
                                                ) : (
                                                  <Badge
                                                    variant="outline"
                                                    className="text-muted-foreground"
                                                  >
                                                    <X className="h-3.5 w-3.5 mr-1" />
                                                    Not Granted
                                                  </Badge>
                                                )}
                                              </TableCell>
                                            </TableRow>
                                          ),
                                        )}
                                      </TableBody>
                                    </Table>
                                  </div>
                                </div>
                              );
                            },
                          )}
                        </div>
                      </div>

                      <div>
                        <h3 className="text-sm font-medium mb-2">
                          Users with this role
                        </h3>
                        <div className="bg-muted/20 p-4 rounded-md">
                          <div className="flex items-center justify-between">
                            <div>
                              <p className="font-medium">
                                {selectedRoleData.userCount} users
                              </p>
                              <p className="text-sm text-muted-foreground">
                                Have the {selectedRoleData.name} role assigned
                              </p>
                            </div>
                            <Button variant="outline" size="sm">
                              <UserPlus className="h-4 w-4 mr-1" /> Manage Users
                            </Button>
                          </div>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ) : (
                <Card>
                  <CardContent className="p-6 flex flex-col items-center justify-center text-center h-full">
                    <Shield className="h-12 w-12 text-muted-foreground mb-4" />
                    <h3 className="text-lg font-medium mb-2">
                      Select a role to view details
                    </h3>
                    <p className="text-muted-foreground mb-4">
                      Choose a role from the list to view and manage its
                      permissions
                    </p>
                    <Button onClick={() => setIsAddRoleDialogOpen(true)}>
                      <Plus className="mr-2 h-4 w-4" />
                      Create New Role
                    </Button>
                  </CardContent>
                </Card>
              )}
            </div>
          </div>
        </TabsContent>

        {/* API Keys Tab */}
        <TabsContent value="api" className="space-y-4">
          <Card>
            <CardHeader>
              <div className="flex justify-between items-start">
                <div>
                  <CardTitle>API Keys</CardTitle>
                  <CardDescription>
                    Manage API keys for external integrations
                  </CardDescription>
                </div>
                <Button>
                  <Plus className="h-4 w-4 mr-1" /> Generate New Key
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <div className="rounded-md border">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Name</TableHead>
                      <TableHead>Key</TableHead>
                      <TableHead>Created</TableHead>
                      <TableHead>Last Used</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {mockApiKeys.map((apiKey) => (
                      <TableRow key={apiKey.id}>
                        <TableCell>
                          <div className="font-medium">{apiKey.name}</div>
                        </TableCell>
                        <TableCell>
                          <code className="bg-muted px-2 py-1 rounded text-sm">
                            {apiKey.key}
                          </code>
                        </TableCell>
                        <TableCell>
                          {new Date(apiKey.created).toLocaleDateString()}
                        </TableCell>
                        <TableCell>
                          {new Date(apiKey.lastUsed).toLocaleDateString()}
                        </TableCell>
                        <TableCell>
                          {apiKey.status === "active" ? (
                            <Badge className="bg-green-500/10 text-green-500 hover:bg-green-500/20 border-green-500/20">
                              Active
                            </Badge>
                          ) : (
                            <Badge
                              variant="outline"
                              className="text-muted-foreground"
                            >
                              Revoked
                            </Badge>
                          )}
                        </TableCell>
                        <TableCell className="text-right">
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button variant="ghost" size="icon">
                                <MoreHorizontal className="h-4 w-4" />
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                              <DropdownMenuLabel>Actions</DropdownMenuLabel>
                              <DropdownMenuItem>
                                <Edit className="h-4 w-4 mr-2" /> Rename
                              </DropdownMenuItem>
                              <DropdownMenuItem>
                                <Copy className="h-4 w-4 mr-2" /> Copy Key
                              </DropdownMenuItem>
                              {apiKey.status === "active" ? (
                                <DropdownMenuItem className="text-destructive">
                                  <X className="h-4 w-4 mr-2" /> Revoke Key
                                </DropdownMenuItem>
                              ) : (
                                <DropdownMenuItem>
                                  <Check className="h-4 w-4 mr-2" /> Reactivate
                                  Key
                                </DropdownMenuItem>
                              )}
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>API Usage & Limits</CardTitle>
              <CardDescription>
                Monitor API usage and configure rate limits
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <Card>
                    <CardContent className="pt-6">
                      <div className="text-2xl font-bold">12,345</div>
                      <p className="text-muted-foreground">
                        Total API Calls (30d)
                      </p>
                    </CardContent>
                  </Card>
                  <Card>
                    <CardContent className="pt-6">
                      <div className="text-2xl font-bold">98.7%</div>
                      <p className="text-muted-foreground">Success Rate</p>
                    </CardContent>
                  </Card>
                  <Card>
                    <CardContent className="pt-6">
                      <div className="text-2xl font-bold">412ms</div>
                      <p className="text-muted-foreground">
                        Avg. Response Time
                      </p>
                    </CardContent>
                  </Card>
                </div>

                <div className="aspect-[3/1] bg-muted/20 rounded-md flex items-center justify-center">
                  <p className="text-muted-foreground">API usage chart</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Security Settings Tab */}
        <TabsContent value="security" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Security Settings</CardTitle>
              <CardDescription>
                Configure security options for your chat system
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-4">
                <h3 className="text-sm font-medium">Authentication</h3>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label>Two-Factor Authentication</Label>
                      <p className="text-sm text-muted-foreground">
                        Require 2FA for all admin users
                      </p>
                    </div>
                    <Switch checked={true} />
                  </div>
                  <Separator />
                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label>Password Requirements</Label>
                      <p className="text-sm text-muted-foreground">
                        Enforce strong password policy
                      </p>
                    </div>
                    <Switch checked={true} />
                  </div>
                  <Separator />
                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label>Session Timeout</Label>
                      <p className="text-sm text-muted-foreground">
                        Automatically log out inactive users
                      </p>
                    </div>
                    <div className="flex items-center gap-2">
                      <Input type="number" className="w-20" defaultValue="30" />
                      <span className="text-sm">minutes</span>
                    </div>
                  </div>
                </div>
              </div>

              <div className="space-y-4">
                <h3 className="text-sm font-medium">Access Control</h3>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label>IP Restrictions</Label>
                      <p className="text-sm text-muted-foreground">
                        Limit access to specific IP addresses
                      </p>
                    </div>
                    <Switch />
                  </div>
                  <Separator />
                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label>CORS Settings</Label>
                      <p className="text-sm text-muted-foreground">
                        Control which domains can access your API
                      </p>
                    </div>
                    <Button variant="outline" size="sm">
                      <Globe className="h-4 w-4 mr-1" /> Configure
                    </Button>
                  </div>
                </div>
              </div>

              <div className="space-y-4">
                <h3 className="text-sm font-medium">Data Protection</h3>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label>Data Encryption</Label>
                      <p className="text-sm text-muted-foreground">
                        Encrypt sensitive data at rest
                      </p>
                    </div>
                    <Switch checked={true} />
                  </div>
                  <Separator />
                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label>Audit Logging</Label>
                      <p className="text-sm text-muted-foreground">
                        Log all administrative actions
                      </p>
                    </div>
                    <Switch checked={true} />
                  </div>
                </div>
              </div>
            </CardContent>
            <CardFooter className="flex justify-end border-t pt-6">
              <Button>
                <Save className="mr-2 h-4 w-4" />
                Save Security Settings
              </Button>
            </CardFooter>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Add Role Dialog */}
      <Dialog open={isAddRoleDialogOpen} onOpenChange={setIsAddRoleDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Create New Role</DialogTitle>
            <DialogDescription>
              Define a new role and set its permissions.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-2">
            <div className="space-y-2">
              <Label htmlFor="role-name">Role Name</Label>
              <Input id="role-name" placeholder="e.g., Support Agent" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="role-description">Description</Label>
              <Input
                id="role-description"
                placeholder="e.g., Staff who handle customer inquiries"
              />
            </div>
            <div className="space-y-2">
              <Label>Base Permissions On</Label>
              <div className="grid grid-cols-3 gap-2">
                {mockRoles.map((role) => (
                  <Button
                    key={role.id}
                    variant="outline"
                    className="justify-start h-auto py-3 px-4"
                  >
                    <div className="text-left">
                      <div className="font-medium">{role.name}</div>
                      <div className="text-xs text-muted-foreground">
                        {role.permissions.filter((p) => p.isGranted).length}{" "}
                        permissions
                      </div>
                    </div>
                  </Button>
                ))}
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setIsAddRoleDialogOpen(false)}
            >
              Cancel
            </Button>
            <Button onClick={() => setIsAddRoleDialogOpen(false)}>
              Continue to Permissions
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default AccessControl;
