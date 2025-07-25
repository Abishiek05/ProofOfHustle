
import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Clock, CheckCircle, XCircle, ArrowLeft, Mail } from 'lucide-react';
import { Link, useLocation } from 'wouter';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';

export default function VerificationStatus() {
  const [status, setStatus] = useState<'pending' | 'verified' | 'failed'>('pending');
  const [userEmail, setUserEmail] = useState<string>('');
  const { verifyEmail } = useAuth();
  const { toast } = useToast();
  const [, setLocation] = useLocation();

  useEffect(() => {
    // Get the email from localStorage if available
    const savedEmail = localStorage.getItem('signup_email');
    if (savedEmail) {
      setUserEmail(savedEmail);
    }

    // Check for email verification token in URL
    const urlParams = new URLSearchParams(window.location.search);
    const token = urlParams.get('token');
    
    if (token) {
      handleEmailVerification(token);
    }
  }, []);

  const handleEmailVerification = async (token: string) => {
    try {
      await verifyEmail(token);
      setStatus('verified');
      toast({
        title: "Email Verified!",
        description: "You can now apply to join our community.",
      });
      // Redirect to apply page after 2 seconds
      setTimeout(() => setLocation('/apply'), 2000);
    } catch (error) {
      setStatus('failed');
      toast({
        title: "Verification Failed",
        description: "Invalid or expired verification token.",
        variant: "destructive",
      });
    }
  };

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
            <div className="mx-auto w-12 h-12 rounded-full bg-gradient-to-br from-blue-400 to-purple-600 flex items-center justify-center mb-4">
              {status === 'pending' && <Clock className="h-6 w-6 text-white" />}
              {status === 'verified' && <CheckCircle className="h-6 w-6 text-white" />}
              {status === 'failed' && <XCircle className="h-6 w-6 text-white" />}
            </div>
            <CardTitle className="text-2xl font-heading neon-green">
              {status === 'pending' && 'Email Verification Required'}
              {status === 'verified' && 'Email Verified!'}
              {status === 'failed' && 'Verification Failed'}
            </CardTitle>
          </CardHeader>
          
          <CardContent className="text-center space-y-6">
            {status === 'pending' && (
              <div className="space-y-4">
                <Mail className="h-16 w-16 text-blue-400 mx-auto" />
                <div className="space-y-2">
                  <p className="text-gray-300">
                    We've sent a verification email to your inbox.
                  </p>
                  {userEmail && (
                    <p className="text-blue-400 text-sm font-medium">
                      {userEmail}
                    </p>
                  )}
                  <p className="text-gray-400 text-sm">
                    Please check your email and click the verification link to continue.
                  </p>
                  <p className="text-gray-500 text-xs">
                    Note: If email service is not configured, check the server console for the verification link.
                  </p>
                </div>
              </div>
            )}

            {status === 'verified' && (
              <div className="space-y-4">
                <CheckCircle className="h-16 w-16 text-green-400 mx-auto" />
                <div className="space-y-2">
                  <p className="text-gray-300">
                    Your email has been successfully verified!
                  </p>
                  <p className="text-gray-400 text-sm">
                    Redirecting you to the application form...
                  </p>
                </div>
                <Link href="/apply">
                  <Button className="btn-glow bg-gradient-to-r from-green-400 to-blue-600">
                    Apply Now
                  </Button>
                </Link>
              </div>
            )}

            {status === 'failed' && (
              <div className="space-y-4">
                <XCircle className="h-16 w-16 text-red-400 mx-auto" />
                <div className="space-y-2">
                  <p className="text-gray-300">
                    Email verification failed.
                  </p>
                  <p className="text-gray-400 text-sm">
                    The verification link may be invalid or expired.
                  </p>
                </div>
                <Link href="/signup">
                  <Button variant="outline" className="border-white/20 text-white hover:bg-white/5">
                    Try Again
                  </Button>
                </Link>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
