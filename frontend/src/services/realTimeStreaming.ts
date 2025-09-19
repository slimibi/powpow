interface StreamConfig {
  endpoint: string;
  reconnectInterval: number;
  maxReconnectAttempts: number;
  heartbeatInterval: number;
}

interface DataStreamMessage {
  type: 'data' | 'heartbeat' | 'error' | 'connected' | 'disconnected';
  timestamp: number;
  source: string;
  data: any;
  metadata?: {
    sequence?: number;
    version?: string;
    checksum?: string;
  };
}

interface StreamSubscription {
  id: string;
  source: string;
  filters?: Record<string, any>;
  transform?: (data: any) => any;
  onData: (data: any) => void;
  onError?: (error: Error) => void;
  onConnected?: () => void;
  onDisconnected?: () => void;
}

export class RealTimeStreamingService {
  private connections: Map<string, WebSocket> = new Map();
  private subscriptions: Map<string, StreamSubscription[]> = new Map();
  private reconnectAttempts: Map<string, number> = new Map();
  private heartbeatIntervals: Map<string, NodeJS.Timeout> = new Map();
  private isReconnecting: Map<string, boolean> = new Map();

  private defaultConfig: StreamConfig = {
    endpoint: 'ws://localhost:8080/stream',
    reconnectInterval: 5000,
    maxReconnectAttempts: 10,
    heartbeatInterval: 30000
  };

  // Connect to a data stream
  async connect(source: string, config?: Partial<StreamConfig>): Promise<void> {
    const streamConfig = { ...this.defaultConfig, ...config };
    
    if (this.connections.has(source)) {
      console.log(`Already connected to ${source}`);
      return;
    }

    return new Promise((resolve, reject) => {
      try {
        // For demo purposes, we'll simulate WebSocket connection
        // In production, this would be: new WebSocket(`${streamConfig.endpoint}/${source}`);
        const ws = this.createMockWebSocket(source);
        
        ws.onopen = () => {
          console.log(`Connected to stream: ${source}`);
          this.connections.set(source, ws);
          this.reconnectAttempts.set(source, 0);
          this.isReconnecting.set(source, false);
          
          // Start heartbeat
          this.startHeartbeat(source, streamConfig.heartbeatInterval);
          
          // Notify subscribers
          this.notifySubscribers(source, 'connected', null);
          resolve();
        };

        ws.onmessage = (event) => {
          try {
            const message: DataStreamMessage = JSON.parse(event.data);
            this.handleMessage(source, message);
          } catch (error) {
            console.error('Error parsing stream message:', error);
          }
        };

        ws.onclose = () => {
          console.log(`Disconnected from stream: ${source}`);
          this.handleDisconnection(source, streamConfig);
        };

        ws.onerror = (error) => {
          console.error(`Stream error for ${source}:`, error);
          this.notifySubscribers(source, 'error', error);
          reject(error);
        };

      } catch (error) {
        reject(error);
      }
    });
  }

  // Subscribe to data updates from a stream
  subscribe(subscription: StreamSubscription): () => void {
    const { source, id } = subscription;
    
    if (!this.subscriptions.has(source)) {
      this.subscriptions.set(source, []);
    }
    
    this.subscriptions.get(source)!.push(subscription);
    
    // Auto-connect if not already connected
    if (!this.connections.has(source)) {
      this.connect(source).catch(error => {
        subscription.onError?.(error);
      });
    }
    
    // Return unsubscribe function
    return () => {
      this.unsubscribe(source, id);
    };
  }

  // Unsubscribe from a stream
  unsubscribe(source: string, subscriptionId: string): void {
    const subs = this.subscriptions.get(source);
    if (subs) {
      const filtered = subs.filter(sub => sub.id !== subscriptionId);
      this.subscriptions.set(source, filtered);
      
      // Disconnect if no more subscribers
      if (filtered.length === 0) {
        this.disconnect(source);
      }
    }
  }

  // Disconnect from a stream
  disconnect(source: string): void {
    const ws = this.connections.get(source);
    if (ws) {
      ws.close();
      this.connections.delete(source);
    }
    
    // Clear heartbeat
    const heartbeat = this.heartbeatIntervals.get(source);
    if (heartbeat) {
      clearInterval(heartbeat);
      this.heartbeatIntervals.delete(source);
    }
    
    // Clear reconnect attempts
    this.reconnectAttempts.delete(source);
    this.isReconnecting.delete(source);
    
    // Notify subscribers
    this.notifySubscribers(source, 'disconnected', null);
  }

