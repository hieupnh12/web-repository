 import BASE_URL from "../api";
import { DELETE, GET, POST, PUT } from "../constants/httpMethod";
import { takeProductById } from "./productService";


// lấy danh sách khách hàng (trả về tất cả)

// lấy danh sách phiếu import
export const takeImport = (page = 1, size = 7) => {
    const responds = BASE_URL[GET](`importReceipt?page=${page}&size=${size}`);
    return responds;
}

// lấy id Import khi tạo phiếu
export const takeIdCreateImport = (data) => {
    const responds = BASE_URL[POST]("importReceipt/init", data);
    return responds;
}

// xác nhận phiếu
export const takeConfirmImport = (data) => {
    const responds = BASE_URL[POST]("importReceipt/full/confirm", data);
    return responds;
}

export const takeDeleteImportReceipt = (id) => {
  return BASE_URL[DELETE](`importReceipt/${id}`);
};

export const takeSearchImport= ({
  supplierName = '',
  staffName = '',
  importId = '',
  startDate = null,
  endDate = null,
  page = 0,
  size = 7,
}) => {
  if (!supplierName && !staffName && !importId && !startDate && !endDate) { 
    const responds = BASE_URL[GET](`importReceipt?page=${page}&size=${size}`);
    return responds;
  }
  const params = new URLSearchParams({
    ...(supplierName && { supplierName }),
    ...(staffName && { staffName }),
    ...(importId && { importId }),
    ...(startDate && { startDate: startDate.toISOString() }),
    ...(endDate && { endDate: `${endDate.toISOString().split('T')[0]}T23:59:59` }),
    page,
    size,
  });
  
  return BASE_URL[GET](`importReceipt/import-receipts?${params.toString()}`);
};


export const takeImportDetail = async (importDetailList) => {
    const [productVersionRes] = await Promise.all([
    BASE_URL[GET]("productVersion")
  ]);
  const productVersion = productVersionRes.data.result;

  console.log("prodd", productVersion);
  
  const fullData = productVersion
      .filter(detail => detail.productVersionId === importDetailList.productVersionId)
      .map(detail => {
        const product = takeProductById(detail.productId);
        const imeis = importDetailList.imei;
        return {
          ...detail,
          product,
          imeis
        }
      })
    return {
      fullData
    }
}

export const fetchFullImportReceipts = async (page = 0, size = 7) => {
  const [receiptRes, detailsRes, itemsRes, productsRes, productVersionRes] = await Promise.all([
    BASE_URL[GET](`importReceipt?page=${page}&size=${size}`),
    BASE_URL[GET](`importDetail`),
    BASE_URL[GET]("productItem"),
    BASE_URL[GET]("product"),
    BASE_URL[GET]("productVersion")
  ]);

  const receipts = receiptRes.data.result.content;
  console.log("receipt", receipts);

  const items = itemsRes.data.result;
  console.log("item", items);

  const products = productsRes.data;
    console.log("products", products);
const productVersion = productVersionRes.data.result;
    console.log("productsVersion", productVersion);


  // Gộp dữ liệu
  const fullData = receipts.map((receipt) => {
  // Lọc các detail có cùng import_id
  const receiptDetails = receipt.details
    .map(detail => {
      // Tìm productVersion ứng với detail
      const productVer = productVersion.find(
        ver => ver.versionId === detail.productVersionId
      );

      // Tìm product tương ứng với productVersion
      const product = products.find(
        p => p.productName === productVer?.productName
      );

      // Lấy các IMEI sản phẩm trong import đó
      const productItems = items.filter(
        item =>
          item.productVersionId === detail.productVersionId &&
          item.importId === receipt.import_id
      );

      return {
        ...detail,
        productVersion: productVer || null,
        product: product || null,
        productItems: productItems
      };
    });

  return {
    ...receipt,
    details: receiptDetails
  };
});


   // Trả về cả tổng số trang để dùng phân trang frontend
  return {
    data: fullData,
    totalPages: receiptRes.data.result.totalPages,
  };
};