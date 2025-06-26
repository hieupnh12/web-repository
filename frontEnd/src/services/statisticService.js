import BASE_URL from "../api";
import { GET } from "../constants/httpMethod";

/**
 * Thống kê tổng quan: tổng số đơn, doanh thu, sản phẩm, khách hàng
 */
export const getOverviewStats = async () => {
  const response = await BASE_URL[GET]("statistics/overview");
  return response.data;
};

/**
 * Thống kê tồn kho sản phẩm
 */
export const getInventoryStatistic = async (params) => {
  const response = await BASE_URL[GET]("statistics/inventory", params);
  return response.data;
};

/**
 * Thống kê doanh thu theo tháng/năm
 */
export const getRevenueStatistic = async (params) => {
  const response = await BASE_URL[GET]("statistics/revenue", params);
  return response.data;
};

/**
 * Thống kê nhà cung cấp
 */
export const getSupplierStatistic = async (params) => {
  const response = await BASE_URL[GET]("statistics/suppliers", params);
  return response.data;
};

/**
 * Thống kê khách hàng
 */
export const getCustomerStatistic = async (params) => {
  const response = await BASE_URL[GET]("statistics/customers", params);
  return response.data;
};
