import { Switch, Route } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { AuthProvider } from "@/contexts/AuthContext";
import { Navbar } from "@/components/navbar";
import Home from "@/pages/home";
import VerificationStatus from '@/pages/verification-status';
import ReviewPending from '@/pages/review-pending';
import Dashboard from '@/pages/dashboard';
import Projects from '@/pages/projects';
import Apply from "@/pages/apply";
import Submit from "@/pages/submit";
import Upgrade from "@/pages/upgrade";
import Admin from "@/pages/admin";
import Login from "@/pages/login";
import Signup from "@/pages/signup";
import NotFound from "@/pages/not-found";

function Router() {
  return (
    <Switch>
      <Route path="/" component={Home} />
      <Route path="/login" component={Login} />
      <Route path="/signup" component={Signup} />
      <Route path="/verification-status" component={VerificationStatus} />
      <Route path="/review-pending" component={ReviewPending} />
      <Route path="/dashboard" component={Dashboard} />
      <Route path="/projects" component={Projects} />
      <Route path="/apply" component={Apply} />
      <Route path="/submit" component={Submit} />
      <Route path="/upgrade" component={Upgrade} />
      <Route path="/admin" component={Admin} />
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <TooltipProvider>
          <div className="min-h-screen">
            <div className="animated-bg"></div>
            <Navbar />
            <Router />
          </div>
          <Toaster />
        </TooltipProvider>
      </AuthProvider>
    </QueryClientProvider>
  );
}

export default App;