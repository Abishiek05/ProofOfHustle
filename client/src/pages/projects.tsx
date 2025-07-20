import { useState, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ProjectCard } from "@/components/project-card";
import { authStore } from "@/lib/auth";
import { User, Project } from "@shared/schema";
import { Link } from "wouter";
import { PlusCircle } from "lucide-react";

export default function Projects() {
  const [user, setUser] = useState<User | null>(authStore.getUser());
  const [activeTab, setActiveTab] = useState("all");

  useEffect(() => {
    const unsubscribe = authStore.subscribe(setUser);
    return unsubscribe;
  }, []);

  const { data: projects, isLoading } = useQuery<Project[]>({
    queryKey: ["/api/projects", { role: user?.role }],
    enabled: !!user,
  });

  const filteredProjects = projects?.filter(project => {
    if (activeTab === "all") return true;
    return project.category === activeTab;
  }) || [];

  const tabs = [
    { id: "all", label: "All Projects" },
    { id: "rookie", label: "Rookie League" },
    { id: "mvp", label: "MVP League" },
  ];

  // Add God-Tier tab only for Inner Circle users
  if (user?.role === "inner" || user?.role === "admin") {
    tabs.push({ id: "godtier", label: "God-Tier League" });
  }

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <Card className="w-full max-w-md">
          <CardContent className="pt-6">
            <div className="text-center">
              <h2 className="text-xl font-semibold mb-2">Access Required</h2>
              <p className="text-gray-600 mb-4">Please apply to join our community to view projects.</p>
              <Link href="/apply">
                <Button>Apply to Join</Button>
              </Link>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h2 className="text-2xl font-bold text-gray-900">Projects</h2>
            <p className="mt-1 text-sm text-gray-600">
              Discover and explore community projects based on your access level
            </p>
          </div>
          {authStore.canAccess("premium") && (
            <Link href="/submit">
              <Button className="bg-blue-600 hover:bg-blue-700">
                <PlusCircle className="h-4 w-4 mr-2" />
                Submit Project
              </Button>
            </Link>
          )}
        </div>

        {/* Filter Tabs */}
        <div className="border-b border-gray-200 mb-8">
          <nav className="-mb-px flex space-x-8">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`whitespace-nowrap py-2 px-1 border-b-2 font-medium text-sm ${
                  activeTab === tab.id
                    ? "border-blue-500 text-blue-600"
                    : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
                }`}
              >
                {tab.label}
              </button>
            ))}
          </nav>
        </div>

        {/* Projects Grid */}
        {isLoading ? (
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {[...Array(6)].map((_, i) => (
              <Card key={i} className="animate-pulse">
                <CardHeader className="pb-3">
                  <div className="h-4 bg-gray-200 rounded w-1/3 mb-2"></div>
                  <div className="h-5 bg-gray-200 rounded w-3/4 mb-2"></div>
                  <div className="h-4 bg-gray-200 rounded w-full"></div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    <div className="h-3 bg-gray-200 rounded w-2/3"></div>
                    <div className="h-3 bg-gray-200 rounded w-1/2"></div>
                    <div className="h-3 bg-gray-200 rounded w-3/4"></div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        ) : filteredProjects.length === 0 ? (
          <Card>
            <CardContent className="pt-6">
              <div className="text-center py-8">
                <h3 className="text-lg font-medium text-gray-900 mb-2">No Projects Found</h3>
                <p className="text-gray-600 mb-4">
                  {activeTab === "all" 
                    ? "No projects are available yet." 
                    : `No projects found in ${tabs.find(t => t.id === activeTab)?.label}.`
                  }
                </p>
                {authStore.canAccess("premium") && (
                  <Link href="/submit">
                    <Button>Submit the First Project</Button>
                  </Link>
                )}
              </div>
            </CardContent>
          </Card>
        ) : (
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {filteredProjects.map((project) => (
              <ProjectCard
                key={project.id}
                project={project}
                userRole={user.role}
              />
            ))}
          </div>
        )}

        {/* Access Level Info */}
        <Card className="mt-8">
          <CardHeader>
            <CardTitle>Your Access Level</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {user.role === "verified" && (
                <p className="text-sm text-gray-600">
                  <strong>Verified:</strong> You can view project titles. Upgrade to Premium to see previews and submit projects.
                </p>
              )}
              {user.role === "premium" && (
                <p className="text-sm text-gray-600">
                  <strong>Premium:</strong> You can view project previews and submit projects. Upgrade to Inner Circle for full access to God-Tier projects.
                </p>
              )}
              {user.role === "inner" && (
                <p className="text-sm text-gray-600">
                  <strong>Inner Circle:</strong> You have full access to all projects including God-Tier League with complete technical details.
                </p>
              )}
              {user.role === "admin" && (
                <p className="text-sm text-gray-600">
                  <strong>Admin:</strong> You have full access to all projects and can manage submissions.
                </p>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
