import React, { useState, useEffect, useMemo } from "react";
import { Combobox, Transition } from "@headlessui/react";
import { Search, ChevronDown, X, Loader2 } from "lucide-react";
import { getAllBrands, getAllOrigins, getAllOperatingSystems, getAllWarehouseAreas } from "../../../services/productService";
import Button from "../../../components/ui/Button";
import debounce from "lodash/debounce";

const SearchFilter = ({ onFilterChange }) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [brands, setBrands] = useState([]);
  const [origins, setOrigins] = useState([]);
  const [operatingSystems, setOperatingSystems] = useState([]);
  const [warehouseAreas, setWarehouseAreas] = useState([]);
  const [selectedBrand, setSelectedBrand] = useState(null);
  const [selectedOrigin, setSelectedOrigin] = useState(null);
  const [selectedOs, setSelectedOs] = useState(null);
  const [selectedArea, setSelectedArea] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchFilterOptions = async () => {
      try {
        setIsLoading(true);
        const [brandRes, originRes, osRes, areaRes] = await Promise.all([
          getAllBrands(),
          getAllOrigins(),
          getAllOperatingSystems(),
          getAllWarehouseAreas(),
        ]);

        const getData = (res) => Array.isArray(res.data) ? res.data : res.data?.content || res.data?.data || [];

        setBrands(getData(brandRes));
        setOrigins(getData(originRes));
        setOperatingSystems(getData(osRes));
        setWarehouseAreas(getData(areaRes));
      } catch (error) {
        console.error("Lỗi khi tải dữ liệu bộ lọc:", error);
        alert("Không thể tải dữ liệu bộ lọc.");
      } finally {
        setIsLoading(false);
      }
    };

    fetchFilterOptions();
  }, []);

  const debouncedSearch = debounce((value) => {
    const newFilters = {
      search: value,
      brandId: selectedBrand?.idBrand || null,
      originId: selectedOrigin?.id || null,
      operatingSystemId: selectedOs?.id || null,
      warehouseAreaId: selectedArea?.id || null,
    };
    if (process.env.NODE_ENV === "development") {
      console.log("debouncedSearch called with:", newFilters);
    }
    onFilterChange(newFilters);
  }, 300);

  useEffect(() => {
    debouncedSearch(searchTerm);
    return () => debouncedSearch.cancel();
  }, [searchTerm, selectedBrand, selectedOrigin, selectedOs, selectedArea]);

  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
  };

  const clearFilters = () => {
    setSearchTerm("");
    setSelectedBrand(null);
    setSelectedOrigin(null);
    setSelectedOs(null);
    setSelectedArea(null);
    onFilterChange({ search: "", brandId: null, originId: null, operatingSystemId: null, warehouseAreaId: null });
  };

  const renderCombobox = (label, value, onChange, options, getId, getName) => (
    <div className="relative w-full sm:w-48">
      <Combobox value={value} onChange={onChange}>
        <div className="relative">
          <Combobox.Input
            className="w-full pl-3 pr-10 py-2.5 bg-gray-50 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm text-gray-900 transition-all duration-200 hover:border-blue-400"
            displayValue={(option) => option ? getName(option) : ""}
            placeholder={label}
          />
          <Combobox.Button className="absolute inset-y-0 right-0 flex items-center pr-3">
            <ChevronDown className="h-4 w-4 text-gray-500 transition-transform duration-200 group-hover:rotate-180" aria-hidden="true" />
          </Combobox.Button>
        </div>
        <Transition
          as={React.Fragment}
          leave="transition ease-in duration-100"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          <Combobox.Options className="absolute mt-1 max-h-60 w-full overflow-auto rounded-lg bg-white py-1 text-sm shadow-xl ring-1 ring-gray-200 focus:outline-none z-20">
            {options.length === 0 && (
              <div className="px-4 py-2 text-gray-500 text-sm">Không có dữ liệu</div>
            )}
            {options.map((option) => (
              <Combobox.Option
                key={getId(option)}
                className={({ active }) =>
                  `relative cursor-pointer select-none py-2 px-4 ${
                    active ? "bg-blue-600 text-white" : "text-gray-800"
                  } transition-colors duration-150`
                }
                value={option}
              >
                {getName(option)}
              </Combobox.Option>
            ))}
          </Combobox.Options>
        </Transition>
      </Combobox>
    </div>
  );

  return (
    <div className="bg-white rounded-lg shadow-md p-4 flex flex-col gap-4">
      <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3 w-full">
        <div className="relative w-full sm:w-64">
          <Search className="absolute top-3 left-3 w-5 h-5 text-gray-500" />
          <input
            type="text"
            placeholder="Tìm kiếm sản phẩm..."
            className="w-full pl-10 pr-4 py-2.5 bg-gray-50 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm text-gray-900 transition-all duration-200 hover:border-blue-400"
            value={searchTerm}
            onChange={handleSearchChange}
          />
        </div>
        <div className="flex flex-wrap gap-3 w-full sm:w-auto">
          {renderCombobox(
            "Thương hiệu",
            selectedBrand,
            setSelectedBrand,
            brands,
            (b) => b.idBrand,
            (b) => b.brandName
          )}
          {renderCombobox(
            "Xuất xứ",
            selectedOrigin,
            setSelectedOrigin,
            origins,
            (o) => o.id,
            (o) => o.name
          )}
          {renderCombobox(
            "Hệ điều hành",
            selectedOs,
            setSelectedOs,
            operatingSystems,
            (os) => os.id,
            (os) => os.name
          )}
          {renderCombobox(
            "Khu vực kho",
            selectedArea,
            setSelectedArea,
            warehouseAreas,
            (a) => a.id,
            (a) => a.name
          )}
        </div>
        {(searchTerm || selectedBrand || selectedOrigin || selectedOs || selectedArea) && (
          <Button
            onClick={clearFilters}
            className="flex items-center gap-2 bg-red-500 text-white hover:bg-red-600 px-4 py-2 text-sm rounded-lg shadow hover:shadow-md transition-all duration-200"
          >
            <X className="w-4 h-4" />
            Xóa bộ lọc
          </Button>
        )}
      </div>
      {isLoading && (
        <div className="flex items-center gap-2 text-gray-500 text-sm">
          <Loader2 className="w-4 h-4 animate-spin" />
          Đang tải bộ lọc...
        </div>
      )}
    </div>
  );
};

export default SearchFilter;