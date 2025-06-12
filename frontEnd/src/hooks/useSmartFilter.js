import { useEffect, useState } from "react";

// Truy cập giá trị sâu trong object: "customer.nameCustomer"
function getNestedValue(obj, path) {
  return path.split(".").reduce((acc, key) => acc?.[key], obj);
}

// Tìm kiếm toàn cục trong object
function deepSearch(obj, keyword) {
  const lowerKeyword = keyword.toLowerCase();
  return Object.values(obj).some((value) => {
    if (!value) return false;
    if (typeof value === "object") return deepSearch(value, keyword);
    return String(value).toLowerCase().includes(lowerKeyword);
  });
}

export default function useSmartFilter(data = [], options = {}) {
  const {
    initialFilter = { searchQuery: "", searchField: "all" },
    itemsPerPage = 5,
  } = options;

  const [filter, setFilter] = useState(initialFilter);
  const [filteredData, setFilteredData] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);

  useEffect(() => {
    const { searchQuery, searchField, ...rest } = filter;

    const result = data.filter((item) => {
      const matchSearch = searchQuery
        ? searchField === "all"
          ? deepSearch(item, searchQuery)
          : getNestedValue(item, searchField)
              ?.toString()
              .toLowerCase()
              .includes(searchQuery.toLowerCase())
        : true;

      const matchRest = Object.entries(rest).every(([key, val]) => {
        if (!val) return true;
        const field = getNestedValue(item, key);
        return field?.toString().toLowerCase().includes(val.toLowerCase());
      });

      return matchSearch && matchRest;
    });

    setFilteredData(result);
    setCurrentPage(1);
  }, [data, filter]);

  const paginatedData = filteredData.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  return {
    filter,
    setFilter,
    currentPage,
    setCurrentPage,
    paginatedData,
    totalPages: Math.ceil(filteredData.length / itemsPerPage),
    fullData: filteredData,
  };
}
