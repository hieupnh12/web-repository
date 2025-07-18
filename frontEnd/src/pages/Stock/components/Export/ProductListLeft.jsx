import React, { useState } from "react";

const ProductList = ({ products, onSelect, onSearch, selectedProduct, editProduct }) => {
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
      <div className="bg-white rounded shadow p-2 h-[350px] overflow-y-auto">
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
                        selectedProduct?.productId === product.productId
                          ? "bg-gray-300"
                          : ""
                      }${editProduct ? "opacity-50 cursor-not-allowed bg-gray-300" : ""}`}
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
  );
};

export default ProductList;
