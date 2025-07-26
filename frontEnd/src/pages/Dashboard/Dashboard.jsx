import React, { useState, useEffect } from 'react';
import { 
  Package, 
  ShoppingCart, 
  Users, 
  TrendingUp,
  BarChart3,
  Shield
} from 'lucide-react';
import * as dashboardService from '../../services/dashboardService';

const Dashboard = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [stats, setStats] = useState([]);
  const [features, setFeatures] = useState([]);
  const [selectedPeriod, setSelectedPeriod] = useState('month');

  useEffect(() => {
    fetchDashboardStats();
  }, []);

  const fetchDashboardStats = async () => {
    try {
      const customerData = await dashboardService.getCustomerCount();
      const exportData = await dashboardService.getExportReceiptCount();
      const productData = await dashboardService.getProductCount();
      const verifyData = await dashboardService.getProductItemVerify();
      const revenueData = await dashboardService.getRevenueByMonth(new Date().getFullYear());

      const latestRevenue = revenueData.at(-1);

      setStats([
        {
          title: 'Tổng sản phẩm',
          value: productData.totalProducts,
          change: `${productData.percentageIncrease.toFixed(1)}%`,
          isPositive: productData.percentageIncrease >= 0,
          icon: Package,
          color: 'bg-gradient-to-br from-indigo-500 to-purple-600',
          glowColor: 'shadow-indigo-500/20',
          description: `Tăng ${productData.todayIncrease} sản phẩm`,
          progress: 85,
          bgColor: 'bg-indigo-50',
          borderColor: 'border-indigo-200'
        },
        {
          title: 'Đơn hàng hôm nay',
          value: exportData.todayCount,
          change: `${exportData.percentageIncrease.toFixed(1)}%`,
          isPositive: exportData.percentageIncrease >= 0,
          icon: ShoppingCart,
          color: 'bg-gradient-to-br from-emerald-500 to-teal-600',
          glowColor: 'shadow-emerald-500/20',
          description: `Tăng ${exportData.increaseCount} đơn hàng`,
          progress: 68,
          bgColor: 'bg-emerald-50',
          borderColor: 'border-emerald-200'
        },
        {
          title: 'Khách hàng',
          value: customerData.totalCustomers,
          change: `${customerData.percentageIncrease.toFixed(1)}%`,
          isPositive: customerData.percentageIncrease >= 0,
          icon: Users,
          color: 'bg-gradient-to-br from-orange-500 to-red-500',
          glowColor: 'shadow-orange-500/20',
          description: `Tăng ${customerData.todayIncrease} khách hàng`,
          progress: 72,
          bgColor: 'bg-orange-50',
          borderColor: 'border-orange-200'
        },
        {
          title: 'Doanh thu tháng',
          value: `₫${(latestRevenue.revenues / 1000000).toFixed(1)}M`,
          change: '+0%',
          isPositive: true,
          icon: TrendingUp,
          color: 'bg-gradient-to-br from-rose-500 to-pink-600',
          glowColor: 'shadow-rose-500/20',
          description: `Tăng ₫${latestRevenue.profits.toLocaleString()}`,
          progress: 58,
          bgColor: 'bg-rose-50',
          borderColor: 'border-rose-200'
        }
      ]);

      setFeatures([
        {
          title: 'TÍNH CHÍNH XÁC',
          description: 'Hệ thống quản lý điện thoại theo mã IMEI đảm bảo độ chính xác và tin cậy cao.',
          icon: BarChart3,
          color: 'from-blue-500 to-indigo-600',
          stats: { accuracy: `${verifyData.accuracy.toFixed(2)}%`, verified: verifyData.verifiedCount },
          bgColor: 'bg-blue-50',
          borderColor: 'border-blue-200'
        },
        {
          title: 'TÍNH BẢO MẬT',
          description: 'Ngăn chặn việc sử dụng thiết bị điện thoại giả mạo hoặc bị đánh cắp.',
          icon: Shield,
          color: 'from-green-500 to-emerald-600',
          stats: { security: '100%', blocked: '0' },
          bgColor: 'bg-green-50',
          borderColor: 'border-green-200'
        }
      ]);
    } catch (err) {
      console.error('Error fetching dashboard data:', err);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen p-4">
      {isLoading ? (
        <div className="text-center mt-32 text-gray-500 text-xl">Đang tải dữ liệu...</div>
      ) : (
        <div>
          <h2 className="text-3xl font-bold mb-6">Tổng quan hệ thống</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {stats.map((stat, index) => {
              const Icon = stat.icon;
              return (
                <div key={index} className={`rounded-xl p-6 border ${stat.borderColor} ${stat.bgColor} shadow`}>
                  <div className="flex justify-between items-center mb-4">
                    <div>
                      <p className="text-gray-600 text-sm">{stat.title}</p>
                      <p className="text-2xl font-bold">{stat.value}</p>
                    </div>
                    <div className={`p-2 rounded-xl ${stat.color}`}><Icon className="text-white w-6 h-6" /></div>
                  </div>
                  <div className="flex justify-between items-center text-sm">
                    <span className={stat.isPositive ? 'text-green-600' : 'text-red-600'}>{stat.change}</span>
                    <span className="text-gray-500">{stat.description}</span>
                  </div>
                </div>
              );
            })}
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mt-12">
            {features.map((feature, index) => {
              const Icon = feature.icon;
              return (
                <div key={index} className={`rounded-2xl p-6 border ${feature.borderColor} ${feature.bgColor} shadow-lg`}>
                  <div className="flex items-center mb-4">
                    <div className={`p-4 rounded-xl bg-gradient-to-br ${feature.color} text-white`}><Icon className="w-6 h-6" /></div>
                    <h3 className="text-xl font-bold ml-4 text-gray-800">{feature.title}</h3>
                  </div>
                  <p className="text-gray-600 mb-4">{feature.description}</p>
                  <div className="grid grid-cols-2 gap-4">
                    {Object.entries(feature.stats).map(([label, value], i) => (
                      <div key={i} className="bg-white rounded-xl p-4 border text-center">
                        <p className="text-gray-500 text-sm capitalize">{label}</p>
                        <p className="text-lg font-bold text-blue-700">{value}</p>
                      </div>
                    ))}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
};

export default Dashboard;
