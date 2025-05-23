import { 
  users, datasets, insights, reports, chatMessages, teamCollaboration,
  type User, type InsertUser,
  type Dataset, type InsertDataset,
  type Insight, type InsertInsight,
  type Report, type InsertReport,
  type ChatMessage, type InsertChatMessage,
  type TeamCollaboration, type InsertTeamCollaboration
} from "@shared/schema";

export interface IStorage {
  // Users
  getUser(id: number): Promise<User | undefined>;
  getUserByEmail(email: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  updateUser(id: number, updates: Partial<InsertUser>): Promise<User | undefined>;
  getAllUsers(): Promise<User[]>;
  getUsersByRole(role: string): Promise<User[]>;

  // Datasets
  getDataset(id: number): Promise<Dataset | undefined>;
  createDataset(dataset: InsertDataset): Promise<Dataset>;
  getDatasetsByUser(userId: number): Promise<Dataset[]>;
  getAllDatasets(): Promise<Dataset[]>;
  deleteDataset(id: number): Promise<boolean>;

  // Insights
  getInsight(id: number): Promise<Insight | undefined>;
  createInsight(insight: InsertInsight): Promise<Insight>;
  getInsightsByDataset(datasetId: number): Promise<Insight[]>;
  getInsightsByUser(userId: number): Promise<Insight[]>;
  getAllInsights(): Promise<Insight[]>;

  // Reports
  getReport(id: number): Promise<Report | undefined>;
  createReport(report: InsertReport): Promise<Report>;
  getReportsByUser(userId: number): Promise<Report[]>;
  getAllReports(): Promise<Report[]>;
  getPublicReports(): Promise<Report[]>;
  updateReport(id: number, updates: Partial<InsertReport>): Promise<Report | undefined>;

  // Chat Messages
  getChatMessage(id: number): Promise<ChatMessage | undefined>;
  createChatMessage(message: InsertChatMessage): Promise<ChatMessage>;
  getChatMessagesByUser(userId: number): Promise<ChatMessage[]>;
  getChatMessagesByDataset(datasetId: number): Promise<ChatMessage[]>;

  // Team Collaboration
  createTeamCollaboration(collaboration: InsertTeamCollaboration): Promise<TeamCollaboration>;
  getCollaborationsByItem(itemType: string, itemId: number): Promise<TeamCollaboration[]>;
  getCollaborationsByUser(userId: number): Promise<TeamCollaboration[]>;
}

export class MemStorage implements IStorage {
  private users: Map<number, User> = new Map();
  private datasets: Map<number, Dataset> = new Map();
  private insights: Map<number, Insight> = new Map();
  private reports: Map<number, Report> = new Map();
  private chatMessages: Map<number, ChatMessage> = new Map();
  private teamCollaborations: Map<number, TeamCollaboration> = new Map();
  
  private currentUserId = 1;
  private currentDatasetId = 1;
  private currentInsightId = 1;
  private currentReportId = 1;
  private currentChatId = 1;
  private currentCollaborationId = 1;

  constructor() {
    // Create a default admin user
    this.createUser({
      username: "admin",
      email: "admin@datasyncpro.com",
      password: "admin123",
      role: "admin",
      firstName: "Sarah",
      lastName: "Chen",
      avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-1.2.1&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80",
      status: "online",
      currentActivity: "Managing dashboard"
    });
  }

  // Users
  async getUser(id: number): Promise<User | undefined> {
    return this.users.get(id);
  }

  async getUserByEmail(email: string): Promise<User | undefined> {
    return Array.from(this.users.values()).find(user => user.email === email);
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const id = this.currentUserId++;
    const user: User = { 
      ...insertUser, 
      id, 
      createdAt: new Date()
    };
    this.users.set(id, user);
    return user;
  }

  async updateUser(id: number, updates: Partial<InsertUser>): Promise<User | undefined> {
    const user = this.users.get(id);
    if (!user) return undefined;
    
    const updatedUser = { ...user, ...updates };
    this.users.set(id, updatedUser);
    return updatedUser;
  }

  async getAllUsers(): Promise<User[]> {
    return Array.from(this.users.values());
  }

  async getUsersByRole(role: string): Promise<User[]> {
    return Array.from(this.users.values()).filter(user => user.role === role);
  }

