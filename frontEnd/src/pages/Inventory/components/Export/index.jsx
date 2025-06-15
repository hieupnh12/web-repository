import React, { useEffect, useRef, useState } from "react";
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
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const productFormRef = useRef();
  const exportTableRef = useRef();

// Tạo danh sách IMEI đã sử dụng
  const usedImeis = form.products.flatMap((product) => product.imeis);

  const { data } = useQuery({
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
    setForm((prev) => ({ ...prev, customer }));
  };

  // Thêm sản phẩm
  const handleProductAdd = (product) => {
    const duplicateImeis = product.imeis.filter((imei) =>
      usedImeis.includes(imei)
    );
    if (duplicateImeis.length > 0) {
      alert(`IMEI trùng lặp: ${duplicateImeis.join(", ")}`);
      return;
    }

    setForm((prev) => {
      const existingProductIndex = prev.products.findIndex(
        (p) =>
          p.idProduct === product.idProduct &&
          p.idProductVersion === product.idProductVersion
      );
      let newList;
      if (existingProductIndex !== -1) {
        newList = [...prev.products];
        newList[existingProductIndex] = {
          ...newList[existingProductIndex],
          quantity:
            parseInt(newList[existingProductIndex].quantity) +
            parseInt(product.quantity),
          imeis: [...newList[existingProductIndex].imeis, ...product.imeis],
        };
      } else {
        newList = [...prev.products, product];
      }
      const newTotal = newList.reduce(
        (sum, p) => sum + p.price * p.quantity,
        0
      );
      return { ...prev, products: newList, total: newTotal };
    });
    // Xóa lựa chọn sau khi thêm
    if (exportTableRef.current) {
      exportTableRef.current.setItemChoose(null);
    }
  };


  // Đồng bộ selectedProduct khi itemChoose thay đổi
  useEffect(() => {
    if (exportTableRef.current?.itemChoose) {
      const chosenProduct = data?.data.find(
        (p) => p.idProduct === exportTableRef.current.itemChoose.idProduct &&
          p.idProductVersion === exportTableRef.current.itemChoose.idProductVersion
      );
      if (chosenProduct) {
        setSelectedProduct({
          ...chosenProduct,
          options: chosenProduct.options.map((opt) => ({
            ...opt,
            imeiList: exportTableRef.current.itemChoose.imeis.map((imei) => ({
              imei,
              status: "in-stock",
            })),
          })),
        });
      }
    } else {
      setSelectedProduct(null);
    }
  }, [data, exportTableRef.current?.itemChoose]);

  const handleSubmit = () => {
    // Gửi toàn bộ dữ liệu lên server
    console.log("Submit đơn hàng:", form);
  };

  const handleSearch = (searchText) => {
    setSearch(searchText);
    setPage(1);
  };

  const handleEditImeis = (updatedProduct) => {
    setForm((prev) => {
      const newList = prev.products.map((p) =>
        p.idProduct === updatedProduct.idProduct &&
        p.idProductVersion === updatedProduct.idProductVersion
          ? updatedProduct
          : p
      );
      const newTotal = newList.reduce(
        (sum, p) => sum + p.price * p.quantity,
        0
      );
      return { ...prev, products: newList, total: newTotal };
    });
    // Xóa lựa chọn sau khi sửa
    if (exportTableRef.current) {
      exportTableRef.current.setItemChoose(null);
    }
  };

  const handleEditProduct = () => {
    if (exportTableRef.current?.itemChoose) {
      if (productFormRef.current) {
        productFormRef.current.handleEditImeis();
      }
    } else {
      alert("Vui lòng chọn một sản phẩm để sửa!");
    }
  };

  // const handlePageChange = (newPage) => {
  //   setPage(newPage);
  // };

  const handleAddButtonClick = () => {
    if (productFormRef.current) {
      productFormRef.current.handleAdd();
    }
  };

  const handleDeleteButtonClick = () => {
    if (exportTableRef.current) {
      exportTableRef.current.setItemChoose(null);
    }
  };


  return (
    <div className="flex-1 bg-[#EFF6FF] rounded-2xl p-2 text-sm font-medium text-gray-700">
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
            <ProductList
              products={data?.data || []}
              onSearch={handleSearch}
              onSelect={setSelectedProduct}
            />
            <ProductForm
              ref={productFormRef}
              selected={selectedProduct}
              editProduct={exportTableRef.current?.itemChoose}
              onAdd={handleProductAdd}
              onEditImeis={handleEditImeis}
              usedImeis={usedImeis}
            />
          </div>

          {/* Middle: Buttons */}
          <div className="flex flex-wrap gap-2">
            <button 
            onClick={handleEditProduct}
            className="flex-1 min-w-[150px] bg-yellow-400 text-white px-4 py-2 rounded">
              Sửa sản phẩm
            </button>
            <button
              onClick={handleDeleteButtonClick}
              disabled={!selectedProduct}
              className="flex-1 min-w-[150px] bg-red-500 text-white px-4 py-2 rounded"
            >
              Xoá sản phẩm
            </button>

            <button className="flex-1 min-w-[150px] bg-green-500 text-white px-4 py-2 rounded">
              Nhập Excel
            </button>
            <button
              onClick={handleAddButtonClick}
              className="flex-1 min-w-[150px] bg-blue-500 text-white px-4 py-2 rounded"
              disabled={!selectedProduct}
            >
              Thêm sản phẩm
            </button>
          </div>

          {/* Table */}
          <ExportTable products={form.products} ref={exportTableRef}/>
        </div>
      </div>
    </div>
  );
};

export default ExportPage;
