"use client";

import { useState } from 'react';
import { loadStripe } from '@stripe/stripe-js';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card } from '@/components/ui/card';
import { CreditCard, DollarSign } from 'lucide-react';
import { toast } from 'sonner';

const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY!);

interface PaymentModalProps {
  isOpen: boolean;
  onClose: () => void;
  type: 'deposit' | 'subscription';
  amount?: number;
}

export function PaymentModal({ isOpen, onClose, type, amount: initialAmount }: PaymentModalProps) {
  const [amount, setAmount] = useState(initialAmount || 100);
  const [loading, setLoading] = useState(false);

  const handlePayment = async () => {
    setLoading(true);
    try {
      const response = await fetch('/api/stripe/create-payment-intent', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ amount }),
      });

      const { clientSecret } = await response.json();
      
      const stripe = await stripePromise;
      if (!stripe) throw new Error('Stripe failed to load');

      // In a real implementation, you would use Stripe Elements here
      // For demo purposes, we'll simulate a successful payment
      toast.success(`Payment of $${amount} processed successfully!`);
      onClose();
    } catch (error) {
      console.error('Payment error:', error);
      toast.error('Payment failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="bg-black border-lime-400/30 text-white">
        <DialogHeader>
          <DialogTitle className="text-lime-400">
            {type === 'deposit' ? 'Deposit Funds' : 'Upgrade Subscription'}
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          {type === 'deposit' && (
            <div>
              <Label htmlFor="amount" className="text-gray-300">Amount to Deposit</Label>
              <div className="relative">
                <DollarSign className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                <Input
                  id="amount"
                  type="number"
                  value={amount}
                  onChange={(e) => setAmount(Number(e.target.value))}
                  className="pl-10 bg-black/40 border-lime-400/30 text-white"
                  min="10"
                  max="10000"
                />
              </div>
            </div>
          )}

          {type === 'subscription' && (
            <div className="space-y-4">
              <Card className="bg-black/40 border-lime-400/30 p-4">
                <h3 className="text-lg font-semibold text-lime-400 mb-2">Pro Trading Plan</h3>
                <div className="text-2xl font-bold text-white mb-2">$99/month</div>
                <ul className="text-sm text-gray-300 space-y-1">
                  <li>• Real-time market data</li>
                  <li>• Advanced charting tools</li>
                  <li>• AI trading assistant</li>
                  <li>• Priority support</li>
                  <li>• No trading fees</li>
                </ul>
              </Card>
            </div>
          )}

          <div className="space-y-4">
            <div className="bg-black/20 p-4 rounded-lg">
              <div className="flex justify-between text-sm mb-2">
                <span className="text-gray-400">Amount:</span>
                <span className="text-white">${amount}</span>
              </div>
              <div className="flex justify-between text-sm mb-2">
                <span className="text-gray-400">Processing Fee:</span>
                <span className="text-white">$0.00</span>
              </div>
              <div className="border-t border-gray-600 pt-2">
                <div className="flex justify-between font-semibold">
                  <span className="text-gray-300">Total:</span>
                  <span className="text-lime-400">${amount}</span>
                </div>
              </div>
            </div>

            <Button
              onClick={handlePayment}
              disabled={loading || amount < 10}
              className="w-full bg-lime-400 text-black hover:bg-lime-500"
            >
              <CreditCard className="w-4 h-4 mr-2" />
              {loading ? 'Processing...' : `Pay $${amount}`}
            </Button>
          </div>

          <div className="text-xs text-gray-400 text-center">
            Payments are processed securely by Stripe. Your card information is never stored on our servers.
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}