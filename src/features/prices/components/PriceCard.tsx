import React from 'react';
import { CryptoPrice } from '@/shared/types';
import { Card } from '@/shared/ui/Card';
import { TrendingUp, TrendingDown } from 'lucide-react';

interface PriceCardProps {
  price: CryptoPrice;
  previousPrice?: number;
}

export const PriceCard: React.FC<PriceCardProps> = ({ price, previousPrice }) => {
  const formatPrice = (priceValue: number) => {
    if (priceValue >= 1) {
      return priceValue.toFixed(2);
    } else if (priceValue >= 0.01) {
      return priceValue.toFixed(4);
    } else {
      return priceValue.toFixed(8);
    }
  };

  const getPriceChange = () => {
    if (!previousPrice) return null;
    
    const current = price.price;
    const previous = previousPrice;
    const change = current - previous;
    const changePercent = (change / previous) * 100;
    
    return {
      change,
      changePercent,
      isPositive: change >= 0
    };
  };

  const priceChange = getPriceChange();

  return (
    <Card className="hover:shadow-md transition-shadow">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-lg font-semibold text-gray-900">
            {price.symbol.replace('USDT', '')}
          </h3>
          <p className="text-sm text-gray-500">vs USDT</p>
        </div>
        
        <div className="text-right">
          <p className="text-xl font-bold text-gray-900">
            ${formatPrice(price.price)}
          </p>
          
          {priceChange && (
            <div className={`flex items-center text-sm ${
              priceChange.isPositive ? 'text-crypto-green' : 'text-crypto-red'
            }`}>
              {priceChange.isPositive ? (
                <TrendingUp className="w-4 h-4 mr-1" />
              ) : (
                <TrendingDown className="w-4 h-4 mr-1" />
              )}
              {priceChange.isPositive ? '+' : ''}{priceChange.changePercent.toFixed(2)}%
            </div>
          )}
        </div>
      </div>
      
      <div className="mt-2 text-xs text-gray-400">
        Last updated: {new Date(price.timestamp).toLocaleTimeString()}
      </div>
    </Card>
  );
};



