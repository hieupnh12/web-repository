import React, { useState, useMemo } from "react";
import { Grid, List } from "lucide-react";
import TableView from "./TableView";
import StatsSection from "./StatsSection";
import CardView from "./CardView";

const ProductList = ({
  products,
  currentPage,
  itemsPerPage,
  totalItems,
  onPageChange,
  onEdit,    
  onDetail, 
  onDelete,
}) => {
  const [sortBy, setSortBy] = useState("productName");
  const [sortOrder, setSortOrder] = useState("asc");
  const [viewMode, setViewMode] = useState("table");

  const filteredAndSortedProducts = useMemo(() => {
    let filtered = [...products];

    filtered.sort((a, b) => {
      let aValue = a[sortBy] || "";
      let bValue = b[sortBy] || "";
      if (typeof aValue === "string" && typeof bValue === "string") {
        aValue = aValue.toLowerCase();
        bValue = bValue.toLowerCase();
      }
      return sortOrder === "asc"
        ? aValue > bValue
          ? 1
          : -1
        : aValue < bValue
        ? 1
        : -1;
    });

    return filtered;
  }, [products, sortBy, sortOrder]);

  const paginatedProducts = useMemo(() => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    return filteredAndSortedProducts.slice(
      startIndex,
      startIndex + itemsPerPage
    );
  }, [filteredAndSortedProducts, currentPage, itemsPerPage]);

  const totalPages = Math.ceil(totalItems / itemsPerPage);

  const handleSort = (field) => {
    if (sortBy === field) {
      setSortOrder(sortOrder === "asc" ? "desc" : "asc");
    } else {
      setSortBy(field);
      setSortOrder("asc");
    }
  };

  return (
    <div>
      <StatsSection products={filteredAndSortedProducts} />

      <div className="flex items-center gap-3 mb-4">
        <button
          onClick={() => setViewMode(viewMode === "table" ? "card" : "table")}
          className="inline-flex items-center px-3 py-2 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition-colors duration-200 shadow-lg hover:shadow-xl"
        >
          {viewMode === "table" ? (
            <Grid className="w-5 h-5 mr-2" />
          ) : (
            <List className="w-5 h-5 mr-2" />
          )}
          {viewMode === "table" ? "Dạng lưới" : "Dạng bảng"}
        </button>
      </div>

      {viewMode === "table" ? (
        <TableView
          products={paginatedProducts}
          currentPage={currentPage}
          itemsPerPage={itemsPerPage}
          onSort={handleSort}
          sortBy={sortBy}
          sortOrder={sortOrder}

          onEdit={onEdit}       
          onDetail={onDetail}  
          onDelete={onDelete}
        />
      ) : (
        <CardView
          products={paginatedProducts}

          onEdit={onEdit}       
          onDetail={onDetail}
          onDelete={onDelete}
        />
      )}

      {totalPages > 1 && (
        <div className="flex items-center justify-center mt-8 space-x-2">
          <button
            onClick={() => onPageChange(Math.max(currentPage - 1, 1))}
            disabled={currentPage === 1}
            className="px-4 py-2 text-sm font-medium text-gray-500 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-200"
          >
            Trước
          </button>
          {[...Array(totalPages)].map((_, index) => (
            <button
              key={index + 1}
              onClick={() => onPageChange(index + 1)}
              className={`px-4 py-2 text-sm font-medium rounded-lg transition-colors duration-200 ${
                currentPage === index + 1
                  ? "bg-blue-600 text-white shadow-lg"
                  : "text-gray-700 bg-white border border-gray-300 hover:bg-gray-50"
              }`}
            >
              {index + 1}
            </button>
          ))}
          <button
            onClick={() => onPageChange(Math.min(currentPage + 1, totalPages))}
            disabled={currentPage === totalPages}
            className="px-4 py-2 text-sm font-medium text-gray-500 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-200"
          >
            Sau
          </button>
        </div>
      )}
    </div>
  );
};

export default ProductList;
