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

///////////////////////
// 📌 1. Tạo phiếu kiểm kê đầy đủ (Inventory + Details + IMEI)
export const createFullStock = async (data) => {
  try {
    const response = await BASE_URL[POST]("/inventory", data, {
      headers: {
        "Content-Type": "application/json",
      },
    });
    return response.data;
  } catch (error) {
    handleApiError(error, "Không thể tạo phiếu kiểm kê");
  }
};

///////////////////////
// 📌 2. Lấy danh sách phiếu kiểm kê (có phân trang + filter)
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
    if (status !== null) params.append("status", status);

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
    handleApiError(error, "Không thể tải danh sách phiếu kiểm kê");
  }
};

///////////////////////
// 📌 3. Lấy chi tiết phiếu kiểm kê theo ID (Inventory + Details + IMEI)
export const getStockById = async (id) => {
  try {
    const res = await BASE_URL[GET](`/inventory/${id}`);
    return res.data?.result || res.data;
  } catch (error) {
    handleApiError(error, `Không thể lấy chi tiết phiếu kiểm kê #${id}`);
  }
};

///////////////////////
// 📌 4. Cập nhật phiếu kiểm kê (trạng thái, chi tiết, IMEI)
export const updateFullStock = async (id, data) => {
  try {
    return await BASE_URL[PUT](`/inventory/${id}`, data, {
      headers: {
        "Content-Type": "application/json",
      },
    });
  } catch (error) {
    handleApiError(error, `Không thể cập nhật phiếu kiểm kê #${id}`);
  }
};

///////////////////////
// 📌 5. Cập nhật tồn kho sau khi kiểm kê (Adjust Stock Quantity)
export const updateProductVersionStock = async (inventoryId) => {
  try {
    return await BASE_URL[PUT](`/inventory/update-stock/${inventoryId}`);
  } catch (error) {
    handleApiError(error, `Không thể cập nhật tồn kho từ phiếu #${inventoryId}`);
  }
};

///////////////////////
// 📌 6. Lấy chi tiết số lượng kiểm kê (InventoryDetails)
export const getReportInventoryDetails = async (inventoryId) => {
  try {
    const res = await BASE_URL[GET](`/inventory-details/${inventoryId}`);
    return res.data?.result || [];
  } catch (error) {
    handleApiError(error, `Không thể tải chi tiết kiểm kê cho phiếu #${inventoryId}`);
  }
};

///////////////////////
// 📌 7. Lấy danh sách IMEI theo khu vực & phiên bản sản phẩm
export const getImeiByAreaAndVersion = async ({ areaId, productVersionId }) => {
  try {
    const res = await BASE_URL[GET](`/inventory-product-details`, {
      data: { areaId, productVersionId },
    });
    return res.data?.result || [];
  } catch (error) {
    handleApiError(error, "Không thể lấy danh sách IMEI theo khu vực và phiên bản sản phẩm");
  }
};

///////////////////////
// 📌 8. Gửi danh sách IMEI đã quét
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

///////////////////////
// 📌 9. Đánh dấu các IMEI bị thiếu (MISSING)
export const markMissingImeis = async (inventoryId, productVersionId) => {
  try {
    return await BASE_URL[POST](`/inventory-product-details/mark-missing/${inventoryId}/${productVersionId}`);
  } catch (error) {
    handleApiError(error, "Không thể đánh dấu IMEI bị thiếu");
  }
};
