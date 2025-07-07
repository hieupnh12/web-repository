import React, { useState, useEffect, Fragment } from "react";
import { Dialog, Transition } from "@headlessui/react";
import Button from "../../../components/ui/Button";
import { TrashIcon } from "@heroicons/react/24/outline";
import {
  getAllBrands,
  getAllOrigins,
  getAllOperatingSystems,
  getAllWarehouseAreas,
} from "../../../services/productService";
import DeleteProductModal from "./DeleteProductModal";

const FormInput = ({ label, name, type = "text", value, onChange, className, error }) => (
  <div>
    <label htmlFor={name} className="block text-sm font-medium text-gray-700 mb-1">{label}</label>
    <input
      id={name}
      type={type}
      name={name}
      value={value ?? ""}
      onChange={onChange}
      className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring ${
        error ? "border-red-500" : "border-gray-300"
      } ${className || ""}`}
      aria-describedby={error ? `${name}-error` : undefined}
    />
    {error && (
      <p id={`${name}-error`} className="text-red-500 text-sm mt-1">{error}</p>
    )}
  </div>
);

const FormSelect = ({ label, name, value, onChange, options, getId, getName, error }) => {
  if (process.env.NODE_ENV === "development") {
    console.log(`Options for ${name}:`, options);
    console.log(`Value for ${name}:`, value);
  }
  const validValue = options.some((opt) => String(getId(opt)) === String(value)) ? value : "";
  return (
    <div>
      <label htmlFor={name} className="block text-sm font-medium text-gray-700 mb-1">{label}</label>
      <select
        id={name}
        name={name}
        value={validValue}
        onChange={onChange}
        className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring ${
          error ? "border-red-500" : "border-gray-300"
        }`}
        aria-describedby={error ? `${name}-error` : undefined}
        disabled={options.length === 0}
      >
        <option value="">-- Chọn --</option>
        {options.map((opt) => (
          <option key={getId(opt)} value={getId(opt)}>
            {getName(opt)}
          </option>
        ))}
      </select>
      {error && (
        <p id={`${name}-error`} className="text-red-500 text-sm mt-1">{error}</p>
      )}
    </div>
  );
};

