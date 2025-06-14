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
    const response = BASE_URL[GET]("productVersions?_embed=productItems");

    return response;
}

export const loadCustomers = () => {
    const response = BASE_URL[GET]("customers");

    return response;
}

export const getFullProductVersions = async ({ page = 1, limit = 20, search = '' } = {}) => {
  try {
    const url = new URL('http://localhost:3004/products');
    url.searchParams.append('_page', page);
    url.searchParams.append('_limit', limit);
    if (search) url.searchParams.append('q', search);

    const [
      productsRes,
      productVersionsRes,
      productItemsRes,
      colorsRes,
      ramsRes,
      romsRes
    ] = await Promise.all([
      fetch(url).then(res => res.json()),
      fetch('http://localhost:3004/productVersions').then(res => res.json()),
      fetch('http://localhost:3004/productItems').then(res => res.json()),
      fetch('http://localhost:3004/colors').then(res => res.json()),
      fetch('http://localhost:3004/rams').then(res => res.json()),
      fetch('http://localhost:3004/roms').then(res => res.json())
    ]);

    const totalCount = parseInt(productsRes.headers?.get('X-Total-Count') || productsRes.length);

    const groupedVersions = productVersionsRes.reduce((acc, pv) => {
      const product = productsRes.find(p => p.idProduct === pv.idProduct) || null;
      const color = colorsRes.find(c => c.idColor === pv.idColor) || null;
      const ram = ramsRes.find(r => r.idRam === pv.idRam) || null;
      const rom = romsRes.find(r => r.idRom === pv.idRom) || null;
      const items = productItemsRes.filter(item => item.idProductVersion === pv.idProductVersion);

      const imeiList = items.map(item => ({
        imei: item.imei,
        status: item.status,
        idImportReceipt: item.idImportReciept,
        idExportReceipt: item.idExportReciept
      }));

      const option = {
        idProductVersion: pv.idProductVersion,
        color: color ? color.nameColor : 'Unknown',
        ram: ram ? ram.ramSize : 'Unknown',
        rom: rom ? rom.romSize : 'Unknown',
        importPrice: pv.importPrice,
        exportPrice: pv.exportPrice,
        stockStatus: imeiList.length > 0 ? imeiList[0].status : 'out-of-stock',
        itemCount: imeiList.length,
        imeiList
      };

      if (!acc[pv.idProduct]) {
        acc[pv.idProduct] = {
          idProduct: product ? product.idProduct : null,
          nameProduct: product ? product.nameProduct : 'Unknown',
          stockQuantity: product ? product.stockQuantity : 0,
          productInfo: product,
          options: []
        };
      }
      acc[pv.idProduct].options.push(option);
      return acc;
    }, {});

    return {
      status: 'success',
      data: Object.values(groupedVersions),
      pagination: {
        page,
        limit,
        total: totalCount,
        totalPages: Math.ceil(totalCount / limit)
      },
      error: null
    };
  } catch (error) {
    return {
      status: 'error',
      data: [],
      pagination: null,
      error: error.message
    };
  }
};

