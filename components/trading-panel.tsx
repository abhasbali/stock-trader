"use client";

import { useState } from 'react';
import { useUser } from '@clerk/nextjs';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { toast } from 'sonner';
import { TrendingUp, TrendingDown, DollarSign } from 'lucide-react';
import { usePortfolios } from '@/hooks/use-database';
import { createTrade, createOrUpdatePosition } from '@/lib/mock-database';

interface TradingPanelProps {
  symbol: string;
}

export function TradingPanel({ symbol }: TradingPanelProps) {
  const { user } = useUser();
  const { portfolios } = usePortfolios();
  const [orderType, setOrderType] = useState('market');
  const [quantity, setQuantity] = useState('');
  const [price, setPrice] = useState('');
  const [stopLoss, setStopLoss] = useState('');
  const [takeProfit, setTakeProfit] = useState('');
  const [loading, setLoading] = useState(false);

  const currentPrice = 175.43; // This would come from real-time data
  const currentPortfolio = portfolios[0]; // Use first portfolio
  const buyingPower = currentPortfolio?.cash_balance || 0;

  const handleTrade = async (action: 'buy' | 'sell') => {
    if (!user || !currentPortfolio) {
      toast.error('Please sign in to trade');
      return;
    }

    if (!quantity) {
      toast.error('Please enter quantity');
      return;
    }

    const tradeQuantity = parseFloat(quantity);
    const tradePrice = orderType === 'market' ? currentPrice : parseFloat(price);
    const totalValue = tradeQuantity * tradePrice;
    
    if (action === 'buy' && totalValue > buyingPower) {
      toast.error('Insufficient buying power');
      return;
    }

    setLoading(true);
    try {
      // Create trade record
      const trade = createTrade(user.id, {
        portfolio_id: currentPortfolio.id,
        symbol,
        side: action,
        quantity: tradeQuantity,
        price: tradePrice,
        total_amount: totalValue,
        status: 'filled', // In real app, this would be 'pending' initially
        executed_at: new Date().toISOString()
      });

      // Update or create position
      createOrUpdatePosition(user.id, {
        portfolio_id: currentPortfolio.id,
        symbol,
        quantity: action === 'buy' ? tradeQuantity : -tradeQuantity,
        average_price: tradePrice,
        current_price: currentPrice,
        market_value: tradeQuantity * currentPrice,
        unrealized_pnl: 0
      });

      toast.success(`${action.toUpperCase()} order for ${quantity} shares of ${symbol} executed successfully!`);
      
      // Reset form
      setQuantity('');
      setPrice('');
      setStopLoss('');
      setTakeProfit('');
    } catch (error) {
      console.error('Trade execution error:', error);
      toast.error('Failed to execute trade. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card className="bg-black/40 border-lime-400/30 p-6">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-xl font-bold text-white">Trade {symbol}</h3>
        <Badge variant="outline" className="border-lime-400 text-lime-400">
          ${currentPrice.toFixed(2)}
        </Badge>
      </div>

      <Tabs defaultValue="buy" className="space-y-4">
        <TabsList className="grid w-full grid-cols-2 bg-black/40 border border-lime-400/30">
          <TabsTrigger value="buy" className="data-[state=active]:bg-green-600">
            <TrendingUp className="w-4 h-4 mr-2" />
            Buy
          </TabsTrigger>
          <TabsTrigger value="sell" className="data-[state=active]:bg-red-600">
            <TrendingDown className="w-4 h-4 mr-2" />
            Sell
          </TabsTrigger>
        </TabsList>

        <TabsContent value="buy" className="space-y-4">
          <div className="space-y-4">
            <div>
              <Label htmlFor="orderType" className="text-gray-300">Order Type</Label>
              <Select value={orderType} onValueChange={setOrderType}>
                <SelectTrigger className="bg-black/40 border-lime-400/30 text-white">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent className="bg-black border-lime-400/30">
                  <SelectItem value="market">Market Order</SelectItem>
                  <SelectItem value="limit">Limit Order</SelectItem>
                  <SelectItem value="stop">Stop Order</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label htmlFor="quantity" className="text-gray-300">Quantity</Label>
              <Input
                id="quantity"
                type="number"
                placeholder="Number of shares"
                value={quantity}
                onChange={(e) => setQuantity(e.target.value)}
                className="bg-black/40 border-lime-400/30 text-white"
              />
            </div>

            {orderType === 'limit' && (
              <div>
                <Label htmlFor="price" className="text-gray-300">Limit Price</Label>
                <Input
                  id="price"
                  type="number"
                  placeholder="Price per share"
                  value={price}
                  onChange={(e) => setPrice(e.target.value)}
                  className="bg-black/40 border-lime-400/30 text-white"
                />
              </div>
            )}

            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="stopLoss" className="text-gray-300">Stop Loss</Label>
                <Input
                  id="stopLoss"
                  type="number"
                  placeholder="Optional"
                  value={stopLoss}
                  onChange={(e) => setStopLoss(e.target.value)}
                  className="bg-black/40 border-lime-400/30 text-white"
                />
              </div>
              <div>
                <Label htmlFor="takeProfit" className="text-gray-300">Take Profit</Label>
                <Input
                  id="takeProfit"
                  type="number"
                  placeholder="Optional"
                  value={takeProfit}
                  onChange={(e) => setTakeProfit(e.target.value)}
                  className="bg-black/40 border-lime-400/30 text-white"
                />
              </div>
            </div>

            <div className="bg-black/20 p-4 rounded-lg">
              <div className="flex justify-between text-sm mb-2">
                <span className="text-gray-400">Estimated Cost:</span>
                <span className="text-white">
                  ${quantity ? (parseFloat(quantity) * currentPrice).toFixed(2) : '0.00'}
                </span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-400">Buying Power:</span>
                <span className="text-lime-400">${buyingPower.toFixed(2)}</span>
              </div>
            </div>

            <Button 
              onClick={() => handleTrade('buy')}
              disabled={loading || !quantity}
              className="w-full bg-green-600 hover:bg-green-700 text-white"
            >
              {loading ? 'Processing...' : `Buy ${symbol}`}
            </Button>
          </div>
        </TabsContent>

        <TabsContent value="sell" className="space-y-4">
          <div className="space-y-4">
            <div>
              <Label htmlFor="orderType" className="text-gray-300">Order Type</Label>
              <Select value={orderType} onValueChange={setOrderType}>
                <SelectTrigger className="bg-black/40 border-lime-400/30 text-white">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent className="bg-black border-lime-400/30">
                  <SelectItem value="market">Market Order</SelectItem>
                  <SelectItem value="limit">Limit Order</SelectItem>
                  <SelectItem value="stop">Stop Order</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label htmlFor="quantity" className="text-gray-300">Quantity</Label>
              <Input
                id="quantity"
                type="number"
                placeholder="Number of shares"
                value={quantity}
                onChange={(e) => setQuantity(e.target.value)}
                className="bg-black/40 border-lime-400/30 text-white"
              />
              <div className="text-xs text-gray-400 mt-1">Check your positions for available shares</div>
            </div>

            {orderType === 'limit' && (
              <div>
                <Label htmlFor="price" className="text-gray-300">Limit Price</Label>
                <Input
                  id="price"
                  type="number"
                  placeholder="Price per share"
                  value={price}
                  onChange={(e) => setPrice(e.target.value)}
                  className="bg-black/40 border-lime-400/30 text-white"
                />
              </div>
            )}

            <div className="bg-black/20 p-4 rounded-lg">
              <div className="flex justify-between text-sm">
                <span className="text-gray-400">Estimated Proceeds:</span>
                <span className="text-white">
                  ${quantity ? (parseFloat(quantity) * currentPrice).toFixed(2) : '0.00'}
                </span>
              </div>
            </div>

            <Button 
              onClick={() => handleTrade('sell')}
              disabled={loading || !quantity}
              className="w-full bg-red-600 hover:bg-red-700 text-white"
            >
              {loading ? 'Processing...' : `Sell ${symbol}`}
            </Button>
          </div>
        </TabsContent>
      </Tabs>

      <div className="mt-6 pt-6 border-t border-lime-400/20">
        <h4 className="text-sm font-semibold text-lime-400 mb-3">Quick Actions</h4>
        <div className="grid grid-cols-2 gap-2">
          <Button variant="outline" size="sm" className="border-lime-400/30 text-lime-400">
            Add to Watchlist
          </Button>
          <Button variant="outline" size="sm" className="border-lime-400/30 text-lime-400">
            Set Alert
          </Button>
        </div>
      </div>
    </Card>
  );
}