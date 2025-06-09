import React, { useEffect, useState } from "react";
import {
  fetchProducts,
  fetchSuppliers,
  loadCustomers,
  loadProductVerson,
} from "../../../../services/exportService";
import ProductForm from "./ProductFormBet";
import ProductList from "./ProductListLeft";
import ExportTable from "./ExportTableBot";
import ExportSummary from "./ExportSumary";

const ExportPage = () => {
  const [form, setForm] = useState({
    code: "PX001",
    user: { id: 1, name: "Nhất Sinh" },
    customer: null,
    supplier: null,
    total: 0,
    products: [], // danh sách sản phẩm đã thêm
  });
  const [products, setProducts] = useState([]);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [customers, setCustomers] = useState([]);

  useEffect(() => {
    loadProductVerson().then((res) => setProducts(res.data));
    // fetchSuppliers().then((res) => setSupplierList(res.data));
    loadCustomers().then((res) => setCustomers(res.data));
  }, []);

  console.log(products);

  // Set form
  const handleCustomerChange = (customer) => {
    setForm(prev => ({ ...prev, customer }));
  };

    // Thêm sản phẩm
   const handleProductAdd = (product) => {
    const newList = [...form.products, product];
    const newTotal = newList.reduce((sum, p) => sum + p.price * p.quantity, 0);
    setForm(prev => ({ ...prev, products: newList, total: newTotal }));
  };

  const handleSubmit = () => {
    // Gửi toàn bộ dữ liệu lên server
    console.log("Submit đơn hàng:", form);
  };

  return (
    <div className="flex-1 bg-[#EFF6FF] rounded-2xl p-2 text-xs">
      {/* Top Side: Export Summary */}
        <div className="w-full lg:w-4/4 bg-white rounded-lg shadow p-3 flex flex-col justify-between mb-2">
          <ExportSummary
            code={form.code}
            user={form.user}
            customer={form.customer}
            onCustomerChange={handleCustomerChange}
            total={form.total}
            onSubmit={handleSubmit}
            customers={customers}
          />
        </div>
      <div className="flex flex-col lg:flex-row gap-2">
        {/* Left Side: Product List & Form */}
        <div className="w-full lg:w-4/4 space-y-2">
          {/* Product List + Form */}
          <div className="flex flex-col md:flex-row gap-2">
            <ProductList products={products} onSelect={setSelectedProduct} />
            <ProductForm selected={selectedProduct} />
          </div>

          {/* Middle: Buttons */}
          <div className="flex flex-wrap gap-2">
            <button className="flex-1 min-w-[150px] bg-yellow-400 text-white px-4 py-2 rounded">
              Sửa sản phẩm
            </button>
            <button className="flex-1 min-w-[150px] bg-red-500 text-white px-4 py-2 rounded">
              Xoá sản phẩm
            </button>
            
            <button className="flex-1 min-w-[150px] bg-green-500 text-white px-4 py-2 rounded">
              Nhập Excel
            </button>
            <button className="flex-1 min-w-[150px] bg-blue-500 text-white px-4 py-2 rounded">
              Thêm sản phẩm
            </button>
          </div>

          {/* Table */}
          <ExportTable />
        </div>
      </div>
    </div>
  );
};

export default ExportPage;
