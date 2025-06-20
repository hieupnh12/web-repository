import BASE_URL from '../api';
import {
  addEmployee,
  updateEmployee,
  deleteEmployee,
} from '../api/employeeApi';
import { GET } from '../constants/httpMethod';


export const fetchStaffList = () => {
    const responds = BASE_URL[GET]("staff");
    return responds;
}


export const createStaff = async (staff) => {
  return await addEmployee(staff);
};

export const editStaff = async (id, staff) => {
  return await updateEmployee(id, staff);
};

export const removeStaff = async (id) => {
  return await deleteEmployee(id);
};
