import { useState, useEffect } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { authStore } from "@/lib/auth";
import { apiRequest } from "@/lib/queryClient";
import { User, Application, Project } from "@shared/schema";
import { 
  Users, 
  FileText, 
  FolderOpen, 
  DollarSign,
  Check,
  X,
  Eye,
  ArrowLeft
} from "lucide-react";
import { Link } from "wouter";

export default function Admin() {
  const [user, setUser] = useState<User | null>(authStore.getUser());
  const [activeTab, setActiveTab] = useState("applications");
  const queryClient = useQueryClient();

  useEffect(() => {
    const unsubscribe = authStore.subscribe(setUser);
    return unsubscribe;
  }, []);

  const { data: applications, isLoading: applicationsLoading } = useQuery<Application[]>({
    queryKey: ["/api/applications"],
    enabled: user?.role === "admin",
  });

  const { data: projects, isLoading: projectsLoading } = useQuery<Project[]>({
    queryKey: ["/api/projects"],
    enabled: user?.role === "admin",
  });

  const reviewApplication = useMutation({
    mutationFn: async ({ id, status }: { id: number; status: string }) => {
      const response = await apiRequest("PATCH", `/api/applications/${id}/review`, {
        status,
        reviewedBy: user?.id,
      });
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/applications"] });
    },
  });

  const reviewProject = useMutation({
    mutationFn: async ({ id, status, category }: { id: number; status: string; category?: string }) => {
      const response = await apiRequest("PATCH", `/api/projects/${id}/review`, {
        status,
        approvedBy: user?.id,
        category,
      });
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/projects"] });
    },
  });

  if (!user || user.role !== "admin") {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <Card className="w-full max-w-md">
          <CardContent className="pt-6">
            <div className="text-center">
              <h2 className="text-xl font-semibold mb-2">Admin Access Required</h2>
              <p className="text-gray-600 mb-4">You need admin privileges to access this page.</p>
              <Link href="/dashboard">
                <Button>Back to Dashboard</Button>
              </Link>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  const pendingApplications = applications?.filter(app => app.status === "pending") || [];
  const pendingProjects = projects?.filter(proj => proj.status === "pending") || [];

  const tabs = [
    { id: "applications", label: "Applications", count: pendingApplications.length },
    { id: "users", label: "Users", count: 0 },
    { id: "projects", label: "Projects", count: pendingProjects.length },
    { id: "payments", label: "Payments", count: 0 },
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
        <div className="mb-6">
          <Link href="/dashboard">
            <Button variant="ghost" size="sm">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Dashboard
            </Button>
          </Link>
        </div>

        <div className="mb-8">
          <h2 className="text-2xl font-bold text-gray-900">Admin Panel</h2>
          <p className="mt-1 text-sm text-gray-600">Manage users, applications, and projects</p>
        </div>

        {/* Admin Stats */}
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4 mb-8">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <Users className="h-8 w-8 text-blue-500" />
                </div>
                <div className="ml-4">
                  <p className="text-2xl font-bold text-gray-900">247</p>
                  <p className="text-sm text-gray-500">Total Users</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <FileText className="h-8 w-8 text-yellow-500" />
                </div>
                <div className="ml-4">
                  <p className="text-2xl font-bold text-gray-900">{pendingApplications.length}</p>
                  <p className="text-sm text-gray-500">Pending Applications</p>
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
                  <p className="text-2xl font-bold text-gray-900">{projects?.length || 0}</p>
                  <p className="text-sm text-gray-500">Total Projects</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <DollarSign className="h-8 w-8 text-purple-500" />
                </div>
                <div className="ml-4">
                  <p className="text-2xl font-bold text-gray-900">₹45,320</p>
                  <p className="text-sm text-gray-500">Monthly Revenue</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Admin Tabs */}
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
                {tab.count > 0 && (
                  <Badge className="ml-2 bg-red-100 text-red-800">{tab.count}</Badge>
                )}
              </button>
            ))}
          </nav>
        </div>

        {/* Applications Management */}
        {activeTab === "applications" && (
          <Card>
            <CardHeader>
              <CardTitle>Pending Applications</CardTitle>
            </CardHeader>
            <CardContent>
              {applicationsLoading ? (
                <div className="text-center py-8">Loading applications...</div>
              ) : pendingApplications.length === 0 ? (
                <div className="text-center py-8">
                  <h3 className="text-lg font-medium text-gray-900 mb-2">No Pending Applications</h3>
                  <p className="text-gray-600">All applications have been reviewed.</p>
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Applicant
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Applied
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Experience
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Actions
                        </th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {pendingApplications.map((application) => (
                        <tr key={application.id}>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="flex items-center">
                              <div className="h-10 w-10 rounded-full bg-blue-500 flex items-center justify-center text-white text-sm font-medium">
                                {application.name.charAt(0).toUpperCase()}
                              </div>
                              <div className="ml-4">
                                <div className="text-sm font-medium text-gray-900">{application.name}</div>
                                <div className="text-sm text-gray-500">{application.email}</div>
                              </div>
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                            {new Date(application.createdAt).toLocaleDateString()}
                          </td>
                          <td className="px-6 py-4">
                            <div className="text-sm text-gray-900 max-w-xs truncate">
                              {application.experience}
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm font-medium space-x-2">
                            <Button
                              size="sm"
                              onClick={() => reviewApplication.mutate({ id: application.id, status: "approved" })}
                              disabled={reviewApplication.isPending}
                              className="bg-green-600 hover:bg-green-700"
                            >
                              <Check className="h-4 w-4 mr-1" />
                              Approve
                            </Button>
                            <Button
                              size="sm"
                              variant="destructive"
                              onClick={() => reviewApplication.mutate({ id: application.id, status: "rejected" })}
                              disabled={reviewApplication.isPending}
                            >
                              <X className="h-4 w-4 mr-1" />
                              Reject
                            </Button>
                            <Button size="sm" variant="outline">
                              <Eye className="h-4 w-4 mr-1" />
                              View
                            </Button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </CardContent>
          </Card>
        )}

        {/* Projects Management */}
        {activeTab === "projects" && (
          <Card>
            <CardHeader>
              <CardTitle>Pending Projects</CardTitle>
            </CardHeader>
            <CardContent>
              {projectsLoading ? (
                <div className="text-center py-8">Loading projects...</div>
              ) : pendingProjects.length === 0 ? (
                <div className="text-center py-8">
                  <h3 className="text-lg font-medium text-gray-900 mb-2">No Pending Projects</h3>
                  <p className="text-gray-600">All projects have been reviewed.</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {pendingProjects.map((project) => (
                    <Card key={project.id} className="border border-gray-200">
                      <CardContent className="p-6">
                        <div className="flex items-start justify-between">
                          <div className="flex-1">
                            <h4 className="text-lg font-medium text-gray-900 mb-2">{project.title}</h4>
                            <p className="text-sm text-gray-600 mb-4">{project.description}</p>
                            <div className="flex items-center space-x-4 text-sm text-gray-500">
                              <span>Submitted by User #{project.submittedBy}</span>
                              <span>{new Date(project.createdAt).toLocaleDateString()}</span>
                              {project.techStack && <span>Tech: {project.techStack}</span>}
                            </div>
                          </div>
                          <div className="ml-6 flex flex-col space-y-2">
                            <div className="flex space-x-2">
                              <select
                                className="text-sm border border-gray-300 rounded px-2 py-1"
                                defaultValue="rookie"
                                id={`category-${project.id}`}
                              >
                                <option value="rookie">Rookie League</option>
                                <option value="mvp">MVP League</option>
                                <option value="godtier">God-Tier League</option>
                              </select>
                            </div>
                            <div className="flex space-x-2">
                              <Button
                                size="sm"
                                onClick={() => {
                                  const categorySelect = document.getElementById(`category-${project.id}`) as HTMLSelectElement;
                                  reviewProject.mutate({
                                    id: project.id,
                                    status: "approved",
                                    category: categorySelect.value
                                  });
                                }}
                                disabled={reviewProject.isPending}
                                className="bg-green-600 hover:bg-green-700"
                              >
                                <Check className="h-4 w-4 mr-1" />
                                Approve
                              </Button>
                              <Button
                                size="sm"
                                variant="destructive"
                                onClick={() => reviewProject.mutate({ id: project.id, status: "rejected" })}
                                disabled={reviewProject.isPending}
                              >
                                <X className="h-4 w-4 mr-1" />
                                Reject
                              </Button>
                            </div>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        )}

        {/* Other tabs content */}
        {activeTab === "users" && (
          <Card>
            <CardHeader>
              <CardTitle>User Management</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-center py-8">
                <h3 className="text-lg font-medium text-gray-900 mb-2">User Management</h3>
                <p className="text-gray-600">User management features would be implemented here.</p>
              </div>
            </CardContent>
          </Card>
        )}

        {activeTab === "payments" && (
          <Card>
            <CardHeader>
              <CardTitle>Payment Management</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-center py-8">
                <h3 className="text-lg font-medium text-gray-900 mb-2">Payment Management</h3>
                <p className="text-gray-600">Payment management features would be implemented here.</p>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}
