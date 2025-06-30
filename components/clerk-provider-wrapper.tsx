"use client";

import { ClerkProvider } from '@clerk/nextjs';
import { ReactNode } from 'react';

interface ClerkProviderWrapperProps {
  children: ReactNode;
}

export function ClerkProviderWrapper({ children }: ClerkProviderWrapperProps) {
  // Check if we have the required environment variables
  const publishableKey = process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY;
  
  if (!publishableKey || publishableKey === 'pk_test_your_publishable_key_here') {
    console.warn('Clerk publishable key not configured. Running in demo mode.');
  }

  return (
    <ClerkProvider
      publishableKey={publishableKey || 'pk_test_demo_key'}
      signInUrl="/sign-in"
      signUpUrl="/sign-up"
      afterSignInUrl="/"
      afterSignUpUrl="/"
      appearance={{
        baseTheme: undefined,
        variables: {
          colorPrimary: '#84cc16',
          colorBackground: '#000000',
          colorInputBackground: 'rgba(0, 0, 0, 0.4)',
          colorInputText: '#ffffff',
          colorText: '#ffffff',
          colorTextSecondary: '#9ca3af',
          borderRadius: '0.5rem'
        },
        elements: {
          formButtonPrimary: 'bg-lime-400 hover:bg-lime-500 text-black font-semibold',
          card: 'bg-black/90 border border-lime-400/30 backdrop-blur-md',
          headerTitle: 'text-lime-400 font-bold',
          headerSubtitle: 'text-gray-300',
          socialButtonsBlockButton: 'border-lime-400/30 text-lime-400 hover:bg-lime-400/10 transition-colors',
          formFieldInput: 'bg-black/40 border-lime-400/30 text-white placeholder-gray-400 focus:border-lime-400',
          footerActionLink: 'text-lime-400 hover:text-lime-300 transition-colors',
          dividerLine: 'bg-lime-400/30',
          dividerText: 'text-gray-400',
          formFieldLabel: 'text-gray-300',
          identityPreviewText: 'text-gray-300',
          identityPreviewEditButton: 'text-lime-400 hover:text-lime-300'
        }
      }}
    >
      {children}
    </ClerkProvider>
  );
}