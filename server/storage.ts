import { users, applications, projects, payments, type User, type InsertUser, type Application, type InsertApplication, type Project, type InsertProject, type Payment, type InsertPayment } from "@shared/schema";

export interface IStorage {
  // User operations
  getUser(id: number): Promise<User | undefined>;
  getUserByEmail(email: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  updateUserRole(id: number, role: string, paymentExpiry?: Date): Promise<User | undefined>;
  
  // Application operations
  createApplication(application: InsertApplication): Promise<Application>;
  getApplications(): Promise<Application[]>;
  getApplicationById(id: number): Promise<Application | undefined>;
  updateApplicationStatus(id: number, status: string, reviewedBy: number): Promise<Application | undefined>;
  
  // Project operations
  createProject(project: InsertProject & { submittedBy: number }): Promise<Project>;
  getProjects(): Promise<Project[]>;
  getProjectsByRole(role: string): Promise<Project[]>;
  updateProjectStatus(id: number, status: string, approvedBy: number, category?: string): Promise<Project | undefined>;
  
  // Payment operations
  createPayment(payment: InsertPayment & { userId: number }): Promise<Payment>;
  getPaymentsByUser(userId: number): Promise<Payment[]>;
  updatePaymentStatus(id: number, status: string, razorpayId?: string): Promise<Payment | undefined>;
}

export class MemStorage implements IStorage {
  private users: Map<number, User>;
  private applications: Map<number, Application>;
  private projects: Map<number, Project>;
  private payments: Map<number, Payment>;
  private currentUserId: number;
  private currentApplicationId: number;
  private currentProjectId: number;
  private currentPaymentId: number;

  constructor() {
    this.users = new Map();
    this.applications = new Map();
    this.projects = new Map();
    this.payments = new Map();
    this.currentUserId = 1;
    this.currentApplicationId = 1;
    this.currentProjectId = 1;
    this.currentPaymentId = 1;

    // Create default admin user
    const adminUser: User = {
      id: this.currentUserId++,
      name: "Admin User",
      email: "admin@proofofhustle.com",
      password: "$2b$10$hashedpassword", // In real app, this would be properly hashed
      telegramId: null,
      role: "admin",
      paymentPlan: null,
      paymentExpiry: null,
      createdAt: new Date(),
    };
    this.users.set(adminUser.id, adminUser);
  }

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
      role: "unverified",
      paymentPlan: null,
      paymentExpiry: null,
      createdAt: new Date(),
    };
    this.users.set(id, user);
    return user;
  }

  async updateUserRole(id: number, role: string, paymentExpiry?: Date): Promise<User | undefined> {
    const user = this.users.get(id);
    if (!user) return undefined;
    
    const updatedUser: User = {
      ...user,
      role: role as any,
      paymentExpiry: paymentExpiry || null,
    };
    this.users.set(id, updatedUser);
    return updatedUser;
  }

  async createApplication(insertApplication: InsertApplication): Promise<Application> {
    const id = this.currentApplicationId++;
    const application: Application = {
      ...insertApplication,
      id,
      userId: null, // Will be set when user is created
      status: "pending",
      reviewedBy: null,
      createdAt: new Date(),
      reviewedAt: null,
    };
    this.applications.set(id, application);
    return application;
  }

  async getApplications(): Promise<Application[]> {
    return Array.from(this.applications.values()).sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());
  }

  async getApplicationById(id: number): Promise<Application | undefined> {
    return this.applications.get(id);
  }

  async updateApplicationStatus(id: number, status: string, reviewedBy: number): Promise<Application | undefined> {
    const application = this.applications.get(id);
    if (!application) return undefined;
    
    const updatedApplication: Application = {
      ...application,
      status: status as any,
      reviewedBy,
      reviewedAt: new Date(),
    };
    this.applications.set(id, updatedApplication);
    return updatedApplication;
  }

  async createProject(project: InsertProject & { submittedBy: number }): Promise<Project> {
    const id = this.currentProjectId++;
    const newProject: Project = {
      ...project,
      id,
      category: "rookie",
      approvedBy: null,
      visibleTo: ["verified"],
      status: "pending",
      createdAt: new Date(),
      approvedAt: null,
    };
    this.projects.set(id, newProject);
    return newProject;
  }

  async getProjects(): Promise<Project[]> {
    return Array.from(this.projects.values()).sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());
  }

  async getProjectsByRole(role: string): Promise<Project[]> {
    const allProjects = await this.getProjects();
    return allProjects.filter(project => {
      if (role === "admin") return true;
      if (role === "inner") return project.status === "approved";
      if (role === "premium") return project.status === "approved" && project.category !== "godtier";
      if (role === "verified") return project.status === "approved" && project.category === "rookie";
      return [];
    });
  }

  async updateProjectStatus(id: number, status: string, approvedBy: number, category?: string): Promise<Project | undefined> {
    const project = this.projects.get(id);
    if (!project) return undefined;
    
    const updatedProject: Project = {
      ...project,
      status: status as any,
      approvedBy,
      category: (category as any) || project.category,
      approvedAt: status === "approved" ? new Date() : null,
      visibleTo: status === "approved" ? this.getVisibilityByCategory(category || project.category) : project.visibleTo,
    };
    this.projects.set(id, updatedProject);
    return updatedProject;
  }

  private getVisibilityByCategory(category: string): string[] {
    switch (category) {
      case "godtier": return ["inner"];
      case "mvp": return ["premium", "inner"];
      case "rookie": return ["verified", "premium", "inner"];
      default: return ["verified"];
    }
  }

  async createPayment(payment: InsertPayment & { userId: number }): Promise<Payment> {
    const id = this.currentPaymentId++;
    const expiresAt = new Date();
    expiresAt.setMonth(expiresAt.getMonth() + payment.duration);
    
    const newPayment: Payment = {
      ...payment,
      id,
      razorpayId: null,
      expiresAt,
      status: "pending",
      createdAt: new Date(),
    };
    this.payments.set(id, newPayment);
    return newPayment;
  }

  async getPaymentsByUser(userId: number): Promise<Payment[]> {
    return Array.from(this.payments.values()).filter(payment => payment.userId === userId);
  }

  async updatePaymentStatus(id: number, status: string, razorpayId?: string): Promise<Payment | undefined> {
    const payment = this.payments.get(id);
    if (!payment) return undefined;
    
    const updatedPayment: Payment = {
      ...payment,
      status: status as any,
      razorpayId: razorpayId || payment.razorpayId,
    };
    this.payments.set(id, updatedPayment);
    return updatedPayment;
  }
}

export const storage = new MemStorage();
