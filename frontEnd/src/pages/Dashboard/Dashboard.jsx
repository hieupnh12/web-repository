// ... các import giữ nguyên như bạn đã viết
import React, { useState, useEffect } from 'react';
import {
  Package,
  ShoppingCart,
  Users,
  TrendingUp,
  BarChart3,
  Shield,
  Filter,
  Sparkles,
  Clock,
  CircleDot
} from 'lucide-react';
import * as dashboardService from '../../services/dashboardService';

const Dashboard = () => {
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

      const latestRevenue = revenueData;
      console.log(exportData);
      
      setStats([
        {
          title: 'Tổng sản phẩm',
          value: productData.totalProducts.toLocaleString(),
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
          value: customerData.totalCustomers.toLocaleString(),
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
          value: `₫${(latestRevenue.currentRevenue / 1_000_000).toFixed(1)}M`,
          change: latestRevenue.growthPercentage +'%',
          isPositive: true,
          icon: TrendingUp,
          color: 'bg-gradient-to-br from-rose-500 to-pink-600',
          glowColor: 'shadow-rose-500/20',
          description: `Tăng ₫ ${latestRevenue.revenueIncrease.toLocaleString()}`,
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
          stats: { security: '%', blocked: '0' },
          bgColor: 'bg-green-50',
          borderColor: 'border-green-200'
        }
      ]);
    } catch (err) {
      console.error('Error fetching dashboard data:', err);
    } 
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-gray-50 to-blue-50 relative overflow-hidden">
      {/* Background float effects */}
      <div className="absolute -top-40 -right-40 w-80 h-80 bg-blue-100/30 rounded-full blur-3xl animate-float"></div>
      <div className="absolute -bottom-40 -left-40 w-96 h-96 bg-indigo-100/30 rounded-full blur-3xl animate-float-delayed"></div>
      <div className="absolute top-1/3 left-1/4 w-60 h-60 bg-purple-100/20 rounded-full blur-3xl animate-float-slow"></div>

      {/* Header intro section */}
      <div className="relative z-10 bg-white/80 backdrop-blur-lg border-b border-gray-200/50 px-6 py-4 shadow-sm">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-3">
              <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-xl flex items-center justify-center shadow-lg shadow-blue-500/25">
                <Package className="w-7 h-7 text-white" />
              </div>
              <div>
                <h1 className="text-2xl font-bold bg-gradient-to-r from-gray-800 via-blue-700 to-indigo-700 bg-clip-text text-transparent">
                  QUẢN LÝ KHO
                </h1>
                <p className="text-sm text-gray-600">Hệ thống IMEI</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main content */}
      <div className="relative z-10 p-6 space-y-8">
        {/* Hero banner */}
        <div className="bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 text-white rounded-3xl p-8 relative overflow-hidden border border-blue-200 shadow-2xl">
          <div className="absolute top-1/2 right-1/4 w-32 h-32 bg-gradient-to-br from-blue-400/20 to-purple-400/20 rounded-full blur-xl animate-pulse"></div>
          <div className="relative z-10 flex items-center justify-between">
            <div>
              <div className="flex items-center space-x-4 mb-6">
                <div className="flex items-center space-x-3 bg-white/10 backdrop-blur-sm px-4 py-2 rounded-full border border-white/20">
                  <CircleDot className="w-4 h-4 text-green-400 animate-pulse" />
                  <span className="text-sm font-medium">Hệ thống đang hoạt động</span>
                </div>
                <div className="flex items-center space-x-2 bg-white/10 backdrop-blur-sm px-4 py-2 rounded-full border border-white/20">
                  <Clock className="w-4 h-4 text-blue-200" />
                  <span className="text-sm">Cập nhật: {new Date().toLocaleTimeString('vi-VN')}</span>
                </div>
              </div>
              <h1 className="text-4xl font-bold mb-4 leading-tight">
                HỆ THỐNG QUẢN LÝ KHO <br />
                <span className="bg-gradient-to-r from-blue-200 to-purple-200 bg-clip-text text-transparent">
                  ĐIỆN THOẠI THEO MÃ IMEI
                </span>
              </h1>
              <p className="text-blue-100 text-lg leading-relaxed mb-3 max-w-2xl">
                Hãy hướng về phía mặt trời, nơi mà bóng tối luôn ở phía sau lưng bạn.
                <br />
                Điều mà hoa hướng dương vẫn làm mỗi ngày.
              </p>
            </div>
          </div>
        </div>

        {/* Section: Tổng quan hệ thống */}
        <div className="flex items-center justify-between">
          <h2 className="text-3xl font-bold bg-gradient-to-r from-gray-800 via-blue-700 to-indigo-700 bg-clip-text text-transparent flex items-center">
            <Sparkles className="w-8 h-8 mr-3 text-blue-500 animate-pulse" />
            Tổng quan hệ thống
          </h2>
          {/* <div className="flex items-center space-x-4">
            <select
              value={selectedPeriod}
              onChange={(e) => setSelectedPeriod(e.target.value)}
              className="px-6 py-3 bg-white/80 border border-gray-200 rounded-xl text-gray-700 shadow-sm hover:bg-white"
            >
              <option value="day">Hôm nay</option>
              <option value="week">Tuần này</option>
              <option value="month">Tháng này</option>
              <option value="year">Năm nay</option>
            </select>
            <button className="flex items-center space-x-2 px-6 py-3 bg-gradient-to-r from-blue-500 to-indigo-600 text-white rounded-xl shadow-lg">
              <Filter className="w-5 h-5" />
              <span className="font-medium">Lọc</span>
            </button>
          </div> */}
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {stats.map((stat, index) => {
            const Icon = stat.icon;
            return (
              <div key={index} className="relative group">
                <div className={`relative ${stat.bgColor} rounded-3xl p-8 border-2 ${stat.borderColor} shadow-xl hover:-translate-y-2 hover:scale-105 transition-all`}>
                  <div className="flex items-center justify-between mb-6">
                    <div>
                      <p className="text-sm text-gray-600">{stat.title}</p>
                      <p className="text-4xl font-bold text-gray-800">{stat.value}</p>
                    </div>
                    <div className={`${stat.color} p-4 rounded-2xl`}>
                      <Icon className="w-8 h-8 text-white" />
                    </div>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className={stat.isPositive ? 'text-green-600' : 'text-red-600'}>{stat.change}</span>
                    <span className="text-gray-500">{stat.description}</span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Features */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {features.map((feature, index) => {
            const Icon = feature.icon;
            return (
              <div key={index} className={`relative ${feature.bgColor} rounded-3xl p-10 border-2 ${feature.borderColor} shadow-xl`}>
                <div className="text-center">
                  <div className={`w-24 h-24 bg-gradient-to-br ${feature.color} rounded-3xl mx-auto mb-8 flex items-center justify-center`}>
                    <Icon className="w-12 h-12 text-white" />
                  </div>
                  <h3 className="text-2xl font-bold bg-gradient-to-r from-gray-800 to-gray-600 bg-clip-text text-transparent mb-6">
                    {feature.title}
                  </h3>
                  <p className="text-gray-600 mb-8">{feature.description}</p>
                  <div className="grid grid-cols-2 gap-6">
                    {Object.entries(feature.stats).map(([label, value], i) => (
                      <div key={i} className="bg-white/60 backdrop-blur-sm rounded-2xl p-6 border border-gray-200 text-center">
                        <p className="text-sm text-gray-500 capitalize mb-2">{label}</p>
                        <p className="text-2xl font-bold text-gray-800">{value}</p>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Animations */}
      <style jsx>{`
        @keyframes float {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(-20px); }
        }
        @keyframes float-delayed {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(-30px); }
        }
        @keyframes float-slow {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(-15px); }
        }
        .animate-float {
          animation: float 6s ease-in-out infinite;
        }
        .animate-float-delayed {
          animation: float-delayed 8s ease-in-out infinite;
        }
        .animate-float-slow {
          animation: float-slow 10s ease-in-out infinite;
        }
      `}</style>
    </div>
  );
};

export default Dashboard;
