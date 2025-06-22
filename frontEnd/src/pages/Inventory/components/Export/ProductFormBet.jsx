import { forwardRef, useImperativeHandle } from "react";
import { useEffect, useState } from "react";

const ProductForm = forwardRef(
  ({ selected, onAdd, editProduct, usedImeis, setEditProduct }, ref) => {
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

    console.log("edit", editProduct);

    useEffect(() => {
      if (selected) {
        setEditProduct(null);
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
    }, [selected?.idProduct, products]);

    // Khi bấm nút sửa và editProduct thay đổi
    useEffect(() => {
      if (!editProduct || !products.length) return;

      const matchedProduct = products.find(
        (p) => p.idProduct === editProduct.idProduct
      );
      if (!matchedProduct) return;

      const option = matchedProduct.options.find(
        (opt) => opt.idProductVersion === editProduct.idProductVersion
      );

      const imeisFromOption = option?.imeiList.map((item) => item.imei) || [];
      const usedImeisForThisOption = editProduct.imeis.length
        ? editProduct.imeis
        : imeisFromOption.filter((imei) => usedImeis.includes(imei));

      setFormData({
        idProduct: matchedProduct.idProduct,
        nameProduct: matchedProduct.nameProduct,
        selectedOption: option,
        exportPrice: editProduct.price,
        stockQuantity: matchedProduct.stockQuantity || 0,
        selectedImeis: usedImeisForThisOption,
        quantity: editProduct.quantity.toString(),
      });
    }, [editProduct, usedImeis]);

    // thay đổi cấu hình
    const handleOptionChange = (e) => {
      const optionId = parseInt(e.target.value);
      const option = selected.options.find(
        (opt) => opt.idProductVersion === optionId
      );

      const imeisFromOption = option?.imeiList.map((item) => item.imei) || [];
      const usedImeisForThisOption = imeisFromOption.filter((imei) =>
        usedImeis.includes(imei)
      );

      setFormData((prev) => ({
        ...prev,
        selectedOption: option,
        exportPrice: option?.exportPrice ?? "",
        selectedImeis: usedImeisForThisOption, // tự động check những imei đã dùng
        quantity: option?.itemCount?.toString() ?? "",
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
      if (
        scannedImei &&
        formData.selectedOption?.imeiList.some(
          (item) => item.imei === scannedImei && item.status === "in-stock"
        )
      ) {
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
        formData?.selectedImeis.length > 0 
        //&& parseInt(formData.quantity) >= formData.selectedImeis.length
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
            (p) => p.idProduct === selected.idProduct
          );
          if (existingIndex !== -1) {
            const newProducts = [...prev];
            newProducts[existingIndex] = selected;
            return newProducts;
          }
          return [...prev, selected];
        });

        console.log("ádd", newProduct);

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

    useImperativeHandle(ref, () => ({
      handleAdd,
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
                    <option
                      key={option.idProductVersion}
                      value={option.idProductVersion}
                    >
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
                    value={formData?.selectedOption?.imeiList?.length || 0}
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
                      <label htmlFor={`imei-${item.imei}`}>
                        {item.imei} ({item.status})
                      </label>
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
  }
);

export default ProductForm;
