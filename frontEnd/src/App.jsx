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

// Các page (dùng lazy load)
const Dashboard = lazy(() =>
  new Promise(resolve =>
    setTimeout(() => resolve(import("./pages/Dashboard/Dashboard")), 600)
  )
);const ExportStock = lazy(() => import("./pages/Inventory/ExportStock"));
const Export = lazy(() => import("./pages/Inventory/components/Export"));
const Login = lazy(() => import("./pages/Login/Login"));
// const ImportStock = lazy(() => import('./pages/Inventory/ImportStock'));
// const Products = lazy(() => import('./pages/Products/Products'));
// const Inventory = lazy(() => import('./pages/Inventory/Inventory'));
// const Storage = lazy(() => import('./pages/Inventory/Storage'));
// const Customers = lazy(() => import('./pages/Customers/Customers'));
// const Suppliers = lazy(() => import('./pages/Suppliers/Suppliers'));
// const Staff = lazy(() => import('./pages/Staff/Staff'));
// const Account = lazy(() => import('./pages/Account/Account'));


// Optional: 404 Not Found page
const NotFound = () => (
  <div className="p-10 text-center text-xl">404 - Không tìm thấy trang</div>
);



const router = createBrowserRouter(
  createRoutesFromElements(
    <>
      <Route path="/">
        <Route index element={<LazyLoader><Login /></LazyLoader>} />
      </Route>

      {/* Route cho Manager */}
      <Route path="manager" element={<LayoutCommon />}>

        <Route index element={<LazyLoader><Dashboard /></LazyLoader>} />
        <Route path="dashboard" element={<LazyLoader><Dashboard /></LazyLoader>} />

        {/* Route cha: export */}
        <Route path="export">
          <Route index element={<LazyLoader><ExportStock /></LazyLoader>} />
          <Route path="addexport" element={<LazyLoader><Export /></LazyLoader>} />
        </Route>

        {/* <Route path="products" element={<Products />} /> */}
        {/* <Route path="inventory" element={<Inventory />} /> */}
        {/* <Route path="storage" element={<Storage />} /> */}
        {/* <Route path="import" element={<ImportStock />} /> */}
        <Route path="export" element={<LazyLoader><ExportStock /></LazyLoader>} />
        {/* <Route path="customers" element={<Customers />} /> */}
        {/* <Route path="suppliers" element={<Suppliers />} /> */}
        {/* <Route path="staff" element={<Staff />} /> */}
        {/* <Route path="account" element={<Account />} /> */}
        {/* <Route path="permissions" element={<Permissions />} /> */}
        {/* <Route path="revenue" element={<Revenue />} /> */}
        <Route path="*" element={<NotFound />} />
      </Route>

      {/* Route cho Staff */}
      <Route path="staff" element={<LayoutCommon />}>

        <Route index element={<LazyLoader><Dashboard /></LazyLoader>} />
        <Route path="dashboard" element={<LazyLoader><Dashboard /></LazyLoader>} />
        <Route path="export" element={<LazyLoader><ExportStock /></LazyLoader>} />
        {/* <Route path="import" element={<ImportStock />} /> */}
        {/* <Route path="inventory" element={<Inventory />} /> */}
        {/* <Route path="products" element={<Products />} /> */}
        <Route path="*" element={<NotFound />} />
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
