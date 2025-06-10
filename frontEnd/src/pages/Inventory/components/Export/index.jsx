import React, { useEffect, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import {
  getFullProductVersions,
  loadCustomers,
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
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);

  const { data, isLoading, error } = useQuery({
    queryKey: ["products", { page, limit: 20, search }],
    queryFn: getFullProductVersions,
    keepPreviousData: true,
  });

  const { data: customers = { data: [] } } = useQuery({
    queryKey: ["customers"],
    queryFn: loadCustomers,
  });

  // console.log(data?.data);

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

  const handleSearch = (searchText) => {
    setSearch(searchText);
    setPage(1);
  };

  const handlePageChange = (newPage) => {
    setPage(newPage);
  };
  if (isLoading && page === 1) return <div>Loading...</div>;
  if (error) return <div>Error: {error.message}</div>;

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
            customers={customers.data}
          />
        </div>
      <div className="flex flex-col lg:flex-row gap-2">
        {/* Left Side: Product List & Form */}
        <div className="w-full lg:w-4/4 space-y-2">
          {/* Product List + Form */}
          <div className="flex flex-col md:flex-row gap-2">
            <ProductList products={data?.data || []} onSearch={handleSearch} onSelect={setSelectedProduct} />
            <ProductForm selected={selectedProduct} onAdd={handleProductAdd}/>
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
