import React, { useEffect, useReducer, useState } from "react";
import ImportSummary from "./ImportSummary";
import ProductList from "./ProductListLeft";
import ProductForm from "./ProductFormBet";
import ImportTable from "./ImportTableBot";
import { takeSupplier } from "../../../../services/supplierService";
import { useSelector } from "react-redux";
import { useQuery } from "@tanstack/react-query";
import { Plus, Trash2 } from "lucide-react";
import { data, select } from "framer-motion";
import { takeConfirmImport, takeIdCreateImport } from "../../../../services/importService";
import { useNavigate, useLocation } from 'react-router-dom';
import { takeProduct } from "../../../../services/productService";

function importReducer(state, action) {
  switch (action.type) {
    case "SET_SUPPLIER":
      return { ...state, supplierName: action.payload };

    case "SET_STAFF":
      return { ...state, staffName: action.payload };

    case "SET_IMPORT_ID":
      return { ...state, import_id: action.payload };

    case "ADD_PRODUCT":
      return { ...state, product: [...state.product, action.payload] };

    case "UPDATE_PRODUCT":
      return {
        ...state,
        product: state.product.map((p, i) =>
          i === action.index ? { ...p, ...action.payload } : p
        ),
      };

    case "ADD_IMEI":
      return {
        ...state,
        product: state.product.map((p, i) =>
          i === action.index
            ? {
                ...p,
                importRequest3: [...(p.importRequest3 || []), action.payload],
              }
            : p
        ),
      };

    case "REMOVE_PRODUCT":
      return {
        ...state,
        product: state.product.filter(
          (item) =>
            !(
              item.productId === action.payload.productId &&
              item.versionId === action.payload.versionId
            )
        ),
      };

    case "ADD_IMPORT_DETAIL": {
      return {
        ...state,
        product: addOrUpdateProductList(state.product, action.payload),
      };
    }

    case "CALCULATE_TOTAL":
      const total = state.product.reduce((sum, item) => {
        const price = Number(item.importPrice) || 0;
        const qty = Number(item.quantity) || 0;
        return sum + price * qty;
      }, 0);
      return { ...state, totalAmount: total };

    case "RESET":
      return initialState;

    default:
      return state;
  }
}

const initialState = {
  import_id: "",
  supplierName: "",
  staffName: "",
  totalAmount: 0,
  product: [],
};

function addOrUpdateProductList(productList, newProduct) {
  const {
    productId,
    versionId,
    quantity,
    imeis,
    configuration = [],
  } = newProduct;

  const existingIndex = productList.findIndex(
    (item) => item.productId === productId && item.versionId === versionId
  );

  if (existingIndex !== -1) {
    const updatedList = [...productList];
    const existingItem = updatedList[existingIndex];

    updatedList[existingIndex] = {
      ...existingItem,
      quantity: quantity,
      imeis: imeis,
    };

    return updatedList;
  } else {
    return [...productList, newProduct];
  }
}

function addOrUpdateSelectedProduct(list, newItem) {
  const { select, productFormData } = newItem;

  const existingIndex = list.findIndex(
    (item) =>
      item.productFormData.productId === select.productId &&
      item.productFormData.versionId === productFormData.versionId
  );

  if (existingIndex !== -1) {
    const updatedList = [...list];
    updatedList[existingIndex] = {
      select,
      productFormData, // ghi đè productFormData mới
    };
    return updatedList;
  } else {
    return [...list, newItem];
  }
}

const productDatas = [
  {
    productId: 20,
    productName: "Nokia 1277",
    status: "active",
    stockQuantity: 200,
    id: "0b1c2d3e-4f5a-6b7c-8d9e-0f1a2b3c4d5e",
    options: [
      {
        productVersionId: "8eca73c3-925e-4bab-8c9b-b2f2afcc5210",
        colorName: "Gray",
        ramName: "64GB",
        romName: "256GB",
        importPrice: 3000000,
        exportPrice: 3500000,
        stockStatus: "available",
        itemCount: 2,
      },
      {
        productVersionId: "b5319337-02e6-49da-9cea-b994f224b30d",
        colorName: "Red",
        ramName: "8GB",
        romName: "128GB",
        importPrice: 2500000,
        exportPrice: 3200000,
        stockStatus: "available",
        itemCount: 1,
      },
    ],
  },
  {
    productId: 21,
    productName: "Nokia 1277",
    status: "active",
    stockQuantity: 200,
    id: "0b1c2d3e-4f5a-6b7c-8d9e-0f1a2b3c4d5e",
    options: [
      {
        productVersionId: "8eca73c3-925e-4bab-8c9b-b2f2afcc5210",
        colorName: "Gray",
        ramName: "64GB",
        romName: "256GB",
        importPrice: 3000000,
        exportPrice: 3500000,
        stockStatus: "available",
        itemCount: 2,
      },
      {
        productVersionId: "b5319337-02e6-49da-9cea-b994f224b30d",
        colorName: "Red",
        ramName: "8GB",
        romName: "128GB",
        importPrice: 2500000,
        exportPrice: 3200000,
        stockStatus: "available",
        itemCount: 1,
      },
    ],
  },
];

