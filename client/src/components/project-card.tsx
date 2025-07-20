import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Lock, Crown, User, Calendar, Code, TrendingUp } from "lucide-react";
import { Project } from "@shared/schema";
import { authStore } from "@/lib/auth";

interface ProjectCardProps {
  project: Project;
  userRole: string;
}

export function ProjectCard({ project, userRole }: ProjectCardProps) {
  const canViewFull = () => {
    if (userRole === "admin") return true;
    if (userRole === "inner") return true;
    if (userRole === "premium" && project.category !== "godtier") return true;
    if (userRole === "verified" && project.category === "rookie") return true;
    return false;
  };

  const canViewPreview = () => {
    if (canViewFull()) return true;
    if (userRole === "premium") return true;
    return false;
  };

  const getCategoryBadge = (category: string) => {
    switch (category) {
      case "rookie":
        return <Badge className="bg-green-100 text-green-800">Rookie League</Badge>;
      case "mvp":
        return <Badge className="bg-blue-100 text-blue-800">MVP League</Badge>;
      case "godtier":
        return <Badge className="bg-purple-100 text-purple-800">God-Tier League</Badge>;
      default:
        return <Badge>Unknown</Badge>;
    }
  };

  const getUpgradeMessage = () => {
    if (userRole === "verified") {
      return "Upgrade to Premium to see project details and submit your own projects";
    }
    if (userRole === "premium" && project.category === "godtier") {
      return "Upgrade to Inner Circle to see full project details";
    }
    return "";
  };

  if (!canViewPreview()) {
    // Title only view for verified users
    return (
      <Card className="overflow-hidden">
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between mb-3">
            {getCategoryBadge(project.category)}
            <Lock className="h-4 w-4 text-gray-400" />
          </div>
          <h3 className="text-lg font-medium text-gray-900">{project.title}</h3>
        </CardHeader>
        <CardContent>
          <div className="bg-gray-50 rounded-lg p-4 border border-gray-200 text-center">
            <Lock className="h-8 w-8 text-gray-400 mx-auto mb-2" />
            <p className="text-sm text-gray-600 mb-3">{getUpgradeMessage()}</p>
            <Button className="bg-blue-600 hover:bg-blue-700">
              Upgrade to Premium
            </Button>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="overflow-hidden">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between mb-3">
          {getCategoryBadge(project.category)}
          {canViewFull() ? (
            <Crown className="h-4 w-4 text-purple-500" />
          ) : (
            <Lock className="h-4 w-4 text-gray-400" />
          )}
        </div>
        <h3 className="text-lg font-medium text-gray-900">{project.title}</h3>
        <p className="text-sm text-gray-600">{project.description}</p>
      </CardHeader>
      
      <CardContent>
        <div className="space-y-3 mb-4">
          <div className="flex items-center text-sm text-gray-600">
            <User className="h-4 w-4 mr-2" />
            <span>Submitted by User #{project.submittedBy}</span>
          </div>
          <div className="flex items-center text-sm text-gray-600">
            <Calendar className="h-4 w-4 mr-2" />
            <span>{new Date(project.createdAt).toLocaleDateString()}</span>
          </div>
          {project.techStack && (
            <div className="flex items-center text-sm text-gray-600">
              <Code className="h-4 w-4 mr-2" />
              <span>{project.techStack}</span>
            </div>
          )}
          {project.metrics && canViewFull() && (
            <div className="flex items-center text-sm text-gray-600">
              <TrendingUp className="h-4 w-4 mr-2" />
              <span>{project.metrics}</span>
            </div>
          )}
        </div>

        {canViewFull() && project.category === "godtier" && (
          <div className="bg-purple-50 rounded-lg p-4 border border-purple-200 mb-4">
            <h4 className="text-sm font-medium text-purple-900 mb-2">
              Technical Implementation
            </h4>
            <ul className="text-xs text-purple-800 space-y-1">
              <li>• Advanced algorithms and architecture</li>
              <li>• Real-time data processing</li>
              <li>• Scalable infrastructure</li>
              <li>• Production-ready implementation</li>
            </ul>
          </div>
        )}

        {!canViewFull() && (
          <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
            <div className="flex items-center text-sm text-gray-600">
              <Crown className="h-4 w-4 text-purple-500 mr-2" />
              <span>{getUpgradeMessage()}</span>
            </div>
            <Button variant="link" className="mt-2 p-0 h-auto text-blue-600 hover:text-blue-700 text-xs">
              Upgrade Now →
            </Button>
          </div>
        )}

        {canViewFull() && (
          <div className="flex space-x-3 mt-4">
            <Button className="flex-1 bg-blue-600 hover:bg-blue-700">
              View Details
            </Button>
            <Button variant="outline" className="flex-1">
              Contact Builder
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
