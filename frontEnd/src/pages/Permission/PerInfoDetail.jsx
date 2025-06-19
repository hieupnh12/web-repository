import React, { useEffect, useState } from "react";
import { X, Loader2, Trash, Edit } from "lucide-react";
import Button from "../../components/ui/Button";
import {
  takeDeleteRole,
  takeFunctions,
} from "../../services/permissionService";
import ConfirmDialog from "../../components/ui/ConfirmDialog";

const PerInfoDetail = ({ onClose, role, data }) => {
  // Lưu các chức năng per(crud)
  const [functions, setFunctions] = useState([]);
  // load khi mới đầu vô
  const [loading, setLoading] = useState(false);
  const [description, setDescription] = useState("");
  const [permissions, setPermissions] = useState([]);
  const [showConfirm, setShowConfirm] = useState(false);
  // load khi thực hiện crud
  const [loadingV2, setLoadingV2] = useState(false);
  // Điều khiển edit
  const [isEditing, setIsEditing] = useState(false);
  const [showConfirmUpdate, setShowConfirmUpdate] = useState(false);

  useEffect(() => {
    const loadRole = async () => {
      setLoading(true);
      try {
        const info = await takeFunctions();

        if (info.code === 1000 && info?.result) {
          const result = info.result;

          setFunctions(result);
          // Cập nhật permissions tương ứng
          const initialPermissions = result.map((fn) => ({
            functionId: fn.functionId,
            canView: false,
            canCreate: false,
            canUpdate: false,
            canDelete: false,
          }));
          setPermissions(initialPermissions);
        }
      } catch (error) {
        console.error("Lỗi khi tải chức năng:", error);
      } finally {
        setLoading(false);
      }
    };

    loadRole();
  }, []);

  const handleCheckboxChange = (funcId, field) => {
    setPermissions((prev) =>
      prev.map((p) =>
        p.functionId === funcId ? { ...p, [field]: !p[field] } : p
      )
    );
  };

  const handleDeleteRole = async () => {
    // đóng thông báo confirm
    setShowConfirm(false);
    setLoadingV2(true);
    try {
      const response = await takeDeleteRole(role.roleId);

      console.log(response);
      if (response.status === 200) {
        setLoadingV2(false);
        // đóng nguyên cái bảng quyền
        onClose();
        data((prev) => prev.filter((item) => item.roleId !== role.roleId));
      }
    } catch (error) {
      console.log("Error from delete row", error);
    }
  };

  // api Update
  const handleUpdate = async () => {
    const payload = {
      roleName: role.roleName,
      description,
      permissions,
    };
    // đóng thông báo confirm
    setShowConfirm(false);
    setLoadingV2(true);
    try {
      // api
      const response = ""; // = await takeUpdateRole(role.roleId, payload);

      if (response.status === 200) {
        setLoadingV2(false);
        // đóng nguyên cái bảng quyền

        setIsEditing(false);
        onClose();
      }
    } catch (error) {
      console.error("Lỗi khi cập nhật quyền:", error);
    }
  };
  return (
    <div className="fixed inset-0 bg-black bg-opacity-30 flex justify-center items-center z-50">
      <div className="bg-white rounded-xl w-[90%] max-w-4xl p-6 shadow-2xl relative">
        <button
          onClick={onClose}
          className="absolute top-3 right-3 text-gray-500 hover:text-red-500"
        >
          <X className="w-5 h-5 border-radius" />
        </button>
        <div className="flex justify-between gap-4">
          <div className="mb-4 w-2/4">
            <label className="block font-medium mb-1">Tên nhóm quyền</label>
            <input
              value={role.roleName}
              disabled
              className="w-full border rounded-md p-2"
              placeholder="Nhập tên nhóm quyền"
            />
          </div>

          <div className="mb-4 w-2/4">
            <label className="block font-medium mb-1">Mô tả</label>
            <input
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full border rounded-md p-2"
              placeholder="Nhập mô tả"
            />
          </div>
        </div>
        {loadingV2 && (
          <div className="fixed inset-0 z-500 flex items-center justify-center bg-white/60 backdrop-blur-sm">
            <div className="text-center">
              <Loader2 className="mx-auto h-8 w-8 animate-spin text-blue-500" />
              <div className="mt-2 text-sm text-gray-600">Loading...</div>
            </div>
          </div>
        )}
        {loading ? (
          <div className="py-8 text-center">
            <Loader2 className="mx-auto h-6 w-6 animate-spin text-blue-500" />
            <div className="mt-2 text-sm text-gray-500">
              Đang tải dữ liệu...
            </div>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full border">
              <thead className="bg-gray-100 text-sm">
                <tr>
                  <th className="p-2 text-left">Danh mục chức năng</th>
                  <th className="p-2 text-center">Xem</th>
                  <th className="p-2 text-center">Tạo mới</th>
                  <th className="p-2 text-center">Cập nhật</th>
                  <th className="p-2 text-center">Xoá</th>
                </tr>
              </thead>
              <tbody>
                {functions?.map((fn) => {
                  const perm = permissions.find(
                    (p) => p.functionId === fn.functionId
                  );
                  return (
                    <tr key={fn.functionId} className="border-t text-xs">
                      <td className="p-2">{fn.functionName}</td>
                      {["canView", "canCreate", "canUpdate", "canDelete"].map(
                        (field) => (
                          <td key={field} className="p-2 text-center">
                            <input
                              type="checkbox"
                              checked={perm?.[field] || false}
                              disabled={!isEditing} // <-- chỉ enable nếu isEditing = true
                              onChange={() =>
                                handleCheckboxChange(fn.functionId, field)
                              }
                            />
                          </td>
                        )
                      )}
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}

        <div className="mt-6 flex justify-end gap-3">
          <div>
            <Button
              onClick={() => {
                if (isEditing) {
                  setShowConfirmUpdate(true);
                }
                setIsEditing(!isEditing); //Chuyển chế độ
              }}
              className={`group flex items-center gap-2 ${
                isEditing
                  ? "bg-green-600 hover:bg-green-700"
                  : "bg-yellow-500 hover:bg-yellow-600"
              } text-white hover:scale-105 transform transition-all duration-300 shadow-lg hover:shadow-xl px-3 py-2 text-sm`}
            >
              {" "}
              <Edit className="w-4 h-4 group-hover:scale-110 transition-transform duration-300" />
              <span className="hidden sm:inline">
                {isEditing ? "Update" : "Edit"}
              </span>
            </Button>
            <ConfirmDialog
              isOpen={showConfirmUpdate}
              title="Update"
                message="Are you sure you want to update permissions?"
              onConfirm={() => {
                handleUpdate();
                setShowConfirmUpdate(false);
              }}
              onCancel={() => setShowConfirmUpdate(false)}
            />
          </div>
          <div>
            <Button
              onClick={() => setShowConfirm(true)}
              className="group flex items-center gap-2 bg-red-600 text-white hover:bg-red-700 hover:scale-105 transform transition-all duration-300 shadow-lg hover:shadow-xl px-3 py-2 text-sm"
            >
              <Trash className="w-4 h-4 group-hover:scale-110 transition-transform duration-300" />
              <span className="hidden sm:inline">Delete</span>
            </Button>
            <ConfirmDialog
              isOpen={showConfirm}
              title="Delete"
              message="Bạn có chắc chắn muốn xóa?"
              onConfirm={handleDeleteRole}
              onCancel={() => setShowConfirm(false)}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default PerInfoDetail;
