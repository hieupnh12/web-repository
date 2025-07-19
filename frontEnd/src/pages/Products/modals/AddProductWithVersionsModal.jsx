import React, { useState, useEffect, Fragment } from "react";
import { Dialog, Transition } from "@headlessui/react";
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
}) => (
  <div>
    <label className="block text-sm font-medium text-gray-700 mb-1">
      {label}
    </label>
    <input
      type={type}
      name={name}
      value={value ?? ""}
      onChange={onChange}
      readOnly={readOnly}
      className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring ${
        error ? "border-red-500" : "border-gray-300"
      }`}
    />
    {error && <p className="text-red-500 text-sm mt-1">{error}</p>}
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
}) => (
  <div>
    <label className="block text-sm font-medium text-gray-700 mb-1">
      {label}
    </label>
    <select
      name={name}
      value={value}
      onChange={onChange}
      className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring ${
        error ? "border-red-500" : "border-gray-300"
      }`}
    >
      <option value="">-- Chọn --</option>
      {options.map((opt) => (
        <option key={getId(opt)} value={getId(opt)}>
          {getName(opt)}
        </option>
      ))}
    </select>
    {error && <p className="text-red-500 text-sm mt-1">{error}</p>}
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
    status: true,
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
      status: true,
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
  console.log("aa", productData);

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
      // initProduct(),
    ]).then(([brands, origins, os, areas, roms, rams, colors, initRes]) => {
      setBrands(brands);
      setOrigins(origins);
      setOperatingSystems(os);
      setWarehouseAreas(areas?.data || []);
      setRoms(roms);
      setRams(rams);
      setColors(colors);
      // setProductData((prev) => ({ ...prev, productId: initRes?.productId }));
    });
  }, []);
  const handleProductChange = (e) => {
    const { name, value, type, checked } = e.target;
    setProductData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
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

  const handleVersionChange = (index, e) => {
    const { name, value, type, checked } = e.target;
    const newVersions = [...versions];
    newVersions[index][name] = type === "checkbox" ? checked : value;
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
        status: true,
      },
    ]);
  };
  console.log("👉ccc:", versions);

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
        status: productData.status,
      };

      const cleanedVersions = versions.map((v) => ({
        romId: Number(v.romId),
        ramId: Number(v.ramId),
        colorId: Number(v.colorId),
        importPrice: Number(v.importPrice),
        exportPrice: Number(v.exportPrice),
        status: v.status,
      }));

      await createProductWithVersions(
        productPayload,
        cleanedVersions,
        productData.image
      );

      setSuccessMessage("Tạo sản phẩm và phiên bản thành công!");
      if (onSuccess) onSuccess();
      setTimeout(() => onClose && onClose(), 3000);
    } catch (err) {
      setApiError(err.message || "Không thể tạo sản phẩm.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Transition appear show={true} as={Fragment}>
      <Dialog as="div" className="relative z-50" onClose={onClose}>
        <Transition.Child as={Fragment}>
          <div className="fixed inset-0 bg-black bg-opacity-50 backdrop-blur-sm" />
        </Transition.Child>

        <div className="fixed inset-0 flex items-center justify-center p-4">
          <Dialog.Panel className="bg-white rounded-xl w-full max-w-5xl p-6 shadow-2xl overflow-y-auto max-h-[90vh]">
            <Dialog.Title className="text-xl font-semibold mb-4">
              Tạo sản phẩm kèm phiên bản
            </Dialog.Title>
            {apiError && <p className="text-red-500 mb-3">{apiError}</p>}
            {successMessage && (
              <p className="text-green-600 mb-3">{successMessage}</p>
            )}

            <form onSubmit={handleSubmit} className="space-y-6">
              <FormInput
                label="Mã sản phẩm (ID)"
                name="productId"
                value={productData.productId || ""}
                readOnly={true}
              />
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <FormInput
                  label="Tên sản phẩm"
                  name="productName"
                  value={productData.productName}
                  onChange={handleProductChange}
                />
                <FormInput
                  label="Vi xử lý"
                  name="processor"
                  value={productData.processor}
                  onChange={handleProductChange}
                />
                <FormInput
                  label="Pin"
                  name="battery"
                  value={productData.battery}
                  onChange={handleProductChange}
                  type="number"
                />
                <FormInput
                  label="Màn hình"
                  name="screenSize"
                  value={productData.screenSize}
                  onChange={handleProductChange}
                  type="number"
                />
                <FormInput
                  label="Chipset"
                  name="chipset"
                  value={productData.chipset}
                  onChange={handleProductChange}
                />
                <FormInput
                  label="Camera sau"
                  name="rearCamera"
                  value={productData.rearCamera}
                  onChange={handleProductChange}
                />
                <FormInput
                  label="Camera trước"
                  name="frontCamera"
                  value={productData.frontCamera}
                  onChange={handleProductChange}
                />
                <FormInput
                  label="Bảo hành (tháng)"
                  name="warrantyPeriod"
                  value={productData.warrantyPeriod}
                  onChange={handleProductChange}
                  type="number"
                />
                <FormSelect
                  label="Thương hiệu"
                  name="brandId"
                  value={productData.brandId}
                  onChange={handleProductChange}
                  options={brands}
                  getId={(b) => b.idBrand}
                  getName={(b) => b.brandName}
                />
                <FormSelect
                  label="Xuất xứ"
                  name="originId"
                  value={productData.originId}
                  onChange={handleProductChange}
                  options={origins}
                  getId={(o) => o.id}
                  getName={(o) => o.name}
                />
                <FormSelect
                  label="Hệ điều hành"
                  name="operatingSystemId"
                  value={productData.operatingSystemId}
                  onChange={handleProductChange}
                  options={operatingSystems}
                  getId={(o) => o.id}
                  getName={(o) => o.name}
                />
                <FormSelect
                  label="Khu vực kho"
                  name="warehouseAreaId"
                  value={productData.warehouseAreaId}
                  onChange={handleProductChange}
                  options={warehouseAreas}
                  getId={(w) => w.id}
                  getName={(w) => w.name}
                />
              </div>

              <div className="mt-4">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Trạng thái
                </label>
                <input
                  type="checkbox"
                  name="status"
                  checked={productData.status}
                  onChange={handleProductChange}
                />
              </div>

              <div className="mt-4">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Ảnh sản phẩm
                </label>
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleImageChange}
                />
                {productData.imagePreview && (
                  <img
                    src={productData.imagePreview}
                    alt="preview"
                    className="w-24 mt-2"
                  />
                )}
              </div>

              <div className="mt-8 border-t pt-6">
                <h3 className="text-lg font-medium mb-4">
                  Danh sách phiên bản
                </h3>
                {versions.map((version, index) => (
                  <div
                    key={index}
                    className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6"
                  >
                    <FormSelect
                      label="ROM"
                      name="romId"
                      value={version.romId}
                      onChange={(e) => handleVersionChange(index, e)}
                      options={roms}
                      getId={(r) => r.rom_id}
                      getName={(r) => r.rom_size}
                    />
                    <FormSelect
                      label="RAM"
                      name="ramId"
                      value={version.ramId}
                      onChange={(e) => handleVersionChange(index, e)}
                      options={rams}
                      getId={(r) => r.ram_id}
                      getName={(r) => r.name}
                    />
                    <FormSelect
                      label="Màu sắc"
                      name="colorId"
                      value={version.colorId}
                      onChange={(e) => handleVersionChange(index, e)}
                      options={colors}
                      getId={(c) => c.id}
                      getName={(c) => c.name}
                    />
                    <FormInput
                      label="Giá nhập"
                      name="importPrice"
                      value={version.importPrice}
                      onChange={(e) => handleVersionChange(index, e)}
                      type="number"
                    />
                    <FormInput
                      label="Giá bán"
                      name="exportPrice"
                      value={version.exportPrice}
                      onChange={(e) => handleVersionChange(index, e)}
                      type="number"
                    />
                    <div className="flex items-center mt-6">
                      <input
                        type="checkbox"
                        name="status"
                        checked={version.status}
                        onChange={(e) => handleVersionChange(index, e)}
                      />
                      <span className="ml-2">Trạng thái</span>
                    </div>
                  </div>
                ))}
                <Button
                  onClick={addVersion}
                  type="button"
                  className="bg-green-500 text-white"
                >
                  + Thêm phiên bản
                </Button>
              </div>

              <div className="flex justify-end gap-4 pt-6">
                <Button
                  onClick={onClose}
                  type="button"
                  className="bg-gray-500 text-white"
                >
                  Hủy
                </Button>
                <Button
                  type="submit"
                  className="bg-blue-600 text-white"
                  disabled={isSubmitting}
                >
                  {isSubmitting ? "Đang lưu..." : "Lưu sản phẩm & phiên bản"}
                </Button>
              </div>
            </form>
          </Dialog.Panel>
        </div>
      </Dialog>
    </Transition>
  );
};

export default AddProductWithVersionsModal;
