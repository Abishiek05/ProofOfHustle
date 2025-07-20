import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { insertProjectSchema } from "@shared/schema";
import { apiRequest } from "@/lib/queryClient";
import { authStore } from "@/lib/auth";
import { User } from "@shared/schema";
import { Upload, ArrowLeft } from "lucide-react";
import { Link } from "wouter";
import type { InsertProject } from "@shared/schema";

export default function Submit() {
  const [user, setUser] = useState<User | null>(authStore.getUser());
  const { toast } = useToast();
  const queryClient = useQueryClient();

  useEffect(() => {
    const unsubscribe = authStore.subscribe(setUser);
    return unsubscribe;
  }, []);

  const form = useForm<InsertProject>({
    resolver: zodResolver(insertProjectSchema),
    defaultValues: {
      title: "",
      description: "",
      techStack: "",
      metrics: "",
    },
  });

  const submitProject = useMutation({
    mutationFn: async (data: InsertProject) => {
      const response = await apiRequest("POST", "/api/projects", {
        ...data,
        submittedBy: user?.id,
      });
      return response.json();
    },
    onSuccess: () => {
      toast({
        title: "Project Submitted!",
        description: "Your project has been submitted for review. We'll notify you once it's processed.",
      });
      form.reset();
      queryClient.invalidateQueries({ queryKey: ["/api/projects"] });
    },
    onError: () => {
      toast({
        title: "Submission Failed",
        description: "There was an error submitting your project. Please try again.",
        variant: "destructive",
      });
    },
  });

  if (!user || !authStore.canAccess("premium")) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <Card className="w-full max-w-md">
          <CardContent className="pt-6">
            <div className="text-center">
              <h2 className="text-xl font-semibold mb-2">Premium Access Required</h2>
              <p className="text-gray-600 mb-4">
                You need Premium access to submit projects.
              </p>
              <div className="space-y-2">
                <Link href="/upgrade">
                  <Button className="w-full">Upgrade to Premium</Button>
                </Link>
                <Link href="/dashboard">
                  <Button variant="outline" className="w-full">Back to Dashboard</Button>
                </Link>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  const onSubmit = (data: InsertProject) => {
    submitProject.mutate(data);
  };

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-6">
          <Link href="/projects">
            <Button variant="ghost" size="sm">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Projects
            </Button>
          </Link>
        </div>

        <Card>
          <CardHeader className="text-center">
            <CardTitle className="text-2xl font-bold text-gray-900">
              Submit Your Project
            </CardTitle>
            <p className="text-gray-600">
              Share your work with the community and get feedback from fellow builders
            </p>
          </CardHeader>
          
          <CardContent>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              {/* Project Title */}
              <div>
                <Label htmlFor="title">Project Title</Label>
                <Input
                  id="title"
                  {...form.register("title")}
                  className="mt-1"
                  placeholder="e.g., AI-Powered Analytics Dashboard"
                />
                {form.formState.errors.title && (
                  <p className="text-sm text-red-600 mt-1">
                    {form.formState.errors.title.message}
                  </p>
                )}
              </div>

              {/* Project Description */}
              <div>
                <Label htmlFor="description">Project Description</Label>
                <Textarea
                  id="description"
                  {...form.register("description")}
                  rows={6}
                  className="mt-1"
                  placeholder="Describe your project in detail. What problem does it solve? What makes it unique? Include key features, target audience, and any notable achievements..."
                />
                {form.formState.errors.description && (
                  <p className="text-sm text-red-600 mt-1">
                    {form.formState.errors.description.message}
                  </p>
                )}
              </div>

              {/* Tech Stack */}
              <div>
                <Label htmlFor="techStack">Technology Stack</Label>
                <Input
                  id="techStack"
                  {...form.register("techStack")}
                  className="mt-1"
                  placeholder="e.g., React, Node.js, PostgreSQL, AWS, TensorFlow"
                />
                <p className="text-xs text-gray-500 mt-1">
                  List the main technologies, frameworks, and tools used in your project
                </p>
              </div>

              {/* Metrics & Achievements */}
              <div>
                <Label htmlFor="metrics">Metrics & Achievements (Optional)</Label>
                <Textarea
                  id="metrics"
                  {...form.register("metrics")}
                  rows={3}
                  className="mt-1"
                  placeholder="e.g., 10,000+ active users, $50K+ monthly revenue, 99.9% uptime, featured in TechCrunch..."
                />
                <p className="text-xs text-gray-500 mt-1">
                  Share any impressive metrics, achievements, or recognition your project has received
                </p>
              </div>

              {/* Submission Guidelines */}
              <div className="bg-blue-50 rounded-lg p-4 border border-blue-200">
                <h4 className="text-sm font-medium text-blue-900 mb-2">Submission Guidelines</h4>
                <ul className="text-xs text-blue-800 space-y-1">
                  <li>• Projects will be reviewed by our team within 5-7 business days</li>
                  <li>• Approved projects will be categorized into Rookie, MVP, or God-Tier leagues</li>
                  <li>• Make sure your project is functional and demonstrates real value</li>
                  <li>• Include relevant links (GitHub, live demo, etc.) in your description</li>
                  <li>• Be honest about your metrics and achievements</li>
                </ul>
              </div>

              {/* Submit Button */}
              <div className="pt-4">
                <Button
                  type="submit"
                  className="w-full bg-blue-600 hover:bg-blue-700"
                  disabled={submitProject.isPending}
                >
                  <Upload className="h-4 w-4 mr-2" />
                  {submitProject.isPending ? "Submitting..." : "Submit Project"}
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>

        {/* What Happens Next */}
        <Card className="mt-8">
          <CardHeader>
            <CardTitle>What Happens Next?</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-start space-x-3">
                <div className="flex-shrink-0 w-6 h-6 bg-blue-100 rounded-full flex items-center justify-center">
                  <span className="text-xs font-medium text-blue-600">1</span>
                </div>
                <div>
                  <h4 className="text-sm font-medium text-gray-900">Review Process</h4>
                  <p className="text-sm text-gray-600">Our team will review your project submission within 5-7 business days.</p>
                </div>
              </div>
              
              <div className="flex items-start space-x-3">
                <div className="flex-shrink-0 w-6 h-6 bg-blue-100 rounded-full flex items-center justify-center">
                  <span className="text-xs font-medium text-blue-600">2</span>
                </div>
                <div>
                  <h4 className="text-sm font-medium text-gray-900">Categorization</h4>
                  <p className="text-sm text-gray-600">Approved projects are placed in Rookie, MVP, or God-Tier leagues based on complexity and impact.</p>
                </div>
              </div>
              
              <div className="flex items-start space-x-3">
                <div className="flex-shrink-0 w-6 h-6 bg-blue-100 rounded-full flex items-center justify-center">
                  <span className="text-xs font-medium text-blue-600">3</span>
                </div>
                <div>
                  <h4 className="text-sm font-medium text-gray-900">Community Exposure</h4>
                  <p className="text-sm text-gray-600">Your project becomes visible to the community based on their access levels.</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