export default function ImportPage() {
  // Tạo khuôn để gửi dữ liệu tạo phiếu nhập
  const [importInfo, dispatch] = useReducer(importReducer, initialState, () => {
    const saved = localStorage.getItem("import_info");
    return saved ? JSON.parse(saved) : initialState;
  });
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [suppliers, setSuppliers] = useState(null);
  const staffInfo = useSelector((state) => state.auth.userInfo);
  const [searchProduct, setSearchProduct] = useState(null);
  const [editProduct, setEditProduct] = useState(null);
  const [productFormData, setProductFormData] = useState(null); // dữ liệu tạm để nhập
  const [listProductSelected, setListProductSelected] = useState([]);
  const navigate = useNavigate();

  console.log("imp", importInfo);

  // Tạo id phiếu nhập đầu tiên.
  const loadIdImport = async () => {
    try {
      const data = {
        importReceipt: {
          staffId: "",
          totalAmount: 0,
          status: 0,
        },
        product: [],
      };
      let importId = importInfo.import_id;
      if (!importId) {
        const idResp = await takeIdCreateImport(data);
        console.log(idResp);
        if (idResp.status === 200) {
          dispatch({
            type: "SET_IMPORT_ID",
            payload: idResp.data.result.import_id,
          });
        }
      }
    } catch (error) {
      console.log("Lỗi tạo id phiếu", error);
    }
  };

  // Load Supplier
  const loadSupplier = async () => {
    try {
      const supplierResp = await takeSupplier();
      if (supplierResp.status === 200) {
        setSuppliers(supplierResp.data.result);
      }
    } catch (error) {
      console.log("load supplier lỗi", error);
    }
  };

  // const { data: productData } = useQuery({
  //   queryKey: ["products"],
  //   queryFn: takeProduct,
  //   keepPreviousData: true,
  // });
  const {
      data: productData,
      isLoading,
      isError,
      refetch,
    } = useQuery({
      queryKey: ['product'],
      queryFn: async () => {
        const resp = await takeProduct();
        if (!resp?.data?.result) {
          throw new Error('Invalid response format');
        }
        console.log("dff",resp);
        
        return resp.data.result;
      },
      staleTime: 1000 * 60 * 5,
      gcTime: 1000 * 60 * 10,
      onError: (error) => {
        console.error('Error fetching imports:', error);
      },
    });

  console.log("product data", productData);

  const handleSearch = (searchText) => {
    // setSearch(searchText);
    // setPage(1);
  };

  // Tự động lưu importInfo vào localStorage mỗi khi thay đổi
  useEffect(() => {
    localStorage.setItem("import_info", JSON.stringify(importInfo));
  }, [importInfo]);

  //  Lưu listProductSelected vào localStorage mỗi khi thay đổi
  useEffect(() => {
    if (Array.isArray(listProductSelected) && listProductSelected.length > 0) {
    localStorage.setItem("selected_products", JSON.stringify(listProductSelected));
    console.log("Saved from session:", listProductSelected);
  }
  }, [listProductSelected]);
const location = useLocation();

// Load lại khi quay lại đúng route
useEffect(() => {
  if (location.pathname === "/manager/import/addimport") {
    const saved = localStorage.getItem("selected_products");
    if (saved) {
      const parsed = JSON.parse(saved);
      if (Array.isArray(parsed) && parsed.length > 0) {
        setListProductSelected(parsed);
        console.log("Quay lại /addimport, đã load từ localStorage:", parsed);
      } else {
        console.log("Dữ liệu localStorage là rỗng.");
      }
    } else {
      console.log("Không tìm thấy selected_products trong localStorage.");
    }
  }
}, [location.pathname]);

  //Load listProductSelected nếu bạn vẫn muốn lưu riêng
  useEffect(() => {
    if (staffInfo?.fullName) {
      dispatch({ type: "SET_STAFF", payload: staffInfo.fullName });
    }
    loadIdImport();
  }, []);

  useEffect(() => {
    if (editProduct && productData.length > 0) {
      const product = productData.find(
        (p) => p.productId === editProduct.productId
      );
      console.log("prod", product);

      if (product) {
        setSelectedProduct(product);
      }
    }
  }, [editProduct]);

  const handleAddProduct = () => {
    if (!productFormData) return;

    const {
      productId,
      versionId,
      importMethod,
      quantity,
      imeis,
      configuration,
      productName,
      startImei,
    } = productFormData;

    // Validate dữ liệu
    if (
      !productId ||
      !versionId ||
      quantity <= 0 ||
      (importMethod === "2" && imeis.length < 1) ||
      (importMethod === "1" && imeis.length < 1)
    ) {
      alert("Vui lòng điền đầy đủ thông tin và kiểm tra số lượng IMEI.");
      return;
    }

    // Tìm importPrice từ productData
    const selectedVersion = productData
      .find((p) => p.productId === productId)
      ?.productVersionResponses.find((v) => v.versionId === versionId);

    if (!selectedVersion) {
      alert("Không tìm thấy phiên bản sản phẩm.");
      return;
    }

    setListProductSelected((prev) =>
      addOrUpdateSelectedProduct(prev, {
        select: selectedProduct,
        productFormData,
      })
    );
    // Dispatch thêm sản phẩm
    dispatch({
      type: "ADD_IMPORT_DETAIL",
      payload: {
        productId,
        versionId,
        importMethod,
        quantity: parseInt(quantity),
        imeis,
        importPrice: selectedVersion.importPrice,
        configuration,
        productName,
        startImei,
      },
    });

    // Tính lại tổng tiền
    dispatch({ type: "CALCULATE_TOTAL" });

    // Reset form
    setEditProduct(null);
    setSelectedProduct(null);
    setProductFormData(null);
  };

  const handleDeleteProductVersion = () => {
    if (!editProduct) return;

    // Xoá sản phẩm theo productId và versionId
    setListProductSelected((prev) =>
      prev.filter(
        (item) =>
          !(
            item.productFormData.productId === editProduct.productId &&
            item.productFormData.versionId === editProduct.versionId
          )
      )
    );
    dispatch({
      type: "REMOVE_PRODUCT",
      payload: {
        productId: editProduct.productId,
        versionId: editProduct.versionId,
      },
    });
    dispatch({ type: "CALCULATE_TOTAL" });
    // Reset lại các state liên quan
    setEditProduct(null);
    setSelectedProduct(null);
    setProductFormData(null);
  };

  const handleSubmitImport = async () => {
    try {
      const payload = {
        importId: importInfo.import_id,
        importReceipt: {
          staffId: importInfo.staffName,
          supplierId: importInfo.supplierName,
          totalAmount: importInfo.totalAmount,
          status: 1,
        },
        product: importInfo.product.map((p) => ({
      productVersionId: p.versionId,
      quantity: p.quantity,
      unitPrice: p.importPrice,
      type: p.importMethod === "2", // "2" -> true, "1" -> false
      imei: p.imeis.map((i) => ({ imei: i })),
    })),
      };
      console.log("data", payload);

      const res = await takeConfirmImport(payload);

      if (res.status === 200) {
        alert("Nhập hàng thành công!");
        localStorage.removeItem("import_info");
        localStorage.removeItem("selected_products");
        dispatch({ type: "RESET" });
        setListProductSelected([]);
        navigate('/manager/import');
      }
    } catch (err) {
      console.log("Submit lỗi", err);
      
      alert("Gặp lỗi khi nhập hàng."+ err);
    }
  };
  

  return (
    <div className="flex-1 bg-[#EFF6FF] rounded-2xl p-2 text-sm font-medium text-gray-700">
      {/* Top Side: Export Summary */}
      <div className="w-full lg:w-4/4 bg-white rounded-lg shadow p-3 flex flex-col justify-between mb-2">
        <ImportSummary
          chooseSupplier={loadSupplier}
          dispatch={dispatch}
          suppliers={suppliers}
          importInfo={importInfo}
          onSubmit={handleSubmitImport}
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
              selectProduct={selectedProduct}
              editProduct={editProduct}
            />
            <ProductForm
              selected={selectedProduct}
              setSelectedProduct={setSelectedProduct}
              formData={productFormData}
              setFormData={setProductFormData}
              listProductsSelected={listProductSelected}
              editProduct={editProduct}
              setEditProduct={setEditProduct}
              onAddProduct={handleAddProduct}
            />
          </div>

          {/* Middle Buttons */}
          <div className="flex justify-end w-full">
            <div className="flex flex-wrap gap-2 w-full lg:w-[50%] lg:justify-end">
              {/* Delete Product Button */}
              <button
                onClick={handleDeleteProductVersion}
                disabled={!editProduct}
                className={`flex-1 min-w-[150px] flex items-center justify-center gap-2 px-4 py-2 rounded-md transition-colors duration-200 ${
                  editProduct
                    ? "bg-red-500 text-white hover:bg-red-600"
                    : "bg-gray-100 text-gray-400 cursor-not-allowed"
                }`}
              >
                <Trash2 size={18} />
                Xoá sản phẩm
              </button>
              {/* Add/Update Product Button */}

              <button
                onClick={handleAddProduct}
                disabled={
                  editProduct
                    ? !productFormData?.versionId
                    : !selectedProduct || !productFormData?.versionId
                }
                className={`flex-1 min-w-[150px] flex items-center justify-center gap-2 px-4 py-2 rounded-md transition-colors duration-200 ${
                  (
                    editProduct
                      ? !productFormData?.versionId
                      : !selectedProduct || !productFormData?.versionId
                  )
                    ? "bg-gray-100 text-gray-400 cursor-not-allowed"
                    : "bg-blue-500 text-white hover:bg-blue-600"
                }`}
              >
                <Plus size={18} />
                {editProduct ? "Cập nhật sản phẩm" : "Thêm sản phẩm"}
              </button>
            </div>
          </div>
          {/* Table */}
          <ImportTable
            products={importInfo.product}
            itemChoose={editProduct}
            setItemChoose={setEditProduct}
          />
        </div>
      </div>
    </div>
  );
}
