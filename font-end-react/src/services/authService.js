import BASE_URL from "../api/axinosInstance"
import { DELETE, GET, PUT, POST } from "../constants/httpMethod"


export const login = (user) => {
    const response = BASE_URL[POST]("auth/login", user);

    return response;
}
 
export const createStaff = (user) => {
    const response = BASE_URL[POST]("staff", user);

    return response;
}

export const showStaff = () => {
    const response = BASE_URL[GET]("staff");

    return response;
}

export const deleteStaff = (id) => {
    const response = BASE_URL[DELETE](`staff/${id}`);

    return response;
}

export const updateStaff = (id, staffData) => {
  const response = BASE_URL[PUT](`staff/${id}`, staffData);
  return response;
};