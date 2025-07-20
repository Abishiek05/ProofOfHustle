import { Badge } from "@/components/ui/badge";
import { CheckCircle, Clock, Star, Crown, Shield } from "lucide-react";

interface RoleBadgeProps {
  role: string;
  size?: "sm" | "md" | "lg";
}

export function RoleBadge({ role, size = "md" }: RoleBadgeProps) {
  const getRoleConfig = (role: string) => {
    switch (role) {
      case "unverified":
        return {
          label: "Unverified",
          icon: Clock,
          className: "bg-gray-100 text-gray-800 hover:bg-gray-200",
        };
      case "verified":
        return {
          label: "Verified",
          icon: CheckCircle,
          className: "bg-green-100 text-green-800 hover:bg-green-200",
        };
      case "premium":
        return {
          label: "Premium",
          icon: Star,
          className: "bg-blue-100 text-blue-800 hover:bg-blue-200",
        };
      case "inner":
        return {
          label: "Inner Circle",
          icon: Crown,
          className: "bg-purple-100 text-purple-800 hover:bg-purple-200",
        };
      case "admin":
        return {
          label: "Admin",
          icon: Shield,
          className: "bg-red-100 text-red-800 hover:bg-red-200",
        };
      default:
        return {
          label: "Unknown",
          icon: Clock,
          className: "bg-gray-100 text-gray-800",
        };
    }
  };

  const config = getRoleConfig(role);
  const Icon = config.icon;
  
  const sizeClasses = {
    sm: "text-xs px-2 py-0.5",
    md: "text-sm px-2.5 py-0.5",
    lg: "text-base px-3 py-1",
  };

  const iconSizes = {
    sm: "h-3 w-3",
    md: "h-4 w-4",
    lg: "h-5 w-5",
  };

  return (
    <Badge className={`${config.className} ${sizeClasses[size]} inline-flex items-center gap-1`}>
      <Icon className={iconSizes[size]} />
      {config.label}
    </Badge>
  );
}
