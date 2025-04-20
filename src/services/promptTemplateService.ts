// Prompt Template Service for managing and using prompt templates

export interface PromptTemplate {
  id: string;
  name: string;
  template: string;
  category: string;
  isDefault?: boolean;
  isActive?: boolean;
  lastModified?: Date;
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
    isDefault: true,
    isActive: true,
    lastModified: new Date(),
  },
  {
    id: "technical",
    name: "Technical Support",
    template:
      "Provide technical support for the following issue: {{user_query}}. Include step-by-step instructions.",
    category: "Support",
    isActive: true,
    lastModified: new Date(),
  },
  {
    id: "product",
    name: "Product Information",
    template:
      "Provide detailed information about our products based on this query: {{user_query}}. Highlight key features and benefits.",
    category: "Sales",
    isActive: true,
    lastModified: new Date(),
  },
  {
    id: "complaint",
    name: "Complaint Handling",
    template:
      "Address the following customer complaint with empathy: {{user_query}}. Offer a solution and next steps.",
    category: "Customer Service",
    isActive: true,
    lastModified: new Date(),
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
