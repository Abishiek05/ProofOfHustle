import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/contexts/AuthContext";
import { getUserLocation, getPricingForCountry } from "@/lib/geolocation";
import { Check, Star, Crown, Loader2, CreditCard, Zap, Globe } from "lucide-react";

interface PricingData {
  currency: string;
  symbol: string;
  premium: { 3: number; 6: number; 12: number };
  innerCircle: { 3: number; 6: number; 12: number };
}

export default function Upgrade() {
  const [isProcessing, setIsProcessing] = useState(false);
  const [pricingData, setPricingData] = useState<PricingData | null>(null);
  const [locationInfo, setLocationInfo] = useState<any>(null);
  const { currentUser, userProfile } = useAuth();
  const { toast } = useToast();

  useEffect(() => {
    const loadPricing = async () => {
      try {
        const location = await getUserLocation();
        const pricing = getPricingForCountry(location.countryCode);
        setLocationInfo(location);
        setPricingData(pricing);
      } catch (error) {
        console.error('Failed to load pricing:', error);
        // Fallback to USD pricing
        const defaultPricing = getPricingForCountry('US');
        setPricingData(defaultPricing);
      }
    };

    loadPricing();
  }, []);

  const handleUpgrade = async (plan: string, duration: number, amount: number) => {
    setIsProcessing(true);
    try {
      // Simulate Stripe integration
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      toast({
        title: "Upgrade Successful! 🚀",
        description: `You've been upgraded to ${plan} for ${duration} months. Welcome to the elite network!`,
      });
      
      // In real implementation, this would:
      // 1. Create Stripe payment session
      // 2. Update user profile in Firestore
      // 3. Generate Hustler ID card
      // 4. Add to Telegram groups
      
    } catch (error) {
      toast({
        title: "Payment Failed",
        description: "There was an error processing your payment. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsProcessing(false);
    }
  };

  if (!currentUser) {
    return (
      <div className="max-w-4xl mx-auto p-6 min-h-screen flex items-center justify-center">
        <Card className="glass-card border-white/20">
          <CardContent className="p-12 text-center">
            <div className="mx-auto w-16 h-16 rounded-full bg-gradient-to-br from-red-500 to-pink-600 flex items-center justify-center mb-6">
              <Zap className="h-8 w-8 text-white" />
            </div>
            <h2 className="text-2xl font-heading text-white mb-4">Login Required</h2>
            <p className="text-gray-400 mb-6">
              You need to be logged in to upgrade your membership.
            </p>
            <Button className="btn-glow">Login</Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (!pricingData) {
    return (
      <div className="max-w-4xl mx-auto p-6 min-h-screen flex items-center justify-center">
        <div className="glass-card p-8 text-center">
          <Loader2 className="h-8 w-8 animate-spin mx-auto mb-4 text-cyan-400" />
          <p className="text-white">Loading pricing for your region...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto p-6 min-h-screen pt-24">
      <div className="text-center mb-16">
        <Badge className="glass-card border-white/20 text-purple-400 font-mono text-sm px-4 py-2 mb-6">
          <Globe className="mr-2 h-4 w-4" />
          {locationInfo ? `${locationInfo.country} Pricing` : 'Global Pricing'}
        </Badge>
        <h1 className="text-5xl font-heading mb-6">
          <span className="bg-gradient-to-r from-purple-400 via-pink-500 to-cyan-400 bg-clip-text text-transparent">
            UPGRADE YOUR
          </span>
          <br />
          <span className="bg-gradient-to-r from-cyan-400 via-purple-500 to-pink-500 bg-clip-text text-transparent">
            MEMBERSHIP
          </span>
        </h1>
        <p className="text-xl text-gray-400 max-w-3xl mx-auto leading-relaxed">
          Unlock exclusive projects, submit your own work, and join the inner circle of elite builders worldwide.
        </p>
        {userProfile && (
          <div className="mt-6 flex justify-center">
            <Badge className={`px-4 py-2 font-mono text-sm ${{
              'Rookie': 'bg-gradient-to-r from-gray-500 to-gray-600',
              'Premium': 'bg-gradient-to-r from-yellow-500 to-orange-600',
              'Inner Circle': 'bg-gradient-to-r from-purple-500 to-pink-600'
            }[userProfile.role]} text-white`}>
              CURRENT: {userProfile.role.toUpperCase()}
            </Badge>
          </div>
        )}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-16">
        {/* Premium Tier */}
        <Card className="glass-card border-yellow-500 hover-3d relative">
          <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
            <Badge className="bg-gradient-to-r from-yellow-500 to-orange-600 text-white font-mono px-4 py-2">
              MOST POPULAR
            </Badge>
          </div>
          <CardHeader className="text-center pb-6">
            <div className="mx-auto w-20 h-20 rounded-full bg-gradient-to-br from-yellow-500 to-orange-600 flex items-center justify-center mb-6 shadow-2xl shadow-yellow-500/30">
              <Star className="h-10 w-10 text-white" />
            </div>
            <CardTitle className="text-3xl font-heading text-white mb-2">PREMIUM</CardTitle>
            <p className="text-gray-400">Submit projects and access MVP content</p>
          </CardHeader>
          <CardContent className="space-y-8">
            <ul className="space-y-4">
              <li className="flex items-center text-gray-300">
                <Check className="h-5 w-5 text-green-400 mr-4 flex-shrink-0" />
                Submit your own projects
              </li>
              <li className="flex items-center text-gray-300">
                <Check className="h-5 w-5 text-green-400 mr-4 flex-shrink-0" />
                Access to MVP-level projects
              </li>
              <li className="flex items-center text-gray-300">
                <Check className="h-5 w-5 text-green-400 mr-4 flex-shrink-0" />
                Telegram Premium group access
              </li>
              <li className="flex items-center text-gray-300">
                <Check className="h-5 w-5 text-green-400 mr-4 flex-shrink-0" />
                Digital Hustler ID card
              </li>
            </ul>

            <div className="space-y-4">
              {Object.entries(pricingData.premium).map(([duration, price]) => (
                <div key={duration} className={`glass p-4 rounded-lg border ${duration === '6' ? 'border-yellow-400' : 'border-white/10'}`}>
                  <div className="flex justify-between items-center">
                    <div>
                      <span className="text-white font-medium">{duration} months</span>
                      {duration === '6' && (
                        <Badge className="ml-2 bg-yellow-500 text-black text-xs">SAVE 20%</Badge>
                      )}
                    </div>
                    <div className="text-right">
                      <span className="text-2xl font-bold text-white">
                        {pricingData.symbol}{price}
                      </span>
                      <p className="text-sm text-gray-400">
                        {pricingData.symbol}{Math.round(price / parseInt(duration))}/month
                      </p>
                    </div>
                    <Button 
                      className="btn-glow ml-4"
                      onClick={() => handleUpgrade('Premium', parseInt(duration), price)}
                      disabled={isProcessing}
                    >
                      {isProcessing ? <Loader2 className="h-4 w-4 animate-spin" /> : 'Choose'}
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Inner Circle Tier */}
        <Card className="glass-card border-purple-500 hover-3d">
          <CardHeader className="text-center pb-6">
            <div className="mx-auto w-20 h-20 rounded-full bg-gradient-to-br from-purple-500 to-pink-600 flex items-center justify-center mb-6 shadow-2xl shadow-purple-500/30">
              <Crown className="h-10 w-10 text-white" />
            </div>
            <CardTitle className="text-3xl font-heading text-white mb-2">INNER CIRCLE</CardTitle>
            <p className="text-gray-400">Full access to god-tier projects</p>
          </CardHeader>
          <CardContent className="space-y-8">
            <ul className="space-y-4">
              <li className="flex items-center text-gray-300">
                <Check className="h-5 w-5 text-green-400 mr-4 flex-shrink-0" />
                All Premium features
              </li>
              <li className="flex items-center text-gray-300">
                <Check className="h-5 w-5 text-green-400 mr-4 flex-shrink-0" />
                God-tier project access
              </li>
              <li className="flex items-center text-gray-300">
                <Check className="h-5 w-5 text-green-400 mr-4 flex-shrink-0" />
                Exclusive Inner Circle Telegram
              </li>
              <li className="flex items-center text-gray-300">
                <Check className="h-5 w-5 text-green-400 mr-4 flex-shrink-0" />
                Premium Hustler ID card
              </li>
            </ul>

            <div className="space-y-4">
              {Object.entries(pricingData.innerCircle).map(([duration, price]) => (
                <div key={duration} className={`glass p-4 rounded-lg border ${duration === '6' ? 'border-purple-400' : 'border-white/10'}`}>
                  <div className="flex justify-between items-center">
                    <div>
                      <span className="text-white font-medium">{duration} months</span>
                      {duration === '6' && (
                        <Badge className="ml-2 bg-purple-500 text-white text-xs">SAVE 20%</Badge>
                      )}
                    </div>
                    <div className="text-right">
                      <span className="text-2xl font-bold text-white">
                        {pricingData.symbol}{price}
                      </span>
                      <p className="text-sm text-gray-400">
                        {pricingData.symbol}{Math.round(price / parseInt(duration))}/month
                      </p>
                    </div>
                    <Button 
                      className="btn-glow bg-gradient-to-r from-purple-500 to-pink-600 ml-4"
                      onClick={() => handleUpgrade('Inner Circle', parseInt(duration), price)}
                      disabled={isProcessing}
                    >
                      {isProcessing ? <Loader2 className="h-4 w-4 animate-spin" /> : 'Choose'}
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="text-center">
        <div className="glass-card p-8 max-w-3xl mx-auto border-white/20">
          <CreditCard className="h-16 w-16 mx-auto text-cyan-400 mb-6" />
          <h3 className="text-2xl font-heading text-white mb-4">Secure Payment Processing</h3>
          <p className="text-gray-400 text-lg leading-relaxed">
            All payments are processed securely through Stripe. You'll receive immediate access after successful payment.
            Prices are automatically adjusted for your region ({pricingData.currency}).
          </p>
          <div className="mt-6 text-sm text-gray-500">
            <p>💳 All major credit cards accepted • 🔒 256-bit SSL encryption • 🌍 Global currency support</p>
          </div>
        </div>
      </div>
    </div>
  );
}