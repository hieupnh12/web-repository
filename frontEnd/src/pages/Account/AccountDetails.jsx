import React, { useState, useEffect } from 'react';
import { getAllEmployees } from '../../api/employeeApi';

export default function Accdetails({ onSelect, onClose }) {
  const [search, setSearch] = useState('');
  const [staffList, setStaffList] = useState([]);

  useEffect(() => {
    getAllEmployees()
      .then((data) => setStaffList(data))
      .catch((error) => console.error('Error fetching staff:', error));
  }, []);

  const filtered = staffList.filter((staff) =>
    staff.full_name?.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
      <div className="bg-white p-6 rounded shadow-lg w-full max-w-4xl">
        <div className="flex justify-between mb-4">
          <h2 className="text-lg font-bold">Select Staff</h2>
          <button onClick={onClose} className="text-gray-500 hover:text-black">✖</button>
        </div>

        <div className="mb-3 flex gap-2">
          <input
            placeholder="Search by full name..."
            className="flex-1 border border-gray-300 px-3 py-2 rounded"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>

        <table className="w-full text-sm border text-center">
          <thead className="bg-gray-100 font-semibold">
            <tr>
              <th>ID</th>
              <th>Full Name</th>
              <th>Gender</th>
              <th>Date of Birth</th>
              <th>Phone</th>
              <th>Email</th>
              <th>Status</th>
            </tr>
          </thead>
          <tbody>
            {filtered.map((staff) => (
              <tr
                key={staff.staff_id}
                className="hover:bg-blue-50 cursor-pointer"
                onClick={() => onSelect(staff)}
              >
                <td>{staff.staff_id}</td>
                <td>{staff.full_name}</td>
                <td>{staff.gender === 1 ? 'Male' : 'Female'}</td>
                <td>{staff.birth_date}</td>
                <td>{staff.phone_number}</td>
                <td>{staff.email}</td>
                <td>{staff.status === 1 ? 'Active' : 'Inactive'}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
