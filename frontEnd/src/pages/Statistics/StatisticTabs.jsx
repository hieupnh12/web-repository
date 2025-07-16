import React from "react";
import { NavLink, useLocation } from "react-router-dom";

export default function StatisticTabs({ current }) {
  const location = useLocation();

  // Tự động xác định prefix: /manager hoặc /staff
  const prefix = location.pathname.includes("/staff")
    ? "/staff/statistics"
    : "/manager/statistics";

  const tabs = [
    { label: "Tổng quan", path: `${prefix}/overview` },
    { label: "Tồn kho", path: `${prefix}/inventory` },
    { label: "Doanh thu", path: `${prefix}/revenue` },
    { label: "Nhà cung cấp", path: `${prefix}/suppliers` },
    { label: "Khách hàng", path: `${prefix}/customers` },
  ];

  return (
    <div className="w-full border-b border-gray-200">
      <div className="flex flex-wrap gap-2">
        {tabs.map((tab) => (
          <NavLink
            key={tab.path}
            to={tab.path}
            className={({ isActive }) =>
              `px-4 py-2 text-sm font-medium rounded-t-md border-b-2 ${
                isActive || current === tab.path.split("/")[3]
                  ? "text-blue-600 border-blue-600 bg-white"
                  : "text-gray-500 border-transparent hover:text-blue-600 hover:border-blue-400"
              }`
            }
          >
            {tab.label}
          </NavLink>
        ))}
      </div>
    </div>
  );
}
