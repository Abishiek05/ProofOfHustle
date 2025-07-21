import { User } from "@shared/schema";

export interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
}

// Simple auth store for demo purposes
class AuthStore {
  private user: User | null = null;
  private listeners: ((user: User | null) => void)[] = [];

  getUser(): User | null {
    return this.user;
  }

  setUser(user: User | null) {
    this.user = user;
    this.listeners.forEach(listener => listener(user));
  }

  subscribe(listener: (user: User | null) => void) {
    this.listeners.push(listener);
    return () => {
      const index = this.listeners.indexOf(listener);
      if (index > -1) {
        this.listeners.splice(index, 1);
      }
    };
  }

  isAuthenticated(): boolean {
    return this.user !== null;
  }

  hasRole(role: string): boolean {
    return this.user?.role === role;
  }

  canAccess(requiredRole: string): boolean {
    if (!this.user) return false;

    const roleHierarchy = {
      unverified: 0,
      verified: 1,
      premium: 2,
      inner: 3,
      admin: 4,
    };

    const userLevel = roleHierarchy[this.user.role as keyof typeof roleHierarchy] || 0;
    const requiredLevel = roleHierarchy[requiredRole as keyof typeof roleHierarchy] || 0;

    return userLevel >= requiredLevel;
  }
}

export const authStore = new AuthStore();