import React, { useEffect, useState, useCallback } from "react";
import { getFullProducts, updateProduct, uploadProductImage } from "../../services/productService";
import Button from "../../components/ui/Button";
import ProductList from "./ProductList";
import { Plus, Trash, Scan, Download, Loader2 } from "lucide-react";
import AddProductModal from "./modals/AddProductModal";
import EditProductModal from "./modals/EditProductModal";
import ProductDetailModal from "./modals/ProductDetailModal";
import SearchFilter from "./components/SearchFilter";
import DeleteProductModal from "./modals/DeleteProductModal";

const ProductsPage = () => {
  const [products, setProducts] = useState([]);
  const [pagination, setPagination] = useState({
    page: 1,
    limit: 10,
    total: 0,
  });
  const [filters, setFilters] = useState({
    search: "",
    brandId: null,
    originId: null,
    operatingSystemId: null,
    warehouseAreaId: null,
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
      console.log("Loading data with filters:", { page: pagination.page, ...filters });
      
      const { data, pagination: pageInfo } = await getFullProducts({
        page: pagination.page,
        limit: pagination.limit,
        ...filters,
      });
      
      setProducts(data);
      setPagination(prev => ({ ...prev, total: pageInfo.total }));
    } catch (error) {
      console.error("Error loading products:", error);
      alert("Could not load product data.");
    } finally {
      setIsLoading(false);
    }
  }, [pagination.page, pagination.limit, filters]);

  useEffect(() => {
    loadData();
  }, [loadData]);

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

  const handleScanIMEI = () => {
    alert("IMEI scanning feature not implemented yet.");
  };

  const handleExportExcel = () => {
    alert("Excel export feature not implemented yet.");
  };

  const onSelectProduct = (product) => {
    setSelectedProduct(product);
  };

  const handleSaveEdit = async (editedData) => {
    try {
      console.log("Saving edited product:", editedData);

      if (!editedData.productId && !editedData.id) {
        throw new Error("Product ID is required");
      }

      // Validation
      const errors = [];
      if (!editedData.origin?.id) errors.push("Product origin is required");
      if (!editedData.operatingSystem?.id) errors.push("Operating system is required");
      if (!editedData.warehouseArea?.id) errors.push("Warehouse area is required");
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
        await uploadProductImage(editedData.productId || editedData.id, editedData.image);
      }

      alert("Product updated successfully!");
      setShowEditModal(false);
      setSelectedProduct(null);
      await loadData();
    } catch (error) {
      console.error("Error saving product:", error);
      alert(`Failed to update product: ${error.message || "Unknown error"}`);
    }
  };

  const handleFilterChange = useCallback((newFilters) => {
    console.log("Filters changed:", newFilters);
    setFilters(newFilters);
    setPagination(prev => ({ ...prev, page: 1 }));
  }, []);

  return (
    <div className="min-h-screen w-full bg-gradient-to-br from-gray-50 to-blue-100 flex flex-col">
      <div className="flex-grow w-full px-4 py-6">
        <div className="bg-white rounded-2xl shadow-lg p-6 mb-6">
          <div className="flex flex-col gap-4">
            <div className="flex flex-wrap sm:flex-row sm:items-center sm:justify-between gap-4">
              <div className="flex flex-wrap gap-3 items-center">
                <Button
                  onClick={() => setShowAddModal(true)}
                  className="group flex items-center gap-2 bg-blue-600 text-white hover:bg-blue-700 hover:scale-105 transform transition-all duration-300 shadow-lg hover:shadow-xl px-4 py-2 text-sm"
                >
                  <Plus className="w-4 h-4 group-hover:rotate-90 transition-transform duration-300" />
                  <span className="hidden sm:inline">Add New</span>
                </Button>
                <Button
                  onClick={handleScanIMEI}
                  className="group flex items-center gap-2 bg-green-500 text-white hover:bg-green-600 hover:scale-105 transform transition-all duration-200 shadow-lg hover:shadow-xl px-4 py-2 text-sm"
                >
                  <Scan className="w-4 h-4 group-hover:scale-110 transition-all duration-200" />
                  <span className="hidden sm:inline">Scan IMEI</span>
                </Button>
                <Button
                  onClick={handleExportExcel}
                  className="group flex items-center gap-2 bg-gray-500 text-white hover:bg-gray-600 hover:scale-105 transform transition-all duration-200 shadow-lg hover:shadow-xl px-4 py-2 text-sm"
                >
                  <Download className="w-4 h-4 group-hover:scale-110 transition-all duration-200" />
                  <span className="hidden sm:inline">Export Excel</span>
                </Button>
              </div>
            </div>
            
            <SearchFilter onFilterChange={handleFilterChange} />
            
            {/* {isLoading && (
              <div className="flex justify-center items-center py-4">
                <Loader2 className="w-6 h-6 text-blue-500 animate-spin" />
                <span className="ml-2">Loading products...</span>
              </div>
            )} */}
          </div>
        </div>

        <ProductList
          products={products}
          currentPage={pagination.page}
          itemsPerPage={pagination.limit}
          totalItems={pagination.total}
          onPageChange={(p) => setPagination(prev => ({ ...prev, page: p }))}
          onEdit={handleEdit}
          onDetail={handleDetail}
          onDelete={handleDelete}
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
          }}
        />
      )}
    </div>
  );
};

export default ProductsPage;