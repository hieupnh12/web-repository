import React, { useEffect, useState } from "react";
import { getInventoryStatistic } from "../../../../services/statisticService";
import { TablePagination, Typography } from "@mui/material";

const InventoryStatistic = () => {
  const [inventoryData, setInventoryData] = useState([]);
  const [productVersionId, setProductVersionId] = useState("");
  const [productName, setProductName] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [error, setError] = useState(null);

  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(+event.target.value);
    setPage(0);
  };

  const handleFilter = () => {
    const today = new Date();
    const end = new Date(today.getFullYear(), today.getMonth() + 1, 0);
    const start = new Date(today.getFullYear(), today.getMonth() - 3, 1);

    const payload = {
      startTime: startDate
        ? `${startDate} 00:00:00`
        : `${start.getFullYear()}-${String(start.getMonth() + 1).padStart(2, "0")}-01 00:00:00`,
      endTime: endDate
        ? `${endDate} 23:59:59`
        : `${end.getFullYear()}-${String(end.getMonth() + 1).padStart(2, "0")}-${String(end.getDate()).padStart(2, "0")} 23:59:59`,
      productName: productName || "",
      productVersionId: productVersionId || ""
    };

    fetchFilteredData(payload);
  };

  const fetchFilteredData = async (payload) => {
    console.log("Fetching Inventory Data with payload:", payload);
    try {
      const res = await getInventoryStatistic(payload);
      console.log("Filtered Inventory Data:", res);

      if (res?.code === 1000) {
        setInventoryData(res.result || []);
        setError(null);
      } else {
        setInventoryData([]);
        setError(res?.message || "Không tải được dữ liệu tồn kho.");
      }
    } catch (err) {
      setInventoryData([]);
      setError("Lỗi khi lọc dữ liệu.");
    }
  };

  useEffect(() => {
    handleFilter();
  }, []);

  const paginatedData = inventoryData.slice(
    page * rowsPerPage,
    page * rowsPerPage + rowsPerPage
  );

  return (
    <div className="min-h-screen w-full bg-gradient-to-br from-gray-50 to-blue-50 px-4 py-6">
      <div className="bg-white rounded-2xl shadow-lg p-6 mb-6">
        <Typography variant="h6" fontWeight={600} color="primary" sx={{ mb: 2 }}>
          Thống kê tồn kho
        </Typography>

        <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
          <input
            type="text"
            value={productVersionId}
            onChange={(e) => setProductVersionId(e.target.value)}
            placeholder="Nhập mã phiên bản sản phẩm..."
            className="px-4 py-2 border border-gray-300 rounded-xl"
          />
          <input
            type="text"
            value={productName}
            onChange={(e) => setProductName(e.target.value)}
            placeholder="Nhập tên sản phẩm..."
            className="px-4 py-2 border border-gray-300 rounded-xl"
          />
          <input
            type="date"
            value={startDate}
            onChange={(e) => setStartDate(e.target.value)}
            className="px-4 py-2 border border-gray-300 rounded-xl"
          />
          <input
            type="date"
            value={endDate}
            onChange={(e) => setEndDate(e.target.value)}
            className="px-4 py-2 border border-gray-300 rounded-xl"
          />
          <button
            onClick={handleFilter}
            className="bg-blue-600 text-white px-4 py-2 rounded-xl hover:bg-blue-700 transition"
          >
            Lọc
          </button>
        </div>
        {error && <div className="mt-3 text-red-600 text-sm">{error}</div>}
      </div>

      <div className="bg-white rounded-2xl shadow-lg p-6 overflow-x-auto">
        <table className="w-full text-sm text-left rounded-xl overflow-hidden">
          <thead className="bg-[#2196f3] text-white">
            <tr>
              <th className="px-4 py-2">ID sản phẩm</th>
              <th className="px-4 py-2">Tên sản phẩm</th>
              <th className="px-4 py-2">Mã phiên bản</th>
              <th className="px-4 py-2">Tồn kho đầu kỳ</th>
              <th className="px-4 py-2">Số lượng nhập</th>
              <th className="px-4 py-2">Số lượng xuất</th>
              <th className="px-4 py-2">Tồn kho cuối kỳ</th>
            </tr>
          </thead>
          <tbody>
            {paginatedData.length > 0 ? (
              paginatedData.map((item, index) => (
                <tr
                  key={item.productVersionId}
                  className={`${
                    index % 2 === 0 ? "bg-blue-50" : "bg-white"
                  } hover:bg-blue-100 transition`}
                >
                  <td className="px-4 py-2">{item.productId}</td>
                  <td className="px-4 py-2 font-medium">{item.productName}</td>
                  <td className="px-4 py-2">{item.productVersionId}</td>
                  <td className="px-4 py-2">{item.beginningInventory}</td>
                  <td className="px-4 py-2">{item.purchasesPeriod}</td>
                  <td className="px-4 py-2">{item.goodsIssued}</td>
                  <td className="px-4 py-2">{item.endingInventory}</td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={7} className="text-center py-4 text-gray-500 bg-blue-50">
                  Không có dữ liệu.
                </td>
              </tr>
            )}
          </tbody>
        </table>

        <div className="mt-4">
          <TablePagination
            rowsPerPageOptions={[5, 10, 25]}
            component="div"
            count={inventoryData.length}
            rowsPerPage={rowsPerPage}
            page={page}
            onPageChange={handleChangePage}
            onRowsPerPageChange={handleChangeRowsPerPage}
            labelRowsPerPage="Số dòng mỗi trang:"
          />
        </div>
      </div>
    </div>
  );
};

export default InventoryStatistic;
