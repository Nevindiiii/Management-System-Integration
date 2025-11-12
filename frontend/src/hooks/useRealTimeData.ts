import { useQuery, useQueryClient } from '@tanstack/react-query';
import { useEffect, useRef } from 'react';

interface RealTimeConfig {
  queryKey: string[];
  queryFn: () => Promise<any>;
  refetchInterval?: number;
  enabled?: boolean;
}

export function useRealTimeData({
  queryKey,
  queryFn,
  refetchInterval = 5000, // 5 seconds default
  enabled = true
}: RealTimeConfig) {
  const queryClient = useQueryClient();
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  const query = useQuery({
    queryKey,
    queryFn,
    enabled,
    refetchOnWindowFocus: true,
    refetchOnMount: true,
    staleTime: 0, // Always consider data stale for real-time updates
    gcTime: 1000 * 60 * 5, // 5 minutes
  });

  // Auto-refetch with interval
  useEffect(() => {
    if (enabled && refetchInterval > 0) {
      intervalRef.current = setInterval(() => {
        queryClient.invalidateQueries({ queryKey });
      }, refetchInterval);

      return () => {
        if (intervalRef.current) {
          clearInterval(intervalRef.current);
        }
      };
    }
  }, [queryKey, refetchInterval, enabled, queryClient]);

  // Manual refresh function
  const refresh = () => {
    queryClient.invalidateQueries({ queryKey });
  };

  return {
    ...query,
    refresh,
    isRealTime: enabled && refetchInterval > 0
  };
}

// WebSocket hook for real-time updates
export function useWebSocketData(url: string, queryKey: string[]) {
  const queryClient = useQueryClient();
  const wsRef = useRef<WebSocket | null>(null);

  useEffect(() => {
    if (!url) return;

    try {
      wsRef.current = new WebSocket(url);

      wsRef.current.onmessage = (event) => {
        try {
          const data = JSON.parse(event.data);
          // Update the query cache with new data
          queryClient.setQueryData(queryKey, data);
        } catch (error) {
          console.error('WebSocket data parsing error:', error);
        }
      };

      wsRef.current.onerror = (error) => {
        console.error('WebSocket error:', error);
      };

      wsRef.current.onclose = () => {
        console.log('WebSocket connection closed');
      };

    } catch (error) {
      console.error('WebSocket connection error:', error);
    }

    return () => {
      if (wsRef.current) {
        wsRef.current.close();
      }
    };
  }, [url, queryKey, queryClient]);

  return {
    isConnected: wsRef.current?.readyState === WebSocket.OPEN,
    disconnect: () => wsRef.current?.close()
  };
}