import React from "react";
import { NavLink } from "react-router-dom";


const tabs = [
  { label: "Tổng quan", path: "/statistics/overview" },
  { label: "Tồn kho", path: "/statistics/inventory" },
  { label: "Doanh thu", path: "/statistics/revenue" },
  { label: "Nhà cung cấp", path: "/statistics/suppliers" },
  { label: "Khách hàng", path: "/statistics/customers" },
];

const StatisticTabs = () => {
  return (
    <div className="bg-white px-6 pt-4">
      <div className="border-b border-gray-200 flex gap-6">
        {tabs.map((tab) => (
          <NavLink
            key={tab.path}
            to={tab.path}
            className={({ isActive }) =>
              `py-2 px-3 -mb-px text-sm font-medium border-b-2 ${
                isActive
                  ? "border-blue-600 text-blue-600"
                  : "border-transparent text-gray-500 hover:text-blue-500"
              }`
            }
          >
            {tab.label}
          </NavLink>
        ))}
      </div>
    </div>
  );
};

export default StatisticTabs;
