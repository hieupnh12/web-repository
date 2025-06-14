const jsonServer = require('json-server');
const server = jsonServer.create();
const router = jsonServer.router('db.json');
const middlewares = jsonServer.defaults();

server.use(middlewares);

server.get('/api/full-product-versions', (req, res) => {
  const db = router.db;
  const productVersions = db.get('productVersions').value();
  const products = db.get('products').value();
  const colors = db.get('colors').value();
  const rams = db.get('rams').value();
  const roms = db.get('roms').value();
  const productItems = db.get('productItems').value();

  // Lấy query parameters
  const idProduct = req.query.idProduct ? parseInt(req.query.idProduct) : null;
  const imeiStatus = req.query.imeiStatus || null;
  const page = parseInt(req.query._page) || 1;
  const limit = parseInt(req.query._limit) || 20;
  const searchQuery = req.query.q ? req.query.q.toLowerCase() : null;

  // Lọc productVersions theo idProduct (nếu có)
  let filteredProductVersions = idProduct
    ? productVersions.filter(pv => pv.idProduct === idProduct)
    : productVersions;

  // Gộp dữ liệu
  const groupedVersions = filteredProductVersions.reduce((acc, pv) => {
    const product = products.find(p => p.idProduct === pv.idProduct) || null;
    const color = colors.find(c => c.idColor === pv.idColor) || null;
    const ram = rams.find(r => r.idRam === pv.idRam) || null;
    const rom = roms.find(r => r.idRom === pv.idRom) || null;
    let items = productItems.filter(item => item.idProductVersion === pv.idProductVersion);

    // Lọc IMEI theo trạng thái (nếu có)
    if (imeiStatus) {
      items = items.filter(item => item.status === imeiStatus);
    }

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

  // Chuyển object thành mảng
  let result = Object.values(groupedVersions);

  // Lọc theo searchQuery (nếu có)
  if (searchQuery) {
    result = result.filter(product => product.nameProduct.toLowerCase().includes(searchQuery));
  }

  // Phân trang
  const total = result.length;
  const start = (page - 1) * limit;
  const end = start + limit;
  result = result.slice(start, end);

  // Thêm header phân trang
  res.setHeader('X-Total-Count', total);
  res.setHeader('Access-Control-Expose-Headers', 'X-Total-Count');

  // Trả về response
  res.json({
    status: 'success',
    data: result,
    pagination: {
      page,
      limit,
      total,
      totalPages: Math.ceil(total / limit)
    },
    error: null
  });
});

server.use(router);
server.listen(3004, () => {
  console.log('JSON Server is running on port 3004');
});