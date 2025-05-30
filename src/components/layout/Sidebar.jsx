import React from 'react';
import { NavLink } from 'react-router-dom';
import {
  Home,
  Package,
  BarChart3,
  MapPin,
  FileText,
  Send,
  Users,
  Building2,
  UserCircle,
  Settings,
  LogOut,
  ChevronRight
} from 'lucide-react';

const Sidebar = () => {
  const menuItems = [
    {
      id: 'dashboard',
      label: 'Trang chủ',
      icon: Home,
      path: 'dashboard',
      color: 'text-blue-500'
    },
    {
      id: 'products',
      label: 'Sản phẩm',
      icon: Package,
      path: 'products',
      color: 'text-blue-500'
    },
    {
      id: 'inventory',
      label: 'Thuốc tính',
      icon: BarChart3,
      path: 'inventory',
      color: 'text-blue-500'
    },
    {
      id: 'storage',
      label: 'Khu vực kho',
      icon: MapPin,
      path: 'storage',
      color: 'text-blue-500',
      badge: true
    },
    {
      id: 'import',
      label: 'Phiếu nhập',
      icon: FileText,
      path: 'import',
      color: 'text-blue-500'
    },
    {
      id: 'export',
      label: 'Phiếu xuất',
      icon: Send,
      path: 'export',
      color: 'text-blue-500'
    },
    {
      id: 'customers',
      label: 'Khách hàng',
      icon: Users,
      path: 'customers',
      color: 'text-blue-500'
    },
    {
      id: 'suppliers',
      label: 'Nhà cung cấp',
      icon: Building2,
      path: 'suppliers',
      color: 'text-yellow-500'
    },
    {
      id: 'staff',
      label: 'Nhân viên',
      icon: UserCircle,
      path: 'staff',
      color: 'text-blue-500'
    },
    {
      id: 'account',
      label: 'Tài khoản',
      icon: Settings,
      path: 'account',
      color: 'text-blue-500'
    },
    {
      id: 'permissions',
      label: 'Phân quyền',
      icon: UserCircle,
      path: 'permissions',
      color: 'text-blue-500'
    },
    {
      id: 'revenue',
      label: 'Doanh thu',
      icon: Settings,
      path: 'revenue',
      color: 'text-blue-500'
    }
  ];

  const handleLogout = () => {
    console.log('Đăng xuất');
  };

  return (
    <div className="w-64 bg-white shadow-lg h-screen flex flex-col overflow-auto">
      {/* User Info */}
      <div className="p-4 border-b border-gray-200">
        <div className="flex items-center space-x-3">
          <div className="w-12 h-12 bg-gradient-to-br from-blue-400 to-blue-600 rounded-full flex items-center justify-center">
            <UserCircle className="w-8 h-8 text-white" />
          </div>
          <div>
            <h3 className="font-semibold text-gray-800">Hoàng Gia Bảo</h3>
            <p className="text-sm text-gray-500">Quản lý kho</p>
          </div>
        </div>
      </div>

      {/* Navigation Menu */}
      <div className="flex-1 py-4">
        <nav className="space-y-1 px-2">
          {menuItems.map(({ id, label, icon: Icon, path, color }) => (
            <NavLink
              key={id}
              to={path}
              className={({ isActive }) =>
                `
                  w-full flex items-center space-x-3 px-3 py-2.5 rounded-lg text-left transition-all duration-200
                  ${isActive
                    ? 'bg-blue-50 text-blue-600 shadow-sm border-l-4 border-blue-500'
                    : 'text-gray-600 hover:bg-gray-50 hover:text-gray-800'}
                `
              }
              end
            >
              <Icon className={`w-5 h-5 ${color}`} />
              <span className="font-medium flex-1">{label}</span>
              <ChevronRight className="w-4 h-4 text-blue-500 opacity-50" />
            </NavLink>
          ))}
        </nav>
      </div>

      {/* Logout */}
      <div className="p-4 border-t border-gray-200">
        <button
          onClick={handleLogout}
          className="w-full flex items-center space-x-3 px-3 py-2.5 rounded-lg text-left text-red-600 hover:bg-red-50 transition-all duration-200"
        >
          <LogOut className="w-5 h-5" />
          <span className="font-medium">Đăng xuất</span>
        </button>
      </div>
    </div>
  );
};

export default Sidebar;
