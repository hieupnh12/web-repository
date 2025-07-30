import { forwardRef, useImperativeHandle, useRef } from "react";
import { useEffect, useState } from "react";
import BarcodeScanner from "../../../../utils/useImeiCam";
import { Scan, List, Package } from "lucide-react";

const ProductForm = ({
  selected,
  formData,
  setFormData,
  editProduct,
  listProductsSelected,
  onAddProduct,
  setSelectedProduct,
  setEditProduct,
}) => {
  const [methodInput, setMethodInput] = useState("1");
  const [selectedItemVersion, setSelectedItemVersion] = useState({
    productId: selected?.productId || "",
    nameProduct: selected?.productName || "",
    versionId: null,
    importPrice: "",
    selectedImeis: [],
    type: methodInput,
    quantity: "",
    startImei: "", // Thêm trường để lưu IMEI bắt đầu
    configuration: "",
  });

    const [showScanner, setShowScanner] = useState(false);


  // Đồng bộ selectedItemVersion với formData
  useEffect(() => {
    setFormData({
      productId: selectedItemVersion.productId,
      versionId: selectedItemVersion.versionId,
      importMethod: methodInput,
      quantity: parseInt(selectedItemVersion.quantity) || 2,
      imeis: selectedItemVersion.selectedImeis || [],
      configuration: selectedItemVersion.configuration || [],
      productName: selectedItemVersion.nameProduct || [],
      startImei: selectedItemVersion.startImei || ""
    });
  }, [selectedItemVersion, methodInput, setFormData]);

  // Ưu tiên editProduct: nếu đang sửa thì không set selected
  useEffect(() => {
    if (!editProduct && !selected) {
      setSelectedItemVersion((prev) => ({
        ...prev,
        productId: selected?.productId || "",
        nameProduct: selected?.productName || "",
        versionId: null,
        importPrice: "",
        selectedImeis: [],
        quantity: "",
        startImei: "",
      }));
      return;
    }
    if (selected) {
      setSelectedItemVersion((prev) => ({
        ...prev,
        productId: selected?.productId || "",
        nameProduct: selected?.productName || "",
        versionId: editProduct? editProduct.versionId : null,
        importPrice: editProduct? editProduct.importPrice : "",
        startImei: editProduct?.startImei || "",
        quantity: editProduct? editProduct.quantity : "",
        selectedImeis: editProduct ? [...editProduct.imeis] : [], 
      }));
    }
  }, [selected, editProduct]);

  // Xử lý khi chọn cấu hình
  const handleOptionChange = (e) => {
    const version = selected.productVersionResponses.find(
      (v) => v.versionId === e.target.value
    );

    if (version) {
      if (listProductsSelected.length > 0) {

        const existingCreatedProduct = listProductsSelected.find(
          (p) =>
            p.productFormData.productId === selected?.productId &&
            p.productFormData.versionId === e.target.value
        );

        console.log("exit", existingCreatedProduct);

        setSelectedItemVersion({
          productId: selected?.productId || "",
          nameProduct: selected?.productName || "",
          versionId:  e.target.value,
          importPrice: version.importPrice,
          type: existingCreatedProduct?.productFormData.importMethod || "1",
          quantity: existingCreatedProduct?.productFormData.quantity || "",
          startImei: existingCreatedProduct?.productFormData.startImei || "",          
          selectedImeis: selectedItemVersion.selectedImeis || [],
          configuration:
            version.colorName + ", " + version.ramName + ", " + version.romName,
        });
        setMethodInput(
          existingCreatedProduct?.productFormData.importMethod || "1"
        );
      } else {
        setSelectedItemVersion((prev) => ({
          ...prev,
          versionId:  e.target.value,
          importPrice: version.importPrice,
          configuration:
            version.colorName + ", " + version.ramName + ", " + version.romName,
        }));
      }
    } else {
      setSelectedItemVersion((prev) => ({
        ...prev,
        versionId: "",
        importPrice: "",
        selectedImeis: [],
        quantity: "",
        startImei: "",
      }));
    }
  };

  // Xử lý nhập IMEI bắt đầu và số lượng
  const handleStartImeiChange = (e) => {
    const newStartImei = e.target.value;
  const quantity = selectedItemVersion.quantity;

  setSelectedItemVersion((prev) => ({
    ...prev,
    startImei: newStartImei,
    selectedImeis:
      methodInput === "1"
        ? generateImeis(newStartImei, quantity)
        : prev.selectedImeis,
  }));
  };

  const handleQuantityChange = (e) => {
    const quantity = e.target.value;
  const currentStartImei = selectedItemVersion.startImei;

  setSelectedItemVersion((prev) => ({
    ...prev,
    quantity,
    selectedImeis:
      methodInput === "1"
        ? generateImeis(currentStartImei, quantity)
        : prev.selectedImeis,
  }));
  };

  // Hàm tạo danh sách IMEI từ IMEI bắt đầu và số lượng
  const generateImeis = (startImei, quantity) => {
    if (!startImei || !quantity || isNaN(quantity) || quantity <= 0) return [];
    const imeis = [];
    const baseImei = parseInt(startImei, 10);
    for (let i = 0; i < parseInt(quantity); i++) {
      imeis.push((baseImei + i).toString().padStart(startImei.length, "0"));
    }
    return imeis;
  };

  // Xử lý khi quét IMEI (cho nhập từng máy)
  const handleScanImei = (imei) => {
    if (methodInput === "2" && selectedItemVersion.versionId) {
      // Gọi callback để thêm sản phẩm ngay lập tức
      setSelectedItemVersion((prev) => ({
        ...prev,
        importMethod: "2",
        quantity: 1,
        selectedImeis: [imei],
        startImei: imei,
      }));
      // if (editProduct) {
      //   setEditProduct((prev) => ({
      //     ...prev,
      //     startImei: imei
      //   }))
      // }
      // onAddProduct();
    }
  };

  useEffect(() => {
    setSelectedItemVersion((prev) => ({
      ...prev,
      type: methodInput,
    }));
  }, [methodInput]);

  console.log(selectedItemVersion);


  return (
    <div className="md:w-1/2 space-y-4">
      <BarcodeScanner
          open={showScanner}
          onResult={handleScanImei}
          onClose={() => {
            setShowScanner(false);
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
                value={selectedItemVersion?.productId}
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
                value={selectedItemVersion?.nameProduct}
                className="mt-1 block w-full border-gray-700 rounded-md shadow-sm p-1 border"
                readOnly
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">
                Giá nhập
              </label>
              <input
                type="text"
                name="giaNhap"
                readOnly
                value={selectedItemVersion?.importPrice}
                className="mt-1 block w-full border-gray-700 rounded-md shadow-sm p-1 border"
              />
            </div>

            <div className="col-span-2">
              <label className="block text-sm font-medium text-gray-700">
                Cấu hình
              </label>
              <select
                value={selectedItemVersion.versionId || ""}
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
              <div className="bg-blue-50 rounded-lg p-4 border border-blue-200">
                <label className="text-sm font-medium text-gray-700 mb-3 block">
                  Phương thức nhập
                </label>
                <div className="flex gap-4">
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="radio"
                      value="1"
                      checked={methodInput === "1"}
                      onChange={(e) => setMethodInput(e.target.value)}
                      className="w-4 h-4 text-blue-600 focus:ring-blue-500"
                    />
                    <span className="text-sm font-medium text-gray-700">
                      Nhập theo lô
                    </span>
                  </label>
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="radio"
                      value="2"
                      checked={methodInput === "2"}
                      onChange={(e) => setMethodInput(e.target.value)}
                      className="w-4 h-4 text-blue-600 focus:ring-blue-500"
                    />
                    <span className="text-sm font-medium text-gray-700">
                      Nhập từng máy
                    </span>
                  </label>
                </div>
              </div>
            </div>

            {methodInput === "2" && (
              <div className="col-span-3 bg-green-50 rounded-lg p-2 border border-green-200 space-y-1">
                <div className="flex items-center justify-between space-x-4 mb-2 gap-4">
                  <label className="text-sm font-medium text-gray-700 flex items-center gap-2">
                    <List className="w-4 h-4" />
                    Mã IMEI:
                  </label>
                  <div className="flex space-x-2">
                    <button
                      onClick={() => {setMethodInput("2"); setShowScanner(true)}} // Đảm bảo scanner hoạt động
                      className="flex items-center gap-2 bg-blue-500 hover:bg-blue-600 text-white px-4 py-1.5 rounded-lg transition-colors duration-200 text-sm font-medium"
                      disabled={!selectedItemVersion?.versionId}
                    >
                      <Scan className="w-4 h-4" />
                      Quét IMEI
                    </button>
                  </div>
                </div>
                <div className="mt-1">
                  <textarea
                    value={methodInput==="2"? selectedItemVersion?.startImei:""}
                    readOnly
                    className="mt-1 p-2 bg-white block w-full border-gray-300 text-gray-900 rounded-md shadow-sm p-1 border h-10 resize-none"
                    placeholder="IMEI đã quét sẽ được thêm trực tiếp"
                  />
                </div>
              </div>
            )}
            {methodInput === "1" && (
              <>
                <div className="col-span-2">
                  <label className="block text-sm font-medium text-gray-700">
                    IMEI bắt đầu
                  </label>
                  <input
                    type="number"
                    name="imeiBatDau"
                    value={selectedItemVersion?.startImei || ""}
                    onChange={handleStartImeiChange}
                    placeholder="Nhập IMEI bắt đầu"
                    className="mt-1 p-2 block w-full border-gray-700 rounded-md shadow-sm p-1 border h-10 resize-none"
                  />
                </div>
                <div className="col-span-1">
                  <label className="block text-sm font-medium text-gray-700">
                    Số lượng
                  </label>
                  <input
                    type="number"
                    name="soLuongImei"
                    maxLength={99}
                    value={selectedItemVersion?.quantity || ""}
                    onChange={handleQuantityChange}
                    placeholder="Số lượng"
                    className="mt-1 p-2 block w-full border-gray-700 rounded-md shadow-sm p-1 border h-10 resize-none"
                  />
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductForm;
