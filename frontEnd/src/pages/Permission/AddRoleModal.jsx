import React, { useEffect, useState } from "react";
import { X, Loader2 } from "lucide-react";
import Button from "../../components/ui/Button";
import { takeFunctions } from "../../services/permissionService";
import { toast } from "react-toastify";

const AddRoleModal = ({ onClose, onSubmit, existingRoles }) => {
  const [functions, setFunctions] = useState([]);
  const [loading, setLoading] = useState(false);
  const [roleName, setRoleName] = useState("");
  const [description, setDescription] = useState("");
  const [permission, setPermissions] = useState([]);

  useEffect(() => {
    const loadRole = async () => {
      setLoading(true);
      try {
        const info = await takeFunctions();

        if (info.code === 1000 && info?.result) {
          const result = info.result;

          setFunctions(result);
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
        console.error("Error loading functions:", error);
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

  function getObjectsWithPermissions(data) {
    return data.filter(
      (item) =>
        item.canView || item.canCreate || item.canUpdate || item.canDelete
    );
  }

  const handleSubmit = () => {
    const permissions = getObjectsWithPermissions(permission);
    const nameTrimmed = roleName.trim();
    const isDuplicate = existingRoles.some(
    (role) => role.roleName.toLowerCase() === nameTrimmed.toLowerCase()
  );

  if (isDuplicate) {
    toast.error("Tên quyền đã tồn tại, vui lòng chọn tên khác!");
    return;
  }
  if (!roleName) {
    toast.error("Vui lòng nhập tên quyền!");
    return;
  }
  
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
          <X className="w-5 h-5" />
        </button>
        <div className="flex justify-between gap-4">
          <div className="mb-4 w-2/4">
            <label className="block mb-1">Tên quyền *</label>
            <input
              value={roleName}
              required={true}
              onChange={(e) => setRoleName(e.target.value)}
              className="w-full border rounded-md p-2"
              placeholder="Enter role name"
            />
          </div>

          <div className="mb-4 w-2/4">
            <label className="block mb-1">Mô tả</label>
            <input
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full border rounded-md p-2"
              placeholder="Enter description"
            />
          </div>
        </div>
        {loading ? (
          <div className="py-8 text-center">
            <Loader2 className="mx-auto h-6 w-6 animate-spin text-blue-500" />
            <div className="mt-2 text-sm text-gray-500">
              Loading data...
            </div>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full border">
              <thead className="bg-gray-100 text-sm">
                <tr>
                  <th className="p-2 text-left">Function Group</th>
                  <th className="p-2 text-center">View</th>
                  <th className="p-2 text-center">Create</th>
                  <th className="p-2 text-center">Update</th>
                  <th className="p-2 text-center">Delete</th>
                </tr>
              </thead>
              <tbody>
                {functions?.map((fn) => {
                  const perm = permission.find(
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
            Add Role
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

export default AddRoleModal;
