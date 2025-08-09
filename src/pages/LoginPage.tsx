import React from 'react';
import { TelegramLogin } from '@/features/auth/components/TelegramLogin';
import { Card } from '@/shared/ui/Card';

export const LoginPage: React.FC = () => {
  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <Card className="p-8">
          <div className="flex justify-center">
            <TelegramLogin variant="icon" />
          </div>
        </Card>
        
        <div className="text-center">
          <p className="text-sm text-gray-500">
            Powered by Binance WebSocket API
          </p>
        </div>
      </div>
    </div>
  );
};




