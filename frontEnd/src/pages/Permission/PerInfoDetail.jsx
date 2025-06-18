import React, { useEffect, useState } from "react";
import { X, Loader2 } from "lucide-react";
import Button from "../../components/ui/Button";
import { takeFunctions } from "../../services/permissionService";

const PerInfoDetail = ({ onClose, onSubmit, role }) => {
  const [functions, setFunctions] = useState([]);
  const [loading, setLoading] = useState(false);
  const [roleName, setRoleName] = useState("");
  const [description, setDescription] = useState("");
  const [permissions, setPermissions] = useState([]);

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

  const handleSubmit = () => {
    const payload = {
      roleName,
      description,
      permissions,
    };
    onSubmit(payload);
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
                              disabled
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
          <Button
            onClick={handleSubmit}
            className="bg-blue-600 hover:bg-blue-700 text-white"
          >
            Edit
          </Button>
          <Button
            onClick={onClose}
            className="bg-red-500 hover:bg-red-600 text-white"
          >
            Cancel
          </Button>
        </div>
      </div>
    </div>
  );
};

export default PerInfoDetail;