const EditProductModal = ({ product, onClose, onSave, onDelete }) => {
  const [editedProduct, setEditedProduct] = useState({});
  const [brands, setBrands] = useState([]);
  const [origins, setOrigins] = useState([]);
  const [operatingSystems, setOperatingSystems] = useState([]);
  const [warehouseAreas, setWarehouseAreas] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [errors, setErrors] = useState({});
  const [showDeleteModal, setShowDeleteModal] = useState(false);

  useEffect(() => {
    if (product) {
      console.log("Initial product:", product);
      setEditedProduct({
        ...product,
        productName: product.productName || "",
        image: null,
        imagePreview: product.image || "",
        origin: product.origin || null,
        operatingSystem: product.operatingSystem || null,
        warehouseArea: product.warehouseArea || null,
        brand: product.brand || null,
      });
    }
  }, [product]);

  useEffect(() => {
    setIsLoading(true);
    Promise.all([
      getAllBrands(),
      getAllOrigins(),
      getAllOperatingSystems(),
      getAllWarehouseAreas(),
    ])
      .then(([brandRes, originRes, osRes, areaRes]) => {
        const getData = (res) => {
          if (Array.isArray(res.data)) return res.data;
          return res.data?.content || res.data?.data || [];
        };
        setBrands(getData(brandRes));
        setOrigins(getData(originRes));
        setOperatingSystems(getData(osRes));
        setWarehouseAreas(getData(areaRes));
        setIsLoading(false);
      })
      .catch((err) => {
        console.error("Error fetching data:", err);
        setError("Không thể tải dữ liệu. Vui lòng thử lại.");
        setIsLoading(false);
      });
  }, []);

  useEffect(() => {
    return () => {
      if (editedProduct.imagePreview && editedProduct.imagePreview.startsWith("blob:")) {
        URL.revokeObjectURL(editedProduct.imagePreview);
      }
    };
  }, [editedProduct.imagePreview]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setEditedProduct((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
    setErrors((prev) => ({ ...prev, [name]: "" }));
  };

  const handleSelectChange = (e) => {
    const { name, value } = e.target;
    const optionsMap = {
      origin: origins,
      operatingSystem: operatingSystems,
      brand: brands,
      warehouseArea: warehouseAreas,
    };
    const getIdMap = {
      origin: (o) => o.id,
      operatingSystem: (o) => o.id,
      brand: (o) => o.idBrand,
      warehouseArea: (o) => o.id,
    };
    const options = optionsMap[name] || [];
    const getId = getIdMap[name] || ((o) => o.id);
    const selected = options.find((o) => String(getId(o)) === String(value));
    setEditedProduct((prev) => {
      const newState = { ...prev, [name]: selected || null };
      if (process.env.NODE_ENV === "development") {
        console.log(`Updated ${name} in editedProduct:`, newState[name]);
        console.log("Current editedProduct:", newState);
      }
      return newState;
    });
    setErrors((prev) => ({ ...prev, [name]: "" }));
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (!file.type.startsWith("image/")) {
        setErrors((prev) => ({ ...prev, image: "Vui lòng chọn một tệp hình ảnh hợp lệ." }));
        return;
      }
      if (file.size > 5 * 1024 * 1024) {
        setErrors((prev) => ({ ...prev, image: "Kích thước tệp không được vượt quá 5MB." }));
        return;
      }
      setEditedProduct((prev) => ({
        ...prev,
        image: file,
        imagePreview: URL.createObjectURL(file),
      }));
      setErrors((prev) => ({ ...prev, image: "" }));
    }
  };

  const handleSave = () => {
    const newErrors = {};
    if (!editedProduct.productName) newErrors.productName = "Tên sản phẩm là bắt buộc"; // Thêm kiểm tra lỗi
    if (!editedProduct.processor) newErrors.processor = "Vi xử lý sản phẩm là bắt buộc";
    if (!editedProduct.brand?.idBrand) newErrors.brand = "Thương hiệu sản phẩm là bắt buộc";
    if (!editedProduct.origin?.id) newErrors.origin = "Xuất xứ sản phẩm là bắt buộc";
    if (!editedProduct.operatingSystem?.id) newErrors.operatingSystem = "Hệ điều hành là bắt buộc";
    if (!editedProduct.warehouseArea?.id) newErrors.warehouseArea = "Khu vực kho là bắt buộc";

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    if (process.env.NODE_ENV === "development") {
      console.log("Data to save:", editedProduct);
    }
    if (onSave) onSave(editedProduct);
  };

  const handleDeleteSuccess = () => {
    if (onDelete) onDelete(product);
    onClose();
  };

  if (!product) return null;
  if (isLoading) {
    return (
      <div className="text-center">
        <svg className="animate-spin h-8 w-8 mx-auto text-blue-600" viewBox="0 0 24 24">
          <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
        </svg>
        <p>Đang tải...</p>
      </div>
    );
  }

  return (
    <>
      <Transition appear show={true} as={Fragment}>
        <Dialog as="div" className="relative z-50" onClose={onClose} aria-label="Chỉnh sửa sản phẩm">
          <Transition.Child as={Fragment}>
            <div className="fixed inset-0 bg-black bg-opacity-50 backdrop-blur-sm" />
          </Transition.Child>

          <div className="fixed inset-0 flex items-center justify-center p-0">
            <Dialog.Panel className="bg-white rounded-2xl w-full max-w-4xl p-6 sm:p-8 sm:pt-20 shadow-2xl max-h-[90vh] overflow-y-auto">
              {error && (
                <div className="text-red-500 text-center mb-4">{error}</div>
              )}
              <Dialog.Title className="text-2xl font-bold text-gray-800 mb-4">
                Chỉnh sửa sản phẩm
              </Dialog.Title>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <FormInput
                  label="Tên sản phẩm"
                  name="productName"
                  type="text"
                  value={editedProduct.productName}
                  onChange={handleChange}
                  error={errors.productName}
                />
                {[
                  { label: "Vi xử lý sản phẩm", name: "processor", type: "text" },
                  { label: "Pin sản phẩm", name: "battery", type: "number" },
                  { label: "Kích thước màn hình", name: "screenSize", type: "number" },
                  { label: "Chipset sản phẩm", name: "chipset", type: "text" },
                  { label: "Camera sau", name: "rearCamera", type: "text" },
                  { label: "Camera trước", name: "frontCamera", type: "text" },
                  { label: "Bảo hành (tháng)", name: "warrantyPeriod", type: "number" },
                ].map(({ label, name, type }) => (
                  <FormInput
                    key={name}
                    label={label}
                    name={name}
                    type={type}
                    value={editedProduct[name]}
                    onChange={handleChange}
                    error={errors[name]}
                  />
                ))}

                {[
                  {
                    label: "Xuất xứ sản phẩm",
                    name: "origin",
                    options: origins,
                    getId: (o) => o.id,
                    getName: (o) => o.name,
                    value: editedProduct.origin?.id ?? "",
                  },
                  {
                    label: "Hệ điều hành",
                    name: "operatingSystem",
                    options: operatingSystems,
                    getId: (o) => o.id,
                    getName: (o) => o.name,
                    value: editedProduct.operatingSystem?.id ?? "",
                  },
                  {
                    label: "Thương hiệu sản phẩm",
                    name: "brand",
                    options: brands,
                    getId: (o) => o.idBrand,
                    getName: (o) => o.brandName,
                    value: editedProduct.brand?.idBrand ?? "",
                  },
                  {
                    label: "Khu vực kho",
                    name: "warehouseArea",
                    options: warehouseAreas,
                    getId: (o) => o.id,
                    getName: (o) => o.name,
                    value: editedProduct.warehouseArea?.id ?? "",
                  },
                ].map(({ label, name, options, getId, getName, value }) => (
                  <FormSelect
                    key={name}
                    label={label}
                    name={name}
                    value={value}
                    onChange={handleSelectChange}
                    options={options}
                    getId={getId}
                    getName={getName}
                    error={errors[name]}
                  />
                ))}

                <div className="md:col-span-2">
                  <label htmlFor="status" className="block text-sm font-medium text-gray-700 mb-1">
                    Trạng thái
                  </label>
                  <label className="inline-flex items-center gap-2">
                    <input
                      id="status"
                      type="checkbox"
                      name="status"
                      checked={editedProduct.status ?? false}
                      onChange={handleChange}
                    />
                    <span>{editedProduct.status ? "Hoạt động" : "Không hoạt động"}</span>
                  </label>
                </div>
              </div>

              <div className="mt-6">
                <label htmlFor="image" className="block text-sm font-medium text-gray-700 mb-2">
                  Ảnh sản phẩm
                </label>
                <div className="flex items-center space-x-6">
                  {editedProduct.imagePreview ? (
                    <img
                      src={editedProduct.imagePreview}
                      alt="Ảnh sản phẩm"
                      className="w-32 h-32 object-contain rounded-lg border"
                    />
                  ) : (
                    <div className="w-32 h-32 bg-gray-100 flex items-center justify-center rounded-lg border text-gray-400">
                      Chưa có ảnh
                    </div>
                  )}
                  <input
                    id="image"
                    type="file"
                    accept="image/*"
                    onChange={handleImageChange}
                    className="px-4 py-2"
                  />
                  {errors.image && (
                    <p className="text-red-500 text-sm mt-1">{errors.image}</p>
                  )}
                </div>
              </div>

              <div className="flex justify-end gap-4 mt-8">
                <Button
                  onClick={() => setShowDeleteModal(true)}
                  className="bg-red-600 text-white flex items-center gap-2"
                >
                  <TrashIcon className="w-5 h-5" />
                  Xóa sản phẩm
                </Button>
                <Button onClick={onClose} className="bg-gray-500 text-white">
                  Hủy
                </Button>
                <Button onClick={handleSave} className="bg-blue-600 text-white">
                  Lưu thay đổi
                </Button>
              </div>
            </Dialog.Panel>
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

export default EditProductModal;