import React from 'react';
import { PriceCard, PriceCardSkeleton } from './PriceCard';
import { usePrices } from '../hooks/usePrices';
import { RefreshCw } from 'lucide-react';
import { Button } from '@/shared/ui/Button';

interface PriceListProps {
  symbols?: string[];
}

export const PriceList: React.FC<PriceListProps> = ({ symbols }) => {
  const { prices, isLoading, error, refetch, isConnected } = usePrices(symbols);

  if (isLoading) {
    return (
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <h2 className="text-xl font-semibold text-gray-900">Live Crypto Prices</h2>
            <div className="flex items-center gap-2">
              <div className={`w-2 h-2 rounded-full ${isConnected ? 'bg-green-500' : 'bg-red-500'}`}></div>
              <span className="text-sm text-gray-600">{isConnected ? 'Live Data' : 'Static Data'}</span>
            </div>
          </div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {Array.from({ length: 6 }).map((_, i) => (
            <PriceCardSkeleton key={i} />
          ))}
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-8">
        <p className="text-red-600 mb-4">Failed to load prices</p>
        <Button onClick={() => refetch()} variant="outline">
          Try Again
        </Button>
      </div>
    );
  }

  if (!prices.length) {
    return (
      <div className="text-center py-8">
        <p className="text-gray-600">No prices available</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <h2 className="text-xl font-semibold text-gray-900">
            Live Crypto Prices
          </h2>
          <div className="flex items-center gap-2">
            <div className={`w-2 h-2 rounded-full ${isConnected ? 'bg-green-500' : 'bg-red-500'}`}></div>
            <span className="text-sm text-gray-600">
              {isConnected ? 'Live Data' : 'Static Data'}
            </span>
          </div>
        </div>
        <Button
          onClick={() => refetch()}
          variant="ghost"
          size="sm"
          className="text-gray-600 hover:text-gray-900"
        >
          <RefreshCw className="w-4 h-4 mr-1" />
          Refresh
        </Button>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {prices.map((price) => (
          <PriceCard key={price.symbol} price={price} />
        ))}
      </div>
    </div>
  );
};



