import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { telegramBot } from "./telegram";
import { sendVerificationEmail } from "./email";
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

      // Create user with unverified email status
      const user = await storage.createUser({
        ...userData,
        emailVerified: false
      });
      
      // Send verification email
      const emailSent = await sendVerificationEmail(
        user.email, 
        `verify_${user.id}`, 
        user.name
      );
      
      if (!emailSent) {
        console.log(`Email sending failed, verification link: /verification-status?token=verify_${user.id}`);
      }
      
      res.json({ 
        message: "User created successfully. Please check your email for verification link.",
        user: { ...user, password: undefined } 
      });
    } catch (error) {
      res.status(500).json({ message: "Failed to create user" });
    }
  });

  app.post("/api/auth/verify-email", async (req, res) => {
    try {
      const { token } = req.body;
      
      // Extract user ID from token (simplified for demo)
      const userId = parseInt(token.replace('verify_', ''));
      
      const user = await storage.getUser(userId);
      if (!user) {
        return res.status(404).json({ message: "Invalid verification token" });
      }

      // Update user email verification status
      await storage.updateUserEmailVerification(userId, true);
      
      res.json({ message: "Email verified successfully" });
    } catch (error) {
      res.status(500).json({ message: "Email verification failed" });
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
      
      // Send enhanced Telegram notification with inline buttons
      const message = `
🔔 <b>New Application Received</b>

👤 <b>Name:</b> ${application.name}
📧 <b>Email:</b> ${application.email}
💬 <b>Telegram:</b> ${application.telegramId || 'Not provided'}

📝 <b>Experience:</b>
${application.experience}

🎯 <b>Current Focus:</b>
${application.currentFocus}

🚀 <b>Goals:</b>
${application.goals}

🛠 <b>Skills:</b> ${application.skills.join(', ')}

📅 <b>Applied:</b> ${new Date().toLocaleString()}
      `;
      
      await telegramBot.sendInlineKeyboard(message, application.id);
      
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

  // Telegram webhook for admin actions
  app.post("/api/telegram/webhook", async (req, res) => {
    try {
      const { callback_query, message } = req.body;
      
      if (callback_query) {
        const { data } = callback_query;
        const [action, applicationId] = data.split('_');
        
        if (action === 'approve' || action === 'reject') {
          const status = action === 'approve' ? 'approved' : 'rejected';
          const reviewedBy = callback_query.from.username || callback_query.from.first_name;
          
          const application = await storage.updateApplicationStatus(
            parseInt(applicationId),
            status,
            reviewedBy
          );
          
          if (application && status === 'approved') {
            // Create user account for approved application
            const userData = {
              name: application.name,
              email: application.email,
              password: "temppass123", // Should be replaced with secure password generation
              telegramId: application.telegramId,
              emailVerified: true
            };
            
            const user = await storage.createUser(userData);
            await storage.updateUserRole(user.id, "verified");
          }
          
          // Send confirmation message
          await telegramBot.sendMessage(
            `✅ Application ${status} successfully!\n\nApplicant: ${application?.name}\nEmail: ${application?.email}`
          );
        }
      }
      
      // Handle text commands
      if (message && message.text) {
        const text = message.text;
        if (text.startsWith('/approve_') || text.startsWith('/reject_')) {
          const [action, applicationId] = text.substring(1).split('_');
          const status = action === 'approve' ? 'approved' : 'rejected';
          const reviewedBy = message.from.username || message.from.first_name;
          
          const application = await storage.updateApplicationStatus(
            parseInt(applicationId),
            status,
            reviewedBy
          );
          
          if (application && status === 'approved') {
            const userData = {
              name: application.name,
              email: application.email,
              password: "temppass123",
              telegramId: application.telegramId,
              emailVerified: true
            };
            
            const user = await storage.createUser(userData);
            await storage.updateUserRole(user.id, "verified");
          }
          
          await telegramBot.sendMessage(
            `✅ Application ${status} successfully!\n\nApplicant: ${application?.name}\nEmail: ${application?.email}`
          );
        }
      }
      
      res.json({ ok: true });
    } catch (error) {
      console.error('Telegram webhook error:', error);
      res.status(500).json({ message: "Webhook processing failed" });
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
