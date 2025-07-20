import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useAuth } from "@/contexts/AuthContext";
import { 
  CheckCircle, 
  Watch, 
  Star, 
  Crown, 
  Check, 
  X,
  Zap,
  Rocket,
  Shield,
  Globe,
  ExternalLink,
  Twitter,
  Github
} from "lucide-react";

export default function Home() {
  const { currentUser } = useAuth();

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <div className="relative overflow-hidden">
        <div className="max-w-7xl mx-auto py-24 px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <div className="mb-8">
              <Badge className="glass-card border-white/20 text-cyan-400 font-mono text-sm px-4 py-2">
                ⚡ EXCLUSIVE BUILDER NETWORK
              </Badge>
            </div>
            <h1 className="text-5xl md:text-7xl font-heading mb-6">
              <span className="block bg-gradient-to-r from-cyan-400 via-purple-500 to-pink-500 bg-clip-text text-transparent">
                PROOF OF
              </span>
              <span className="block bg-gradient-to-r from-pink-500 via-purple-500 to-cyan-400 bg-clip-text text-transparent neon-glow">
                HUSTLE
              </span>
            </h1>
            <p className="mt-6 max-w-3xl mx-auto text-xl text-gray-300 leading-relaxed">
              Join an exclusive builder network where 
              <span className="text-cyan-400 font-medium"> dedication meets opportunity</span>. 
              Get verified, unlock secret projects, and connect with elite builders worldwide.
            </p>
            <div className="mt-10 flex flex-col sm:flex-row gap-4 justify-center">
              {currentUser ? (
                <Link href="/dashboard">
                  <Button size="lg" className="btn-glow text-lg px-8 py-4">
                    <Rocket className="mr-2 h-5 w-5" />
                    Enter Dashboard
                  </Button>
                </Link>
              ) : (
                <>
                  <Link href="/signup">
                    <Button size="lg" className="btn-glow text-lg px-8 py-4">
                      <Zap className="mr-2 h-5 w-5" />
                      Join the Network
                    </Button>
                  </Link>
                  <Link href="/login">
                    <Button variant="outline" size="lg" className="border-white/20 text-white hover:bg-white/5 text-lg px-8 py-4">
                      <Shield className="mr-2 h-5 w-5" />
                      Member Login
                    </Button>
                  </Link>
                </>
              )}
            </div>
          </div>
        </div>
      </div>



      {/* Membership Tiers Section */}
      <div className="py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-heading text-white mb-4">
              <span className="bg-gradient-to-r from-purple-400 to-cyan-400 bg-clip-text text-transparent">
                MEMBERSHIP TIERS
              </span>
            </h2>
            <p className="text-xl text-gray-400 max-w-2xl mx-auto">
              Progress through verified stages to unlock exclusive access and elite opportunities
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Rookie Tier */}
            <Card className="glass-card border-gray-600 hover-3d">
              <CardContent className="p-8 text-center">
                <div className="mx-auto w-16 h-16 rounded-full bg-gradient-to-br from-gray-500 to-gray-600 flex items-center justify-center mb-6">
                  <Shield className="h-8 w-8 text-white" />
                </div>
                <Badge className="bg-gradient-to-r from-gray-500 to-gray-600 text-white mb-4 px-3 py-1 font-mono">
                  ROOKIE
                </Badge>
                <h3 className="text-2xl font-heading text-white mb-4">Getting Started</h3>
                <p className="text-gray-400 mb-6">Apply and get verified to access basic projects</p>
                <ul className="space-y-3 text-left text-gray-300 mb-8">
                  <li className="flex items-center">
                    <Check className="h-5 w-5 text-green-400 mr-3 flex-shrink-0" />
                    View project titles
                  </li>
                  <li className="flex items-center">
                    <Check className="h-5 w-5 text-green-400 mr-3 flex-shrink-0" />
                    Community access
                  </li>
                  <li className="flex items-center">
                    <X className="h-5 w-5 text-red-400 mr-3 flex-shrink-0" />
                    Project submissions
                  </li>
                </ul>
                <div className="text-center">
                  <p className="text-3xl font-bold text-white">FREE</p>
                  <p className="text-gray-400 text-sm">After verification</p>
                </div>
              </CardContent>
            </Card>

            {/* Premium Tier */}
            <Card className="glass-card border-yellow-500 hover-3d relative transform scale-105">
              <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                <Badge className="bg-gradient-to-r from-yellow-500 to-orange-600 text-white font-mono px-4 py-2">
                  MOST POPULAR
                </Badge>
              </div>
              <CardContent className="p-8 text-center">
                <div className="mx-auto w-16 h-16 rounded-full bg-gradient-to-br from-yellow-500 to-orange-600 flex items-center justify-center mb-6">
                  <Star className="h-8 w-8 text-white" />
                </div>
                <Badge className="bg-gradient-to-r from-yellow-500 to-orange-600 text-white mb-4 px-3 py-1 font-mono">
                  PREMIUM
                </Badge>
                <h3 className="text-2xl font-heading text-white mb-4">Active Builder</h3>
                <p className="text-gray-400 mb-6">Submit projects and unlock MVP-level content</p>
                <ul className="space-y-3 text-left text-gray-300 mb-8">
                  <li className="flex items-center">
                    <Check className="h-5 w-5 text-green-400 mr-3 flex-shrink-0" />
                    Submit projects
                  </li>
                  <li className="flex items-center">
                    <Check className="h-5 w-5 text-green-400 mr-3 flex-shrink-0" />
                    MVP project access
                  </li>
                  <li className="flex items-center">
                    <Check className="h-5 w-5 text-green-400 mr-3 flex-shrink-0" />
                    Priority support
                  </li>
                </ul>
                <div className="text-center mb-6">
                  <p className="text-3xl font-bold text-white">
                    From $19<span className="text-lg font-normal text-gray-400">/3mo</span>
                  </p>
                  <p className="text-gray-400 text-sm">Geo-adjusted pricing</p>
                </div>
                <Button className="w-full btn-glow">
                  Upgrade Now
                </Button>
              </CardContent>
            </Card>

            {/* Inner Circle Tier */}
            <Card className="glass-card border-purple-500 hover-3d">
              <CardContent className="p-8 text-center">
                <div className="mx-auto w-16 h-16 rounded-full bg-gradient-to-br from-purple-500 to-pink-600 flex items-center justify-center mb-6">
                  <Crown className="h-8 w-8 text-white" />
                </div>
                <Badge className="bg-gradient-to-r from-purple-500 to-pink-600 text-white mb-4 px-3 py-1 font-mono">
                  INNER CIRCLE
                </Badge>
                <h3 className="text-2xl font-heading text-white mb-4">Elite Member</h3>
                <p className="text-gray-400 mb-6">Access god-tier projects and exclusive network</p>
                <ul className="space-y-3 text-left text-gray-300 mb-8">
                  <li className="flex items-center">
                    <Check className="h-5 w-5 text-green-400 mr-3 flex-shrink-0" />
                    God-tier projects
                  </li>
                  <li className="flex items-center">
                    <Check className="h-5 w-5 text-green-400 mr-3 flex-shrink-0" />
                    Exclusive content
                  </li>
                  <li className="flex items-center">
                    <Check className="h-5 w-5 text-green-400 mr-3 flex-shrink-0" />
                    Elite network access
                  </li>
                </ul>
                <div className="text-center">
                  <p className="text-3xl font-bold text-white">
                    From $59<span className="text-lg font-normal text-gray-400">/3mo</span>
                  </p>
                  <p className="text-gray-400 text-sm">Geo-adjusted pricing</p>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>

      {/* Features Section */}
      <div className="py-24 border-t border-white/10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
            <div className="text-center">
              <div className="mx-auto w-16 h-16 rounded-full bg-gradient-to-br from-cyan-400 to-blue-600 flex items-center justify-center mb-6">
                <Globe className="h-8 w-8 text-white" />
              </div>
              <h3 className="text-xl font-heading text-white mb-4">Global Network</h3>
              <p className="text-gray-400">Connect with elite builders from around the world</p>
            </div>
            <div className="text-center">
              <div className="mx-auto w-16 h-16 rounded-full bg-gradient-to-br from-purple-400 to-pink-600 flex items-center justify-center mb-6">
                <Zap className="h-8 w-8 text-white" />
              </div>
              <h3 className="text-xl font-heading text-white mb-4">Exclusive Projects</h3>
              <p className="text-gray-400">Access secret projects and cutting-edge opportunities</p>
            </div>
            <div className="text-center">
              <div className="mx-auto w-16 h-16 rounded-full bg-gradient-to-br from-green-400 to-cyan-600 flex items-center justify-center mb-6">
                <Rocket className="h-8 w-8 text-white" />
              </div>
              <h3 className="text-xl font-heading text-white mb-4">Prove Your Worth</h3>
              <p className="text-gray-400">Showcase your skills and get recognized by peers</p>
            </div>
          </div>
        </div>
      </div>

      {/* CTA Section */}
      <div className="relative py-24 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-cyan-900/30 via-purple-900/30 to-pink-900/30"></div>
        <div className="max-w-4xl mx-auto text-center px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="glass-card p-12 border-white/20 hover-3d">
            <h2 className="text-4xl font-heading text-white mb-6">
              <span className="bg-gradient-to-r from-cyan-400 to-purple-500 bg-clip-text text-transparent">
                Ready to Prove Your Hustle?
              </span>
            </h2>
            <p className="text-xl text-gray-300 mb-8 max-w-2xl mx-auto">
              Join thousands of elite builders who are already making their mark in our exclusive network.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              {currentUser ? (
                <Link href="/upgrade">
                  <Button size="lg" className="btn-glow text-lg px-8 py-4">
                    <Zap className="mr-2 h-5 w-5" />
                    Upgrade Membership
                  </Button>
                </Link>
              ) : (
                <Link href="/signup">
                  <Button size="lg" className="btn-glow text-lg px-8 py-4">
                    <Rocket className="mr-2 h-5 w-5" />
                    Start Building
                  </Button>
                </Link>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="glass border-t border-white/10">
        <div className="max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div className="md:col-span-2">
              <h3 className="text-xl font-heading text-white mb-4">PROOF OF HUSTLE</h3>
              <p className="text-gray-400 max-w-md leading-relaxed">
                Join an exclusive builder network where dedication meets opportunity. 
                Get verified and unlock access to secret projects in the elite community.
              </p>
              <div className="flex space-x-4 mt-6">
                <a href="#" className="text-gray-400 hover:text-cyan-400 transition-colors">
                  <ExternalLink className="h-5 w-5" />
                </a>
                <a href="#" className="text-gray-400 hover:text-cyan-400 transition-colors">
                  <Twitter className="h-5 w-5" />
                </a>
                <a href="#" className="text-gray-400 hover:text-cyan-400 transition-colors">
                  <Github className="h-5 w-5" />
                </a>
              </div>
            </div>
            <div>
              <h4 className="text-lg font-heading text-white mb-4">Platform</h4>
              <ul className="space-y-2 text-gray-400">
                <li><a href="#" className="hover:text-cyan-400 transition-colors">How it Works</a></li>
                <li><a href="#" className="hover:text-cyan-400 transition-colors">Pricing</a></li>
                <li><a href="#" className="hover:text-cyan-400 transition-colors">Success Stories</a></li>
                <li><a href="#" className="hover:text-cyan-400 transition-colors">FAQ</a></li>
              </ul>
            </div>
            <div>
              <h4 className="text-lg font-heading text-white mb-4">Support</h4>
              <ul className="space-y-2 text-gray-400">
                <li><a href="#" className="hover:text-cyan-400 transition-colors">Contact Us</a></li>
                <li><a href="#" className="hover:text-cyan-400 transition-colors">Privacy Policy</a></li>
                <li><a href="#" className="hover:text-cyan-400 transition-colors">Terms of Service</a></li>
                <li><a href="#" className="hover:text-cyan-400 transition-colors">Refund Policy</a></li>
              </ul>
            </div>
          </div>
          <div className="border-t border-white/10 mt-8 pt-8 text-center text-gray-500">
            <p className="font-mono text-sm">&copy; 2025 PROOF OF HUSTLE. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
