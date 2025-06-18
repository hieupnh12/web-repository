import React, { useEffect, useState } from "react";
import Button from "../../components/ui/Button";
import { Plus, Edit, Trash, Info, Search } from "lucide-react";
import TableViewPer from "./TableView";
import {
  takeCreateFunction,
  takeCreateRole,
  takePermission,
} from "../../services/permissionService";
import AddRoleModal from "./AddRoleModal";
import PerInfoDetail from "./PerInfoDetail";

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
    } finally {
      setLoading(false); // kết thúc loading
    }
  };

  useEffect(() => {
    loadRole(); // chạy khi mount
  }, []);

  const handleCreateRole = async (payload) => {
    try {
      console.log("Sending payload:", payload);
      setShowModal(false);
      const response = await takeCreateFunction(payload); // Gửi tới API

      if (response?.status === 200 || response?.status === 201) {
        const maxRoleId =
          role.length > 0 ? Math.max(...role.map((r) => r.roleId)) : 0;
        const newRole = {
          roleId: maxRoleId + 1,
          roleName: payload.roleName,
          description: payload.description,
          permissions: payload.permissions,
        };

        setRole((prev) => [...prev, newRole]); // thêm trực tiếp vào danh sách
      }
    } catch (err) {
      console.error("Create role failed", err);
    }
  };

  const handleSelectRow = (row) => {
      try {
        setSelectedRow(row)
        setShowInfoDetail(true);
        console.log(row);
        
      } catch (error) {
        console.error("show info failed", error);
      }
      
  }

  return (
    <div className="min-h-screen w-full bg-gradient-to-br from-gray-50 to-blue-50 flex flex-col">
      <div className="flex-grow w-full px-4 p-4">
        {/* Controls */}
        <div className="bg-white rounded-2xl shadow-lg p-4 sm:p-6 mb-4">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            {/* Buttons */}
            <div className="flex flex-wrap gap-2 sm:gap-3 items-center">
              <div>
                <Button
                  onClick={() => setShowModal(true)}
                  className="group flex items-center gap-2 bg-blue-600 text-white hover:bg-blue-700 hover:scale-105 transform transition-all duration-300 shadow-lg hover:shadow-xl px-3 py-2 text-sm"
                >
                  <Plus className="w-4 h-4 group-hover:rotate-90 transition-transform duration-300" />
                  <span className="hidden sm:inline">Thêm mới</span>
                </Button>

                {showModal && (
                  <AddRoleModal
                    role={role}
                    onClose={() => setShowModal(false)}
                    onSubmit={handleCreateRole}
                  />
                )}
              </div>
                <div>
              <Button 
                className="group flex items-center gap-2 bg-yellow-500 text-white hover:bg-yellow-600 hover:scale-105 transform transition-all duration-300 shadow-lg hover:shadow-xl px-3 py-2 text-sm">
                <Edit className="w-4 h-4 group-hover:scale-110 transition-transform duration-300" />
                <span className="hidden sm:inline">Sửa</span>
              </Button>
              {showInfoDetail && (
                <PerInfoDetail 
                  role={selectedRow}
                  onClose={() => setShowInfoDetail(false)}
                />
              )}
                </div>
              <Button className="group flex items-center gap-2 bg-red-600 text-white hover:bg-red-700 hover:scale-105 transform transition-all duration-300 shadow-lg hover:shadow-xl px-3 py-2 text-sm">
                <Trash className="w-4 h-4 group-hover:scale-110 transition-transform duration-300" />
                <span className="hidden sm:inline">Xoá</span>
              </Button>

              <Button className="group flex items-center gap-2 bg-purple-600 text-white hover:bg-purple-700 hover:scale-105 transform transition-all duration-300 shadow-lg hover:shadow-xl px-3 py-2 text-sm">
                <Info className="w-4 h-4 group-hover:scale-110 transition-transform duration-300" />
                <span className="hidden sm:inline">Chi tiết</span>
              </Button>
            </div>

            {/* Search bar */}
            <div className="relative w-full sm:w-72">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="text"
                placeholder="Tìm kiếm sản phẩm..."
                className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
            </div>
          </div>
        </div>

        {/* Bảng quyền */}
        <TableViewPer data={role} search={search} loading={loading} onSelectRow={handleSelectRow}/>
      </div>
    </div>
  );
};

export default Permissions;
