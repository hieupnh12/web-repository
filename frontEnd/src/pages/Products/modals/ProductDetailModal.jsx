import React, { useState, useEffect, Fragment } from "react";
import { Dialog, Transition } from "@headlessui/react";
import { XMarkIcon, PhotoIcon, PencilIcon, TrashIcon, CubeIcon, TagIcon, CurrencyDollarIcon } from "@heroicons/react/24/outline";
import { toast } from "react-toastify";
import Button from "../../../components/ui/Button";
import DeleteProductModal from "./DeleteProductModal";
import { getVersionsByProductId } from "../../../services/productVersionService";

const ProductDetailModal = ({ product, onClose, onEdit, onDelete }) => {
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [versions, setVersions] = useState([]);
  const [loadingVersions, setLoadingVersions] = useState(true);
  const [activeTab, setActiveTab] = useState('details'); // 'details' or 'versions'

  // product version
  useEffect(() => {
    const fetchVersions = async () => {
      if (!product || (!product.id && !product.productId)) {
        setLoadingVersions(false);
        return;
      }

      try {
        setLoadingVersions(true);
        const productId = product.id || product.productId;
        const versionsData = await getVersionsByProductId(productId);
        setVersions(versionsData || []);
      } catch (error) {
        console.error('Error fetching versions:', error);
        toast.error('Không thể tải danh sách phiên bản sản phẩm');
        setVersions([]);
      } finally {
        setLoadingVersions(false);
      }
    };

    fetchVersions();
  }, [product?.id, product?.productId]);

  if (!product) return null;

  const productDetails = [
    { label: "Tên sản phẩm", value: product.productName || product.processor },
    { label: "Thương hiệu", value: product.brandName || product.brand?.brandName || product.brandId },
    { label: "Số lượng tồn kho", value: product.stockQuantity },
    { label: "Hệ điều hành", value: product.operatingSystemName || product.operatingSystem?.name || product.operatingSystemId },
    { label: "Xuất xứ", value: product.originName || product.origin?.name || product.originId },
    { label: "Khu vực kho", value: product.warehouseAreaName || product.warehouseArea?.name || product.warehouseAreaId },
  
  ];

  const handleDeleteSuccess = () => {
    if (onDelete) onDelete(product);
    onClose(); 
  };

  return (
    <>
      <Transition appear show={true} as={Fragment}>
        <Dialog as="div" className="relative z-50" onClose={onClose} aria-label="Chi tiết sản phẩm">
          <Transition.Child
            as={Fragment}
            enter="ease-out duration-300"
            enterFrom="opacity-0"
            enterTo="opacity-100"
            leave="ease-in duration-200"
            leaveFrom="opacity-100"
            leaveTo="opacity-0"
          >
            <div className="fixed inset-0 bg-black/70 backdrop-blur-sm" />
          </Transition.Child>

          <div className="fixed inset-0 overflow-hidden">
            <div className="flex min-h-full items-center justify-center p-2 sm:p-4">
              <Transition.Child
                as={Fragment}
                enter="ease-out duration-300"
                enterFrom="opacity-0 scale-95 translate-y-4"
                enterTo="opacity-100 scale-100 translate-y-0"
                leave="ease-in duration-200"
                leaveFrom="opacity-100 scale-100 translate-y-0"
                leaveTo="opacity-0 scale-95 translate-y-4"
              >
                <Dialog.Panel className="w-full max-w-6xl h-[95vh] max-h-[800px] transform overflow-hidden rounded-2xl sm:rounded-3xl bg-white shadow-2xl transition-all flex flex-col">
                  {/* Header */}
                  <div className="relative bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 px-4 sm:px-8 py-4 sm:py-6 flex-shrink-0">
                    <button
                      onClick={onClose}
                      className="absolute right-3 sm:right-6 top-3 sm:top-6 p-2 rounded-full bg-white/20 hover:bg-white/30 transition-all duration-200 group"
                    >
                      <XMarkIcon className="w-5 h-5 sm:w-6 sm:h-6 text-white group-hover:rotate-90 transition-transform duration-200" />
                    </button>

                    <Dialog.Title className="text-xl sm:text-3xl font-bold text-white mb-1 sm:mb-2">
                      Chi tiết sản phẩm
                    </Dialog.Title>
                    <p className="text-indigo-100 text-sm sm:text-base">
                      Xem và quản lý thông tin sản phẩm
                    </p>
                  </div>

                  {/* Tab Navigation */}
                  <div className="px-4 sm:px-8 py-3 bg-white border-b border-gray-200 flex-shrink-0">
                    <div className="flex space-x-1">
                      <button
                        onClick={() => setActiveTab('details')}
                        className={`px-4 py-2 rounded-lg font-medium text-sm transition-all duration-200 ${
                          activeTab === 'details'
                            ? 'bg-gradient-to-r from-indigo-500 to-purple-600 text-white shadow-lg'
                            : 'text-gray-600 hover:text-gray-800 hover:bg-gray-100'
                        }`}
                      >
                        📋 Thông tin chi tiết
                      </button>
                      <button
                        onClick={() => setActiveTab('versions')}
                        className={`px-4 py-2 rounded-lg font-medium text-sm transition-all duration-200 flex items-center space-x-2 ${
                          activeTab === 'versions'
                            ? 'bg-gradient-to-r from-indigo-500 to-purple-600 text-white shadow-lg'
                            : 'text-gray-600 hover:text-gray-800 hover:bg-gray-100'
                        }`}
                      >
                        <CubeIcon className="w-4 h-4" />
                        <span>Phiên bản ({versions.length})</span>
                      </button>
                    </div>
                  </div>

                  {/* Main Content */}
                  <div className="flex flex-col lg:flex-row flex-1 min-h-0">
                    {/* Left Side - Content based on active tab */}
                    <div className="flex-1 p-3 sm:p-6 lg:p-8 overflow-y-auto">
                      {activeTab === 'details' ? (
                        <div className="bg-gradient-to-br from-gray-50 to-gray-100 rounded-xl sm:rounded-2xl p-3 sm:p-6 h-full">
                          <h3 className="text-lg sm:text-xl font-semibold text-gray-800 mb-4 sm:mb-6 flex items-center">
                            <div className="w-2 h-4 sm:h-6 bg-gradient-to-b from-indigo-500 to-purple-600 rounded-full mr-2 sm:mr-3"></div>
                            Thông tin chi tiết
                          </h3>

                          <div className="space-y-1">
                            {productDetails.map((detail, index) => (
                              <div
                                key={index}
                                className="group hover:bg-white/70 transition-all duration-200 rounded-lg sm:rounded-xl"
                              >
                                <div className="flex flex-col sm:flex-row py-2 sm:py-4 px-2 sm:px-4 border-b border-gray-200/50 last:border-b-0">
                                  <div className="w-full sm:w-1/3 text-xs sm:text-sm font-semibold text-gray-600 flex items-center mb-1 sm:mb-0">
                                    {detail.label}
                                  </div>
                                  <div className="w-full sm:w-2/3 text-xs sm:text-sm text-gray-900 font-medium sm:pl-4">
                                    {detail.value || (
                                      <span className="text-gray-400 italic">Chưa có thông tin</span>
                                    )}
                                  </div>
                                </div>
                              </div>
                            ))}
                          </div>

                          {/* Stock Status */}
                          <div className="mt-4 sm:mt-6 p-3 sm:p-4 bg-white rounded-lg sm:rounded-xl border border-gray-200 shadow-sm">
                            <div className="flex items-center justify-between">
                              <div className="flex items-center space-x-2 sm:space-x-3">
                                <div className={`w-3 h-3 sm:w-4 sm:h-4 rounded-full ${
                                  product.stockQuantity > 0 ? 'bg-emerald-500' : 'bg-red-500'
                                } animate-pulse`}></div>
                                <span className="font-semibold text-gray-700 text-xs sm:text-sm">Trạng thái kho hàng</span>
                              </div>
                              <div className={`px-2 sm:px-4 py-1 sm:py-2 rounded-full text-xs sm:text-sm font-bold ${
                                product.stockQuantity > 0
                                  ? 'bg-emerald-100 text-emerald-800 border border-emerald-200'
                                  : 'bg-red-100 text-red-800 border border-red-200'
                              }`}>
                                {product.stockQuantity > 0 ? 'Còn hàng' : 'Hết hàng'}
                              </div>
                            </div>
                            {product.stockQuantity > 0 && (
                              <div className="mt-2 sm:mt-3">
                                <div className="w-full bg-gray-200 rounded-full h-1.5 sm:h-2">
                                  <div
                                    className="bg-gradient-to-r from-emerald-400 to-emerald-600 h-1.5 sm:h-2 rounded-full transition-all duration-500"
                                    style={{ width: `${Math.min((product.stockQuantity / 100) * 100, 100)}%` }}
                                  ></div>
                                </div>
                                <p className="text-xs text-gray-500 mt-1">
                                  Số lượng: {product.stockQuantity} sản phẩm
                                </p>
                              </div>
                            )}
                          </div>
                        </div>
                      ) : (
                        <div className="bg-gradient-to-br from-gray-50 to-gray-100 rounded-xl sm:rounded-2xl p-3 sm:p-6 h-full">
                          <h3 className="text-lg sm:text-xl font-semibold text-gray-800 mb-4 sm:mb-6 flex items-center">
                            <CubeIcon className="w-5 h-5 sm:w-6 sm:h-6 mr-2 sm:mr-3 text-indigo-600" />
                            Phiên bản sản phẩm ({versions.length})
                          </h3>

                          {loadingVersions ? (
                            <div className="flex items-center justify-center h-64">
                              <div className="flex flex-col items-center space-y-4">
                                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
                                <p className="text-gray-500 text-sm">Đang tải phiên bản...</p>
                              </div>
                            </div>
                          ) : versions.length === 0 ? (
                            <div className="flex items-center justify-center h-64">
                              <div className="text-center">
                                <CubeIcon className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                                <p className="text-gray-500 font-medium mb-2">Chưa có phiên bản nào</p>
                                <p className="text-gray-400 text-sm">Sản phẩm này chưa có phiên bản được tạo</p>
                              </div>
                            </div>
                          ) : (
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 max-h-96 overflow-y-auto">
                              {versions.map((version, index) => (
                                <div
                                  key={version.versionId || index}
                                  className="bg-white rounded-xl p-4 border border-gray-200 shadow-sm hover:shadow-md transition-all duration-200 group"
                                >
                                  <div className="flex items-start justify-between mb-3">
                                    <div className="flex items-center space-x-2">
                                      <div className="w-3 h-3 bg-gradient-to-r from-indigo-500 to-purple-600 rounded-full"></div>
                                      <span className="font-semibold text-gray-800 text-sm">
                                        Phiên bản #{index + 1}
                                      </span>
                                    </div>
                                    <div className={`px-2 py-1 rounded-full text-xs font-medium ${
                                      version.status 
                                        ? 'bg-green-100 text-green-800' 
                                        : 'bg-red-100 text-red-800'
                                    }`}>
                                      {version.status ? 'Hoạt động' : 'Ngừng bán'}
                                    </div>
                                  </div>

                                  <div className="space-y-2">
                                    <div className="flex items-center space-x-2">
                                      <TagIcon className="w-4 h-4 text-gray-500" />
                                      <span className="text-xs text-gray-600">ROM:</span>
                                      <span className="text-xs font-medium text-gray-800">
                                        {version.romSize || version.rom?.romSize || 'N/A'}GB
                                      </span>
                                    </div>
                                    
                                    <div className="flex items-center space-x-2">
                                      <TagIcon className="w-4 h-4 text-gray-500" />
                                      <span className="text-xs text-gray-600">RAM:</span>
                                      <span className="text-xs font-medium text-gray-800">
                                        {version.ramSize || version.ram?.name || 'N/A'}GB
                                      </span>
                                    </div>

                                    <div className="flex items-center space-x-2">
                                      <div className="w-4 h-4 rounded-full border-2 border-gray-300 flex items-center justify-center">
                                        <div 
                                          className="w-2 h-2 rounded-full"
                                          style={{ backgroundColor: version.colorCode || version.color?.colorCode || '#gray' }}
                                        ></div>
                                      </div>
                                      <span className="text-xs text-gray-600">Màu:</span>
                                      <span className="text-xs font-medium text-gray-800">
                                        {version.colorName || version.color?.name || 'N/A'}
                                      </span>
                                    </div>

                                    <div className="pt-2 border-t border-gray-100">
                                      <div className="flex items-center justify-between">
                                        <div className="flex items-center space-x-1">
                                          <CurrencyDollarIcon className="w-4 h-4 text-green-600" />
                                          <span className="text-xs text-gray-600">Giá nhập:</span>
                                        </div>
                                        <span className="text-xs font-bold text-green-600">
                                          {version.importPrice ? `${Number(version.importPrice).toLocaleString()} VNĐ` : 'Chưa có'}
                                        </span>
                                      </div>
                                      
                                      <div className="flex items-center justify-between mt-1">
                                        <div className="flex items-center space-x-1">
                                          <CurrencyDollarIcon className="w-4 h-4 text-blue-600" />
                                          <span className="text-xs text-gray-600">Giá bán:</span>
                                        </div>
                                        <span className="text-xs font-bold text-blue-600">
                                          {version.exportPrice ? `${Number(version.exportPrice).toLocaleString()} VNĐ` : 'Chưa có'}
                                        </span>
                                      </div>
                                    </div>
                                  </div>
                                </div>
                              ))}
                            </div>
                          )}
                        </div>
                      )}
                    </div>

                    {/* Right Side - Product Image */}
                    <div className="w-full lg:w-1/3 p-3 sm:p-6 lg:p-8 bg-gradient-to-br from-slate-50 to-slate-100">
                      <div className="h-full flex flex-col min-h-[200px] lg:min-h-0">
                        <h3 className="text-lg sm:text-xl font-semibold text-gray-800 mb-4 sm:mb-6 flex items-center">
                          <PhotoIcon className="w-5 h-5 sm:w-6 sm:h-6 mr-2 sm:mr-3 text-purple-600" />
                          Hình ảnh sản phẩm
                        </h3>

                        <div className="flex-1 flex flex-col items-center justify-center bg-white rounded-xl sm:rounded-2xl border-2 border-dashed border-gray-300 p-4 sm:p-8 group hover:border-purple-400 transition-all duration-300 min-h-[150px] lg:min-h-0">
                          {product.image ? (
                            <div className="w-full h-full flex items-center justify-center">
                              <img
                                src={product.image}
                                alt={product.productName || product.processor}
                                className="max-w-full max-h-full object-contain rounded-xl shadow-lg"
                              />
                            </div>
                          ) : (
                            <div className="text-center">
                              <PhotoIcon className="w-16 h-16 sm:w-24 sm:h-24 text-gray-400 mx-auto mb-2 sm:mb-4 group-hover:text-purple-500 transition-colors duration-300" />
                              <p className="text-gray-500 font-medium mb-1 sm:mb-2 text-sm sm:text-base">Chưa có hình ảnh</p>
                              <p className="text-xs sm:text-sm text-gray-400">
                                Hình ảnh sản phẩm sẽ được hiển thị tại đây
                              </p>
                            </div>
                          )}
                        </div>

                        {/* Upload placeholder for future feature */}
                        <div className="mt-3 sm:mt-4 p-2 sm:p-3 bg-white/70 rounded-lg sm:rounded-xl border border-gray-200">
                          <p className="text-xs text-gray-500 text-center">
                            💡 Tính năng tải ảnh sẽ được bổ sung trong tương lai
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Footer Actions */}
                  <div className="px-3 sm:px-6 lg:px-8 py-3 sm:py-6 bg-gradient-to-r from-gray-50 to-gray-100 border-t border-gray-200 flex-shrink-0">
                    <div className="flex flex-col sm:flex-row justify-between items-center space-y-3 sm:space-y-0">
                      <div className="text-xs sm:text-sm text-gray-500 order-2 sm:order-1">
                        ID sản phẩm: <span className="font-mono font-semibold">{product.id || 'N/A'}</span>
                      </div>

                      <div className="flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-3 w-full sm:w-auto order-1 sm:order-2">
                        <Button
                          onClick={onClose}
                          className="px-4 sm:px-6 py-2 sm:py-3 bg-gray-500 hover:bg-gray-600 text-white rounded-lg sm:rounded-xl font-semibold transition-all duration-200 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 text-sm"
                        >
                          Đóng
                        </Button>

                        <Button
                          onClick={() => onEdit && onEdit(product)}
                          className="px-4 sm:px-6 py-2 sm:py-3 bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white rounded-lg sm:rounded-xl font-semibold transition-all duration-200 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 flex items-center justify-center space-x-2 text-sm"
                        >
                          <PencilIcon className="w-3 h-3 sm:w-4 sm:h-4" />
                          <span>Chỉnh sửa</span>
                        </Button>

                        <Button
                          onClick={() => setShowDeleteModal(true)}
                          className="px-4 sm:px-6 py-2 sm:py-3 bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 text-white rounded-lg sm:rounded-xl font-semibold transition-all duration-200 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 flex items-center justify-center space-x-2 text-sm"
                        >
                          <TrashIcon className="w-3 h-3 sm:w-4 sm:h-4" />
                          <span>Xóa sản phẩm</span>
                        </Button>
                      </div>
                    </div>
                  </div>
                </Dialog.Panel>
              </Transition.Child>
            </div>
          </div>
        </Dialog>
      </Transition>

      {showDeleteModal && (
        <DeleteProductModal
          product={product}
          onClose={() => setShowDeleteModal(false)}
          onSuccess={handleDeleteSuccess}
        />
      )}
    </>
  );
};

export default ProductDetailModal;