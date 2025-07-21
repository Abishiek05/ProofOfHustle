
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Clock, CheckCircle, XCircle, ArrowLeft } from 'lucide-react';
import { Link } from 'wouter';

export default function VerificationStatus() {
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

        <Card className="glass-card border border-white/10">
          <CardHeader className="text-center pb-6">
            <div className="mx-auto w-12 h-12 rounded-full bg-gradient-to-br from-yellow-400 to-orange-600 flex items-center justify-center mb-4">
              <Clock className="h-6 w-6 text-white" />
            </div>
            <CardTitle className="text-2xl font-heading text-white">
              Application Under Review
            </CardTitle>
          </CardHeader>
          
          <CardContent className="space-y-6 text-center">
            <div className="space-y-4">
              <p className="text-gray-300">
                Your application has been submitted successfully and is currently under review by our admin team.
              </p>
              
              <div className="bg-white/5 rounded-lg p-4">
                <h3 className="text-white font-medium mb-2">What happens next?</h3>
                <ul className="text-sm text-gray-400 space-y-2 text-left">
                  <li>• Our admin will review your application</li>
                  <li>• You may be contacted via Telegram for additional questions</li>
                  <li>• You'll receive an email once your application is processed</li>
                  <li>• Approved users can log in and access the platform</li>
                </ul>
              </div>

              <div className="flex items-center justify-center space-x-4 text-sm">
                <div className="flex items-center text-yellow-400">
                  <Clock className="h-4 w-4 mr-1" />
                  Pending Review
                </div>
              </div>
            </div>

            <div className="space-y-2">
              <Link href="/login">
                <Button className="w-full bg-gradient-to-r from-blue-400 to-purple-600">
                  Try Login Later
                </Button>
              </Link>
              
              <Link href="/">
                <Button variant="outline" className="w-full border-white/20 text-white hover:bg-white/5">
                  Back to Home
                </Button>
              </Link>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
