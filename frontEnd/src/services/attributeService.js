import BASE_URL from "../api";
import { GET, POST, PUT, DELETE } from "../constants/httpMethod";

const handleApiError = (error, defaultMessage) => {
  const errorDetails = {
    message: error.message,
    response: error.response?.data,
    status: error.response?.status,
  };
  console.error(defaultMessage, errorDetails);

  const errorMessage =
    error.response?.data?.message ||
    (typeof error.response?.data === "object" ? JSON.stringify(error.response?.data) : error.message) ||
    defaultMessage;

  throw new Error(errorMessage);
};

// Utility function for consistent response format
const extractDataList = (res) => {
  return Array.isArray(res.data) ? res.data : res.data?.content || res.data?.data || [];
};

/* ------- BRAND ------- */
export const getAllBrands = async () => {
  try {
    const res = await BASE_URL[GET]("brand");
    return { data: extractDataList(res) };
  } catch (error) {
    handleApiError(error, "Không thể tải danh sách thương hiệu");
  }
};

export const createBrand = async (data) => {
  try {
    return await BASE_URL[POST]("brand", data);
  } catch (error) {
    handleApiError(error, "Không thể tạo thương hiệu");
  }
};

export const updateBrand = async (id, data) => {
  try {
    return await BASE_URL[PUT](`brand/${id}`, data);
  } catch (error) {
    handleApiError(error, "Không thể cập nhật thương hiệu");
  }
};

export const deleteBrand = async (id) => {
  try {
    return await BASE_URL[DELETE](`brand/${id}`);
  } catch (error) {
    handleApiError(error, "Không thể xóa thương hiệu");
  }
};

/* ------- ORIGIN ------- */
export const getAllOrigins = async () => {
  try {
    const res = await BASE_URL[GET]("origin");
    return { data: extractDataList(res) };
  } catch (error) {
    handleApiError(error, "Không thể tải danh sách xuất xứ");
  }
};

export const createOrigin = async (data) => {
  try {
    return await BASE_URL[POST]("origin", data);
  } catch (error) {
    handleApiError(error, "Không thể tạo xuất xứ");
  }
};

export const updateOrigin = async (id, data) => {
  try {
    return await BASE_URL[PUT](`origin/${id}`, data);
  } catch (error) {
    handleApiError(error, "Không thể cập nhật xuất xứ");
  }
};

export const deleteOrigin = async (id) => {
  try {
    return await BASE_URL[DELETE](`origin/${id}`);
  } catch (error) {
    handleApiError(error, "Không thể xóa xuất xứ");
  }
};

/* ------- OPERATING SYSTEM ------- */
export const getAllOSs = async () => {
  try {
    const res = await BASE_URL[GET]("operating_system");
    return { data: extractDataList(res) };
  } catch (error) {
    handleApiError(error, "Không thể tải danh sách hệ điều hành");
  }
};

export const createOS = async (data) => {
  try {
    return await BASE_URL[POST]("operating_system", data);
  } catch (error) {
    handleApiError(error, "Không thể tạo hệ điều hành");
  }
};

export const updateOS = async (id, data) => {
  try {
    return await BASE_URL[PUT](`operating_system/${id}`, data);
  } catch (error) {
    handleApiError(error, "Không thể cập nhật hệ điều hành");
  }
};

export const deleteOS = async (id) => {
  try {
    return await BASE_URL[DELETE](`operating_system/${id}`);
  } catch (error) {
    handleApiError(error, "Không thể xóa hệ điều hành");
  }
};

/* ------- RAM ------- */
export const getAllRAMs = async () => {
  try {
    const res = await BASE_URL[GET]("ram");
    return { data: extractDataList(res) };
  } catch (error) {
    handleApiError(error, "Không thể tải danh sách RAM");
  }
};

export const createRAM = async (data) => {
  try {
    return await BASE_URL[POST]("ram", data);
  } catch (error) {
    handleApiError(error, "Không thể tạo RAM");
  }
};

export const updateRAM = async (id, data) => {
  try {
    return await BASE_URL[PUT](`ram/${id}`, data);
  } catch (error) {
    handleApiError(error, "Không thể cập nhật RAM");
  }
};

export const deleteRAM = async (id) => {
  try {
    return await BASE_URL[DELETE](`ram/${id}`);
  } catch (error) {
    handleApiError(error, "Không thể xóa RAM");
  }
};

/* ------- ROM ------- */
export const getAllROMs = async () => {
  try {
    const res = await BASE_URL[GET]("rom");
    return { data: extractDataList(res) };
  } catch (error) {
    handleApiError(error, "Không thể tải danh sách ROM");
  }
};

export const createROM = async (data) => {
  try {
    return await BASE_URL[POST]("rom", data);
  } catch (error) {
    handleApiError(error, "Không thể tạo ROM");
  }
};

export const updateROM = async (id, data) => {
  try {
    return await BASE_URL[PUT](`rom/${id}`, data);
  } catch (error) {
    handleApiError(error, "Không thể cập nhật ROM");
  }
};

export const deleteROM = async (id) => {
  try {
    return await BASE_URL[DELETE](`rom/${id}`);
  } catch (error) {
    handleApiError(error, "Không thể xóa ROM");
  }
};

/* ------- COLOR ------- */
export const getAllColors = async () => {
  try {
    const res = await BASE_URL[GET]("color");
    return { data: extractDataList(res) };
  } catch (error) {
    handleApiError(error, "Không thể tải danh sách màu sắc");
  }
};

export const createColor = async (data) => {
  try {
    return await BASE_URL[POST]("color", data);
  } catch (error) {
    handleApiError(error, "Không thể tạo màu sắc");
  }
};

export const updateColor = async (id, data) => {
  try {
    return await BASE_URL[PUT](`color/${id}`, data);
  } catch (error) {
    handleApiError(error, "Không thể cập nhật màu sắc");
  }
};

export const deleteColor = async (id) => {
  try {
    return await BASE_URL[DELETE](`color/${id}`);
  } catch (error) {
    handleApiError(error, "Không thể xóa màu sắc");
  }
};
