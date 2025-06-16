import BASE_URL from "../api";
import { GET } from "../constants/httpMethod";

/**
 * Lấy danh sách sản phẩm đầy đủ thông tin (gồm version, imei,...)
 */
export const getFullProducts = async ({ page = 1, limit = 5, search = '' } = {}) => {
  const params = new URLSearchParams({ page, limit });
  if (search) params.append("search", search); // đổi từ `q` nếu Spring xử lý khác

  const [productsRes, versionsRes, itemsRes, colorsRes, ramsRes, romsRes] = await Promise.all([
    BASE_URL[GET](`product?${params.toString()}`),
    // BASE_URL[GET]("productVersions"),
    // BASE_URL[GET]("productItems"),
    BASE_URL[GET]("color"),
    BASE_URL[GET]("ram"),
    BASE_URL[GET]("rom")
  ]);

  const total = productsRes.data?.totalElements || productsRes.data?.length || 0;
  const productList = productsRes.data;
console.log(colorsRes);

  const products = productList.map(product => {

    const versions = versionsRes.data.result
      .filter(v => v.productId === product.productId)
      .map(v => {
        const color = colorsRes.data.result.find(c => c.id === v.colorId);
        const ram = ramsRes.data.result.find(r => r.id === v.ramId);
        const rom = romsRes.data.result.find(r => r.id === v.romId);
        const items = itemsRes.data.result.filter(i => i.productVersionId === v.productVersionId);

        return {
          ...v,
          color: color?.name || 'N/A',
          ram: ram?.name || 'N/A',
          rom: rom?.name || 'N/A',
          imeiCount: items.length,
          imeiList: items
        };
      });

    return {
      ...product,
      versions
    };
  });

  return {
    data: products,
    pagination: {
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit)
    }
  };
};
