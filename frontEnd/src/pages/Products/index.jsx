import React, { useEffect, useState } from "react";
import { getFullProducts } from "../../services/productService";
import Button from "../../components/ui/Button";
import ProductList from "./ProductList";
import { Plus, Edit, Trash, Info, Scan, Download, Search } from "lucide-react";
import AddProductModal from "./modals/AddProductModal"; // Thêm dòng này

const ProductsPage = () => {
  const [products, setProducts] = useState([]);
  const [pagination, setPagination] = useState({
    page: 1,
    limit: 10,
    total: 0,
  });
  const [search, setSearch] = useState("");
  const [showAddModal, setShowAddModal] = useState(false); // Quản lý trạng thái mở modal

  const loadData = async () => {
    const { data, pagination: pageInfo } = await getFullProducts({
      page: pagination.page,
      limit: pagination.limit,
      search,
    });

    setProducts(data);
    setPagination((prev) => ({ ...prev, total: pageInfo.total }));
  };

  useEffect(() => {
    loadData();
  }, [pagination.page, search]);

  return (
    <div className="min-h-screen w-full bg-gradient-to-br from-gray-50 to-blue-50 flex flex-col">
      <div className="flex-grow w-full px-4 py-6">
        {/* Controls */}
        <div className="bg-white rounded-2xl shadow-lg p-4 sm:p-6 mb-6">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            {/* Buttons */}
            <div className="flex flex-wrap gap-2 sm:gap-3 items-center">
              <Button
                onClick={() => setShowAddModal(true)} // Mở modal khi nhấn
                className="group flex items-center gap-2 bg-blue-600 text-white hover:bg-blue-700 hover:scale-105 transform transition-all duration-300 shadow-lg hover:shadow-xl px-3 py-2 text-sm"
              >
                <Plus className="w-4 h-4 group-hover:rotate-90 transition-transform duration-300" />
                <span className="hidden sm:inline">Thêm mới</span>
              </Button>

              <Button className="group flex items-center gap-2 bg-yellow-500 text-white hover:bg-yellow-600 hover:scale-105 transform transition-all duration-300 shadow-lg hover:shadow-xl px-3 py-2 text-sm">
                <Edit className="w-4 h-4 group-hover:scale-110 transition-transform duration-300" />
                <span className="hidden sm:inline">Sửa</span>
              </Button>

              <Button className="group flex items-center gap-2 bg-red-600 text-white hover:bg-red-700 hover:scale-105 transform transition-all duration-300 shadow-lg hover:shadow-xl px-3 py-2 text-sm">
                <Trash className="w-4 h-4 group-hover:scale-110 transition-transform duration-300" />
                <span className="hidden sm:inline">Xoá</span>
              </Button>

              <Button className="group flex items-center gap-2 bg-purple-600 text-white hover:bg-purple-700 hover:scale-105 transform transition-all duration-300 shadow-lg hover:shadow-xl px-3 py-2 text-sm">
                <Info className="w-4 h-4 group-hover:scale-110 transition-transform duration-300" />
                <span className="hidden sm:inline">Chi tiết</span>
              </Button>

              <Button className="group flex items-center gap-2 bg-green-500 text-white hover:bg-green-600 hover:scale-105 transform transition-all duration-300 shadow-lg hover:shadow-xl px-3 py-2 text-sm">
                <Scan className="w-4 h-4 group-hover:scale-110 transition-transform duration-300" />
                <span className="hidden sm:inline">Quét IMEI</span>
              </Button>

              <Button className="group flex items-center gap-2 bg-gray-500 text-white hover:bg-gray-600 hover:scale-105 transform transition-all duration-300 shadow-lg hover:shadow-xl px-3 py-2 text-sm">
                <Download className="w-4 h-4 group-hover:scale-110 transition-transform duration-300" />
                <span className="hidden sm:inline">Xuất Excel</span>
              </Button>
            </div>

            {/* Search bar */}
            <div className="relative w-full sm:w-72">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="text"
                placeholder="Tìm kiếm sản phẩm..."
                className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
            </div>
          </div>
        </div>

        {/* Product List */}
        <ProductList
          products={products}
          currentPage={pagination.page}
          itemsPerPage={pagination.limit}
          totalItems={pagination.total}
          onPageChange={(p) => setPagination((prev) => ({ ...prev, page: p }))}
        />
      </div>

      {/* Add Product Modal */}
      {showAddModal && (
        <AddProductModal
          onClose={() => setShowAddModal(false)}
          onSuccess={() => {
            setShowAddModal(false);
            loadData(); // Reload danh sách sau khi thêm
          }}
        />
      )}
    </div>
  );
};

export default ProductsPage;
