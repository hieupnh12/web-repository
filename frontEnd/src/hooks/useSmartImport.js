import { useState, useMemo } from "react";

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

export default function useSmartImport(data = [], options = {}) {
  const {
    initialFilter = { searchQuery: "", searchField: "all" },
  } = options;

  const [filter, setFilter] = useState(initialFilter);

  // Tính toán filteredData và sắp xếp theo time
  const filteredData = useMemo(() => {
    if (!data || !Array.isArray(data)) return [];

    // Lọc dữ liệu dựa trên filter
    const result = data.filter((item) => {
      const { searchQuery, searchField, ...rest } = filter;

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

    // Sắp xếp theo time giảm dần (mới nhất trước)
    return result.sort((a, b) => new Date(b.time) - new Date(a.time));
  }, [data, filter]);

  return {
    filter,
    setFilter,
    paginatedData: filteredData, // Không phân trang lại
    fullData: filteredData,
  };
}

