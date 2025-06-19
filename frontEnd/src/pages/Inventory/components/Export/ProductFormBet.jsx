import { forwardRef, useImperativeHandle } from "react";
import { useEffect, useState } from "react";

const ProductForm = forwardRef(({ selected, onAdd, editProduct, onEditImeis, usedImeis }, ref) => {
  const [formData, setFormData] = useState({
    idProduct: "",
    nameProduct: "",
    selectedOption: null,
    exportPrice: "",
    stockQuantity: "",
    selectedImeis: [], // Lưu danh sách IMEI đã chọn
    quantity: "",
  });
  const [isModalOpen, setIsModalOpen] = useState(false); // Trạng thái modal
  const [products, setProducts] = useState([]); // Lưu danh sách sản phẩm đã chọn option và imei trước đó để cập nhật


  useEffect(() => {
    if (editProduct) {
      // Chọn sản phẩm từ ExportTable (chế độ sửa)
      const existingProduct = products.find(
        (p) =>
          p.idProduct === editProduct.idProduct &&
          p.idProductVersion === editProduct.idProductVersion
      );
      const [color, ram, rom] = editProduct.configuration.split(", ");
      setFormData({
        idProduct: editProduct.idProduct || "",
        nameProduct: editProduct.nameProduct || "",
        selectedOption: {
          idProductVersion: editProduct.idProductVersion,
          color,
          ram,
          rom,
          exportPrice: editProduct.price,
          imeiList: editProduct.imeis.map((imei) => ({ imei, status: "in-stock" })),
        },
        exportPrice: editProduct.price.toString(),
        stockQuantity: editProduct.quantity.toString(),
        selectedImeis: existingProduct ? existingProduct.imeis : editProduct.imeis,
        quantity: editProduct.quantity.toString(),
      });
    } else if (selected) {
      // Chọn sản phẩm từ ProductList
      const existingProduct = products.find(
        (p) => p.idProduct === selected.idProduct && p.idProductVersion === selected.idProductVersion        
      );
      products.map((data) => console.log("data product", data)
      )

      console.log(selected);
      
      
      if (existingProduct) {
        // Nếu đã có cấu hình trước đó
        const [color, ram, rom] = existingProduct.configuration.split(", ");
        setFormData({
          idProduct: existingProduct.idProduct || "",
          nameProduct: existingProduct.nameProduct || "",
          selectedOption: {
            idProductVersion: existingProduct.idProductVersion,
            color,
            ram,
            rom,
            exportPrice: existingProduct.price,
            imeiList: existingProduct.imeis.map((imei) => ({ imei, status: "in-stock" })),
          },
          exportPrice: existingProduct.price.toString(),
          stockQuantity: existingProduct.quantity.toString(),
          selectedImeis: existingProduct.imeis,
          quantity: existingProduct.quantity.toString(),
        });
      } else {
        // Làm mới form nếu chưa có cấu hình
        setFormData({
          idProduct: selected.idProduct || "",
          nameProduct: selected.nameProduct || "",
          selectedOption: null,
          exportPrice: "",
          stockQuantity: selected.stockQuantity || 0,
          selectedImeis: [],
          quantity: "",
        });
      }
    }
  }, [selected?.idProduct, editProduct, products]);

  const handleOptionChange = (e) => {
    const optionId = parseInt(e.target.value);
    const option = selected.options.find((opt) => opt.idProductVersion === optionId);
    setFormData((prev) => ({
      ...prev,
      selectedOption: option,
      exportPrice: option ? option.exportPrice : "",
      selectedImeis: [],
      quantity: option ? option?.itemCount : ""
    }));
  };

  const handleImeiChange = (imei) => {
    setFormData((prev) => {
      const selectedImeis = prev.selectedImeis.includes(imei)
        ? prev.selectedImeis.filter((i) => i !== imei)
        : [...prev.selectedImeis, imei];
      return { ...prev, selectedImeis };
    });
  };

  const handleScanImei = () => {
    const scannedImei = prompt("Nhập IMEI quét được:"); // Giả lập quét IMEI
    if (scannedImei && formData.selectedOption?.imeiList.some((item) => item.imei === scannedImei && item.status === "in-stock")) {
      setFormData((prev) => ({
        ...prev,
        selectedImeis: [...new Set([...prev.selectedImeis, scannedImei])],
      }));
    } else {
      alert("IMEI không hợp lệ hoặc không có trong kho!");
    }
  };

  const handleAdd = () => {

    if (
      formData.selectedOption &&
      formData?.selectedImeis.length > 0 &&
      parseInt(formData.quantity) >= formData.selectedImeis.length 
    ) {
      const newProduct = {
        idProduct: formData.idProduct,
        nameProduct: formData.nameProduct,
        idProductVersion: formData.selectedOption.idProductVersion,
        configuration: `${formData.selectedOption.color}, ${formData.selectedOption.ram}, ${formData.selectedOption.rom}`,
        price: parseFloat(formData.selectedOption.exportPrice),
        imeis: formData.selectedImeis,
        quantity: parseInt(formData.selectedImeis.length),
      };
      // Cập nhật mảng products
      setProducts((prev) => {
        
        const existingIndex = prev.findIndex(
          (p) =>
            p.idProduct === newProduct.idProduct &&
            p.idProductVersion === newProduct.idProductVersion
        );
        if (existingIndex !== -1) {
          const newProducts = [...prev];
          newProducts[existingIndex] = newProduct;
          return newProducts;
        }
        return [...prev, newProduct];
      });

      console.log(newProduct);
      
      onAdd(newProduct);
      // Làm mới formData
      setFormData({
        idProduct: selected?.idProduct || "",
        nameProduct: selected?.nameProduct || "",
        selectedOption: null,
        exportPrice: "",
        stockQuantity: selected?.stockQuantity || 0,
        selectedImeis: [],
        quantity: "",
      });
    } else {
      alert(
        `Vui lòng chọn cấu hình và số lượng IMEI phù hợp! ${formData.quantity}`
      );
    }
  };

  const handleEditImeis = () => {
    const duplicateImeis = formData.selectedImeis.filter((imei) =>
      usedImeis.includes(imei) &&
      !editProduct?.imeis.includes(imei) // Cho phép giữ IMEI của sản phẩm đang sửa
    );
    if (
      formData.selectedOption &&
      formData.selectedImeis.length > 0 &&
      duplicateImeis.length === 0
    ) {
      const updatedProduct = {
        ...editProduct,
        imeis: formData.selectedImeis,
        quantity: parseInt(formData.quantity),
      };
      // Cập nhật mảng products
      setProducts((prev) => {
        const existingIndex = prev.findIndex(
          (p) =>
            p.idProduct === updatedProduct.idProduct &&
            p.idProductVersion === updatedProduct.idProductVersion
        );
        if (existingIndex !== -1) {
          const newProducts = [...prev];
          newProducts[existingIndex] = updatedProduct;
          return newProducts;
        }
        return [...prev, updatedProduct];
      });
      onEditImeis(updatedProduct);
      // Làm mới formData
      setFormData({
        idProduct: selected?.idProduct || "",
        nameProduct: selected?.nameProduct || "",
        selectedOption: null,
        exportPrice: "",
        stockQuantity: selected?.stockQuantity || 0,
        selectedImeis: [],
        quantity: "",
      });
    } else {
      alert(
        duplicateImeis.length > 0
          ? `IMEI trùng lặp: ${duplicateImeis.join(", ")}`
          : "Vui lòng chọn số lượng IMEI phù hợp!"
      );
    }
  };

  useImperativeHandle(ref, () => ({
    handleAdd,handleEditImeis,
  }));

  
  return (
    <div className="md:w-1/2 space-y-4">
      <div className="bg-white rounded shadow h-[350px] p-2">
        <div className="container mx-auto p-4">
          <div className="grid grid-cols-3 gap-4">
            <div className="col-span-1">
              <label className="block text-sm font-medium text-gray-700">
                Mã SP
              </label>
              <input
                type="text"
                name="maSP"
                value={formData?.idProduct}
                className="mt-1 block w-full border-gray-700 rounded-md shadow-sm p-1 border"
                readOnly
              />
            </div>
            <div className="col-span-2">
              <label className="block text-sm font-medium text-gray-700">
                Tên sản phẩm
              </label>
              <input
                type="text"
                name="tenSanPham"
                value={formData?.nameProduct}
                className="mt-1 block w-full border-gray-700 rounded-md shadow-sm p-1 border"
                readOnly
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">
                Giá xuất
              </label>
              <input
                type="text"
                name="giaXuat"
                readOnly
                value={formData?.exportPrice}
                className="mt-1 block w-full border-gray-700 rounded-md shadow-sm p-1 border"
              />
            </div>

            <div className="col-span-2">
              <label className="block text-sm font-medium text-gray-700">
                Cấu hình
              </label>
              <select
                value={formData?.selectedOption?.idProductVersion || ""}
                onChange={handleOptionChange}
                className="mt-1 block w-full border-gray-700 rounded-md shadow-sm p-1 border"
              >
                <option value="">Chọn cấu hình</option>
                {selected?.options?.map((option) => (
                  <option key={option.idProductVersion} value={option.idProductVersion}>
                    {`${option.color} - ${option.ram} - ${option.rom}`}
                  </option>
                ))}
              </select>
            </div>

            <div className="grid col-span-3">
              <div className="flex gap-4 items-center">
                <label className="block text-sm font-medium text-gray-700 py-2">
                  Số lượng tồn:
                </label>
                <input
                  type="text"
                  name="soLuongTon"
                  readOnly
                  value={formData?.quantity}
                  className=" block border border-gray-700 rounded-md shadow-sm p-1 w-1/4"
                />
              </div>
            </div>
            <div className="col-span-3">
              <div className="flex items-center justify-between space-x-4 mb-2 gap-4">
                <label className="block text-sm font-medium text-gray-700 whitespace-nowrap">
                  Mã IMEI:
                </label>
                <div className="flex space-x-2">
                  <button
                    onClick={() => setIsModalOpen(true)}
                    className="bg-blue-500 text-white px-2 py-1 rounded-md hover:bg-blue-600 sm:w-auto"
                    disabled={!formData.selectedOption}
                  >
                    Chọn IMEI
                  </button>
                  <button
                    onClick={handleScanImei}
                    className="bg-blue-500 text-white px-2 py-1 rounded-md hover:bg-blue-600 w-fit"
                    disabled={!formData.selectedOption}
                  >
                    Quét IMEI
                  </button>
                </div>
              </div>
              <div className="mt-1">
                <textarea
                value={(formData?.selectedImeis ?? []).join("\n")}
                readOnly
                className="mt-1 p-2 block w-full border-gray-700 rounded-md shadow-sm p-1 border h-24 resize-none"
                placeholder="Danh sách IMEI đã chọn..."
              />
              </div>
            </div>
          </div>
        </div>
      </div>
      {/* Modal chọn IMEI */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
          <div className="bg-white rounded-lg p-4 w-96 max-h-[80vh] overflow-y-auto">
            <h2 className="text-lg font-medium mb-4">Chọn IMEI</h2>
            <div className="space-y-2">
              {formData.selectedOption?.imeiList
                ?.filter((item) => item.status === "in-stock")
                .map((item) => (
                  <div key={item.imei} className="flex items-center">
                    <input
                      id={`imei-${item.imei}`} 
                      type="checkbox"
                      checked={formData?.selectedImeis.includes(item.imei)}
                      onChange={() => handleImeiChange(item.imei)}
                      className="mr-2"
                    />
                    <label htmlFor={`imei-${item.imei}`}>{item.imei} ({item.status})</label>
                  </div>
                ))}
            </div>
            <div className="flex justify-end mt-4 gap-2">
              <button
                onClick={() => setIsModalOpen(false)}
                className="bg-gray-300 text-black px-4 py-2 rounded-md"
              >
                Hủy
              </button>
              <button
                onClick={() => setIsModalOpen(false)}
                className="bg-blue-500 text-white px-4 py-2 rounded-md"
              >
                Xác nhận
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
});

export default ProductForm;