  // Get connection status
  getConnectionStatus(source: string): 'connected' | 'disconnected' | 'reconnecting' {
    if (this.isReconnecting.get(source)) return 'reconnecting';
    return this.connections.has(source) ? 'connected' : 'disconnected';
  }

  // Get all active connections
  getActiveConnections(): string[] {
    return Array.from(this.connections.keys());
  }

  // Send data to a stream (for bidirectional communication)
  sendData(source: string, data: any): boolean {
    const ws = this.connections.get(source);
    if (ws && ws.readyState === WebSocket.OPEN) {
      const message: DataStreamMessage = {
        type: 'data',
        timestamp: Date.now(),
        source: 'client',
        data
      };
      ws.send(JSON.stringify(message));
      return true;
    }
    return false;
  }

  private createMockWebSocket(source: string): WebSocket {
    // Mock WebSocket for demo purposes
    const mockWS = {
      readyState: WebSocket.CONNECTING,
      onopen: null as any,
      onmessage: null as any,
      onclose: null as any,
      onerror: null as any,
      send: (data: string) => console.log(`Mock send to ${source}:`, data),
      close: () => {
        mockWS.readyState = WebSocket.CLOSED;
        mockWS.onclose?.();
      }
    };

    // Simulate connection
    setTimeout(() => {
      mockWS.readyState = WebSocket.OPEN;
      mockWS.onopen?.();
      
      // Start sending mock data
      this.startMockDataStream(source, mockWS);
    }, 1000);

    return mockWS as any;
  }

  private startMockDataStream(source: string, ws: any): void {
    const interval = setInterval(() => {
      if (ws.readyState !== WebSocket.OPEN) {
        clearInterval(interval);
        return;
      }

      const mockData = this.generateMockData(source);
      const message: DataStreamMessage = {
        type: 'data',
        timestamp: Date.now(),
        source,
        data: mockData,
        metadata: {
          sequence: Math.floor(Math.random() * 10000),
          version: '1.0'
        }
      };

      ws.onmessage?.({ data: JSON.stringify(message) });
    }, this.getMockDataInterval(source));
  }

  private generateMockData(source: string): any {
    switch (source) {
      case 'sales-metrics':
        return {
          revenue: 1000 + Math.random() * 500,
          orders: Math.floor(50 + Math.random() * 30),
          conversion_rate: 0.02 + Math.random() * 0.03,
          timestamp: new Date().toISOString()
        };
      
      case 'user-activity':
        return {
          active_users: Math.floor(100 + Math.random() * 200),
          page_views: Math.floor(500 + Math.random() * 300),
          bounce_rate: 0.3 + Math.random() * 0.2,
          session_duration: 180 + Math.random() * 120,
          timestamp: new Date().toISOString()
        };
      
      case 'system-metrics':
        return {
          cpu_usage: Math.random() * 100,
          memory_usage: Math.random() * 100,
          disk_io: Math.random() * 1000,
          network_io: Math.random() * 500,
          timestamp: new Date().toISOString()
        };
      
      case 'financial-data':
        return {
          stock_price: 100 + (Math.random() - 0.5) * 10,
          volume: Math.floor(10000 + Math.random() * 50000),
          market_cap: 1000000 + Math.random() * 500000,
          timestamp: new Date().toISOString()
        };
      
      default:
        return {
          value: Math.random() * 100,
          label: `Data point ${Date.now()}`,
          timestamp: new Date().toISOString()
        };
    }
  }

  private getMockDataInterval(source: string): number {
    switch (source) {
      case 'sales-metrics': return 5000; // 5 seconds
      case 'user-activity': return 2000; // 2 seconds
      case 'system-metrics': return 1000; // 1 second
      case 'financial-data': return 500; // 0.5 seconds
      default: return 3000; // 3 seconds
    }
  }

  private handleMessage(source: string, message: DataStreamMessage): void {
    switch (message.type) {
      case 'data':
        this.notifySubscribers(source, 'data', message.data);
        break;
      case 'heartbeat':
        // Handle heartbeat - connection is alive
        break;
      case 'error':
        this.notifySubscribers(source, 'error', new Error(message.data));
        break;
    }
  }

