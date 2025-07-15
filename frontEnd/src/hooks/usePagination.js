import { useMemo } from "react";

const usePagination = ({ currentPage, totalPages, maxVisible = 3 }) => {
  return useMemo(() => {
    const half = Math.floor(maxVisible / 2);
    let start = Math.max(0, currentPage - half);
    let end = Math.min(totalPages - 1, start + maxVisible - 1);

    // Điều chỉnh lại start nếu không đủ maxVisible trang
    if (end - start + 1 < maxVisible) {
      start = Math.max(0, end - maxVisible + 1);
    }

    const pageNumbers = Array.from(
      { length: end - start + 1 },
      (_, i) => start + i
    );

    return {
      pageNumbers, // ví dụ: [0,1,2]
      hasPrevious: currentPage > 0,
      hasNext: currentPage < totalPages - 1,
    };
  }, [currentPage, totalPages, maxVisible]);
};

export default usePagination;
