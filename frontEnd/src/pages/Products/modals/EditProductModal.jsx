import React, { useState, useEffect, Fragment } from "react";
import { Dialog, Transition } from "@headlessui/react";
import Button from "../../../components/ui/Button";
import {
  getAllBrands,
  getAllOrigins,
  getAllOperatingSystems,
  getAllWarehouseAreas,
} from "../../../services/productService";

const FormInput = ({ label, name, type = "text", value, onChange, className }) => (
  <div>
    <label htmlFor={name} className="block text-sm font-medium text-gray-700 mb-1">{label}</label>
    <input
      id={name}
      type={type}
      name={name}
      value={value ?? ""}
      onChange={onChange}
      className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring ${className || ""}`}
    />
  </div>
);

const FormSelect = ({ label, name, value, onChange, options, getId, getName }) => {
  if (process.env.NODE_ENV === "development") {
    console.log(`Options for ${name}:`, options);
    console.log(`Value for ${name}:`, value);
  }
  return (
    <div>
      <label htmlFor={name} className="block text-sm font-medium text-gray-700 mb-1">{label}</label>
      <select
        id={name}
        name={name}
        value={value ?? ""}
        onChange={onChange}
        className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring"
      >
        <option value="">-- Chọn --</option>
        {options.map((opt) => (
          <option key={getId(opt)} value={getId(opt)}>
            {getName(opt)}
          </option>
        ))}
      </select>
    </div>
  );
};

const EditProductModal = ({ product, onClose, onSave }) => {
  const [editedProduct, setEditedProduct] = useState({});
  const [brands, setBrands] = useState([]);
  const [origins, setOrigins] = useState([]);
  const [operatingSystems, setOperatingSystems] = useState([]);
  const [warehouseAreas, setWarehouseAreas] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (product) {
      console.log("Initial product:", product);
      setEditedProduct({
        ...product,
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
  };

  const handleSelectChange = (name, options, getId) => (e) => {
    const value = e.target.value;
    if (process.env.NODE_ENV === "development") {
      console.log(`Selected value for ${name}:`, value);
    }
    const selected = options.find((o) => String(getId(o)) === String(value));
    setEditedProduct((prev) => {
      const newState = { ...prev, [name]: selected || null };
      if (process.env.NODE_ENV === "development") {
        console.log(`Updated ${name} in editedProduct:`, newState[name]);
        console.log("Current editedProduct:", newState);
      }
      return newState;
    });
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setEditedProduct((prev) => ({
        ...prev,
        image: file,
        imagePreview: URL.createObjectURL(file),
      }));
    }
  };

  const handleSave = () => {
    // Validation
    const errors = [];
    if (!editedProduct.processor) errors.push("Vi xử lý sản phẩm là bắt buộc");
    if (!editedProduct.stockQuantity) errors.push("Số lượng tồn kho là bắt buộc");
    if (!editedProduct.brand?.idBrand) errors.push("Thương hiệu sản phẩm là bắt buộc");
    if (!editedProduct.origin?.id) errors.push("Xuất xứ sản phẩm là bắt buộc");
    if (!editedProduct.operatingSystem?.id) errors.push("Hệ điều hành là bắt buộc");
    if (!editedProduct.warehouseArea?.id) errors.push("Khu vực kho là bắt buộc");

    if (errors.length > 0) {
      alert(errors.join("\n"));
      return;
    }

    if (process.env.NODE_ENV === "development") {
      console.log("Data to save:", editedProduct);
    }
    if (onSave) onSave(editedProduct);
  };

  if (!product) return null;
  if (isLoading) return <div className="text-center">Đang tải...</div>;

  return (
    <Transition appear show={true} as={Fragment}>
      <Dialog as="div" className="relative z-50" onClose={onClose}>
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
              {[
                { label: "Vi xử lý sản phẩm", name: "processor", type: "text" },
                { label: "Pin sản phẩm", name: "battery", type: "number" },
                { label: "Kích thước màn hình", name: "screenSize", type: "number" },
                { label: "Chipset sản phẩm", name: "chipset", type: "text" },
                { label: "Camera sau", name: "rearCamera", type: "text" },
                { label: "Camera trước", name: "frontCamera", type: "text" },
                { label: "Bảo hành (tháng)", name: "warrantyPeriod", type: "number" },
                { label: "Số lượng tồn kho", name: "stockQuantity", type: "number" },
              ].map(({ label, name, type }) => (
                <FormInput
                  key={name}
                  label={label}
                  name={name}
                  type={type}
                  value={editedProduct[name]}
                  onChange={handleChange}
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
                  onChange={handleSelectChange(name, options, getId)}
                  options={options}
                  getId={getId}
                  getName={getName}
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
              </div>
            </div>

            <div className="flex justify-end gap-4 mt-8">
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
  );
};

export default EditProductModal;