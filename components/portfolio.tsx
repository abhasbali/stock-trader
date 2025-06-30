"use client";

import { useState, useEffect } from 'react';
import { useUser } from '@clerk/nextjs';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { PieChart, Pie, Cell, ResponsiveContainer, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip } from 'recharts';
import { TrendingUp, TrendingDown, DollarSign, Percent, RefreshCw } from 'lucide-react';
import { usePortfolios } from '@/hooks/use-database';
import { getPositionsByPortfolio } from '@/lib/mock-database';
import { Position } from '@/lib/mock-database';

export function Portfolio() {
  const { user } = useUser();
  const { portfolios, loading: portfoliosLoading } = usePortfolios();
  const [view, setView] = useState<'overview' | 'positions' | 'performance'>('overview');
  const [positions, setPositions] = useState<Position[]>([]);
  const [loading, setLoading] = useState(false);

  const currentPortfolio = portfolios[0]; // Use first portfolio for now

  useEffect(() => {
    if (currentPortfolio && user) {
      fetchPositions();
    }
  }, [currentPortfolio, user]);

  const fetchPositions = async () => {
    if (!currentPortfolio || !user) return;
    
    setLoading(true);
    try {
      const portfolioPositions = getPositionsByPortfolio(user.id, currentPortfolio.id);
      setPositions(portfolioPositions || []);
    } catch (error) {
      console.error('Error fetching positions:', error);
    } finally {
      setLoading(false);
    }
  };

  const portfolioData = {
    totalValue: currentPortfolio?.total_value || 0,
    cashBalance: currentPortfolio?.cash_balance || 0,
    dayChange: positions.reduce((sum, pos) => sum + (pos.unrealized_pnl || 0), 0),
    dayChangePercent: 0, // Calculate based on previous day value
    totalGainLoss: positions.reduce((sum, pos) => sum + (pos.unrealized_pnl || 0), 0),
    totalGainLossPercent: 0 // Calculate based on total invested
  };

  const allocationData = positions.map(pos => ({
    name: pos.symbol,
    value: pos.market_value,
    percentage: ((pos.market_value / portfolioData.totalValue) * 100).toFixed(1)
  }));

  const performanceData = [
    { month: 'Jan', value: 95000 },
    { month: 'Feb', value: 98000 },
    { month: 'Mar', value: 102000 },
    { month: 'Apr', value: 108000 },
    { month: 'May', value: 115000 },
    { month: 'Jun', value: portfolioData.totalValue }
  ];

  const COLORS = ['#84cc16', '#22d3ee', '#f59e0b', '#ef4444', '#8b5cf6'];

  if (portfoliosLoading) {
    return (
      <div className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          {[...Array(4)].map((_, i) => (
            <Card key={i} className="bg-black/40 border-lime-400/30 p-4">
              <div className="animate-pulse">
                <div className="h-4 bg-gray-700 rounded mb-2"></div>
                <div className="h-8 bg-gray-700 rounded mb-2"></div>
                <div className="h-4 bg-gray-700 rounded w-1/2"></div>
              </div>
            </Card>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Portfolio Overview */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="bg-black/40 border-lime-400/30 p-4">
          <div className="flex items-center justify-between">
            <div>
              <div className="text-sm text-gray-400">Total Value</div>
              <div className="text-2xl font-bold text-white">
                ${portfolioData.totalValue.toLocaleString()}
              </div>
            </div>
            <DollarSign className="w-8 h-8 text-lime-400" />
          </div>
        </Card>

        <Card className="bg-black/40 border-lime-400/30 p-4">
          <div className="flex items-center justify-between">
            <div>
              <div className="text-sm text-gray-400">Cash Balance</div>
              <div className="text-2xl font-bold text-white">
                ${portfolioData.cashBalance.toLocaleString()}
              </div>
            </div>
            <DollarSign className="w-8 h-8 text-lime-400" />
          </div>
        </Card>

        <Card className="bg-black/40 border-lime-400/30 p-4">
          <div className="flex items-center justify-between">
            <div>
              <div className="text-sm text-gray-400">Unrealized P&L</div>
              <div className={`text-2xl font-bold ${portfolioData.totalGainLoss >= 0 ? 'text-green-400' : 'text-red-400'}`}>
                {portfolioData.totalGainLoss >= 0 ? '+' : ''}${portfolioData.totalGainLoss.toLocaleString()}
              </div>
            </div>
            {portfolioData.totalGainLoss >= 0 ? 
              <TrendingUp className="w-8 h-8 text-green-400" /> : 
              <TrendingDown className="w-8 h-8 text-red-400" />
            }
          </div>
        </Card>

        <Card className="bg-black/40 border-lime-400/30 p-4">
          <div className="flex items-center justify-between">
            <div>
              <div className="text-sm text-gray-400">Positions</div>
              <div className="text-2xl font-bold text-white">
                {positions.length}
              </div>
            </div>
            <Percent className="w-8 h-8 text-lime-400" />
          </div>
        </Card>
      </div>

      {/* View Toggle */}
      <div className="flex justify-between items-center">
        <div className="flex space-x-2">
          {['overview', 'positions', 'performance'].map((v) => (
            <Button
              key={v}
              variant={view === v ? "default" : "outline"}
              onClick={() => setView(v as any)}
              className={view === v ? "bg-lime-400 text-black" : "border-lime-400/30 text-lime-400"}
            >
              {v.charAt(0).toUpperCase() + v.slice(1)}
            </Button>
          ))}
        </div>
        
        <Button
          variant="outline"
          size="sm"
          onClick={fetchPositions}
          disabled={loading}
          className="border-lime-400/30 text-lime-400"
        >
          <RefreshCw className={`w-4 h-4 mr-2 ${loading ? 'animate-spin' : ''}`} />
          Refresh
        </Button>
      </div>

      {view === 'overview' && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Allocation Chart */}
          <Card className="bg-black/40 border-lime-400/30 p-6">
            <h3 className="text-lg font-semibold text-lime-400 mb-4">Portfolio Allocation</h3>
            {allocationData.length > 0 ? (
              <div className="h-64">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={allocationData}
                      cx="50%"
                      cy="50%"
                      outerRadius={80}
                      fill="#8884d8"
                      dataKey="value"
                      label={({ name, percentage }) => `${name} ${percentage}%`}
                    >
                      {allocationData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip 
                      contentStyle={{ 
                        backgroundColor: '#1f2937', 
                        border: '1px solid #84cc16',
                        borderRadius: '8px',
                        color: '#fff'
                      }}
                    />
                  </PieChart>
                </ResponsiveContainer>
              </div>
            ) : (
              <div className="h-64 flex items-center justify-center text-gray-400">
                No positions to display
              </div>
            )}
          </Card>

          {/* Performance Chart */}
          <Card className="bg-black/40 border-lime-400/30 p-6">
            <h3 className="text-lg font-semibold text-lime-400 mb-4">6-Month Performance</h3>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={performanceData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                  <XAxis dataKey="month" stroke="#9ca3af" />
                  <YAxis stroke="#9ca3af" />
                  <Tooltip 
                    contentStyle={{ 
                      backgroundColor: '#1f2937', 
                      border: '1px solid #84cc16',
                      borderRadius: '8px',
                      color: '#fff'
                    }}
                  />
                  <Bar dataKey="value" fill="#84cc16" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </Card>
        </div>
      )}

      {view === 'positions' && (
        <Card className="bg-black/40 border-lime-400/30 p-6">
          <h3 className="text-lg font-semibold text-lime-400 mb-4">Current Positions</h3>
          {positions.length > 0 ? (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-lime-400/20">
                    <th className="text-left py-3 text-gray-400">Symbol</th>
                    <th className="text-right py-3 text-gray-400">Shares</th>
                    <th className="text-right py-3 text-gray-400">Avg Price</th>
                    <th className="text-right py-3 text-gray-400">Current Price</th>
                    <th className="text-right py-3 text-gray-400">Market Value</th>
                    <th className="text-right py-3 text-gray-400">Unrealized P&L</th>
                    <th className="text-right py-3 text-gray-400">%</th>
                  </tr>
                </thead>
                <tbody>
                  {positions.map((position) => {
                    const gainLossPercent = ((position.current_price - position.average_price) / position.average_price) * 100;
                    return (
                      <tr key={position.id} className="border-b border-gray-700">
                        <td className="py-4 font-semibold text-white">{position.symbol}</td>
                        <td className="py-4 text-right text-gray-300">{position.quantity}</td>
                        <td className="py-4 text-right text-gray-300">${position.average_price.toFixed(2)}</td>
                        <td className="py-4 text-right text-white">${position.current_price.toFixed(2)}</td>
                        <td className="py-4 text-right text-white">${position.market_value.toLocaleString()}</td>
                        <td className={`py-4 text-right ${position.unrealized_pnl >= 0 ? 'text-green-400' : 'text-red-400'}`}>
                          {position.unrealized_pnl >= 0 ? '+' : ''}${position.unrealized_pnl.toFixed(2)}
                        </td>
                        <td className={`py-4 text-right ${gainLossPercent >= 0 ? 'text-green-400' : 'text-red-400'}`}>
                          {gainLossPercent >= 0 ? '+' : ''}{gainLossPercent.toFixed(2)}%
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          ) : (
            <div className="text-center py-8 text-gray-400">
              No positions found. Start trading to see your positions here.
            </div>
          )}
        </Card>
      )}

      {view === 'performance' && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Card className="bg-black/40 border-lime-400/30 p-6">
            <h3 className="text-lg font-semibold text-lime-400 mb-4">Performance Metrics</h3>
            <div className="space-y-4">
              <div className="flex justify-between">
                <span className="text-gray-400">Total Return</span>
                <span className="text-green-400">+14.05%</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-400">Annualized Return</span>
                <span className="text-green-400">+28.1%</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-400">Best Day</span>
                <span className="text-green-400">+$4,230.50</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-400">Worst Day</span>
                <span className="text-red-400">-$2,150.30</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-400">Win Rate</span>
                <span className="text-lime-400">68.5%</span>
              </div>
            </div>
          </Card>

          <Card className="bg-black/40 border-lime-400/30 p-6">
            <h3 className="text-lg font-semibold text-lime-400 mb-4">Risk Metrics</h3>
            <div className="space-y-4">
              <div>
                <div className="flex justify-between mb-2">
                  <span className="text-gray-400">Portfolio Beta</span>
                  <span className="text-white">1.15</span>
                </div>
                <Progress value={75} className="h-2" />
              </div>
              <div>
                <div className="flex justify-between mb-2">
                  <span className="text-gray-400">Sharpe Ratio</span>
                  <span className="text-white">1.85</span>
                </div>
                <Progress value={85} className="h-2" />
              </div>
              <div>
                <div className="flex justify-between mb-2">
                  <span className="text-gray-400">Max Drawdown</span>
                  <span className="text-red-400">-8.5%</span>
                </div>
                <Progress value={15} className="h-2" />
              </div>
            </div>
          </Card>
        </div>
      )}
    </div>
  );
}