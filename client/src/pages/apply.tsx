import { ApplicationForm } from "@/components/application-form";
import { ArrowLeft, UserPlus } from 'lucide-react';
import { Link } from 'wouter';
import { Button } from '@/components/ui/button';

export default function Apply() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-black py-16">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-6">
          <Link href="/">
            <Button variant="ghost" size="sm" className="text-gray-400 hover:text-white">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Home
            </Button>
          </Link>
        </div>

        <div className="text-center mb-8">
          <div className="mx-auto w-16 h-16 rounded-full bg-gradient-to-br from-green-400 to-blue-600 flex items-center justify-center mb-6">
            <UserPlus className="h-8 w-8 text-white" />
          </div>
          <h1 className="text-3xl font-heading neon-green mb-4">
            Apply to Join the Elite
          </h1>
          <p className="text-gray-400 text-lg">
            Tell us about your building experience and prove your worth
          </p>
        </div>

        <div className="glass-card border border-white/10 hover-3d p-8">
          <ApplicationForm />
        </div>
      </div>
    </div>
  );
}
