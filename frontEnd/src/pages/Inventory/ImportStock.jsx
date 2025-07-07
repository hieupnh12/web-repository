import React, { useEffect, useState } from 'react'
import { fetchFullImportReceipts, takeImport } from '../../services/importService';
import ImportForm from './components/ImportForm';
import useSmartFilter from '../../hooks/useSmartFilter';

export default function ImportStock() {

    const [tableData, setTableData] = useState([]);
    const importReceipt = async () => {
        try {
            const resp = await fetchFullImportReceipts();
            setTableData(resp)
            console.log(resp);
            
        } catch (error) {
            console.log("lỗi import", error);
        }
    }

    useEffect(() => {
        importReceipt();
    }, []);

const {
    filter,
    setFilter,
    currentPage,
    setCurrentPage,
    paginatedData,
    totalPages,
  } = useSmartFilter(tableData, {
    itemsPerPage: 7,
    initialFilter: {
      searchQuery: "",
      searchField: "all", // default là tìm toàn bộ
    },
  });

  return (
    <>
      <ImportForm
        tableData={paginatedData}
        filter={filter}
        onFilterChange={setFilter}
        onReload={importReceipt}
        currentPage={currentPage}
        totalPages={totalPages}
        onPageChange={setCurrentPage}
      />
      
    </>
  )
}
