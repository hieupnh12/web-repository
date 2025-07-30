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
    return response.data?.result || response.data;
  } catch (error) {
    handleApiError(error, "Không thể tạo phiếu kiểm kê");
  }
};

export const getInventories = async (params = {}) => {
  try {
    const response = await BASE_URL[GET]("/inventory", { params });
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
    const response = await BASE_URL[POST](`/inventory-details/${inventoryId}`, request);
    return response.data?.result;
  } catch (error) {
    handleApiError(error, "Không thể lưu chi tiết kiểm kê");
  }
};

export const getInventoryDetailsById = async (inventoryId) => {
  try {
    console.log("🔍 Fetching inventory details for ID:", inventoryId);
    
    const [detailsRes, imeiRes] = await Promise.all([
      BASE_URL[GET](`/inventory-details/${inventoryId}`),
      BASE_URL[POST](`/inventory-product-details`, { inventoryId: parseInt(inventoryId) }),
    ]);
    
    console.log("📋 Details response:", detailsRes.data);
    console.log("📱 IMEI response:", imeiRes.data);
    
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
    const response = await BASE_URL[POST](`/inventory-product-details/${inventoryId}`, payload);
    return response.data?.result;
  } catch (error) {
    handleApiError(error, "Không thể lưu danh sách IMEI");
  }
};

export const markMissingIMEI = async (inventoryId, productVersionId) => {
  try {
    const response = await BASE_URL[POST](`/inventory-product-details/mark-missing/${inventoryId}/${productVersionId}`);
    return response.data?.result;
  } catch (error) {
    handleApiError(error, "Không thể đánh dấu IMEI thiếu");
  }
};

export const getProductVersions = async () => {
  try {
    const res = await BASE_URL[GET]("/productVersion");
    return res.data?.result || [];
  } catch (error) {
    handleApiError(error, "Không thể lấy danh sách phiên bản sản phẩm");
  }
};

export const getProductVersionsByInventory = async (inventoryId) => {
  try {
    // Lấy tất cả product versions vì hiện tại backend chưa có API filter theo inventory
    // Trong tương lai có thể tạo API riêng: /productVersion/by-inventory/{inventoryId}
    const res = await BASE_URL[GET]("/productVersion");
    return res.data?.result || [];
  } catch (error) {
    handleApiError(error, "Không thể lấy danh sách phiên bản sản phẩm cho kiểm kê");
  }
};

export const getImeisByProductVersion = async (productVersionId) => {
  try {
    console.log("🔍 Fetching IMEIs for product version:", productVersionId);
    const res = await BASE_URL[GET](`/product-item/available/by-version/${productVersionId}`);
    console.log("📱 IMEI response:", res.data);
    return res.data?.result || [];
  } catch (error) {
    handleApiError(error, "Không thể lấy danh sách IMEI");
  }
};