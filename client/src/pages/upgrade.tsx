import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { authStore } from "@/lib/auth";
import { User } from "@shared/schema";
import { Check, Crown, CreditCard, Smartphone, University, ArrowLeft } from "lucide-react";
import { Link } from "wouter";

export default function Upgrade() {
  const [user, setUser] = useState<User | null>(authStore.getUser());
  const [selectedDuration, setSelectedDuration] = useState<3 | 6 | 12>(3);

  useEffect(() => {
    const unsubscribe = authStore.subscribe(setUser);
    return unsubscribe;
  }, []);

  const pricingPlans = {
    premium: {
      3: 299,
      6: 499,
      12: 899,
    },
    inner: {
      3: 999,
      6: 1799,
      12: 2999,
    },
  };

  const handlePayment = (planType: "premium" | "inner") => {
    // In a real app, this would integrate with Razorpay
    console.log(`Initiating ${planType} payment for ${selectedDuration} months`);
    alert(`Payment integration would be implemented here for ${planType} plan (${selectedDuration} months)`);
  };

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <Card className="w-full max-w-md">
          <CardContent className="pt-6">
            <div className="text-center">
              <h2 className="text-xl font-semibold mb-2">Access Required</h2>
              <p className="text-gray-600 mb-4">Please join our community to access upgrade options.</p>
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
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-6">
          <Link href="/dashboard">
            <Button variant="ghost" size="sm">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Dashboard
            </Button>
          </Link>
        </div>

        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-gray-900">Upgrade Your Access</h2>
          <p className="mt-4 text-lg text-gray-600">Choose a plan that fits your builder journey</p>
        </div>

        {/* Duration Toggle */}
        <div className="flex justify-center mb-8">
          <div className="relative bg-gray-100 p-1 rounded-lg">
            <button
              onClick={() => setSelectedDuration(3)}
              className={`relative w-32 py-2 text-sm font-medium rounded-md transition-all ${
                selectedDuration === 3
                  ? "bg-white text-gray-900 shadow-sm"
                  : "text-gray-500 hover:text-gray-700"
              }`}
            >
              3 Months
            </button>
            <button
              onClick={() => setSelectedDuration(6)}
              className={`relative w-32 py-2 text-sm font-medium rounded-md transition-all ${
                selectedDuration === 6
                  ? "bg-white text-gray-900 shadow-sm"
                  : "text-gray-500 hover:text-gray-700"
              }`}
            >
              6 Months
            </button>
            <button
              onClick={() => setSelectedDuration(12)}
              className={`relative w-32 py-2 text-sm font-medium rounded-md transition-all ${
                selectedDuration === 12
                  ? "bg-white text-gray-900 shadow-sm"
                  : "text-gray-500 hover:text-gray-700"
              }`}
            >
              12 Months
            </button>
          </div>
        </div>

        {/* Pricing Cards */}
        <div className="grid grid-cols-1 gap-8 lg:grid-cols-2 max-w-4xl mx-auto">
          {/* Premium Plan */}
          <Card className={`relative ${user.role === "verified" ? "border-2 border-blue-500" : ""}`}>
            {user.role === "verified" && (
              <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
                <Badge className="bg-blue-500 text-white">Recommended</Badge>
              </div>
            )}
            <CardHeader className="text-center">
              <CardTitle className="text-2xl font-bold text-gray-900">Premium</CardTitle>
              <p className="text-gray-600">Perfect for active builders</p>
              <div className="mt-6">
                <span className="text-4xl font-bold text-gray-900">
                  ₹{pricingPlans.premium[selectedDuration]}
                </span>
                <span className="text-gray-500">/{selectedDuration} months</span>
              </div>
            </CardHeader>
            
            <CardContent>
              <ul className="space-y-4 mb-8">
                <li className="flex items-center">
                  <Check className="h-5 w-5 text-green-500 mr-3" />
                  <span className="text-gray-700">Submit unlimited projects</span>
                </li>
                <li className="flex items-center">
                  <Check className="h-5 w-5 text-green-500 mr-3" />
                  <span className="text-gray-700">View project previews</span>
                </li>
                <li className="flex items-center">
                  <Check className="h-5 w-5 text-green-500 mr-3" />
                  <span className="text-gray-700">Access to Telegram community</span>
                </li>
                <li className="flex items-center">
                  <Check className="h-5 w-5 text-green-500 mr-3" />
                  <span className="text-gray-700">Priority application review</span>
                </li>
                <li className="flex items-center">
                  <Check className="h-5 w-5 text-green-500 mr-3" />
                  <span className="text-gray-700">Builder verification badge</span>
                </li>
              </ul>

              <Button
                onClick={() => handlePayment("premium")}
                className="w-full bg-blue-600 hover:bg-blue-700"
                disabled={user.role === "premium" || user.role === "inner" || user.role === "admin"}
              >
                {user.role === "premium" ? "Current Plan" : "Choose Premium"}
              </Button>
            </CardContent>
          </Card>

          {/* Inner Circle Plan */}
          <Card className="bg-gradient-to-br from-purple-50 to-purple-100 border-2 border-purple-300">
            <CardHeader className="text-center">
              <CardTitle className="text-2xl font-bold text-gray-900">Inner Circle</CardTitle>
              <p className="text-gray-600">Exclusive access to everything</p>
              <div className="mt-6">
                <span className="text-4xl font-bold text-gray-900">
                  ₹{pricingPlans.inner[selectedDuration]}
                </span>
                <span className="text-gray-500">/{selectedDuration} months</span>
              </div>
            </CardHeader>
            
            <CardContent>
              <ul className="space-y-4 mb-8">
                <li className="flex items-center">
                  <Crown className="h-5 w-5 text-purple-500 mr-3" />
                  <span className="text-gray-700">Everything in Premium</span>
                </li>
                <li className="flex items-center">
                  <Crown className="h-5 w-5 text-purple-500 mr-3" />
                  <span className="text-gray-700">Full access to all secret projects</span>
                </li>
                <li className="flex items-center">
                  <Crown className="h-5 w-5 text-purple-500 mr-3" />
                  <span className="text-gray-700">God-Tier League projects</span>
                </li>
                <li className="flex items-center">
                  <Crown className="h-5 w-5 text-purple-500 mr-3" />
                  <span className="text-gray-700">Direct access to project builders</span>
                </li>
                <li className="flex items-center">
                  <Crown className="h-5 w-5 text-purple-500 mr-3" />
                  <span className="text-gray-700">Exclusive Inner Circle Telegram</span>
                </li>
                <li className="flex items-center">
                  <Crown className="h-5 w-5 text-purple-500 mr-3" />
                  <span className="text-gray-700">Monthly live sessions with founders</span>
                </li>
              </ul>

              <Button
                onClick={() => handlePayment("inner")}
                className="w-full bg-gradient-to-r from-purple-600 to-purple-700 hover:from-purple-700 hover:to-purple-800"
                disabled={user.role === "inner" || user.role === "admin"}
              >
                {user.role === "inner" ? "Current Plan" : "Join Inner Circle"}
              </Button>
            </CardContent>
          </Card>
        </div>

        {/* Payment Security */}
        <div className="mt-12 text-center">
          <p className="text-sm text-gray-500 mb-4">Secure payments powered by Razorpay</p>
          <div className="flex justify-center space-x-6 opacity-60">
            <CreditCard className="h-8 w-8 text-gray-400" />
            <Smartphone className="h-8 w-8 text-gray-400" />
            <University className="h-8 w-8 text-gray-400" />
          </div>
        </div>

        {/* Current Status */}
        {user.role !== "unverified" && (
          <Card className="mt-8">
            <CardHeader>
              <CardTitle>Your Current Plan</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-lg font-medium text-gray-900 capitalize">{user.role}</p>
                  {user.paymentExpiry && (
                    <p className="text-sm text-gray-600">
                      Expires on {new Date(user.paymentExpiry).toLocaleDateString()}
                    </p>
                  )}
                </div>
                <Badge className="bg-green-100 text-green-800">Active</Badge>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}
