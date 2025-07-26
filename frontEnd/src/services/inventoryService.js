import BASE_URL from "../api";
import { GET, POST, PUT } from "../constants/httpMethod";

// 📦 Hàm xử lý lỗi dùng chung
const handleApiError = (error, defaultMessage) => {
  const errorDetails = {
    message: error.message,
    response: error.response?.data,
    status: error.response?.status,
  };
  console.error(defaultMessage, errorDetails);
  const errorMessage =
    error.response?.data?.message ||
    (typeof error.response?.data === "object"
      ? JSON.stringify(error.response?.data)
      : error.message) ||
    defaultMessage;
  throw new Error(errorMessage);
};



export const createInventory = async (inventoryRequest) => {
  try {
    const response = await BASE_URL[POST]("/inventory", inventoryRequest);
    console.log("Create inventory response:", response.data);
    return response.data?.result;
  } catch (error) {
    handleApiError(error, "Không thể tạo phiếu kiểm kê");
  }
};


export const getInventories = async (params = {}) => {
  try {
    const response = await BASE_URL[GET]("/inventory", { params });
    
    // Log toàn bộ response để kiểm tra dữ liệu trả về
    console.log("API /inventory response:", response.data);

    return response.data?.result || [];
  } catch (error) {
    handleApiError(error, "Không thể tải danh sách phiếu kiểm kê");
  }
};

export const getInventoryById = async (id) => {
  try {
    const response = await BASE_URL[GET](`/inventory/${id}`);
    return response.data?.result;
  } catch (error) {
    handleApiError(error, "Không thể lấy thông tin phiếu kiểm kê");
  }
};

export const updateInventoryStatus = async (id, status) => {
  try {
    const response = await BASE_URL[PUT](`/inventory/${id}`, { status });
    return response.data?.result;
  } catch (error) {
    handleApiError(error, "Không thể cập nhật trạng thái phiếu kiểm kê");
  }
};

export const updateProductVersionStocks = async (inventoryId) => {
  try {
    const response = await BASE_URL[PUT](`/inventory/update-stocks/${inventoryId}`);
    return response.data?.result;
  } catch (error) {
    handleApiError(error, "Không thể cập nhật tồn kho theo kiểm kê");
  }
};



export const saveInventoryDetails = async (inventoryId, details) => {
  try {
    const request = details.map((d) => ({
      productVersionId: d.productVersionId,
      systemQuantity: d.systemQuantity,
      quantity: d.quantity,
      note: d.note || "",
    }));
    await BASE_URL[POST](`/inventory-details/${inventoryId}`, request);
  } catch (error) {
    handleApiError(error, "Không thể lưu chi tiết kiểm kê");
  }
};

export const getInventoryDetailsById = async (inventoryId) => {
  try {
    const [detailsRes, imeiRes] = await Promise.all([
      BASE_URL[GET](`/inventory-details/${inventoryId}`),
      BASE_URL[POST](`/inventory-product-details`, { inventoryId }), // đổi sang POST vì backend dùng @RequestBody
    ]);
    return {
      inventoryDetails: detailsRes.data?.result || [],
      inventoryProductDetails: imeiRes.data?.result || [],
    };
  } catch (error) {
    handleApiError(error, "Không thể lấy chi tiết kiểm kê");
  }
};


export const saveInventoryProductDetails = async (inventoryId, imeiList) => {
  try {
    const payload = imeiList.map((i) => ({
      imei: i.imei,
      productVersionId: i.productVersionId,
      status: i.status,
    }));
    await BASE_URL[POST](`/inventory-product-details/${inventoryId}`, payload);
  } catch (error) {
    handleApiError(error, "Không thể lưu danh sách IMEI");
  }
};

export const markMissingIMEI = async (inventoryId, productVersionId) => {
  try {
    await BASE_URL[POST](`/inventory-product-details/mark-missing/${inventoryId}/${productVersionId}`);
  } catch (error) {
    handleApiError(error, "Không thể đánh dấu IMEI thiếu");
  }
};



export const getProductVersions = async () => {
  try {
    const res = await BASE_URL[GET]("/product-versions");
    return res.data?.result || [];
  } catch (error) {
    handleApiError(error, "Không thể lấy danh sách phiên bản sản phẩm");
  }
};