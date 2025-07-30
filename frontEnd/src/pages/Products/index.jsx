import React, { useEffect, useState, useCallback, useMemo } from "react";
import {
  searchProducts,
  getFullProducts,
  updateProduct,
  uploadProductImage,
} from "../../services/productService";
import { getVersionsByProductId } from "../../services/productVersionService";
import Button from "../../components/ui/Button";
import ProductList from "./ProductList";
import { Plus, FileSpreadsheet } from "lucide-react";
import EditProductModal from "./modals/EditProductModal";
import ProductDetailModal from "./modals/ProductDetailModal";
import AddProductWithVersionsModal from "./modals/AddProductWithVersionsModal";
import SearchFilter from "./components/SearchFilter";
import DeleteProductModal from "./modals/DeleteProductModal";
import * as XLSX from 'xlsx';
import { toast } from "react-toastify";

const ProductsPage = () => {
  const [products, setProducts] = useState([]);
  const [allProducts, setAllProducts] = useState([]);
  const [pagination, setPagination] = useState({
    page: 1,
    limit: 10,
    total: 0,
  });
  const [filters, setFilters] = useState({
    productName: "",
    brandName: null,
    originName: null,
    operatingSystemName: null,
    warehouseAreaName: null,
  });
  const [isLoading, setIsLoading] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showDetailModal, setShowDetailModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);

  const loadData = useCallback(async () => {
    try {
      setIsLoading(true);
      console.log("▶️ Gọi searchProducts với filters:", {
        ...filters,
        page: pagination.page,
        limit: pagination.limit,
      });

      const { data, pagination: pageInfo } = await searchProducts({
        ...filters,
        page: pagination.page,
        limit: pagination.limit,
      });
      setProducts(data);
      setPagination((prev) => ({ ...prev, total: pageInfo.total }));
    } catch (error) {
      console.error("Error loading products:", error);
      alert("Không thể tải danh sách sản phẩm.");
    } finally {
      setIsLoading(false);
    }
  }, [filters, pagination.page, pagination.limit]);

  const loadAllProducts = useCallback(async () => {
    try {
      const { data } = await getFullProducts({ page: 1, limit: 1000 });
      setAllProducts(data);
    } catch (error) {
      console.error("Error loading all products:", error);
    }
  }, []);

  useEffect(() => {
    loadData();
  }, [loadData]);

  useEffect(() => {
    loadAllProducts();
  }, [loadAllProducts]);

  const handleEdit = (product) => {
    setSelectedProduct(product);
    setShowEditModal(true);
  };

  const handleDetail = (product) => {
    setSelectedProduct(product);
    setShowDetailModal(true);
  };

  const handleDelete = (product) => {
    setSelectedProduct(product);
    setShowDeleteModal(true);
  };

  const handleExportExcel = async () => {
    try {
      toast.info("🔄 Đang chuẩn bị xuất file Excel...");
      

      const productsWithVersions = await Promise.all(
        allProducts.map(async (product) => {
          try {
            const versions = await getVersionsByProductId(product.id || product.productId);
            return { ...product, versions: versions || [] };
          } catch (error) {
            console.warn(`Could not fetch versions for product ${product.id}:`, error);
            return { ...product, versions: [] };
          }
        })
      );


      const workbook = XLSX.utils.book_new();


      const productSummaryData = productsWithVersions.map((product, index) => ({
        'STT': index + 1,
        'Mã sản phẩm': product.id || product.productId || 'N/A',
        'Tên sản phẩm': product.productName || 'N/A',
        'Thương hiệu': product.brandName || product.brand?.brandName || 'N/A',
        'Xuất xứ': product.originName || product.origin?.name || 'N/A',
        'Hệ điều hành': product.operatingSystemName || product.operatingSystem?.name || 'N/A',
        'Khu vực kho': product.warehouseAreaName || product.warehouseArea?.name || 'N/A',
        'Số lượng tồn kho': product.stockQuantity || 0,
        'Số phiên bản': product.versions.length,
        'Trạng thái': product.stockQuantity > 0 ? 'Còn hàng' : 'Hết hàng',
        'Vi xử lý': product.processor || 'N/A',
        'Pin (mAh)': product.battery || 'N/A',
        'Màn hình (inch)': product.screenSize || 'N/A',
        'Chipset (Hz)': product.chipset || 'N/A',
        'Camera sau': product.rearCamera || 'N/A',
        'Camera trước': product.frontCamera || 'N/A',
        'Bảo hành (tháng)': product.warrantyPeriod || 'N/A'
      }));

      const productSummarySheet = XLSX.utils.json_to_sheet(productSummaryData);
      
      // Set column widths for product summary
      productSummarySheet['!cols'] = [
        { wch: 5 },  
        { wch: 12 },  
        { wch: 25 },  
        { wch: 15 },  
        { wch: 12 },  
        { wch: 15 },  
        { wch: 15 },  
        { wch: 12 },  
        { wch: 12 },  
        { wch: 12 },  
        { wch: 20 }, 
        { wch: 10 },  
        { wch: 12 },  
        { wch: 12 },  
        { wch: 20 },  
        { wch: 15 },  
        { wch: 12 }   
      ];

      XLSX.utils.book_append_sheet(workbook, productSummarySheet, "Tổng quan sản phẩm");


      const versionDetailData = [];
      productsWithVersions.forEach((product) => {
        if (product.versions && product.versions.length > 0) {
          product.versions.forEach((version, versionIndex) => {
            versionDetailData.push({
              'Mã sản phẩm': product.id || product.productId || 'N/A',
              'Tên sản phẩm': product.productName || 'N/A',
              'Phiên bản': `#${versionIndex + 1}`,
              'Mã phiên bản': version.versionId || 'N/A',
              'ROM (GB)': version.romSize || version.rom?.romSize || 'N/A',
              'RAM (GB)': version.ramSize || version.ram?.name || 'N/A',
              'Màu sắc': version.colorName || version.color?.name || 'N/A',
              'Mã màu': version.colorCode || version.color?.colorCode || 'N/A',
              'Giá nhập (VNĐ)': version.importPrice ? Number(version.importPrice).toLocaleString() : 'Chưa có',
              'Giá xuất (VNĐ)': version.exportPrice ? Number(version.exportPrice).toLocaleString() : 'Chưa có',
              'Trạng thái phiên bản': version.status ? 'Hoạt động' : 'Ngừng bán',
              'Số lượng tồn': version.stockQuantity || 0
            });
          });
        } else {

          versionDetailData.push({
            'Mã sản phẩm': product.id || product.productId || 'N/A',
            'Tên sản phẩm': product.productName || 'N/A',
            'Phiên bản': 'Chưa có phiên bản',
            'Mã phiên bản': 'N/A',
            'ROM (GB)': 'N/A',
            'RAM (GB)': 'N/A',
            'Màu sắc': 'N/A',
            'Mã màu': 'N/A',
            'Giá nhập (VNĐ)': 'N/A',
            'Giá xuất (VNĐ)': 'N/A',
            'Trạng thái phiên bản': 'N/A',
            'Số lượng tồn': product.stockQuantity || 0
          });
        }
      });

      const versionDetailSheet = XLSX.utils.json_to_sheet(versionDetailData);
      

      versionDetailSheet['!cols'] = [
        { wch: 12 }, 
        { wch: 25 },  
        { wch: 10 },  
        { wch: 15 },  
        { wch: 10 },  
        { wch: 10 },  
        { wch: 15 },  
        { wch: 10 },  
        { wch: 15 },  
        { wch: 15 },  
        { wch: 15 },  
        { wch: 12 }   
      ];

      XLSX.utils.book_append_sheet(workbook, versionDetailSheet, "Chi tiết phiên bản");

      const statsData = [
        { 'Thống kê': 'Tổng số sản phẩm', 'Giá trị': stats.totalProducts },
        { 'Thống kê': 'Sản phẩm còn hàng (≥20)', 'Giá trị': stats.inStock },
        { 'Thống kê': 'Sản phẩm sắp hết (1-9)', 'Giá trị': stats.lowStock },
        { 'Thống kê': 'Sản phẩm hết hàng (0)', 'Giá trị': stats.outOfStock },
        { 'Thống kê': 'Tổng số phiên bản', 'Giá trị': versionDetailData.filter(v => v['Mã phiên bản'] !== 'N/A').length },
        { 'Thống kê': 'Ngày xuất báo cáo', 'Giá trị': new Date().toLocaleDateString('vi-VN') },
        { 'Thống kê': 'Thời gian xuất', 'Giá trị': new Date().toLocaleTimeString('vi-VN') }
      ];

      const statsSheet = XLSX.utils.json_to_sheet(statsData);
      statsSheet['!cols'] = [{ wch: 25 }, { wch: 20 }];
      XLSX.utils.book_append_sheet(workbook, statsSheet, "Thống kê");

      const now = new Date();
      const timestamp = now.toISOString().slice(0, 19).replace(/:/g, '-');
      const filename = `Danh_sach_san_pham_${timestamp}.xlsx`;

      XLSX.writeFile(workbook, filename);
      
      toast.success(`Xuất file Excel thành công! File: ${filename}`);
    } catch (error) {
      console.error('Error exporting Excel:', error);
      toast.error('Lỗi khi xuất file Excel. Vui lòng thử lại!');
    }
  };

  const onSelectProduct = (product) => {
    setSelectedProduct(product);
  };

  const handleSaveEdit = async (editedData) => {
    try {
      if (!editedData.productId && !editedData.id) {
        throw new Error("Product ID is required");
      }

      const errors = [];
      if (!editedData.origin?.id) errors.push("Product origin is required");
      if (!editedData.operatingSystem?.id)
        errors.push("Operating system is required");
      if (!editedData.warehouseArea?.id)
        errors.push("Warehouse area is required");
      if (!editedData.brand?.idBrand) errors.push("Product brand is required");

      if (errors.length > 0) {
        throw new Error(errors.join("; "));
      }

      const updateData = {
        originId: String(editedData.origin.id),
        processor: editedData.processor || "",
        battery: editedData.battery ? Number(editedData.battery) : null,
        screenSize: editedData.screenSize ? Number(editedData.screenSize) : null,
        operatingSystemId: String(editedData.operatingSystem.id),
        chipset: editedData.chipset || null,
        rearCamera: editedData.rearCamera || "",
        frontCamera: editedData.frontCamera || "",
        warrantyPeriod: editedData.warrantyPeriod ? Number(editedData.warrantyPeriod) : null,
        brandId: String(editedData.brand.idBrand),
        warehouseAreaId: String(editedData.warehouseArea.id),
        stockQuantity: editedData.stockQuantity ? Number(editedData.stockQuantity) : 0,
        status: editedData.status ?? true,
      };

      await updateProduct(editedData.productId || editedData.id, updateData);

      if (editedData.image) {
        await uploadProductImage(
          editedData.productId || editedData.id,
          editedData.image
        );
      }

      alert("Product updated successfully!");
      setShowEditModal(false);
      setSelectedProduct(null);
      await loadData();
      await loadAllProducts();
    } catch (error) {
      console.error("Error saving product:", error);
      alert(`Failed to update product: ${error.message || "Unknown error"}`);
    }
  };

  const handleFilterChange = useCallback((newFilters) => {
    setFilters(newFilters);
    setPagination((prev) => ({ ...prev, page: 1 }));
  }, []);

  const stats = useMemo(() => {
    const totalProducts = allProducts.length;
    const inStock = allProducts.filter((p) => p.stockQuantity >= 20).length;
    const lowStock = allProducts.filter((p) => p.stockQuantity > 0 && p.stockQuantity < 10).length;
    const outOfStock = allProducts.filter((p) => p.stockQuantity === 0).length;
    return { totalProducts, inStock, lowStock, outOfStock };
  }, [allProducts]);

  return (
    <div className="min-h-screen w-full bg-gradient-to-br from-gray-50 to-blue-100 flex flex-col">
      <div className="flex-grow w-full px-4 py-6">
        <div className="bg-white rounded-2xl shadow-lg p-6 mb-6">
          <div className="flex flex-col gap-4">
            <div className="flex flex-wrap sm:flex-row sm:items-center sm:justify-between gap-4">
              <div className="flex flex-wrap gap-3 items-center">
                <Button onClick={() => setShowAddModal(true)} className="group flex items-center gap-2 bg-blue-600 text-white hover:bg-blue-700 hover:scale-105 transform transition-all duration-300 shadow-lg hover:shadow-xl px-4 py-2 text-sm">
                  <Plus className="w-4 h-4 group-hover:rotate-90 transition-transform duration-300" />
                  <span className="hidden sm:inline">Thêm mới</span>
                </Button>
                <Button onClick={handleExportExcel} className="group flex items-center gap-2 bg-gradient-to-r from-emerald-500 to-emerald-600 text-white hover:from-emerald-600 hover:to-emerald-700 hover:scale-105 transform transition-all duration-200 shadow-lg hover:shadow-xl px-4 py-2 text-sm">
                  <FileSpreadsheet className="w-4 h-4 group-hover:scale-110 transition-all duration-200" />
                  <span className="hidden sm:inline">Xuất Excel</span>
                </Button>
              </div>
            </div>
            <SearchFilter onFilterChange={handleFilterChange} />
          </div>
        </div>

        <ProductList
          products={products}
          currentPage={pagination.page}
          itemsPerPage={pagination.limit}
          totalItems={pagination.total}
          isLoading={isLoading}
          onPageChange={(p) => setPagination((prev) => ({ ...prev, page: p }))}
          onEdit={handleEdit}
          onDetail={handleDetail}
          onDelete={handleDelete}
          onSelect={onSelectProduct}
          stats={stats}
        />
      </div>

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

      {showDeleteModal && selectedProduct && (
        <DeleteProductModal
          product={selectedProduct}
          onClose={() => {
            setShowDeleteModal(false);
            setSelectedProduct(null);
          }}
          onSuccess={() => {
            setShowDeleteModal(false);
            setSelectedProduct(null);
            loadData();
            loadAllProducts();
          }}
        />
      )}

      {showAddModal && (
        <AddProductWithVersionsModal
          onClose={() => setShowAddModal(false)}
          onSuccess={() => {
            setShowAddModal(false);
            loadData();
            loadAllProducts();
          }}
        />
      )}
    </div>
  );
};

export default ProductsPage;
