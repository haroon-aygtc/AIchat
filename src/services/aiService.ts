// AI Service for handling AI model integrations

export type AIModelType = 'gemini' | 'huggingface' | 'custom';

export interface AIModelConfig {
  modelType: AIModelType;
  temperature: number;
  maxTokens: number;
  topP: number;
  apiKey?: string;
  modelVersion?: string;
}

export interface AIResponse {
  content: string;
  detectedIntent?: string;
  suggestedFollowUps?: string[];
  sources?: {
    title: string;
    url?: string;
  }[];
}

export interface AIServiceOptions {
  includeFollowUpQuestions?: boolean;
  includeSourceCitations?: boolean;
  enhanceQuery?: boolean;
  formatResponse?: boolean;
}

// Mock intents for demonstration
const INTENTS = {
  GENERAL_INQUIRY: 'general inquiry',
  TECHNICAL_SUPPORT: 'technical support',
  PRODUCT_INFO: 'product information',
  PRICING: 'pricing',
  ACCOUNT: 'account',
};

// Simple intent detection based on keywords
const detectIntent = (query: string): string => {
  const lowerQuery = query.toLowerCase();
  
  if (lowerQuery.includes('password') || lowerQuery.includes('login') || lowerQuery.includes('account')) {
    return INTENTS.ACCOUNT;
  }
  
  if (lowerQuery.includes('price') || lowerQuery.includes('cost') || lowerQuery.includes('subscription')) {
    return INTENTS.PRICING;
  }
  
  if (lowerQuery.includes('product') || lowerQuery.includes('feature') || lowerQuery.includes('capability')) {
    return INTENTS.PRODUCT_INFO;
  }
  
  if (lowerQuery.includes('error') || lowerQuery.includes('issue') || lowerQuery.includes('problem') || lowerQuery.includes('not working')) {
    return INTENTS.TECHNICAL_SUPPORT;
  }
  
  return INTENTS.GENERAL_INQUIRY;
};

// Generate follow-up questions based on intent
const generateFollowUpQuestions = (intent: string, query: string): string[] => {
  switch (intent) {
    case INTENTS.GENERAL_INQUIRY:
      return [
        'Can you provide more details about your services?',
        'What are your business hours?',
        'How can I contact customer support?',
      ];
    case INTENTS.TECHNICAL_SUPPORT:
      return [
        'Have you tried restarting the device?',
        'What error message are you seeing?',
        'Which version of the software are you using?',
      ];
    case INTENTS.PRODUCT_INFO:
      return [
        'What are the key features of this product?',
        'How does this compare to your other offerings?',
        'Is there a warranty included?',
      ];
    case INTENTS.PRICING:
      return [
        'Are there any discounts available?',
        'Do you offer subscription plans?',
        'What payment methods do you accept?',
      ];
    case INTENTS.ACCOUNT:
      return [
        'How do I reset my password?',
        'Can I change my email address?',
        'How do I update my billing information?',
      ];
    default:
      return [
        'Can you tell me more about that?',
        'Do you have any other questions?',
        'Would you like more information?',
      ];
  }
};

// Enhance query with additional context
const enhanceQuery = (query: string, intent: string): string => {
  // In a real implementation, this would add context based on user history, knowledge base, etc.
  return query;
};

// Mock AI response generation
const generateAIResponse = async (
  query: string,
  modelConfig: AIModelConfig,
  options: AIServiceOptions = {}
): Promise<AIResponse> => {
  // In a real implementation, this would call the appropriate AI model API
  const intent = detectIntent(query);
  const enhancedQuery = options.enhanceQuery ? enhanceQuery(query, intent) : query;
  
  // Simulate API call delay
  await new Promise(resolve => setTimeout(resolve, 1000));
  
  let response = '';
  
  // Generate mock response based on intent
  switch (intent) {
    case INTENTS.ACCOUNT:
      response = 'To manage your account settings, you can go to the Account section in your profile. From there, you can update your personal information, change your password, or modify your notification preferences.';
      break;
    case INTENTS.PRICING:
      response = 'Our pricing plans start at $29/month for the Basic plan, which includes all essential features. The Pro plan at $79/month adds advanced analytics and priority support. Enterprise plans with custom features are also available - please contact our sales team for details.';
      break;
    case INTENTS.PRODUCT_INFO:
      response = 'Our product offers a comprehensive suite of features including real-time analytics, customizable dashboards, and seamless integrations with your existing tools. The platform is designed to be user-friendly while providing powerful capabilities for businesses of all sizes.';
      break;
    case INTENTS.TECHNICAL_SUPPORT:
      response = 'I understand you're experiencing an issue. To help troubleshoot, please try the following steps:\n\n1. Clear your browser cache\n2. Ensure you're using the latest version of our software\n3. Restart the application\n\nIf the problem persists, please contact our support team with the error message and steps to reproduce the issue.';
      break;
    default:
      response = 'Thank you for your question. Our AI chat system helps businesses provide instant, accurate responses to customer inquiries. The platform includes features like context-aware AI responses, knowledge base integration, and a fully customizable interface. How can I help you learn more about our platform?';
  }
  
  // Add sources if requested
  const sources = options.includeSourceCitations ? [
    { title: 'Knowledge Base Article #1234', url: '#' },
    { title: 'User Guide', url: '#' }
  ] : undefined;
  
  // Generate follow-up questions if requested
  const suggestedFollowUps = options.includeFollowUpQuestions 
    ? generateFollowUpQuestions(intent, query)
    : undefined;
  
  return {
    content: response,
    detectedIntent: intent,
    suggestedFollowUps,
    sources
  };
};

export const AIService = {
  detectIntent,
  generateFollowUpQuestions,
  generateAIResponse
};

export default AIService;
