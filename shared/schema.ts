import { pgTable, text, serial, integer, boolean, timestamp, jsonb } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  username: text("username").notNull().unique(),
  email: text("email").notNull().unique(),
  password: text("password").notNull(),
  role: text("role").notNull().default("team_member"), // "admin", "team_member", "client"
  firstName: text("first_name").notNull(),
  lastName: text("last_name").notNull(),
  avatar: text("avatar"),
  status: text("status").default("offline"), // "online", "offline", "away"
  currentActivity: text("current_activity"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const datasets = pgTable("datasets", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  description: text("description"),
  fileName: text("file_name").notNull(),
  fileSize: integer("file_size").notNull(),
  fileType: text("file_type").notNull(), // "csv", "json", "xlsx"
  uploadedBy: integer("uploaded_by").references(() => users.id).notNull(),
  data: jsonb("data").notNull(),
  columns: text("columns").array().notNull(),
  rowCount: integer("row_count").notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const insights = pgTable("insights", {
  id: serial("id").primaryKey(),
  datasetId: integer("dataset_id").references(() => datasets.id).notNull(),
  title: text("title").notNull(),
  description: text("description").notNull(),
  content: text("content").notNull(),
  type: text("type").notNull(), // "trend", "anomaly", "recommendation", "summary"
  confidence: integer("confidence").notNull(), // 1-100
  generatedBy: integer("generated_by").references(() => users.id).notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const reports = pgTable("reports", {
  id: serial("id").primaryKey(),
  title: text("title").notNull(),
  description: text("description"),
  content: text("content").notNull(),
  datasetIds: integer("dataset_ids").array().notNull(),
  insightIds: integer("insight_ids").array().notNull(),
  chartConfigs: jsonb("chart_configs").notNull(),
  createdBy: integer("created_by").references(() => users.id).notNull(),
  sharedWith: text("shared_with").array().default([]), // user emails or "all_clients"
  isPublic: boolean("is_public").default(false),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const chatMessages = pgTable("chat_messages", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").references(() => users.id).notNull(),
  message: text("message").notNull(),
  response: text("response"),
  datasetId: integer("dataset_id").references(() => datasets.id),
  type: text("type").notNull().default("chat"), // "chat", "query", "insight_request"
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const teamCollaboration = pgTable("team_collaboration", {
  id: serial("id").primaryKey(),
  itemType: text("item_type").notNull(), // "dataset", "report", "insight"
  itemId: integer("item_id").notNull(),
  userId: integer("user_id").references(() => users.id).notNull(),
  action: text("action").notNull(), // "comment", "edit", "share", "like"
  content: text("content"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

// Insert schemas
export const insertUserSchema = createInsertSchema(users).omit({
  id: true,
  createdAt: true,
});

export const insertDatasetSchema = createInsertSchema(datasets).omit({
  id: true,
  createdAt: true,
});

export const insertInsightSchema = createInsertSchema(insights).omit({
  id: true,
  createdAt: true,
});

export const insertReportSchema = createInsertSchema(reports).omit({
  id: true,
  createdAt: true,
});

export const insertChatMessageSchema = createInsertSchema(chatMessages).omit({
  id: true,
  createdAt: true,
});

export const insertTeamCollaborationSchema = createInsertSchema(teamCollaboration).omit({
  id: true,
  createdAt: true,
});

// Types
export type InsertUser = z.infer<typeof insertUserSchema>;
export type User = typeof users.$inferSelect;

export type InsertDataset = z.infer<typeof insertDatasetSchema>;
export type Dataset = typeof datasets.$inferSelect;

export type InsertInsight = z.infer<typeof insertInsightSchema>;
export type Insight = typeof insights.$inferSelect;

export type InsertReport = z.infer<typeof insertReportSchema>;
export type Report = typeof reports.$inferSelect;

export type InsertChatMessage = z.infer<typeof insertChatMessageSchema>;
export type ChatMessage = typeof chatMessages.$inferSelect;

export type InsertTeamCollaboration = z.infer<typeof insertTeamCollaborationSchema>;
export type TeamCollaboration = typeof teamCollaboration.$inferSelect;
