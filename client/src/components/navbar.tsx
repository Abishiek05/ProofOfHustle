import { Link, useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { RoleBadge } from "./role-badge";
import { authStore } from "@/lib/auth";
import { useState, useEffect } from "react";
import { User } from "@shared/schema";
import { Menu, X } from "lucide-react";

export function Navbar() {
  const [user, setUser] = useState<User | null>(authStore.getUser());
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [location] = useLocation();

  useEffect(() => {
    const unsubscribe = authStore.subscribe(setUser);
    return unsubscribe;
  }, []);

  const isActive = (path: string) => location === path;

  const canAccess = (role: string) => authStore.canAccess(role);

  return (
    <nav className="bg-white shadow-sm border-b border-gray-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <Link href="/">
                <h1 className="text-2xl font-bold text-gray-900 cursor-pointer">
                  Proof of Hustle
                </h1>
              </Link>
            </div>
            <div className="hidden md:block ml-10">
              <div className="flex items-baseline space-x-4">
                <Link href="/dashboard">
                  <a className={`px-3 py-2 rounded-md text-sm font-medium ${
                    isActive("/dashboard")
                      ? "text-gray-900 bg-gray-100"
                      : "text-gray-500 hover:bg-gray-100"
                  }`}>
                    Dashboard
                  </a>
                </Link>
                <Link href="/projects">
                  <a className={`px-3 py-2 rounded-md text-sm font-medium ${
                    isActive("/projects")
                      ? "text-gray-900 bg-gray-100"
                      : "text-gray-500 hover:bg-gray-100"
                  }`}>
                    Projects
                  </a>
                </Link>
                {canAccess("premium") && (
                  <Link href="/submit">
                    <a className={`px-3 py-2 rounded-md text-sm font-medium ${
                      isActive("/submit")
                        ? "text-gray-900 bg-gray-100"
                        : "text-gray-500 hover:bg-gray-100"
                    }`}>
                      Submit
                    </a>
                  </Link>
                )}
                {canAccess("admin") && (
                  <Link href="/admin">
                    <a className={`px-3 py-2 rounded-md text-sm font-medium ${
                      isActive("/admin")
                        ? "text-gray-900 bg-gray-100"
                        : "text-gray-500 hover:bg-gray-100"
                    }`}>
                      Admin
                    </a>
                  </Link>
                )}
              </div>
            </div>
          </div>

          <div className="flex items-center space-x-4">
            {user && <RoleBadge role={user.role} />}
            
            {user ? (
              <div className="flex items-center space-x-3">
                <div className="h-8 w-8 rounded-full bg-blue-500 flex items-center justify-center text-white text-sm font-medium">
                  {user.name.charAt(0).toUpperCase()}
                </div>
                <span className="hidden sm:block text-sm font-medium text-gray-700">
                  {user.name}
                </span>
              </div>
            ) : (
              <div className="flex space-x-2">
                <Link href="/apply">
                  <Button variant="outline" size="sm">
                    Apply
                  </Button>
                </Link>
                <Button size="sm">Login</Button>
              </div>
            )}

            {/* Mobile menu button */}
            <div className="md:hidden">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setIsMenuOpen(!isMenuOpen)}
              >
                {isMenuOpen ? (
                  <X className="h-6 w-6" />
                ) : (
                  <Menu className="h-6 w-6" />
                )}
              </Button>
            </div>
          </div>
        </div>

        {/* Mobile menu */}
        {isMenuOpen && (
          <div className="md:hidden">
            <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3 border-t border-gray-200">
              <Link href="/dashboard">
                <a className="block px-3 py-2 rounded-md text-base font-medium text-gray-500 hover:bg-gray-100">
                  Dashboard
                </a>
              </Link>
              <Link href="/projects">
                <a className="block px-3 py-2 rounded-md text-base font-medium text-gray-500 hover:bg-gray-100">
                  Projects
                </a>
              </Link>
              {canAccess("premium") && (
                <Link href="/submit">
                  <a className="block px-3 py-2 rounded-md text-base font-medium text-gray-500 hover:bg-gray-100">
                    Submit
                  </a>
                </Link>
              )}
              {canAccess("admin") && (
                <Link href="/admin">
                  <a className="block px-3 py-2 rounded-md text-base font-medium text-gray-500 hover:bg-gray-100">
                    Admin
                  </a>
                </Link>
              )}
            </div>
          </div>
        )}
      </div>
    </nav>
  );
}
