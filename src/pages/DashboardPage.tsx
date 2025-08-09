import React from 'react';
import { PriceList } from '../widgets/Prices';
import { CryptoTable } from '../widgets/Prices';
import { usePrices } from '@/features/prices/hooks/usePrices';
import { useAuth } from '@/features/auth/hooks/useAuth';
import { Button } from '@/shared/ui/Button';
import { LogOut, User } from 'lucide-react';

export const DashboardPage: React.FC = () => {
  const { user, logout } = useAuth();
  const { prices, isConnected, isLoading, error } = usePrices(['BTCUSDT', 'ETHUSDT', 'SOLUSDT']);

  

  const defaultSymbols = ['BTCUSDT', 'ETHUSDT', 'BNBUSDT', 'ADAUSDT', 'SOLUSDT'];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
              <h1 className="text-xl font-semibold text-gray-900">
                Crypto Price Tracker
              </h1>
            </div>
            
            <div className="flex items-center space-x-4">
              {user && (
                <div className="flex items-center space-x-2 text-sm text-gray-600">
                  <User className="w-4 h-4" />
                  <span>
                    {user.first_name} {user.last_name}
                    {user.username && ` (@${user.username})`}
                  </span>
                </div>
              )}
              
              <Button
                onClick={logout}
                variant="outline"
                size="sm"
                className="text-gray-600 hover:text-gray-900"
              >
                <LogOut className="w-4 h-4 mr-1" />
                Logout
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        <div className="px-4 py-6 sm:px-0">
          <div className="space-y-8">
            <PriceList symbols={defaultSymbols} />
            <CryptoTable prices={prices} isConnected={isConnected} />
          </div>
        </div>
      </main>
    </div>
  );
};
