import React, { useState, useEffect, Fragment } from "react";
import { Dialog, Transition } from "@headlessui/react";
import { toast } from "react-toastify";
import Button from "../../../components/ui/Button";
import {
  getAllBrands,
  getAllOrigins,
  getAllOSs,
  getAllROMs,
  getAllRAMs,
  getAllColors,
} from "../../../services/attributeService";
import {
  createProductWithVersions,
  initProduct,
} from "../../../services/productService";
import { takeWarehouseArea } from "../../../services/storage";

const FormInput = ({
  label,
  name,
  type = "text",
  value,
  onChange,
  error,
  readOnly,
  placeholder,
  unit,
}) => (
  <div className="mb-6">
    <label className="block text-sm font-semibold text-gray-800 mb-2">
      {label} {unit && <span className="text-gray-500 font-normal">({unit})</span>}
    </label>
    <div className="relative">
      <input
        type={type}
        name={name}
        value={value ?? ""}
        onChange={onChange}
        readOnly={readOnly}
        placeholder={placeholder}
        className={`w-full px-4 py-3 border-2 rounded-xl transition-all focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
          error ? "border-red-400 bg-red-50" : "border-gray-200 hover:border-gray-300"
        } ${readOnly ? "bg-gray-100 cursor-not-allowed" : "bg-white"}`}
      />
      {unit && (
        <span className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 text-sm">
          {unit}
        </span>
      )}
    </div>
    {error && <p className="text-red-500 text-xs mt-2">{error}</p>}
  </div>
);

const FormSelect = ({
  label,
  name,
  value,
  onChange,
  options,
  getId,
  getName,
  error,
  placeholder = "-- Chọn --",
}) => (
  <div className="mb-6">
    <label className="block text-sm font-semibold text-gray-800 mb-2">
      {label}
    </label>
    <select
      name={name}
      value={value}
      onChange={onChange}
      className={`w-full px-4 py-3 border-2 rounded-xl transition-all focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
        error ? "border-red-400 bg-red-50" : "border-gray-200 hover:border-gray-300"
      } bg-white`}
    >
      <option value="">{placeholder}</option>
      {options.map((opt) => (
        <option key={getId(opt)} value={getId(opt)}>
          {getName(opt)}
        </option>
      ))}
    </select>
    {error && <p className="text-red-500 text-xs mt-2">{error}</p>}
  </div>
);

// Confirmation Modal Component
const ConfirmationModal = ({ isOpen, onClose, onConfirm, title, message, confirmText = "Xác nhận", cancelText = "Hủy", type = "warning" }) => {
  const getIcon = () => {
    switch (type) {
      case "danger":
        return (
          <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg className="w-6 h-6 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.732-.833-2.5 0L4.268 15.5c-.77.833.192 2.5 1.732 2.5z" />
            </svg>
          </div>
        );
      case "info":
        return (
          <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
        );
      default:
        return (
          <div className="w-12 h-12 bg-yellow-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg className="w-6 h-6 text-yellow-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.732-.833-2.5 0L4.268 15.5c-.77.833.192 2.5 1.732 2.5z" />
            </svg>
          </div>
        );
    }
  };

  return (
    <Transition appear show={isOpen} as={Fragment}>
      <Dialog as="div" className="relative z-50" onClose={onClose}>
        <Transition.Child
          as={Fragment}
          enter="ease-out duration-300"
          enterFrom="opacity-0"
          enterTo="opacity-100"
          leave="ease-in duration-200"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          <div className="fixed inset-0 bg-black bg-opacity-25" />
        </Transition.Child>

        <div className="fixed inset-0 overflow-y-auto">
          <div className="flex min-h-full items-center justify-center p-4 text-center">
            <Transition.Child
              as={Fragment}
              enter="ease-out duration-300"
              enterFrom="opacity-0 scale-95"
              enterTo="opacity-100 scale-100"
              leave="ease-in duration-200"
              leaveFrom="opacity-100 scale-100"
              leaveTo="opacity-0 scale-95"
            >
              <Dialog.Panel className="w-full max-w-md transform overflow-hidden rounded-2xl bg-white p-6 text-left align-middle shadow-xl transition-all">
                {getIcon()}
                
                <Dialog.Title as="h3" className="text-lg font-medium leading-6 text-gray-900 text-center mb-2">
                  {title}
                </Dialog.Title>
                
                <div className="mt-2">
                  <p className="text-sm text-gray-500 text-center whitespace-pre-line">
                    {message}
                  </p>
                </div>

                <div className="mt-6 flex gap-3 justify-center">
                  <button
                    type="button"
                    className="inline-flex justify-center rounded-lg border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2"
                    onClick={onClose}
                  >
                    {cancelText}
                  </button>
                  <button
                    type="button"
                    className={`inline-flex justify-center rounded-lg border border-transparent px-4 py-2 text-sm font-medium text-white focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 ${
                      type === "danger" 
                        ? "bg-red-600 hover:bg-red-700 focus-visible:ring-red-500" 
                        : "bg-blue-600 hover:bg-blue-700 focus-visible:ring-blue-500"
                    }`}
                    onClick={onConfirm}
                  >
                    {confirmText}
                  </button>
                </div>
              </Dialog.Panel>
            </Transition.Child>
          </div>
        </div>
      </Dialog>
    </Transition>
  );
};

