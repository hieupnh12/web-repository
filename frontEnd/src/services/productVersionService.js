import BASE_URL from "../api";
import { GET, POST, PUT, DELETE } from "../constants/httpMethod";

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


export const createProductVersion = async (versionData) => {
  try {
    const response = await BASE_URL[POST]("/product/full/confirm", versionData, {
      headers: { "Content-Type": "application/json" },
    });
    return response.data?.result;
  } catch (error) {
    handleApiError(error, "Không thể tạo phiên bản sản phẩm");
  }
};


export const updateProductVersion = async (versionId, versionData) => {
  try {
    const response = await BASE_URL[PUT](`/product_version/${versionId}`, versionData, {
      headers: { "Content-Type": "application/json" },
    });
    return response.data?.result;
  } catch (error) {
    handleApiError(error, "Không thể cập nhật phiên bản sản phẩm");
  }
};


export const deleteProductVersion = async (versionId) => {
  try {
    return await BASE_URL[DELETE](`/product_version/${versionId}`);
  } catch (error) {
    handleApiError(error, "Không thể xóa phiên bản sản phẩm");
  }
};


export const getVersionsByProductId = async (productId) => {
  try {
    const response = await BASE_URL[GET](`/productVersion/${productId}`);
    return response.data?.result || [];
  } catch (error) {
    handleApiError(error, "Không thể lấy danh sách phiên bản sản phẩm");
  }
};

export const getVersionById = async (versionId) => {
  try {
    const response = await BASE_URL[GET](`/product_version/${versionId}`);
    return response.data?.result;
  } catch (error) {
    handleApiError(error, "Không thể lấy thông tin phiên bản sản phẩm");
  }
};
