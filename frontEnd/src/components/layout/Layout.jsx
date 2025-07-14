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
    breadcrumb: [{ label: "Import Receipt" }],
  },
  "/export": {
    title: "Export Notes",
    breadcrumb: [{ label: "Export Receipt" }],
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
      { label: "Export Receipt", href: "export" },
      { label: "Add Export Receipt" },
    ],
  },
  "/import/addimport": {
    title: "Add Import Note",
    breadcrumb: [
      { label: "Import Receipt", href: "import" },
      { label: "Add Import Receipt" },
    ],
  },
  "/permissions": {
    title: "Permissions",
    breadcrumb: [{ label: "Permissions" }],
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