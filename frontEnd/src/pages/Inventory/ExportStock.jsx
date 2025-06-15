import React, { useEffect, useState } from "react";
import ExportForm from "./components/ExportForm";
import { fetchFullExportReceipts } from "../../services/exportService";
import useSmartFilter from "../../hooks/useSmartFilter";

export default function ExportStock() {
  const [tableData, setTableData] = useState([]);

  useEffect(() => {
    fetchFullExportReceipts()
      .then((data) => {
        const sortData = [...data].sort(
          (a, b) => new Date(b.time) - new Date(a.time)
        );
        setTableData(sortData);
      })
      .catch((error) => console.log("Lỗi", error));
  }, []);

  const {
    filter,
    setFilter,
    currentPage,
    setCurrentPage,
    paginatedData,
    totalPages,
  } = useSmartFilter(tableData, {
    itemsPerPage: 10,
    initialFilter: {
      searchQuery: "",
      searchField: "all", // default là tìm toàn bộ
    },
  });

  const handleReload = () => {
    const mock = [
      {
        idExportReciept: 1,
        customer: { nameCustomer: "Trần Đức Minh" },
        idStaff: "Thanh Li",
        totalCost: 500000,
        time: "2025-05-29T10:00:00",
      },
      {
        idExportReciept: 2,
        customer: { nameCustomer: "Lê Văn Thành" },
        idStaff: "Thanh Li",
        totalCost: 700000,
        time: "2025-05-29T11:30:00",
      },
    ];
    setFilter({ searchQuery: "", searchField: "all" });
    setCurrentPage(1);
    setTableData(mock);
  };

  return (
    <>
      <ExportForm
        tableData={paginatedData}
        filter={filter}
        onFilterChange={setFilter}
        onReload={handleReload}
        currentPage={currentPage}
        totalPages={totalPages}
        onPageChange={setCurrentPage}
      />
      
    </>
  );
}
