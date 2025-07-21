import { forwardRef, useImperativeHandle, useRef } from "react";
import { useEffect, useState } from "react";
import BarcodeScanner from "../../../../utils/useImeiCam";
import { toast } from "react-toastify";
import { Package, Search, X } from "lucide-react";
import { takeSearchByImei } from "../../../../services/exportService";
import BarcodeScannerVcont from "../../../../utils/UseImeiCamVcont";
const ProductForm = forwardRef(
  (
    {
      selected,
      onAdd,
      editProduct,
      usedImeis,
      setEditProduct,
      setImei,
      handleAddButtonClick,
      onSearch,
      setDisplayedProducts,
      setSelectedProduct,
      itemScanTrue,
      setItemScanFalse
    },
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
    const [searchTerm, setSearchTerm] = useState("");

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
      const optionId = e.target.value;
      const option = selected.productVersionResponses.find(
        (opt) => opt.versionId === optionId
      );

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
const playSuccessSound = () => {
  const audio = new Audio('/bip.mp3');
  audio.play().catch((err) => {
    console.error("Audio play failed:", err);
  });
};
    useEffect(() => {
      if (itemScan && !usedImeis.includes(itemScan)) {
        handleAddButtonClick();
        toast.success("Thêm sản phẩm thành công.");
        setItemScanFalse(true);
        setItemScan(null); // reset lại tránh lặp
      }
    }, [formData]);
    console.log("prodfuc", products);

    const handleScanSuccess = async (imeiScan) => {
      setShowScanner(true);
      console.log("form Selection", formData.selectedOption);

      try {
        const productScan = await takeSearchByImei(imeiScan);
        console.log("valuead is", productScan);
        onSearch(productScan?.data?.result.productName);
        const optionScan =
          productScan?.data?.result.productVersionResponses.find((version) =>
            version.imei?.some((imeiObj) => imeiObj.imei === imeiScan)
          );
        console.log("option scan", optionScan);

        if (productScan.status === 200 && optionScan) {
          playSuccessSound();
          setFormData((prev) => ({
            ...prev,
            productId: productScan?.data?.result.productId,
            productName: productScan?.data?.result.productName,
            selectedOption: optionScan,
            exportPrice: optionScan.exportPrice,
            stockQuantity: optionScan.stockQuantity,
            selectedImeis: [...new Set([...prev.selectedImeis, imeiScan])],
          }));
          setSelectedProduct(productScan?.data?.result);
          // setDisplayedProducts((prev) => [...prev, productScan?.data?.result])
          // setProducts((prev) => [...prev,productScan?.data?.result])
          setItemScan(imeiScan);
        } else {
          toast.warning("Không tìm thấy phiên bản phù hợp với IMEI.");
        }
      } catch (error) {
        console.log("Không tìm thấy mã" + error);

        toast.error("Không tìm thấy mã" + error);
      }

      // if (isValid) {
      //   setFormData((prev) => ({
      //     ...prev,
      //     selectedImeis: [...new Set([...prev.selectedImeis, itemScan])],
      //   }));
      //   setShowScanner(false); // ✅ chỉ đóng nếu đúng
      // } else {
      //   // ❌ chỉ báo lỗi duy nhất 1 lần cho mã sai này
      //   alert("IMEI không hợp lệ hoặc không có trong kho!");
      // }
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

    const filteredImeis =
      formData.selectedOption?.imei.filter((item) =>
        item.imei.toLowerCase().includes(searchTerm.toLowerCase())
      ) || [];

    return (
      <div className="md:w-1/2 space-y-4">
        <BarcodeScannerVcont
          open={showScanner}
          onResult={handleScanSuccess}
          onClose={() => {
            setShowScanner(false);
            setItemScanFalse(false);
          }}
        />
        <div className="bg-white rounded shadow h-[440px] p-2">
          <div className="container mx-auto p-4">
            <div className="flex items-center gap-3 mb-6">
              <div className="bg-blue-500 p-2 rounded-lg">
                <Package className="w-5 h-5 text-white" />
              </div>
              <h2 className="text-xl font-semibold text-gray-800">
                Thông tin sản phẩm
              </h2>
            </div>
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
                  n
                  onChange={handleOptionChange}
                  className="mt-1 block w-full border-gray-700 rounded-md shadow-sm p-1 border"
                >
                  <option value="">Chọn cấu hình</option>
                  {selected?.productVersionResponses?.map((option) => (
                    <option key={option.versionId} value={option.versionId}>
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
          <div className="fixed z-20 inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4">
            <div className="bg-white rounded-xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-hidden">
              {/* Search and Controls */}
              <div className="p-2 border-b border-gray-200">
                <div className="flex gap-4 items-center">
                  <div className="flex-1 relative">
                    <Search
                      className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
                      size={20}
                    />
                    <input
                      type="text"
                      placeholder="Tìm kiếm IMEI..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:border-transparent"
                    />
                  </div>
                </div>
              </div>
              {/* IMEI List */}
              <div className="overflow-y-auto max-h-96">
                {filteredImeis.length === 0 ? (
                  <div className="text-center py-12 text-gray-500">
                    <Package size={48} className="mx-auto mb-4 text-gray-300" />
                    <p>Không tìm thấy IMEI nào</p>
                  </div>
                ) : (
                  <div className="divide-y divide-gray-200">
                    {filteredImeis.map((item) => (
                      <div
                        key={item.imei}
                        className="p-4 hover:bg-gray-50 transition-colors"
                      >
                        <div className="flex items-center gap-4">
                          <input
                            id={`imei-${item.imei}`}
                            type="checkbox"
                            checked={formData?.selectedImeis.includes(
                              item.imei
                            )}
                            onChange={() => handleImeiChange(item.imei)}
                            className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                          />
                          <label
                            htmlFor={`imei-${item.imei}`}
                            className="font-mono text-lg font-medium text-gray-900 cursor-pointer"
                          >
                            {item.imei}
                          </label>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
              <div className="flex justify-end items-center px-6 py-2 border-t border-gray-400">
                <div className="flex gap-3">
                  <button
                    onClick={() => setIsModalOpen(false)}
                    className="bg-gray-300 hover:bg-gray-400 text-gray-700 px-6 py-2 rounded-lg font-medium transition-colors"
                  >
                    Hủy
                  </button>
                  <button
                    onClick={() => setIsModalOpen(false)}
                    className="bg-blue-600 hover:bg-blue-700 disabled:bg-blue-300 disabled:cursor-not-allowed text-white px-6 py-2 rounded-lg font-medium transition-colors"
                  >
                    Xác nhận
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    );
  }
);

export default ProductForm;
