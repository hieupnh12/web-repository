import BASE_URL from "../api";
import { DELETE, GET, POST, PUT } from "../constants/httpMethod";


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

// hiển thị thông tin function (crud) với mỗi role Id
export const takeInfoEachRole = async (roleId) => {  
  try {
    const [functionInfoRes, roleInfoRes] = await Promise.all([
      BASE_URL[GET]("function"),
      BASE_URL[GET](`role/details/${roleId}`)
    ]);

    const functionInfo = functionInfoRes.data.result;
    const permissions = roleInfoRes.data.result.permissions;
    console.log(roleInfoRes);
    
    // Tạo map từ permissions
    const permissionsMap = new Map();
    permissions.forEach((perm) => {
      permissionsMap.set(perm.functionId, perm);
    });

    // Duyệt tất cả functionInfo (luôn đủ 12 cái nếu API đúng)
    const mergedData = functionInfo.map((func) => {
      const perm = permissionsMap.get(func.functionId) || {
        functionId: func.functionId,
        canView: false,
        canCreate: false,
        canUpdate: false,
        canDelete: false,
      };

      return {
        functionId: func.functionId,
        functionName: func.functionName,
        canView: perm.canView,
        canCreate: perm.canCreate,
        canUpdate: perm.canUpdate,
        canDelete: perm.canDelete,
      };
    });

    return {
      code: 1000,
      result: mergedData,
    };
  } catch (error) {
    console.error("❌ Failed to fetch role or function info:", error);
    return {
      code: 500,
      result: [],
      message: "Lỗi hệ thống",
    };
  }
};

// Chọn quyền truy cập các chức năng rồi update
export const takeUpdateRole = async (roleId ,data) => {
  const response = await BASE_URL[PUT](`role/update/${roleId}`, data); // URL thay theo API của bạn
  return response;
};

// lấy chức năng của tính năng
// trả về
// {
//     "functionId": 1,
//     "canView": false,
//     "canCreate": false,
//     "canUpdate": false,
//     "canDelete": false
// }
export const takeFunctionOfFeature = async (idFunction) => {
  const response = await BASE_URL[GET](`permission/${idFunction}`); // URL thay theo API của bạn
  return response;
};

