import axios from 'axios';
import BASE_URL from '../api';
import { GET, POST } from "../constants/httpMethod"

export const fetchProducts = () => axios.get(`http://localhost:3004/products`);
export const fetchSuppliers = () => axios.get(`http://localhost:3004/suppliers`);
export const fetchUsers = () => axios.get(`http://localhost:3004/users`);
export const createExport = (data) => axios.post(`http://localhost:3004/exports`, data);

export const fetchFullExportReceipts = async () => {
  const [receiptRes, accountsRes, customersRes, detailsRes, itemsRes] = await Promise.all([
    axios.get(`http://localhost:3004/exportReceipts`),
    axios.get(`http://localhost:3004/accounts`),
    axios.get("http://localhost:3004/customers"),
    axios.get(`http://localhost:3004/exportReceiptDetails`),
    axios.get("http://localhost:3004/productItems")
  ]);

  const receipts = receiptRes.data;
  const accounts = accountsRes.data;
  const customers = customersRes.data;
  const details = detailsRes.data;
  const items = itemsRes.data;

  // Gộp dữ liệu
  const fullData = receipts.map((receipt) => {
    const staff = accounts.find(acc => acc.idStaff === receipt.idStaff);
    const customer = customers.find(cus => cus.idCustomer === receipt.idCustomer);
    const receiptDetails = details
      .filter(d => d.idExportReciept === receipt.idExportReciept)
      .map(detail => ({
        ...detail,
        productItems: items.filter(
          item =>
            item.idProductVersion === detail.idProductVersion &&
            item.idExportReciept === receipt.idExportReciept
        )
      }));

    return {
      ...receipt,
      staff,
      customer,
      details: receiptDetails
    };
  });

  return fullData;
};



// login function
export const login = () => {
  const response = BASE_URL[POST]("auth/login");

  return response;
}

// api load product in create receipt export
export const loadProductVerson = () => {
    const response = BASE_URL[GET]("products");

    return response;
}

export const loadCustomers = () => {
    const response = BASE_URL[GET]("customers");

    return response;
}