"use client";

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { 
  TrendingUp, 
  Shield, 
  Zap, 
  BarChart3, 
  Globe, 
  Smartphone,
  Menu,
  X
} from 'lucide-react';

export function LandingPage() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [scrollY, setScrollY] = useState(0);

  useEffect(() => {
    const handleScroll = () => setScrollY(window.scrollY);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const features = [
    {
      icon: TrendingUp,
      title: "Real-Time Trading",
      description: "Execute trades with lightning-fast speed and real-time market data"
    },
    {
      icon: Shield,
      title: "Bank-Level Security",
      description: "Your investments protected with military-grade encryption"
    },
    {
      icon: BarChart3,
      title: "Advanced Analytics",
      description: "60+ technical indicators and comprehensive market analysis"
    },
    {
      icon: Globe,
      title: "Global Markets",
      description: "Trade stocks, forex, crypto, and options worldwide"
    },
    {
      icon: Zap,
      title: "AI-Powered Insights",
      description: "Get personalized trading recommendations from our AI assistant"
    },
    {
      icon: Smartphone,
      title: "Mobile Trading",
      description: "Trade anywhere with our responsive mobile platform"
    }
  ];

  // Simple auth buttons for demo
  const handleSignIn = () => {
    window.location.href = '/sign-in';
  };

  const handleSignUp = () => {
    window.location.href = '/sign-up';
  };

  return (
    <div className="min-h-screen matrix-bg text-white overflow-hidden">
      {/* Navigation */}
      <nav className="fixed top-0 w-full z-50 bg-black/20 backdrop-blur-md border-b border-lime-400/20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <motion.div 
              className="text-2xl font-bold neon-text"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
            >
              XOTC
            </motion.div>
            
            <div className="hidden md:flex space-x-8">
              <a href="#features" className="hover:text-lime-400 transition-colors">Features</a>
              <a href="#pricing" className="hover:text-lime-400 transition-colors">Pricing</a>
              <a href="#about" className="hover:text-lime-400 transition-colors">About</a>
            </div>

            <div className="hidden md:flex space-x-4">
              <Button 
                variant="outline" 
                className="border-lime-400 text-lime-400 hover:bg-lime-400 hover:text-black"
                onClick={handleSignIn}
              >
                Sign In
              </Button>
              <Button 
                className="bg-lime-400 text-black hover:bg-lime-500 neon-glow"
                onClick={handleSignUp}
              >
                Get Started
              </Button>
            </div>

            <button 
              className="md:hidden"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
            >
              {isMenuOpen ? <X /> : <Menu />}
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        {isMenuOpen && (
          <motion.div 
            className="md:hidden bg-black/90 backdrop-blur-md"
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <div className="px-4 py-4 space-y-4">
              <a href="#features" className="block hover:text-lime-400">Features</a>
              <a href="#pricing" className="block hover:text-lime-400">Pricing</a>
              <a href="#about" className="block hover:text-lime-400">About</a>
              <div className="flex flex-col space-y-2 pt-4">
                <Button 
                  variant="outline" 
                  className="border-lime-400 text-lime-400"
                  onClick={handleSignIn}
                >
                  Sign In
                </Button>
                <Button 
                  className="bg-lime-400 text-black hover:bg-lime-500"
                  onClick={handleSignUp}
                >
                  Get Started
                </Button>
              </div>
            </div>
          </motion.div>
        )}
      </nav>

      {/* Hero Section */}
      <section className="relative min-h-screen flex items-center justify-center grid-pattern">
        <div className="absolute inset-0 hologram opacity-30"></div>
        
        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <h1 className="text-5xl md:text-7xl font-bold mb-6 neon-text">
              DEFI OTC TRADING
              <br />
              <span className="text-lime-400">FOR EVERYONE</span>
            </h1>
            
            <p className="text-xl md:text-2xl mb-8 text-gray-300 max-w-3xl mx-auto">
              Trade tokens off-market without price impact or slippage
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button 
                size="lg" 
                className="bg-lime-400 text-black hover:bg-lime-500 text-lg px-8 py-4 neon-glow pulse-glow"
                onClick={handleSignUp}
              >
                APPLY FOR EARLY ACCESS
              </Button>
              <Button 
                size="lg" 
                variant="outline" 
                className="border-lime-400 text-lime-400 hover:bg-lime-400 hover:text-black text-lg px-8 py-4"
              >
                Watch Demo
              </Button>
            </div>
          </motion.div>
        </div>

        {/* Floating Elements */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          {[...Array(20)].map((_, i) => (
            <motion.div
              key={i}
              className="absolute w-2 h-2 bg-lime-400 rounded-full opacity-20"
              style={{
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`,
              }}
              animate={{
                y: [0, -100, 0],
                opacity: [0.2, 0.8, 0.2],
              }}
              transition={{
                duration: 3 + Math.random() * 2,
                repeat: Infinity,
                delay: Math.random() * 2,
              }}
            />
          ))}
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-20 relative">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl md:text-5xl font-bold mb-6 neon-text">
              Advanced Trading Features
            </h2>
            <p className="text-xl text-gray-300 max-w-3xl mx-auto">
              Experience the future of trading with our cutting-edge platform
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
              >
                <Card className="bg-black/40 border-lime-400/30 p-6 hover:border-lime-400 transition-all duration-300 cyber-border group">
                  <feature.icon className="w-12 h-12 text-lime-400 mb-4 group-hover:scale-110 transition-transform" />
                  <h3 className="text-xl font-semibold mb-3 text-white">{feature.title}</h3>
                  <p className="text-gray-300">{feature.description}</p>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-20 bg-black/20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
            {[
              { value: "$2.5B+", label: "Trading Volume" },
              { value: "500K+", label: "Active Traders" },
              { value: "99.9%", label: "Uptime" },
              { value: "24/7", label: "Support" }
            ].map((stat, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, scale: 0.5 }}
                whileInView={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
              >
                <div className="text-3xl md:text-4xl font-bold text-lime-400 neon-text">
                  {stat.value}
                </div>
                <div className="text-gray-300 mt-2">{stat.label}</div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 relative">
        <div className="absolute inset-0 grid-pattern opacity-30"></div>
        <div className="relative z-10 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <h2 className="text-4xl md:text-5xl font-bold mb-6 neon-text">
              Ready to Start Trading?
            </h2>
            <p className="text-xl text-gray-300 mb-8">
              Join thousands of traders who trust XOTC for their trading needs
            </p>
            <Button 
              size="lg" 
              className="bg-lime-400 text-black hover:bg-lime-500 text-lg px-12 py-4 neon-glow pulse-glow"
              onClick={handleSignUp}
            >
              Start Trading Now
            </Button>
          </motion.div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-black/40 border-t border-lime-400/20 py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div>
              <div className="text-2xl font-bold neon-text mb-4">XOTC</div>
              <p className="text-gray-400">
                The future of decentralized trading
              </p>
            </div>
            <div>
              <h3 className="text-lg font-semibold mb-4 text-lime-400">Platform</h3>
              <ul className="space-y-2 text-gray-400">
                <li><a href="#" className="hover:text-lime-400">Trading</a></li>
                <li><a href="#" className="hover:text-lime-400">Analytics</a></li>
                <li><a href="#" className="hover:text-lime-400">Portfolio</a></li>
              </ul>
            </div>
            <div>
              <h3 className="text-lg font-semibold mb-4 text-lime-400">Support</h3>
              <ul className="space-y-2 text-gray-400">
                <li><a href="#" className="hover:text-lime-400">Help Center</a></li>
                <li><a href="#" className="hover:text-lime-400">Contact</a></li>
                <li><a href="#" className="hover:text-lime-400">API Docs</a></li>
              </ul>
            </div>
            <div>
              <h3 className="text-lg font-semibold mb-4 text-lime-400">Legal</h3>
              <ul className="space-y-2 text-gray-400">
                <li><a href="#" className="hover:text-lime-400">Privacy</a></li>
                <li><a href="#" className="hover:text-lime-400">Terms</a></li>
                <li><a href="#" className="hover:text-lime-400">Security</a></li>
              </ul>
            </div>
          </div>
          <div className="border-t border-lime-400/20 mt-8 pt-8 text-center text-gray-400">
            <p>&copy; 2024 XOTC. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}