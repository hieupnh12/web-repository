import BASE_URL from "../api";
import { GET, POST, PUT } from "../constants/httpMethod";

/**
 * Lấy danh sách sản phẩm đầy đủ (bao gồm các thuộc tính phụ trợ nếu cần)
 */
export const getFullProducts = async ({ page = 1, limit = 5, search = '' } = {}) => {
  const params = new URLSearchParams({ page, limit });
  if (search) params.append("search", search);

  const [productsRes, /*versionsRes*/, /*itemsRes*/, colorsRes, ramsRes, romsRes] = await Promise.all([
    BASE_URL[GET](`product?${params.toString()}`),
    // BASE_URL[GET]("productVersion"), // mở nếu cần versions
    // BASE_URL[GET]("productItems"),
    BASE_URL[GET]("color"),
    BASE_URL[GET]("ram"),
    BASE_URL[GET]("rom"),
  ]);

  const total = productsRes.data?.totalElements || productsRes.data?.length || 0;
  const productList = productsRes.data || [];

  const products = productList.map((product) => {
    return {
      ...product,
      image: product.image || null,
      versions: [], // Gán rỗng, nếu cần sau này sẽ bổ sung
    };
  });

  return {
    data: products,
    pagination: {
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
    },
  };
};

/**
 * Cập nhật thông tin sản phẩm (KHÔNG gửi ảnh, chỉ gửi JSON thuần)
 */
export const updateProduct = async (productId, productData) => {
  return BASE_URL[PUT](`/product/${productId}`, productData, {
    headers: {
      "Content-Type": "application/json",
    },
  });
};

/**
 * Gửi ảnh riêng biệt cho sản phẩm
 */
export const uploadProductImage = (productId, imageFile) => {
  const formData = new FormData();
  formData.append("image", imageFile);

  return BASE_URL[POST](`/upload_image/${productId}`, formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });
};
