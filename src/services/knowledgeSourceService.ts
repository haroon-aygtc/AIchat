// Knowledge Source Service
// Manages available knowledge sources and their selection state

export interface KnowledgeSource {
  id: string;
  name: string;
  type: "internal" | "database" | "external" | "knowledge_base";
  description: string;
  isActive: boolean;
  lastUpdated: Date;
  documentCount?: number;
  icon?: string;
}

class KnowledgeSourceService {
  private sources: KnowledgeSource[] = [
    {
      id: "internal-docs",
      name: "Internal Documentation",
      type: "internal",
      description: "Company documentation, guides, and policies",
      isActive: true,
      lastUpdated: new Date("2023-10-15"),
      documentCount: 156,
      icon: "FileText",
    },
    {
      id: "product-db",
      name: "Product Database",
      type: "database",
      description: "Product specifications, pricing, and availability",
      isActive: true,
      lastUpdated: new Date("2023-11-02"),
      documentCount: 1240,
      icon: "Database",
    },
    {
      id: "support-kb",
      name: "Support Knowledge Base",
      type: "knowledge_base",
      description: "Customer support articles and troubleshooting guides",
      isActive: true,
      lastUpdated: new Date("2023-10-28"),
      documentCount: 342,
      icon: "HelpCircle",
    },
    {
      id: "api-docs",
      name: "API Documentation",
      type: "external",
      description: "External API documentation and integration guides",
      isActive: false,
      lastUpdated: new Date("2023-09-20"),
      documentCount: 87,
      icon: "Code",
    },
    {
      id: "customer-faqs",
      name: "Customer FAQs",
      type: "knowledge_base",
      description: "Frequently asked questions from customers",
      isActive: true,
      lastUpdated: new Date("2023-10-10"),
      documentCount: 215,
      icon: "MessageSquare",
    },
    {
      id: "marketing-materials",
      name: "Marketing Materials",
      type: "internal",
      description: "Brochures, presentations, and marketing content",
      isActive: false,
      lastUpdated: new Date("2023-08-15"),
      documentCount: 78,
      icon: "Presentation",
    },
  ];

  getSources(): KnowledgeSource[] {
    return this.sources;
  }

  getSourceById(id: string): KnowledgeSource | undefined {
    return this.sources.find((source) => source.id === id);
  }

  updateSourceStatus(id: string, isActive: boolean): void {
    this.sources = this.sources.map((source) =>
      source.id === id ? { ...source, isActive } : source,
    );
  }

  getActiveSources(): KnowledgeSource[] {
    return this.sources.filter((source) => source.isActive);
  }

  addSource(
    source: Omit<KnowledgeSource, "id" | "lastUpdated">,
  ): KnowledgeSource {
    const newSource: KnowledgeSource = {
      ...source,
      id: `source-${Date.now()}`,
      lastUpdated: new Date(),
    };

    this.sources.push(newSource);
    return newSource;
  }

  deleteSource(id: string): void {
    this.sources = this.sources.filter((source) => source.id !== id);
  }

  // For demo purposes - simulate fetching source statistics
  getSourceStatistics(id: string): {
    totalDocs: number;
    lastIndexed: Date;
    avgConfidence: number;
  } {
    // In a real implementation, this would fetch actual statistics
    return {
      totalDocs: Math.floor(Math.random() * 1000) + 50,
      lastIndexed: new Date(
        Date.now() - Math.floor(Math.random() * 7 * 24 * 60 * 60 * 1000),
      ),
      avgConfidence: Math.floor(Math.random() * 30) + 70,
    };
  }
}

export default new KnowledgeSourceService();
