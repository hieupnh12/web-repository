import React, { useMemo } from "react";
import { Loader2 } from "lucide-react";

const TableViewPer = ({
  data = [],
  search = "",
  loading = false,
  onSelectRow,
  selectedRoleId = null, // optional prop để làm nổi bật dòng đang chọn
}) => {
  const filteredData = useMemo(() => {
    return data.filter((role) =>
      role.roleName.toLowerCase().includes(search.toLowerCase())
    );
  }, [data, search]);

  return (
    <div className="bg-white rounded-2xl shadow-xl h-[90vh] max-h-[90vh] md:h-auto">
      <div className="overflow-y-auto max-h-[75vh] md:min-h-[500px] custom-scroll">
        <table className="min-w-full text-center">
          <thead className="bg-gradient-to-r from-blue-50 to-indigo-50 sticky top-0 z-10">
            <tr>
              <th className="px-6 py-3 text-xs font-semibold text-gray-700 uppercase border-r border-gray-300">
                ID
              </th>
              <th className="px-6 py-3 text-xs font-semibold text-gray-700 uppercase">
                Tên quyền
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-100 cursor-pointer">
            {loading ? (
              <tr>
                <td colSpan={2} className="px-6 py-8 text-center">
                  <Loader2 className="mx-auto h-6 w-6 animate-spin text-blue-500" />
                  <div className="mt-2 text-sm text-gray-500">Loading...</div>
                </td>
              </tr>
            ) : filteredData.length > 0 ? (
              filteredData.map((item, index) => (
                <tr
                  key={item.roleId}
                  onClick={() => onSelectRow(item)}
                  className={`hover:bg-gray-200 transition-colors duration-200 ${
                    selectedRoleId === item.roleId ? "bg-blue-100 font-semibold" : ""
                  }`}
                >
                  <td className="px-6 py-3 whitespace-nowrap text-sm text-gray-700 w-[30%] border-r border-gray-100">
                    {index + 1}
                  </td>
                  <td className="px-6 py-3 whitespace-nowrap text-sm text-gray-800 font-medium w-[70%]">
                    {item.roleName}
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td
                  colSpan={2}
                  className="px-6 py-4 text-center text-sm text-gray-500"
                >
                  No permissions found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default TableViewPer;
