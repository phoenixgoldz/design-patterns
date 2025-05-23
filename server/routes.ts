import type { Express } from "express";
import { createServer, type Server } from "http";
import multer from "multer";
import Papa from "papaparse";
import * as XLSX from "xlsx";
import { z } from "zod";
import { storage } from "./storage";
import { 
  insertDatasetSchema, 
  insertChatMessageSchema, 
  insertInsightSchema,
  insertReportSchema,
  insertTeamCollaborationSchema 
} from "@shared/schema";
import { generateInsights, chatWithAI } from "./openai";

// Configure multer for file uploads
const upload = multer({ 
  storage: multer.memoryStorage(),
  limits: { fileSize: 50 * 1024 * 1024 } // 50MB limit
});

export async function registerRoutes(app: Express): Promise<Server> {
  
  // Users routes
  app.get("/api/users", async (req, res) => {
    try {
      const users = await storage.getAllUsers();
      res.json(users);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch users" });
    }
  });

  app.get("/api/users/team", async (req, res) => {
    try {
      const teamMembers = await storage.getUsersByRole("team_member");
      res.json(teamMembers);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch team members" });
    }
  });

  app.put("/api/users/:id/status", async (req, res) => {
    try {
      const { id } = req.params;
      const { status, currentActivity } = req.body;
      
      const updatedUser = await storage.updateUser(parseInt(id), { 
        status, 
        currentActivity 
      });
      
      if (!updatedUser) {
        return res.status(404).json({ message: "User not found" });
      }
      
      res.json(updatedUser);
    } catch (error) {
      res.status(500).json({ message: "Failed to update user status" });
    }
  });

  // Datasets routes
  app.get("/api/datasets", async (req, res) => {
    try {
      const datasets = await storage.getAllDatasets();
      res.json(datasets);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch datasets" });
    }
  });

  app.post("/api/datasets/upload", upload.single("file"), async (req, res) => {
    try {
      if (!req.file) {
        return res.status(400).json({ message: "No file uploaded" });
      }

      const { name, description } = req.body;
      const file = req.file;
      let data: any[] = [];
      let columns: string[] = [];

      // Parse different file types
      if (file.mimetype === "text/csv" || file.originalname.endsWith('.csv')) {
        const csvContent = file.buffer.toString('utf8');
        const parsed = Papa.parse(csvContent, { header: true, skipEmptyLines: true });
        data = parsed.data;
        columns = parsed.meta.fields || [];
      } else if (file.mimetype === "application/json" || file.originalname.endsWith('.json')) {
        const jsonContent = file.buffer.toString('utf8');
        data = JSON.parse(jsonContent);
        if (data.length > 0) {
          columns = Object.keys(data[0]);
        }
      } else if (file.mimetype.includes("sheet") || file.originalname.endsWith('.xlsx')) {
        const workbook = XLSX.read(file.buffer, { type: 'buffer' });
        const sheetName = workbook.SheetNames[0];
        const sheet = workbook.Sheets[sheetName];
        data = XLSX.utils.sheet_to_json(sheet);
        if (data.length > 0) {
          columns = Object.keys(data[0]);
        }
      } else {
        return res.status(400).json({ message: "Unsupported file type" });
      }

      // Validate dataset data
      const datasetData = insertDatasetSchema.parse({
        name: name || file.originalname,
        description: description || "",
        fileName: file.originalname,
        fileSize: file.size,
        fileType: file.mimetype.includes("csv") ? "csv" : 
                 file.mimetype.includes("json") ? "json" : "xlsx",
        uploadedBy: 1, // Default admin user
        data,
        columns,
        rowCount: data.length
      });

      const dataset = await storage.createDataset(datasetData);
      res.json(dataset);
    } catch (error) {
      console.error("Upload error:", error);
      res.status(500).json({ message: "Failed to upload dataset" });
    }
  });

  app.get("/api/datasets/:id", async (req, res) => {
    try {
      const { id } = req.params;
      const dataset = await storage.getDataset(parseInt(id));
      
      if (!dataset) {
        return res.status(404).json({ message: "Dataset not found" });
      }
      
      res.json(dataset);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch dataset" });
    }
  });

  // Insights routes
  app.get("/api/insights", async (req, res) => {
    try {
      const insights = await storage.getAllInsights();
      res.json(insights);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch insights" });
    }
  });

  app.post("/api/insights/generate", async (req, res) => {
    try {
      const { datasetId, userId } = req.body;
      
      const dataset = await storage.getDataset(datasetId);
      if (!dataset) {
        return res.status(404).json({ message: "Dataset not found" });
      }

      const insights = await generateInsights(dataset);
      
      // Save insights to storage
      const savedInsights = [];
      for (const insight of insights) {
        const insightData = insertInsightSchema.parse({
          datasetId: dataset.id,
          title: insight.title,
          description: insight.description,
          content: insight.content,
          type: insight.type,
          confidence: insight.confidence,
          generatedBy: userId || 1
        });
        
        const savedInsight = await storage.createInsight(insightData);
        savedInsights.push(savedInsight);
      }
      
      res.json(savedInsights);
    } catch (error) {
      console.error("Insight generation error:", error);
      res.status(500).json({ message: "Failed to generate insights" });
    }
  });

  app.get("/api/insights/dataset/:datasetId", async (req, res) => {
    try {
      const { datasetId } = req.params;
      const insights = await storage.getInsightsByDataset(parseInt(datasetId));
      res.json(insights);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch insights" });
    }
  });

  // Chat routes
  app.get("/api/chat/messages", async (req, res) => {
    try {
      const { userId } = req.query;
      const messages = userId ? 
        await storage.getChatMessagesByUser(parseInt(userId as string)) :
        [];
      res.json(messages);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch chat messages" });
    }
  });

  app.post("/api/chat/message", async (req, res) => {
    try {
      const { message, userId, datasetId } = req.body;
      
      // Get dataset context if provided
      let dataset = null;
      if (datasetId) {
        dataset = await storage.getDataset(datasetId);
      }
      
      // Get AI response
      const aiResponse = await chatWithAI(message, dataset);
      
      // Save chat message
      const chatData = insertChatMessageSchema.parse({
        userId: userId || 1,
        message,
        response: aiResponse,
        datasetId: datasetId || null,
        type: "chat"
      });
      
      const savedMessage = await storage.createChatMessage(chatData);
      res.json(savedMessage);
    } catch (error) {
      console.error("Chat error:", error);
      res.status(500).json({ message: "Failed to process chat message" });
    }
  });

  // Reports routes
  app.get("/api/reports", async (req, res) => {
    try {
      const reports = await storage.getAllReports();
      res.json(reports);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch reports" });
    }
  });

  app.post("/api/reports", async (req, res) => {
    try {
      const reportData = insertReportSchema.parse(req.body);
      const report = await storage.createReport(reportData);
      res.json(report);
    } catch (error) {
      res.status(500).json({ message: "Failed to create report" });
    }
  });

  app.get("/api/reports/public", async (req, res) => {
    try {
      const reports = await storage.getPublicReports();
      res.json(reports);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch public reports" });
    }
  });

  // Collaboration routes
  app.post("/api/collaboration", async (req, res) => {
    try {
      const collaborationData = insertTeamCollaborationSchema.parse(req.body);
      const collaboration = await storage.createTeamCollaboration(collaborationData);
      res.json(collaboration);
    } catch (error) {
      res.status(500).json({ message: "Failed to save collaboration" });
    }
  });

  app.get("/api/collaboration/:itemType/:itemId", async (req, res) => {
    try {
      const { itemType, itemId } = req.params;
      const collaborations = await storage.getCollaborationsByItem(itemType, parseInt(itemId));
      res.json(collaborations);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch collaborations" });
    }
  });

  // Dashboard stats
  app.get("/api/dashboard/stats", async (req, res) => {
    try {
      const datasets = await storage.getAllDatasets();
      const insights = await storage.getAllInsights();
      const teamMembers = await storage.getUsersByRole("team_member");
      const reports = await storage.getAllReports();

      const stats = {
        activeDatasets: datasets.length,
        aiInsightsGenerated: insights.length,
        teamMembers: teamMembers.length,
        clientReports: reports.length
      };

      res.json(stats);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch dashboard stats" });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}
