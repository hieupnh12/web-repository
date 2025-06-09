import React from 'react';
import { 
  Package, 
  ShoppingCart, 
  Users, 
  TrendingUp,
  ArrowUpRight,
  ArrowDownRight,
  BarChart3,
  Shield
} from 'lucide-react';

const Dashboard = () => {
  // Mock data
  const stats = [
    {
      title: 'Tổng sản phẩm',
      value: '2,847',
      change: '+12%',
      isPositive: true,
      icon: Package,
      color: 'bg-blue-500'
    },
    {
      title: 'Đơn hàng hôm nay',
      value: '124',
      change: '+8%',
      isPositive: true,
      icon: ShoppingCart,
      color: 'bg-green-500'
    },
    {
      title: 'Khách hàng',
      value: '1,429',
      change: '+5%',
      isPositive: true,
      icon: Users,
      color: 'bg-purple-500'
    },
    {
      title: 'Doanh thu tháng',
      value: '₫45.2M',
      change: '-2%',
      isPositive: false,
      icon: TrendingUp,
      color: 'bg-orange-500'
    }
  ];

  const recentTransactions = [
    {
      id: 1,
      customer: 'Nguyễn Văn A',
      product: 'iPhone 15 Pro',
      amount: '₫25,990,000',
      status: 'completed',
      time: '10:30 AM'
    },
    {
      id: 2,
      customer: 'Trần Thị B',
      product: 'Samsung Galaxy S24',
      amount: '₫18,990,000',
      status: 'pending',
      time: '09:15 AM'
    },
    {
      id: 3,
      customer: 'Lê Văn C',
      product: 'Xiaomi 14',
      amount: '₫12,990,000',
      status: 'completed',
      time: '08:45 AM'
    }
  ];

  return (
    <div className="p-6 space-y-6">
      {/* Welcome Section */}
      <div className="bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-xl p-8">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold mb-2">
              HỆ THỐNG QUẢN LY KHO ĐIỆN THOẠI THEO MÃ IMEI
            </h1>
            <p className="text-blue-100 text-lg">
              Hãy hướng về phía mặt trời, nơi mà bóng tối luôn ở phía sau lưng bạn. 
              Điều mà hoa hướng dương vẫn làm mỗi ngày.
            </p>
            <p className="text-blue-200 text-sm mt-2">- Tập đoàn AnBaCùSi</p>
          </div>
          <div className="hidden md:flex items-center space-x-4">
            <div className="bg-white/20 p-4 rounded-full">
              <BarChart3 className="w-12 h-12 text-white" />
            </div>
            <div className="bg-white/20 p-4 rounded-full">
              <Shield className="w-12 h-12 text-white" />
            </div>
          </div>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, index) => {
          const Icon = stat.icon;
          return (
            <div key={index} className="bg-white rounded-lg p-6 shadow-sm border border-gray-200">
              <div className="flex items-center justify-between">
                <div className="flex-1">
                  <p className="text-sm font-medium text-gray-600">{stat.title}</p>
                  <p className="text-2xl font-bold text-gray-900 mt-1">{stat.value}</p>
                  <div className="flex items-center mt-2">
                    {stat.isPositive ? (
                      <ArrowUpRight className="w-4 h-4 text-green-500" />
                    ) : (
                      <ArrowDownRight className="w-4 h-4 text-red-500" />
                    )}
                    <span className={`text-sm font-medium ml-1 ${
                      stat.isPositive ? 'text-green-600' : 'text-red-600'
                    }`}>
                      {stat.change}
                    </span>
                    <span className="text-sm text-gray-500 ml-1">so với tháng trước</span>
                  </div>
                </div>
                <div className={`${stat.color} p-3 rounded-lg`}>
                  <Icon className="w-6 h-6 text-white" />
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* TÍNH CHÍNH XÁC */}
        <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-200">
          <div className="text-center">
            <div className="w-24 h-24 bg-gradient-to-br from-orange-400 to-orange-600 rounded-full mx-auto mb-4 flex items-center justify-center">
              <BarChart3 className="w-12 h-12 text-white" />
            </div>
            <h3 className="text-xl font-bold text-blue-600 mb-3">TÍNH CHÍNH XÁC</h3>
            <p className="text-gray-600 leading-relaxed">
              Mã IMEI là một số duy nhất được gán cho từng thiết bị điện thoại, 
              do đó hệ thống quản lý điện thoại theo mã IMEI sẽ đảm bảo tính 
              chính xác và độ tin cậy cao.
            </p>
          </div>
        </div>

        {/* TÍNH BẢO MẬT */}
        <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-200">
          <div className="text-center">
            <div className="w-24 h-24 bg-gradient-to-br from-blue-400 to-blue-600 rounded-full mx-auto mb-4 flex items-center justify-center">
              <Shield className="w-12 h-12 text-white" />
            </div>
            <h3 className="text-xl font-bold text-blue-600 mb-3">TÍNH BẢO MẬT</h3>
            <p className="text-gray-600 leading-relaxed">
              Ngăn chặn việc sử dụng các thiết bị điện thoại giả mạo hoặc bị đánh cắp. 
              Điều này giúp tăng tính bảo mật cho các hoạt động quản lý điện thoại.
            </p>
          </div>
        </div>
      </div>

      {/* Recent Transactions */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200">
        <div className="p-6 border-b border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900">Giao dịch gần đây</h3>
        </div>
        <div className="p-6">
          <div className="space-y-4">
            {recentTransactions.map((transaction) => (
              <div key={transaction.id} className="flex items-center justify-between p-4 hover:bg-gray-50 rounded-lg transition-colors">
                <div className="flex items-center space-x-4">
                  <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                    <Package className="w-5 h-5 text-blue-600" />
                  </div>
                  <div>
                    <p className="font-medium text-gray-900">{transaction.customer}</p>
                    <p className="text-sm text-gray-500">{transaction.product}</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="font-semibold text-gray-900">{transaction.amount}</p>
                  <div className="flex items-center space-x-2">
                    <span className={`inline-flex px-2 py-1 text-xs rounded-full ${
                      transaction.status === 'completed'
                        ? 'bg-green-100 text-green-800'
                        : 'bg-yellow-100 text-yellow-800'
                    }`}>
                      {transaction.status === 'completed' ? 'Hoàn thành' : 'Đang xử lý'}
                    </span>
                    <span className="text-sm text-gray-500">{transaction.time}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;