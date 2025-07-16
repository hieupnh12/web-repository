import React, { useCallback, useEffect, useState } from "react";
import { Link } from "react-router-dom";
import debounce from "lodash.debounce";
import ConfirmDialog from "../../../components/ui/ConfirmDialog";
import usePagination from "../../../hooks/usePagination";
import { Download, Plus, Trash } from "lucide-react";
import ContractPreviewModal from "../../../utils/exportTopdf";
import Button from "../../../components/ui/Button";
import { toast } from "react-toastify";
import { takeDeleteImportReceipt } from "../../../services/importService";
import DateRangeButton from "./DateRangeButton";
import ImportDetailView from "./ImportDetailView";

export default function ImportForm({
  tableData,
  filter,
  onFilterChange,
  onReload,
  currentPage,
  totalPages,
  onPageChange,
  isLoading,
  isError,
  isPermission,
}) {
  const [searchInput, setSearchInput] = useState("");
  const [selectField, setSelectField] = useState("all");
  const [startDate, setStartDate] = useState(filter.startDate || null);
  const [endDate, setEndDate] = useState(filter.endDate || null);
  const [selectProduct, setSelectProduct] = useState(null);
  const [showConfirm, setShowConfirm] = useState(false);
  const [showPreview, setShowPreview] = useState(false);
  const [showDetail, setShowDetail] = useState(false);
  const handleDeleteImport = async () => {
    setShowConfirm(false);
    try {
      if (!selectProduct?.import_id) {
        toast.warning("Vui lòng chọn một phiếu nhập để xóa.");
        return;
      }

      const resp = await takeDeleteImportReceipt(selectProduct.import_id);
      if (resp.status === 200) {
        toast.success(resp.data.message || "Xóa phiếu nhập thành công!");
        setSelectProduct(null);
        onReload();
      } else {
        throw new Error("Xóa thất bại");
      }
    } catch (error) {
      console.error("Lỗi khi xóa phiếu nhập:", error);
      toast.error("Xóa phiếu nhập thất bại!");
    }
  };
  console.log("select", selectProduct);

  const mapFilterToApi = useCallback(
    (searchQuery, searchField, startDate, endDate) => {
      const newFilter = { startDate, endDate };
      if (searchField === "import_id") {
        newFilter.importId = searchQuery;
      } else if (searchField === "supplierName") {
        newFilter.supplierName = searchQuery;
      } else if (searchField === "staffName") {
        newFilter.staffName = searchQuery;
      } else {
        newFilter.supplierName = searchQuery;
        newFilter.staffName = searchQuery;
        newFilter.importId = searchQuery;
      }
      return newFilter;
    },
    []
  );

  const handleSearch = () => {
    const newFilter = mapFilterToApi(
      searchInput,
      selectField,
      startDate,
      endDate
    );
    console.log("Search filter:", newFilter); // Debug
    onFilterChange(newFilter);
  };

  const handleReset = () => {
    setSearchInput("");
    setSelectField("all");
    setStartDate(null);
    setEndDate(null);
    onFilterChange({
      supplierName: "",
      staffName: "",
      importId: "",
      startDate: null,
      endDate: null,
    });
  };

  const debouncedFilterChange = useCallback(
    debounce((newFilter) => {
      onFilterChange(newFilter);
      onPageChange(0);
    }, 400),
    [onFilterChange]
  );

  useEffect(() => {
    const newFilter = mapFilterToApi(
      searchInput,
      selectField,
      startDate,
      endDate
    );
    debouncedFilterChange(newFilter);
    return () => debouncedFilterChange.cancel();
  }, [searchInput, startDate, endDate, debouncedFilterChange, mapFilterToApi]);

  const handleSearchChange = (e) => setSearchInput(e.target.value);
  const handleFieldChange = (e) => setSelectField(e.target.value);

  useEffect(() => {
    const handleClickOutside = (event) => {
      const search = document.getElementById("search-value");
      const searchSelect = document.getElementById("search-select");
      const searchPag = document.getElementById("search-pagination");
      const searchDate = document.getElementById("search-date");
      if (
        (search && search.contains(event.target)) ||
        (searchSelect && searchSelect.contains(event.target)) ||
        (searchPag && searchPag.contains(event.target)) ||
        (searchDate && searchDate.contains(event.target))
      ) {
        setSelectProduct(null);
      }
    };

    document.addEventListener("click", handleClickOutside);
    return () => {
      document.removeEventListener("click", handleClickOutside);
    };
  }, []);

  const { pageNumbers, hasPrevious, hasNext } = usePagination({
    currentPage,
    totalPages,
    maxVisible: 3,
  });

  // if (isLoading) {
  //   return (
  //     <div className="flex justify-center items-center h-[570px] bg-white rounded-2xl">
  //       <div className="text-gray-600 text-lg">Đang tải dữ liệu...</div>
  //     </div>
  //   );
  // }
  console.log("permmiss", isPermission);

  if (isError) {
    return (
      <div className="flex justify-center items-center h-[570px] bg-white rounded-2xl">
        <div className="text-red-600 text-lg">
          Có lỗi xảy ra khi tải dữ liệu. Vui lòng thử lại!
          <button
            onClick={onReload}
            className="ml-2 bg-teal-500 hover:bg-teal-600 text-white px-4 py-1 rounded-lg"
          >
            Thử lại
          </button>
        </div>
      </div>
    );
  }

  return (
    <main className="flex-1 bg-white rounded-2xl pb-1">
      {showPreview && selectProduct && (
        <ContractPreviewModal
          data={selectProduct.details}
          onClose={() => setShowPreview(false)}
        />
      )}

      <div className="flex items-center justify-between bg-white/60 p-3 rounded-2xl shadow-sm flex-wrap gap-4">
        <div className="flex items-center space-x-4">
          {isPermission?.canCreate && (
            <Link
              to="addimport"
              className="bg-teal-600 hover:bg-teal-700 text-white px-4 py-2 rounded-lg text-sm font-medium flex gap-1"
            >
              <Plus className="h-5 w-5" />
              <span>Tạo Phiếu</span>
            </Link>
          )}

          <button
            className="bg-green-700 hover:bg-green-800 text-white px-4 py-2 rounded-lg text-sm font-medium flex items-center space-x-2"
            onClick={() => setShowPreview(true)}
            disabled={!selectProduct?.import_id}
          >
            <Download className="w-5 h-5" />
            <span>In Phiếu</span>
          </button>

          {isPermission?.canDelete && (
            <Button
              onClick={() => setShowConfirm(true)}
              className="group flex items-center gap-2 bg-red-600 text-white hover:bg-red-700 hover:scale-105 transform transition-all duration-300 shadow-lg hover:shadow-xl px-3 py-2 text-sm"
              disabled={!selectProduct?.import_id}
            >
              <Trash className="w-4 h-4 group-hover:scale-110 transition-transform duration-300" />
              <span className="hidden sm:inline">Xóa Phiếu</span>
            </Button>
          )}
          <ConfirmDialog
            isOpen={showConfirm}
            title="Xóa phiếu nhập"
            message="Bạn có chắc muốn xóa phiếu nhập này?"
            onConfirm={handleDeleteImport}
            onCancel={() => setShowConfirm(false)}
          />
        </div>

        <div className="flex items-center space-x-2">
          <div id="search-date">
            <DateRangeButton
              startDate={startDate}
              endDate={endDate}
              onStartDateChange={(date) => setStartDate(date)}
              onEndDateChange={(date) => setEndDate(date)}
              onApply={handleSearch}
              onClear={handleReset}
            />
          </div>

          <select
            id="search-select"
            value={selectField}
            onChange={handleFieldChange}
            className="border border-gray-300 rounded-lg px-3 py-2 text-sm text-gray-700 focus:ring-teal-500 focus:border-teal-500"
          >
            <option value="all">Tất cả</option>
            <option value="import_id">Mã phiếu nhập</option>
            <option value="supplierName">Nhà cung cấp</option>
            <option value="staffName">Nhân viên</option>
          </select>

          <input
            type="text"
            placeholder="Tìm kiếm..."
            value={searchInput}
            onChange={handleSearchChange}
            className="border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-teal-500 focus:border-teal-500"
            id="search-value"
          />

          <button
            onClick={onReload}
            className="bg-teal-500 hover:bg-teal-600 text-white px-4 py-2 rounded-lg text-sm font-medium"
          >
            Reload
          </button>
        </div>
      </div>

      <div className="container mx-auto">
        <div className="flex flex-col md:flex-row gap-4 p-2">
          <div className="bg-gray-100 rounded-2xl border border-gray-200 shadow-lg flex flex-col md:w-1/4 w-full min-h-[570px]">
            <div className="text-xs font-medium uppercase text-gray-700 bg-gray-50 rounded-t-2xl p-2 text-center shadow">
              Chi tiết sản phẩm
            </div>

            <div className="overflow-y-scroll custom-scroll flex-1 max-h-[475px] text-sm p-2 space-y-2">
              {selectProduct?.details?.length > 0 ? (
                selectProduct.details.map((value, index) => (
                  <div
                    key={`${value.import_id}-${index}`}
                    className="border border-gray-300 rounded-2xl p-2 flex gap-2 bg-white"
                  >
                    <div className="w-[100px] h-[100px] rounded-2xl overflow-hidden flex items-center justify-center border border-gray-200">
                      <img
                        src={
                          value?.productVersion.product?.image ||
                          "/placeholder-image.jpg"
                        }
                        alt={
                          value?.productVersion.product?.productName ||
                          "Sản phẩm"
                        }
                        className="object-cover w-full h-full"
                      />
                    </div>

                    <div className="flex flex-col justify-around items-start text-left">
                      <div className="w-full text-sm font-medium">
                        {value?.productVersion.product?.productName || "N/A"}
                      </div>
                      <div className="w-full">
                        Tổng:{" "}
                        {(value.unitPrice * value.quantity).toLocaleString()}{" "}
                        VND
                      </div>
                      <div className="w-full">Quantity: {value.quantity}</div>
                    </div>
                  </div>
                ))
              ) : (
                <div className="text-center text-gray-500">
                  Vui lòng chọn một phiếu nhập để xem chi tiết
                </div>
              )}
            </div>

            <div className="p-1 mt-2">
              <button
                onClick={() => setShowDetail(true)} // Sửa để mở PDF thay vì ConfirmDialog
                className="w-full bg-white border border-gray-400 py-2 rounded-lg hover:bg-blue-300 transition duration-200 text-sm font-medium text-gray-600"
                disabled={!selectProduct?.import_id}
              >
                Xem chi tiết
              </button>
            </div>
          </div>

          <div className="flex-1 bg-white rounded-2xl shadow-lg overflow-hidden flex flex-col">
            <div className="overflow-x-auto flex-1">
              <table className="w-full text-gray-700 border border-gray-200">
                <thead className="bg-gray-50 text-xs font-medium uppercase text-center">
                  <tr>
                    <th className="px-4 py-2">STT</th>
                    <th className="px-4 py-2">Mã phiếu</th>
                    <th className="px-4 py-2">Nhà cung cấp</th>
                    <th className="px-4 py-2">Nhân viên nhập</th>
                    <th className="px-4 py-2">Tổng tiền</th>
                    <th className="px-4 py-2">Thời gian</th>
                  </tr>
                </thead>
                <tbody className="divide-y text-center divide-gray-300 text-sm cursor-pointer">
                  {tableData.map((item, index) => (
                    <tr
                      key={item.import_id}
                      className={`hover:bg-blue-50 transition ${
                        selectProduct?.import_id === item.import_id
                          ? "bg-blue-100"
                          : ""
                      }`}
                      onClick={() =>
                        setSelectProduct(
                          selectProduct?.import_id === item.import_id
                            ? null
                            : item
                        )
                      }
                    >
                      <td className="px-4 py-3">
                        {currentPage * 7 + index + 1}
                      </td>
                      <td className="px-4 py-3">{item.import_id}</td>
                      <td className="px-4 py-3">
                        {item.supplierName || "N/A"}
                      </td>
                      <td className="px-4 py-3">{item.staffName || "N/A"}</td>
                      <td className="px-4 py-3">
                        {item.totalAmount?.toLocaleString() || "0"} VND
                      </td>
                      <td className="px-4 py-3">
                        {item.time
                          ? new Intl.DateTimeFormat("vi-VN", {
                              day: "2-digit",
                              month: "2-digit",
                              year: "numeric",
                              hour: "2-digit",
                              minute: "2-digit",
                              hour12: false,
                            }).format(new Date(item.time))
                          : "N/A"}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <div
              id="search-pagination"
              className="py-3 border-t bg-gray-50 text-sm text-gray-600 flex justify-center space-x-2"
            >
              <button
                onClick={() => onPageChange(currentPage - 1)}
                disabled={!hasPrevious}
                className="px-3 py-1 rounded-lg hover:bg-gray-200 disabled:opacity-50"
              >
                « Trước
              </button>

              {pageNumbers.map((page) => (
                <button
                  key={page}
                  onClick={() => onPageChange(page)}
                  className={`px-3 py-1 rounded-lg ${
                    page === currentPage
                      ? "bg-teal-500 text-white"
                      : "hover:bg-gray-200"
                  }`}
                >
                  {page}
                </button>
              ))}

              <button
                onClick={() => onPageChange(currentPage + 1)}
                disabled={!hasNext || isLoading}
                className="px-3 py-1 rounded-lg hover:bg-gray-200 disabled:opacity-50"
              >
                Sau »
              </button>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