  private notifySubscribers(source: string, type: string, data: any): void {
    const subscribers = this.subscriptions.get(source) || [];
    
    subscribers.forEach(subscription => {
      try {
        // Apply filters if specified
        if (type === 'data' && subscription.filters) {
          if (!this.passesFilters(data, subscription.filters)) {
            return;
          }
        }

        // Apply transform if specified
        let processedData = data;
        if (type === 'data' && subscription.transform) {
          processedData = subscription.transform(data);
        }

        switch (type) {
          case 'data':
            subscription.onData(processedData);
            break;
          case 'error':
            subscription.onError?.(data);
            break;
          case 'connected':
            subscription.onConnected?.();
            break;
          case 'disconnected':
            subscription.onDisconnected?.();
            break;
        }
      } catch (error) {
        console.error(`Error in subscription callback for ${source}:`, error);
      }
    });
  }

  private passesFilters(data: any, filters: Record<string, any>): boolean {
    for (const [key, value] of Object.entries(filters)) {
      if (data[key] !== value) {
        return false;
      }
    }
    return true;
  }

  private handleDisconnection(source: string, config: StreamConfig): void {
    this.connections.delete(source);
    
    // Clear heartbeat
    const heartbeat = this.heartbeatIntervals.get(source);
    if (heartbeat) {
      clearInterval(heartbeat);
      this.heartbeatIntervals.delete(source);
    }

    // Attempt reconnection if there are subscribers
    const subscribers = this.subscriptions.get(source);
    if (subscribers && subscribers.length > 0) {
      this.attemptReconnection(source, config);
    }

    this.notifySubscribers(source, 'disconnected', null);
  }

  private attemptReconnection(source: string, config: StreamConfig): void {
    const attempts = this.reconnectAttempts.get(source) || 0;
    
    if (attempts >= config.maxReconnectAttempts) {
      console.log(`Max reconnection attempts reached for ${source}`);
      return;
    }

    this.isReconnecting.set(source, true);
    this.reconnectAttempts.set(source, attempts + 1);

    setTimeout(() => {
      console.log(`Attempting to reconnect to ${source} (attempt ${attempts + 1})`);
      this.connect(source, config).catch(error => {
        console.error(`Reconnection failed for ${source}:`, error);
      });
    }, config.reconnectInterval);
  }

  private startHeartbeat(source: string, interval: number): void {
    const heartbeat = setInterval(() => {
      const ws = this.connections.get(source);
      if (ws && ws.readyState === WebSocket.OPEN) {
        const heartbeatMessage: DataStreamMessage = {
          type: 'heartbeat',
          timestamp: Date.now(),
          source: 'client',
          data: { ping: true }
        };
        ws.send(JSON.stringify(heartbeatMessage));
      } else {
        clearInterval(heartbeat);
        this.heartbeatIntervals.delete(source);
      }
    }, interval);
    
    this.heartbeatIntervals.set(source, heartbeat);
  }

  // Cleanup all connections
  cleanup(): void {
    for (const source of Array.from(this.connections.keys())) {
      this.disconnect(source);
    }
    this.subscriptions.clear();
  }
}

// Singleton instance
export const streamingService = new RealTimeStreamingService();

import React from 'react';

// React Hook for easy integration
export const useRealTimeData = (
  source: string,
  options?: {
    filters?: Record<string, any>;
    transform?: (data: any) => any;
    onError?: (error: Error) => void;
    onConnected?: () => void;
    onDisconnected?: () => void;
  }
) => {
  const [data, setData] = React.useState<any>(null);
  const [isConnected, setIsConnected] = React.useState(false);
  const [error, setError] = React.useState<Error | null>(null);

  React.useEffect(() => {
    const subscription: StreamSubscription = {
      id: `${source}-${Date.now()}`,
      source,
      filters: options?.filters,
      transform: options?.transform,
      onData: setData,
      onError: (err) => {
        setError(err);
        options?.onError?.(err);
      },
      onConnected: () => {
        setIsConnected(true);
        setError(null);
        options?.onConnected?.();
      },
      onDisconnected: () => {
        setIsConnected(false);
        options?.onDisconnected?.();
      }
    };

    const unsubscribe = streamingService.subscribe(subscription);

    return () => {
      unsubscribe();
    };
  }, [source, options?.filters]);

  return {
    data,
    isConnected,
    error,
    connectionStatus: streamingService.getConnectionStatus(source)
  };
};