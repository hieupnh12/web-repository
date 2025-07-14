import React, { useState } from "react";
import Button from "../../components/ui/Button";

const IMEIScanPage = ({ productVersionId, onBack, onComplete }) => {
  const [imei, setImei] = useState("");
  const [status, setStatus] = useState("NEW");
  const [list, setList] = useState([]);

  const handleAdd = () => {
    if (!imei) return;
    setList((prev) => [...prev, { imei, status }]);
    setImei("");
    setStatus("NEW");
  };

  const handleMarkMissing = () => {
    alert("Đánh dấu IMEI thiếu sẽ được xử lý ở backend");
  };

  return (
    <div className="bg-white p-6 rounded-2xl shadow-lg">
      <h2 className="text-xl font-semibold mb-4">Quét IMEI - {productVersionId}</h2>

      <div className="flex gap-4 mb-4">
        <input
          type="text"
          value={imei}
          onChange={(e) => setImei(e.target.value)}
          placeholder="Nhập hoặc quét IMEI"
          className="border px-4 py-2 rounded-md w-full"
        />
        <select
          value={status}
          onChange={(e) => setStatus(e.target.value)}
          className="border px-4 py-2 rounded-md"
        >
          <option value="NEW">Mới</option>
          <option value="DAMAGED">Hư hỏng</option>
        </select>
        <Button onClick={handleAdd} className="bg-green-600 text-white hover:bg-green-700">Thêm</Button>
      </div>

      <table className="w-full text-sm text-left border mt-4">
        <thead className="bg-blue-50">
          <tr>
            <th className="px-4 py-2">IMEI</th>
            <th className="px-4 py-2">Trạng thái</th>
          </tr>
        </thead>
        <tbody>
          {list.map((item, idx) => (
            <tr key={idx} className="border-t">
              <td className="px-4 py-2">{item.imei}</td>
              <td className="px-4 py-2">{item.status}</td>
            </tr>
          ))}
        </tbody>
      </table>

      <div className="mt-6 flex justify-between">
        <Button onClick={onBack} className="bg-gray-300 hover:bg-gray-400 text-gray-800">Quay lại</Button>
        <div className="space-x-3">
          <Button onClick={handleMarkMissing} className="bg-yellow-500 text-white hover:bg-yellow-600">Đánh dấu thiếu</Button>
          <Button onClick={onComplete} className="bg-blue-600 text-white hover:bg-blue-700">Hoàn tất quét</Button>
        </div>
      </div>
    </div>
  );
};

export default IMEIScanPage;