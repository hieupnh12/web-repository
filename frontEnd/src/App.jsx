import React from "react";
import {
  RouterProvider,
  createBrowserRouter,
  createRoutesFromElements,
  Route,
} from "react-router-dom";

import LayoutCommon from "./components/layout/Layout";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

// Các page
import Dashboard from "./pages/Dashboard/Dashboard";
import ExportStock from "./pages/Inventory/ExportStock";
import Export from "./pages/Inventory/components/Export";
import Login from "./pages/Login/Login";

import Products from "./pages/Products"; 

// Optional: 404 Not Found page
const NotFound = () => (
  <div className="p-10 text-center text-xl">404 - Không tìm thấy trang</div>
);

const router = createBrowserRouter(
  createRoutesFromElements(
    <>
      <Route path="/">
        <Route index element={<Login />} />
      </Route>

      {/* Route cho Manager */}
      <Route path="manager" element={<LayoutCommon />}>
        <Route index element={<Dashboard />} />
        <Route path="dashboard" element={<Dashboard />} />

        {/* Route cha: export */}
        <Route path="export">
          <Route index element={<ExportStock />} />
          <Route path="addexport" element={<Export />} />
        </Route>

        {/* ✅ Route cho Products */}
        <Route path="products" element={<Products />} />

        <Route path="export" element={<ExportStock />} />
        <Route path="*" element={<NotFound />} />
      </Route>

      {/* Route cho Staff */}
      <Route path="staff" element={<LayoutCommon />}>
        <Route index element={<Dashboard />} />
        <Route path="dashboard" element={<Dashboard />} />
        <Route path="export" element={<ExportStock />} />

        {/* ✅ Route cho Products của Staff (nếu cần) */}
        <Route path="products" element={<Products />} />

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
