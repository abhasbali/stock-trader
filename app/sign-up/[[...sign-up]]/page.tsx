"use client";

import { SignUp } from '@clerk/nextjs';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { ArrowLeft } from 'lucide-react';
import Link from 'next/link';

export default function SignUpPage() {
  const publishableKey = process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY;
  
  // Show demo message if Clerk is not configured
  if (!publishableKey || publishableKey === 'pk_test_your_publishable_key_here') {
    return (
      <div className="min-h-screen matrix-bg flex items-center justify-center p-4">
        <Card className="w-full max-w-md bg-black/90 border border-lime-400/30 p-8">
          <div className="text-center space-y-6">
            <h1 className="text-2xl font-bold text-lime-400">Demo Mode</h1>
            <p className="text-gray-300">
              Authentication is not configured. To enable sign-up:
            </p>
            <div className="text-left space-y-2 text-sm text-gray-400">
              <p>1. Create a Clerk account at <span className="text-lime-400">clerk.com</span></p>
              <p>2. Get your publishable key</p>
              <p>3. Update the .env.local file</p>
            </div>
            <Link href="/">
              <Button className="bg-lime-400 text-black hover:bg-lime-500 w-full">
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back to Demo
              </Button>
            </Link>
          </div>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen matrix-bg flex items-center justify-center p-4">
      <div className="w-full max-w-md space-y-4">
        <Link href="/">
          <Button variant="ghost" className="text-lime-400 hover:text-lime-300">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Home
          </Button>
        </Link>
        
        <SignUp 
          appearance={{
            elements: {
              rootBox: "mx-auto",
              card: "bg-black/90 border border-lime-400/30 shadow-2xl backdrop-blur-md",
              headerTitle: "text-lime-400 text-center font-bold",
              headerSubtitle: "text-gray-300 text-center",
              socialButtonsBlockButton: "border-lime-400/30 text-lime-400 hover:bg-lime-400/10 transition-colors",
              formButtonPrimary: "bg-lime-400 hover:bg-lime-500 text-black font-semibold",
              formFieldInput: "bg-black/40 border-lime-400/30 text-white placeholder-gray-400 focus:border-lime-400",
              footerActionLink: "text-lime-400 hover:text-lime-300 transition-colors",
              dividerLine: "bg-lime-400/30",
              dividerText: "text-gray-400",
              formFieldLabel: "text-gray-300",
              identityPreviewText: "text-gray-300",
              identityPreviewEditButton: "text-lime-400 hover:text-lime-300",
              formFieldSuccessText: "text-green-400",
              formFieldErrorText: "text-red-400",
              alertText: "text-red-400",
              formResendCodeLink: "text-lime-400 hover:text-lime-300"
            }
          }}
        />
      </div>
    </div>
  );
}