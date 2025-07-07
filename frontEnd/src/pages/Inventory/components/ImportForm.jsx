import React, { useCallback, useEffect, useState } from "react";
import { Link } from "react-router-dom";
import debounce from "lodash.debounce";
import ConfirmDialog from "../../../components/ui/ConfirmDialog";
import usePagination from "../../../hooks/usePagination";
import { Download, Plus } from "lucide-react";
import ContractPreviewModal from "../../../utils/exportTopdf";
import { X, Trash } from "lucide-react";
import Button from "../../../components/ui/Button";


export default function ImportForm({
  tableData,
  filter,
  onFilterChange,
  onReload,
  currentPage,
  totalPages,
  onPageChange,
}) {
  // Search của thanh input
  const [searchInput, setSearchInput] = useState(filter.searchQuery);

  // Search của select
  const [selectField, setSelectField] = useState(filter.searchField || "all");

  // Hiển thị thông tin chi tiết của từng phiếu (thông tin từng version)
  const [selectProduct, setSelectProduct] = useState(null);

  // Show confirm when click delete receipt
  const [showConfirm, setShowConfirm] = useState(false);

  // Show PDF
  const [showPreview, setShowPreview] = useState(false);



  const handleDeleteRole = async () => {
      setShowConfirm(false);
      // setLoadingV2(true);
      try {
        // const response = await takeDeleteRole(role.roleId);
        // if (response.status === 200) {
        //   setLoadingV2(false);
        //   onClose();
        //   data((prev) => prev.filter((item) => item.roleId !== role.roleId));
        // }
      } catch (error) {
        console.error("Error deleting role:", error);
      }
    };




  // gọi `onFilterChange` sau khi dừng nhập 300ms
  useEffect(() => {
    const timeout = setTimeout(() => {
      onFilterChange({
        ...filter,
        searchQuery: searchInput,
        searchField: selectField,
      });
    }, 300);
    return () => clearTimeout(timeout);
  }, [searchInput, selectField]);

  const handleSearchChange = (e) => setSearchInput(e.target.value);
  const handleFieldChange = (e) => setSelectField(e.target.value);

  // Lắng nghe sự kiện toàn bộ trang nếu chọn ra ngoài thì bỏ đi chi tiết sản phẩm
  useEffect(() => {
    const handleClickOutside = (event) => {
      const search = document.getElementById("search-value");
      const searchSelect = document.getElementById("search-select");
      const searchPag = document.getElementById("search-pagination");

      if (
        (search && search.contains(event.target)) ||
        (searchSelect && searchSelect.contains(event.target)) ||
        (searchPag && searchPag.contains(event.target))
      ) {
        setSelectProduct(null);
      }
    };

    document.addEventListener("click", handleClickOutside);
    return () => {
      document.removeEventListener("click", handleClickOutside);
    };
  }, []);


  // dùng hook cố định số trang phân
  const { pageNumbers, hasPrevious, hasNext } = usePagination({
    currentPage,
    totalPages,
    maxVisible: 3,
  });

  return (
    <main className="flex-1 bg-white rounded-2xl pb-1">
      {/* Show pdf */}
      {showPreview && (
        <ContractPreviewModal
          data={selectProduct.details}
          onClose={() => setShowPreview(false)}
        />
      )}

      {/* Thanh chức năng */}
      <div className="flex items-center justify-between bg-white/60 p-3 rounded-2xl shadow-sm flex-wrap gap-4">
        <div className="flex items-center space-x-4">
          <Link
            to="addimport"
            className="bg-teal-600 hover:bg-teal-700 text-white px-4 py-2 rounded-lg text-sm font-medium flex gap-1"
          >
            <Plus className="h-5 w-5" />
            <span>Create</span>
          </Link>

          {/* Button to download file pdf */}

            <button
              className="bg-green-700 hover:bg-green-800 text-white px-4 py-2 rounded-lg text-sm font-medium flex items-center space-x-2"
              onClick={() => setShowPreview(true)}
              disabled={!selectProduct?.import_id}
            >
              <Download className="w-5 h-5" />
              <span>Print</span>
            </button>
            <div>
            <Button
              onClick={() => setShowConfirm(true)}
              className="group flex items-center gap-2 bg-red-600 text-white hover:bg-red-700 hover:scale-105 transform transition-all duration-300 shadow-lg hover:shadow-xl px-3 py-2 text-sm"
            >
              <Trash className="w-4 h-4 group-hover:scale-110 transition-transform duration-300" />
              <span className="hidden sm:inline">Delete</span>
            </Button>
            <ConfirmDialog
              isOpen={showConfirm}
              title="Delete"
              message="Do you want to delete this Receipt?"
              onConfirm={handleDeleteRole}
              onCancel={() => setShowConfirm(false)}
            />
          </div>
        </div>

        {/* Search by input and select */}
        <div className="flex items-center space-x-2">
          <select
            id="search-select"
            value={selectField}
            onChange={handleFieldChange}
            className="border border-gray-300 rounded-lg px-3 py-2 text-sm text-gray-700 focus:ring-teal-500 focus:border-teal-500"
          >
            <option value="all">All</option>
            <option value="import_id">Code receipt</option>
            <option value="supplierName">Supplier</option>
            <option value="staffName">Staff</option>
          </select>
          <input
            type="text"
            placeholder="Search..."
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

      {/* Standings và thống kê */}
      <div className="container mx-auto">
        <div className="flex flex-col md:flex-row gap-4 p-2">
          {/* Cột trái: Chi tiết sản phẩm */}
          <div className="bg-gray-100 rounded-2xl border border-gray-200 shadow-lg flex flex-col md:w-1/4 w-full min-h-[570px]">
            <div className="text-xs font-medium uppercase text-gray-700 bg-gray-50 rounded-t-2xl p-2 text-center shadow">
              Product details
            </div>

            <div className="overflow-y-scroll custom-scroll flex-1 max-h-[475px] text-sm p-2 space-y-2">
              {selectProduct?.details.map((value, index) => (
                <div
                  key={`${value.import_id}-${index}`}
                  className="border border-gray-300 rounded-2xl p-2 flex gap-2 bg-white"
                >
                  <div className="w-[100px] h-[100px] rounded-2xl overflow-hidden flex items-center justify-center border border-gray-200">
                    <img
                      src={`${value.product.image}`}
                      alt="jj"
                      className="object-cover w-full h-full"
                    />
                  </div>

                  <div className="flex flex-col justify-around items-center text-left">
                    <div className="w-full text-sm font-medium">
                      {value.product.productName}
                    </div>
                    <div className="w-full">
                      Total: {(value.unitPrice * value.quantity).toLocaleString()} VND
                    </div>
                    <div className="w-full">Quantity: {value.quantity}</div>
                  </div>
                </div>
              ))}
            </div>

            <div className="p-1 mt-2">
              <button
                onClick={() => setShowConfirm(true)}
                className="w-full bg-white border border-gray-400 py-2 rounded-lg hover:bg-blue-300 transition duration-200 text-sm font-medium text-gray-600"
                disabled={!selectProduct?.import_id}
              >
                View Detail
              </button>
            </div>
          </div>

          {/* Cột phải: Bảng phiếu và phân trang */}
          {/* Bảng và phân trang */}
          <div className="flex-1 bg-white rounded-2xl shadow-lg overflow-hidden flex flex-col">
            {/* Table content */}
            <div className="overflow-x-auto flex-1">
              <table className="w-full text-gray-700 border border-gray-200">
                <thead className="bg-gray-50 text-xs font-medium uppercase text-center">
                  <tr>
                    <th className="px-4 py-2">STT</th>
                    <th className="px-4 py-2">Code</th>
                    <th className="px-4 py-2">Supplier</th>
                    <th className="px-4 py-2">Input By Staff</th>
                    <th className="px-4 py-2">Price Total</th>
                    <th className="px-4 py-2">Time</th>
                  </tr>
                </thead>
                <tbody className="divide-y text-center divide-gray-300 text-sm cursor-pointer">
                  {tableData.map((item, index) => (
                    <tr
                      key={index}
                      className={`hover:bg-blue-50 transition ${
                        selectProduct?.import_id === item.import_id
                          ? "bg-blue-100"
                          : ""
                      }`}
                      onClick={() =>
                        setSelectProduct(
                          selectProduct?.import_id ===
                            item.import_id
                            ? null
                            : item
                        )
                      }
                    >
                      <td className="px-4 py-3">
                        {(currentPage - 1) * 7 + index + 1}
                      </td>
                      <td className="px-4 py-3">{item.import_id}</td>
                      <td className="px-4 py-3">
                        {item.supplierName}
                      </td>
                      <td className="px-4 py-3">{item.staffName}</td>
                      <td className="px-4 py-3">
                        {item.totalAmount.toLocaleString()}
                      </td>
                      <td className="px-4 py-3">
                        {new Intl.DateTimeFormat("vi-VN", {
                          day: "2-digit",
                          month: "2-digit",
                          year: "numeric",
                          hour: "2-digit",
                          minute: "2-digit",
                          hour12: false,
                        }).format(new Date(item.time))}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Pagination fixed at bottom */}
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
                disabled={!hasNext}
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
