import React, { useState, useEffect, Fragment } from "react";
import { Dialog, Transition } from "@headlessui/react";
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


const FormInput = ({ label, name, type = "text", value, onChange, error }) => (
  <div>
    <label className="block text-sm font-medium text-gray-700 mb-1">{label}</label>
    <input
      type={type}
      name={name}
      value={value ?? ""}
      onChange={onChange}
      className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring ${
        error ? "border-red-500" : "border-gray-300"
      }`}
    />
    {error && <p className="text-red-500 text-sm mt-1">{error}</p>}
  </div>
);

const FormSelect = ({ label, name, value, onChange, options, getId, getName, error }) => (
  <div>
    <label className="block text-sm font-medium text-gray-700 mb-1">{label}</label>
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
    status: true,
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
        chipset: formData.chipset,
        rearCamera: formData.rearCamera,
        frontCamera: formData.frontCamera,
        warrantyPeriod: Number(formData.warrantyPeriod) || null,
        brandId: formData.brand?.idBrand,
        originId: formData.origin?.id,
        operatingSystemId: formData.operatingSystem?.id,
        warehouseAreaId: formData.warehouseArea?.id,
        status: formData.status,
      };

      await updateProduct(productId, payload);

      if (formData.image) {
        await uploadProductImage(productId, formData.image);
      }

      setSuccessMessage("Sản phẩm đã được thêm thành công!");
      if (onSuccess) onSuccess(productId);
      setTimeout(() => onClose && onClose(), 3000);
    } catch (err) {
      setApiError(err.message || "Không thể thêm sản phẩm.");
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
          <Dialog.Panel className="bg-white rounded-xl w-full max-w-3xl p-6 shadow-xl overflow-y-auto max-h-[90vh]">
            <Dialog.Title className="text-xl font-semibold mb-4">Thêm sản phẩm</Dialog.Title>
            {apiError && <p className="text-red-500 mb-3">{apiError}</p>}
            {successMessage && <p className="text-green-600 mb-3">{successMessage}</p>}

            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <FormInput label="Tên sản phẩm" name="productName" value={formData.productName} onChange={handleChange} error={errors.productName} />
                <FormInput label="Vi xử lý" name="processor" value={formData.processor} onChange={handleChange} error={errors.processor} />
                <FormInput label="Pin" name="battery" value={formData.battery} onChange={handleChange} type="number" />
                <FormInput label="Màn hình" name="screenSize" value={formData.screenSize} onChange={handleChange} type="number" />
                <FormInput label="Chipset" name="chipset" value={formData.chipset} onChange={handleChange} />
                <FormInput label="Camera sau" name="rearCamera" value={formData.rearCamera} onChange={handleChange} />
                <FormInput label="Camera trước" name="frontCamera" value={formData.frontCamera} onChange={handleChange} />
                <FormInput label="Bảo hành (tháng)" name="warrantyPeriod" value={formData.warrantyPeriod} onChange={handleChange} type="number" />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <FormSelect label="Thương hiệu" name="brand" value={formData.brand?.idBrand || ""} onChange={handleSelectChange} options={brands} getId={(b) => b.idBrand} getName={(b) => b.brandName} error={errors.brand} />
                <FormSelect label="Xuất xứ" name="origin" value={formData.origin?.id || ""} onChange={handleSelectChange} options={origins} getId={(o) => o.id} getName={(o) => o.name} error={errors.origin} />
                <FormSelect label="Hệ điều hành" name="operatingSystem" value={formData.operatingSystem?.id || ""} onChange={handleSelectChange} options={operatingSystems} getId={(o) => o.id} getName={(o) => o.name} error={errors.operatingSystem} />
                <FormSelect label="Khu vực kho" name="warehouseArea" value={formData.warehouseArea?.id || ""} onChange={handleSelectChange} options={warehouseAreas} getId={(w) => w.id} getName={(w) => w.name} error={errors.warehouseArea} />
              </div>

              <div className="mt-4">
                <label className="block text-sm font-medium text-gray-700 mb-1">Trạng thái</label>
                <input type="checkbox" name="status" checked={formData.status} onChange={handleChange} />
              </div>

              <div className="mt-4">
                <label className="block text-sm font-medium text-gray-700 mb-1">Ảnh sản phẩm</label>
                <input type="file" accept="image/*" onChange={handleImageChange} />
                {formData.imagePreview && <img src={formData.imagePreview} alt="preview" className="w-24 mt-2" />}
              </div>

              <div className="flex justify-end gap-4">
                <Button onClick={onClose} type="button" className="bg-gray-500 text-white">Hủy</Button>
                <Button type="submit" className="bg-blue-600 text-white" disabled={isSubmitting}>
                  {isSubmitting ? "Đang lưu..." : "Lưu sản phẩm"}
                </Button>
              </div>
            </form>
          </Dialog.Panel>
        </div>
      </Dialog>
    </Transition>
  );
};

export default AddProduct;