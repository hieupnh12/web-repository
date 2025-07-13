import BASE_URL from "../api";
import { GET, POST, PUT } from "../constants/httpMethod";

const handleApiError = (error, defaultMessage) => {
  const errorDetails = {
    message: error.message,
    response: error.response?.data,
    status: error.response?.status,
  };
  console.error(defaultMessage, errorDetails);
  const errorMessage =
    error.response?.data?.message ||
    (typeof error.response?.data === "object" ? JSON.stringify(error.response?.data) : error.message) ||
    defaultMessage;
  throw new Error(errorMessage);
};

// 📌 1. Tạo phiếu kiểm kê đầy đủ
export const createFullStock = async (data) => {
  try {
    const response = await BASE_URL[POST]("/inventory", data, {
      headers: {
        "Content-Type": "application/json",
      },
    });
    return response.data;
  } catch (error) {
    handleApiError(error, "Không thể tạo phiếu tồn kho");
  }
};

// 📌 2. Lấy danh sách các phiếu kiểm kê
export const getFullStocks = async ({
  page = 1,
  limit = 10,
  search = "",
  areaId = null,
  status = null,
} = {}) => {
  try {
    const params = new URLSearchParams({ page, limit });
    if (search) params.append("search", search);
    if (areaId) params.append("areaId", areaId);
    if (status) params.append("status", status);

    const res = await BASE_URL[GET](`/inventory?${params.toString()}`);
    const data = res.data || {};
    const list = Array.isArray(data) ? data : data.result || [];
    const total = data.totalElements || list.length;

    return {
      data: list,
      pagination: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
      },
    };
  } catch (error) {
    handleApiError(error, "Không thể tải danh sách kiểm kê");
  }
};

// 📌 3. Lấy chi tiết phiếu kiểm kê theo ID
export const getStockById = async (id) => {
  try {
    const res = await BASE_URL[GET](`/inventory/${id}`);
    return res.data?.result || res.data;
  } catch (error) {
    handleApiError(error, `Không thể lấy chi tiết phiếu tồn kho #${id}`);
  }
};

// 📌 4. Cập nhật trạng thái phiếu kiểm kê (ví dụ: hoàn tất)
export const updateStockStatus = async (id, status = 2) => {
  try {
    return await BASE_URL[PUT](`/inventory/${id}`, { status });
  } catch (error) {
    handleApiError(error, `Không thể cập nhật trạng thái phiếu #${id}`);
  }
};

// 📌 5. Cập nhật tồn kho theo số lượng kiểm kê
export const updateProductVersionStock = async (inventoryId) => {
  try {
    // Lưu ý: bạn cần có API tương ứng backend như PUT /inventory/update-stock/{inventoryId}
    return await BASE_URL[PUT](`/inventory/update-stock/${inventoryId}`);
  } catch (error) {
    handleApiError(error, `Không thể cập nhật tồn kho từ phiếu #${inventoryId}`);
  }
};

// 📌 6. Lấy chi tiết số lượng (InventoryDetails)
export const getReportInventoryDetails = async (inventoryId) => {
  try {
    const res = await BASE_URL[GET](`/inventory-details/${inventoryId}`);
    return res.data?.result || [];
  } catch (error) {
    handleApiError(error, `Không thể tải chi tiết kiểm kê cho phiếu #${inventoryId}`);
  }
};

// 📌 7. Gửi danh sách IMEI đã quét
export const submitImeiDetails = async (imeiList) => {
  try {
    return await BASE_URL[POST](`/inventory-product-details`, imeiList, {
      headers: {
        "Content-Type": "application/json",
      },
    });
  } catch (error) {
    handleApiError(error, "Không thể lưu IMEI");
  }
};

// 📌 8. Đánh dấu các IMEI bị thiếu
export const markMissingImeis = async (inventoryId, productVersionId) => {
  try {
    return await BASE_URL[POST](`/inventory-product-details/mark-missing/${inventoryId}/${productVersionId}`);
  } catch (error) {
    handleApiError(error, "Không thể đánh dấu IMEI bị thiếu");
  }
};
