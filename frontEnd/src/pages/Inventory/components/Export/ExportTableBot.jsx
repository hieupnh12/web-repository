const ExportTable = () => {
  // TODO: hiển thị sản phẩm đã nhập tạm thời
  return (
    <div className="bg-white overflow-x-auto rounded-lg shadow p-4 overflow-visible max-h-[300px] h-[245px]">
          <table className="w-full text-sm">
            <thead>
              <tr className="font-semibold border-b">
                <th>STT</th>
                <th>Mã SP</th>
                <th className="text-left">Tên sản phẩm</th>
                <th>RAM</th>
                <th>ROM</th>
                <th>Màu sắc</th>
                <th>Đơn giá</th>
                <th>Số lượng</th>
              </tr>
            </thead>
            <tbody>
              {/* Dữ liệu sản phẩm đã nhập */}
            </tbody>
          </table>
        </div>
  );
};

export default ExportTable;
