import BASE_URL from "../api";
import { DELETE, GET, POST } from "../constants/httpMethod";


export const takePermission = () => {
    const responds = BASE_URL[GET]("role");
    return responds;
}

export const takeCreateFunction = async (data) => {
  const response = await BASE_URL[POST]("role", data); // URL thay theo API của bạn
  return response;
};

export const takeFunctions = async () => {
  const response = await BASE_URL[GET]("function"); // URL thay theo API của bạn
  return response.data;
};

export const takeDeleteRole = async (data) => {
  const response = await BASE_URL[DELETE](`role/${data}`); // URL thay theo API của bạn
  return response;
};