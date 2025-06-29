import BASE_URL from "../api";
import { DELETE, GET, POST, PUT } from "../constants/httpMethod";


// lấy danh sách nhà cung cấp (trả về tất cả)
export const takeSupplier = () => {
    const responds = BASE_URL[GET]("supplier");
    return responds;
}

// Tạo 1 nhà cung cấp
export const takeCreateSupplier = (data) => {
    const responds = BASE_URL[POST](`supplier`, data);
    return responds;
}

// Update 1 nhà cung cấp
export const takeUpdateSupplier = (idSup, data) => {
    const responds = BASE_URL[PUT](`supplier/${idSup}`, data);
    return responds;
}

// Xóa 1 nhà cung cấp
export const takeDeleteSupplier = (idSup) => {
    const responds = BASE_URL[DELETE](`supplier/${idSup}`);
    return responds;
}

