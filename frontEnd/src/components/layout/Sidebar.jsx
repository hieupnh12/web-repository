import React, { useEffect, useState, useMemo, useRef } from "react";
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
  Cpu,
  Download,
  Upload,
  ShieldCheck,
  SearchCheck,
  Menu,
  X,
  KeyRound,
} from "lucide-react";
import { useDispatch } from "react-redux";
import { logout, setFunctionIds, setUserInfo } from "../../context/authSlide";
import { toast } from "react-toastify";
import {
  takeFunction,
  takeInfo,
  takeResetPass,
  takeRole,
} from "../../services/authService";
import LogoutDialog from "../ui/LogoutDialog";

const MENU_ITEMS = [

  // { id: 4, label: "Products", icon: Package, path: "products", color: "text-blue-500" },
  // { id: 1, label: "Attributes", icon: Cpu, path: "attributes", color: "text-blue-500" },
  // { id: 6, label: "Import", icon: Download, path: "import", color: "text-blue-500" },
  // { id: 7, label: "Export", icon: Upload, path: "export", color: "text-blue-500" },
  // { id: 3, label: "Inventory", icon: SearchCheck, path: "inventory", color: "text-blue-500" },
  // { id: 2, label: "Areas", icon: MapPin, path: "storage", color: "text-blue-500" },
  // { id: 8, label: "Customers", icon: Users, path: "customers", color: "text-blue-500" },
  // { id: 5, label: "Suppliers", icon: Building2, path: "suppliers", color: "text-blue-500" },
  // { id: 9, label: "Staff", icon: UserCircle, path: "staff", color: "text-blue-500" },
  // { id: 10, label: "Account", icon: Settings, path: "account", color: "text-blue-500" },
  // { id: 11, label: "Permissions", icon: ShieldCheck, path: "permissions", color: "text-blue-500" },
  // { id: 12, label: "Statistics", icon: BarChart3, path: "statistics", color: "text-blue-500" },



  {
    id: 4,
    label: "Sản phẩm",
    icon: Package,
    path: "products",
    color: "text-blue-500",
  },
  {
    id: 1,
    label: "Thuộc tính",
    icon: Cpu,
    path: "attributes",
    color: "text-blue-500",
  },
  {
    id: 6,
    label: "Nhập hàng",
    icon: Download,
    path: "import",
    color: "text-blue-500",
  },
  {
    id: 7,
    label: "Xuất hàng",
    icon: Upload,
    path: "export",
    color: "text-blue-500",
  },
  {
    id: 3,
    label: "Kiểm kê",
    icon: SearchCheck,
    path: "inventory",
    color: "text-blue-500",
  },
  {
    id: 2,
    label: "Khu vực",
    icon: MapPin,
    path: "storage",
    color: "text-blue-500",
  },
  {
    id: 8,
    label: "Khách hàng",
    icon: Users,
    path: "customers",
    color: "text-blue-500",
  },
  {
    id: 5,
    label: "Nhà cung cấp",
    icon: Building2,
    path: "suppliers",
    color: "text-blue-500",
  },
  {
    id: 9,
    label: "Nhân viên",
    icon: UserCircle,
    path: "staff",
    color: "text-blue-500",
  },
  {
    id: 10,
    label: "Tài khoản",
    icon: Settings,
    path: "account",
    color: "text-blue-500",
  },
  {
    id: 11,
    label: "Phân quyền",
    icon: ShieldCheck,
    path: "permissions",
    color: "text-blue-500",
  },
  {
    id: 12,
    label: "Thống kê",
    icon: BarChart3,
    path: "statistics",
    color: "text-blue-500",
  },

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

  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const dropdownRef = useRef(null);

  // Popup đổi mật khẩu
  const [showPasswordPopup, setShowPasswordPopup] = useState(false);
  const [passwordData, setPasswordData] = useState({
    oldPassword: "",
    newPassword: "",
    confirmPassword: "",
  });
  const [error, setError] = useState("");

  const handleLogout = () => {
    dispatch(logout());
    navigate("/");
  };
  // Hàm validate nâng cao
  const validatePasswordFields = (oldPass, newPass, confirmPass) => {
    if (!oldPass || !newPass || !confirmPass) {
      return "Vui lòng nhập đầy đủ thông tin";
    }
    if (newPass === oldPass) {
      return "Mật khẩu mới không được trùng mật khẩu cũ";
    }
    if (newPass.length < 8) {
      return "Mật khẩu mới phải có ít nhất 8 ký tự";
    }
    if (!/[A-Z]/.test(newPass)) {
      return "Mật khẩu mới phải chứa ít nhất 1 chữ cái viết hoa";
    }
    if (!/[0-9]/.test(newPass)) {
      return "Mật khẩu mới phải chứa ít nhất 1 chữ số";
    }
    if (!/[!@#$%^&*]/.test(newPass)) {
      return "Mật khẩu mới phải chứa ít nhất 1 ký tự đặc biệt (!@#$%^&*)";
    }
    if (newPass !== confirmPass) {
      return "Xác nhận mật khẩu không khớp";
    }
    return ""; // Không lỗi
  };

  // Dùng useEffect để validate real-time
  useEffect(() => {
    const err = validatePasswordFields(
      passwordData.oldPassword,
      passwordData.newPassword,
      passwordData.confirmPassword
    );
    setError(err);
  }, [passwordData]); // chạy mỗi khi passwordData thay đổi
  // Xử lý đổi mật khẩu
  const handleSubmitChangePassword = async () => {
    if (error) return; // nếu đang có lỗi thì không submit

    // Gọi API đổi mật khẩu ở đây
    try {
      const response = await takeResetPass({
        oldPassword: passwordData.oldPassword,
        newPassword: passwordData.newPassword,
      });

      if (response.status === 200) {
        toast.success("Đổi mật khẩu thành công!");
        setShowPasswordPopup(false);
        setPasswordData({
          oldPassword: "",
          newPassword: "",
          confirmPassword: "",
        });
        setError("");
      } else {
        setError(response.data?.message || "Đổi mật khẩu thất bại");
      }
    } catch (err) {
      setError(
        err.response?.data?.message || "Có lỗi xảy ra, vui lòng thử lại"
      );
    }
  };

  // Đóng dropdown khi click ra ngoài
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsMenuOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

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
        setIsLoading(false);
      } catch (err) {
        console.error("Error loading sidebar", err);
        setIsLoading(false);
      }
    };

    fetchData();
  }, []);

  const filteredMenuItems = useMemo(() => {
    const defaultDashboard = {
      id: "dashboard",
      label: "Bảng điều khiển",
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
    <>
      {/* Nút mở menu (mobile) */}
      <button
        className="lg:hidden fixed top-4 left-4 z-50 bg-blue-600 p-2 rounded-md text-white shadow-md"
        onClick={() => setIsSidebarOpen(true)}
      >
        <Menu className="w-6 h-6" />
      </button>

      {/* Overlay (mờ) */}
      {isSidebarOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden"
          onClick={() => setIsSidebarOpen(false)}
        ></div>
      )}

      {/* Sidebar */}
      <div
        className={`
          fixed lg:static top-0 left-0 z-50 lg:z-auto w-64 bg-white shadow-lg h-full flex flex-col overflow-auto custom-scroll transform transition-transform duration-300
          ${
            isSidebarOpen
              ? "translate-x-0"
              : "-translate-x-full lg:translate-x-0"
          }
        `}
      >
        {/* Nút đóng (mobile) */}
        <div className="lg:hidden flex justify-end p-4">
          <button
            onClick={() => setIsSidebarOpen(false)}
            className="p-2 rounded-md text-gray-600 hover:bg-gray-200"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* User Info + Dropdown */}
        <div
          className="p-4 border-b border-gray-200 relative"
          ref={dropdownRef}
        >
          <div
            className="flex items-center space-x-3 cursor-pointer hover:bg-gray-300 p-2 rounded-lg transition"
            onClick={() => setIsMenuOpen((prev) => !prev)}
          >
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

          {/* Dropdown menu */}
          {isMenuOpen && (
            <div className="absolute left-4 right-4 mt-2 bg-gray-200 border border-gray-400 rounded-lg shadow-lg z-50">
              <button
                onClick={() => {
                  setIsMenuOpen(false);
                  setShowPasswordPopup(true);
                }}
                className="flex items-center gap-2 w-full px-4 py-2 text-gray-700 hover:bg-gray-300 transition"
              >
                <KeyRound className="w-4 h-4 text-blue-500" />
                Đổi mật khẩu
              </button>
            </div>
          )}
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
              filteredMenuItems.map(
                ({ id, label, icon: Icon, path, color }) => (
                  <NavLink
                    key={id}
                    to={path}
                    className={({ isActive }) =>
                      `
                    w-full flex items-center space-x-3 px-3 py-2.5 rounded-lg text-left transition-all duration-200 
                    ${
                      isActive
                        ? "bg-blue-100 text-blue-600 shadow-sm border-l-4 border-blue-500"
                        : "text-gray-600 hover:text-gray-800 hover:bg-gray-200"
                    }
                  `
                    }
                    end
                    onClick={() => setIsSidebarOpen(false)}
                  >
                    <Icon className={`w-5 h-5 ${color}`} />
                    <span className="font-medium flex-1">{label}</span>
                    <ChevronRight className="w-4 h-4 text-blue-500 opacity-50" />
                  </NavLink>
                )
              )
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

      {/* Popup Đổi mật khẩu */}
      {showPasswordPopup && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
          <div className="bg-white rounded-xl shadow-xl w-full max-w-md p-6 relative">
            <h2 className="text-xl font-semibold text-gray-800 mb-4">
              Đổi mật khẩu
            </h2>
            <div className="space-y-3">
              <input
                type="password"
                placeholder="Mật khẩu hiện tại"
                value={passwordData.oldPassword}
                onChange={(e) =>
                  setPasswordData({
                    ...passwordData,
                    oldPassword: e.target.value,
                  })
                }
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
              <input
                type="password"
                placeholder="Mật khẩu mới"
                value={passwordData.newPassword}
                onChange={(e) =>
                  setPasswordData({
                    ...passwordData,
                    newPassword: e.target.value,
                  })
                }
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
              <input
                type="password"
                placeholder="Xác nhận mật khẩu mới"
                value={passwordData.confirmPassword}
                onChange={(e) =>
                  setPasswordData({
                    ...passwordData,
                    confirmPassword: e.target.value,
                  })
                }
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />

              {error && <p className="text-red-500 text-sm">{error}</p>}
            </div>
            <div className="flex justify-end mt-4 gap-3">
              <button
                onClick={() => setShowPasswordPopup(false)}
                className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-100"
              >
                Hủy
              </button>
              <button
                onClick={handleSubmitChangePassword}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
              >
                Xác nhận
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default React.memo(Sidebar);
