import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { insertApplicationSchema } from "@shared/schema";
import { apiRequest } from "@/lib/queryClient";
import { NotebookPen } from "lucide-react";
import type { InsertApplication } from "@shared/schema";

const skillOptions = [
  { id: "frontend", label: "Frontend Development" },
  { id: "backend", label: "Backend Development" },
  { id: "design", label: "UI/UX Design" },
  { id: "mobile", label: "Mobile Development" },
  { id: "ai", label: "AI/Machine Learning" },
  { id: "marketing", label: "Marketing" },
];

export function ApplicationForm() {
  const [selectedSkills, setSelectedSkills] = useState<string[]>([]);
  const [agreed, setAgreed] = useState(false);
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const form = useForm<InsertApplication>({
    resolver: zodResolver(insertApplicationSchema),
    defaultValues: {
      name: "",
      email: "",
      telegramId: "",
      experience: "",
      currentFocus: "",
      goals: "",
      skills: [],
    },
  });

  const submitApplication = useMutation({
    mutationFn: async (data: InsertApplication) => {
      const response = await apiRequest("POST", "/api/applications", data);
      return response.json();
    },
    onSuccess: () => {
      toast({
        title: "Application Submitted!",
        description: "We'll review your application and get back to you soon.",
      });
      // Redirect to review pending page
      window.location.href = '/review-pending';
      form.reset();
      setSelectedSkills([]);
      setAgreed(false);
      queryClient.invalidateQueries({ queryKey: ["/api/applications"] });
    },
    onError: () => {
      toast({
        title: "Submission Failed",
        description: "There was an error submitting your application. Please try again.",
        variant: "destructive",
      });
    },
  });

  const handleSkillChange = (skillId: string, checked: boolean) => {
    let newSkills;
    if (checked) {
      newSkills = [...selectedSkills, skillId];
    } else {
      newSkills = selectedSkills.filter(id => id !== skillId);
    }
    setSelectedSkills(newSkills);
    form.setValue("skills", newSkills);
  };

  const onSubmit = (data: InsertApplication) => {
    if (!agreed) {
      toast({
        title: "Agreement Required",
        description: "Please agree to the Terms of Service and Privacy Policy.",
        variant: "destructive",
      });
      return;
    }

    submitApplication.mutate({
      ...data,
      skills: selectedSkills,
    });
  };

  return (
    <Card className="max-w-3xl mx-auto">
      <CardHeader className="text-center">
        <CardTitle className="text-2xl font-bold text-gray-900">
          Apply to Join
        </CardTitle>
        <p className="text-gray-600">
          Tell us about your building experience and goals
        </p>
      </CardHeader>

      <CardContent>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          {/* Personal Information */}
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
            <div>
              <Label htmlFor="name">Full Name</Label>
              <Input
                id="name"
                {...form.register("name")}
                className="mt-1"
                placeholder="Your full name"
              />
              {form.formState.errors.name && (
                <p className="text-sm text-red-600 mt-1">
                  {form.formState.errors.name.message}
                </p>
              )}
            </div>

            <div>
              <Label htmlFor="email">Email Address</Label>
              <Input
                id="email"
                type="email"
                {...form.register("email")}
                className="mt-1"
                placeholder="your.email@example.com"
              />
              {form.formState.errors.email && (
                <p className="text-sm text-red-600 mt-1">
                  {form.formState.errors.email.message}
                </p>
              )}
            </div>
          </div>

          {/* Telegram ID */}
          <div>
            <Label htmlFor="telegramId">Telegram Username (Optional)</Label>
            <div className="mt-1 relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <span className="text-gray-500 text-sm">@</span>
              </div>
              <Input
                id="telegramId"
                {...form.register("telegramId")}
                className="pl-7"
                placeholder="username"
              />
            </div>
            <p className="text-xs text-gray-500 mt-1">
              We'll add you to our community groups upon approval
            </p>
          </div>

          {/* Building Experience */}
          <div>
            <Label htmlFor="experience">What have you built?</Label>
            <Textarea
              id="experience"
              {...form.register("experience")}
              rows={4}
              className="mt-1"
              placeholder="Describe your projects, ideas, or products you've built..."
            />
            {form.formState.errors.experience && (
              <p className="text-sm text-red-600 mt-1">
                {form.formState.errors.experience.message}
              </p>
            )}
          </div>

          {/* Current Focus */}
          <div>
            <Label htmlFor="currentFocus">What are you currently working on?</Label>
            <Textarea
              id="currentFocus"
              {...form.register("currentFocus")}
              rows={3}
              className="mt-1"
              placeholder="Tell us about your current projects or ideas..."
            />
            {form.formState.errors.currentFocus && (
              <p className="text-sm text-red-600 mt-1">
                {form.formState.errors.currentFocus.message}
              </p>
            )}
          </div>

          {/* Goals */}
          <div>
            <Label htmlFor="goals">What do you hope to achieve in our community?</Label>
            <Textarea
              id="goals"
              {...form.register("goals")}
              rows={3}
              className="mt-1"
              placeholder="Your goals and expectations from joining our community..."
            />
            {form.formState.errors.goals && (
              <p className="text-sm text-red-600 mt-1">
                {form.formState.errors.goals.message}
              </p>
            )}
          </div>

          {/* Skills */}
          <div>
            <Label className="text-sm font-medium text-gray-700 mb-3 block">
              Primary Skills (Select all that apply)
            </Label>
            <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
              {skillOptions.map((skill) => (
                <div key={skill.id} className="flex items-center space-x-2">
                  <Checkbox
                    id={skill.id}
                    checked={selectedSkills.includes(skill.id)}
                    onCheckedChange={(checked) => 
                      handleSkillChange(skill.id, checked as boolean)
                    }
                  />
                  <Label
                    htmlFor={skill.id}
                    className="text-sm text-gray-700 cursor-pointer"
                  >
                    {skill.label}
                  </Label>
                </div>
              ))}
            </div>
          </div>

          {/* Agreement */}
          <div className="flex items-start space-x-2">
            <Checkbox
              id="agreement"
              checked={agreed}
              onCheckedChange={(checked) => setAgreed(checked as boolean)}
            />
            <Label htmlFor="agreement" className="text-sm text-gray-700">
              I agree to the{" "}
              <a href="#" className="text-blue-600 hover:text-blue-500">
                Terms of Service
              </a>{" "}
              and{" "}
              <a href="#" className="text-blue-600 hover:text-blue-500">
                Privacy Policy
              </a>
            </Label>
          </div>

          {/* Submit Button */}
          <div className="pt-4">
            <Button
              type="submit"
              className="w-full bg-blue-600 hover:bg-blue-700"
              disabled={submitApplication.isPending}
            >
              <NotebookPen className="h-4 w-4 mr-2" />
              {submitApplication.isPending ? "Submitting..." : "Submit Application"}
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}