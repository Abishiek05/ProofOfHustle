import { Link, useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/contexts/AuthContext";
import { useState } from "react";
import { Menu, X, LogOut, User, Zap } from "lucide-react";

export function Navbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [location] = useLocation();
  const { currentUser, userProfile, logout } = useAuth();

  const isActive = (path: string) => location === path;

  const canAccess = (role: string) => {
    if (!userProfile) return false;
    const roleHierarchy = { 'Rookie': 0, 'Premium': 1, 'Inner Circle': 2 };
    const userLevel = roleHierarchy[userProfile.role] || 0;
    const requiredLevel = roleHierarchy[role as keyof typeof roleHierarchy] || 0;
    return userLevel >= requiredLevel;
  };

  const getRoleBadge = (role: string) => {
    const badges = {
      'Rookie': { color: 'from-gray-500 to-gray-600', text: 'ROOKIE' },
      'Premium': { color: 'from-yellow-500 to-orange-600', text: 'PREMIUM' },
      'Inner Circle': { color: 'from-purple-500 to-pink-600', text: 'INNER CIRCLE' }
    };
    const badge = badges[role as keyof typeof badges] || badges['Rookie'];
    
    return (
      <div className={`px-2 py-1 rounded-md text-xs font-mono font-bold bg-gradient-to-r ${badge.color} text-white`}>
        {badge.text}
      </div>
    );
  };

  const handleLogout = async () => {
    try {
      await logout();
    } catch (error) {
      console.error('Logout failed:', error);
    }
  };

  return (
    <nav className="glass border-b border-white/10 relative z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <Link href="/">
                <h1 className="text-2xl font-heading cursor-pointer bg-gradient-to-r from-cyan-400 via-purple-500 to-pink-500 bg-clip-text text-transparent">
                  PROOF OF HUSTLE
                </h1>
              </Link>
            </div>
            {currentUser && (
              <div className="hidden md:block ml-10">
                <div className="flex items-baseline space-x-6">
                  <Link href="/dashboard">
                    <a className={`px-3 py-2 rounded-md text-sm font-medium transition-all hover-3d ${
                      isActive("/dashboard")
                        ? "text-cyan-400 bg-white/10"
                        : "text-gray-300 hover:text-white hover:bg-white/5"
                    }`}>
                      Dashboard
                    </a>
                  </Link>
                  <Link href="/projects">
                    <a className={`px-3 py-2 rounded-md text-sm font-medium transition-all ${
                      isActive("/projects")
                        ? "text-cyan-400 bg-white/10"
                        : "text-gray-300 hover:text-white hover:bg-white/5"
                    }`}>
                      Projects
                    </a>
                  </Link>
                  {canAccess("Premium") && (
                    <Link href="/submit">
                      <a className={`px-3 py-2 rounded-md text-sm font-medium transition-all ${
                        isActive("/submit")
                          ? "text-cyan-400 bg-white/10"
                          : "text-gray-300 hover:text-white hover:bg-white/5"
                      }`}>
                        Submit
                      </a>
                    </Link>
                  )}
                  <Link href="/upgrade">
                    <a className={`px-3 py-2 rounded-md text-sm font-medium transition-all flex items-center gap-1 ${
                      isActive("/upgrade")
                        ? "text-purple-400 bg-white/10"
                        : "text-gray-300 hover:text-purple-400 hover:bg-white/5"
                    }`}>
                      <Zap className="h-4 w-4" />
                      Upgrade
                    </a>
                  </Link>
                </div>
              </div>
            )}
          </div>

          <div className="flex items-center space-x-4">
            {userProfile && getRoleBadge(userProfile.role)}
            
            {currentUser ? (
              <div className="flex items-center space-x-3">
                <div className="h-8 w-8 rounded-full bg-gradient-to-br from-cyan-400 to-purple-600 flex items-center justify-center text-white text-sm font-bold">
                  {userProfile?.name.charAt(0).toUpperCase()}
                </div>
                <span className="hidden sm:block text-sm font-medium text-white">
                  {userProfile?.name}
                </span>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={handleLogout}
                  className="text-gray-400 hover:text-white"
                >
                  <LogOut className="h-4 w-4" />
                </Button>
              </div>
            ) : (
              <div className="flex space-x-2">
                <Link href="/login">
                  <Button variant="outline" size="sm" className="border-white/20 text-white hover:bg-white/5">
                    Login
                  </Button>
                </Link>
                <Link href="/signup">
                  <Button size="sm" className="btn-glow">
                    Join Now
                  </Button>
                </Link>
              </div>
            )}

            {/* Mobile menu button */}
            <div className="md:hidden">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setIsMenuOpen(!isMenuOpen)}
                className="text-white"
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
        {isMenuOpen && currentUser && (
          <div className="md:hidden border-t border-white/10">
            <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
              <Link href="/dashboard">
                <a className="block px-3 py-2 rounded-md text-base font-medium text-gray-300 hover:text-white hover:bg-white/5">
                  Dashboard
                </a>
              </Link>
              <Link href="/projects">
                <a className="block px-3 py-2 rounded-md text-base font-medium text-gray-300 hover:text-white hover:bg-white/5">
                  Projects
                </a>
              </Link>
              {canAccess("Premium") && (
                <Link href="/submit">
                  <a className="block px-3 py-2 rounded-md text-base font-medium text-gray-300 hover:text-white hover:bg-white/5">
                    Submit
                  </a>
                </Link>
              )}
              <Link href="/upgrade">
                <a className="block px-3 py-2 rounded-md text-base font-medium text-gray-300 hover:text-white hover:bg-white/5">
                  Upgrade
                </a>
              </Link>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
}