  // Datasets
  async getDataset(id: number): Promise<Dataset | undefined> {
    return this.datasets.get(id);
  }

  async createDataset(insertDataset: InsertDataset): Promise<Dataset> {
    const id = this.currentDatasetId++;
    const dataset: Dataset = { 
      ...insertDataset, 
      id, 
      createdAt: new Date()
    };
    this.datasets.set(id, dataset);
    return dataset;
  }

  async getDatasetsByUser(userId: number): Promise<Dataset[]> {
    return Array.from(this.datasets.values()).filter(dataset => dataset.uploadedBy === userId);
  }

  async getAllDatasets(): Promise<Dataset[]> {
    return Array.from(this.datasets.values());
  }

  async deleteDataset(id: number): Promise<boolean> {
    return this.datasets.delete(id);
  }

  // Insights
  async getInsight(id: number): Promise<Insight | undefined> {
    return this.insights.get(id);
  }

  async createInsight(insertInsight: InsertInsight): Promise<Insight> {
    const id = this.currentInsightId++;
    const insight: Insight = { 
      ...insertInsight, 
      id, 
      createdAt: new Date()
    };
    this.insights.set(id, insight);
    return insight;
  }

  async getInsightsByDataset(datasetId: number): Promise<Insight[]> {
    return Array.from(this.insights.values()).filter(insight => insight.datasetId === datasetId);
  }

  async getInsightsByUser(userId: number): Promise<Insight[]> {
    return Array.from(this.insights.values()).filter(insight => insight.generatedBy === userId);
  }

  async getAllInsights(): Promise<Insight[]> {
    return Array.from(this.insights.values());
  }

  // Reports
  async getReport(id: number): Promise<Report | undefined> {
    return this.reports.get(id);
  }

  async createReport(insertReport: InsertReport): Promise<Report> {
    const id = this.currentReportId++;
    const report: Report = { 
      ...insertReport, 
      id, 
      createdAt: new Date()
    };
    this.reports.set(id, report);
    return report;
  }

  async getReportsByUser(userId: number): Promise<Report[]> {
    return Array.from(this.reports.values()).filter(report => report.createdBy === userId);
  }

  async getAllReports(): Promise<Report[]> {
    return Array.from(this.reports.values());
  }

  async getPublicReports(): Promise<Report[]> {
    return Array.from(this.reports.values()).filter(report => report.isPublic);
  }

  async updateReport(id: number, updates: Partial<InsertReport>): Promise<Report | undefined> {
    const report = this.reports.get(id);
    if (!report) return undefined;
    
    const updatedReport = { ...report, ...updates };
    this.reports.set(id, updatedReport);
    return updatedReport;
  }

  // Chat Messages
  async getChatMessage(id: number): Promise<ChatMessage | undefined> {
    return this.chatMessages.get(id);
  }

  async createChatMessage(insertMessage: InsertChatMessage): Promise<ChatMessage> {
    const id = this.currentChatId++;
    const message: ChatMessage = { 
      ...insertMessage, 
      id, 
      createdAt: new Date()
    };
    this.chatMessages.set(id, message);
    return message;
  }

  async getChatMessagesByUser(userId: number): Promise<ChatMessage[]> {
    return Array.from(this.chatMessages.values()).filter(message => message.userId === userId);
  }

  async getChatMessagesByDataset(datasetId: number): Promise<ChatMessage[]> {
    return Array.from(this.chatMessages.values()).filter(message => message.datasetId === datasetId);
  }

  // Team Collaboration
  async createTeamCollaboration(insertCollaboration: InsertTeamCollaboration): Promise<TeamCollaboration> {
    const id = this.currentCollaborationId++;
    const collaboration: TeamCollaboration = { 
      ...insertCollaboration, 
      id, 
      createdAt: new Date()
    };
    this.teamCollaborations.set(id, collaboration);
    return collaboration;
  }

  async getCollaborationsByItem(itemType: string, itemId: number): Promise<TeamCollaboration[]> {
    return Array.from(this.teamCollaborations.values()).filter(
      collab => collab.itemType === itemType && collab.itemId === itemId
    );
  }

  async getCollaborationsByUser(userId: number): Promise<TeamCollaboration[]> {
    return Array.from(this.teamCollaborations.values()).filter(collab => collab.userId === userId);
  }
}

export const storage = new MemStorage();
