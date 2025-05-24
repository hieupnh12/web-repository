import React from "react";
import { NavLink } from "react-router-dom";
import {
  FaThLarge,
  FaUsers,
  FaComments,
  FaChartBar,
  FaCalendarAlt,
  FaWallet,
  FaRandom,
  FaSchool,
  FaSignOutAlt,
} from "react-icons/fa";

export default function NavbarAdmin() {
  return (
    <aside className="w-60 h-screen bg-white/80 backdrop-blur rounded-r-2xl p-6 flex flex-col justify-between shadow-md">
      {/* Logo */}
      <div>
        <h1 className="text-2xl font-bold text-teal-800 mb-8">
          Coach<span className="font-normal">Pro</span>
        </h1>

        {/* Menu */}
        <ul className="space-y-4 text-teal-700 font-medium">
          <li>
            <NavLink
              to="/admin"
              className={({ isActive }) => {
                console.log('NavLink /admin isActive:', isActive);
                return `flex items-center space-x-3 px-4 py-2 rounded-lg ${
                  isActive
                    ? 'bg-gradient-to-r from-teal-600 to-teal-400 text-white'
                    : 'hover:text-teal-900'
                }`;
              }}
              end
            >
              <FaThLarge />
              <span>Dashboard</span>
            </NavLink>
          </li>


          <li>
            <NavLink
              to="/admin/customer"
              className={({ isActive }) =>
                `flex items-center space-x-3 px-4 py-2 rounded-lg ${
                  isActive
                    ? "bg-gradient-to-r from-teal-600 to-teal-400 text-white"
                    : "hover:text-teal-900"
                }`
              }
            >
              <FaUsers />
              <span>Customer</span>
            </NavLink>
          </li>


          <li>
            <NavLink
              to="/admin/messenger"
              className={({ isActive }) =>
                `flex items-center space-x-3 px-4 py-2 rounded-lg ${
                  isActive
                    ? "bg-gradient-to-r from-teal-600 to-teal-400 text-white"
                    : "hover:text-teal-900"
                }`
              }
            >
              <FaComments />
              <span>Messenger</span>
            </NavLink>
          </li>


          <li>
            <NavLink
              to="/admin/statistic"
              className={({ isActive }) =>
                `flex items-center space-x-3 px-4 py-2 rounded-lg ${
                  isActive
                    ? "bg-gradient-to-r from-teal-600 to-teal-400 text-white"
                    : "hover:text-teal-900"
                }`
              }
            >
              <FaChartBar />
              <span>Statistic</span>
            </NavLink>
          </li>


          <li>
            <NavLink
              to="/admin/calendar"
              className={({ isActive }) =>
                `flex items-center space-x-3 px-4 py-2 rounded-lg ${
                  isActive
                    ? "bg-gradient-to-r from-teal-600 to-teal-400 text-white"
                    : "hover:text-teal-900"
                }`
              }
            >
              <FaCalendarAlt />
              <span>Calendar</span>
            </NavLink>
          </li>


          <li>
            <NavLink
              to="/admin/finance"
              className={({ isActive }) =>
                `flex items-center space-x-3 px-4 py-2 rounded-lg ${
                  isActive
                    ? "bg-gradient-to-r from-teal-600 to-teal-400 text-white"
                    : "hover:text-teal-900"
                }`
              }
            >
              <FaWallet />
              <span>Finance</span>
            </NavLink>
          </li>
          <hr className="border-gray-300 my-4" />
          <li>
            <NavLink
              to="/admin/transfers"
              className={({ isActive }) =>
                `flex items-center space-x-3 px-4 py-2 rounded-lg ${
                  isActive
                    ? "bg-gradient-to-r from-teal-600 to-teal-400 text-white"
                    : "hover:text-teal-900"
                }`
              }
            >
              <FaRandom />
              <span>Transfers</span>
            </NavLink>
          </li>


          <li>
            <NavLink
              to="/admin/youth-academy"
              className={({ isActive }) =>
                `flex items-center space-x-3 px-4 py-2 rounded-lg ${
                  isActive
                    ? "bg-gradient-to-r from-teal-600 to-teal-400 text-white"
                    : "hover:text-teal-900"
                }`
              }
            >
              <FaSchool />
              <span>Youth academy</span>
            </NavLink>
          </li>

          
        </ul>
      </div>

      <button
        className="bg-gradient-to-r from-teal-600 to-teal-400 text-white px-4 py-2 rounded-lg hover:scale-105 hover:shadow-lg transition-transform duration-300 flex items-center justify-center space-x-2"
        onClick={() => {
          console.log("Logout clicked");
          // Thêm logic logout tại đây
        }}
      >
        <FaSignOutAlt />
        <span>Logout</span>
      </button>
    </aside>
  );
}
