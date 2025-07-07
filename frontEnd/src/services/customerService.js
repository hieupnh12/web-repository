import BASE_URL from "../api";
import { DELETE, GET, POST, PUT } from "../constants/httpMethod";


/**
 * {
            "customerId": "7b56a357-e256-4d96-a36c-e77c948f7b9e",
            "customerName": "Nguyen Minh Hieu",
            "address": "133, Ngu Hanh Son, Da Nang",
            "phone": "0336400125",
            "status": true,
            "joinDate": "2025-06-21T15:09:37"
        },
 */

// lấy danh sách khách hàng (trả về tất cả)
export const takeCustomer = () => {
    const responds = BASE_URL[GET]("customer");
    return responds;
}


// Tạo 1 khách hàng
export const takeCreateCustomer = (data) => {
    const responds = BASE_URL[POST]("customer", data);
    return responds;
}

// Update 1 nhà cung cấp
export const takeUpdateCustomer = (idCus, data) => {
    const responds = BASE_URL[PUT](`customer/${idCus}`, data);
    return responds;
}

// Xóa 1 nhà cung cấp
export const takeDeleteCustomer = (idCus) => {
    const responds = BASE_URL[DELETE](`customer/${idCus}`);
    return responds;
}