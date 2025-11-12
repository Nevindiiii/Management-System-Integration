import * as React from 'react';
import { Users, BarChart2, Zap, Package, TrendingUp, Activity, User, Eye, Clock, Plus } from 'lucide-react';
import { useNavigate } from 'react-router';
import { useUsers } from '@/hooks/useUserQueries';
import { useProducts } from '@/hooks/useProductQueries';
import { usePostStore } from '@/store/postStore';
import { Button } from '@/components/ui/button';
import { ActivityChart } from '@/pages/admin/ActivityChart';



export default function AdminDashboard() {
  const navigate = useNavigate();
  const { data: users = [], isLoading } = useUsers();
  const { data: products = [] } = useProducts();
  const newPosts = usePostStore((s) => s.newPosts);

  
  // placing newly-added users first and avoiding duplicates by id.
  const combinedUsers = React.useMemo(() => {
    if (!users) return newPosts ?? [];
    const existingIds = new Set((newPosts || []).map((p) => p.id));
    const others = (users || []).filter((u: any) => !existingIds.has(u.id));
    return [...(newPosts || []), ...others];
  }, [users, newPosts]);




  // Recent activity data
  const recentActivity = React.useMemo(() => {
    const activities = [];
    
    // Add recent users
    combinedUsers.slice(0, 3).forEach((user: any) => {
      activities.push({
        type: 'user',
        title: `New user registered: ${user.name || user.email || 'Unknown'}`,
        time: '2 hours ago',
        icon: User,
        color: 'text-blue-600',
        bgColor: 'bg-blue-100'
      });
    });
    
    // Add recent products
    products.slice(0, 2).forEach((product: any) => {
      activities.push({
        type: 'product',
        title: `Product added: ${product.name || 'New Product'}`,
        time: '4 hours ago',
        icon: Package,
        color: 'text-green-600',
        bgColor: 'bg-green-100'
      });
    });
    
    return activities.slice(0, 5);
  }, [combinedUsers, products]);



  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 p-6">
      {/* Header Section */}
      <div className="flex items-start justify-between mb-8">
        <div>
          <h1 className="text-4xl font-bold bg-black bg-clip-text text-transparent">
            Admin Dashboard
          </h1>
          <p className="text-slate-600 mt-2 text-lg">Welcome back! Here's what's happening with your data</p>
        </div>
        <div className="flex gap-3">
          <Button 
            variant="outline" 
            onClick={() => navigate('/products')}
            className="hover:bg-blue-50 hover:border-blue-300 transition-all duration-200"
          >
            <Eye className="w-4 h-4 mr-2" />
            View Products
          </Button>
          <Button 
            onClick={() => navigate('/users')}
            className=" hover:from-blue-700 hover:to-purple-700 transition-all duration-200 shadow-lg hover:shadow-xl"
          >
            <User className="w-4 h-4 mr-2" />
            View Users
          </Button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <div className="bg-white rounded-xl shadow-lg border-0 p-6 hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-slate-600 text-sm font-medium">Total Users</p>
              <p className="text-3xl font-bold text-slate-800 mt-1">
                {isLoading ? '...' : combinedUsers.length}
              </p>
              <p className="text-green-600 text-sm mt-1 flex items-center">
                <TrendingUp className="w-3 h-3 mr-1" />
                +12% from last month
              </p>
            </div>
            <div className="p-4 bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl shadow-lg">
              <Users className="w-6 h-6 text-white" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-lg border-0 p-6 hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-slate-600 text-sm font-medium">Products</p>
              <p className="text-3xl font-bold text-slate-800 mt-1">150+</p>
              <p className="text-green-600 text-sm mt-1 flex items-center">
                <TrendingUp className="w-3 h-3 mr-1" />
                +8% this week
              </p>
            </div>
            <div className="p-4 bg-gradient-to-br from-green-500 to-green-600 rounded-xl shadow-lg">
              <Package className="w-6 h-6 text-white" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-lg border-0 p-6 hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-slate-600 text-sm font-medium">Active Sessions</p>
              <p className="text-3xl font-bold text-slate-800 mt-1">24</p>
              <p className="text-blue-600 text-sm mt-1 flex items-center">
                <Activity className="w-3 h-3 mr-1" />
                Live now
              </p>
            </div>
            <div className="p-4 bg-gradient-to-br from-purple-500 to-purple-600 rounded-xl shadow-lg">
              <Activity className="w-6 h-6 text-white" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-lg border-0 p-6 hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-slate-600 text-sm font-medium">Performance</p>
              <p className="text-3xl font-bold text-slate-800 mt-1">98.5%</p>
              <p className="text-green-600 text-sm mt-1 flex items-center">
                <TrendingUp className="w-3 h-3 mr-1" />
                Excellent
              </p>
            </div>
            <div className="p-4 bg-gradient-to-br from-orange-500 to-orange-600 rounded-xl shadow-lg">
              <BarChart2 className="w-6 h-6 text-white" />
            </div>
          </div>
        </div>
      </div>

      {/* Recent Activity */}
      <div className="grid grid-cols-1 gap-6 mb-8">
        <div className="bg-white rounded-xl shadow-lg p-6 max-w-2xl w-full mx-auto">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-xl font-semibold text-slate-800 flex items-center">
              <Clock className="w-5 h-5 mr-2 text-purple-600" />
              Recent Activity
            </h3>
            <p className="text-sm text-slate-500">Latest updates</p>
          </div>
          <div className="space-y-4">
            {recentActivity.length > 0 ? (
              recentActivity.map((activity, index) => {
                const IconComponent = activity.icon;
                return (
                  <div key={index} className="flex items-center space-x-4 p-3 rounded-lg hover:bg-gray-50 transition-colors">
                    <div className={`p-2 rounded-full ${activity.bgColor}`}>
                      <IconComponent className={`w-4 h-4 ${activity.color}`} />
                    </div>
                    <div className="flex-1">
                      <p className="text-sm font-medium text-gray-800">{activity.title}</p>
                      <p className="text-xs text-gray-500">{activity.time}</p>
                    </div>
                  </div>
                );
              })
            ) : (
              <div className="text-center py-8 text-gray-500">
                <Activity className="w-8 h-8 mx-auto mb-2 opacity-50" />
                <p>No recent activity</p>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Activity Chart */}
      <div className="bg-white rounded-xl shadow-lg p-6 mb-8">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-xl font-semibold text-slate-800 flex items-center">
            <Activity className="w-5 h-5 mr-2 text-purple-600" />
            Product Activity Analysis
          </h3>
          <p className="text-sm text-slate-500">Interactive price distribution</p>
        </div>
        <ActivityChart cartData={products} />
      </div>

    </div>
  );
}
