import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { 
  CheckCircle, 
  Watch, 
  Star, 
  Crown, 
  Check, 
  X,
  Forward,
  Twitter,
  Github
} from "lucide-react";

export default function Home() {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <div className="bg-white">
        <div className="max-w-7xl mx-auto py-16 px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h1 className="text-4xl font-bold text-gray-900 sm:text-5xl md:text-6xl">
              Prove Your <span className="text-blue-600">Hustle</span>
            </h1>
            <p className="mt-3 max-w-md mx-auto text-base text-gray-500 sm:text-lg md:mt-5 md:text-xl md:max-w-3xl">
              Join an exclusive builder network where dedication meets opportunity. 
              Apply, get verified, and unlock access to secret projects and premium resources.
            </p>
            <div className="mt-5 max-w-md mx-auto sm:flex sm:justify-center md:mt-8">
              <div className="rounded-md shadow">
                <Link href="/apply">
                  <Button size="lg" className="w-full sm:w-auto bg-blue-600 hover:bg-blue-700">
                    Start Your Journey
                  </Button>
                </Link>
              </div>
              <div className="mt-3 rounded-md shadow sm:mt-0 sm:ml-3">
                <Button variant="outline" size="lg" className="w-full sm:w-auto">
                  Learn More
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* User Tiers Section */}
      <div className="bg-gray-50 py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h2 className="text-3xl font-bold text-gray-900">Membership Tiers</h2>
            <p className="mt-4 text-lg text-gray-600">
              Progress through verified stages to unlock exclusive access
            </p>
          </div>
          
          <div className="mt-12 grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-4">
            {/* Unverified Tier */}
            <Card className="border border-gray-200">
              <CardContent className="p-6 text-center">
                <Badge className="bg-gray-100 text-gray-800 mb-4">
                  <Watch className="h-4 w-4 mr-2" />
                  Unverified
                </Badge>
                <h3 className="text-lg font-medium text-gray-900 mb-2">Getting Started</h3>
                <p className="text-sm text-gray-500 mb-4">Apply to join our community</p>
                <ul className="space-y-2 text-sm text-gray-600">
                  <li className="flex items-center">
                    <Check className="h-4 w-4 text-green-500 mr-2" />
                    Submit application
                  </li>
                  <li className="flex items-center">
                    <Check className="h-4 w-4 text-green-500 mr-2" />
                    Basic dashboard access
                  </li>
                  <li className="flex items-center">
                    <X className="h-4 w-4 text-red-500 mr-2" />
                    Project access
                  </li>
                </ul>
              </CardContent>
            </Card>

            {/* Verified Tier */}
            <Card className="border border-gray-200">
              <CardContent className="p-6 text-center">
                <Badge className="bg-green-100 text-green-800 mb-4">
                  <CheckCircle className="h-4 w-4 mr-2" />
                  Verified
                </Badge>
                <h3 className="text-lg font-medium text-gray-900 mb-2">Community Member</h3>
                <p className="text-sm text-gray-500 mb-4">Approved builder status</p>
                <ul className="space-y-2 text-sm text-gray-600">
                  <li className="flex items-center">
                    <Check className="h-4 w-4 text-green-500 mr-2" />
                    View project titles
                  </li>
                  <li className="flex items-center">
                    <Check className="h-4 w-4 text-green-500 mr-2" />
                    Community discussions
                  </li>
                  <li className="flex items-center">
                    <X className="h-4 w-4 text-red-500 mr-2" />
                    Project submissions
                  </li>
                </ul>
              </CardContent>
            </Card>

            {/* Premium Tier */}
            <Card className="border-2 border-blue-500 relative">
              <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
                <Badge className="bg-blue-500 text-white">Popular</Badge>
              </div>
              <CardContent className="p-6 text-center">
                <Badge className="bg-blue-100 text-blue-800 mb-4">
                  <Star className="h-4 w-4 mr-2" />
                  Premium
                </Badge>
                <h3 className="text-lg font-medium text-gray-900 mb-2">Active Builder</h3>
                <p className="text-sm text-gray-500 mb-4">Submit and showcase your work</p>
                <ul className="space-y-2 text-sm text-gray-600 mb-6">
                  <li className="flex items-center">
                    <Check className="h-4 w-4 text-green-500 mr-2" />
                    Submit projects
                  </li>
                  <li className="flex items-center">
                    <Check className="h-4 w-4 text-green-500 mr-2" />
                    Project previews
                  </li>
                  <li className="flex items-center">
                    <Check className="h-4 w-4 text-green-500 mr-2" />
                    Forward access
                  </li>
                </ul>
                <div className="text-center">
                  <p className="text-2xl font-bold text-gray-900">
                    ₹299<span className="text-sm font-normal text-gray-500">/3mo</span>
                  </p>
                </div>
              </CardContent>
            </Card>

            {/* Inner Circle Tier */}
            <Card className="border border-gray-200">
              <CardContent className="p-6 text-center">
                <Badge className="bg-purple-100 text-purple-800 mb-4">
                  <Crown className="h-4 w-4 mr-2" />
                  Inner Circle
                </Badge>
                <h3 className="text-lg font-medium text-gray-900 mb-2">Elite Member</h3>
                <p className="text-sm text-gray-500 mb-4">Full access to secret projects</p>
                <ul className="space-y-2 text-sm text-gray-600 mb-6">
                  <li className="flex items-center">
                    <Check className="h-4 w-4 text-green-500 mr-2" />
                    All project details
                  </li>
                  <li className="flex items-center">
                    <Check className="h-4 w-4 text-green-500 mr-2" />
                    Exclusive content
                  </li>
                  <li className="flex items-center">
                    <Check className="h-4 w-4 text-green-500 mr-2" />
                    Priority support
                  </li>
                </ul>
                <div className="text-center">
                  <p className="text-2xl font-bold text-gray-900">
                    ₹999<span className="text-sm font-normal text-gray-500">/3mo</span>
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>

      {/* CTA Section */}
      <div className="bg-blue-600">
        <div className="max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h2 className="text-3xl font-bold text-white">Ready to Join?</h2>
            <p className="mt-4 text-xl text-blue-100">
              Start your journey in our exclusive builder community
            </p>
            <div className="mt-8">
              <Link href="/apply">
                <Button size="lg" variant="secondary">
                  Apply Now
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="bg-gray-900 text-white">
        <div className="max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div className="md:col-span-2">
              <h3 className="text-xl font-bold mb-4">Proof of Hustle</h3>
              <p className="text-gray-300 max-w-md">
                Join an exclusive builder network where dedication meets opportunity. 
                Apply, get verified, and unlock access to secret projects.
              </p>
              <div className="flex space-x-4 mt-6">
                <a href="#" className="text-gray-400 hover:text-white">
                  <Forward className="h-5 w-5" />
                </a>
                <a href="#" className="text-gray-400 hover:text-white">
                  <Twitter className="h-5 w-5" />
                </a>
                <a href="#" className="text-gray-400 hover:text-white">
                  <Github className="h-5 w-5" />
                </a>
              </div>
            </div>
            <div>
              <h4 className="text-lg font-semibold mb-4">Platform</h4>
              <ul className="space-y-2 text-gray-300">
                <li><a href="#" className="hover:text-white">How it Works</a></li>
                <li><a href="#" className="hover:text-white">Pricing</a></li>
                <li><a href="#" className="hover:text-white">Success Stories</a></li>
                <li><a href="#" className="hover:text-white">FAQ</a></li>
              </ul>
            </div>
            <div>
              <h4 className="text-lg font-semibold mb-4">Support</h4>
              <ul className="space-y-2 text-gray-300">
                <li><a href="#" className="hover:text-white">Contact Us</a></li>
                <li><a href="#" className="hover:text-white">Privacy Policy</a></li>
                <li><a href="#" className="hover:text-white">Terms of Service</a></li>
                <li><a href="#" className="hover:text-white">Refund Policy</a></li>
              </ul>
            </div>
          </div>
          <div className="border-t border-gray-800 mt-8 pt-8 text-center text-gray-400">
            <p>&copy; 2024 Proof of Hustle. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
