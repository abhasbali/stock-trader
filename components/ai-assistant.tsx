"use client";

import { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Badge } from '@/components/ui/badge';
import { Bot, Send, TrendingUp, AlertTriangle, Lightbulb } from 'lucide-react';

interface Message {
  id: string;
  type: 'user' | 'assistant';
  content: string;
  timestamp: Date;
}

export function AIAssistant() {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      type: 'assistant',
      content: "Hello! I'm your AI trading assistant. I can help you with market analysis, trading strategies, and portfolio optimization. What would you like to know?",
      timestamp: new Date()
    }
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const quickActions = [
    { label: 'Market Analysis', icon: TrendingUp },
    { label: 'Risk Assessment', icon: AlertTriangle },
    { label: 'Trading Ideas', icon: Lightbulb }
  ];

  const handleSendMessage = async () => {
    if (!input.trim()) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      type: 'user',
      content: input,
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setIsLoading(true);

    // Simulate AI response
    setTimeout(() => {
      const aiResponse: Message = {
        id: (Date.now() + 1).toString(),
        type: 'assistant',
        content: generateAIResponse(input),
        timestamp: new Date()
      };
      setMessages(prev => [...prev, aiResponse]);
      setIsLoading(false);
    }, 1500);
  };

  const generateAIResponse = (userInput: string): string => {
    const responses = {
      market: "Based on current market conditions, I see strong momentum in tech stocks. The S&P 500 is showing bullish patterns with support at 4,200. Consider diversifying with some defensive positions.",
      risk: "Your current portfolio has a beta of 1.15, indicating higher volatility than the market. I recommend reducing exposure to high-risk assets and adding some bonds or dividend stocks for stability.",
      trading: "Here are some trading opportunities I've identified: AAPL showing bullish divergence on RSI, MSFT breaking resistance at $380, and NVDA forming a cup and handle pattern. Consider these for your watchlist.",
      default: "I understand you're looking for trading insights. Could you be more specific about what you'd like to know? I can help with technical analysis, risk management, or specific stock recommendations."
    };

    const lowerInput = userInput.toLowerCase();
    if (lowerInput.includes('market') || lowerInput.includes('analysis')) return responses.market;
    if (lowerInput.includes('risk') || lowerInput.includes('portfolio')) return responses.risk;
    if (lowerInput.includes('trade') || lowerInput.includes('buy') || lowerInput.includes('sell')) return responses.trading;
    return responses.default;
  };

  const handleQuickAction = (action: string) => {
    setInput(action);
  };

  return (
    <Card className="bg-black/40 border-lime-400/30 p-4 h-96 flex flex-col">
      <div className="flex items-center space-x-2 mb-4">
        <Bot className="w-5 h-5 text-lime-400" />
        <h3 className="text-lg font-semibold text-lime-400">AI Assistant</h3>
        <Badge variant="outline" className="border-lime-400 text-lime-400 text-xs">
          BETA
        </Badge>
      </div>

      <ScrollArea className="flex-1 mb-4">
        <div className="space-y-4">
          {messages.map((message) => (
            <div
              key={message.id}
              className={`flex ${message.type === 'user' ? 'justify-end' : 'justify-start'}`}
            >
              <div
                className={`max-w-[80%] p-3 rounded-lg ${
                  message.type === 'user'
                    ? 'bg-lime-400 text-black'
                    : 'bg-gray-800 text-white border border-lime-400/20'
                }`}
              >
                <p className="text-sm">{message.content}</p>
                <div className="text-xs opacity-70 mt-1">
                  {message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                </div>
              </div>
            </div>
          ))}
          {isLoading && (
            <div className="flex justify-start">
              <div className="bg-gray-800 text-white border border-lime-400/20 p-3 rounded-lg">
                <div className="flex space-x-1">
                  <div className="w-2 h-2 bg-lime-400 rounded-full animate-bounce"></div>
                  <div className="w-2 h-2 bg-lime-400 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                  <div className="w-2 h-2 bg-lime-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                </div>
              </div>
            </div>
          )}
        </div>
      </ScrollArea>

      <div className="space-y-3">
        <div className="flex flex-wrap gap-2">
          {quickActions.map((action) => (
            <Button
              key={action.label}
              variant="outline"
              size="sm"
              onClick={() => handleQuickAction(action.label)}
              className="border-lime-400/30 text-lime-400 text-xs"
            >
              <action.icon className="w-3 h-3 mr-1" />
              {action.label}
            </Button>
          ))}
        </div>

        <div className="flex space-x-2">
          <Input
            placeholder="Ask me anything about trading..."
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
            className="bg-black/40 border-lime-400/30 text-white placeholder-gray-400"
          />
          <Button
            onClick={handleSendMessage}
            disabled={!input.trim() || isLoading}
            className="bg-lime-400 text-black hover:bg-lime-500"
          >
            <Send className="w-4 h-4" />
          </Button>
        </div>
      </div>
    </Card>
  );
}