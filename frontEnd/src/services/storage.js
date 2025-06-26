import BASE_URL from "../api";
import { GET, POST } from "../constants/httpMethod";

/**
 * lấy danh sách khu vực kho (trả về tất cả)
 * @returns (id name note status(t/f))
 */
export const takeWarehouseArea = () => {
    const responds = BASE_URL[GET]("warehouse_area");
    return responds;
}

/**
 * Lấy khu vực bởi id
 * @returns khu vực kho
 */
export const takeWarehouseAreaById = (idWare) => {
    const responds = BASE_URL[PUT](`warehouse_area/${idWare}`);
    return responds;
}

/**
 * Thêm danh sách sản phẩm đang có ở khu vực nữa
 * @returns (ảnh / tên / số lượng)
 */


/**
 * Tạo 1 khu vực kho code 1000/result
 * @returns message và thông tin đã thêm
 */
export const takeCreateWarehouseArea = (data) => {
    const responds = BASE_URL[POST](`warehouse_area`, data);
    return responds;
}

// Update 1 nhà cung cấp
export const takeUpdateWarehouseArea = (idWare, data) => {
    const responds = BASE_URL[PUT](`warehouse_area/${idWare}`, data);
    return responds;
}

// Xóa 1 nhà cung cấp
export const takeDeleteWarehouseArea = (idWare) => {
    const responds = BASE_URL[DELETE](`warehouse_area/${idWare}`);
    return responds;
}

