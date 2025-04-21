// Mock data for knowledge sources

import { KnowledgeSource } from "../../services/knowledgeSourceService";

const knowledgeSources: KnowledgeSource[] = [
  {
    id: "kb-1",
    name: "Product Documentation",
    description: "Official product documentation and user guides",
    type: "internal",
    icon: "FileText",
    isActive: true,
    documentCount: 156,
    lastUpdated: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000), // 2 days ago
  },
  {
    id: "kb-2",
    name: "Knowledge Base Articles",
    description: "Curated knowledge base articles for common questions",
    type: "knowledge_base",
    icon: "BookOpen",
    isActive: true,
    documentCount: 89,
    lastUpdated: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000), // 5 days ago
  },
  {
    id: "kb-3",
    name: "Customer Support Database",
    description: "Database of customer support tickets and resolutions",
    type: "database",
    icon: "Database",
    isActive: false,
    documentCount: 1243,
    lastUpdated: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000), // 1 day ago
  },
  {
    id: "kb-4",
    name: "FAQ Repository",
    description: "Frequently asked questions and their answers",
    type: "internal",
    icon: "HelpCircle",
    isActive: true,
    documentCount: 42,
    lastUpdated: new Date(Date.now() - 14 * 24 * 60 * 60 * 1000), // 14 days ago
  },
  {
    id: "kb-5",
    name: "API Documentation",
    description: "Technical documentation for API endpoints and usage",
    type: "internal",
    icon: "Code",
    isActive: false,
    documentCount: 78,
    lastUpdated: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000), // 30 days ago
  },
  {
    id: "kb-6",
    name: "Community Forums",
    description: "User discussions and community knowledge sharing",
    type: "external",
    icon: "MessageSquare",
    isActive: true,
    documentCount: 567,
    lastUpdated: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000), // 3 days ago
  },
  {
    id: "kb-7",
    name: "Training Materials",
    description: "Training guides and educational resources",
    type: "internal",
    icon: "Presentation",
    isActive: false,
    documentCount: 35,
    lastUpdated: new Date(Date.now() - 60 * 24 * 60 * 60 * 1000), // 60 days ago
  },
];

const sourceStatistics = {
  "kb-1": {
    totalDocs: 156,
    lastIndexed: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000),
    avgConfidence: 92,
  },
  "kb-2": {
    totalDocs: 89,
    lastIndexed: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000),
    avgConfidence: 88,
  },
  "kb-3": {
    totalDocs: 1243,
    lastIndexed: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000),
    avgConfidence: 76,
  },
  "kb-4": {
    totalDocs: 42,
    lastIndexed: new Date(Date.now() - 14 * 24 * 60 * 60 * 1000),
    avgConfidence: 95,
  },
  "kb-5": {
    totalDocs: 78,
    lastIndexed: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000),
    avgConfidence: 85,
  },
  "kb-6": {
    totalDocs: 567,
    lastIndexed: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000),
    avgConfidence: 72,
  },
  "kb-7": {
    totalDocs: 35,
    lastIndexed: new Date(Date.now() - 60 * 24 * 60 * 60 * 1000),
    avgConfidence: 90,
  },
};

export { knowledgeSources, sourceStatistics };
