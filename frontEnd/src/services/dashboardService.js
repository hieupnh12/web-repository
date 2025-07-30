import BASE_URL from '../api';
import { GET } from '../constants/httpMethod';

// Lấy tổng số khách hàng và thống kê tăng trưởng
export const getCustomerCount = async () => {
  const res = await BASE_URL[GET]('customer/countCustomer');
  return res.data.result;
};

// Lấy tổng số đơn xuất hôm nay và so sánh với hôm qua
export const getExportReceiptCount = async () => {
  const res = await BASE_URL[GET]('exportReceipt/countExport');
  return res.data.result;
};

// Lấy tổng số sản phẩm và tăng trưởng hôm nay
export const getProductCount = async () => {
  const res = await BASE_URL[GET]('product/countProduct');
  return res.data.result;
};

// Lấy số lượng sản phẩm đã kiểm kê và độ chính xác
export const getProductItemVerify = async () => {
  const res = await BASE_URL[GET]('productItem/verifyCount');
  return res.data.result;
};

// Lấy dữ liệu doanh thu theo tháng
export const getRevenueByMonth = async (year) => {
    const res = await BASE_URL[GET](`statistic/countMonth/${year}`);
    return res.data.result;
};
