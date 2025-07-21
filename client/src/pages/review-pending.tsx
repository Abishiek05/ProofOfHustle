
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Clock, ArrowLeft, MessageCircle } from 'lucide-react';
import { Link } from 'wouter';

export default function ReviewPending() {
  return (
    <div className="min-h-screen flex items-center justify-center px-4 py-12">
      <div className="w-full max-w-md">
        <div className="mb-6">
          <Link href="/">
            <Button variant="ghost" size="sm" className="text-gray-400 hover:text-white">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Home
            </Button>
          </Link>
        </div>

        <Card className="glass-card border border-white/10 hover-3d">
          <CardHeader className="text-center pb-6">
            <div className="mx-auto w-12 h-12 rounded-full bg-gradient-to-br from-yellow-400 to-orange-600 flex items-center justify-center mb-4">
              <Clock className="h-6 w-6 text-white" />
            </div>
            <CardTitle className="text-2xl font-heading neon-green">
              Application Under Review
            </CardTitle>
          </CardHeader>
          
          <CardContent className="text-center space-y-6">
            <div className="space-y-4">
              <MessageCircle className="h-16 w-16 text-yellow-400 mx-auto" />
              <div className="space-y-2">
                <p className="text-gray-300">
                  Your application has been submitted successfully!
                </p>
                <p className="text-gray-400 text-sm">
                  Our admin team will review your application and get back to you via Telegram. 
                  Please be patient while we process your request.
                </p>
              </div>
            </div>

            <div className="bg-white/5 rounded-lg p-4 border border-white/10">
              <h3 className="text-sm font-medium text-white mb-2">What happens next?</h3>
              <ul className="text-xs text-gray-400 space-y-1 text-left">
                <li>• Admin reviews your application details</li>
                <li>• You may be contacted via Telegram for additional questions</li>
                <li>• Decision will be communicated within 24-48 hours</li>
                <li>• If approved, you'll receive access to the platform</li>
              </ul>
            </div>

            <Link href="/">
              <Button variant="outline" className="border-white/20 text-white hover:bg-white/5">
                Return to Home
              </Button>
            </Link>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
