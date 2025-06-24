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

export const getFullProducts = async ({
  page = 1,
  limit = 10,
  search = "",
  brandId = null,
  originId = null,
  operatingSystemId = null,
  warehouseAreaId = null,
} = {}) => {
  try {
    const params = new URLSearchParams({ page, limit });
    if (search) params.append("search", search);
    if (brandId) params.append("brandId", brandId);
    if (originId) params.append("originId", originId);
    if (operatingSystemId) params.append("operatingSystemId", operatingSystemId);
    if (warehouseAreaId) params.append("warehouseAreaId", warehouseAreaId);

    const productsRes = await BASE_URL[GET](`product?${params.toString()}`);
    const data = productsRes.data || {};
    const total = data.totalElements || data.length || 0;
    const productList = Array.isArray(data) ? data : data.content || [];

    const products = productList.map((product) => ({
      ...product,
      image: product.image || null,
      versions: [],
    }));

    return {
      data: products,
      pagination: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
      },
    };
  } catch (error) {
    handleApiError(error, "Không thể lấy danh sách sản phẩm");
  }
};

export const updateProduct = async (productId, productData) => {
  try {
    if (process.env.NODE_ENV === "development") {
      console.log("Calling updateProduct with:", { productId, productData });
    }
    return await BASE_URL[PUT](`/product/${productId}`, productData, {
      headers: {
        "Content-Type": "application/json",
      },
    });
  } catch (error) {
    handleApiError(error, "Không thể cập nhật sản phẩm");
  }
};

export const uploadProductImage = async (productId, imageFile) => {
  try {
    const formData = new FormData();
    formData.append("image", imageFile);

    return await BASE_URL[POST](`/product/upload_image/${productId}`, formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
  } catch (error) {
    handleApiError(error, "Không thể tải ảnh sản phẩm");
  }
};

export const getAllBrands = async () => {
  try {
    const res = await BASE_URL[GET]("brand");
    if (process.env.NODE_ENV === "development") {
      console.log("Brand API response:", res.data);
    }
    return {
      data: Array.isArray(res.data) ? res.data : res.data?.content || res.data?.data || [],
    };
  } catch (error) {
    handleApiError(error, "Không thể tải danh sách thương hiệu");
  }
};

export const getAllOrigins = async () => {
  try {
    const res = await BASE_URL[GET]("origin");
    if (process.env.NODE_ENV === "development") {
      console.log("Origin API response:", res.data);
    }
    return {
      data: Array.isArray(res.data) ? res.data : res.data?.content || res.data?.data || [],
    };
  } catch (error) {
    handleApiError(error, "Không thể tải danh sách xuất xứ");
  }
};

export const getAllOperatingSystems = async () => {
  try {
    const res = await BASE_URL[GET]("operating_system");
    if (process.env.NODE_ENV === "development") {
      console.log("Operating System API response:", res.data);
    }
    return {
      data: Array.isArray(res.data) ? res.data : res.data?.content || res.data?.data || [],
    };
  } catch (error) {
    handleApiError(error, "Không thể tải danh sách hệ điều hành");
  }
};

export const getAllWarehouseAreas = async () => {
  try {
    const res = await BASE_URL[GET]("warehouse_area");
    if (process.env.NODE_ENV === "development") {
      console.log("Warehouse Area API response:", res.data);
    }
    return {
      data: Array.isArray(res.data) ? res.data : res.data?.content || res.data?.data || [],
    };
  } catch (error) {
    handleApiError(error, "Không thể tải danh sách khu vực kho");
  }
};