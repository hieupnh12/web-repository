import React from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";

const Pagination = ({ currentPage, totalPages, onPageChange }) => {
  const visiblePages = [];

  for (let i = 1; i <= totalPages; i++) {
    // Chỉ hiển thị tối đa 5 trang gần current
    if (
      i === 1 ||
      i === totalPages ||
      (i >= currentPage - 1 && i <= currentPage + 1)
    ) {
      visiblePages.push(i);
    } else if (
      i === currentPage - 2 ||
      i === currentPage + 2
    ) {
      visiblePages.push("...");
    }
  }

  const handlePageClick = (page) => {
    if (page !== "..." && page !== currentPage) {
      onPageChange(page);
    }
  };

  return (
    <div className="flex items-center justify-center space-x-2 mt-4">
      <button
        onClick={() => onPageChange(currentPage - 1)}
        disabled={currentPage === 1}
        className="px-3 py-1 rounded border border-gray-300 bg-white hover:bg-gray-100 disabled:opacity-50"
      >
        <ChevronLeft size={16} />
      </button>

      {visiblePages.map((page, index) => (
        <button
          key={index}
          onClick={() => handlePageClick(page)}
          className={`px-3 py-1 rounded border ${
            page === currentPage
              ? "bg-blue-500 text-white"
              : "bg-white hover:bg-gray-100"
          } ${page === "..." ? "cursor-default text-gray-400" : "border-gray-300"}`}
          disabled={page === "..."}
        >
          {page}
        </button>
      ))}

      <button
        onClick={() => onPageChange(currentPage + 1)}
        disabled={currentPage === totalPages}
        className="px-3 py-1 rounded border border-gray-300 bg-white hover:bg-gray-100 disabled:opacity-50"
      >
        <ChevronRight size={16} />
      </button>
    </div>
  );
};

export default Pagination;
