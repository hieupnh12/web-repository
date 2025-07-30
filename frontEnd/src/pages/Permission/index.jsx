import React, { useEffect, useState } from "react";
import Button from "../../components/ui/Button";
import { Plus, Edit, Trash, Info, Search } from "lucide-react";
import TableViewPer from "./TableView";
import {
  takeCreateFunction,
  takeCreateRole,
  takeFunctionOfFeature,
  takePermission,
} from "../../services/permissionService";
import AddRoleModal from "./AddRoleModal";
import PerInfoDetail from "./PerInfoDetail";
import { toast } from "react-toastify";
import { useSelector } from "react-redux";

const Permissions = () => {
  const [role, setRole] = useState([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [selectedRow, setSelectedRow] = useState(null);
  const [showInfoDetail, setShowInfoDetail] = useState(false);

  const loadRole = async () => {
    setLoading(true); // bắt đầu loading
    try {
      const info = await takePermission();
      if (info.status === 200) {
        setRole(info?.data?.result);
      }
    } catch (error) {
      console.error("Lỗi khi tải quyền:", error);
      toast.error("Lỗi khi tải quyền:", error);
    } finally {
      setLoading(false); // kết thúc loading
    }
  };

  useEffect(() => {
    loadRole(); // chạy khi mount
  }, []);

  const handleCreateRole = async (payload) => {
    try {
      setShowModal(false);
      console.log("create ", payload);

      const response = await takeCreateFunction(payload); // Gửi tới API

      if (response?.status === 200 || response?.status === 201) {
        toast.success("Tạo thành công 1 quyền.");
        const newRole = {
          roleId: response.data.result.roleId,
          roleName: payload.roleName,
          description: payload.description,
          permissions: payload.permissions,
        };

        setRole((prev) => [...prev, newRole]); // thêm trực tiếp vào danh sách
      }
    } catch (err) {
      console.error("Create role failed", err);
      toast.success("Create role failed", err);
    }
  };

  const handleSelectRow = (row) => {
    try {
      setSelectedRow(row);
      setShowInfoDetail(true);
      console.log(row);
    } catch (error) {
      console.error("show info failed", error);
    }
  };

  const [permission, setPermission] = useState(null);

  const fetchPermission = async () => {
    try {
      const result = await takeFunctionOfFeature(11);
      // console.log("Quyền", result);

      setPermission(result.data.result[0]);
    } catch (err) {
      setPermission(null);
    }
  };

  const staffInfo = useSelector((state) => state.auth.userInfo);
  // console.log("dd", staffInfo);
  useEffect(() => {
    if (staffInfo && staffInfo.roleName === "ADMIN") {
      // Admin có toàn quyền, gán trực tiếp
      setPermission(() => ({
        functionId: 5,
        canView: true,
        canCreate: true,
        canUpdate: true,
        canDelete: true,
      }));
    } else {
      fetchPermission();
    }
  }, []);

  return (
    <div className="w-full bg-gradient-to-br from-gray-50 to-blue-50 flex flex-col">
      <div className="flex-grow w-full px-4 p-4">
        {/* Controls */}
        <div className="bg-white rounded-2xl shadow-lg p-4 sm:p-4 mb-4">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            {/* Buttons */}
            <div className="flex flex-wrap gap-2 sm:gap-3 items-center">
              {permission?.canCreate && (
                <div>
                  <Button
                    onClick={() => setShowModal(true)}
                    className="group flex items-center gap-2 bg-blue-600 text-white hover:bg-blue-700 hover:scale-105 transform transition-all duration-300 shadow-lg hover:shadow-xl px-3 py-2 text-sm"
                  >
                    <Plus className="w-4 h-4 group-hover:rotate-90 transition-transform duration-300" />
                    <span className="hidden sm:inline">Thêm quyền</span>
                  </Button>

                  {showModal && (
                    <AddRoleModal
                      existingRoles={role}
                      onClose={() => setShowModal(false)}
                      onSubmit={handleCreateRole}
                    />
                  )}
                </div>
              )}
              <div>
                {showInfoDetail && (
                  <PerInfoDetail
                    role={selectedRow}
                    data={setRole}
                    existingRoles={role}
                    onClose={() => setShowInfoDetail(false)}
                    isPermission={permission}
                  />
                )}
              </div>
            </div>

            {/* Search bar */}
            <div className="relative w-full sm:w-72">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="text"
                maxLength={30}
                placeholder="Search name permission..."
                className="text-sm w-full pl-10 pr-4 py-2 border border-blue-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
            </div>
          </div>
        </div>

        {/* Bảng quyền */}
        <TableViewPer
          data={role}
          search={search}
          loading={loading}
          onSelectRow={handleSelectRow}
        />
      </div>
    </div>
  );
};

export default Permissions;
