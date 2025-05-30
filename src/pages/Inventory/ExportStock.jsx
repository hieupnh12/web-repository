import React, { useState } from 'react';
import ExportForm from './components/ExportForm'

export default function ExportStock() {
  // State cho dữ liệu bảng
  const [tableData, setTableData] = useState([
    { id: 1, code: 'Juventus', supplier: 'Juventus', inputBy: 'Thanh Li', time: '2025-05-29' },
    { id: 2, code: 'Juventus', supplier: 'Juventus', inputBy: 'Thanh Li', time: '2025-05-29' },
    { id: 3, code: 'Juventus', supplier: 'Juventus', inputBy: 'Thanh Li', time: '2025-05-29' },
    { id: 4, code: 'Juventus', supplier: 'Juventus', inputBy: 'Thanh Li', time: '2025-05-29' },
    { id: 5, code: 'Juventus', supplier: 'Juventus', inputBy: 'Thanh Li', time: '2025-05-29' },
  ]);

  // State cho chi tiết nhà cung cấp
  const [selectedSupplier, setSelectedSupplier] = useState({
    supplier: 'Juventus',
    inputBy: 'Thanh Li',
    time: '--',
    quantity: 34,
    priceTotal: '13000 VND',
    description: 'Note',
  });

  // State cho bộ lọc
  const [filter, setFilter] = useState({
    supplier: '',
    searchQuery: '',
  });

  // State cho phân trang
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;

  // Hàm xử lý bộ lọc
  const handleFilterChange = (newFilter) => {
    setFilter(newFilter);
    // Logic lọc dữ liệu (giả lập)
    const filteredData = tableData.filter((item) => {
      const matchesSupplier = newFilter.supplier ? item.supplier === newFilter.supplier : true;
      const matchesSearch = newFilter.searchQuery
        ? item.code.toLowerCase().includes(newFilter.searchQuery.toLowerCase())
        : true;
      return matchesSupplier && matchesSearch;
    });
    setTableData(filteredData);
    setCurrentPage(1); // Reset về trang 1 khi lọc
  };

  // Hàm reload dữ liệu
  const handleReload = () => {
    setTableData([
      { id: 1, code: 'Juventus', supplier: 'Juventus', inputBy: 'Thanh Li', time: '2025-05-29' },
      { id: 2, code: 'Juventus', supplier: 'Juventus', inputBy: 'Thanh Li', time: '2025-05-29' },
      { id: 3, code: 'Juventus', supplier: 'Juventus', inputBy: 'Thanh Li', time: '2025-05-29' },
      { id: 4, code: 'Juventus', supplier: 'Juventus', inputBy: 'Thanh Li', time: '2025-05-29' },
      { id: 5, code: 'Juventus', supplier: 'Juventus', inputBy: 'Thanh Li', time: '2025-05-29' },
    ]);
    setFilter({ supplier: '', searchQuery: '' });
    setCurrentPage(1);
  };

  // Hàm xử lý phân trang
  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  // Tính dữ liệu hiển thị cho trang hiện tại
  const paginatedData = tableData.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  return (<>
    <ExportForm
      tableData={paginatedData}
      supplierDetails={selectedSupplier}
      filter={filter}
      onFilterChange={handleFilterChange}
      onReload={handleReload}
      currentPage={currentPage}
      totalPages={Math.ceil(tableData.length / itemsPerPage)}
      onPageChange={handlePageChange}
    />
  </>);
}