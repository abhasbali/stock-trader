"use client";

import { useState, useEffect } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, AreaChart, Area } from 'recharts';
import { TrendingUp, TrendingDown } from 'lucide-react';

interface StockChartProps {
  symbol: string;
}

export function StockChart({ symbol }: StockChartProps) {
  const [timeframe, setTimeframe] = useState('1D');
  const [chartData, setChartData] = useState<any[]>([]);
  const [stockInfo, setStockInfo] = useState<any>({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchStockData();
  }, [symbol, timeframe]);

  const fetchStockData = async () => {
    setLoading(true);
    try {
      // Generate mock data for demonstration
      const mockData = generateMockData(timeframe);
      setChartData(mockData);
      
      const mockStockInfo = {
        symbol,
        price: 175.43 + Math.random() * 10 - 5,
        change: (Math.random() - 0.5) * 10,
        changePercent: (Math.random() - 0.5) * 5,
        volume: Math.floor(Math.random() * 1000000) + 500000,
        marketCap: '2.8T',
        pe: 28.5,
        high52w: 198.23,
        low52w: 124.17
      };
      
      setStockInfo(mockStockInfo);
    } catch (error) {
      console.error('Error fetching stock data:', error);
    } finally {
      setLoading(false);
    }
  };

  const generateMockData = (timeframe: string) => {
    const dataPoints = timeframe === '1D' ? 24 : timeframe === '1W' ? 7 : timeframe === '1M' ? 30 : 365;
    const data = [];
    let basePrice = 175;
    
    for (let i = 0; i < dataPoints; i++) {
      const change = (Math.random() - 0.5) * 5;
      basePrice += change;
      data.push({
        time: i,
        price: Math.max(basePrice, 100),
        volume: Math.floor(Math.random() * 1000000) + 100000
      });
    }
    
    return data;
  };

  const timeframes = ['1D', '1W', '1M', '3M', '1Y'];

  if (loading) {
    return (
      <Card className="bg-black/40 border-lime-400/30 p-6">
        <div className="animate-pulse">
          <div className="h-8 bg-gray-700 rounded mb-4"></div>
          <div className="h-64 bg-gray-700 rounded"></div>
        </div>
      </Card>
    );
  }

  return (
    <Card className="bg-black/40 border-lime-400/30 p-6">
      <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center mb-6">
        <div>
          <h2 className="text-2xl font-bold text-white mb-2">{stockInfo.symbol}</h2>
          <div className="flex items-center space-x-4">
            <span className="text-3xl font-bold text-white">
              ${stockInfo.price?.toFixed(2)}
            </span>
            <div className={`flex items-center ${
              stockInfo.change >= 0 ? 'text-green-400' : 'text-red-400'
            }`}>
              {stockInfo.change >= 0 ? <TrendingUp className="w-4 h-4 mr-1" /> : <TrendingDown className="w-4 h-4 mr-1" />}
              <span>{stockInfo.change >= 0 ? '+' : ''}{stockInfo.change?.toFixed(2)}</span>
              <span className="ml-1">({stockInfo.changePercent?.toFixed(2)}%)</span>
            </div>
          </div>
        </div>
        
        <div className="flex space-x-2 mt-4 lg:mt-0">
          {timeframes.map((tf) => (
            <Button
              key={tf}
              variant={timeframe === tf ? "default" : "outline"}
              size="sm"
              onClick={() => setTimeframe(tf)}
              className={timeframe === tf ? "bg-lime-400 text-black" : "border-lime-400/30 text-lime-400"}
            >
              {tf}
            </Button>
          ))}
        </div>
      </div>

      <div className="h-64 mb-6">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={chartData}>
            <defs>
              <linearGradient id="colorPrice" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#84cc16" stopOpacity={0.3}/>
                <stop offset="95%" stopColor="#84cc16" stopOpacity={0}/>
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
            <XAxis 
              dataKey="time" 
              stroke="#9ca3af"
              tick={{ fill: '#9ca3af' }}
            />
            <YAxis 
              stroke="#9ca3af"
              tick={{ fill: '#9ca3af' }}
              domain={['dataMin - 5', 'dataMax + 5']}
            />
            <Tooltip 
              contentStyle={{ 
                backgroundColor: '#1f2937', 
                border: '1px solid #84cc16',
                borderRadius: '8px',
                color: '#fff'
              }}
            />
            <Area 
              type="monotone" 
              dataKey="price" 
              stroke="#84cc16" 
              strokeWidth={2}
              fillOpacity={1} 
              fill="url(#colorPrice)" 
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div>
          <div className="text-sm text-gray-400">Volume</div>
          <div className="text-lg font-semibold text-white">
            {(stockInfo.volume / 1000000).toFixed(1)}M
          </div>
        </div>
        <div>
          <div className="text-sm text-gray-400">Market Cap</div>
          <div className="text-lg font-semibold text-white">{stockInfo.marketCap}</div>
        </div>
        <div>
          <div className="text-sm text-gray-400">P/E Ratio</div>
          <div className="text-lg font-semibold text-white">{stockInfo.pe}</div>
        </div>
        <div>
          <div className="text-sm text-gray-400">52W Range</div>
          <div className="text-lg font-semibold text-white">
            ${stockInfo.low52w} - ${stockInfo.high52w}
          </div>
        </div>
      </div>
    </Card>
  );
}