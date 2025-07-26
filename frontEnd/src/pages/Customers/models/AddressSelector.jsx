import React, { useState, useEffect } from "react";
import axios from "axios";

const AddressSelector = ({ onChange }) => {
  const [provinces, setProvinces] = useState([]);
  const [districts, setDistricts] = useState([]);
  const [wards, setWards] = useState([]);

  const [selectedProvince, setSelectedProvince] = useState("");
  const [selectedDistrict, setSelectedDistrict] = useState("");
  const [selectedWard, setSelectedWard] = useState("");

  // Tải danh sách tỉnh/thành
  useEffect(() => {
    axios
      .get("https://provinces.open-api.vn/api/p/")
      .then((res) => setProvinces(res.data));
  }, []);

  // Tải danh sách quận/huyện khi chọn tỉnh/thành
  useEffect(() => {
    if (selectedProvince) {
      axios
        .get(`https://provinces.open-api.vn/api/p/${selectedProvince}?depth=2`)
        .then((res) => {
          setDistricts(res.data.districts);
          setSelectedDistrict("");
          setWards([]);
          setSelectedWard("");
        });
    }
  }, [selectedProvince]);

  // Tải danh sách phường/xã khi chọn quận/huyện
  useEffect(() => {
    if (selectedDistrict) {
      axios
        .get(`https://provinces.open-api.vn/api/d/${selectedDistrict}?depth=2`)
        .then((res) => {
          setWards(res.data.wards);
          setSelectedWard("");
        });
    }
  }, [selectedDistrict]);

  // Truyền dữ liệu địa chỉ về component cha
  useEffect(() => {
    if (!onChange) return;

    const provinceName = provinces.find((p) => p.code === +selectedProvince)?.name || "";
    const districtName = districts.find((d) => d.code === +selectedDistrict)?.name || "";
    const wardName = wards.find((w) => w.code === +selectedWard)?.name || "";

    onChange({
      province: provinceName,
      district: districtName,
      ward: wardName,
    });
  }, [selectedProvince, selectedDistrict, selectedWard]);

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
      <div>
        <label
          htmlFor="province"
          className="block text-sm font-medium text-gray-700 mb-1"
        >
          Tỉnh / Thành phố
        </label>
        <select
          id="province"
          value={selectedProvince}
          onChange={(e) => setSelectedProvince(e.target.value)}
          className="w-full p-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 text-sm"
        >
          <option value="">Chọn tỉnh / thành phố</option>
          {provinces.map((prov) => (
            <option key={prov.code} value={prov.code}>
              {prov.name}
            </option>
          ))}
        </select>
      </div>

      <div>
        <label
          htmlFor="district"
          className="block text-sm font-medium text-gray-700 mb-1"
        >
          Quận / Huyện
        </label>
        <select
          id="district"
          value={selectedDistrict}
          onChange={(e) => setSelectedDistrict(e.target.value)}
          disabled={!districts.length}
          className="w-full p-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 text-sm disabled:bg-gray-100 disabled:cursor-not-allowed"
        >
          <option value="">Chọn quận / huyện</option>
          {districts.map((dist) => (
            <option key={dist.code} value={dist.code}>
              {dist.name}
            </option>
          ))}
        </select>
      </div>

      <div>
        <label
          htmlFor="ward"
          className="block text-sm font-medium text-gray-700 mb-1"
        >
          Phường / Xã
        </label>
        <select
          id="ward"
          value={selectedWard}
          onChange={(e) => setSelectedWard(e.target.value)}
          disabled={!wards.length}
          className="w-full p-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 text-sm disabled:bg-gray-100 disabled:cursor-not-allowed"
        >
          <option value="">Chọn phường / xã</option>
          {wards.map((ward) => (
            <option key={ward.code} value={ward.code}>
              {ward.name}
            </option>
          ))}
        </select>
      </div>
    </div>
  );
};

export default AddressSelector;
