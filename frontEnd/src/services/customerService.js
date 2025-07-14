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

// Lấy danh sách khách hàng phân trang
export const takeCustomer = async (page = 0, size = 10) => {
  const response = BASE_URL[GET](`/customer?page=${page}&size=${size}`);
  return response;
};

export const takeCustomerAll = async () => {
  const response = BASE_URL[GET](`/customer`);
  return response;
};

// Tìm kiếm khách hàng theo từ khóa với phân trang
export const searchCustomers = async (keyword, page = 0, size = 5) => {
  const response = BASE_URL[GET](`/customer/search?keyword=${keyword}&page=${page}&size=${size}`);
  return response;
};


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