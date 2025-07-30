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

const AddProductWithVersionsModal = ({ onSuccess, onClose }) => {
  const [productData, setProductData] = useState({
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

  const [versions, setVersions] = useState([
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
    handleInitProduct();
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
        status: true, // Mặc định là true
      }));

      await createProductWithVersions(
        productPayload,
        cleanedVersions,
        productData.image
      );

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
                <Dialog.Title className="text-2xl font-bold text-white flex items-center">
                  <div className="w-8 h-8 bg-white bg-opacity-20 rounded-lg flex items-center justify-center mr-3">
                    <span className="text-white text-lg">+</span>
                  </div>
                  Tạo sản phẩm mới
                </Dialog.Title>
                <p className="text-blue-100 mt-1">Thêm sản phẩm và các phiên bản tương ứng</p>
              </div>

              <div className="max-h-[80vh] overflow-y-auto">
                <div className="px-8 py-6">
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
                                    <option value="">Chọn ROM</option>
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
                                    <option value="">Chọn RAM</option>
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
                                    <option value="">Chọn màu</option>
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
                        onClick={onClose}
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
  );
};

export default AddProductWithVersionsModal;