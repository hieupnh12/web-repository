import {
  XMarkIcon,
  DocumentTextIcon,
  DevicePhoneMobileIcon,
  CpuChipIcon,
  HashtagIcon,
  CurrencyDollarIcon,
  Battery50Icon,
  CameraIcon,
  GlobeAltIcon,
  ShieldCheckIcon,
} from "@heroicons/react/24/outline";

export default function ImportDetailView({ data, onClose }) {
  if (!data) return null;
console.log("data Details", data);

  const {
    import_id,
    quantity,
    unitPrice,
    productVersion: {
      productName,
      ramName,
      romName,
      colorName,
      importPrice,
      exportPrice,
      stockQuantity,
      imei = [],
      product
    }
  } = data;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-40 z-50 flex items-center justify-center p-4">
      <div className="bg-white w-full max-w-5xl rounded-lg shadow-lg p-6 overflow-y-auto max-h-[90vh] relative">
        
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-2 right-2 text-gray-500 hover:text-red-500"
        >
          <XMarkIcon className="w-6 h-6" />
        </button>

        <h2 className="text-xl font-semibold mb-4 text-center text-gray-800 flex items-center justify-center gap-2">
          <DocumentTextIcon className="w-6 h-6 text-blue-500" />
          Chi tiết phiếu nhập
        </h2>

        {/* Phiếu info */}
        <div className="grid md:grid-cols-2 gap-4 text-sm mb-6">
          <div><span className="font-medium">📄 Mã phiếu:</span> {import_id}</div>
          <div><span className="font-medium">🔢 Số lượng:</span> {quantity}</div>
          {/* <div><span className="font-medium">💵 Đơn giá nhập:</span> {unitPrice.toLocaleString()}₫</div> */}
          {/* <div><span className="font-medium">🧮 Tổng tiền:</span> {(quantity * unitPrice).toLocaleString()}₫</div> */}
        </div>

        {/* Sản phẩm */}
        <div className="mb-6">
          <h3 className="flex items-center gap-2 font-semibold text-gray-700 mb-2">
            <DevicePhoneMobileIcon className="w-5 h-5 text-blue-500" />
            Thông tin sản phẩm
          </h3>
          <div className="grid md:grid-cols-2 gap-4 text-sm">
            <div><strong>Tên sản phẩm:</strong> {productName}</div>
            <div><strong>Phiên bản:</strong> {ramName} / {romName} / {colorName}</div>
            <div><strong>Giá nhập:</strong> {importPrice.toLocaleString()}₫</div>
            <div><strong>Giá bán:</strong> {exportPrice.toLocaleString()}₫</div>
            <div><strong>Tồn kho:</strong> {stockQuantity}</div>
          </div>
        </div>

        {/* Kỹ thuật */}
        <div className="mb-6">
          <h3 className="flex items-center gap-2 font-semibold text-gray-700 mb-2">
            <CpuChipIcon className="w-5 h-5 text-blue-500" />
            Thông số kỹ thuật
          </h3>
          <div className="grid md:grid-cols-2 gap-4 text-sm">
            <div><strong>🏢 Hãng:</strong> {product?.brandName}</div>
            <div><strong><GlobeAltIcon className="inline w-4 h-4" /> Xuất xứ:</strong> {product?.originName}</div>
            <div><strong><CpuChipIcon className="inline w-4 h-4" /> Chip:</strong> {product?.processor}</div>
            <div><strong><Battery50Icon className="inline w-4 h-4" /> Pin:</strong> {product?.battery} mAh</div>
            <div><strong><CameraIcon className="inline w-4 h-4" /> Camera:</strong> {product?.rearCamera} / {product?.frontCamera}</div>
            <div><strong>📱 Màn hình:</strong> {product?.screenSize}"</div>
            <div><strong>🧠 HĐH:</strong> {product?.operatingSystemName}</div>
            <div><strong><ShieldCheckIcon className="inline w-4 h-4" /> Bảo hành:</strong> {product?.warrantyPeriod} tháng</div>
          </div>
        </div>

        {/* IMEI */}
        <div className="mb-2">
          <h3 className="flex items-center gap-2 font-semibold text-gray-700 mb-2">
            <HashtagIcon className="w-5 h-5 text-blue-500" />
            Danh sách IMEI ({quantity} / {imei.length}):
          </h3>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-2 text-sm max-h-40 overflow-y-auto border border-gray-200 p-2 rounded">
            {imei.slice(0, quantity).map((item, idx) => (
              <div key={idx} className="bg-gray-100 px-2 py-1 rounded shadow-sm">{item.imei}</div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
