import React from "react";
import { Loader2 } from "lucide-react"; // Icon quay vòng

const TableViewPer = ({ data = [], search = "", loading = false , onSelectRow}) => {
  const filteredData = data.filter((role) =>
    role.roleName.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="bg-white rounded-2xl shadow-xl p-4">
      <div className="overflow-y-auto max-h-[540px]">
        <table className="min-w-full text-center">
          <thead className="bg-gradient-to-r from-blue-50 to-indigo-50 sticky top-0 z-10">
            <tr className="w-full">
              <th className="px-6 py-3 text-xs font-semibold text-gray-700 uppercase">ID</th>
              <th className="px-6 py-3 text-xs font-semibold text-gray-700 uppercase">Permission</th>
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
              filteredData.map((item) => (
                <tr key={item.roleId} onClick={() => onSelectRow(item)} className="hover:bg-gray-100 transition-colors duration-200">
                  <td className="px-6 py-3 whitespace-nowrap text-sm text-gray-700">{item.roleId}</td>
                  <td className="px-6 py-3 whitespace-nowrap text-sm text-gray-800 font-medium">
                    {item.roleName}
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={2} className="px-6 py-4 text-center text-sm text-gray-500">
                  Don't found permissions.
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
