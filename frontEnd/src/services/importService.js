 import BASE_URL from "../api";
import { DELETE, GET, POST, PUT } from "../constants/httpMethod";


// lấy danh sách khách hàng (trả về tất cả)

// lấy danh sách phiếu import
export const takeImport = () => {
    const responds = BASE_URL[GET]("importReceipt");
    return responds;
}

export const takeImportDetail = async (idImport) => {
    const [detailsRes, itemsRes, productsRes, productVersionRes] = await Promise.all([
    BASE_URL[GET](`importDetail`),
    BASE_URL[GET]("productItem"),
    BASE_URL[GET]("product"),
    BASE_URL[GET]("productVersion")
  ]);

  const details = detailsRes.data.result;
  const items = itemsRes.data.result;
  const products = productsRes.data;
  const productVersion = productVersionRes.data.result;

  console.log("prodd", products);
  
  const fullData = details
      .filter(detail => detail.import_id === idImport)
      .map(detail => {
        // Find product and product Ver
        const productVer = productVersion.find(item => item.versionId === detail.productVersionId)
        const product = products.find(item => item.productName === productVer.productName);
        const imeis = items.filter(item => item.productVersionId === detail.productVersionId && item.importId === detail.import_id);
        return {
          ...detail,
          productVer,
          product,
          imeis
        }
      })
    return {
      idImport,
      data: fullData
    }
}

export const fetchFullImportReceipts = async () => {
  const [receiptRes, detailsRes, itemsRes, productsRes, productVersionRes] = await Promise.all([
    BASE_URL[GET](`importReceipt`),
    BASE_URL[GET](`importDetail`),
    BASE_URL[GET]("productItem"),
    BASE_URL[GET]("product"),
    BASE_URL[GET]("productVersion")
  ]);

  const receipts = receiptRes.data.result;
  console.log("receipt", receipts);
  const details = detailsRes.data.result;
  console.log("det", details); 
  const items = itemsRes.data.result;
  console.log("item", items);

  const products = productsRes.data;
    console.log("products", products);
const productVersion = productVersionRes.data.result;
    console.log("productsVersion", productVersion);


  // Gộp dữ liệu
  const fullData = receipts.map((receipt) => {
  // Lọc các detail có cùng import_id
  const receiptDetails = details
    .filter(detail => detail.import_id === receipt.import_id)
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


  return fullData;
};