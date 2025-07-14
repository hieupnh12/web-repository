import { forwardRef, useImperativeHandle, useRef } from "react";
import { useEffect, useState } from "react";
import BarcodeScanner from "../../../../utils/useImeiCam";

const ProductForm = forwardRef(
  (
    { selected, onAdd, editProduct, usedImeis, setEditProduct, setImei },
    ref
  ) => {
    const [formData, setFormData] = useState({
      productId: "",
      productName: "",
      selectedOption: null,
      exportPrice: "",
      stockQuantity: "",
      selectedImeis: [], // Lưu danh sách IMEI đã chọn
      quantity: "",
    });
    const [isModalOpen, setIsModalOpen] = useState(false); // Trạng thái modal
    const [products, setProducts] = useState([]); // Lưu danh sách sản phẩm đã chọn option và imei trước đó để cập nhật
    const [showScanner, setShowScanner] = useState(false);
    // Chặn quét trùng bằng biến flag tạm thời
    const [itemScan, setItemScan] = useState(null);

    useEffect(() => {
      if (selected) {
        setEditProduct(null);
        setFormData({
          productId: selected.productId || "",
          productName: selected.productName || "",
          selectedOption: null,
          exportPrice: "",
          stockQuantity: selected.stockQuantity || 0,
          selectedImeis: [],
          quantity: "",
        });
      }
    }, [selected?.productId, products, usedImeis]);

    // Khi editProduct thay đổi
    useEffect(() => {
      if (!editProduct || !products.length) return;

      const matchedProduct = products.find(
        (p) => p.productId === editProduct.productId
      );
      if (!matchedProduct) return;
      console.log("mssd", matchedProduct);
      
      const option = matchedProduct.productVersionResponses.find(
        (opt) => opt.versionId === editProduct.versionId
      );
      console.log("eidit", editProduct);
      
      const imeisFromOption = option?.imei.map((item) => item.imei) || [];
      const usedImeisForThisOption = editProduct.imeis.length
        ? editProduct.imeis
        : imeisFromOption.filter((imei) => usedImeis.includes(imei));

      setFormData({
        productId: matchedProduct.productId,
        productName: matchedProduct.productName,
        selectedOption: option,
        exportPrice: editProduct.price,
        stockQuantity: matchedProduct.stockQuantity || 0,
        selectedImeis: usedImeisForThisOption,
        quantity: editProduct.quantity.toString(),
      });
    }, [editProduct]);
    console.log("selected", selected);
    
    // thay đổi cấu hình
    const handleOptionChange = (e) => {
      const optionId = (e.target.value);
      const option = selected.productVersionResponses.find(
        (opt) => opt.versionId === optionId
      );
      console.log("option", option);
      
      const imeisFromOption = option?.imei.map((item) => item.imei) || [];
      const usedImeisForThisOption = imeisFromOption.filter((imei) =>
        usedImeis?.includes(imei)
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

    useEffect(() => {
      if (itemScan) {
        handleScanSuccess(itemScan);
      }
    }, [itemScan]);

    const handleScanSuccess = () => {
      setShowScanner(true);
      const isValid = formData.selectedOption?.imeiList.some(
        (item) => item.imei === itemScan
      );

      if (isValid) {
        setFormData((prev) => ({
          ...prev,
          selectedImeis: [...new Set([...prev.selectedImeis, itemScan])],
        }));
        setShowScanner(false); // ✅ chỉ đóng nếu đúng
        handleAdd();
      } else {
        // ❌ chỉ báo lỗi duy nhất 1 lần cho mã sai này
        alert("IMEI không hợp lệ hoặc không có trong kho!");
      }
    };

    // Thực hiên thêm sản phẩm
    const handleAdd = () => {
      if (formData.selectedOption && formData?.selectedImeis.length > 0) {
        const newProduct = {
          productId: formData.productId,
          productName: formData.productName,
          versionId: formData.selectedOption.versionId,
          configuration: `${formData.selectedOption.colorName}, ${formData.selectedOption.ramName}, ${formData.selectedOption.romName}`,
          price: parseFloat(formData.selectedOption.exportPrice),
          imeis: formData.selectedImeis,
          quantity: parseInt(formData.selectedImeis.length),
        };
        // Cập nhật mảng products
        setProducts((prev) => {
          const existingIndex = prev.findIndex(
            (p) => p.productId === selected.productId
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
          productId: selected?.productId || "",
          productName: selected?.productName || "",
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
console.log("formdata", formData);

    return (
      <div className="md:w-1/2 space-y-4">
        <BarcodeScanner
          open={showScanner}
          onResult={setItemScan}
          onClose={() => {
            setShowScanner(false);
          }}
        />
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
                  value={formData?.productId}
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
                  value={formData?.productName}
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
                  value={formData?.selectedOption?.versionId || ""}
                  onChange={handleOptionChange}
                  className="mt-1 block w-full border-gray-700 rounded-md shadow-sm p-1 border"
                >
                  <option value="">Chọn cấu hình</option>
                  {selected?.productVersionResponses?.map((option) => (
                    <option
                      key={option.versionId}
                      value={option.versionId}
                    >
                      {`${option.colorName} - ${option.ramName} - ${option.romName}`}
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
                    value={formData?.selectedOption?.imei?.length || 0}
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
                      onClick={() => {
                        setShowScanner(true); // ✅ MỞ scanner lại
                      }}
                      className="bg-blue-500 text-white px-2 py-1 rounded-md hover:bg-blue-600 w-fit"
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
                {formData.selectedOption?.imei
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
                        {item.imei}
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
