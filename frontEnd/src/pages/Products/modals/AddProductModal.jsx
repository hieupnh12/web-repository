import React, { useState, useEffect, Fragment } from "react";
import { Dialog, Transition } from "@headlessui/react";
import { XMarkIcon, PhotoIcon } from "@heroicons/react/24/outline";
import Button from "../../../components/ui/Button";
import {
  initProduct,
  updateProduct,
  uploadProductImage,
} from "../../../services/productService";
import {getAllBrands,
  getAllOrigins,
  getAllOSs,
} from "../../../services/attributeService";
import {takeWarehouseArea,} from "../../../services/storage";

const FormInput = ({ label, name, type = "text", value, onChange, error, unit, placeholder }) => (
  <div className="space-y-2">
    <label className="block text-sm font-semibold text-gray-800">
      {label}
      {unit && <span className="text-gray-500 font-normal ml-1">({unit})</span>}
    </label>
    <div className="relative">
      <input
        type={type}
        name={name}
        value={value ?? ""}
        onChange={onChange}
        placeholder={placeholder}
        className={`w-full px-4 py-3 border-2 rounded-xl transition-all duration-200 focus:outline-none focus:ring-2 ${
          error 
            ? "border-red-300 focus:border-red-500 focus:ring-red-200" 
            : "border-gray-200 focus:border-blue-500 focus:ring-blue-200 hover:border-gray-300"
        }`}
      />
      {unit && (
        <span className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 text-sm">
          {unit}
        </span>
      )}
    </div>
    {error && <p className="text-red-500 text-xs font-medium flex items-center gap-1">
      <span className="w-1 h-1 bg-red-500 rounded-full"></span>
      {error}
    </p>}
  </div>
);

const FormSelect = ({ label, name, value, onChange, options, getId, getName, error, placeholder }) => (
  <div className="space-y-2">
    <label className="block text-sm font-semibold text-gray-800">{label}</label>
    <select
      name={name}
      value={value}
      onChange={onChange}
      className={`w-full px-4 py-3 border-2 rounded-xl transition-all duration-200 focus:outline-none focus:ring-2 appearance-none bg-white ${
        error 
          ? "border-red-300 focus:border-red-500 focus:ring-red-200" 
          : "border-gray-200 focus:border-blue-500 focus:ring-blue-200 hover:border-gray-300"
      }`}
    >
      <option value="">{placeholder || "-- Chọn --"}</option>
      {options.map((opt) => (
        <option key={getId(opt)} value={getId(opt)}>
          {getName(opt)}
        </option>
      ))}
    </select>
    {error && <p className="text-red-500 text-xs font-medium flex items-center gap-1">
      <span className="w-1 h-1 bg-red-500 rounded-full"></span>
      {error}
    </p>}
  </div>
);

