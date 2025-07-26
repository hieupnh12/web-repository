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
  try {
    const res = await BASE_URL[GET](`statistic/revenue/moth/${year}`);
    return res.data.result;
  } catch (error) {
    console.error('Error fetching revenue data:', {
      message: error.message,
      code: error.code,
      response: error.response ? error.response.data : null,
      url: `statistic/revenue/moth/${year}`
    });
    throw error;
  }
};
