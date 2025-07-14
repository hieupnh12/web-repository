import React from "react";

export default function ContractTemplate({ data }) {
  if (!data) return null;

  return (
    <div id="export-contract" style={{ padding: "20px", width: "800px" }}>
      <h2 style={{ textAlign: "center" }}>HỢP ĐỒNG MUA BÁN</h2>
      <p><strong>Mã phiếu:</strong> {data?.idExportReciept}</p>
      <p><strong>Khách hàng:</strong> {data?.nameCustomer}</p>
      <p><strong>Nhân viên:</strong> {data?.idStaff}</p>
      <p><strong>Ngày xuất:</strong> {new Date(data?.time).toLocaleString()}</p>
      <p><strong>Tổng tiền:</strong> {data?.totalAmount?.toLocaleString()} VNĐ</p>
      <br />
      <p>Hai bên đồng ý các điều khoản trong hợp đồng này...</p>
      <br />
      <div style={{ display: "flex", justifyContent: "space-between", marginTop: "50px" }}>
        <div><strong>Bên Bán</strong><br/>Ký tên:</div>
        <div><strong>Bên Mua</strong><br/>Ký tên:</div>
      </div>
    </div>
  );
}