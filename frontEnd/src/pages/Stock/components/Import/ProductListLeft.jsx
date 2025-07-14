import React, { useState } from "react";
import { CheckCircle2, List, Search } from "lucide-react";

const ProductList = ({
  products,
  onSelect,
  onSearch,
  selectProduct,
  editProduct,
}) => {
  const [searchText, setSearchText] = useState("");

  const handleSearchChange = (e) => {
    const value = e.target.value;
    setSearchText(value);
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
          <div>
            <input
              value={searchText}
              onChange={handleSearchChange}
              type="text"
              placeholder="Find name of products"
              className="w-full mb-1 px-3 py-2 border border-gray-700 rounded"
            />
          </div>
          <div className="relative overflow-y-auto">
            <table className="min-w-full bg-white border border-gray-200 text-center">
              <thead className="text-xs font-medium uppercase">
                <tr className="bg-gray-100 w-full">
                  <th className="py-2 px-4 border-b">Mã SP</th>
                  <th className="py-2 px-4 border-b">Tên sản phẩm</th>
                  <th className="py-2 px-4 border-b">Số lượng tồn</th>
                </tr>
              </thead>
              <tbody className="">
                {filteredProducts.length > 0 ? (
                  filteredProducts.map((product) => (
                    <tr
                      key={product.productId}
                      onClick={() => {
                        if (!editProduct) {
                          onSelect(product);
                        }
                      }}
                      className={`cursor-pointer hover:bg-gray-200 ${
                        selectProduct?.productId === product.productId
                          ? "bg-gray-300"
                          : ""
                      }${editProduct ? "opacity-50 cursor-not-allowed bg-gray-300" : ""}`}
                    >
                      <td className="py-2 px-4 border-b">
                        {product.productId}
                      </td>
                      <td className="py-2 px-4 border-b">
                        <div className="flex items-center gap-2">
                          {selectProduct?.productId === product.productId && (
                            <CheckCircle2 className="w-4 h-4 text-blue-500" />
                          )}
                          <span className="text-sm text-gray-900 font-medium">
                            {product.productName}
                          </span>
                        </div>
                      </td>
                      <td className="py-2 px-4 border-b">
                        <span
                          className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                            product.stockQuantity > 10
                              ? "bg-green-100 text-green-800"
                              : product.stockQuantity > 0
                              ? "bg-yellow-100 text-yellow-800"
                              : "bg-red-100 text-red-800"
                          }`}
                        >
                          {product.stockQuantity}
                        </span>
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
  );
};

export default ProductList;
