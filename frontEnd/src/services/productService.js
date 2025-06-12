import axios from "axios";

const BASE_URL = "http://localhost:3004";

export const getFullProducts = async ({ page = 1, limit = 10, search = '' } = {}) => {
  const params = new URLSearchParams({ _page: page, _limit: limit });
  if (search) params.append('q', search);

  const [productsRes, versionsRes, itemsRes, colorsRes, ramsRes, romsRes] = await Promise.all([
    axios.get(`${BASE_URL}/products?${params.toString()}`),
    axios.get(`${BASE_URL}/productVersions`),
    axios.get(`${BASE_URL}/productItems`),
    axios.get(`${BASE_URL}/colors`),
    axios.get(`${BASE_URL}/rams`),
    axios.get(`${BASE_URL}/roms`)
  ]);

  const total = parseInt(productsRes.headers['x-total-count'] || productsRes.data.length);

  const products = productsRes.data.map(product => {
    const versions = versionsRes.data.filter(v => v.idProduct === product.idProduct).map(v => {
      const color = colorsRes.data.find(c => c.idColor === v.idColor);
      const ram = ramsRes.data.find(r => r.idRam === v.idRam);
      const rom = romsRes.data.find(r => r.idRom === v.idRom);
      const items = itemsRes.data.filter(i => i.idProductVersion === v.idProductVersion);

      return {
        ...v,
        color: color?.nameColor || 'N/A',
        ram: ram?.ramSize || 'N/A',
        rom: rom?.romSize || 'N/A',
        imeiCount: items.length,
        imeiList: items
      };
    });

    return {
      ...product,
      versions
    };
  });

  return {
    data: products,
    pagination: {
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit)
    }
  };
};
