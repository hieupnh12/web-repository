import { List, Loader2, RotateCcw } from "lucide-react";
import React, { useState } from "react";

const ProductList = ({
  products,
  onSelect,
  onSearch,
  selectedProduct,
  editProduct,
  handleReload,
  isLoading
}) => {
  const [searchText, setSearchText] = useState("");

  const handleSearchChange = (e) => {
    const value = e.target.value;
    setSearchText(value);

    // Tìm local trước
    const localResults = products.filter((product) =>
      product.productName.toLowerCase().includes(value.toLowerCase())
    );

    // Nếu không có kết quả local và value đủ dài thì gọi API tìm
    if (localResults.length === 0 && value.length >= 2) {
      onSearch(value);
    }
  };

  const filteredProducts = products.filter((product) =>
    product.productName.toLowerCase().includes(searchText.toLowerCase())
  );

  // console.log("check product", onSelect);

  return (
    <div className="md:w-1/2">
      <div className="bg-white rounded shadow p-2 h-[440px] overflow-y-auto">
        <div className="flex items-center gap-3 mb-6 pt-4 px-4">
          <div className="bg-blue-500 p-2 rounded-lg">
            <List className="w-5 h-5 text-white" />
          </div>
          <h2 className="text-xl font-semibold text-gray-800">
            Danh sách sản phẩm
          </h2>
        </div>
        {/* Bảng data sản phẩm */}
        <div>
          <div className="flex items-center gap-2 mb-1">
            <input
              value={searchText}
              onChange={handleSearchChange}
              type="text"
              placeholder="Find name of products"
              className="w-full px-3 py-2 border border-gray-700 rounded"
            />
            <button
              onClick={() => {setSearchText(""); handleReload()}} // hàm reload bạn định nghĩa
              className="p-2 border border-gray-700 rounded hover:bg-gray-100"
              title="Reload"
            >
              <RotateCcw className="w-5 h-5" />
            </button>
          </div>
          <div className="relative">
            <div className="max-h-[300px] overflow-y-auto">
            <table className="min-w-full bg-white border border-gray-200 text-center">
              <thead className="text-xs font-medium uppercase sticky top-0 bg-white z-10">
                  <tr className="bg-gray-100 w-full">
                    <th className="py-2 px-4 border-b">Mã SP</th>
                    <th className="py-2 px-4 border-b">Tên sản phẩm</th>
                    <th className="py-2 px-4 border-b">Số lượng tồn</th>
                  </tr>
                </thead>
              <tbody className="">
                {isLoading ? (
                  <tr>
                    <td colSpan={999}>
                      <div className="flex flex-col items-center justify-center py-24">
                        <Loader2 className="h-6 w-6 animate-spin text-blue-500" />
                        <div className="mt-2 text-sm text-gray-500">
                          Đang tải...
                        </div>
                      </div>
                    </td>
                  </tr>
                ) : filteredProducts.length > 0 ? (
                  filteredProducts.map((product) => (
                    <tr
                      key={product.productId}
                      onClick={() => {
                        if (!editProduct) {
                          onSelect(product);
                        }
                      }}
                      className={`cursor-pointer hover:bg-gray-200 ${
                        selectedProduct?.productId === product.productId
                          ? "bg-gray-300"
                          : ""
                      }${
                        editProduct
                          ? "opacity-50 cursor-not-allowed bg-gray-300"
                          : ""
                      }`}
                    >
                      <td className="py-2 px-4 border-b">
                        {product.productId}
                      </td>
                      <td className="py-2 px-4 border-b">
                        {product.productName}
                      </td>
                      <td className="py-2 px-4 border-b">
                        {product.stockQuantity}
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="3" className="py-2 px-4 border-b text-center">
                      Không tìm thấy sản phẩm
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductList;
