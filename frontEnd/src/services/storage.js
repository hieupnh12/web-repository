import BASE_URL from "../api";
import { GET, POST, PUT, DELETE } from "../constants/httpMethod";

/**
 * Lấy danh sách khu vực kho
 * @returns Array<{ id: string, name: string, note: string, status: boolean }>
 */
export const takeWarehouseArea = () => {
  return BASE_URL[GET]("warehouse_area");
};

export const takeWarehouseAreaInven = async () => {
  const response = await BASE_URL[GET]("warehouse_area");
  console.log("Warehouse Area API response:", response.data);

  // Nếu response.data là array trực tiếp, return luôn
  if (Array.isArray(response.data)) {
    return response.data;
  }
  // Nếu vẫn dùng key result
  return Array.isArray(response.data?.result) ? response.data.result : [];
};


/**
 * Lấy thông tin chi tiết khu vực kho theo ID
 * @param {string | number} idWare
 * @returns WarehouseArea { id, name, location, capacity, description, ... }
 */
export const takeWarehouseAreaById = (idWare) => {
  return BASE_URL[GET](`warehouse_area/${idWare}`);
};

/**
 * Tạo mới khu vực kho
 * @param {object} data - { name, description (optional), location (optional), capacity (optional) }
 * @returns ApiResponse<WarehouseArea>
 */
export const takeCreateWarehouseArea = (data) => {
  return BASE_URL[POST]("warehouse_area", data);
};

/**
 * Cập nhật khu vực kho
 * @param {string | number} idWare
 * @param {object} data - WarehouseUpdateRequest
 * @returns WarehouseAreaResponse { id, name, note, status }
 */
export const takeUpdateWarehouseArea = (idWare, data) => {
  return BASE_URL[PUT](`warehouse_area/${idWare}`, data);
};

/**
 * Xóa khu vực kho
 * @param {string | number} idWare
 * @returns void
 */
export const takeDeleteWarehouseArea = (idWare) => {
  return BASE_URL[DELETE](`warehouse_area/${idWare}`);
};
