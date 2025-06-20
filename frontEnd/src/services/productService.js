import BASE_URL from "../api";
import { GET, POST, PUT } from "../constants/httpMethod";

/**
 * Chuyển danh sách [{ id, name }] thành map { id: name }
 */
const toMap = (arr = []) => {
  const map = {};
  arr.forEach((item) => {
    if (item?.id != null) {
      map[item.id] = item.name || item.value || "N/A";
    }
  });
  return map;
};

/**
 * Lấy danh sách sản phẩm đầy đủ (bao gồm các thuộc tính phụ trợ nếu cần)
 */
export const getFullProducts = async ({ page = 1, limit = 5, search = '' } = {}) => {
  const params = new URLSearchParams({ page, limit });
  if (search) params.append("search", search);

  const [
    productsRes,
    colorsRes,
    ramsRes,
    romsRes,
    brandsRes,
    osRes,
    originsRes,
    areaRes,
    chipsetsRes
  ] = await Promise.all([
    BASE_URL[GET](`product?${params.toString()}`),
    BASE_URL[GET]("color"),
    BASE_URL[GET]("ram"),
    BASE_URL[GET]("rom"),
    BASE_URL[GET]("brand"),
    BASE_URL[GET]("operatingSystem"),
    BASE_URL[GET]("origin"),
    BASE_URL[GET]("warehouseArea"),
    BASE_URL[GET]("chipset"),
  ]);

  const total = productsRes.data?.totalElements || productsRes.data?.length || 0;
  const productList = productsRes.data || [];

  const products = productList.map((product) => {
    return {
      ...product,
      image: product.image || null,
      versions: [], // Nếu cần version sau này có thể xử lý thêm
    };
  });

  return {
    data: products,
    maps: {
      brandMap: toMap(brandsRes.data),
      osMap: toMap(osRes.data),
      originMap: toMap(originsRes.data),
      areaMap: toMap(areaRes.data),
      ramMap: toMap(ramsRes.data),
      romMap: toMap(romsRes.data),
      colorMap: toMap(colorsRes.data),
      chipsetMap: toMap(chipsetsRes.data),
    },
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
