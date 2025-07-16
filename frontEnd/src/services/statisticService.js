import BASE_URL from "../api";
import { GET, POST } from "../constants/httpMethod";
import axios from 'axios';

/**
 * Thống kê tổng quan: tổng số đơn, doanh thu, sản phẩm, khách hàng
 */


export const getInventoryStatistic = async (payload) => {
  const response = await BASE_URL[POST]("statistic/inventory-statistic", payload);
  return response.data;
};


export const getOverviewCounts = async () => {
  const response = await BASE_URL[GET]("statistic/count");
  return response.data;
};
export const getOverviewRevenue7Days = async () => {
  const response = await BASE_URL[GET]("statistic/overviews");
  return response.data;
};

export const getRevenueByYears = async (startYear, endYear) => {
    const data = {
    "startYear": startYear,
    "endYear": endYear
};
  const response = await BASE_URL[POST]("statistic/year", data);
   return response;
};
export const getRevenueByDay = async (year, month) => {
  const data = {
    "year": year,
    "month": month
};
 
    const response = await BASE_URL[POST]("statistic/date", data);

    return response;

};


export const getRevenueByMonth = async (year) => {
  try {
    const res = await BASE_URL[GET](`statistic/revenue/moth/${year}`);
    return res.data;
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
export const getRevenueByDateRange  = async (startDate, endDate) => {
    const data = {
    "startDate": startDate,
    "endDate": endDate
};
  const response = await BASE_URL[POST]("statistic/date-to-date", data);
   return response;
}
/**
 * Thống kê nhà cung cấp
 */
export const getSupplierStatistic = async () => {
  const response = await BASE_URL[GET]("statistic/supplierStatistics");
  return response.data;
};


/**
 * Thống kê khách hàng
 */
export const getCustomerStatistic = async () => {
  const response = await BASE_URL[GET]("statistic/customer-statistics");
  return response.data;
};

