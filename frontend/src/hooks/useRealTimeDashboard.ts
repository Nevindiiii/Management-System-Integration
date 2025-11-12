import { useRealTimeData } from './useRealTimeData';
import { useUsers } from './useUserQueries';
import { useProducts } from './useProductQueries';
import { useMemo } from 'react';

// Mock API functions for real-time stats
const fetchRealTimeStats = async () => {
  // Simulate API call with random data
  await new Promise(resolve => setTimeout(resolve, 500));
  
  return {
    activeSessions: Math.floor(Math.random() * 50) + 10,
    performance: (95 + Math.random() * 5).toFixed(1),
    serverStatus: Math.random() > 0.1 ? 'online' : 'maintenance',
    apiResponseTime: Math.floor(Math.random() * 200) + 50,
    totalVisitors: Math.floor(Math.random() * 1000) + 500,
    newSignups: Math.floor(Math.random() * 20) + 5,
    revenue: (Math.random() * 10000 + 5000).toFixed(2),
    conversionRate: (Math.random() * 5 + 2).toFixed(1)
  };
};

const fetchSystemHealth = async () => {
  await new Promise(resolve => setTimeout(resolve, 300));
  
  return {
    cpu: Math.floor(Math.random() * 40) + 30,
    memory: Math.floor(Math.random() * 30) + 50,
    disk: Math.floor(Math.random() * 20) + 20,
    network: Math.floor(Math.random() * 100) + 50
  };
};

export function useRealTimeDashboard() {
  // Real-time stats with 3-second refresh
  const realTimeStats = useRealTimeData({
    queryKey: ['realTimeStats'],
    queryFn: fetchRealTimeStats,
    refetchInterval: 3000
  });

  // System health with 5-second refresh
  const systemHealth = useRealTimeData({
    queryKey: ['systemHealth'],
    queryFn: fetchSystemHealth,
    refetchInterval: 5000
  });

  // Users and products with 10-second refresh
  const users = useUsers();
  const products = useProducts();

  // Enhanced stats calculations
  const dashboardStats = useMemo(() => {
    const stats = realTimeStats.data;
    const health = systemHealth.data;
    
    return {
      totalUsers: users.data?.length || 0,
      totalProducts: products.data?.length || 0,
      activeSessions: stats?.activeSessions || 0,
      performance: stats?.performance || '0.0',
      serverStatus: stats?.serverStatus || 'unknown',
      apiResponseTime: stats?.apiResponseTime || 0,
      totalVisitors: stats?.totalVisitors || 0,
      newSignups: stats?.newSignups || 0,
      revenue: stats?.revenue || '0.00',
      conversionRate: stats?.conversionRate || '0.0',
      systemHealth: health || { cpu: 0, memory: 0, disk: 0, network: 0 },
      isLoading: realTimeStats.isLoading || systemHealth.isLoading || users.isLoading,
      lastUpdated: new Date().toLocaleTimeString()
    };
  }, [realTimeStats.data, systemHealth.data, users.data, products.data, realTimeStats.isLoading, systemHealth.isLoading, users.isLoading]);

  return {
    ...dashboardStats,
    refresh: () => {
      realTimeStats.refresh();
      systemHealth.refresh();
    },
    isRealTime: realTimeStats.isRealTime && systemHealth.isRealTime
  };
}