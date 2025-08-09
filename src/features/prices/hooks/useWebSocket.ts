import { useEffect, useRef, useCallback } from 'react';
import { CryptoPrice } from '@/shared/types';
import logger from '@/shared/logger';

interface WebSocketMessage {
  type: 'initial_prices' | 'price_update';
  data: CryptoPrice | CryptoPrice[];
}

export const useWebSocket = (
  onPriceUpdate: (price: CryptoPrice) => void,
  onInitialPrices: (prices: CryptoPrice[]) => void,
  onError?: (error: string) => void
) => {
  const wsRef = useRef<WebSocket | null>(null);
  const reconnectTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  const connect = useCallback(() => {
    try {
      const wsUrl = ((import.meta as any).env?.VITE_APP_WS_URL as string) || 'ws://localhost:8000';
      console.log('Connecting to WebSocket URL:', wsUrl);
      console.log('Current origin:', window.location.origin);
      console.log('Environment VITE_APP_WS_URL:', (import.meta as any).env?.VITE_APP_WS_URL);
      console.log('Window location:', window.location.href);
      
      // Create WebSocket connection
      console.log('Creating WebSocket connection...');
      wsRef.current = new WebSocket(wsUrl);
      console.log('WebSocket object created:', wsRef.current);

      wsRef.current.onopen = () => {
        console.log('WebSocket connected successfully');
        console.log('WebSocket readyState:', wsRef.current?.readyState);
        console.log('WebSocket URL:', wsRef.current?.url);
        if (reconnectTimeoutRef.current) {
          clearTimeout(reconnectTimeoutRef.current);
          reconnectTimeoutRef.current = null;
        }
      };

      wsRef.current.onmessage = (event) => {
        try {
          console.log('WebSocket raw message:', event.data);
          console.log('WebSocket raw message type:', typeof event.data);
          console.log('WebSocket raw message length:', event.data.length);
          
          const message: WebSocketMessage = JSON.parse(event.data);
          console.log('WebSocket parsed message:', message);
          console.log('WebSocket message type:', message.type);
          console.log('WebSocket message data:', message.data);
          console.log('WebSocket message data type:', typeof message.data);
          console.log('WebSocket message data is array:', Array.isArray(message.data));
          console.log('WebSocket message data keys:', !Array.isArray(message.data) ? Object.keys(message.data) : 'is array');
          
          switch (message.type) {
            case 'initial_prices':
              if (Array.isArray(message.data)) {
                console.log('Received initial prices:', message.data.length, 'items');
                console.log('Initial prices array:', message.data);
                console.log('Initial prices details:', message.data.map(p => ({ symbol: p.symbol, price: p.price, timestamp: p.timestamp })));
                console.log('First price object:', message.data[0]);
                console.log('First price object keys:', Object.keys(message.data[0] || {}));
                onInitialPrices(message.data);
              } else {
                console.error('Initial prices data is not an array:', message.data);
              }
              break;
            case 'price_update':
              if (!Array.isArray(message.data)) {
                console.log('Received price update message:', message);
                console.log('Price update data:', message.data);
                console.log('Price update data type:', typeof message.data);
                console.log('Price update data keys:', Object.keys(message.data));
                console.log('Price update data symbol:', message.data.symbol);
                console.log('Price update data price:', message.data.price);
                console.log('Calling onPriceUpdate with data:', message.data);
                onPriceUpdate(message.data);
              }
              break;
            default:
              console.warn('Unknown message type:', message.type);
          }
        } catch (error) {
          console.error('Error parsing WebSocket message:', error);
        }
      };

      wsRef.current.onerror = (error) => {
        console.error('WebSocket error:', error);
        console.error('WebSocket error type:', typeof error);
        console.error('WebSocket error details:', error);
        console.error('WebSocket readyState:', wsRef.current?.readyState);
        onError?.('WebSocket connection error');
      };

      wsRef.current.onclose = (event) => {
        console.log('WebSocket disconnected');
        console.log('WebSocket close event:', event);
        console.log('WebSocket close code:', event.code);
        console.log('WebSocket close reason:', event.reason);
        console.log('WebSocket was clean:', event.wasClean);
        
        // Reconnect after 5 seconds
        if (reconnectTimeoutRef.current) {
          clearTimeout(reconnectTimeoutRef.current);
        }
        reconnectTimeoutRef.current = setTimeout(() => {
          console.log('Attempting to reconnect WebSocket...');
          connect();
        }, 5000);
      };
    } catch (error) {
      console.error('Error creating WebSocket connection:', error);
      onError?.('Failed to create WebSocket connection');
    }
  }, [onPriceUpdate, onInitialPrices, onError]);

  const disconnect = useCallback(() => {
    if (wsRef.current) {
      wsRef.current.close();
      wsRef.current = null;
    }
    if (reconnectTimeoutRef.current) {
      clearTimeout(reconnectTimeoutRef.current);
      reconnectTimeoutRef.current = null;
    }
  }, []);

  useEffect(() => {
    connect();

    return () => {
      disconnect();
    };
  }, [connect, disconnect]);

  return {
    isConnected: wsRef.current?.readyState === WebSocket.OPEN,
    disconnect
  };
};
