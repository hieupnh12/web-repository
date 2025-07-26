import React, { useState } from "react";
import { X, ChevronDown, ChevronUp } from "lucide-react";
import { 
  Package, 
  User, 
  Calendar, 
  DollarSign, 
  Smartphone,
  Cpu,
  Battery,
  Monitor,
  Camera,
  Settings,
  Shield,
  MapPin
} from "lucide-react";
import { Card, Tag, Descriptions, Row, Col, Typography, Space, Divider } from "antd";
const { Text, Title } = Typography;
const ImportDetailPopup = ({ data, onClose }) => {
  const [openIndex, setOpenIndex] = useState(null);

  const toggleIMEI = (index) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  const displayData = data;
  const productInfo = data?.details[openIndex? openIndex:0]?.productVersion?.product;
  return (
    <div className="fixed inset-0 bg-black bg-opacity-40 z-50 flex justify-center items-center">
      <div className="bg-white w-full max-w-6xl max-h-[100vh] rounded-xl shadow-xl p-4 relative">
        {/* Nút đóng */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-500 hover:text-red-500"
        >
          <X size={24} />
        </button>

        <h2 className="text-2xl font-bold mb-4 text-center text-gray-800">
          Chi tiết phiếu nhập
        </h2>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Trái: Thông tin phiếu + sản phẩm */}
          <div className="text-sm text-gray-800 space-y-4 max-h-[70vh] overflow-y-auto custom-scroll">
            {/* Thông tin phiếu nhập */}
      <Card 
        size="small" 
        className="shadow-sm hover:shadow-md transition-shadow duration-200"
        styles={{
          body: { padding: '20px' }
        }}
      >
        {/* <div className="flex items-center gap-2 mb-3">
          <Package className="text-blue-600" size={24} />
          <Title level={4} className="m-0">Thông tin phiếu nhập</Title>
        </div> */}
        
        <div className="grid grid-cols-1 gap-2 text-sm">
          <div className="flex items-center justify-between py-1">
            <Text type="secondary" className="flex items-center gap-2">
              <Package size={16} />
              Mã phiếu:
            </Text>
            <Tag color="blue" className="font-mono text-sm">
              {displayData?.import_id}
            </Tag>
          </div>
          
          <div className="flex items-center justify-between py-1">
            <Text type="secondary" className="flex items-center gap-2">
              <User size={16} />
              Nhà cung cấp:
            </Text>
            <Text strong className="text-sm max-w-[200px] text-right">
              {displayData?.supplierName}
            </Text>
          </div>
          
          <div className="flex items-center justify-between py-1">
            <Text type="secondary" className="flex items-center gap-2">
              <User size={16} />
              Nhân viên:
            </Text>
            <Text className="text-sm">{displayData?.staffName}</Text>
          </div>
          
          <div className="flex items-center justify-between py-1">
            <Text type="secondary" className="flex items-center gap-2">
              <Calendar size={16} />
              Thời gian:
            </Text>
            <Text className="text-sm">
              {new Date(displayData?.time).toLocaleString("vi-VN")}
            </Text>
          </div>
          
          <Divider className="my-2" />
          
          <div className="flex items-center justify-between py-1">
            <Text strong className="text-lg flex items-center gap-2 text-green-700">
              <DollarSign size={16} /> Tổng tiền:
            </Text>
            <Text strong className="text-lg text-red-600 text-base">
              {displayData?.totalAmount?.toLocaleString()} VND
            </Text>
          </div>
        </div>
      </Card>

            {/* Thông tin sản phẩm đại diện */}
            <Card 
      className="shadow-sm hover:shadow-md transition-shadow duration-200"
      styles={{
        body: { padding: '20px' }
      }}
    >
      <div className="flex items-center gap-2 mb-4">
        <Smartphone className="text-green-600" size={20} />
        <Title level={4} className="m-0">Thông tin sản phẩm</Title>
      </div>
      
      <div className="space-y-4">
        {/* Tên sản phẩm và thông tin cơ bản */}
        <div className="pb-3 border-b border-gray-100">
          <Text strong className="text-lg text-gray-800 block mb-2">
            {productInfo?.productName}
          </Text>
          <div className="flex gap-2">
            <Tag color="blue" className="text-sm px-3 py-1">
              {productInfo?.brandName}
            </Tag>
            <Tag color="orange" className="text-sm px-3 py-1 flex items-center gap-1">
              <MapPin size={12} />
              {productInfo?.originName}
            </Tag>
          </div>
        </div>
        
        {/* Thông số kỹ thuật - Grid 2 cột */}
        <Row gutter={[24, 16]}>
          <Col span={12}>
            <div className="flex items-start gap-3">
              <Cpu className="text-purple-600 mt-1" size={18} />
              <div>
                <Text type="secondary" className="block text-sm">Vi xử lý</Text>
                <Text strong className="text-base">{productInfo?.processor}</Text>
              </div>
            </div>
          </Col>
          
          <Col span={12}>
            <div className="flex items-start gap-3">
              <Battery className="text-green-600 mt-1" size={18} />
              <div>
                <Text type="secondary" className="block text-sm">Dung lượng pin</Text>
                <Text strong className="text-base">{productInfo?.battery} mAh</Text>
              </div>
            </div>
          </Col>
          
          <Col span={12}>
            <div className="flex items-start gap-3">
              <Monitor className="text-blue-600 mt-1" size={18} />
              <div>
                <Text type="secondary" className="block text-sm">Màn hình</Text>
                <Text strong className="text-base">{productInfo?.screenSize}"</Text>
              </div>
            </div>
          </Col>
          
          <Col span={12}>
            <div className="flex items-start gap-3">
              <Camera className="text-red-600 mt-1" size={18} />
              <div>
                <Text type="secondary" className="block text-sm">Camera sau</Text>
                <Text strong className="text-base">{productInfo?.rearCamera}</Text>
              </div>
            </div>
          </Col>
          
          <Col span={12}>
            <div className="flex items-start gap-3">
              <Camera className="text-orange-600 mt-1" size={18} />
              <div>
                <Text type="secondary" className="block text-sm">Camera trước</Text>
                <Text strong className="text-base">{productInfo?.frontCamera}</Text>
              </div>
            </div>
          </Col>
          
          <Col span={12}>
            <div className="flex items-start gap-3">
              <Settings className="text-gray-600 mt-1" size={18} />
              <div>
                <Text type="secondary" className="block text-sm">Hệ điều hành</Text>
                <Text strong className="text-base">{productInfo?.operatingSystemName}</Text>
              </div>
            </div>
          </Col>
        </Row>
        
        {/* Bảo hành */}
        <div className="flex items-center justify-center pt-3 border-t border-gray-100">
          <div className="flex items-center gap-2 bg-amber-50 px-4 py-2 rounded-lg">
            <Shield className="text-amber-600" size={18} />
            <Text strong className="text-base">
              Bảo hành: <span className="text-amber-700">{productInfo?.warrantyPeriod} tháng</span>
            </Text>
          </div>
        </div>
      </div>
    </Card>
          </div>

          {/* Phải: Danh sách các phiên bản */}
          <div className="space-y-5 max-h-[70vh] overflow-y-auto">
            {data?.details?.map((detail, index) => (
              <div
                key={detail?.productVersionId}
                className="bg-green-50 border rounded-lg p-4 shadow-sm"
              >
                <div className="flex justify-between items-center">
                  <div>
                    <p className="font-semibold text-gray-800">
                      {detail?.productVersion?.productName} – {detail?.productVersion?.colorName} – {detail.productVersion.ramName || "No RAM"} – {detail.productVersion.romName}
                    </p>
                    <p className="text-sm text-gray-600">
                      Số lượng: {detail?.quantity} | Đơn giá: {detail?.unitPrice.toLocaleString()} VND
                    </p>
                  </div>
                  <button
                    onClick={() => toggleIMEI(index)}
                    className="text-sm text-blue-600 hover:text-blue-800 flex items-center gap-1"
                  >
                    {openIndex === index ? (
                      <>
                        Ẩn IMEI <ChevronUp size={16} />
                      </>
                    ) : (
                      <>
                        Xem IMEI <ChevronDown size={16} />
                      </>
                    )}
                  </button>
                </div>

                {openIndex === index && (
                  <ul className="bg-white border p-2 mt-3 text-sm list-disc list-inside text-gray-700 ">
                    {detail.productVersion.imei.map((i) => (
                      <li key={i?.imei} onClick={() => navigator.clipboard.writeText(i?.imei)} className="mb-2 border border-gray-200 rounded-lg bg-gray-50 p-1 cursor-pointer">{i?.imei}</li>
                    ))}
                    <p className="text-xs text-gray-500 mt-2 italic border-t pt-1">
                💡 Nhấp vào IMEI để sao chép
              </p>
                  </ul>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ImportDetailPopup;
