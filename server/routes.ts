import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { telegramBot } from "./telegram";
import { insertApplicationSchema, insertProjectSchema, insertPaymentSchema } from "@shared/schema";

export async function registerRoutes(app: Express): Promise<Server> {
  // Authentication routes
  app.post("/api/auth/register", async (req, res) => {
    try {
      const userData = req.body;
      
      // Check if user already exists
      const existingUser = await storage.getUserByEmail(userData.email);
      if (existingUser) {
        return res.status(400).json({ message: "User already exists" });
      }

      // Create user
      const user = await storage.createUser(userData);
      res.json({ user: { ...user, password: undefined } });
    } catch (error) {
      res.status(500).json({ message: "Failed to create user" });
    }
  });

  app.post("/api/auth/login", async (req, res) => {
    try {
      const { email, password } = req.body;
      const user = await storage.getUserByEmail(email);
      
      if (!user || user.password !== password) {
        return res.status(401).json({ message: "Invalid credentials" });
      }

      res.json({ user: { ...user, password: undefined } });
    } catch (error) {
      res.status(500).json({ message: "Login failed" });
    }
  });

  // Application routes
  app.post("/api/applications", async (req, res) => {
    try {
      const validatedData = insertApplicationSchema.parse(req.body);
      const application = await storage.createApplication(validatedData);
      
      // Send Telegram notification to admin
      await telegramBot.notifyNewApplication(application);
      
      res.json(application);
    } catch (error) {
      res.status(400).json({ message: "Invalid application data" });
    }
  });

  app.get("/api/applications", async (req, res) => {
    try {
      const applications = await storage.getApplications();
      res.json(applications);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch applications" });
    }
  });

  app.patch("/api/applications/:id/review", async (req, res) => {
    try {
      const { id } = req.params;
      const { status, reviewedBy } = req.body;
      
      const application = await storage.updateApplicationStatus(
        parseInt(id),
        status,
        reviewedBy
      );
      
      if (!application) {
        return res.status(404).json({ message: "Application not found" });
      }

      // If approved, create user account
      if (status === "approved") {
        const userData = {
          name: application.name,
          email: application.email,
          password: "temppassword", // In real app, send password reset email
          telegramId: application.telegramId,
        };
        
        const user = await storage.createUser(userData);
        await storage.updateUserRole(user.id, "verified");
      }

      res.json(application);
    } catch (error) {
      res.status(500).json({ message: "Failed to review application" });
    }
  });

  // Project routes
  app.post("/api/projects", async (req, res) => {
    try {
      const validatedData = insertProjectSchema.parse(req.body);
      const { submittedBy } = req.body;
      
      const project = await storage.createProject({
        ...validatedData,
        submittedBy,
      });
      
      // Get submitter info and send Telegram notification
      const submitter = await storage.getUser(submittedBy);
      if (submitter) {
        await telegramBot.notifyNewProject(project, submitter.name);
      }
      
      res.json(project);
    } catch (error) {
      res.status(400).json({ message: "Invalid project data" });
    }
  });

  app.get("/api/projects", async (req, res) => {
    try {
      const { role } = req.query;
      let projects;
      
      if (role) {
        projects = await storage.getProjectsByRole(role as string);
      } else {
        projects = await storage.getProjects();
      }
      
      res.json(projects);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch projects" });
    }
  });

  app.patch("/api/projects/:id/review", async (req, res) => {
    try {
      const { id } = req.params;
      const { status, approvedBy, category } = req.body;
      
      const project = await storage.updateProjectStatus(
        parseInt(id),
        status,
        approvedBy,
        category
      );
      
      if (!project) {
        return res.status(404).json({ message: "Project not found" });
      }

      res.json(project);
    } catch (error) {
      res.status(500).json({ message: "Failed to review project" });
    }
  });

  // Payment routes
  app.post("/api/payments", async (req, res) => {
    try {
      const validatedData = insertPaymentSchema.parse(req.body);
      const { userId } = req.body;
      
      const payment = await storage.createPayment({
        ...validatedData,
        userId,
      });
      res.json(payment);
    } catch (error) {
      res.status(400).json({ message: "Invalid payment data" });
    }
  });

  app.patch("/api/payments/:id/verify", async (req, res) => {
    try {
      const { id } = req.params;
      const { razorpayId } = req.body;
      
      const payment = await storage.updatePaymentStatus(
        parseInt(id),
        "success",
        razorpayId
      );
      
      if (!payment) {
        return res.status(404).json({ message: "Payment not found" });
      }

      // Update user role based on payment
      await storage.updateUserRole(
        payment.userId,
        payment.planType,
        payment.expiresAt
      );

      res.json(payment);
    } catch (error) {
      res.status(500).json({ message: "Failed to verify payment" });
    }
  });

  // User routes
  app.get("/api/users/:id", async (req, res) => {
    try {
      const { id } = req.params;
      const user = await storage.getUser(parseInt(id));
      
      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }

      res.json({ ...user, password: undefined });
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch user" });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}
