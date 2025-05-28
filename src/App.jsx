import React from 'react';
import { RouterProvider, createBrowserRouter } from 'react-router-dom';
import Layout from './components/layout/Layout';
import Dashboard from './pages/Dashboard/Dashboard';
import ProductList from './pages/Products/ProductList';
import CustomerList from './pages/Customers/CustomerList';
// Thêm các component trang khác nếu cần...

const router = createBrowserRouter([
  {
    path: '/',
    element: <Layout />,
    children: [
      { path: 'dashboard', element: <Dashboard /> },
      { path: 'products', element: <ProductList /> },
      { path: 'customers', element: <CustomerList /> },
      // Thêm các route khác theo menu sidebar
    ],
  },
]);

function App() {
  return <RouterProvider router={router} />;
}

export default App;