const AddProduct = ({ onSuccess, onClose }) => {
  const [formData, setFormData] = useState({
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
    origin: null,
    operatingSystem: null,
    warehouseArea: null,
    brand: null,
  });

  const [brands, setBrands] = useState([]);
  const [origins, setOrigins] = useState([]);
  const [operatingSystems, setOperatingSystems] = useState([]);
  const [warehouseAreas, setWarehouseAreas] = useState([]);

  const [errors, setErrors] = useState({});
  const [apiError, setApiError] = useState(null);
  const [successMessage, setSuccessMessage] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    Promise.all([
      getAllBrands(),
      getAllOrigins(),
      getAllOSs(),
      takeWarehouseArea(),
    ]).then(([brands, origins, os, areas]) => {
      setBrands(brands);
      setOrigins(origins);
      setOperatingSystems(os);
      setWarehouseAreas(areas?.data || []);
    });
  }, []);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: "" }));
    }
  };

  const handleSelectChange = (e) => {
    const { name, value } = e.target;
    const map = {
      origin: origins,
      operatingSystem: operatingSystems,
      warehouseArea: warehouseAreas,
      brand: brands,
    };
    const item = map[name]?.find((o) => String(o.id || o.idBrand) === value);
    setFormData((prev) => ({ ...prev, [name]: item || null }));
    // Clear error when user selects
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: "" }));
    }
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setFormData((prev) => ({
        ...prev,
        image: file,
        imagePreview: URL.createObjectURL(file),
      }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const newErrors = {};
    if (!formData.productName) newErrors.productName = "Tên sản phẩm là bắt buộc";
    if (!formData.processor) newErrors.processor = "Vi xử lý sản phẩm là bắt buộc";
    if (!formData.brand?.idBrand) newErrors.brand = "Thương hiệu sản phẩm là bắt buộc";
    if (!formData.origin?.id) newErrors.origin = "Xuất xứ sản phẩm là bắt buộc";
    if (!formData.operatingSystem?.id) newErrors.operatingSystem = "Hệ điều hành là bắt buộc";
    if (!formData.warehouseArea?.id) newErrors.warehouseArea = "Khu vực kho là bắt buộc";

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    setIsSubmitting(true);
    setApiError(null);
    try {
      const initRes = await initProduct();
      const productId = initRes?.productId;
      if (!productId) throw new Error("Không khởi tạo được sản phẩm");

      const payload = {
        productName: formData.productName,
        processor: formData.processor,
        battery: Number(formData.battery) || null,
        screenSize: Number(formData.screenSize) || null,
        chipset: formData.chipset ? `${formData.chipset}Hz` : null, // Auto add Hz unit
        rearCamera: formData.rearCamera,
        frontCamera: formData.frontCamera,
        warrantyPeriod: Number(formData.warrantyPeriod) || null,
        brandId: formData.brand?.idBrand,
        originId: formData.origin?.id,
        operatingSystemId: formData.operatingSystem?.id,
        warehouseAreaId: formData.warehouseArea?.id,
        status: true, // Always active by default
      };

      await updateProduct(productId, payload);

      if (formData.image) {
        await uploadProductImage(productId, formData.image);
      }

      setSuccessMessage("Sản phẩm đã được thêm thành công!");
      if (onSuccess) onSuccess(productId);
      setTimeout(() => onClose && onClose(), 2000);
    } catch (err) {
      setApiError(err.message || "Không thể thêm sản phẩm.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Transition appear show={true} as={Fragment}>
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
          <div className="fixed inset-0 bg-black/60 backdrop-blur-sm" />
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
            <Dialog.Panel className="bg-white rounded-2xl w-full max-w-4xl shadow-2xl overflow-hidden">
              {/* Header */}
              <div className="bg-gradient-to-r from-blue-600 to-purple-600 px-6 py-4 flex items-center justify-between">
                <Dialog.Title className="text-xl font-bold text-white flex items-center gap-2">
                  <div className="w-2 h-2 bg-white rounded-full"></div>
                  Thêm sản phẩm mới
                </Dialog.Title>
                <button
                  onClick={onClose}
                  className="text-white hover:bg-white/20 rounded-full p-2 transition-colors"
                >
                  <XMarkIcon className="w-5 h-5" />
                </button>
              </div>

              {/* Body */}
              <div className="p-6 max-h-[calc(90vh-80px)] overflow-y-auto">
                {/* Alert Messages */}
                {apiError && (
                  <div className="mb-4 p-4 bg-red-50 border-l-4 border-red-500 rounded-r-lg">
                    <p className="text-red-700 font-medium">{apiError}</p>
                  </div>
                )}
                {successMessage && (
                  <div className="mb-4 p-4 bg-green-50 border-l-4 border-green-500 rounded-r-lg">
                    <p className="text-green-700 font-medium">{successMessage}</p>
                  </div>
                )}

                <form onSubmit={handleSubmit} className="space-y-8">
                  {/* Basic Information */}
                  <div className="bg-gray-50 rounded-xl p-6">
                    <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2">
                      <span className="w-2 h-2 bg-blue-500 rounded-full"></span>
                      Thông tin cơ bản
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <FormInput 
                        label="Tên sản phẩm" 
                        name="productName" 
                        value={formData.productName} 
                        onChange={handleChange} 
                        error={errors.productName}
                        placeholder="Nhập tên sản phẩm"
                      />
                      <FormInput 
                        label="Vi xử lý" 
                        name="processor" 
                        value={formData.processor} 
                        onChange={handleChange} 
                        error={errors.processor}
                        placeholder="Ví dụ: Snapdragon 8 Gen 2"
                      />
                    </div>
                  </div>

                  {/* Technical Specifications */}
                  <div className="bg-gray-50 rounded-xl p-6">
                    <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2">
                      <span className="w-2 h-2 bg-green-500 rounded-full"></span>
                      Thông số kỹ thuật
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                      <FormInput 
                        label="Pin" 
                        name="battery" 
                        value={formData.battery} 
                        onChange={handleChange} 
                        type="number"
                        unit="mAh"
                        placeholder="5000"
                      />
                      <FormInput 
                        label="Màn hình" 
                        name="screenSize" 
                        value={formData.screenSize} 
                        onChange={handleChange} 
                        type="number"
                        unit="inch"
                        placeholder="6.7"
                        step="0.1"
                      />
                      <FormInput 
                        label="Tần số quét màn hình" 
                        name="chipset" 
                        value={formData.chipset} 
                        onChange={handleChange}
                        type="number"
                        unit="Hz"
                        placeholder="120"
                      />
                      <FormInput 
                        label="Camera sau" 
                        name="rearCamera" 
                        value={formData.rearCamera} 
                        onChange={handleChange}
                        unit="MP"
                        placeholder="108MP + 12MP + 5MP"
                      />
                      <FormInput 
                        label="Camera trước" 
                        name="frontCamera" 
                        value={formData.frontCamera} 
                        onChange={handleChange}
                        unit="MP"
                        placeholder="32MP"
                      />
                      <FormInput 
                        label="Bảo hành" 
                        name="warrantyPeriod" 
                        value={formData.warrantyPeriod} 
                        onChange={handleChange} 
                        type="number"
                        unit="tháng"
                        placeholder="12"
                      />
                    </div>
                  </div>

                  {/* Product Attributes */}
                  <div className="bg-gray-50 rounded-xl p-6">
                    <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2">
                      <span className="w-2 h-2 bg-purple-500 rounded-full"></span>
                      Thuộc tính sản phẩm
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <FormSelect 
                        label="Thương hiệu" 
                        name="brand" 
                        value={formData.brand?.idBrand || ""} 
                        onChange={handleSelectChange} 
                        options={brands} 
                        getId={(b) => b.idBrand} 
                        getName={(b) => b.brandName} 
                        error={errors.brand}
                        placeholder="Chọn thương hiệu"
                      />
                      <FormSelect 
                        label="Xuất xứ" 
                        name="origin" 
                        value={formData.origin?.id || ""} 
                        onChange={handleSelectChange} 
                        options={origins} 
                        getId={(o) => o.id} 
                        getName={(o) => o.name} 
                        error={errors.origin}
                        placeholder="Chọn xuất xứ"
                      />
                      <FormSelect 
                        label="Hệ điều hành" 
                        name="operatingSystem" 
                        value={formData.operatingSystem?.id || ""} 
                        onChange={handleSelectChange} 
                        options={operatingSystems} 
                        getId={(o) => o.id} 
                        getName={(o) => o.name} 
                        error={errors.operatingSystem}
                        placeholder="Chọn hệ điều hành"
                      />
                      <FormSelect 
                        label="Khu vực kho" 
                        name="warehouseArea" 
                        value={formData.warehouseArea?.id || ""} 
                        onChange={handleSelectChange} 
                        options={warehouseAreas} 
                        getId={(w) => w.id} 
                        getName={(w) => w.name} 
                        error={errors.warehouseArea}
                        placeholder="Chọn khu vực kho"
                      />
                    </div>
                  </div>

                  {/* Image Upload */}
                  <div className="bg-gray-50 rounded-xl p-6">
                    <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2">
                      <span className="w-2 h-2 bg-orange-500 rounded-full"></span>
                      Hình ảnh sản phẩm
                    </h3>
                    <div className="flex items-center gap-6">
                      <div className="relative">
                        <input 
                          type="file" 
                          accept="image/*" 
                          onChange={handleImageChange}
                          className="hidden"
                          id="image-upload"
                        />
                        <label 
                          htmlFor="image-upload"
                          className="flex flex-col items-center justify-center w-32 h-32 border-2 border-dashed border-gray-300 rounded-xl cursor-pointer hover:border-blue-500 hover:bg-blue-50 transition-colors"
                        >
                          {formData.imagePreview ? (
                            <img 
                              src={formData.imagePreview} 
                              alt="preview" 
                              className="w-full h-full object-cover rounded-xl"
                            />
                          ) : (
                            <>
                              <PhotoIcon className="w-8 h-8 text-gray-400 mb-2" />
                              <span className="text-sm text-gray-500 text-center">Tải ảnh lên</span>
                            </>
                          )}
                        </label>
                      </div>
                      {formData.imagePreview && (
                        <div className="flex-1">
                          <p className="text-sm text-gray-600 mb-2">Ảnh đã chọn:</p>
                          <p className="text-sm font-medium text-gray-800">{formData.image?.name}</p>
                          <button
                            type="button"
                            onClick={() => setFormData(prev => ({ ...prev, image: null, imagePreview: "" }))}
                            className="text-red-500 text-sm hover:text-red-700 mt-2"
                          >
                            Xóa ảnh
                          </button>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Action Buttons */}
                  <div className="flex justify-end gap-4 pt-6 border-t border-gray-200">
                    <Button 
                      onClick={onClose} 
                      type="button" 
                      className="px-6 py-3 bg-gray-100 text-gray-700 rounded-xl hover:bg-gray-200 transition-colors font-medium"
                    >
                      Hủy bỏ
                    </Button>
                    <Button 
                      type="submit" 
                      className="px-8 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-xl hover:from-blue-700 hover:to-purple-700 transition-all duration-200 font-medium shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed" 
                      disabled={isSubmitting}
                    >
                      {isSubmitting ? (
                        <div className="flex items-center gap-2">
                          <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                          Đang lưu...
                        </div>
                      ) : (
                        "Lưu sản phẩm"
                      )}
                    </Button>
                  </div>
                </form>
              </div>
            </Dialog.Panel>
          </Transition.Child>
        </div>
      </Dialog>
    </Transition>
  );
};

export default AddProduct;