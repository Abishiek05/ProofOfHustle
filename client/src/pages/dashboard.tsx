import { useState, useEffect } from "react";
import { Link } from "wouter";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { RoleBadge } from "@/components/role-badge";
import { authStore } from "@/lib/auth";
import { User } from "@shared/schema";
import { 
  FolderOpen, 
  PlusCircle, 
  ArrowUp, 
  MessageCircle,
  Clock,
  CheckCircle,
  TrendingUp,
  Users
} from "lucide-react";

export default function Dashboard() {
  const [user, setUser] = useState<User | null>(authStore.getUser());

  useEffect(() => {
    const unsubscribe = authStore.subscribe(setUser);
    return unsubscribe;
  }, []);

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Card className="w-full max-w-md">
          <CardContent className="pt-6">
            <div className="text-center">
              <h2 className="text-xl font-semibold mb-2">Access Denied</h2>
              <p className="text-gray-600 mb-4">Please log in to access your dashboard.</p>
              <Link href="/apply">
                <Button>Apply to Join</Button>
              </Link>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  const getDashboardMessage = () => {
    switch (user.role) {
      case "unverified":
        return "Your application is being reviewed. We'll notify you once it's processed.";
      case "verified":
        return "Welcome! You can now view project titles. Upgrade to Premium to submit projects.";
      case "premium":
        return "You can submit projects and view detailed previews. Upgrade to Inner Circle for full access.";
      case "inner":
        return "You have full access to all projects and exclusive content.";
      case "admin":
        return "Admin dashboard with full platform management access.";
      default:
        return "Welcome to Proof of Hustle!";
    }
  };

  const getQuickActions = () => {
    const actions = [];

    // Always show projects
    actions.push({
      icon: FolderOpen,
      title: "View Projects",
      description: "Browse available projects",
      href: "/projects",
      color: "text-blue-500",
    });

    // Show submit for Premium+ users
    if (authStore.canAccess("premium")) {
      actions.push({
        icon: PlusCircle,
        title: "Submit Project",
        description: "Share your work",
        href: "/submit",
        color: "text-green-500",
      });
    }

    // Always show upgrade (unless admin)
    if (user.role !== "admin" && user.role !== "inner") {
      actions.push({
        icon: ArrowUp,
        title: "Upgrade",
        description: "Unlock more features",
        href: "/upgrade",
        color: "text-purple-500",
      });
    }

    // Telegram link
    actions.push({
      icon: MessageCircle,
      title: "Telegram",
      description: "Join community chat",
      href: "#",
      color: "text-blue-500",
    });

    return actions;
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
        <div className="mb-8">
          <h2 className="text-2xl font-bold text-gray-900">Dashboard</h2>
          <p className="mt-1 text-sm text-gray-600">
            Welcome back, {user.name}
          </p>
        </div>

        {/* User Status Card */}
        <Card className="mb-8">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <div className="h-12 w-12 rounded-full bg-blue-500 flex items-center justify-center text-white text-lg font-medium">
                  {user.name.charAt(0).toUpperCase()}
                </div>
                <div className="ml-4">
                  <h3 className="text-lg font-medium text-gray-900">{user.name}</h3>
                  <p className="text-sm text-gray-500">{user.email}</p>
                  <p className="text-sm text-gray-600 mt-1">{getDashboardMessage()}</p>
                </div>
              </div>
              <div className="flex items-center space-x-4">
                <RoleBadge role={user.role} size="lg" />
                {user.paymentExpiry && (
                  <div className="text-right">
                    <p className="text-sm font-medium text-gray-900">Expires</p>
                    <p className="text-sm text-gray-500">
                      {new Date(user.paymentExpiry).toLocaleDateString()}
                    </p>
                  </div>
                )}
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Quick Actions */}
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4 mb-8">
          {getQuickActions().map((action, index) => (
            <Link key={index} href={action.href}>
              <Card className="hover:shadow-md transition-shadow cursor-pointer">
                <CardContent className="p-6">
                  <div className="flex items-center">
                    <div className="flex-shrink-0">
                      <action.icon className={`${action.color} text-2xl`} />
                    </div>
                    <div className="ml-4">
                      <p className="text-sm font-medium text-gray-900">{action.title}</p>
                      <p className="text-sm text-gray-500">{action.description}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-3 mb-8">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <Users className="h-8 w-8 text-blue-500" />
                </div>
                <div className="ml-4">
                  <p className="text-2xl font-bold text-gray-900">247</p>
                  <p className="text-sm text-gray-500">Total Members</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <FolderOpen className="h-8 w-8 text-green-500" />
                </div>
                <div className="ml-4">
                  <p className="text-2xl font-bold text-gray-900">89</p>
                  <p className="text-sm text-gray-500">Total Projects</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <TrendingUp className="h-8 w-8 text-purple-500" />
                </div>
                <div className="ml-4">
                  <p className="text-2xl font-bold text-gray-900">42</p>
                  <p className="text-sm text-gray-500">This Month</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Recent Activity */}
        <Card>
          <CardHeader>
            <CardTitle>Recent Activity</CardTitle>
          </CardHeader>
          <CardContent>
            {user.role === "unverified" ? (
              <div className="text-center py-8">
                <Clock className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">Application Under Review</h3>
                <p className="text-gray-600">
                  Your application is being reviewed by our team. We'll notify you once it's processed.
                </p>
              </div>
            ) : (
              <div className="space-y-4">
                <div className="border border-gray-200 rounded-lg p-4">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <h4 className="text-sm font-medium text-gray-900">Welcome to the community!</h4>
                      <p className="mt-1 text-sm text-gray-500">
                        Your application has been approved. Start exploring projects and connecting with other builders.
                      </p>
                      <div className="mt-2 flex items-center space-x-4">
                        <Badge className="bg-green-100 text-green-800">
                          Welcome
                        </Badge>
                        <span className="text-xs text-gray-500">Today</span>
                      </div>
                    </div>
                    <div className="ml-4 flex-shrink-0">
                      <CheckCircle className="h-5 w-5 text-green-500" />
                    </div>
                  </div>
                </div>

                {user.role === "premium" || user.role === "inner" || user.role === "admin" ? (
                  <div className="border border-gray-200 rounded-lg p-4">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <h4 className="text-sm font-medium text-gray-900">Project submission access unlocked</h4>
                        <p className="mt-1 text-sm text-gray-500">
                          You can now submit your projects and showcase your work to the community.
                        </p>
                        <div className="mt-2 flex items-center space-x-4">
                          <Badge className="bg-blue-100 text-blue-800">
                            Feature Unlocked
                          </Badge>
                          <span className="text-xs text-gray-500">2 days ago</span>
                        </div>
                      </div>
                      <div className="ml-4 flex-shrink-0">
                        <PlusCircle className="h-5 w-5 text-blue-500" />
                      </div>
                    </div>
                  </div>
                ) : null}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