const AddProductWithVersionsModal = ({ onSuccess, onClose }) => {

  const STORAGE_KEYS = {
    PRODUCT_DATA: 'addProduct_productData',
    VERSIONS: 'addProduct_versions',
    FORM_TIMESTAMP: 'addProduct_timestamp'
  };


  const loadFromStorage = () => {
    try {
      const savedProductData = localStorage.getItem(STORAGE_KEYS.PRODUCT_DATA);
      const savedVersions = localStorage.getItem(STORAGE_KEYS.VERSIONS);
      const timestamp = localStorage.getItem(STORAGE_KEYS.FORM_TIMESTAMP);
      
      const isDataFresh = timestamp && (Date.now() - parseInt(timestamp)) < 24 * 60 * 60 * 1000;
      
      if (isDataFresh && savedProductData && savedVersions) {
        return {
          productData: JSON.parse(savedProductData),
          versions: JSON.parse(savedVersions)
        };
      }
    } catch (error) {
      console.warn('Error loading from localStorage:', error);
    }
    return null;
  };


  const saveToStorage = (productData, versions) => {
    try {

      const dataToSave = { ...productData };
      delete dataToSave.image;
      
      localStorage.setItem(STORAGE_KEYS.PRODUCT_DATA, JSON.stringify(dataToSave));
      localStorage.setItem(STORAGE_KEYS.VERSIONS, JSON.stringify(versions));
      localStorage.setItem(STORAGE_KEYS.FORM_TIMESTAMP, Date.now().toString());
    } catch (error) {
      console.warn('Error saving to localStorage:', error);
    }
  };


  const clearStorage = () => {
    try {
      localStorage.removeItem(STORAGE_KEYS.PRODUCT_DATA);
      localStorage.removeItem(STORAGE_KEYS.VERSIONS);
      localStorage.removeItem(STORAGE_KEYS.FORM_TIMESTAMP);
    } catch (error) {
      console.warn('Error clearing localStorage:', error);
    }
  };

  const savedData = loadFromStorage();
  
  const [productData, setProductData] = useState(savedData?.productData || {
    productId: null,
    productName: "",
    processor: "",
    battery: "",
    screenSize: "",
    chipset: "",
    rearCamera: "",
    frontCamera: "",
    warrantyPeriod: "",
    image: null,
    imagePreview: "",
    originId: "",
    operatingSystemId: "",
    warehouseAreaId: "",
    brandId: "",
  });

  const [versions, setVersions] = useState(savedData?.versions || [
    {
      productId: productData.productId,
      romId: "",
      ramId: "",
      colorId: "",
      importPrice: "",
      exportPrice: "",
    },
  ]);

  const [brands, setBrands] = useState([]);
  const [origins, setOrigins] = useState([]);
  const [operatingSystems, setOperatingSystems] = useState([]);
  const [warehouseAreas, setWarehouseAreas] = useState([]);
  const [roms, setRoms] = useState([]);
  const [rams, setRams] = useState([]);
  const [colors, setColors] = useState([]);

  const [errors, setErrors] = useState({});
  const [apiError, setApiError] = useState(null);
  const [successMessage, setSuccessMessage] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showRestoreNotification, setShowRestoreNotification] = useState(false);
  

  const [showClearConfirm, setShowClearConfirm] = useState(false);
  const [showCloseConfirm, setShowCloseConfirm] = useState(false);


  useEffect(() => {
    const timeoutId = setTimeout(() => {
      saveToStorage(productData, versions);
    }, 1000); 

    return () => clearTimeout(timeoutId);
  }, [productData, versions]);

 
  useEffect(() => {
    if (savedData) {
      setShowRestoreNotification(true);
      toast.info("📋 Đã khôi phục dữ liệu form từ lần trước!", {
        position: "top-right",
        autoClose: 3000,
      });
    }
  }, []);

  const handleInitProduct = async () => {
    try {
      const result = await initProduct();
      if (result) {
        setProductData((prev) => ({ ...prev, productId: result.productId }));
        setVersions((prev) =>
          prev.map((item) => ({
            ...item,
            productId: result.productId,
          }))
        );
        console.log("Dữ liệu khởi tạo sản phẩm:", result.productId);
      } else {
        console.warn("Không có dữ liệu khởi tạo.");
      }
    } catch (error) {
      console.error("Lỗi khi khởi tạo sản phẩm:", error);
    }
  };

  useEffect(() => {
    // Only init product if we don't have a saved productId
    if (!productData.productId) {
      handleInitProduct();
    }
  }, []);

  useEffect(() => {
    Promise.all([
      getAllBrands(),
      getAllOrigins(),
      getAllOSs(),
      takeWarehouseArea(),
      getAllROMs(),
      getAllRAMs(),
      getAllColors(),
    ]).then(([brands, origins, os, areas, roms, rams, colors]) => {
      setBrands(brands);
      setOrigins(origins);
      setOperatingSystems(os);
      setWarehouseAreas(areas?.data || []);
      setRoms(roms);
      setRams(rams);
      setColors(colors);
    });
  }, []);

  const handleProductChange = (e) => {
    const { name, value } = e.target;
    setProductData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setProductData((prev) => ({
        ...prev,
        image: file,
        imagePreview: URL.createObjectURL(file),
      }));
    }
  };

  const handleVersionChange = (index, field, value) => {
    const newVersions = [...versions];
    newVersions[index][field] = value;
    setVersions(newVersions);
  };

  const addVersion = () => {
    setVersions([
      ...versions,
      {
        productId: productData.productId,
        romId: "",
        ramId: "",
        colorId: "",
        importPrice: "",
        exportPrice: "",
      },
    ]);
  };

  const removeVersion = (index) => {
    if (versions.length > 1) {
      setVersions(versions.filter((_, i) => i !== index));
    }
  };

  const formatStorageDisplay = (value, type) => {
    if (!value) return "";
    const numValue = parseInt(value);
    return `${numValue}GB`;
  };

  const handleClearForm = () => {
    setShowClearConfirm(true);
  };

  const confirmClearForm = () => {
    clearStorage();
    setProductData({
      productId: null,
      productName: "",
      processor: "",
      battery: "",
      screenSize: "",
      chipset: "",
      rearCamera: "",
      frontCamera: "",
      warrantyPeriod: "",
      image: null,
      imagePreview: "",
      originId: "",
      operatingSystemId: "",
      warehouseAreaId: "",
      brandId: "",
    });
    setVersions([
      {
        productId: null,
        romId: "",
        ramId: "",
        colorId: "",
        importPrice: "",
        exportPrice: "",
      },
    ]);
    handleInitProduct(); // Get new product ID
    setShowClearConfirm(false);
    toast.success("✨ Đã xóa tất cả dữ liệu form!");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setApiError(null);

    try {
      const productPayload = {
        productId: productData.productId,
        productName: productData.productName,
        processor: productData.processor,
        battery: Number(productData.battery) || null,
        screenSize: Number(productData.screenSize) || null,
        chipset: productData.chipset,
        rearCamera: productData.rearCamera,
        frontCamera: productData.frontCamera,
        warrantyPeriod: Number(productData.warrantyPeriod) || null,
        brandId: Number(productData.brandId),
        originId: Number(productData.originId),
        operatingSystemId: Number(productData.operatingSystemId),
        warehouseAreaId: Number(productData.warehouseAreaId),
        status: true, // Mặc định là true
      };

      const cleanedVersions = versions.map((v) => ({
        romId: Number(v.romId),
        ramId: Number(v.ramId),
        colorId: Number(v.colorId),
        importPrice: Number(v.importPrice) || 0,
        exportPrice: Number(v.exportPrice) || 0,
        status: true, // Mặc đ��nh là true
      }));

      await createProductWithVersions(
        productPayload,
        cleanedVersions,
        productData.image
      );

      // Clear storage after successful submission
      clearStorage();

      // Show success toast notification
      toast.success("🎉 Tạo sản phẩm và phiên bản thành công!");
      
      if (onSuccess) onSuccess();
      
      // Close modal after a short delay
      setTimeout(() => {
        if (onClose) onClose();
      }, 1500);
    } catch (err) {
      // Show error toast notification
      toast.error(`❌ ${err.message || "Không thể tạo sản phẩm"}`);
      setApiError(err.message || "Không thể tạo sản phẩm.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleClose = () => {
    // Check if user has entered any data
    const hasData = productData.productName || versions.some(v => v.romId || v.ramId || v.colorId);
    
    if (hasData) {
      setShowCloseConfirm(true);
    } else {
      if (onClose) onClose();
    }
  };

  const confirmClose = (shouldSave) => {
    if (!shouldSave) {
      clearStorage();
    }
    setShowCloseConfirm(false);
    if (onClose) onClose();
  };

  return (
    <>
      <Transition appear show={true} as={Fragment}>
        <Dialog as="div" className="relative z-50" onClose={handleClose}>
          <Transition.Child
            as={Fragment}
            enter="ease-out duration-300"
            enterFrom="opacity-0"
            enterTo="opacity-100"
            leave="ease-in duration-200"
            leaveFrom="opacity-100"
            leaveTo="opacity-0"
          >
            <div className="fixed inset-0 bg-black bg-opacity-60 backdrop-blur-sm" />
          </Transition.Child>

          <div className="fixed inset-0 flex items-center justify-center p-4">
            <Transition.Child
              as={Fragment}
              enter="ease-out duration-300"
              enterFrom="opacity-0 scale-95"
              enterTo="opacity-100 scale-100"
              leave="ease-in duration-200"
              leaveFrom="opacity-100 scale-100"
              leaveTo="opacity-0 scale-95"
            >
              <Dialog.Panel className="bg-white rounded-2xl w-full max-w-6xl shadow-2xl overflow-hidden">
                {/* Header */}
                <div className="bg-gradient-to-r from-blue-600 to-purple-600 px-8 py-6">
                  <div className="flex justify-between items-center">
                    <div>
                      <Dialog.Title className="text-2xl font-bold text-white flex items-center">
                        <div className="w-8 h-8 bg-white bg-opacity-20 rounded-lg flex items-center justify-center mr-3">
                          <span className="text-white text-lg">+</span>
                        </div>
                        Tạo sản phẩm mới
                      </Dialog.Title>
                      <p className="text-blue-100 mt-1">Thêm sản phẩm và các phiên bản tương ứng</p>
                    </div>
                    
                    {/* Auto-save indicator and clear button */}
                    <div className="flex items-center gap-3">
                      <div className="flex items-center text-blue-100 text-sm">
                        <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M9 19l3 3m0 0l3-3m-3 3V10" />
                        </svg>
                        Tự động lưu
                      </div>
                      <button
                        onClick={handleClearForm}
                        className="bg-white bg-opacity-20 hover:bg-opacity-30 text-white px-3 py-1 rounded-lg text-sm transition-all"
                        title="Xóa tất cả dữ liệu"
                      >
                        🗑️ Xóa form
                      </button>
                    </div>
                  </div>
                </div>

                <div className="max-h-[80vh] overflow-y-auto">
                  <div className="px-8 py-6">
                    {/* Restore notification */}
                    {showRestoreNotification && (
                      <div className="bg-blue-50 border-l-4 border-blue-400 p-4 mb-6 rounded-r-lg">
                        <div className="flex items-center">
                          <svg className="w-5 h-5 text-blue-400 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                          </svg>
                          <p className="text-blue-700 font-medium">
                            Dữ liệu form đã được khôi phục từ lần trước. Bạn có thể tiếp tục chỉnh sửa.
                          </p>
                          <button
                            onClick={() => setShowRestoreNotification(false)}
                            className="ml-auto text-blue-400 hover:text-blue-600"
                          >
                            ✕
                          </button>
                        </div>
                      </div>
                    )}

                    {apiError && (
                      <div className="bg-red-50 border-l-4 border-red-400 p-4 mb-6 rounded-r-lg">
                        <p className="text-red-700 font-medium">{apiError}</p>
                      </div>
                    )}
                    {successMessage && (
                      <div className="bg-green-50 border-l-4 border-green-400 p-4 mb-6 rounded-r-lg">
                        <p className="text-green-700 font-medium">{successMessage}</p>
                      </div>
                    )}

                    <form onSubmit={handleSubmit} className="space-y-8">
                      {/* Product ID */}
                      <div className="bg-gray-50 rounded-xl p-6">
                        <FormInput
                          label="Mã sản phẩm (ID)"
                          name="productId"
                          value={productData.productId || ""}
                          readOnly={true}
                          placeholder="ID sẽ được tự động tạo"
                        />
                      </div>

                      {/* Basic Information */}
                      <div className="bg-white border border-gray-200 rounded-xl p-6">
                        <h3 className="text-lg font-semibold text-gray-800 mb-6 flex items-center">
                          <div className="w-2 h-6 bg-blue-500 rounded-full mr-3"></div>
                          Thông tin cơ bản
                        </h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                          <FormInput
                            label="Tên sản phẩm"
                            name="productName"
                            value={productData.productName}
                            onChange={handleProductChange}
                            placeholder="Nhập tên sản phẩm"
                          />
                          <FormInput
                            label="Vi xử lý"
                            name="processor"
                            value={productData.processor}
                            onChange={handleProductChange}
                            placeholder="Ví dụ: Snapdragon 8 Gen 2"
                          />
                          <FormInput
                            label="Dung lượng pin"
                            name="battery"
                            value={productData.battery}
                            onChange={handleProductChange}
                            type="number"
                            placeholder="5000"
                            unit="mAh"
                          />
                          <FormInput
                            label="Kích thước màn hình"
                            name="screenSize"
                            value={productData.screenSize}
                            onChange={handleProductChange}
                            type="number"
                            step="0.1"
                            placeholder="6.7"
                            unit="inch"
                          />
                          <FormInput
                            label="Tần số quét màn hình"
                            name="chipset"
                            value={productData.chipset}
                            onChange={handleProductChange}
                            type="number"
                            placeholder="120"
                            unit="Hz"
                          />
                          <FormInput
                            label="Camera sau"
                            name="rearCamera"
                            value={productData.rearCamera}
                            onChange={handleProductChange}
                            placeholder="50MP + 12MP + 12MP"
                            unit="MP"
                          />
                          <FormInput
                            label="Camera trước"
                            name="frontCamera"
                            value={productData.frontCamera}
                            onChange={handleProductChange}
                            placeholder="32MP"
                            unit="MP"
                          />
                          <FormInput
                            label="Thời gian bảo hành"
                            name="warrantyPeriod"
                            value={productData.warrantyPeriod}
                            onChange={handleProductChange}
                            type="number"
                            placeholder="12"
                            unit="tháng"
                          />
                        </div>
                      </div>

                      {/* Attributes */}
                      <div className="bg-white border border-gray-200 rounded-xl p-6">
                        <h3 className="text-lg font-semibold text-gray-800 mb-6 flex items-center">
                          <div className="w-2 h-6 bg-green-500 rounded-full mr-3"></div>
                          Thuộc tính sản phẩm
                        </h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                          <FormSelect
                            label="Thương hiệu"
                            name="brandId"
                            value={productData.brandId}
                            onChange={handleProductChange}
                            options={brands}
                            getId={(b) => b.idBrand}
                            getName={(b) => b.brandName}
                            placeholder="Chọn thương hiệu"
                          />
                          <FormSelect
                            label="Xuất xứ"
                            name="originId"
                            value={productData.originId}
                            onChange={handleProductChange}
                            options={origins}
                            getId={(o) => o.id}
                            getName={(o) => o.name}
                            placeholder="Chọn xuất xứ"
                          />
                          <FormSelect
                            label="Hệ điều hành"
                            name="operatingSystemId"
                            value={productData.operatingSystemId}
                            onChange={handleProductChange}
                            options={operatingSystems}
                            getId={(o) => o.id}
                            getName={(o) => o.name}
                            placeholder="Chọn hệ điều hành"
                          />
                          <FormSelect
                            label="Khu vực kho"
                            name="warehouseAreaId"
                            value={productData.warehouseAreaId}
                            onChange={handleProductChange}
                            options={warehouseAreas}
                            getId={(w) => w.id}
                            getName={(w) => w.name}
                            placeholder="Chọn khu vực kho"
                          />
                        </div>
                      </div>

                      {/* Image Upload */}
                      <div className="bg-white border border-gray-200 rounded-xl p-6">
                        <h3 className="text-lg font-semibold text-gray-800 mb-6 flex items-center">
                          <div className="w-2 h-6 bg-purple-500 rounded-full mr-3"></div>
                          Hình ảnh sản phẩm
                        </h3>
                        <div className="flex items-start space-x-6">
                          <div className="flex-1">
                            <input
                              type="file"
                              accept="image/*"
                              onChange={handleImageChange}
                              className="w-full px-4 py-3 border-2 border-dashed border-gray-300 rounded-xl text-gray-600 hover:border-gray-400 transition-colors file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
                            />
                          </div>
                          {productData.imagePreview && (
                            <div className="w-24 h-24 border-2 border-gray-200 rounded-xl overflow-hidden">
                              <img
                                src={productData.imagePreview}
                                alt="preview"
                                className="w-full h-full object-cover"
                              />
                            </div>
                          )}
                        </div>
                      </div>

                      {/* Product Versions Table */}
                      <div className="bg-white border border-gray-200 rounded-xl p-6">
                        <div className="flex justify-between items-center mb-6">
                          <h3 className="text-lg font-semibold text-gray-800 flex items-center">
                            <div className="w-2 h-6 bg-orange-500 rounded-full mr-3"></div>
                            Danh sách phiên bản
                          </h3>
                          <Button
                            onClick={addVersion}
                            type="button"
                            className="bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white px-4 py-2 rounded-lg transition-all shadow-md hover:shadow-lg"
                          >
                            + Thêm phiên bản
                          </Button>
                        </div>

                        <div className="overflow-x-auto">
                          <table className="w-full border-collapse">
                            <thead>
                              <tr className="bg-gray-50">
                                <th className="border border-gray-200 px-4 py-3 text-left text-sm font-semibold text-gray-700">
                                  STT
                                </th>
                                <th className="border border-gray-200 px-4 py-3 text-left text-sm font-semibold text-gray-700">
                                  Bộ nhớ trong (GB)
                                </th>
                                <th className="border border-gray-200 px-4 py-3 text-left text-sm font-semibold text-gray-700">
                                  RAM (GB)
                                </th>
                                <th className="border border-gray-200 px-4 py-3 text-left text-sm font-semibold text-gray-700">
                                  Màu sắc
                                </th>
                                <th className="border border-gray-200 px-4 py-3 text-left text-sm font-semibold text-gray-700">
                                  Giá nhập (VNĐ)
                                </th>
                                <th className="border border-gray-200 px-4 py-3 text-left text-sm font-semibold text-gray-700">
                                  Giá xuất (VNĐ)
                                </th>
                                <th className="border border-gray-200 px-4 py-3 text-center text-sm font-semibold text-gray-700">
                                  Thao tác
                                </th>
                              </tr>
                            </thead>
                            <tbody>
                              {versions.map((version, index) => (
                                <tr key={index} className="hover:bg-gray-50">
                                  <td className="border border-gray-200 px-4 py-3 text-center font-medium">
                                    {index + 1}
                                  </td>
                                  <td className="border border-gray-200 px-4 py-3">
                                    <select
                                      value={version.romId}
                                      onChange={(e) => handleVersionChange(index, 'romId', e.target.value)}
                                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                    >
                                      <option value="">ROM</option>
                                      {roms.map((rom) => (
                                        <option key={rom.rom_id} value={rom.rom_id}>
                                          {formatStorageDisplay(rom.rom_size)}
                                        </option>
                                      ))}
                                    </select>
                                  </td>
                                  <td className="border border-gray-200 px-4 py-3">
                                    <select
                                      value={version.ramId}
                                      onChange={(e) => handleVersionChange(index, 'ramId', e.target.value)}
                                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                    >
                                      <option value="">RAM</option>
                                      {rams.map((ram) => (
                                        <option key={ram.ram_id} value={ram.ram_id}>
                                          {formatStorageDisplay(ram.name)}
                                        </option>
                                      ))}
                                    </select>
                                  </td>
                                  <td className="border border-gray-200 px-4 py-3">
                                    <select
                                      value={version.colorId}
                                      onChange={(e) => handleVersionChange(index, 'colorId', e.target.value)}
                                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                    >
                                      <option value="">Màu</option>
                                      {colors.map((color) => (
                                        <option key={color.id} value={color.id}>
                                          {color.name}
                                        </option>
                                      ))}
                                    </select>
                                  </td>
                                  <td className="border border-gray-200 px-4 py-3">
                                    <input
                                      type="number"
                                      value={version.importPrice}
                                      onChange={(e) => handleVersionChange(index, 'importPrice', e.target.value)}
                                      placeholder="0"
                                      min="0"
                                      step="1000"
                                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                    />
                                  </td>
                                  <td className="border border-gray-200 px-4 py-3">
                                    <input
                                      type="number"
                                      value={version.exportPrice}
                                      onChange={(e) => handleVersionChange(index, 'exportPrice', e.target.value)}
                                      placeholder="0"
                                      min="0"
                                      step="1000"
                                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                    />
                                  </td>
                                  <td className="border border-gray-200 px-4 py-3 text-center">
                                    {versions.length > 1 && (
                                      <button
                                        type="button"
                                        onClick={() => removeVersion(index)}
                                        className="text-red-500 hover:text-red-700 bg-red-50 hover:bg-red-100 p-2 rounded-lg transition-colors"
                                        title="Xóa phiên bản"
                                      >
                                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                        </svg>
                                      </button>
                                    )}
                                  </td>
                                </tr>
                              ))}
                            </tbody>
                          </table>
                        </div>
                      </div>

                      {/* Action Buttons */}
                      <div className="flex justify-end gap-4 pt-6 border-t border-gray-200">
                        <Button
                          onClick={handleClose}
                          type="button"
                          className="px-6 py-3 bg-gray-500 hover:bg-gray-600 text-white rounded-xl transition-colors shadow-md hover:shadow-lg"
                        >
                          Hủy bỏ
                        </Button>
                        <Button
                          type="submit"
                          className="px-8 py-3 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white rounded-xl transition-all shadow-md hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
                          disabled={isSubmitting}
                        >
                          {isSubmitting ? (
                            <div className="flex items-center">
                              <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                              </svg>
                              Đang lưu...
                            </div>
                          ) : (
                            "Tạo sản phẩm"
                          )}
                        </Button>
                      </div>
                    </form>
                  </div>
                </div>
              </Dialog.Panel>
            </Transition.Child>
          </div>
        </Dialog>
      </Transition>

      {/* Clear Form Confirmation Modal */}
      <ConfirmationModal
        isOpen={showClearConfirm}
        onClose={() => setShowClearConfirm(false)}
        onConfirm={confirmClearForm}
        title="Xóa tất cả dữ liệu"
        message="Bạn có chắc chắn muốn xóa tất cả dữ liệu đã nhập? Hành động này không thể hoàn tác."
        confirmText="Xóa tất cả"
        cancelText="Hủy"
        type="danger"
      />

      {/* Close Confirmation Modal */}
      <ConfirmationModal
        isOpen={showCloseConfirm}
        onClose={() => setShowCloseConfirm(false)}
        onConfirm={() => confirmClose(true)}
        title="Lưu dữ liệu trước khi đóng?"
        message="Bạn có muốn lưu dữ liệu đã nhập để tiếp tục lần sau không? Chọn 'Lưu và đóng' để giữ lại dữ liệu. Chọn 'Không lưu' để xóa dữ liệu"
        confirmText="Lưu và đóng"
        cancelText="Không lưu"
        type="info"
      />

      {/* Additional option for close confirmation */}
      {showCloseConfirm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          <div className="absolute inset-0 bg-black bg-opacity-25" />
          <div className="relative bg-white rounded-2xl p-6 max-w-md mx-4 shadow-xl">
            <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            
            <h3 className="text-lg font-medium text-gray-900 text-center mb-2">
              Lưu dữ liệu trước khi đóng?
            </h3>
            
            <p className="text-sm text-gray-500 text-center mb-6">
              Bạn có muốn lưu dữ liệu đã nhập để tiếp tục lần sau không?
            </p>

            <div className="flex gap-2 justify-center">
              <button
                onClick={() => confirmClose(false)}
                className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50"
              >
                Không lưu
              </button>
              <button
                onClick={() => setShowCloseConfirm(false)}
                className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50"
              >
                Hủy
              </button>
              <button
                onClick={() => confirmClose(true)}
                className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700"
              >
                Lưu và đóng
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default AddProductWithVersionsModal;