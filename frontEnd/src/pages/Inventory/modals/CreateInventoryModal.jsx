import React, { useState } from "react";
import { createFullStock } from "../../../services/inventoryService";

const CreateStockModal = ({ onClose, onSuccess }) => {
  const [formData, setFormData] = useState({
    createdId: "",
    areaId: "",
    status: 1,
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async () => {
    try {
      setIsSubmitting(true);
      await createFullStock(formData);
      alert("Tạo phiếu tồn kho thành công!");
      onSuccess();
    } catch (error) {
      console.error("Lỗi tạo phiếu kiểm kê:", error);
      alert("Không thể tạo phiếu tồn kho.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-md p-6 relative">
        <h2 className="text-xl font-semibold text-gray-800 mb-4">Tạo phiếu tồn kho</h2>

        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">Mã nhân viên</label>
            <input
              type="text"
              name="createdId"
              value={formData.createdId}
              onChange={handleChange}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm px-3 py-2"
              placeholder="VD: NV001"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Khu vực kho</label>
            <input
              type="text"
              name="areaId"
              value={formData.areaId}
              onChange={handleChange}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm px-3 py-2"
              placeholder="VD: 1"
            />
          </div>
        </div>

        <div className="mt-6 flex justify-end gap-3">
          <button
            onClick={onClose}
            className="bg-gray-300 hover:bg-gray-400 text-gray-800 px-4 py-2 rounded-md"
          >
            Hủy
          </button>
          <button
            onClick={handleSubmit}
            disabled={isSubmitting}
            className={`px-4 py-2 rounded-md text-white ${
              isSubmitting ? "bg-blue-400" : "bg-blue-600 hover:bg-blue-700"
            }`}
          >
            {isSubmitting ? "Đang lưu..." : "Lưu và tiếp tục"}
          </button>
        </div>

        <button
          className="absolute top-3 right-4 text-gray-500 hover:text-gray-700 text-xl"
          onClick={onClose}
        >
          ×
        </button>
      </div>
    </div>
  );
};

export default CreateStockModal;
