import React, { useState, useEffect } from 'react';
import { 
  Package, 
  ShoppingCart, 
  Users, 
  TrendingUp,
  ArrowUpRight,
  ArrowDownRight,
  BarChart3,
  Shield,
  Activity,
  Bell,
  Filter,
  Clock,
  Star,
  Zap,
  CircleDot,
  Sparkles
} from 'lucide-react';

const Dashboard = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [selectedPeriod, setSelectedPeriod] = useState('month');
  const [animatedStats, setAnimatedStats] = useState({});

  useEffect(() => {
    setTimeout(() => setIsLoading(false), 1500);
    
    // Animate stats on load
    const timer = setTimeout(() => {
      setAnimatedStats({
        products: 2847,
        orders: 124,
        customers: 1429,
        revenue: 45.2
      });
    }, 2000);

    return () => clearTimeout(timer);
  }, []);

  // Mock data with enhanced styling
  const stats = [
    {
      title: 'Tổng sản phẩm',
      value: '2,847',
      change: '+12%',
      isPositive: true,
      icon: Package,
      color: 'bg-gradient-to-br from-indigo-500 to-purple-600',
      glowColor: 'shadow-indigo-500/20',
      description: 'Tăng 340 sản phẩm',
      progress: 85,
      bgColor: 'bg-indigo-50',
      borderColor: 'border-indigo-200'
    },
    {
      title: 'Đơn hàng hôm nay',
      value: '124',
      change: '+8%',
      isPositive: true,
      icon: ShoppingCart,
      color: 'bg-gradient-to-br from-emerald-500 to-teal-600',
      glowColor: 'shadow-emerald-500/20',
      description: 'Tăng 9 đơn hàng',
      progress: 68,
      bgColor: 'bg-emerald-50',
      borderColor: 'border-emerald-200'
    },
    {
      title: 'Khách hàng',
      value: '1,429',
      change: '+5%',
      isPositive: true,
      icon: Users,
      color: 'bg-gradient-to-br from-orange-500 to-red-500',
      glowColor: 'shadow-orange-500/20',
      description: 'Tăng 68 khách hàng',
      progress: 72,
      bgColor: 'bg-orange-50',
      borderColor: 'border-orange-200'
    },
    {
      title: 'Doanh thu tháng',
      value: '₫45.2M',
      change: '-2%',
      isPositive: false,
      icon: TrendingUp,
      color: 'bg-gradient-to-br from-rose-500 to-pink-600',
      glowColor: 'shadow-rose-500/20',
      description: 'Giảm ₫900K',
      progress: 58,
      bgColor: 'bg-rose-50',
      borderColor: 'border-rose-200'
    }
  ];

  const recentTransactions = [
    {
      id: 1,
      customer: 'Nguyen Van A',
      product: 'iPhone 15 Pro',
      imei: '356789012345678',
      amount: '₫25,990,000',
      status: 'completed',
      time: '12:45 AM',
      priority: 'high',
      avatar: 'NVA'
    },
    {
      id: 2,
      customer: 'Tran Thi B',
      product: 'Samsung Galaxy S24',
      imei: '352123456789012',
      amount: '₫18,900,000',
      status: 'pending',
      time: '11:30 PM',
      priority: 'medium',
      avatar: 'TTB'
    },
    {
      id: 3,
      customer: 'Le Xuan C',
      product: 'Smartphone',
      imei: '865123456789012',
      amount: '₫50,000,000',
      status: 'pending',
      time: '10:50 PM',
      priority: 'LXC',
      avatar: 'LXC'
    },
    {
      id: 4,
      customer: 'Pham Thi D',
      product: 'OPPO Find X7',
      imei: '356789123456789',
      amount: '₫50,990,000',
      priority: 'high',
      status: 'pending',
      time: '10:25 AM',
      avatar: 'PTD'
    }
  ];

  const features = [
    {
      title: 'TÍNH CHÍNH XÁC',
      description: 'Mã IMEI là một số duy nhất được gán cho từng thiết bị điện thoại, do đó hệ thống quản lý điện thoại theo mã IMEI sẽ đảm bảo tính chính xác và độ tin cậy cao.',
      icon: BarChart3,
      color: 'from-blue-500 to-indigo-600',
      stats: { accuracy: '99.9%', verified: '2,847' },
      bgColor: 'bg-blue-50',
      borderColor: 'border-blue-200'
    },
    {
      title: 'TÍNH BẢO MẬT',
      description: 'Ngăn chặn việc sử dụng các thiết bị điện thoại giả mạo hoặc bị đánh cắp. Điều này giúp tăng tính bảo mật cho các hoạt động quản lý điện thoại.',
      icon: Shield,
      color: 'from-green-500 to-emerald-600',
      stats: { security: '100%', blocked: '0' },
      bgColor: 'bg-green-50',
      borderColor: 'border-green-200'
    }
  ];

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 flex items-center justify-center relative overflow-hidden">
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute top-10 left-10 w-72 h-72 bg-blue-200/20 rounded-full blur-3xl animate-pulse"></div>
          <div className="absolute bottom-10 right-10 w-96 h-96 bg-purple-200/20 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }}></div>
          <div className="absolute top-1/2 left-1/2 w-64 h-64 bg-indigo-200/30 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '2s' }}></div>
        </div>
        
        <div className="text-center relative z-10">
          <div className="relative mb-8">
            <div className="w-20 h-20 border-4 border-transparent border-t-blue-500 border-r-indigo-500 border-b-purple-500 border-l-blue-400 rounded-full animate-spin mx-auto mb-4"></div>
            <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
              <Sparkles className="w-8 h-8 text-blue-500 animate-pulse" />
            </div>
          </div>
          <div className="space-y-2">
            <p className="text-gray-800 text-2xl font-bold animate-pulse">Đang khởi tạo hệ thống...</p>
            <p className="text-gray-600 text-lg">Vui lòng chờ trong vài giây</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-gray-50 to-blue-50 relative overflow-hidden">
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-blue-100/30 rounded-full blur-3xl animate-float"></div>
        <div className="absolute -bottom-40 -left-40 w-96 h-96 bg-indigo-100/30 rounded-full blur-3xl animate-float-delayed"></div>
        <div className="absolute top-1/3 left-1/4 w-60 h-60 bg-purple-100/20 rounded-full blur-3xl animate-float-slow"></div>
      </div>

      <div className="relative z-10 bg-white/80 backdrop-blur-lg border-b border-gray-200/50 px-6 py-4 shadow-sm">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-3">
              <div className="relative">
                <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-xl flex items-center justify-center shadow-lg shadow-blue-500/25">
                  <Package className="w-7 h-7 text-white" />
                </div>
                <div className="absolute -top-1 -right-1 w-4 h-4 bg-green-400 rounded-full border-2 border-white animate-ping"></div>
              </div>
              <div>
                <h1 className="text-2xl font-bold bg-gradient-to-r from-gray-800 via-blue-700 to-indigo-700 bg-clip-text text-transparent">
                  QUẢN LÝ KHO
                </h1>
                <p className="text-sm text-gray-600">Hệ thống IMEI</p>
              </div>
            </div>
          </div>
          <div className="flex items-center space-x-4">
            <div className="relative">
              <button className="p-3 text-gray-600 hover:text-gray-800 transition-all duration-300 hover:bg-gray-100 rounded-xl backdrop-blur-sm border border-gray-200 hover:border-gray-300 hover:scale-110">
                <Bell className="w-5 h-5" />
              </button>
              <div className="absolute -top-1 -right-1 w-3 h-3 bg-red-500 rounded-full animate-bounce"></div>
            </div>
            <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-full flex items-center justify-center font-bold text-white shadow-lg hover:scale-110 transition-transform cursor-pointer">
              A
            </div>
          </div>
        </div>
      </div>

      <div className="relative z-10 p-6 space-y-8">
        <div className="bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 text-white rounded-3xl p-8 relative overflow-hidden border border-blue-200 shadow-2xl">
          <div className="absolute top-0 right-0 w-80 h-80 bg-white/10 rounded-full -translate-y-40 translate-x-40 animate-float"></div>
          <div className="absolute bottom-0 left-0 w-60 h-60 bg-white/5 rounded-full translate-y-30 -translate-x-30 animate-float-delayed"></div>
          <div className="absolute top-1/2 right-1/4 w-32 h-32 bg-gradient-to-br from-blue-400/20 to-purple-400/20 rounded-full blur-xl animate-pulse"></div>
          
          <div className="relative z-10 flex items-center justify-between">
            <div className="flex-1">
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
                HỆ THỐNG QUẢN LÝ KHO
                <br />
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
            <div className="hidden lg:flex items-center space-x-6">
              <div className="bg-white/10 backdrop-blur-sm p-6 rounded-3xl border border-white/20 hover:bg-white/20 transition-all duration-500 transform hover:scale-110 hover:rotate-12 group shadow-xl">
                <BarChart3 className="w-16 h-16 text-white group-hover:text-blue-200 transition-colors" />
              </div>
              <div className="bg-white/10 backdrop-blur-sm p-6 rounded-3xl border border-white/20 hover:bg-white/20 transition-all duration-500 transform hover:scale-110 hover:-rotate-12 group shadow-xl">
                <Shield className="w-16 h-16 text-white group-hover:text-green-200 transition-colors" />
              </div>
            </div>
          </div>
        </div>

        <div className="flex items-center justify-between">
          <h2 className="text-3xl font-bold bg-gradient-to-r from-gray-800 via-blue-700 to-indigo-700 bg-clip-text text-transparent flex items-center">
            <Sparkles className="w-8 h-8 mr-3 text-blue-500 animate-pulse" />
            Tổng quan hệ thống
          </h2>
          <div className="flex items-center space-x-4">
            <select 
              value={selectedPeriod}
              onChange={(e) => setSelectedPeriod(e.target.value)}
              className="px-6 py-3 bg-white/80 backdrop-blur-sm border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-700 appearance-none cursor-pointer hover:bg-white transition-all shadow-sm"
            >
              <option value="day">Hôm nay</option>
              <option value="week">Tuần này</option>
              <option value="month">Tháng này</option>
              <option value="year">Năm này</option>
            </select>
            <button className="flex items-center space-x-2 px-6 py-3 bg-gradient-to-r from-blue-500 to-indigo-600 text-white rounded-xl hover:from-blue-600 hover:to-indigo-700 transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-blue-500/25">
              <Filter className="w-5 h-5" />
              <span className="font-medium">Lọc</span>
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {stats.map((stat, index) => {
            const Icon = stat.icon;
            return (
              <div key={index} className="group relative">
                <div className={`absolute inset-0 ${stat.glowColor} shadow-2xl rounded-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-500 blur-xl`}></div>
                
                <div className={`relative ${stat.bgColor} backdrop-blur-xl rounded-3xl p-8 border-2 ${stat.borderColor} hover:border-opacity-80 transition-all duration-500 transform hover:-translate-y-2 hover:scale-105 shadow-xl hover:shadow-2xl`}>
                  <div className="flex items-center justify-between mb-6">
                    <div className="flex-1">
                      <p className="text-sm font-medium text-gray-600 mb-2">{stat.title}</p>
                      <p className="text-4xl font-bold text-gray-800">{stat.value}</p>
                    </div>
                    <div className={`${stat.color} p-4 rounded-2xl group-hover:scale-110 transition-transform duration-300 shadow-lg`}>
                      <Icon className="w-8 h-8 text-white" />
                    </div>
                  </div>
                  
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center">
                      {stat.isPositive ? (
                        <ArrowUpRight className="w-5 h-5 text-green-500" />
                      ) : (
                        <ArrowDownRight className="w-5 h-5 text-red-500" />
                      )}
                      <span className={`text-sm font-semibold ml-2 ${
                        stat.isPositive ? 'text-green-600' : 'text-red-600'
                      }`}>
                        {stat.change}
                      </span>
                    </div>
                    <span className="text-xs text-gray-500">{stat.description}</span>
                  </div>

                  <div className="relative">
                    <div className="w-full bg-gray-200 rounded-full h-3 overflow-hidden">
                      <div 
                        className={`h-3 bg-gradient-to-r ${stat.color.replace('bg-gradient-to-br', '')} rounded-full transition-all duration-1000 ease-out shadow-lg`}
                        style={{ width: `${stat.progress}%` }}
                      ></div>
                    </div>
                    <div className="absolute right-0 top-0 h-3 w-1 bg-gray-400 rounded-full animate-pulse"></div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {features.map((feature, index) => {
            const Icon = feature.icon;
            return (
              <div key={index} className="group relative">
                <div className="absolute inset-0 bg-gradient-to-r from-blue-100/50 to-indigo-100/50 rounded-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-500 blur-xl"></div>
                <div className={`relative ${feature.bgColor} backdrop-blur-xl rounded-3xl p-10 border-2 ${feature.borderColor} hover:border-opacity-80 transition-all duration-500 transform hover:-translate-y-1 shadow-2xl`}>
                  <div className="text-center">
                    <div className={`w-24 h-24 bg-gradient-to-br ${feature.color} rounded-3xl mx-auto mb-8 flex items-center justify-center transform group-hover:rotate-12 transition-transform duration-500 shadow-2xl`}>
                      <Icon className="w-12 h-12 text-white" />
                    </div>
                    <h3 className="text-2xl font-bold bg-gradient-to-r from-gray-800 to-gray-600 bg-clip-text text-transparent mb-6">{feature.title}</h3>
                    <p className="text-gray-600 leading-relaxed mb-8 text-lg">
                      {feature.description}
                    </p>
                    
                    <div className="grid grid-cols-2 gap-6">
                      {Object.entries(feature.stats).map(([key, value], statIndex) => (
                        <div key={statIndex} className="bg-white/60 backdrop-blur-sm rounded-2xl p-6 border border-gray-200 hover:bg-white/80 transition-all duration-300 group/stat shadow-sm">
                          <p className="text-sm text-gray-500 capitalize mb-2">{key}</p>
                          <p className="text-2xl font-bold text-gray-800 group-hover/stat:text-blue-600 transition-colors">{value}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        <div className="bg-white/80 backdrop-blur-xl rounded-3xl border border-gray-200 shadow-2xl">
          <div className="p-8 border-b border-gray-200">
            <div className="flex items-center justify-between">
              <h3 className="text-2xl font-bold text-gray-800 flex items-center">
                <Activity className="w-7 h-7 mr-3 text-blue-500 animate-pulse" />
                Giao dịch gần đây
              </h3>
              <button className="bg-gradient-to-r from-blue-500 to-indigo-600 text-white px-6 py-3 rounded-xl hover:from-blue-600 hover:to-indigo-700 font-medium text-sm transition-all duration-300 transform hover:scale-105 shadow-lg">
                Xem tất cả
              </button>
            </div>
          </div>
          <div className="p-8">
            <div className="space-y-6">
              {recentTransactions.map((transaction, index) => (
                <div key={transaction.id} className="group flex items-center justify-between p-6 hover:bg-gray-50 rounded-2xl transition-all duration-300 border border-transparent hover:border-gray-200 backdrop-blur-sm" style={{animationDelay: `${index * 100}ms`}}>
                  <div className="flex items-center space-x-6">
                    <div className="relative">
                      <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-2xl flex items-center justify-center font-bold text-white text-lg shadow-lg group-hover:scale-110 transition-transform">
                        {transaction.avatar}
                      </div>
                      {transaction.priority === 'high' && (
                        <div className="absolute -top-2 -right-2 w-6 h-6 bg-gradient-to-r from-red-500 to-pink-500 rounded-full flex items-center justify-center border-2 border-white animate-bounce">
                          <Star className="w-3 h-3 text-white" />
                        </div>
                      )}
                    </div>
                    <div>
                      <p className="font-bold text-gray-800 text-lg">{transaction.customer}</p>
                      <p className="text-gray-600 font-medium">{transaction.product}</p>
                      <p className="text-xs text-gray-500 font-mono bg-gray-100 px-3 py-1 rounded-lg mt-2">IMEI: {transaction.imei}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="font-bold text-gray-800 text-2xl mb-2">{transaction.amount}</p>
                    <div className="flex items-center justify-end space-x-2 mb-2">
                      <span className={`inline-flex px-4 py-2 text-sm rounded-xl font-bold border ${
                        transaction.status === 'completed'
                          ? 'bg-green-100 text-green-700 border-green-300'
                          : transaction.status === 'pending'
                          ? 'bg-yellow-100 text-yellow-700 border-yellow-300'
                          : 'bg-blue-100 text-blue-700 border-blue-300'
                      }`}>
                        {transaction.status === 'completed' ? 'Hoàn thành' : 
                         transaction.status === 'pending' ? 'Đang xử lý' : 'Đang xử lý'}
                      </span>
                    </div>
                    <p className="text-sm text-gray-500">{transaction.time}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="text-center py-8">
          <div className="bg-white/60 backdrop-blur-sm rounded-2xl p-6 border border-gray-200">
            <p className="text-gray-600 text-lg">
              © 2025 IMEI Management System - 
              <span className="bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent font-bold">
                {' '}Powered by AnBaCùSi Technology
              </span>
            </p>
          </div>
        </div>
      </div>

      <style jsx>{`
        @keyframes float {
          0%, 100% { transform: translateY(0px) rotate(0deg); }
          50% { transform: translateY(-20px) rotate(5deg); }
        }
        @keyframes float-delayed {
          0%, 100% { transform: translateY(0px) rotate(0deg); }
          50% { transform: translateY(-30px) rotate(-5deg); }
        }
        @keyframes float-slow {
          0%, 100% { transform: translateY(0px) rotate(0deg); }
          50% { transform: translateY(-15px) rotate(3deg); }
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