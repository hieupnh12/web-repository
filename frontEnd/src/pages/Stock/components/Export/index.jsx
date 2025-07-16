import React, { useEffect, useRef, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import {
  getFullProductVersions,
  loadCustomersV2,
  takeConfirmExport,
  takeIdCreateExport,
} from "../../../../services/exportService";
import ProductForm from "./ProductFormBet";
import ProductList from "./ProductListLeft";
import ExportTable from "./ExportTableBot";
import ExportSummary from "./ExportSumary";
import { pre } from "framer-motion";
import { takeProduct } from "../../../../services/productService";
import { takeCustomer, takeCustomerAll } from "../../../../services/customerService";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

const ExportPage = () => {
  const [form, setForm] = useState({
    code: "",
    user: "",
    customer: null,
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
    const navigate = useNavigate();
  
  const {
    data: productData,
    isLoading,
    isError,
    refetch,
  } = useQuery({
    queryKey: ["product"],
    queryFn: async () => {
      const resp = await takeProduct();
      if (!resp?.data?.result.content) {
        throw new Error("Invalid response format");
      }
      console.log("dffđssd", resp);

      return resp.data.result.content;
    },
    staleTime: 1000 * 60 * 5,
    gcTime: 1000 * 60 * 10,
    onError: (error) => {
      console.error("Error fetching imports:", error);
    },
  });

  const { data: customers = { data: [] } } = useQuery({
    queryKey: ["customers"],
    queryFn: async () => {
      const resp = await takeCustomer(0, 20);
      if (!resp?.data?.result.content) {
        throw new Error("Invalid response format");
      }
      console.log("dff", resp.data.result.content);

      return resp.data.result.content;
    },
    staleTime: 1000 * 60 * 5,
    gcTime: 1000 * 60 * 10,
    onError: (error) => {
      console.error("Error fetching imports:", error);
    },
  });
  // const { data: customers = { data: [] } } = useQuery({
  //   queryKey: ["customers"],
  //   queryFn: takeCustomerAll,
  // });

   // Kiểm tra và lấy mã phiếu xuất từ localStorage
  const loadIdImport = async () => {
    try {
      // Kiểm tra mã phiếu trong localStorage
      const savedExportId = localStorage.getItem("pending_export_id");
      if (savedExportId) {
        // Nếu có mã phiếu, sử dụng nó
        setForm((prev) => ({
          ...prev,
          code: savedExportId,
        }));
      } else {
        // Nếu không có, tạo phiếu mới
        const data = {
          exportReceipt: {
            customerId: "",
            totalAmount: 0,
            status: 0,
          },
          product: [],
        };
        const idResp = await takeIdCreateExport(data);
        console.log("Phieus trả về nhjap",idResp);
        
        if (idResp.status === 200) {
          const newExportId = idResp.data.result.export_id; // Giả sử API trả về exportId
          setForm((prev) => ({
            ...prev,
            code: newExportId,
          }));
          // Lưu mã phiếu vào localStorage
          localStorage.setItem("pending_export_id", newExportId);
        }
      }
    } catch (error) {
      console.log("Lỗi khi kiểm tra/tạo mã phiếu", error);
    }
  };
  const staffInfo = useSelector((state) => state.auth.userInfo);

  useEffect(() => {
      setForm((prev) => ({
            ...prev,
            user: staffInfo?.fullName, // thay đổi mã code tại đây
          }));
      loadIdImport();
    }, []);

  console.log("SelectPro", selectedProduct);
  console.log("customer", customers);


  const handleCustomerChange = (customer) => {
    setForm((prev) => ({ ...prev, customer }));
  };

  const handleProductAdd = (product) => {
    // Tìm imei trước khi thêm để set imei để tránh sót imei khi tạo mới (trong cùng 1 version khi thêm mới lại cái đã thêm bằng cách bớt đi 1 imei thì phải xóa đi tất cả imei có trong version đó rồi ms tạo ds imei mới)
    const imeiDup = form.products?.find(
      (p) =>
        p.productId === product.productId && p.versionId === product.versionId
    );
    // console.log("dúpđ", imeiDup);
    setUsedImeis((prev) =>
      prev.filter((imei) => !imeiDup?.imeis?.includes(imei))
    );

    setForm((prev) => {
      // Tìm xem có đang sửa sản phẩm cũ không
      const isEditing = editProduct !== null;

      // Nếu đang sửa, tìm sản phẩm cũ
      const oldProduct = isEditing
        ? prev.products.find(
            (p) =>
              p.productId === editProduct.productId &&
              p.versionId === editProduct.versionId
          )
        : null;

      // gán cũ hoặc k có
      const oldImeis = oldProduct?.imeis || [];
      const newImeis = product.imeis;
      const filteredImeis = newImeis;

      if (filteredImeis.length === 0) return prev;

      // Tạo danh sách sản phẩm mới
      let newList;
      if (isEditing) {
        // Nếu đang sửa → cập nhật lại sản phẩm
        newList = prev.products.map((p) => {
          if (
            p.productId === editProduct.productId &&
            p.versionId === editProduct.versionId
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
            p.productId === product.productId &&
            p.versionId === product.versionId
        );

        if (existingIndex !== -1) {
          newList = [...prev.products];
          console.log("full nay", newList);

          newList[existingIndex] = {
            ...newList[existingIndex],
            quantity: parseInt(filteredImeis.length),
            imeis: filteredImeis,
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

        setUsedImeis((prevImeis) => [...prevImeis, ...filteredImeis]);
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

  const handleSubmitExport = async () => {
    try {
      const payload = {
        exportId: form.code,
        exportReceipt: {
          customerId: form.customer.customerId,
          totalAmount: form.total,
          status: 1,
        },
        product: form.products.map((p) => ({
          productVersionId: p.versionId,
          quantity: p.quantity,
          unitPrice: p.price,
          imei: p.imeis.map((imei) => ({
            imei,
            productVersionId: p.versionId,
          })),
        })),
      };
      console.log("data", payload);

      const res = await takeConfirmExport(payload);

      if (res.status === 200) {
        alert("Xuất hàng thành công!");
        // Xóa mã phiếu và dữ liệu liên quan khỏi localStorage sau khi xuất thành công
        localStorage.removeItem("pending_export_id");
        localStorage.removeItem("import_info");
        localStorage.removeItem("selected_products");
        navigate("/manager/import");
        toast.success("Nhập hàng thành công!");
        
      }
    } catch (err) {
      console.log("Submit lỗi", err);
      alert("Gặp lỗi khi xuất hàng: " + err);
    }

  };

  const handleSearch = (searchText) => {
    setSearch(searchText);
    setPage(1);
  };


  const handleAddButtonClick = () => {
    if (productFormRef.current) {
      productFormRef.current.handleAdd();
    }
  };

  const handleDeleteButtonClick = () => {
    if (editProduct) {
      setForm((pre) => ({
        ...pre,
        total: pre.total - editProduct.price * editProduct.quantity,
        products: pre.products.filter(
          (item) => item.productId !== editProduct.productId
        ),
      }));
      setUsedImeis((prev) =>
        prev.filter((imei) => !editProduct.imeis.includes(imei))
      );
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
          onSubmit={handleSubmitExport}
          customers={customers}
        />
      </div>

      <div className="flex flex-col lg:flex-row gap-2">
        {/* Left Side: Product List & Form */}
        <div className="w-full lg:w-4/4 space-y-2">
          <div className="flex flex-col md:flex-row gap-2">
            <ProductList
              products={productData || []}
              onSearch={handleSearch}
              onSelect={setSelectedProduct}
              selectedProduct={selectedProduct}
              editProduct={editProduct}
            />
            <ProductForm
              ref={productFormRef}
              selected={selectedProduct}
              editProduct={editProduct}
              onAdd={handleProductAdd}
              // onEditImeis={handleEditImeis}
              usedImeis={usedImeis}
              setEditProduct={setEditProducts}
              setImei={setUsedImeis}
            />
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
              onClick={handleDeleteButtonClick}
              disabled={!editProduct} // 👈 phải là "!" để vô hiệu hóa khi KHÔNG có editProduct
              className={`flex-1 min-w-[150px] px-4 py-2 rounded transition 
                 ${
                   editProduct
                     ? "bg-red-500 text-white"
                     : "bg-gray-300 text-gray-500"
                 }
                `}
            >
              Xoá sản phẩm
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
