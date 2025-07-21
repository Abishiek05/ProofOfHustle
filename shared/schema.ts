import { pgTable, text, serial, integer, boolean, timestamp, json } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  email: text("email").notNull().unique(),
  password: text("password").notNull(),
  telegramId: text("telegram_id"),
  emailVerified: boolean("email_verified").notNull().default(false),
  role: text("role", { enum: ["unverified", "verified", "premium", "inner", "admin"] }).notNull().default("unverified"),
  paymentPlan: text("payment_plan"),
  paymentExpiry: timestamp("payment_expiry"),
  createdAt: timestamp("created_at").notNull().defaultNow(),
});

export const applications = pgTable("applications", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").references(() => users.id),
  name: text("name").notNull(),
  email: text("email").notNull(),
  telegramId: text("telegram_id"),
  experience: text("experience").notNull(),
  currentFocus: text("current_focus").notNull(),
  goals: text("goals").notNull(),
  skills: json("skills").$type<string[]>().notNull(),
  status: text("status", { enum: ["pending", "approved", "rejected"] }).notNull().default("pending"),
  reviewedBy: integer("reviewed_by").references(() => users.id),
  createdAt: timestamp("created_at").notNull().defaultNow(),
  reviewedAt: timestamp("reviewed_at"),
});

export const projects = pgTable("projects", {
  id: serial("id").primaryKey(),
  title: text("title").notNull(),
  description: text("description").notNull(),
  category: text("category", { enum: ["rookie", "mvp", "godtier"] }).notNull(),
  techStack: text("tech_stack"),
  metrics: text("metrics"),
  submittedBy: integer("submitted_by").references(() => users.id).notNull(),
  approvedBy: integer("approved_by").references(() => users.id),
  visibleTo: json("visible_to").$type<string[]>().notNull().default(["verified"]),
  status: text("status", { enum: ["pending", "approved", "rejected"] }).notNull().default("pending"),
  createdAt: timestamp("created_at").notNull().defaultNow(),
  approvedAt: timestamp("approved_at"),
});

export const payments = pgTable("payments", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").references(() => users.id).notNull(),
  razorpayId: text("razorpay_id"),
  amount: integer("amount").notNull(),
  planType: text("plan_type", { enum: ["premium", "inner"] }).notNull(),
  duration: integer("duration").notNull(), // in months
  expiresAt: timestamp("expires_at").notNull(),
  status: text("status", { enum: ["pending", "success", "failed"] }).notNull().default("pending"),
  createdAt: timestamp("created_at").notNull().defaultNow(),
});

export const insertUserSchema = createInsertSchema(users).pick({
  name: true,
  email: true,
  password: true,
  telegramId: true,
});

export const insertApplicationSchema = createInsertSchema(applications).pick({
  name: true,
  email: true,
  telegramId: true,
  experience: true,
  currentFocus: true,
  goals: true,
  skills: true,
});

export const insertProjectSchema = createInsertSchema(projects).pick({
  title: true,
  description: true,
  techStack: true,
  metrics: true,
});

export const insertPaymentSchema = createInsertSchema(payments).pick({
  amount: true,
  planType: true,
  duration: true,
});

export type User = typeof users.$inferSelect;
export type InsertUser = z.infer<typeof insertUserSchema>;
export type Application = typeof applications.$inferSelect;
export type InsertApplication = z.infer<typeof insertApplicationSchema>;
export type Project = typeof projects.$inferSelect;
export type InsertProject = z.infer<typeof insertProjectSchema>;
export type Payment = typeof payments.$inferSelect;
export type InsertPayment = z.infer<typeof insertPaymentSchema>;
