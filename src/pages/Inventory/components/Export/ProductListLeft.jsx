import React from 'react';

const ProductList = ({ products, onSelect }) => (
  <div className="md:w-1/2">
    <div className="bg-white rounded shadow p-2 h-[350px] overflow-y-auto">


{/* Bảng data sản phẩm */}
<div className="overflow-x-auto">
        <table className="min-w-full bg-white border border-gray-200">
          <thead>
            <tr className="bg-gray-100">
              <th className="py-2 px-4 border-b">Mã SP</th>
              <th className="py-2 px-4 border-b">Tên sản phẩm</th>
              <th className="py-2 px-4 border-b">Số lượng tồn</th>
            </tr>
          </thead>
          <tbody>
            {products.length > 0 ? (
              products.map((product, index) => (
                <tr key={index} className={index % 2 === 0 ? 'bg-gray-50' : ''}>
                  <td className="py-2 px-4 border-b">{product.maSP}</td>
                  <td className="py-2 px-4 border-b">{product.tenSanPham}</td>
                  <td className="py-2 px-4 border-b">{product.soLuongTon}</td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="3" className="py-2 px-4 border-b text-center">
                  Loading data from API...
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>


    </div>
  </div>
);

export default ProductList;