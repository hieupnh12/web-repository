import Dashboard from './pages/Dashboard/Dashboard';
import ProductList from './pages/Products/ProductList';
import InventoryList from './pages/Inventory/InventoryList';
import StorageMap from './pages/Storage/StorageMap';
import CustomerList from './pages/Customers/CustomerList';
import SupplierList from './pages/Suppliers/SupplierList';

export const routes = [
  {
    path: '/',
    element: Dashboard,
    exact: true
  },
  {
    path: '/dashboard',
    element: Dashboard
  },
  {
    path: '/products',
    element: ProductList
  },
  {
    path: '/inventory',
    element: InventoryList
  },
  {
    path: '/storage',
    element: StorageMap
  },
  {
    path: '/import',
    element: () => <div className="p-6"><h1 className="text-2xl font-bold">Phiếu nhập</h1></div>
  },
  {
    path: '/export',
    element: () => <div className="p-6"><h1 className="text-2xl font-bold">Phiếu xuất</h1></div>
  },
  {
    path: '/customers',
    element: CustomerList
  },
  {
    path: '/suppliers',
    element: SupplierList
  },
  {
    path: '/staff',
    element: () => <div className="p-6"><h1 className="text-2xl font-bold">Nhân viên</h1></div>
  },
  {
    path: '/account',
    element: () => <div className="p-6"><h1 className="text-2xl font-bold">Tài khoản</h1></div>
  }
];