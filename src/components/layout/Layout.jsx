import React from 'react';
import { useLocation } from 'react-router-dom';
import Sidebar from './Sidebar';
import Header from './Header';
import Breadcrumb from './Breadcrumb';

// Map paths to titles and breadcrumbs
const pageConfig = {
  '/': { title: 'Dashboard', breadcrumb: [] },
  '/dashboard': { title: 'Dashboard', breadcrumb: [] },
  '/products': { 
    title: 'Quản lý sản phẩm', 
    breadcrumb: [{ label: 'Sản phẩm' }] 
  },
  '/inventory': { 
    title: 'Quản lý kho', 
    breadcrumb: [{ label: 'Thuốc tính' }] 
  },
  '/storage': { 
    title: 'Khu vực kho', 
    breadcrumb: [{ label: 'Khu vực kho' }] 
  },
  '/import': { 
    title: 'Phiếu nhập', 
    breadcrumb: [{ label: 'Phiếu nhập' }] 
  },
  '/export': { 
    title: 'Phiếu xuất', 
    breadcrumb: [{ label: 'Phiếu xuất' }] 
  },
  '/customers': { 
    title: 'Quản lý khách hàng', 
    breadcrumb: [{ label: 'Khách hàng' }] 
  },
  '/suppliers': { 
    title: 'Quản lý nhà cung cấp', 
    breadcrumb: [{ label: 'Nhà cung cấp' }] 
  },
  '/staff': { 
    title: 'Quản lý nhân viên', 
    breadcrumb: [{ label: 'Nhân viên' }] 
  },
  '/account': { 
    title: 'Tài khoản', 
    breadcrumb: [{ label: 'Tài khoản' }] 
  }
};

const Layout = ({ children }) => {
  const location = useLocation();
  const currentPath = location.pathname;
  const config = pageConfig[currentPath] || { title: 'Dashboard', breadcrumb: [] };

  return (
    <div className="flex h-screen bg-gray-50">
      {/* Sidebar */}
      <Sidebar currentPath={currentPath} />
      
      {/* Main content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Header */}
        <Header title={config.title} />
        
        {/* Main content area */}
        <main className="flex-1 overflow-y-auto">
          <div className="p-6">
            {/* Breadcrumb */}
            {config.breadcrumb.length > 0 && (
              <Breadcrumb items={config.breadcrumb} />
            )}
            
            {/* Page content */}
            <div className="bg-white rounded-lg shadow-sm min-h-full">
              {children}
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default Layout;