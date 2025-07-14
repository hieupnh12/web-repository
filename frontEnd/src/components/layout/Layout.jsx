import React from "react";
import { useLocation, Outlet } from "react-router-dom";
import Sidebar from "./Sidebar";
import Breadcrumb from "./Breadcrumb";
import Header from "./Header";

// Map paths to titles and breadcrumbs
const pageConfig = {
  "/": { title: "Dashboard", breadcrumb: [] },
  "/dashboard": { title: "Dashboard", breadcrumb: [] },
  "/products": {
    title: "Product Management",
    breadcrumb: [{ label: "Products" }],
  },
  "/inventory": {
    title: "Inventory Management",
    breadcrumb: [{ label: "Attributes" }],
  },
  "/storage": {
    title: "Warehouse Areas",
    breadcrumb: [{ label: "Warehouse Areas" }],
  },
  "/import": {
    title: "Import Notes",
    breadcrumb: [{ label: "Import Notes" }],
  },
  "/export": {
    title: "Export Notes",
    breadcrumb: [{ label: "Export Notes" }],
  },
  "/customers": {
    title: "Customer Management",
    breadcrumb: [{ label: "Customers" }],
  },
  "/suppliers": {
    title: "Supplier Management",
    breadcrumb: [{ label: "Suppliers" }],
  },
  "/staff": {
    title: "Staff Management",
    breadcrumb: [{ label: "Staff" }],
  },
  "/account": {
    title: "Account",
    breadcrumb: [{ label: "Account" }],
  },
  "/export/addexport": {
    title: "Add Export Note",
    breadcrumb: [
      { label: "Export Notes", href: "export" },
      { label: "Add Note" },
    ],
  },
  "/permissions": {
    title: "Permissions",
    breadcrumb: [{ label: "Permissions" }],
  },
   "/statistics/overview": {
    title: "Tổng quan thống kê",
    breadcrumb: [{ label: "Thống kê" }],
  },
  "/statistics/inventory": {
    title: "Thống kê tồn kho",
    breadcrumb: [{ label: "Thống kê" }, { label: "Tồn kho" }],
  },
  "/statistics/suppliers": {
    title: "Thống kê nhà cung cấp",
    breadcrumb: [{ label: "Thống kê" }, { label: "Nhà cung cấp" }],
  },
  "/statistics/customers": {
    title: "Thống kê khách hàng",
    breadcrumb: [{ label: "Thống kê" }, { label: "Khách hàng" }],
  },
  "/statistics/revenue/year": {
    title: "Doanh thu theo năm",
    breadcrumb: [
      { label: "Thống kê", href: "/statistics/overview" },
      { label: "Doanh thu", href: "/statistics/revenue" },
      { label: "Theo năm" },
    ],
  },
  "/statistics/revenue/month": {
    title: "Doanh thu theo tháng",
    breadcrumb: [
      { label: "Thống kê", href: "/statistics/overview" },
      { label: "Doanh thu", href: "/statistics/revenue" },
      { label: "Theo tháng" },
    ],
  },
  "/statistics/revenue/day": {
    title: "Doanh thu theo ngày",
    breadcrumb: [
      { label: "Thống kê", href: "/statistics/overview" },
      { label: "Doanh thu", href: "/statistics/revenue" },
      { label: "Theo ngày" },
    ],
  },
};

const LayoutCommon = () => {
  const location = useLocation();
  const currentPath = location.pathname;
  const pathKey = currentPath.replace(/^\/(manager|staff)/, "") || "/";

  const config = Object.entries(pageConfig)
    .reverse()
    .find(([key]) => pathKey.startsWith(key))?.[1] || {
    title: "Dashboard",
    breadcrumb: [],
  };

  return (
    <div className="flex h-screen bg-gray-50">
      {/* Sidebar */}
      <Sidebar currentPath={currentPath} />

      {/* Main content */}
      <div className="flex-1 flex flex-col bg-[#D1E4E2]">
        {/* Header */}
        {/* <Header title={config.title} /> */}

        {/* Main content area */}
        <main className="flex-1 overflow-y-auto">
          <div className="p-2">
            {/* Page content */}
            <div className="bg-white rounded-lg shadow-sm min-h-full">
              {/* Breadcrumb */}
              {config.breadcrumb.length > 0 && (
                <Breadcrumb items={config.breadcrumb} />
              )}
              <Outlet />
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default LayoutCommon;