import BASE_URL from "../api";
import { GET, POST, PUT, DELETE } from "../constants/httpMethod";

// Hàm xử lý lỗi chung
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

// Khởi tạo sản phẩm
export const initProduct = async () => {
  try {
    const response = await BASE_URL[POST]("/product/init");
    return response.data?.result || null;
  } catch (error) {
    handleApiError(error, "Không thể khởi tạo sản phẩm mới");
  }
};


export const searchProducts = async ({
  brandName,
  warehouseAreaName,
  originName,
  operatingSystemName,
  productName,
  page = 1,
  limit = 10,
}) => {
  try {
    const rawParams = {
      brandName,
      warehouseAreaName,
      originName,
      operatingSystemName,
      productName,
      page: Math.max(0, page - 1),
      size: limit,
    };

    const params = new URLSearchParams();
    Object.entries(rawParams).forEach(([key, val]) => {
      if (val != null && val !== "") {
        params.append(key, val);
      }
    });

    const response = await BASE_URL[GET](`/product/search?${params.toString()}`);

    const pageData =
      response.data?.result ??
      response.data ??
      {};

    return {
      data: pageData.content || [],
      pagination: {
        total: pageData.totalElements || 0,
        page,
        limit,
        totalPages: Math.ceil((pageData.totalElements || 0) / limit),
      },
    };
  } catch (error) {
    handleApiError(error, "Không thể tìm sản phẩm");
  }
};






export const createProductWithVersions = async (productData, versions, imageFile) => {
  try {

const payload = {
  productId: productData.productId,
  products: { ...productData },
  versions,
};


    const formData = new FormData();
    formData.append("product", new Blob([JSON.stringify(payload)], { type: "application/json" }));
    if (imageFile) formData.append("image", imageFile);
    const text = await formData.get("product").text();
    console.log("Payload gửi lên backend:", payload);

    const response = await BASE_URL[POST]("/product/full/confirm", formData, {
      headers: { "Content-Type": "multipart/form-data" },
    });

    return response.data?.result;
  } catch (error) {
    handleApiError(error, "Không thể tạo sản phẩm và phiên bản");
  }
};




// export const updateProduct = async (productId, productUpdateData) => {
//   try {
//     const response = await BASE_URL[PUT](`/product/${productId}`, productUpdateData, {
//       headers: { "Content-Type": "application/json" },
//     });
//     return response.data?.result;
//   } catch (error) {
//     handleApiError(error, "Không thể cập nhật sản phẩm");
//   }
// };

export const updateProduct = async (productId, productUpdateData) => {
  try {
    const updateData = {
      ...productUpdateData,
      originId: productUpdateData.originId ? Number(productUpdateData.originId) : null,
      operatingSystemId: productUpdateData.operatingSystemId ? Number(productUpdateData.operatingSystemId) : null,
      brandId: productUpdateData.brandId ? Number(productUpdateData.brandId) : null,
      warehouseAreaId: productUpdateData.warehouseAreaId ? Number(productUpdateData.warehouseAreaId) : null,
    };
    
    delete updateData.stockQuantity;
    delete updateData.status;
    
    const response = await BASE_URL[PUT](`/product/${productId}`, updateData, {
      headers: { "Content-Type": "application/json" },
    });
    return response.data?.result;
  } catch (error) {
    handleApiError(error, "Không thể cập nhật sản phẩm");
  }
};


export const uploadProductImage = async (productId, imageFile) => {
  try {
    const formData = new FormData();
    formData.append("image", imageFile);
    const response = await BASE_URL[POST](`/product/upload_image/${productId}`, formData, {
      headers: { "Content-Type": "multipart/form-data" },
    });
    return response.data?.message; // imageUrl
  } catch (error) {
    handleApiError(error, "Không thể tải ảnh sản phẩm");
  }
};

// Lấy danh sách sản phẩm
export const getFullProducts = async ({
  page = 1,
  limit = 10,
} = {}) => {
  try {
    const params = new URLSearchParams({
      page: Math.max(0, page - 1),
      size: limit,
    });

    const response = await BASE_URL[GET](`product?${params.toString()}`);
    const pageData = response.data?.result || {};
    const data = Array.isArray(pageData.content) ? pageData.content : [];

    // Nếu stockQuantity null thì gán = 0
    const normalizedData = data.map((p) => ({
      ...p,
      stockQuantity: p.stockQuantity ?? 0,
    }));

    return {
      data: normalizedData,
      pagination: {
        total: pageData.totalElements || 0,
        page,
        limit,
        totalPages: Math.ceil((pageData.totalElements || 0) / limit),
      },
    };
  } catch (error) {
    handleApiError(error, "Không thể lấy danh sách sản phẩm");
  }
};



export const getProductById = async (productId) => {
  try {
    const response = await BASE_URL[GET](`/product/${productId}`);
    return response.data?.result || null;
  } catch (error) {
    handleApiError(error, "Không thể lấy thông tin sản phẩm");
  }
};


export const getProductByImei = async (imei) => {
  try {
    const response = await BASE_URL[GET](`/product/imei/${imei}`);
    return response.data?.result || null;
  } catch (error) {
    handleApiError(error, "Không thể tìm sản phẩm theo IMEI");
  }
};


export const deleteProduct = async (productId) => {
  try {
    return await BASE_URL[DELETE](`/product/${productId}`);
  } catch (error) {
    handleApiError(error, "Không thể xóa sản phẩm");
  }
};


export const updateAllProductStocks = async () => {
  try {
    const response = await BASE_URL[PUT]("/product/update-all-stocks");
    return response.data?.message;
  } catch (error) {
    handleApiError(error, "Không thể cập nhật tồn kho toàn bộ sản phẩm");
  }
};


export const updateStockProduct = async () => {
  try {
    const response = await BASE_URL[PUT]("/product/update-stock");
    return response.data?.message;
  } catch (error) {
    handleApiError(error, "Không thể cập nhật tồn kho sản phẩm");
  }
};

export const takeProductById = (id) => {
  return BASE_URL[GET](`/products/${id}`);
};

export const takeProduct = (page = 0, size= 20) => {
  return BASE_URL[GET](`/product/All?page=${page}&size=${size}`);
};

export const takeSearchProductByName = (keyWord) => {
  return BASE_URL[GET](`/product/search?productName=${keyWord}`);
};

export const takeAllProduct = (page = 0, size=1000) => {
  return BASE_URL[GET](`/product?page=${page}&size=${size}`);
};