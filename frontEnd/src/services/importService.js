 import BASE_URL from "../api";
import { DELETE, GET, POST, PUT } from "../constants/httpMethod";


// lấy danh sách khách hàng (trả về tất cả)
export const takeImport = () => {
    const responds = BASE_URL[GET]("importReceipt");
    return responds;
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
  console.log("re", receipts);
  const details = detailsRes.data.result;
  console.log("det", details);
  
  const items = itemsRes.data.result;
    console.log("item", items);

const products = productsRes.data;
    console.log("products", products);
const productVer = productVersionRes.data.result;
    console.log("productsVersion", productVer);


  // Gộp dữ liệu
  const fullData = receipts.map((receipt) => {
    const receiptDetails = details
      .filter(d => d.id === receipt.import_id)
      .map(detail => ({
        ...detail,
        products : products.filter((item) => item.productName === productVer.productName && detail.productVersionId === productVer.versionId),
        // productItems: items.filter(
        //   item =>
        //     item.productVersionId === detail.productVersionId &&
        //     item.import_id === receipt.import_id
        // )
      }));

    return {
      ...receipt,
      details: receiptDetails
    };
  });

  return fullData;
};