// pages/admin/staff/index.js
import React, { useEffect, useState } from "react";
import { showStaff } from "../../../services/authService";
import StaffList from "./StaffList";
import StaffForm from "./StaffForm";

export default function StaffManager() {
  const [staffList, setStaffList] = useState([]);

  const fetchData = async () => {
    try {
      const res = await showStaff();
      setStaffList(res.data.result); // đảm bảo đúng định dạng
      
    } catch (err) {
      console.error("Lỗi khi lấy dữ liệu:", err);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <div className="mb-10 flex justify-center">
        <StaffForm onStaffCreated={fetchData} />
      </div>
      <StaffList staffList={staffList} onStaffCreated={fetchData}/>
    </div>
  );
}
