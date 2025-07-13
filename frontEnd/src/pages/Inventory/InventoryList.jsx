import React, { useEffect, useState, useCallback } from "react";
import { getFullStocks } from "../../services/inventoryService";
import StockTableView from "./InventoryTableView";
import SearchFilter from "../Products/components/SearchFilter";

const StockList = () => {
  const [stocks, setStocks] = useState([]);
  const [pagination, setPagination] = useState({ page: 1, limit: 10, total: 0 });
  const [filters, setFilters] = useState({ search: "", areaId: null, status: null });
  const [isLoading, setIsLoading] = useState(false);

  const loadData = useCallback(async () => {
    try {
      setIsLoading(true);
      const { data, pagination: pageInfo } = await getFullStocks({
        page: pagination.page,
        limit: pagination.limit,
        ...filters,
      });
      setStocks(data);
      setPagination((prev) => ({ ...prev, total: pageInfo.total }));
    } catch (error) {
      console.error("Error loading stocks:", error);
      alert("Không thể tải dữ liệu kiểm kê.");
    } finally {
      setIsLoading(false);
    }
  }, [pagination.page, pagination.limit, filters]);

  useEffect(() => {
    loadData();
  }, [loadData]);

  const handleFilterChange = useCallback((newFilters) => {
    setFilters(newFilters);
    setPagination((prev) => ({ ...prev, page: 1 }));
  }, []);

  return (
    <div className="bg-white rounded-2xl shadow-lg p-6">
      <SearchFilter onFilterChange={handleFilterChange} />
      <StockTableView
        stocks={stocks}
        currentPage={pagination.page}
        itemsPerPage={pagination.limit}
        totalItems={pagination.total}
        onPageChange={(p) => setPagination((prev) => ({ ...prev, page: p }))}
        isLoading={isLoading}
      />
    </div>
  );
};

export default StockList;
