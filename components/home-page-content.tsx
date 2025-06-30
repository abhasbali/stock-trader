"use client";

import { useUser } from '@clerk/nextjs';
import { LandingPage } from '@/components/landing-page';
import { Dashboard } from '@/components/dashboard';
import { useEffect, useState } from 'react';

export default function HomePageContent() {
  const { isSignedIn, isLoaded } = useUser();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted || !isLoaded) {
    return (
      <div className="min-h-screen matrix-bg flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-lime-400"></div>
      </div>
    );
  }

  return isSignedIn ? <Dashboard /> : <LandingPage />;
}