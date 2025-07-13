
const ExportTable = ({ itemChoose, setItemChoose, products}) => {
  // chọn item trong bảng để hiển thị lại data trên productForm 

  return (
    <div className="bg-white rounded-lg shadow p-2 overflow-y-auto overflow-x-auto max-h-[300px] h-[245px]">
      <table className="w-full border border-gray-200">
        <thead className="text-xs font-medium uppercase">
          <tr className="font-medium border-b bg-gray-100">
            <th className="py-2">STT</th>
            <th>Mã SP</th>
            <th className="text-left">Tên sản phẩm</th>
            <th>RAM</th>
            <th>ROM</th>
            <th>Màu sắc</th>
            <th>Đơn giá</th>
            <th>Số lượng</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-300">
          {products.length > 0 ? (
            products.map((product, index) => {
              const [color, ram, rom] = product.configuration.split(", ");
              return (
                 <tr
                  key={index}
                  className={`hover:bg-gray-200 transition cursor-pointer ${
                    itemChoose?.idProduct === product?.idProduct &&
                    itemChoose?.idProductVersion === product?.idProductVersion
                      ? "bg-gray-300"
                      : ""
                  }`}
                  onClick={() =>
                    setItemChoose(
                      itemChoose?.idProduct === product?.idProduct &&
                        itemChoose?.idProductVersion === product?.idProductVersion
                        ? null
                        : product
                    )
                  }
                >
                  <td className="text-center">{index + 1}</td>
                  <td className="text-center py-2">{product.idProduct}</td>
                  <td>{product.nameProduct}</td>
                  <td className="text-center py-2">{ram}</td>
                  <td className="text-center py-2">{rom}</td>
                  <td className="text-center py-2">{color}</td>
                  <td className="text-right py-2">
                    {product.price.toLocaleString()} VND
                  </td>
                  <td className="text-center py-2">{product.quantity}</td>
                </tr>
              );
            })
          ) : (
            <tr>
              <td colSpan="8" className="text-center py-4">
                Chưa có sản phẩm nào được thêm
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
};

export default ExportTable;
