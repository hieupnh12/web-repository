import React, { useEffect, useRef, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import {
  getFullProductVersions,
  loadCustomersV2,
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
    products: [],
  });

  const [usedImeis, setUsedImeis] = useState([]); // ✅ IMEI đã dùng
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);

  const productFormRef = useRef();
  const exportTableRef = useRef();
  const [editProduct, setEditProducts] = useState(null);

  const { data } = useQuery({
    queryKey: ["products", { page, limit: 20, search }],
    queryFn: getFullProductVersions,
    keepPreviousData: true,
  });

  const { data: customers = { data: [] } } = useQuery({
    queryKey: ["customers"],
    queryFn: loadCustomersV2,
  });

  const handleCustomerChange = (customer) => {
    setForm((prev) => ({ ...prev, customer }));
  };

  const handleProductAdd = (product) => {
  setForm((prev) => {
    // Tìm xem có đang sửa sản phẩm cũ không
    const isEditing = editProduct !== null;

    // Nếu đang sửa, tìm sản phẩm cũ
    const oldProduct = isEditing
      ? prev.products.find(
          (p) =>
            p.idProduct === editProduct.idProduct &&
            p.idProductVersion === editProduct.idProductVersion
        )
      : null;

    const oldImeis = oldProduct?.imeis || [];
    const newImeis = product.imeis;

    // Tìm IMEI bị trùng (với những sản phẩm khác, đã dùng)
    const duplicateImeis = newImeis.filter((imei) => {
      return (
        usedImeis.includes(imei) && // IMEI đã dùng
        !oldImeis.includes(imei) // nhưng không phải IMEI của sản phẩm đang sửa
      );
    });

    if (duplicateImeis.length > 0) {
      alert(`IMEI đã tồn tại và sẽ bị bỏ qua: ${duplicateImeis.join(", ")}`);
    }

    // Danh sách IMEI thực sự được thêm
    const filteredImeis = newImeis.filter(
      (imei) => !duplicateImeis.includes(imei)
    );

    if (filteredImeis.length === 0) return prev;

    // Tạo danh sách sản phẩm mới
    let newList;
    if (isEditing) {
      // Nếu đang sửa → cập nhật lại sản phẩm
      newList = prev.products.map((p) => {
        if (
          p.idProduct === editProduct.idProduct &&
          p.idProductVersion === editProduct.idProductVersion
        ) {
          return {
            ...product,
            imeis: filteredImeis,
            quantity: filteredImeis.length,
          };
        }
        return p;
      });

      // Cập nhật usedImeis: bỏ oldImeis cũ, thêm imeis mới
      setUsedImeis((prevImeis) => {
        const removed = prevImeis.filter((imei) => !oldImeis.includes(imei));
        const updated = [...removed, ...filteredImeis];
        return Array.from(new Set(updated)); // tránh trùng lặp
      });
    } else {
      // Nếu thêm mới
      const existingIndex = prev.products.findIndex(
        (p) =>
          p.idProduct === product.idProduct &&
          p.idProductVersion === product.idProductVersion
      );

      if (existingIndex !== -1) {
        newList = [...prev.products];
        newList[existingIndex] = {
          ...newList[existingIndex],
          quantity:
            parseInt(newList[existingIndex].quantity) +
            filteredImeis.length,
          imeis: [
            ...newList[existingIndex].imeis,
            ...filteredImeis,
          ],
        };
      } else {
        newList = [
          ...prev.products,
          {
            ...product,
            quantity: filteredImeis.length,
            imeis: filteredImeis,
          },
        ];
      }

      setUsedImeis((prevImeis) => [
        ...prevImeis,
        ...filteredImeis,
      ]);
    }

    const newTotal = newList.reduce(
      (sum, p) => sum + p.price * p.quantity,
      0
    );

    // Reset editProduct nếu có
    if (isEditing) {
      setEditProducts(null);
    }

    // Reset chọn bảng
    if (exportTableRef.current) {
      exportTableRef.current.setItemChoose(null);
    }

    return { ...prev, products: newList, total: newTotal };
  });
};


  // useEffect(() => {
  //   if (exportTableRef.current?.itemChoose) {
  //     const chosenProduct = data?.data.find(
  //       (p) =>
  //         p.idProduct === exportTableRef.current.itemChoose.idProduct &&
  //         p.idProductVersion ===
  //           exportTableRef.current.itemChoose.idProductVersion
  //     );

  //     if (chosenProduct) {
  //       setSelectedProduct({
  //         ...chosenProduct,
  //         options: chosenProduct.options.map((opt) => ({
  //           ...opt,
  //           imeiList: exportTableRef.current.itemChoose.imeis.map((imei) => ({
  //             imei,
  //             status: "in-stock",
  //           })),
  //         })),
  //       });
  //     }
  //   } else {
  //     setSelectedProduct(null);
  //   }
  // }, [data, exportTableRef.current?.itemChoose]);

  const handleSubmit = () => {
    console.log("Submit đơn hàng:", form);
    // Nếu muốn reset IMEI sau khi submit:
    // setUsedImeis([]);
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
          <div className="flex flex-col md:flex-row gap-2">
            <ProductList
              products={data?.data || []}
              onSearch={handleSearch}
              onSelect={setSelectedProduct}
            />
            <ProductForm
              ref={productFormRef}
              selected={selectedProduct}
              editProduct={editProduct}
              onAdd={handleProductAdd}
              onEditImeis={handleEditImeis}
              usedImeis={usedImeis}
              setEditProduct={setEditProducts}
            />
          </div>

          {/* Middle Buttons */}
          <div className="flex flex-wrap gap-2">
            <button
              onClick={handleEditProduct}
              className="flex-1 min-w-[150px] bg-yellow-400 text-white px-4 py-2 rounded"
            >
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
          <ExportTable
            products={form.products}
            itemChoose={editProduct}
            setItemChoose={setEditProducts}
          />
        </div>
      </div>
    </div>
  );
};

export default ExportPage;
