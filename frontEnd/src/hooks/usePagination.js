// hooks/usePagination.js
import { useMemo } from "react";

const usePagination = ({ currentPage, totalPages, maxVisible = 5 }) => {
  return useMemo(() => {
    const half = Math.floor(maxVisible / 2);
    let start = Math.max(1, currentPage - half);
    let end = Math.min(totalPages, start + maxVisible - 1);

    if (end - start + 1 < maxVisible) {
      start = Math.max(1, end - maxVisible + 1);
    }

    const pageNumbers = Array.from(
      { length: end - start + 1 },
      (_, i) => start + i
    );

    return {
      pageNumbers,
      hasPrevious: currentPage > 1,
      hasNext: currentPage < totalPages,
    };
  }, [currentPage, totalPages, maxVisible]);
};

export default usePagination;
