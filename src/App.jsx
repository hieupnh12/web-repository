import React from "react";
import {
  RouterProvider,
  createBrowserRouter,
  createRoutesFromElements,
  Route,
} from "react-router-dom";

import LayoutCommon from "./components/layout/Layout";

// Các page
import Dashboard from "./pages/Dashboard/Dashboard";
import ExportStock from "./pages/Inventory/ExportStock";
import Export from "./pages/Inventory/components/Export";
// import ImportStock from './pages/Inventory/ImportStock';
// import Products from './pages/Products/Products';
// import Inventory from './pages/Inventory/Inventory';
// import Storage from './pages/Inventory/Storage';
// import Customers from './pages/Customers/Customers';
// import Suppliers from './pages/Suppliers/Suppliers';
// import Staff from './pages/Staff/Staff';
// import Account from './pages/Account/Account';

// Optional: 404 Not Found page
const NotFound = () => (
  <div className="p-10 text-center text-xl">404 - Không tìm thấy trang</div>
);

const router = createBrowserRouter(
  createRoutesFromElements(
    <>
      {/* Route cho Manager */}
      <Route path="manager" element={<LayoutCommon />}>
        <Route index element={<Dashboard />} />
        <Route path="dashboard" element={<Dashboard />} />
        {/* Route cha: export */}
        <Route path="export">
          <Route index element={<ExportStock />} />
          <Route path="addexport" element={<Export />} />
        </Route>{" "}
        {/* <Route path="products" element={<Products />} /> */}
        {/* <Route path="inventory" element={<Inventory />} /> */}
        {/* <Route path="storage" element={<Storage />} /> */}
        {/* <Route path="import" element={<ImportStock />} /> */}
        <Route path="export" element={<ExportStock />} />
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
        <Route index element={<Dashboard />} />
        <Route path="dashboard" element={<Dashboard />} />
        <Route path="export" element={<ExportStock />} />
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

function App() {
  return <RouterProvider router={router} />;
}

export default App;
