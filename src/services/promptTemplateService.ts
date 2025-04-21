// Prompt Template Service for managing and using prompt templates

export interface PromptTemplate {
  id: string;
  name: string;
  template: string;
  category: string;
  description?: string;
  version?: string;
  isDefault?: boolean;
  isActive?: boolean;
  lastModified?: Date;
  tags?: string[];
  createdBy?: string;
  createdAt?: Date;
  usageCount?: number;
  averageConfidence?: number;
  status?: "draft" | "published" | "archived";
}

export interface PromptVariable {
  name: string;
  description: string;
  defaultValue?: string;
}

// Default prompt templates
const defaultTemplates: PromptTemplate[] = [
  {
    id: "general",
    name: "General Inquiry",
    template:
      "Answer the following question: {{user_query}}. Be concise and helpful.",
    category: "Customer Service",
    description: "A general-purpose template for answering customer questions",
    version: "1.0.0",
    isDefault: true,
    isActive: true,
    lastModified: new Date(),
    tags: ["general", "customer service", "inquiry"],
    createdAt: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000), // 30 days ago
    createdBy: "System",
    usageCount: 245,
    averageConfidence: 92,
    status: "published",
  },
  {
    id: "technical",
    name: "Technical Support",
    template:
      "Provide technical support for the following issue: {{user_query}}. Include step-by-step instructions.",
    category: "Support",
    description:
      "Specialized template for technical troubleshooting with step-by-step guidance",
    version: "1.2.1",
    isActive: true,
    lastModified: new Date(),
    tags: ["technical", "support", "troubleshooting"],
    createdAt: new Date(Date.now() - 45 * 24 * 60 * 60 * 1000), // 45 days ago
    createdBy: "System",
    usageCount: 187,
    averageConfidence: 88,
    status: "published",
  },
  {
    id: "product",
    name: "Product Information",
    template:
      "Provide detailed information about our products based on this query: {{user_query}}. Highlight key features and benefits.",
    category: "Sales",
    description:
      "Template for product inquiries that highlights features and benefits",
    version: "1.1.0",
    isActive: true,
    lastModified: new Date(),
    tags: ["product", "sales", "features"],
    createdAt: new Date(Date.now() - 60 * 24 * 60 * 60 * 1000), // 60 days ago
    createdBy: "System",
    usageCount: 156,
    averageConfidence: 94,
    status: "published",
  },
  {
    id: "complaint",
    name: "Complaint Handling",
    template:
      "Address the following customer complaint with empathy: {{user_query}}. Offer a solution and next steps.",
    category: "Customer Service",
    description:
      "Empathetic template for handling customer complaints and offering solutions",
    version: "1.0.2",
    isActive: true,
    lastModified: new Date(),
    tags: ["complaint", "customer service", "resolution"],
    createdAt: new Date(Date.now() - 15 * 24 * 60 * 60 * 1000), // 15 days ago
    createdBy: "System",
    usageCount: 78,
    averageConfidence: 86,
    status: "published",
  },
  {
    id: "onboarding",
    name: "New User Onboarding",
    template:
      "Welcome to our platform! I see you're asking about: {{user_query}}. Let me help you get started with our service.",
    category: "Customer Service",
    description: "Friendly onboarding template for new users",
    version: "0.9.1",
    isActive: true,
    lastModified: new Date(),
    tags: ["onboarding", "welcome", "new user"],
    createdAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000), // 5 days ago
    createdBy: "Admin",
    usageCount: 42,
    averageConfidence: 90,
    status: "draft",
  },
];

// Default prompt variables
const defaultVariables: PromptVariable[] = [
  { name: "user_query", description: "The user's question or input" },
  { name: "business_name", description: "Your company or organization name" },
  { name: "context", description: "Additional context from the conversation" },
  { name: "current_date", description: "Today's date" },
  { name: "user_name", description: "The user's name if available" },
];

// Get all templates
const getTemplates = (): PromptTemplate[] => {
  // In a real implementation, this would fetch from a database or API
  return [...defaultTemplates];
};

// Get a template by ID
const getTemplateById = (id: string): PromptTemplate | undefined => {
  return defaultTemplates.find((template) => template.id === id);
};

// Get the default template
const getDefaultTemplate = (): PromptTemplate => {
  const defaultTemplate = defaultTemplates.find(
    (template) => template.isDefault,
  );
  return defaultTemplate || defaultTemplates[0];
};

// Get all variables
const getVariables = (): PromptVariable[] => {
  return [...defaultVariables];
};

// Apply a template to a query
const applyTemplate = (
  templateId: string,
  variables: Record<string, string>,
): string => {
  const template = getTemplateById(templateId);

  if (!template) {
    return variables.user_query || "";
  }

  let result = template.template;

  // Replace all variables in the template
  Object.entries(variables).forEach(([key, value]) => {
    result = result.replace(new RegExp(`{{${key}}}`, "g"), value);
  });

  // Replace any remaining variables with empty strings
  result = result.replace(/{{\w+}}/g, "");

  return result;
};

// Select the best template for a query based on intent
const selectTemplateForIntent = (intent: string): PromptTemplate => {
  const intentToTemplateMap: Record<string, string> = {
    "general inquiry": "general",
    "technical support": "technical",
    "product information": "product",
    complaint: "complaint",
  };

  const templateId = intentToTemplateMap[intent] || "general";
  const template = getTemplateById(templateId);

  return template || getDefaultTemplate();
};

export const PromptTemplateService = {
  getTemplates,
  getTemplateById,
  getDefaultTemplate,
  getVariables,
  applyTemplate,
  selectTemplateForIntent,
};

export default PromptTemplateService;
