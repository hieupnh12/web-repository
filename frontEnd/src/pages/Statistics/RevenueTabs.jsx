import { NavLink, Outlet } from "react-router-dom";

export default function RevenueTabs() {
  return (
    <div className="p-4">
      {/* Tiêu đề cố định */}
      <h1 className="text-xl font-bold mb-2">Doanh thu</h1>

      {/* Breadcrumb thủ công */}
      <div className="text-sm text-gray-600 mb-4">
        <span className="text-blue-600 font-medium">Thống kê</span> &gt;{" "}
        <span className="text-gray-800">Doanh thu</span>
      </div>

      {/* Tabs */}
      <div className="flex space-x-2 mb-4">
        <NavLink
          to="year"
          className={({ isActive }) =>
            `px-4 py-2 rounded transition ${
              isActive ? "bg-blue-500 text-white" : "bg-gray-200 hover:bg-gray-300"
            }`
          }
        >
          Theo Năm
        </NavLink>
        <NavLink
          to="month"
          className={({ isActive }) =>
            `px-4 py-2 rounded transition ${
              isActive ? "bg-blue-500 text-white" : "bg-gray-200 hover:bg-gray-300"
            }`
          }
        >
          Theo Tháng
        </NavLink>
        <NavLink
          to="day"
          className={({ isActive }) =>
            `px-4 py-2 rounded transition ${
              isActive ? "bg-blue-500 text-white" : "bg-gray-200 hover:bg-gray-300"
            }`
          }
        >
         Theo Ngày
        </NavLink>
        <NavLink
          to="datetodate"
          className={({ isActive }) =>
            `px-4 py-2 rounded transition ${
              isActive ? "bg-blue-500 text-white" : "bg-gray-200 hover:bg-gray-300"
            }`
          }
        >
          Từ Ngày Đến Ngày
        </NavLink>
      </div>

      {/* Nội dung theo tab */}
      <Outlet />
    </div>
  );
}
