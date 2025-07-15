import BASE_URL from "../api";
import { GET, POST } from "../constants/httpMethod";
import axios from 'axios';

/**
 * Thống kê tổng quan: tổng số đơn, doanh thu, sản phẩm, khách hàng
 */
export const getInventoryStatistic = async () => {
  const response = await BASE_URL[POST]("statistic/inventory-statistic");
  return response.data;
};

export const getOverviewCounts = async () => {
  const response = await BASE_URL[GET]("statistic/count");
  return response.data;
};
export const getOverviewRevenue7Days = async () => {
  const response = await BASE_URL.get("statistic/overviews");
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
  // try {
    const response = await BASE_URL[POST]("statistic/date", data);
    // if (response.data?.code === 1000) {
    //   return {
    //     success: true,
    //     result: response.data.result,
    //   };
    // } else {
    //   return { success: false, message: response.data?.message || "Không thành công" };
    // }
    return response;
  // } catch (error) {
  //   console.error("Lỗi gọi getRevenueByDay:", {
  //     message: error.message,
  //     code: error.code,
  //     response: error.response ? error.response.data : null
  //   });
  //   return { success: false, message: "Lỗi kết nối API" };
  // }
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

