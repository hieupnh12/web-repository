import React, { lazy } from "react";
import {
  RouterProvider,
  createBrowserRouter,
  createRoutesFromElements,
  Route,
} from "react-router-dom";
import LayoutCommon from "./components/layout/Layout";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import LazyLoader from "./components/layout/LazyLoader";
import Permissions from "./pages/Permission";
import AuthGuard from "./utils/AuthGuard";
import CustomerStatistic from "./pages/Statistics/CustomerStatistic";





// Các page (dùng lazy load)
const Dashboard = lazy(() =>
  new Promise(resolve =>
    setTimeout(() => resolve(import("./pages/Dashboard/Dashboard")), 600)
  )
);
const ExportStock = lazy(() => import("./pages/Inventory/ExportStock"));
const Export = lazy(() => import("./pages/Inventory/components/Export"));
const Login = lazy(() => import("./pages/Login/Login"));
const ForgotPassword = lazy(() => import("./pages/Login/ForgotPassword"));
const ProductsPage = lazy(() => import("./pages/Products"));

// const ImportStock = lazy(() => import('./pages/Inventory/ImportStock')); 
// const Products = lazy(() => import('./pages/Products/Products'));
// const Inventory = lazy(() => import('./pages/Inventory/Inventory'));
const WarehouseAreas = lazy(() => import('./pages/Storage'));
// const Customers = lazy(() => import('./pages/Customers/Customers'));
// const Suppliers = lazy(() => import('./pages/Suppliers/Suppliers'));
 const CreateStaff = lazy(() => import('./pages/Staff/CreateStaff'));
  const Staff = lazy(() => import('./pages/Staff/Staff'));
const EditStaff = lazy(() => import('./pages/Staff/EditStaff'));
 const Account = lazy(() => import('./pages/Account/Account'));
  const Account = lazy(() => import('./pages/Account/Account'));



// Optional: 404 Not Found page
const NotFound = () => (
  <div className="p-10 text-center text-xl">404 - Không tìm thấy trang</div>
);



const router = createBrowserRouter(
  createRoutesFromElements(
    <>
      <Route path="/">
        <Route index element={<LazyLoader><Login /></LazyLoader>} />
        <Route path="forgot-password" element={<LazyLoader><ForgotPassword /></LazyLoader>} />
      </Route>
    <Route element={<AuthGuard />}>
      {/* Route cho Manager */}
      <Route path="manager" element={<LayoutCommon />}>

        <Route index element={<LazyLoader><Dashboard /></LazyLoader>} />
        <Route path="dashboard" element={<LazyLoader><Dashboard /></LazyLoader>} />

        {/* Route cha: export */}
        <Route path="export">
          <Route index element={<LazyLoader><ExportStock /></LazyLoader>} />
          <Route path="addexport" element={<LazyLoader><Export /></LazyLoader>} />
        </Route>

        <Route path="products" element={<LazyLoader><ProductsPage /></LazyLoader>} />
        {/* <Route path="inventory" element={<Inventory />} /> */}
        <Route path="storage" element={<LazyLoader><WarehouseAreas /></LazyLoader>} />
        {/* <Route path="import" element={<ImportStock />} /> */}
        <Route path="export" element={<LazyLoader><ExportStock /></LazyLoader>} />
        {/* <Route path="customers" element={<Customers />} /> */}
        {/* <Route path="suppliers" element={<Suppliers />} /> */}
        { <Route path="staff" element={<Staff />} /> }
        <Route path="staff/add" element={<CreateStaff />} />
        <Route path="staff/edit" element={<EditStaff />} />
        { <Route path="account" element={<Account />} /> }
        <Route path="permissions" element={<LazyLoader><Permissions /></LazyLoader>} />
        {/* <Route path="statistics" element={<StatisticsLayout />}>
          <Route index element={<Overview />} />
            <Route path="overview" element={<Overview />} />
            <Route path="inventory" element={<StatisticsInventory />} />
            <Route path="revenue" element={<StatisticsRevenue />} />
            <Route path="suppliers" element={<StatisticsSuppliers />} />
            <Route path="customers" element={<CustomerStatistic/>} /> */}
        </Route>

        
        <Route path="*" element={<NotFound />} />
      </Route>

      {/* Route cho Staff */}
      <Route path="staff" element={<LayoutCommon />}>

        <Route index element={<LazyLoader><Dashboard /></LazyLoader>} />
        <Route path="dashboard" element={<LazyLoader><Dashboard /></LazyLoader>} />
        <Route path="export" element={<LazyLoader><ExportStock /></LazyLoader>} />
        <Route path="statistics" element={<StatisticsLayout />}>
          <Route index element={<Overview />} />
            <Route path="overview" element={<Overview />} />
            <Route path="inventory" element={<StatisticsInventory />} />
            <Route path="revenue" element={<StatisticsRevenue />} />
            <Route path="suppliers" element={<StatisticsSuppliers />} />
            <Route path="customers" element={<StatisticsCustomers />} />
        </Route>
        
        {/* <Route path="import" element={<ImportStock />} /> */}
        {/* <Route path="inventory" element={<Inventory />} /> */}
        {/* <Route path="products" element={<Products />} /> */}
        <Route path="*" element={<NotFound />} />
      </Route>
      </Route>
    </>
  ),
  {
    future: {
      v7_startTransition: true,
    },
  }
);

const queryClient = new QueryClient();

function App() {
  
  return (
    <QueryClientProvider client={queryClient}>
      <RouterProvider router={router} />
    </QueryClientProvider>
  );
}

export default App;