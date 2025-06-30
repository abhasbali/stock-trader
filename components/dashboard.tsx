"use client";

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { UserButton } from '@clerk/nextjs';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { StockChart } from '@/components/stock-chart';
import { Portfolio } from '@/components/portfolio';
import { TradingPanel } from '@/components/trading-panel';
import { MarketNews } from '@/components/market-news';
import { AIAssistant } from '@/components/ai-assistant';
import { ThemeToggle } from '@/components/theme-toggle';
import { usePortfolios, useWatchlists } from '@/hooks/use-database';
import { 
  Search, 
  TrendingUp, 
  TrendingDown, 
  DollarSign,
  BarChart3,
  Wallet,
  Bell,
  Settings,
  Menu,
  X
} from 'lucide-react';

export function Dashboard() {
  const { portfolios, loading: portfoliosLoading } = usePortfolios();
  const { watchlists, loading: watchlistsLoading } = useWatchlists();
  const [selectedStock, setSelectedStock] = useState('AAPL');
  const [searchQuery, setSearchQuery] = useState('');
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [marketData, setMarketData] = useState<any>({});

  const currentPortfolio = portfolios[0];
  const currentWatchlist = watchlists[0];

  useEffect(() => {
    // Fetch initial market data
    fetchMarketData();
    
    // Set up real-time updates
    const interval = setInterval(fetchMarketData, 30000); // Update every 30 seconds
    
    return () => clearInterval(interval);
  }, []);

  const fetchMarketData = async () => {
    try {
      // Simulate real-time market data
      const mockData = {
        AAPL: { price: 175.43, change: 2.34, changePercent: 1.35 },
        GOOGL: { price: 2847.23, change: -15.67, changePercent: -0.55 },
        MSFT: { price: 378.91, change: 4.12, changePercent: 1.10 },
        TSLA: { price: 248.73, change: -8.45, changePercent: -3.28 },
        NVDA: { price: 456.78, change: 12.34, changePercent: 2.78 }
      };
      setMarketData(mockData);
    } catch (error) {
      console.error('Error fetching market data:', error);
    }
  };

  const getWatchlistSymbols = () => {
    if (!currentWatchlist?.symbols) return ['AAPL', 'GOOGL', 'MSFT', 'TSLA', 'NVDA'];
    try {
      return JSON.parse(currentWatchlist.symbols);
    } catch {
      return ['AAPL', 'GOOGL', 'MSFT', 'TSLA', 'NVDA'];
    }
  };

  const watchlistSymbols = getWatchlistSymbols();
  const topStocks = watchlistSymbols.map((symbol: string) => ({
    symbol,
    ...(marketData[symbol] || { price: 0, change: 0, changePercent: 0 })
  }));

  const portfolioStats = {
    totalValue: currentPortfolio?.total_value || 0,
    cashBalance: currentPortfolio?.cash_balance || 0,
    dayPnL: 0, // Calculate from positions
    totalTrades: 0 // Get from trades table
  };

  return (
    <div className="min-h-screen matrix-bg text-white">
      {/* Header */}
      <header className="bg-black/20 backdrop-blur-md border-b border-lime-400/20 sticky top-0 z-50">
        <div className="flex items-center justify-between p-4">
          <div className="flex items-center space-x-4">
            <button
              onClick={() => setIsSidebarOpen(!isSidebarOpen)}
              className="lg:hidden"
            >
              {isSidebarOpen ? <X /> : <Menu />}
            </button>
            <h1 className="text-2xl font-bold neon-text">XOTC</h1>
          </div>

          <div className="flex-1 max-w-md mx-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <Input
                placeholder="Search stocks, crypto, forex..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 bg-black/40 border-lime-400/30 text-white placeholder-gray-400"
              />
            </div>
          </div>

          <div className="flex items-center space-x-4">
            <ThemeToggle />
            <Button variant="ghost" size="icon">
              <Bell className="w-5 h-5" />
            </Button>
            <Button variant="ghost" size="icon">
              <Settings className="w-5 h-5" />
            </Button>
            <UserButton afterSignOutUrl="/" />
          </div>
        </div>
      </header>

      <div className="flex">
        {/* Sidebar */}
        <aside className={`${
          isSidebarOpen ? 'translate-x-0' : '-translate-x-full'
        } lg:translate-x-0 fixed lg:static inset-y-0 left-0 z-40 w-64 bg-black/40 backdrop-blur-md border-r border-lime-400/20 transition-transform duration-300 ease-in-out`}>
          <div className="p-4 space-y-4">
            <div>
              <h3 className="text-sm font-semibold text-lime-400 mb-2">WATCHLIST</h3>
              {watchlistsLoading ? (
                <div className="space-y-2">
                  {[...Array(5)].map((_, i) => (
                    <div key={i} className="animate-pulse">
                      <div className="h-16 bg-gray-700 rounded"></div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="space-y-2">
                  {topStocks.map((stock) => (
                    <motion.div
                      key={stock.symbol}
                      className={`p-3 rounded-lg cursor-pointer transition-all ${
                        selectedStock === stock.symbol 
                          ? 'bg-lime-400/20 border border-lime-400' 
                          : 'bg-black/20 hover:bg-black/40'
                      }`}
                      onClick={() => setSelectedStock(stock.symbol)}
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                    >
                      <div className="flex justify-between items-center">
                        <span className="font-semibold">{stock.symbol}</span>
                        <span className={`text-sm ${
                          stock.change >= 0 ? 'text-green-400' : 'text-red-400'
                        }`}>
                          {stock.change >= 0 ? '+' : ''}{stock.changePercent?.toFixed(2)}%
                        </span>
                      </div>
                      <div className="text-sm text-gray-400">
                        ${stock.price?.toFixed(2)}
                      </div>
                    </motion.div>
                  ))}
                </div>
              )}
            </div>

            <div>
              <h3 className="text-sm font-semibold text-lime-400 mb-2">QUICK ACTIONS</h3>
              <div className="space-y-2">
                <Button variant="outline" className="w-full justify-start border-lime-400/30">
                  <DollarSign className="w-4 h-4 mr-2" />
                  Deposit Funds
                </Button>
                <Button variant="outline" className="w-full justify-start border-lime-400/30">
                  <Wallet className="w-4 h-4 mr-2" />
                  Withdraw
                </Button>
                <Button variant="outline" className="w-full justify-start border-lime-400/30">
                  <BarChart3 className="w-4 h-4 mr-2" />
                  Analytics
                </Button>
              </div>
            </div>
          </div>
        </aside>

        {/* Main Content */}
        <main className="flex-1 p-4 lg:p-6">
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
            {/* Market Overview */}
            <div className="lg:col-span-3 space-y-6">
              {/* Market Stats */}
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                {portfoliosLoading ? (
                  [...Array(4)].map((_, i) => (
                    <Card key={i} className="bg-black/40 border-lime-400/30 p-4">
                      <div className="animate-pulse">
                        <div className="h-4 bg-gray-700 rounded mb-2"></div>
                        <div className="h-8 bg-gray-700 rounded mb-2"></div>
                        <div className="h-4 bg-gray-700 rounded w-1/2"></div>
                      </div>
                    </Card>
                  ))
                ) : (
                  [
                    { label: 'Portfolio Value', value: `$${portfolioStats.totalValue.toLocaleString()}`, change: '+2.34%', positive: true },
                    { label: 'Cash Balance', value: `$${portfolioStats.cashBalance.toLocaleString()}`, change: '', positive: true },
                    { label: 'Day P&L', value: `$${portfolioStats.dayPnL.toLocaleString()}`, change: '+1.85%', positive: portfolioStats.dayPnL >= 0 },
                    { label: 'Total Trades', value: portfolioStats.totalTrades.toString(), change: '+12', positive: true }
                  ].map((stat, index) => (
                    <motion.div
                      key={index}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.1 }}
                    >
                      <Card className="bg-black/40 border-lime-400/30 p-4">
                        <div className="text-sm text-gray-400">{stat.label}</div>
                        <div className="text-2xl font-bold text-white">{stat.value}</div>
                        {stat.change && (
                          <div className={`text-sm flex items-center ${
                            stat.positive ? 'text-green-400' : 'text-red-400'
                          }`}>
                            {stat.positive ? <TrendingUp className="w-3 h-3 mr-1" /> : <TrendingDown className="w-3 h-3 mr-1" />}
                            {stat.change}
                          </div>
                        )}
                      </Card>
                    </motion.div>
                  ))
                )}
              </div>

              {/* Chart and Trading */}
              <Tabs defaultValue="chart" className="space-y-4">
                <TabsList className="bg-black/40 border border-lime-400/30">
                  <TabsTrigger value="chart">Chart</TabsTrigger>
                  <TabsTrigger value="portfolio">Portfolio</TabsTrigger>
                  <TabsTrigger value="news">News</TabsTrigger>
                </TabsList>

                <TabsContent value="chart">
                  <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
                    <div className="xl:col-span-2">
                      <StockChart symbol={selectedStock} />
                    </div>
                    <div>
                      <TradingPanel symbol={selectedStock} />
                    </div>
                  </div>
                </TabsContent>

                <TabsContent value="portfolio">
                  <Portfolio />
                </TabsContent>

                <TabsContent value="news">
                  <MarketNews symbol={selectedStock} />
                </TabsContent>
              </Tabs>
            </div>

            {/* Right Sidebar */}
            <div className="space-y-6">
              <AIAssistant />
              
              {/* Market Movers */}
              <Card className="bg-black/40 border-lime-400/30 p-4">
                <h3 className="text-lg font-semibold mb-4 text-lime-400">Market Movers</h3>
                <div className="space-y-3">
                  {topStocks.slice(0, 5).map((stock) => (
                    <div key={stock.symbol} className="flex justify-between items-center">
                      <div>
                        <div className="font-semibold">{stock.symbol}</div>
                        <div className="text-sm text-gray-400">${stock.price?.toFixed(2)}</div>
                      </div>
                      <Badge variant={stock.change >= 0 ? "default" : "destructive"}>
                        {stock.change >= 0 ? '+' : ''}{stock.changePercent?.toFixed(2)}%
                      </Badge>
                    </div>
                  ))}
                </div>
              </Card>

              {/* Recent Trades */}
              <Card className="bg-black/40 border-lime-400/30 p-4">
                <h3 className="text-lg font-semibold mb-4 text-lime-400">Recent Trades</h3>
                <div className="space-y-3">
                  <div className="text-center py-4 text-gray-400">
                    No recent trades
                  </div>
                </div>
              </Card>
            </div>
          </div>
        </main>
      </div>

      {/* Mobile Sidebar Overlay */}
      {isSidebarOpen && (
        <div 
          className="fixed inset-0 bg-black/50 z-30 lg:hidden"
          onClick={() => setIsSidebarOpen(false)}
        />
      )}
    </div>
  );
}