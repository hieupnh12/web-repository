import React, { useEffect, useState } from "react";
import ExportForm from "./components/ExportForm";
import { fetchFullExportReceipts } from "../../services/exportService";
import useSmartFilter from "../../hooks/useSmartFilter";

export default function ExportStock() {
  const [tableData, setTableData] = useState([]);
console.log(tableData);

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


  return (
    <>
      <ExportForm
        tableData={paginatedData}
        filter={filter}
        onFilterChange={setFilter}
        // onReload={handleReload}
        currentPage={currentPage}
        totalPages={totalPages}
        onPageChange={setCurrentPage}
      />
      
    </>
  );
}
