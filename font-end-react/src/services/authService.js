import BASE_URL from "../api/axinosInstance"
import { POST } from "../constants/httpMethod"


export const login = (user) => {
    const response = BASE_URL[POST]("auth/login", user);

    return response;
}
 
export const createStaff = (user) => {
    const response = BASE_URL[POST]("staff", user);

    return response;
}