import React from "react";

export default function ImportReceiptForm({ data }) {
  if (!data || !Array.isArray(data)) return null;

  const today = new Date();
  const formatDate = (date) =>
    `${date.getDate().toString().padStart(2, "0")}/${(date.getMonth() + 1)
      .toString()
      .padStart(2, "0")}/${date.getFullYear()}`;

  const totalAmount = data.reduce(
    (sum, item) => sum + item.quantity * item.unitPrice,
    0
  );

  function toVietnameseWords(number) {
    const ChuSo = [
      "không",
      "một",
      "hai",
      "ba",
      "bốn",
      "năm",
      "sáu",
      "bảy",
      "tám",
      "chín",
    ];
    const Tien = ["", "nghìn", "triệu", "tỷ"];

    function DocSo3ChuSo(baso) {
      let tram = Math.floor(baso / 100);
      let chuc = Math.floor((baso % 100) / 10);
      let donvi = baso % 10;
      let KetQua = "";

      if (tram !== 0) {
        KetQua += ChuSo[tram] + " trăm";
        if (chuc === 0 && donvi !== 0) KetQua += " linh";
      }
      if (chuc !== 0 && chuc !== 1) {
        KetQua += " " + ChuSo[chuc] + " mươi";
        if (donvi === 1) KetQua += " mốt";
        else if (donvi === 5) KetQua += " lăm";
        else if (donvi !== 0) KetQua += " " + ChuSo[donvi];
      } else if (chuc === 1) {
        KetQua += " mười";
        if (donvi === 1) KetQua += " một";
        else if (donvi === 5) KetQua += " lăm";
        else if (donvi !== 0) KetQua += " " + ChuSo[donvi];
      } else if (chuc === 0 && donvi !== 0) {
        KetQua += " " + ChuSo[donvi];
      }

      return KetQua;
    }

    function DocTien(number) {
      if (number === 0) return "Không đồng";

      let so = number.toString();
      let arr = [];
      while (so.length > 0) {
        let chunk = so.slice(-3);
        arr.unshift(chunk);
        so = so.slice(0, -3);
      }

      let result = "";
      for (let i = 0; i < arr.length; i++) {
        const n = parseInt(arr[i]);
        if (n !== 0) {
          result += DocSo3ChuSo(n) + " " + Tien[arr.length - 1 - i] + " ";
        } else if (i === arr.length - 1 && result === "") {
          result = ChuSo[0];
        }
      }

      result = result.trim();
      result = result.charAt(0).toUpperCase() + result.slice(1);
      return result + " đồng";
    }

    return DocTien(number);
  }

  return (
    <div className="w-[794px] mx-auto p-4 text-sm font-sans">
      {/* Header */}
      <div className="flex justify-between">
        <div>
          <p className="font-bold">
            HỘ, CÁ NHÂN KINH DOANH: ....................................
          </p>
          <p>
            Địa chỉ:
            ..................................................................................
          </p>
        </div>
        <div className="text-right text-xs">
          <p className="font-bold">Mẫu số 03 - VT</p>
          <p>(Ban hành theo Thông tư 88/2021/TT-BTC ngày 11/10/2021)</p>
        </div>
      </div>

      {/* Title */}
      <h2 className="text-center font-bold mt-6 mb-2 text-base">
        PHIẾU NHẬP KHO
      </h2>
      <p className="mb-1 text-center">Ngày {formatDate(today)}</p>
      <p className="mb-1 text-center">
        Số: .............................................
      </p>
      <p className="mb-1">
        - Họ và tên người giao hàng:
        ..................................................
      </p>
      <p className="mb-1">
        - Theo ........ số ........ ngày .... tháng .... năm .... của
        ....................
      </p>
      <p className="mb-4">
        - Địa điểm nhập kho:
        ..................................................................
      </p>

      {/* Table */}
      <table className="w-full border border-black border-collapse text-center text-xs">
        <thead>
          <tr className="bg-gray-100 font-bold">
            <th className="border border-black w-8">STT</th>
            <th className="border border-black">Tên hàng hóa (RAM/ROM/Màu)</th>
            <th className="border border-black w-16">ĐVT</th>
            <th className="border border-black w-20">Số lượng</th>
            <th className="border border-black w-28">Đơn giá</th>
            <th className="border border-black w-28">Thành tiền</th>
          </tr>
        </thead>
        <tbody>
          {data.map((item, idx) => {
            const { productVersion, quantity, unitPrice } = item;
            const name = `${productVersion.productName} - ${productVersion.ramName} / ${productVersion.romName} / ${productVersion.colorName}`;
            const total = quantity * unitPrice;

            return (
              <tr key={idx}>
                <td className="border border-black">{idx + 1}</td>
                <td className="border border-black text-left px-1">{name}</td>
                <td className="border border-black">Chiếc</td>
                <td className="border border-black">{quantity}</td>
                <td className="border border-black text-right px-1">
                  {unitPrice.toLocaleString()}
                </td>
                <td className="border border-black text-right px-1">
                  {total.toLocaleString()}
                </td>
              </tr>
            );
          })}
          <tr className="font-bold">
            <td colSpan={3} className="border border-black text-center">
              Cộng
            </td>
            <td className="border border-black">
              {data.reduce((sum, item) => sum + item.quantity, 0)}
            </td>
            <td className="border border-black"></td>
            <td className="border border-black text-right px-1">
              {totalAmount.toLocaleString()}
            </td>
          </tr>
        </tbody>
      </table>

      {/* Summary */}
      <p className="mt-4 ">
        - Tổng số tiền (viết bằng chữ): <i className="font-bold">{toVietnameseWords(totalAmount)}</i>.
      </p>
      <p className="mb-6">
        - Số chứng từ gốc kèm theo:
        ..................................................
      </p>

      <p className="text-right mt-6">
        Ngày {today.getDate()} tháng {today.getMonth() + 1} năm{" "}
        {today.getFullYear()}
      </p>
      {/* Footer */}
      <div className="grid grid-cols-4 gap-2 text-center mt-8">
        <div>
          NGƯỜI GIAO HÀNG
          <br />
          <span className="italic">(Ký, họ tên)</span>
        </div>
        <div>
          THỦ KHO
          <br />
          <span className="italic">(Ký, họ tên)</span>
        </div>
        <div>
          NGƯỜI LẬP BIỂU
          <br />
          <span className="italic">(Ký, họ tên)</span>
        </div>
        <div>
          NGƯỜI ĐẠI DIỆN HỘ KINH DOANH
          <br />
          <span className="italic">(Ký, họ tên)</span>
        </div>
      </div>
    </div>
  );
}
