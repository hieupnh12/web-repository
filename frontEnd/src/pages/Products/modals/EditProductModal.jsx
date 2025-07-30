import React, { useState, useEffect, Fragment } from "react";
import { Dialog, Transition } from "@headlessui/react";
import Button from "../../../components/ui/Button";
import { TrashIcon } from "@heroicons/react/24/outline";
import {
  getAllBrands,
  getAllOrigins,
  getAllOSs,
} from "../../../services/attributeService";
import { takeWarehouseArea } from "../../../services/storage";
import DeleteProductModal from "./DeleteProductModal";
import { toast } from "react-toastify";

const FormInput = ({
  label,
  name,
  type = "text",
  value,
  onChange,
  className,
  error,
  placeholder,
  unit,
}) => (
  <div className="mb-6">
    <label
      htmlFor={name}
      className="block text-sm font-semibold text-gray-800 mb-2"
    >
      {label}{" "}
      {unit && <span className="text-gray-500 font-normal">({unit})</span>}
    </label>
    <div className="relative">
      <input
        id={name}
        type={type}
        name={name}
        value={value ?? ""}
        onChange={onChange}
        placeholder={placeholder}
        className={`w-full px-4 py-3 border-2 rounded-xl transition-all focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
          error
            ? "border-red-400 bg-red-50"
            : "border-gray-200 hover:border-gray-300"
        } bg-white ${className || ""}`}
        aria-describedby={error ? `${name}-error` : undefined}
      />
      {unit && (
        <span className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 text-sm">
          {unit}
        </span>
      )}
    </div>
    {error && (
      <p id={`${name}-error`} className="text-red-500 text-xs mt-2">
        {error}
      </p>
    )}
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
}) => {
  const validValue = options.some((opt) => String(getId(opt)) === String(value))
    ? value
    : "";

  return (
    <div className="mb-6">
      <label
        htmlFor={name}
        className="block text-sm font-semibold text-gray-800 mb-2"
      >
        {label}
      </label>
      <select
        id={name}
        name={name}
        value={validValue}
        onChange={onChange}
        className={`w-full px-4 py-3 border-2 rounded-xl transition-all focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
          error
            ? "border-red-400 bg-red-50"
            : "border-gray-200 hover:border-gray-300"
        } bg-white`}
        aria-describedby={error ? `${name}-error` : undefined}
        disabled={options.length === 0}
      >
        <option value="">{placeholder}</option>
        {options.map((opt) => (
          <option key={getId(opt)} value={getId(opt)}>
            {getName(opt)}
          </option>
        ))}
      </select>
      {error && (
        <p id={`${name}-error`} className="text-red-500 text-xs mt-2">
          {error}
        </p>
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
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (product) {
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
      getAllOSs(),
      takeWarehouseArea(),
    ])
      .then(([brandRes, originRes, osRes, areaRes]) => {
        const getData = (res) => {
          if (Array.isArray(res)) return res;
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
      if (
        editedProduct.imagePreview &&
        editedProduct.imagePreview.startsWith("blob:")
      ) {
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
      return newState;
    });
    setErrors((prev) => ({ ...prev, [name]: "" }));
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (!file.type.startsWith("image/")) {
        setErrors((prev) => ({
          ...prev,
          image: "Vui lòng chọn một tệp hình ảnh hợp lệ.",
        }));
        return;
      }
      if (file.size > 5 * 1024 * 1024) {
        setErrors((prev) => ({
          ...prev,
          image: "Kích thước tệp không được vượt quá 5MB.",
        }));
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

  const handleSave = async () => {
    setIsSubmitting(true);
    const newErrors = {};
    if (!editedProduct.productName)
      newErrors.productName = "Tên sản phẩm là bắt buộc";
    if (!editedProduct.processor)
      newErrors.processor = "Vi xử lý sản phẩm là bắt buộc";
    if (!editedProduct.brand?.idBrand)
      newErrors.brand = "Thương hiệu sản phẩm là bắt buộc";
    if (!editedProduct.origin?.id)
      newErrors.origin = "Xuất xứ sản phẩm là bắt buộc";
    if (!editedProduct.operatingSystem?.id)
      newErrors.operatingSystem = "Hệ điều hành là bắt buộc";
    if (!editedProduct.warehouseArea?.id)
      newErrors.warehouseArea = "Khu vực kho là bắt buộc";

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      setIsSubmitting(false);
      toast.error("Vui lòng điền đầy đủ thông tin bắt buộc!");
      return;
    }

    try {
      if (onSave) {
        await onSave(editedProduct);
        toast.success("Cập nhật sản phẩm thành công!");
        onClose();
      }
    } catch (error) {
      toast.error("Có lỗi xảy ra khi cập nhật sản phẩm!");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDeleteSuccess = () => {
    if (onDelete) onDelete(product);
    toast.success("Xóa sản phẩm thành công!");
    onClose();
  };

  if (!product) return null;

  if (isLoading) {
    return (
      <Transition appear show={true} as={Fragment}>
        <Dialog as="div" className="relative z-50" onClose={onClose}>
          <div className="fixed inset-0 bg-black bg-opacity-60 backdrop-blur-sm" />
          <div className="fixed inset-0 flex items-center justify-center p-4">
            <Dialog.Panel className="bg-white rounded-2xl p-8 shadow-2xl">
              <div className="text-center">
                <div className="animate-spin h-12 w-12 mx-auto text-blue-600 mb-4">
                  <svg viewBox="0 0 24 24" fill="none">
                    <circle
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      strokeWidth="4"
                      className="opacity-25"
                    />
                    <path
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                      className="opacity-75"
                    />
                  </svg>
                </div>
                <p className="text-gray-600 font-medium">Đang tải dữ liệu...</p>
              </div>
            </Dialog.Panel>
          </div>
        </Dialog>
      </Transition>
    );
  }

  return (
    <>
      <Transition appear show={true} as={Fragment}>
        <Dialog
          as="div"
          className="relative z-50"
          onClose={onClose}
          aria-label="Chỉnh sửa sản phẩm"
        >
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
                <div className="bg-gradient-to-r from-emerald-600 to-teal-600 px-8 py-6">
                  <Dialog.Title className="text-2xl font-bold text-white flex items-center">
                    <div className="w-8 h-8 bg-white bg-opacity-20 rounded-lg flex items-center justify-center mr-3">
                      <svg
                        className="w-5 h-5 text-white"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
                        />
                      </svg>
                    </div>
                    Chỉnh sửa sản phẩm
                  </Dialog.Title>
                  <p className="text-emerald-100 mt-1">
                    Cập nhật thông tin sản phẩm: {editedProduct.productName}
                  </p>
                </div>

                <div className="max-h-[80vh] overflow-y-auto">
                  <div className="px-8 py-6">
                    {error && (
                      <div className="bg-red-50 border-l-4 border-red-400 p-4 mb-6 rounded-r-lg">
                        <p className="text-red-700 font-medium">{error}</p>
                      </div>
                    )}

                    <div className="space-y-8">
                      <div className="bg-gray-50 rounded-xl p-6">
                        <FormInput
                          label="Mã sản phẩm (ID)"
                          name="productId"
                          value={editedProduct.productId || ""}
                          readOnly={true}
                          placeholder="ID sản phẩm"
                        />
                      </div>

                      <div className="bg-white border border-gray-200 rounded-xl p-6">
                        <h3 className="text-lg font-semibold text-gray-800 mb-6 flex items-center">
                          <div className="w-2 h-6 bg-blue-500 rounded-full mr-3"></div>
                          Thông tin cơ bản
                        </h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                          <FormInput
                            label="Tên sản phẩm"
                            name="productName"
                            value={editedProduct.productName}
                            onChange={handleChange}
                            error={errors.productName}
                            placeholder="Nhập tên sản phẩm"
                          />
                          <FormInput
                            label="Vi xử lý"
                            name="processor"
                            value={editedProduct.processor}
                            onChange={handleChange}
                            error={errors.processor}
                            placeholder="Ví dụ: Snapdragon 8 Gen 2"
                          />
                          <FormInput
                            label="Dung lượng pin"
                            name="battery"
                            type="number"
                            value={editedProduct.battery}
                            onChange={handleChange}
                            error={errors.battery}
                            placeholder="5000"
                            unit="mAh"
                          />
                          <FormInput
                            label="Kích thước màn hình"
                            name="screenSize"
                            type="number"
                            step="0.1"
                            value={editedProduct.screenSize}
                            onChange={handleChange}
                            error={errors.screenSize}
                            placeholder="6.7"
                            unit="inch"
                          />
                          <FormInput
                            label="Tần số quét màn hình"
                            name="chipset"
                            type="number"
                            value={editedProduct.chipset}
                            onChange={handleChange}
                            error={errors.chipset}
                            placeholder="120"
                            unit="Hz"
                          />
                          <FormInput
                            label="Camera sau"
                            name="rearCamera"
                            value={editedProduct.rearCamera}
                            onChange={handleChange}
                            error={errors.rearCamera}
                            placeholder="50MP + 12MP + 12MP"
                            unit="MP"
                          />
                          <FormInput
                            label="Camera trước"
                            name="frontCamera"
                            value={editedProduct.frontCamera}
                            onChange={handleChange}
                            error={errors.frontCamera}
                            placeholder="32MP"
                            unit="MP"
                          />
                          <FormInput
                            label="Thời gian bảo hành"
                            name="warrantyPeriod"
                            type="number"
                            value={editedProduct.warrantyPeriod}
                            onChange={handleChange}
                            error={errors.warrantyPeriod}
                            placeholder="12"
                            unit="tháng"
                          />
                        </div>
                      </div>

                      <div className="bg-white border border-gray-200 rounded-xl p-6">
                        <h3 className="text-lg font-semibold text-gray-800 mb-6 flex items-center">
                          <div className="w-2 h-6 bg-green-500 rounded-full mr-3"></div>
                          Thuộc tính sản phẩm
                        </h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                          <FormSelect
                            label="Thương hiệu sản phẩm"
                            name="brand"
                            value={editedProduct.brand?.idBrand ?? ""}
                            onChange={handleSelectChange}
                            options={brands}
                            getId={(o) => o.idBrand}
                            getName={(o) => o.brandName}
                            error={errors.brand}
                            placeholder="Chọn thương hiệu"
                          />
                          <FormSelect
                            label="Xuất xứ sản phẩm"
                            name="origin"
                            value={editedProduct.origin?.id ?? ""}
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
                            value={editedProduct.operatingSystem?.id ?? ""}
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
                            value={editedProduct.warehouseArea?.id ?? ""}
                            onChange={handleSelectChange}
                            options={warehouseAreas}
                            getId={(o) => o.id}
                            getName={(o) => o.name}
                            error={errors.warehouseArea}
                            placeholder="Chọn khu vực kho"
                          />
                        </div>
                      </div>

                      <div className="bg-white border border-gray-200 rounded-xl p-6">
                        <h3 className="text-lg font-semibold text-gray-800 mb-6 flex items-center">
                          <div className="w-2 h-6 bg-purple-500 rounded-full mr-3"></div>
                          Hình ảnh sản phẩm
                        </h3>
                        <div className="flex items-start space-x-6">
                          <div className="flex-1">
                            <input
                              id="image"
                              type="file"
                              accept="image/*"
                              onChange={handleImageChange}
                              className="w-full px-4 py-3 border-2 border-dashed border-gray-300 rounded-xl text-gray-600 hover:border-gray-400 transition-colors file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
                            />
                            {errors.image && (
                              <p className="text-red-500 text-xs mt-2">
                                {errors.image}
                              </p>
                            )}
                          </div>
                          <div className="w-32 h-32 border-2 border-gray-200 rounded-xl overflow-hidden">
                            {editedProduct.imagePreview ? (
                              <img
                                src={editedProduct.imagePreview}
                                alt="Ảnh sản phẩm"
                                className="w-full h-full object-cover"
                              />
                            ) : (
                              <div className="w-full h-full bg-gray-100 flex items-center justify-center text-gray-400">
                                <svg
                                  className="w-8 h-8"
                                  fill="none"
                                  stroke="currentColor"
                                  viewBox="0 0 24 24"
                                >
                                  <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth={2}
                                    d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
                                  />
                                </svg>
                              </div>
                            )}
                          </div>
                        </div>
                      </div>

                      <div className="flex justify-between items-center pt-6 border-t border-gray-200">
                        <Button
                          onClick={() => setShowDeleteModal(true)}
                          className="px-6 py-3 bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 text-white rounded-xl transition-all shadow-md hover:shadow-lg flex items-center gap-2"
                        >
                          <TrashIcon className="w-5 h-5" />
                          Xóa sản phẩm
                        </Button>

                        <div className="flex gap-4">
                          <Button
                            onClick={onClose}
                            className="px-6 py-3 bg-gray-500 hover:bg-gray-600 text-white rounded-xl transition-colors shadow-md hover:shadow-lg"
                          >
                            Hủy bỏ
                          </Button>
                          <Button
                            onClick={handleSave}
                            disabled={isSubmitting}
                            className="px-8 py-3 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white rounded-xl transition-all shadow-md hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
                          >
                            {isSubmitting ? (
                              <div className="flex items-center">
                                <svg
                                  className="animate-spin -ml-1 mr-3 h-5 w-5 text-white"
                                  xmlns="http://www.w3.org/2000/svg"
                                  fill="none"
                                  viewBox="0 0 24 24"
                                >
                                  <circle
                                    className="opacity-25"
                                    cx="12"
                                    cy="12"
                                    r="10"
                                    stroke="currentColor"
                                    strokeWidth="4"
                                  ></circle>
                                  <path
                                    className="opacity-75"
                                    fill="currentColor"
                                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                                  ></path>
                                </svg>
                                Đang lưu...
                              </div>
                            ) : (
                              "Lưu thay đổi"
                            )}
                          </Button>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </Dialog.Panel>
            </Transition.Child>
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