import React, { useEffect, useState } from "react";
import ImportSummary from "./ImportSummary";
import ProductList from "./ProductListLeft";
import ProductForm from "./ProductFormBet";
import ImportTable from "./ImportTableBot";


export default function ImportPage() {
  // Tạo khuôn để gửi dữ liệu tạo phiếu nhập  
  const [importInfo, setImportInfo] = useState({
     import_id: "",
    supplierName: "",
    staffName: "",
    totalAmount: "",
    product: []
  });
  
  // Tạo id phiếu nhập đầu tiên.
  const loadIdImport = async () => {
    try {
      // const idResp = 
      // setImportInfo(importInfo.import_id === idResp);
    } catch (error) {
      console.log("Lỗi tạo id phiếu", error);
    }
  }

  // Load Supplier
  const loadSupplier = async () => {
    try {
      
    } catch (error) {
      
    }
  }
  useEffect(() => {
    // loadIdImport();
  }, []);

  return (
    <div className="flex-1 bg-[#EFF6FF] rounded-2xl p-2 text-sm font-medium text-gray-700">
      {/* Top Side: Export Summary */}
      <div className="w-full lg:w-4/4 bg-white rounded-lg shadow p-3 flex flex-col justify-between mb-2">
        <ImportSummary />
      </div>

      <div className="flex flex-col lg:flex-row gap-2">
        {/* Left Side: Product List & Form */}
        <div className="w-full lg:w-4/4 space-y-2">
          <div className="flex flex-col md:flex-row gap-2">
            {/* <ProductList
            products={data?.data || []}
            onSearch={handleSearch}
            onSelect={setSelectedProduct}
            />
            <ProductForm /> */}
          </div>

          {/* Middle Buttons */}
          <div className="flex flex-wrap gap-2">
            <button
              disabled
              className="flex-1 min-w-[150px] bg-white text-white px-4 py-2 rounded"
            >
              Sửa sản phẩm
            </button>
            <button
              disabled
              className="flex-1 min-w-[150px] bg-white-500 text-white px-4 py-2 rounded"
            >
              Nhập Excel
            </button>
            <button
            // onClick={handleDeleteButtonClick}
            // disabled={!editProduct} // 👈 phải là "!" để vô hiệu hóa khi KHÔNG có editProduct
            // className={`flex-1 min-w-[150px] px-4 py-2 rounded transition
            //    ${
            //      editProduct
            //        ? "bg-red-500 text-white"
            //        : "bg-gray-300 text-gray-500"
            //    }
            //   `}
            >
              Xoá sản phẩm
            </button>
            <button
            // onClick={handleAddButtonClick}
            // className="flex-1 min-w-[150px] bg-blue-500 text-white px-4 py-2 rounded"
            // disabled={!selectedProduct}
            >
              Thêm sản phẩm
            </button>
          </div>

          {/* Table */}
          {/* <ImportTable
          products={form.products}
          itemChoose={editProduct}
          setItemChoose={setEditProducts}
          /> */}
        </div>
      </div>
    </div>
  );
}
