import React, { useState, useEffect } from 'react';
import { Warehouse, Package, TrendingUp, Users, Activity, MapPin, Calendar, Clock } from 'lucide-react';

function WarehouseAreas() {
  const [selectedArea, setSelectedArea] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  // Simulated warehouse data with realistic metrics
  const areas = [
    {
      id: 'area-a',
      name: 'Kho A',
      capacity: 85,
      occupancy: 72,
      items: 1247,
      staff: 12,
      lastUpdate: '2 phút trước',
      status: 'active',
      color: 'from-blue-500 to-cyan-500',
      icon: Warehouse,
      bgPattern: 'data:image/svg+xml,%3Csvg width="40" height="40" viewBox="0 0 40 40" xmlns="http://www.w3.org/2000/svg"%3E%3Cg fill="%23ffffff" fill-opacity="0.05"%3E%3Cpath d="m0 40l40-40h-40z"/%3E%3C/g%3E%3C/svg%3E'
    },
    {
      id: 'area-b',
      name: 'Kho B',
      capacity: 92,
      occupancy: 67,
      items: 2156,
      staff: 8,
      lastUpdate: '5 phút trước',
      status: 'active',
      color: 'from-sky-500 to-blue-500',
      icon: Warehouse,
      bgPattern: 'data:image/svg+xml,%3Csvg width="40" height="40" viewBox="0 0 40 40" xmlns="http://www.w3.org/2000/svg"%3E%3Cg fill="%23ffffff" fill-opacity="0.05"%3E%3Ccircle cx="20" cy="20" r="3"/%3E%3C/g%3E%3C/svg%3E'
    },
    {
      id: 'area-c',
      name: 'Kho C',
      capacity: 78,
      occupancy: 89,
      items: 856,
      staff: 15,
      lastUpdate: '1 phút trước',
      status: 'warning',
      color: 'from-orange-500 to-red-500',
      icon: Warehouse,
      bgPattern: 'data:image/svg+xml,%3Csvg width="40" height="40" viewBox="0 0 40 40" xmlns="http://www.w3.org/2000/svg"%3E%3Cg fill="%23ffffff" fill-opacity="0.05"%3E%3Cpath d="M20 0v40M0 20h40"/%3E%3C/g%3E%3C/svg%3E'
    },
    {
      id: 'area-d',
      name: 'Kho D',
      capacity: 95,
      occupancy: 45,
      items: 687,
      staff: 6,
      lastUpdate: '8 phút trước',
      status: 'low',
      color: 'from-emerald-500 to-teal-500',
      icon: Warehouse,
      bgPattern: 'data:image/svg+xml,%3Csvg width="40" height="40" viewBox="0 0 40 40" xmlns="http://www.w3.org/2000/svg"%3E%3Cg fill="%23ffffff" fill-opacity="0.05"%3E%3Cpath d="M0 0h20v20H0zM20 20h20v20H20z"/%3E%3C/g%3E%3C/svg%3E'
    }
  ];

  useEffect(() => {
    // Simulate loading
    setTimeout(() => setIsLoading(false), 1500);
  }, []);

  const getStatusColor = (status) => {
    switch (status) {
      case 'active': return 'text-green-500';
      case 'warning': return 'text-yellow-500';
      case 'low': return 'text-blue-500';
      default: return 'text-gray-500';
    }
  };

  const getOccupancyColor = (occupancy) => {
    if (occupancy >= 80) return 'text-red-500 bg-red-100';
    if (occupancy >= 60) return 'text-yellow-600 bg-yellow-100';
    return 'text-green-600 bg-green-100';
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-500 via-blue-600 to-blue-700 flex items-center justify-center">
        <div className="text-center">
          <div className="relative">
            <div className="w-20 h-20 border-4 border-white border-t-blue-600 rounded-full animate-spin mx-auto mb-4"></div>
            <Warehouse className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-8 h-8 text-blue-600" />
          </div>
          <p className="text-white text-lg font-medium drop-shadow-md">Đang tải dữ liệu kho...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-500 via-blue-600 to-blue-700 p-4">
      {/* Animated Background Elements */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-white rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-pulse"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-sky-400 rounded-full mix-blend-multiply filter blur-xl opacity-30 animate-pulse animation-delay-2000"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-60 h-60 bg-blue-400 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-pulse animation-delay-4000"></div>
      </div>

      <div className="relative z-10 container mx-auto max-w-7xl">
        {/* Header Section */}
        <div className="text-center mb-12">
          <div className="flex items-center justify-center mt-4 text-white">
            <Clock className="w-4 h-4 mr-2" />
            <span className="drop-shadow-md">Cập nhật lần cuối: {new Date().toLocaleTimeString('vi-VN')}</span>
          </div>
        </div>

        {/* Stats Overview */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
          <div className="bg-white/20 backdrop-blur-md rounded-xl p-4 border border-white/30 shadow-lg">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-white/90 text-sm font-medium">Tổng khu vực</p>
                <p className="text-2xl font-bold text-white drop-shadow-md">4</p>
              </div>
              <MapPin className="w-8 h-8 text-white/80" />
            </div>
          </div>
          <div className="bg-white/20 backdrop-blur-md rounded-xl p-4 border border-white/30 shadow-lg">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-white/90 text-sm font-medium">Tổng sản phẩm</p>
                <p className="text-2xl font-bold text-white drop-shadow-md">{areas.reduce((sum, area) => sum + area.items, 0).toLocaleString()}</p>
              </div>
              <Package className="w-8 h-8 text-white/80" />
            </div>
          </div>
          <div className="bg-white/20 backdrop-blur-md rounded-xl p-4 border border-white/30 shadow-lg">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-white/90 text-sm font-medium">Nhân viên</p>
                <p className="text-2xl font-bold text-white drop-shadow-md">{areas.reduce((sum, area) => sum + area.staff, 0)}</p>
              </div>
              <Users className="w-8 h-8 text-white/80" />
            </div>
          </div>
          <div className="bg-white/20 backdrop-blur-md rounded-xl p-4 border border-white/30 shadow-lg">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-white/90 text-sm font-medium">Công suất TB</p>
                <p className="text-2xl font-bold text-white drop-shadow-md">{Math.round(areas.reduce((sum, area) => sum + area.occupancy, 0) / areas.length)}%</p>
              </div>
              <TrendingUp className="w-8 h-8 text-white/80" />
            </div>
          </div>
        </div>

        {/* Main Grid - 4 Corners Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 max-w-6xl mx-auto">
          {areas.map((area, index) => {
            const IconComponent = area.icon;
            return (
              <div
                key={area.id}
                className={`group relative overflow-hidden rounded-3xl bg-gradient-to-br ${area.color} p-1 hover:scale-105 transition-all duration-500 cursor-pointer shadow-2xl ${
                  selectedArea === area.id ? 'ring-4 ring-white/70 scale-105' : ''
                }`}
                onClick={() => setSelectedArea(selectedArea === area.id ? null : area.id)}
                style={{
                  backgroundImage: `url("${area.bgPattern}")`,
                  backgroundSize: '40px 40px'
                }}
              >
                {/* Glass morphism effect */}
                <div className="absolute inset-0 bg-white/10 backdrop-blur-sm"></div>
                
                {/* Animated border */}
                <div className="absolute inset-0 rounded-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-500">
                  <div className="absolute inset-0 rounded-3xl border-2 border-white/40 animate-pulse"></div>
                </div>

                {/* Content */}
                <div className="relative bg-white/95 backdrop-blur-sm rounded-3xl p-8 h-full min-h-[320px] flex flex-col shadow-xl">
                  {/* Header */}
                  <div className="flex items-start justify-between mb-6">
                    <div>
                      <h3 className="text-2xl font-bold text-gray-800 mb-1">
                        {area.name}
                      </h3>
                    </div>
                    <div className={`p-3 rounded-2xl bg-gradient-to-br ${area.color} shadow-lg transform group-hover:rotate-12 transition-transform duration-300`}>
                      <IconComponent className="w-8 h-8 text-white" />
                    </div>
                  </div>

                  {/* Metrics */}
                  <div className="flex-1 space-y-4">
                    {/* Occupancy Bar */}
                    <div>
                      <div className="flex justify-between items-center mb-2">
                        <span className="text-sm font-medium text-gray-700">Công suất sử dụng</span>
                        <span className={`text-sm font-bold px-2 py-1 rounded-full ${getOccupancyColor(area.occupancy)}`}>
                          {area.occupancy}%
                        </span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-3 overflow-hidden">
                        <div 
                          className={`h-full bg-gradient-to-r ${area.color} transition-all duration-1000 ease-out rounded-full`}
                          style={{ width: `${area.occupancy}%` }}
                        ></div>
                      </div>
                    </div>

                    {/* Stats Grid */}
                    <div className="grid grid-cols-2 gap-4">
                      <div className="bg-gray-50 rounded-xl p-3">
                        <p className="text-xs text-gray-500 mb-1">Sản phẩm</p>
                        <p className="text-lg font-bold text-gray-800">{area.items.toLocaleString()}</p>
                      </div>
                      <div className="bg-gray-50 rounded-xl p-3">
                        <p className="text-xs text-gray-500 mb-1">Nhân viên</p>
                        <p className="text-lg font-bold text-gray-800">{area.staff}</p>
                      </div>
                    </div>
                  </div>

                  {/* Footer */}
                  <div className="flex items-center justify-between mt-6 pt-4 border-t border-gray-200">
                    <div className="flex items-center text-sm text-gray-500">
                      <div className={`w-2 h-2 rounded-full ${getStatusColor(area.status)} mr-2 animate-pulse`}></div>
                      {area.lastUpdate}
                    </div>
                    <button className={`px-4 py-2 bg-gradient-to-r ${area.color} text-white text-sm font-medium rounded-lg hover:shadow-lg transition-all duration-300 transform hover:scale-105`}>
                      Chi tiết
                    </button>
                  </div>

                  {/* Expanded Details */}
                  {selectedArea === area.id && (
                    <div className="mt-4 p-4 bg-gray-50 rounded-xl border-t border-gray-200 animate-fadeIn">
                      <h4 className="font-semibold text-gray-800 mb-2">Thông tin chi tiết</h4>
                      <div className="grid grid-cols-2 gap-3 text-sm">
                        <div>
                          <span className="text-gray-500">Dung lượng tối đa:</span>
                          <span className="ml-2 font-medium">{area.capacity}%</span>
                        </div>
                        <div>
                          <span className="text-gray-500">Trạng thái:</span>
                          <span className={`ml-2 font-medium ${getStatusColor(area.status)}`}>
                            {area.status === 'active' ? 'Hoạt động' : area.status === 'warning' ? 'Cảnh báo' : 'Thấp'}
                          </span>
                        </div>
                      </div>
                    </div>
                  )}
                </div>

                {/* Hover effect overlay */}
                <div className="absolute inset-0 bg-gradient-to-br from-white/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-3xl"></div>
              </div>
            );
          })}
        </div>

        {/* Footer */}
        <div className="text-center mt-12">
          <p className="text-white drop-shadow-md">
            © 2025 Warehouse Management System - Powered by Advanced Analytics
          </p>
        </div>
      </div>

      <style jsx>{`
        .animation-delay-2000 {
          animation-delay: 2s;
        }
        .animation-delay-4000 {
          animation-delay: 4s;
        }
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(10px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .animate-fadeIn {
          animation: fadeIn 0.3s ease-out;
        }
      `}</style>
    </div>
  );
}

export default WarehouseAreas;