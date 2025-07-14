import React, { useState, useEffect, Fragment } from "react";
import { Dialog, Transition } from "@headlessui/react";
import Button from "../../../components/ui/Button";
import {
  createProduct,
  uploadProductImage,
  getAllBrands,
  getAllOrigins,
  getAllOperatingSystems,
  getAllWarehouseAreas,
} from "../../../services/productService";

// Reusable FormInput component
const FormInput = ({ label, name, type = "text", value, onChange, error, className }) => (
  <div>
    <label htmlFor={name} className="block text-sm font-medium text-gray-700 mb-1">
      {label}
    </label>
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
      <p id={`${name}-error`} className="text-red-500 text-sm mt-1">
        {error}
      </p>
    )}
  </div>
);

// Reusable FormSelect component
const FormSelect = ({ label, name, value, onChange, options, getId, getName, error }) => {
  if (process.env.NODE_ENV === "development") {
    console.log(`Options for ${name}:`, options);
    console.log(`Value for ${name}:`, value);
  }
  const validValue = options.some((opt) => String(getId(opt)) === String(value)) ? value : "";
  return (
    <div>
      <label htmlFor={name} className="block text-sm font-medium text-gray-700 mb-1">
        {label}
      </label>
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
        <p id={`${name}-error`} className="text-red-500 text-sm mt-1">
          {error}
        </p>
      )}
    </div>
  );
};

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
    status: false,
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
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errors, setErrors] = useState({});
  const [apiError, setApiError] = useState(null);
  const [successMessage, setSuccessMessage] = useState(null);

  useEffect(() => {
    setIsLoading(true);
    Promise.all([
      getAllBrands(),
      getAllOrigins(),
      getAllOperatingSystems(),
      getAllWarehouseAreas(),
    ])
      .then(([brandRes, originRes, osRes, areaRes]) => {
        const getData = (res, name) => {
          if (!res || !res.data) {
            console.error(`Invalid response for ${name}:`, res);
            return [];
          }
          return Array.isArray(res.data) ? res.data : res.data?.content || res.data?.data || [];
        };
        setBrands(getData(brandRes, "brands"));
        setOrigins(getData(originRes, "origins"));
        setOperatingSystems(getData(osRes, "operating systems"));
        setWarehouseAreas(getData(areaRes, "warehouse areas"));
        setIsLoading(false);
      })
      .catch((err) => {
        console.error("Error fetching data:", err);
        setApiError("Không thể tải dữ liệu. Vui lòng thử lại.");
        setIsLoading(false);
      });
  }, []);

  useEffect(() => {
    return () => {
      if (formData.imagePreview && formData.imagePreview.startsWith("blob:")) {
        URL.revokeObjectURL(formData.imagePreview);
      }
    };
  }, [formData.imagePreview]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
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
    setFormData((prev) => {
      const newState = { ...prev, [name]: selected || null };
      if (process.env.NODE_ENV === "development") {
        console.log(`Updated ${name} in formData:`, newState[name]);
        console.log("Current formData:", newState);
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
      setFormData((prev) => ({
        ...prev,
        image: file,
        imagePreview: URL.createObjectURL(file),
      }));
      setErrors((prev) => ({ ...prev, image: "" }));
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
    setSuccessMessage(null);
    try {
      const dataToSubmit = {
        productName: formData.productName,
        processor: formData.processor,
        battery: formData.battery ? Number(formData.battery) : null,
        screenSize: formData.screenSize ? Number(formData.screenSize) : null,
        chipset: formData.chipset || null,
        rearCamera: formData.rearCamera || "",
        frontCamera: formData.frontCamera || "",
        warrantyPeriod: formData.warrantyPeriod ? Number(formData.warrantyPeriod) : null,
        status: formData.status ?? true,
        brandId: formData.brand?.idBrand,
        originId: formData.origin?.id,
        operatingSystemId: formData.operatingSystem?.id,
        warehouseAreaId: formData.warehouseArea?.id,
      };
      if (process.env.NODE_ENV === "development") {
        console.log("Data to submit:", dataToSubmit);
      }

      // Simulate delay for testing loading in dev
      if (process.env.NODE_ENV === "development") {
        await new Promise((resolve) => setTimeout(resolve, 1000));
      }

      const response = await createProduct(dataToSubmit, formData.image);
      const productId = response.data?.idproduct;
      if (!productId) {
        throw new Error("Không nhận được productId từ phản hồi API");
      }
      if (formData.image) {
        await uploadProductImage(productId, formData.image);
      }
      setSuccessMessage("Sản phẩm đã được thêm thành công!");
      if (onSuccess) onSuccess();
      // Wait 3 seconds before closing modal, similar to toast duration
      setTimeout(() => {
        if (onClose) onClose();
      }, 3000);
    } catch (error) {
      console.error("Lỗi khi thêm sản phẩm:", error.response?.data, error.message);
      const errorMessage =
        error.response?.data?.message || error.message || "Không thể thêm sản phẩm. Vui lòng thử lại.";
      setApiError(errorMessage);
    } finally {
      setIsSubmitting(false);
    }
  };

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
        <Dialog as="div" className="relative z-50" onClose={onClose} aria-label="Thêm sản phẩm mới">
          <Transition.Child as={Fragment}>
            <div className="fixed inset-0 bg-black bg-opacity-50 backdrop-blur-sm" />
          </Transition.Child>

          <div className="fixed inset-0 flex items-center justify-center p-0">
            <Dialog.Panel className="bg-white rounded-2xl w-full max-w-4xl p-6 sm:p-8 sm:pt-20 shadow-2xl max-h-[90vh] overflow-y-auto">
              {apiError && (
                <div className="text-red-500 text-center mb-4">{apiError}</div>
              )}
              {successMessage && (
                <div className="text-green-500 text-center mb-4">{successMessage}</div>
              )}
              <Dialog.Title className="text-2xl font-bold text-gray-800 mb-4">
                Thêm sản phẩm mới
              </Dialog.Title>

              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {[
                    { label: "Tên sản phẩm", name: "productName", type: "text" },
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
                      value={formData[name]}
                      onChange={handleChange}
                      error={errors[name]}
                      className={name === "productName" ? "aria-label='Nhập tên sản phẩm'" : ""}
                      disabled={isSubmitting}
                    />
                  ))}

                  {[
                    {
                      label: "Xuất xứ sản phẩm",
                      name: "origin",
                      options: origins,
                      getId: (o) => o.id,
                      getName: (o) => o.name,
                      value: formData.origin?.id ?? "",
                    },
                    {
                      label: "Hệ điều hành",
                      name: "operatingSystem",
                      options: operatingSystems,
                      getId: (o) => o.id,
                      getName: (o) => o.name,
                      value: formData.operatingSystem?.id ?? "",
                    },
                    {
                      label: "Thương hiệu sản phẩm",
                      name: "brand",
                      options: brands,
                      getId: (o) => o.idBrand,
                      getName: (o) => o.brandName,
                      value: formData.brand?.idBrand ?? "",
                    },
                    {
                      label: "Khu vực kho",
                      name: "warehouseArea",
                      options: warehouseAreas,
                      getId: (o) => o.id,
                      getName: (o) => o.name,
                      value: formData.warehouseArea?.id ?? "",
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
                      disabled={isSubmitting}
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
                        checked={formData.status ?? false}
                        onChange={handleChange}
                        disabled={isSubmitting}
                      />
                      <span>{formData.status ? "Hoạt động" : "Không hoạt động"}</span>
                    </label>
                  </div>
                </div>

                <div className="mt-6">
                  <label htmlFor="image" className="block text-sm font-medium text-gray-700 mb-2">
                    Ảnh sản phẩm
                  </label>
                  <div className="flex items-center space-x-6">
                    {formData.imagePreview ? (
                      <img
                        src={formData.imagePreview}
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
                      disabled={isSubmitting}
                    />
                    {errors.image && (
                      <p className="text-red-500 text-sm mt-1">{errors.image}</p>
                    )}
                  </div>
                </div>

                <div className="flex justify-end gap-4 mt-8">
                  <Button
                    type="button"
                    onClick={onClose}
                    className="bg-gray-500 text-white px-4 py-2 rounded"
                    disabled={isSubmitting}
                    aria-label="Hủy thêm sản phẩm"
                  >
                    Hủy
                  </Button>
                  <Button
                    type="submit"
                    className="bg-blue-600 text-white px-4 py-2 rounded flex items-center gap-2"
                    disabled={isSubmitting}
                    aria-label={isSubmitting ? "Đang lưu sản phẩm" : "Lưu sản phẩm"}
                  >
                    {isSubmitting ? (
                      <>
                        <svg
                          className="animate-spin h-5 w-5 text-white"
                          viewBox="0 0 24 24"
                        >
                          <circle
                            cx="12"
                            cy="12"
                            r="10"
                            stroke="currentColor"
                            strokeWidth="4"
                            fill="none"
                          />
                        </svg>
                        Đang lưu...
                      </>
                    ) : (
                      "Lưu sản phẩm"
                    )}
                  </Button>
                </div>
              </form>
            </Dialog.Panel>
          </div>
        </Dialog>
      </Transition>
    </>
  );
};

export default AddProduct;
