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

// ✅ FIXED: Lấy danh sách sản phẩm có phân trang (chuyển page - 1)
export const getFullProducts = async ({
  page = 1, // frontend giữ 1-based để hiển thị đúng
  limit = 10,
  search = "",
  brandId = null,
  originId = null,
  operatingSystemId = null,
  warehouseAreaId = null,
} = {}) => {
  try {
    const params = new URLSearchParams({
      page: Math.max(0, page - 1), // ✅ convert sang 0-based cho Spring Boot backend
      size: limit,
    });
    if (search) params.append("search", search);
    if (brandId) params.append("brandId", brandId);
    if (originId) params.append("originId", originId);
    if (operatingSystemId) params.append("operatingSystemId", operatingSystemId);
    if (warehouseAreaId) params.append("warehouseAreaId", warehouseAreaId);

    const response = await BASE_URL[GET](`product?${params.toString()}`);
    const pageData = response.data?.result || {};
    const productList = pageData.content || [];
    const total = pageData.totalElements || 0;
    console.log("Tổng phần tử từ backend:", total);

    return {
      data: productList,
      pagination: {
        total,
        page, // giữ nguyên page để frontend hiển thị đúng
        limit,
        totalPages: Math.ceil(total / limit),
      },
    };
  } catch (error) {
    handleApiError(error, "Không thể lấy danh sách sản phẩm");
  }
};

// Lấy tất cả sản phẩm (không phân trang)
export const getAllProductsWithoutPaging = async () => {
  try {
    const response = await BASE_URL[GET]("/product/All");
    return response.data?.result || [];
  } catch (error) {
    handleApiError(error, "Không thể lấy toàn bộ sản phẩm");
  }
};

// Tạo mới sản phẩm (kèm ảnh)
export const createProduct = async (productData, imageFile) => {
  try {
    const formData = new FormData();
    formData.append("product", new Blob([JSON.stringify(productData)], { type: "application/json" }));
    if (imageFile) {
      formData.append("image", imageFile);
    }

    const response = await BASE_URL[POST]("/product", formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
    return response;
  } catch (error) {
    handleApiError(error, "Không thể tạo sản phẩm");
  }
};

// Cập nhật sản phẩm (dữ liệu JSON)
export const updateProduct = async (productId, productData) => {
  try {
    return await BASE_URL[PUT](`/product/${productId}`, productData, {
      headers: {
        "Content-Type": "application/json",
      },
    });
  } catch (error) {
    handleApiError(error, "Không thể cập nhật sản phẩm");
  }
};

// Tải ảnh sản phẩm mới lên (riêng lẻ)
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

// Xóa sản phẩm
export const deleteProduct = async (productId) => {
  try {
    const response = await BASE_URL[DELETE](`/product/${productId}`);
    return response;
  } catch (error) {
    handleApiError(error, "Không thể xóa sản phẩm");
  }
};

// Tải danh sách thương hiệu
export const getAllBrands = async () => {
  try {
    const res = await BASE_URL[GET]("brand");
    return {
      data: Array.isArray(res.data) ? res.data : res.data?.content || res.data?.data || [],
    };
  } catch (error) {
    handleApiError(error, "Không thể tải danh sách thương hiệu");
  }
};

// Tải danh sách xuất xứ
export const getAllOrigins = async () => {
  try {
    const res = await BASE_URL[GET]("origin");
    return {
      data: Array.isArray(res.data) ? res.data : res.data?.content || res.data?.data || [],
    };
  } catch (error) {
    handleApiError(error, "Không thể tải danh sách xuất xứ");
  }
};

// Tải danh sách hệ điều hành
export const getAllOperatingSystems = async () => {
  try {
    const res = await BASE_URL[GET]("operating_system");
    return {
      data: Array.isArray(res.data) ? res.data : res.data?.content || res.data?.data || [],
    };
  } catch (error) {
    handleApiError(error, "Không thể tải danh sách hệ điều hành");
  }
};

// Tải danh sách khu vực kho
export const getAllWarehouseAreas = async () => {
  try {
    const res = await BASE_URL[GET]("warehouse_area");
    return {
      data: Array.isArray(res.data) ? res.data : res.data?.content || res.data?.data || [],
    };
  } catch (error) {
    handleApiError(error, "Không thể tải danh sách khu vực kho");
  }
};
// Tải danh sách ROM
export const getAllRoms = async () => {
  try {
    const res = await BASE_URL[GET]("rom");
    return {
      data: Array.isArray(res.data) ? res.data : res.data?.content || res.data?.data || [],
    };
  } catch (error) {
    handleApiError(error, "Không thể tải danh sách ROM");
  }
};

// Tải danh sách RAM
export const getAllRams = async () => {
  try {
    const res = await BASE_URL[GET]("ram");
    return {
      data: Array.isArray(res.data) ? res.data : res.data?.content || res.data?.data || [],
    };
  } catch (error) {
    handleApiError(error, "Không thể tải danh sách RAM");
  }
};

// Tải danh sách màu sắc
export const getAllColors = async () => {
  try {
    const res = await BASE_URL[GET]("color");
    return {
      data: Array.isArray(res.data) ? res.data : res.data?.content || res.data?.data || [],
    };
  } catch (error) {
    handleApiError(error, "Không thể tải danh sách màu sắc");
  }
};

// Tạo phiên bản sản phẩm
export const createProductVersion = async (productVersionData) => {
  try {
    return await BASE_URL[POST]("/product_version", productVersionData, {
      headers: {
        "Content-Type": "application/json",
      },
    });
  } catch (error) {
    handleApiError(error, "Không thể tạo phiên bản sản phẩm");
  }
};
export const takeProductById = (id) => {
  return BASE_URL[GET](`/products/${id}`);
};

export const takeProduct = () => {
  return BASE_URL[GET](`/product/All`);
};