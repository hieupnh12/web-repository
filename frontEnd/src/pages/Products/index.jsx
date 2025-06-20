import React, { useEffect, useState } from "react";
import { getFullProducts, updateProduct, uploadProductImage } from "../../services/productService";
import Button from "../../components/ui/Button";
import ProductList from "./ProductList";
import { Plus, Trash, Scan, Download, Search } from "lucide-react";

import AddProductModal from "./modals/AddProductModal";
import EditProductModal from "./modals/EditProductModal";
import ProductDetailModal from "./modals/ProductDetailModal";

const ProductsPage = () => {
  const [products, setProducts] = useState([]);
  const [pagination, setPagination] = useState({
    page: 1,
    limit: 10,
    total: 0,
  });
  const [search, setSearch] = useState("");

  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showDetailModal, setShowDetailModal] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);

  const loadData = async () => {
    try {
      const { data, pagination: pageInfo } = await getFullProducts({
        page: pagination.page,
        limit: pagination.limit,
        search,
      });
      setProducts(data);
      setPagination((prev) => ({ ...prev, total: pageInfo.total }));
    } catch (error) {
      console.error("Lỗi khi tải dữ liệu sản phẩm:", error);
      alert("Không thể tải dữ liệu sản phẩm.");
    }
  };

  useEffect(() => {
    loadData();
  }, [pagination.page, search]);

  const handleEdit = (product) => {
    setSelectedProduct(product);
    setShowEditModal(true);
  };

  const handleDetail = (product) => {
    setSelectedProduct(product);
    setShowDetailModal(true);
  };

  const handleDelete = (product) => {
    alert(`Bạn muốn xóa sản phẩm: ${product.productName} ?`);
  };

  const handleScanIMEI = () => {
    alert("Chức năng quét IMEI chưa được triển khai.");
  };

  const handleExportExcel = () => {
    alert("Chức năng xuất Excel chưa được triển khai.");
  };

  const onSelectProduct = (product) => {
    setSelectedProduct(product);
  };

  const handleSaveEdit = async (editedData) => {
    try {
      const updateData = {
        origin: editedData.origin || null,
        processor: editedData.processor || "",
        battery: editedData.battery || null,
        screenSize: editedData.screenSize || null,
        operatingSystem: editedData.operatingSystem || null,
        chipset: editedData.chipset || null,
        rearCamera: editedData.rearCamera || "",
        frontCamera: editedData.frontCamera || "",
        warrantyPeriod: editedData.warrantyPeriod || null,
        brand: editedData.brand || null,
        warehouseArea: editedData.warehouseArea || null,
        stockQuantity: editedData.stockQuantity || 0,
        status: editedData.status ?? true,
      };

      await updateProduct(editedData.productId || editedData.id, updateData);

      if (editedData.image) {
        await uploadProductImage(editedData.productId || editedData.id, editedData.image);
      }

      alert("Cập nhật sản phẩm thành công.");
      setShowEditModal(false);
      setSelectedProduct(null);
      await loadData();
    } catch (error) {
      console.error("Lỗi khi lưu chỉnh sửa sản phẩm:", error);
      alert("Cập nhật sản phẩm thất bại.");
    }
  };

  return (
    <div className="min-h-screen w-full bg-gradient-to-br from-gray-50 to-blue-50 flex flex-col">
      <div className="flex-grow w-full px-4 py-6">
        <div className="bg-white rounded-2xl shadow-lg p-4 sm:p-6 mb-6">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div className="flex flex-wrap gap-2 sm:gap-3 items-center">
              <Button
                onClick={() => setShowAddModal(true)}
                className="group flex items-center gap-2 bg-blue-600 text-white hover:bg-blue-700 hover:scale-105 transform transition-all duration-300 shadow-lg hover:shadow-xl px-3 py-2 text-sm"
              >
                <Plus className="w-4 h-4 group-hover:rotate-90 transition-transform duration-300" />
                <span className="hidden sm:inline">Thêm mới</span>
              </Button>

              <Button
                onClick={() => {
                  if (selectedProduct) handleDelete(selectedProduct);
                  else alert("Vui lòng chọn sản phẩm để xoá");
                }}
                className="group flex items-center gap-2 bg-red-600 text-white hover:bg-red-700 hover:scale-105 transform transition-all duration-300 shadow-lg hover:shadow-xl px-3 py-2 text-sm"
              >
                <Trash className="w-4 h-4 group-hover:scale-110 transition-transform duration-300" />
                <span className="hidden sm:inline">Xoá</span>
              </Button>

              <Button
                onClick={handleScanIMEI}
                className="group flex items-center gap-2 bg-green-500 text-white hover:bg-green-600 hover:scale-105 transform transition-all duration-300 shadow-lg hover:shadow-xl px-3 py-2 text-sm"
              >
                <Scan className="w-4 h-4 group-hover:scale-110 transition-transform duration-300" />
                <span className="hidden sm:inline">Quét IMEI</span>
              </Button>

              <Button
                onClick={handleExportExcel}
                className="group flex items-center gap-2 bg-gray-500 text-white hover:bg-gray-600 hover:scale-105 transform transition-all duration-300 shadow-lg hover:shadow-xl px-3 py-2 text-sm"
              >
                <Download className="w-4 h-4 group-hover:scale-110 transition-transform duration-300" />
                <span className="hidden sm:inline">Xuất Excel</span>
              </Button>
            </div>

            <div className="relative w-full sm:w-72">
              <Search className="absolute top-2.5 left-3 w-5 h-5 text-gray-400" />
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

        <ProductList
          products={products}
          currentPage={pagination.page}
          itemsPerPage={pagination.limit}
          totalItems={pagination.total}
          onPageChange={(p) => setPagination((prev) => ({ ...prev, page: p }))}
          onEdit={handleEdit}
          onDetail={handleDetail}
          onSelect={onSelectProduct}
        />
      </div>

      {showAddModal && (
        <AddProductModal
          onClose={() => setShowAddModal(false)}
          onSuccess={() => {
            setShowAddModal(false);
            loadData();
          }}
        />
      )}

      {showEditModal && selectedProduct && (
        <EditProductModal
          product={selectedProduct}
          onClose={() => {
            setShowEditModal(false);
            setSelectedProduct(null);
          }}
          onSave={handleSaveEdit}
        />
      )}

      {showDetailModal && selectedProduct && (
        <ProductDetailModal
          product={selectedProduct}
          onClose={() => {
            setShowDetailModal(false);
            setSelectedProduct(null);
          }}
        />
      )}
    </div>
  );
};

export default ProductsPage;
