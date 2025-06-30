"use client";

import { useState, useEffect } from 'react';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { ExternalLink, Clock, TrendingUp } from 'lucide-react';

interface MarketNewsProps {
  symbol: string;
}

export function MarketNews({ symbol }: MarketNewsProps) {
  const [news, setNews] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchNews();
  }, [symbol]);

  const fetchNews = async () => {
    setLoading(true);
    try {
      // Mock news data for demonstration
      const mockNews = [
        {
          id: 1,
          title: `${symbol} Reports Strong Q4 Earnings, Beats Expectations`,
          summary: "The company reported revenue of $123.9 billion, up 8% year-over-year, driven by strong performance across all segments.",
          source: "Financial Times",
          publishedAt: "2024-01-15T10:30:00Z",
          sentiment: "positive",
          url: "#"
        },
        {
          id: 2,
          title: `Analysts Upgrade ${symbol} Price Target Following Innovation Announcement`,
          summary: "Multiple analysts have raised their price targets following the company's announcement of breakthrough technology developments.",
          source: "Reuters",
          publishedAt: "2024-01-15T08:15:00Z",
          sentiment: "positive",
          url: "#"
        },
        {
          id: 3,
          title: `Market Volatility Affects ${symbol} Trading Volume`,
          summary: "Increased market volatility has led to higher than average trading volumes across major tech stocks including this company.",
          source: "Bloomberg",
          publishedAt: "2024-01-14T16:45:00Z",
          sentiment: "neutral",
          url: "#"
        },
        {
          id: 4,
          title: `${symbol} Announces Strategic Partnership with AI Company`,
          summary: "The partnership aims to integrate advanced AI capabilities into the company's existing product ecosystem.",
          source: "TechCrunch",
          publishedAt: "2024-01-14T14:20:00Z",
          sentiment: "positive",
          url: "#"
        },
        {
          id: 5,
          title: `Regulatory Concerns Impact ${symbol} Stock Performance`,
          summary: "New regulatory proposals in the tech sector have created uncertainty among investors.",
          source: "Wall Street Journal",
          publishedAt: "2024-01-14T11:30:00Z",
          sentiment: "negative",
          url: "#"
        }
      ];
      
      setNews(mockNews);
    } catch (error) {
      console.error('Error fetching news:', error);
    } finally {
      setLoading(false);
    }
  };

  const formatTimeAgo = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffInHours = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60));
    
    if (diffInHours < 1) return 'Just now';
    if (diffInHours < 24) return `${diffInHours}h ago`;
    return `${Math.floor(diffInHours / 24)}d ago`;
  };

  const getSentimentColor = (sentiment: string) => {
    switch (sentiment) {
      case 'positive': return 'bg-green-600';
      case 'negative': return 'bg-red-600';
      default: return 'bg-gray-600';
    }
  };

  if (loading) {
    return (
      <Card className="bg-black/40 border-lime-400/30 p-6">
        <div className="animate-pulse space-y-4">
          {[...Array(3)].map((_, i) => (
            <div key={i} className="space-y-2">
              <div className="h-4 bg-gray-700 rounded w-3/4"></div>
              <div className="h-3 bg-gray-700 rounded w-1/2"></div>
            </div>
          ))}
        </div>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-white">Market News</h2>
        <Button 
          variant="outline" 
          size="sm"
          onClick={fetchNews}
          className="border-lime-400/30 text-lime-400"
        >
          Refresh
        </Button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {news.map((article) => (
          <Card key={article.id} className="bg-black/40 border-lime-400/30 p-6 hover:border-lime-400 transition-colors">
            <div className="space-y-4">
              <div className="flex items-start justify-between">
                <Badge 
                  variant="secondary" 
                  className={`${getSentimentColor(article.sentiment)} text-white`}
                >
                  {article.sentiment}
                </Badge>
                <div className="flex items-center text-sm text-gray-400">
                  <Clock className="w-3 h-3 mr-1" />
                  {formatTimeAgo(article.publishedAt)}
                </div>
              </div>

              <h3 className="text-lg font-semibold text-white leading-tight">
                {article.title}
              </h3>

              <p className="text-gray-300 text-sm leading-relaxed">
                {article.summary}
              </p>

              <div className="flex items-center justify-between pt-4 border-t border-gray-700">
                <span className="text-sm text-lime-400 font-medium">
                  {article.source}
                </span>
                <Button 
                  variant="ghost" 
                  size="sm"
                  className="text-lime-400 hover:text-lime-300"
                >
                  Read More
                  <ExternalLink className="w-3 h-3 ml-1" />
                </Button>
              </div>
            </div>
          </Card>
        ))}
      </div>

      {/* Market Sentiment Summary */}
      <Card className="bg-black/40 border-lime-400/30 p-6">
        <h3 className="text-lg font-semibold text-lime-400 mb-4">Market Sentiment Analysis</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="text-center">
            <div className="text-2xl font-bold text-green-400">65%</div>
            <div className="text-sm text-gray-400">Positive</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-gray-400">25%</div>
            <div className="text-sm text-gray-400">Neutral</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-red-400">10%</div>
            <div className="text-sm text-gray-400">Negative</div>
          </div>
        </div>
        <div className="mt-4 flex items-center justify-center">
          <TrendingUp className="w-5 h-5 text-green-400 mr-2" />
          <span className="text-green-400 font-medium">Overall Bullish Sentiment</span>
        </div>
      </Card>
    </div>
  );
}