import React, { useEffect, useState, useMemo } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import {
  Home,
  Package,
  BarChart3,
  MapPin,
  Users,
  Building2,
  UserCircle,
  Settings,
  LogOut,
  ChevronRight,
  SearchCheck,
  Cpu,
  Download,
  Upload,
  ShieldCheck,
} from "lucide-react";
import { useDispatch } from "react-redux";
import { logout, setFunctionIds, setUserInfo } from "../../context/authSlide";
import { takeFunction, takeInfo, takeRole } from "../../services/authService";
import LogoutDialog from "../ui/LogoutDialog";

const MENU_ITEMS = [
  { id: 4, label: "Products", icon: Package, path: "products", color: "text-blue-500" },
  { id: 1, label: "Attributes", icon: Cpu, path: "attributes", color: "text-blue-500" },
  { id: 6, label: "Import", icon: Download, path: "import", color: "text-blue-500" },
  { id: 7, label: "Export", icon: Upload, path: "export", color: "text-blue-500" },
  { id: 3, label: "Inventory", icon: SearchCheck, path: "inventory", color: "text-blue-500" },
  { id: 2, label: "Areas", icon: MapPin, path: "storage", color: "text-blue-500" },
  { id: 8, label: "Customers", icon: Users, path: "customers", color: "text-blue-500" },
  { id: 5, label: "Suppliers", icon: Building2, path: "suppliers", color: "text-blue-500" },
  { id: 9, label: "Staff", icon: UserCircle, path: "staff", color: "text-blue-500" },
  { id: 10, label: "Account", icon: Settings, path: "account", color: "text-blue-500" },
  { id: 11, label: "Permissions", icon: ShieldCheck, path: "permissions", color: "text-blue-500" },
  { id: 12, label: "Statistics", icon: BarChart3, path: "statistics", color: "text-blue-500" },
];

const Sidebar = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(true);
  const [showConfirm, setShowConfirm] = useState(false);
  const [allowedFunctionIds, setAllowedFunctionIds] = useState([]);
  const [infoAccount, setInfoAccount] = useState({
    fullName: "",
    roleName: "",
  });

  const handleLogout = () => {
    dispatch(logout());
    navigate("/");
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [infoRes, roleRes, funcRes] = await Promise.all([
          takeInfo(),
          takeRole(),
          takeFunction(),
        ]);

        const { fullName } = infoRes.data.result;
        const { roleName } = roleRes.data.result;
        const functionIds = funcRes.data.result.map((f) => f.functionId);

        dispatch(setUserInfo({ fullName, roleName }));
        dispatch(setFunctionIds(functionIds));
        setInfoAccount({ fullName, roleName });
        setAllowedFunctionIds(functionIds);
        setIsLoading(false); // ✅ done loading
      } catch (err) {
        console.error("Error loading sidebar", err);
        setIsLoading(false); // ✅ done loading
      }
    };

    fetchData();
  }, []);

  const filteredMenuItems = useMemo(() => {
    const defaultDashboard = {
      id: "dashboard",
      label: "Dashboard",
      icon: Home,
      path: "dashboard",
      color: "text-blue-500",
    };

    const filtered = MENU_ITEMS.filter((item) =>
      allowedFunctionIds.includes(item.id)
    );
    return [defaultDashboard, ...filtered];
  }, [allowedFunctionIds]);

  return (
    <div className="w-64 bg-white shadow-lg h-screen flex flex-col overflow-auto custom-scroll">
      {/* User Info */}
      <div className="p-4 border-b border-gray-200">
        <div className="flex items-center space-x-3">
          <div className="w-12 h-12 bg-gradient-to-br from-blue-400 to-blue-600 rounded-full flex items-center justify-center">
            <UserCircle className="w-8 h-8 text-white" />
          </div>
          <div>
            <h3 className="font-semibold text-gray-800">
              {infoAccount.fullName}
            </h3>
            <p className="text-sm text-gray-500">{infoAccount.roleName}</p>
          </div>
        </div>
      </div>

      {/* Navigation Menu */}
      <div className="flex-1 py-4">
        <nav className="space-y-1 px-2">
          {isLoading ? (
            <div className="space-y-2 px-2">
              {[...Array(10)].map((_, index) => (
                <div
                  key={index}
                  className="animate-pulse flex items-center space-x-3 px-3 py-2.5 rounded-lg bg-gray-100"
                >
                  <div className="w-5 h-5 bg-gray-300 rounded-full"></div>
                  <div className="flex-1 h-4 bg-gray-300 rounded"></div>
                  <div className="w-4 h-4 bg-gray-300 rounded"></div>
                </div>
              ))}
            </div>
          ) : (
            filteredMenuItems.map(({ id, label, icon: Icon, path, color }) => (
              <NavLink
                key={id}
                to={path}
                className={({ isActive }) =>
                  `
                  w-full flex items-center space-x-3 px-3 py-2.5 rounded-lg text-left transition-all duration-200
                  ${
                    isActive
                      ? "bg-blue-50 text-blue-600 shadow-sm border-l-4 border-blue-500"
                      : "text-gray-600 hover:bg-gray-50 hover:text-gray-800"
                  }
                `
                }
                end
              >
                <Icon className={`w-5 h-5 ${color}`} />
                <span className="font-medium flex-1">{label}</span>
                <ChevronRight className="w-4 h-4 text-blue-500 opacity-50" />
              </NavLink>
            ))
          )}
        </nav>
      </div>

      {/* Logout */}
      <div className="p-4 border-t border-gray-200">
        <button
          onClick={() => setShowConfirm(true)}
          className="w-full flex items-center space-x-3 px-3 py-2.5 rounded-lg text-left text-red-600 hover:bg-red-50 transition-all duration-200"
        >
          <LogOut className="w-5 h-5" />
          <span className="font-medium">Log Out</span>
        </button>
        <LogoutDialog
          isOpen={showConfirm}
          title="Log Out"
          message="Are you sure you want to log out?"
          onConfirm={handleLogout}
          onCancel={() => setShowConfirm(false)}
        />
      </div>
    </div>
  );
};

export default React.memo(Sidebar);